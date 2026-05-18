import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "../firebase/client";

function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

function requireUid() {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid) throw new Error("You must be logged in");
  return uid;
}

function generateSessionCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function fallbackSessionCode(projectId: string) {
  return projectId.slice(0, 8).toUpperCase();
}

export const PROJECT_ROLES = [
  "Admin",
  "Architect",
  "Engineer",
  "Planner",
  "Contractor",
  "Viewer",
] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export function isProjectRole(value: string): value is ProjectRole {
  return (PROJECT_ROLES as readonly string[]).includes(value);
}

async function getCurrentUserRole(uid: string): Promise<string> {
  const userRef = doc(firebaseDb, "users", uid);
  const userSnapshot = await getDoc(userRef);
  const role = (userSnapshot.data()?.role as string | undefined)?.trim();
  return role || "Architect";
}

export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: string;
  createdAt: string;
  documentsCount: number;
  documents: unknown[];
  sessionCode: string;
  memberCount: number;
  currentUserRole: string;
}

function mapProject(
  projectDoc: { id: string; data: () => Record<string, unknown> },
  currentUid: string,
): ProjectRecord {
  const data = projectDoc.data();
  const memberIds = (data.memberIds as string[] | undefined) ?? [];
  const memberRoles = (data.memberRoles as Record<string, string> | undefined) ?? {};
  return {
    id: projectDoc.id,
    name: (data.name as string | undefined) ?? "Untitled Project",
    description: (data.description as string | undefined) ?? "",
    ownerId: (data.ownerId as string | undefined) ?? "",
    status: (data.status as string | undefined) ?? "active",
    createdAt: toIso(data.createdAt),
    documentsCount: (data.documentsCount as number | undefined) ?? 0,
    documents: [],
    sessionCode:
      (data.sessionCode as string | undefined) ?? fallbackSessionCode(projectDoc.id),
    memberCount: memberIds.length,
    currentUserRole: memberRoles[currentUid] ?? "Viewer",
  };
}

export const projectsApi = {
  list: async () => {
    const uid = requireUid();
    const q = query(collection(firebaseDb, "projects"), where("memberIds", "array-contains", uid));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs
      .map((projectDoc) => mapProject(projectDoc, uid))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    snapshot.docs.forEach((projectDoc) => {
      const data = projectDoc.data();
      if (!data.sessionCode) {
        void updateDoc(projectDoc.ref, {
          sessionCode: fallbackSessionCode(projectDoc.id),
          updatedAt: serverTimestamp(),
        });
      }
    });

    return projects;
  },

  subscribe: (
    onProjects: (projects: ProjectRecord[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe => {
    const uid = requireUid();
    const q = query(collection(firebaseDb, "projects"), where("memberIds", "array-contains", uid));
    return onSnapshot(
      q,
      (snapshot) => {
        snapshot.docs.forEach((projectDoc) => {
          const data = projectDoc.data();
          if (!data.sessionCode) {
            void updateDoc(projectDoc.ref, {
              sessionCode: fallbackSessionCode(projectDoc.id),
              updatedAt: serverTimestamp(),
            });
          }
        });

        const projects = snapshot.docs
          .map((projectDoc) => mapProject(projectDoc, uid))
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        onProjects(projects);
      },
      (err) => {
        onError?.(new Error(err.message || "Failed to subscribe to projects"));
      },
    );
  },

  create: async (name: string, description?: string) => {
    const uid = requireUid();
    const sessionCode = generateSessionCode();
    const profileRole = await getCurrentUserRole(uid);
    const ownerRole: ProjectRole = isProjectRole(profileRole) ? profileRole : "Admin";
    const createdRef = await addDoc(collection(firebaseDb, "projects"), {
      name,
      description: description ?? "",
      ownerId: uid,
      status: "active",
      memberIds: [uid],
      memberRoles: {
        [uid]: ownerRole,
      },
      sessionCode,
      documentsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const created = await getDoc(createdRef);
    return mapProject({ id: created.id, data: () => created.data() ?? {} }, uid);
  },

  get: async (projectId: string) => {
    const uid = requireUid();
    const projectRef = doc(firebaseDb, "projects", projectId);
    const snapshot = await getDoc(projectRef);
    if (!snapshot.exists()) throw new Error("Project not found");

    const data = snapshot.data() as Record<string, unknown>;
    const memberIds: string[] = (data.memberIds as string[] | undefined) ?? [];
    if (!memberIds.includes(uid)) throw new Error("Access denied");

    return mapProject({ id: snapshot.id, data: () => data }, uid);
  },

  update: async (projectId: string, data: Record<string, unknown>) => {
    const uid = requireUid();
    const projectRef = doc(firebaseDb, "projects", projectId);
    const existing = await getDoc(projectRef);
    if (!existing.exists()) throw new Error("Project not found");
    const memberIds: string[] = existing.data().memberIds ?? [];
    if (!memberIds.includes(uid)) throw new Error("Access denied");

    await updateDoc(projectRef, { ...data, updatedAt: serverTimestamp() });
    return projectsApi.get(projectId);
  },

  joinBySessionCode: async (sessionCode: string, invitedRole?: ProjectRole) => {
    const normalizedCode = sessionCode.trim().toUpperCase();
    if (!normalizedCode) {
      throw new Error("Session code is required");
    }

    const uid = requireUid();
    const profileRole = await getCurrentUserRole(uid);
    const assignedRole: ProjectRole =
      invitedRole ?? (isProjectRole(profileRole) ? profileRole : "Viewer");
    const q = query(
      collection(firebaseDb, "projects"),
      where("sessionCode", "==", normalizedCode),
      limit(1),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      throw new Error("Session not found");
    }

    const projectDoc = snapshot.docs[0];
    await updateDoc(projectDoc.ref, {
      memberIds: arrayUnion(uid),
      [`memberRoles.${uid}`]: assignedRole,
      updatedAt: serverTimestamp(),
    });

    await setDoc(
      doc(firebaseDb, "users", uid),
      { role: assignedRole, updatedAt: serverTimestamp() },
      { merge: true },
    );

    const refreshed = await getDoc(projectDoc.ref);
    return mapProject({ id: refreshed.id, data: () => refreshed.data() ?? {} }, uid);
  },

  deleteById: async (projectId: string) => {
    const uid = requireUid();
    const userRole = await getCurrentUserRole(uid);
    if (userRole.toLowerCase() !== "admin") {
      throw new Error("Only admin can delete sessions");
    }
    const projectRef = doc(firebaseDb, "projects", projectId);
    const snapshot = await getDoc(projectRef);
    if (!snapshot.exists()) {
      throw new Error("Project not found");
    }
    await deleteDoc(projectRef);
  },
};

