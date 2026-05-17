import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
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

export const projectsApi = {
  list: async () => {
    const uid = requireUid();
    const q = query(collection(firebaseDb, "projects"), where("memberIds", "array-contains", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((projectDoc) => {
        const data = projectDoc.data();
        return {
          id: projectDoc.id,
          name: data.name ?? "Untitled Project",
          description: data.description ?? "",
          ownerId: data.ownerId ?? "",
          status: data.status ?? "active",
          createdAt: toIso(data.createdAt),
          documentsCount: data.documentsCount ?? 0,
          documents: [],
        };
      })
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  },

  create: async (name: string, description?: string) => {
    const uid = requireUid();
    const createdRef = await addDoc(collection(firebaseDb, "projects"), {
      name,
      description: description ?? "",
      ownerId: uid,
      status: "active",
      memberIds: [uid],
      documentsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const created = await getDoc(createdRef);
    const data = created.data() ?? {};
    return {
      id: created.id,
      name: data.name ?? name,
      description: data.description ?? "",
      ownerId: data.ownerId ?? uid,
      status: data.status ?? "active",
      createdAt: toIso(data.createdAt),
      documentsCount: data.documentsCount ?? 0,
      documents: [],
    };
  },

  get: async (projectId: string) => {
    const uid = requireUid();
    const projectRef = doc(firebaseDb, "projects", projectId);
    const snapshot = await getDoc(projectRef);
    if (!snapshot.exists()) throw new Error("Project not found");

    const data = snapshot.data();
    const memberIds: string[] = data.memberIds ?? [];
    if (!memberIds.includes(uid)) throw new Error("Access denied");

    return {
      id: snapshot.id,
      name: data.name ?? "Untitled Project",
      description: data.description ?? "",
      ownerId: data.ownerId ?? "",
      status: data.status ?? "active",
      createdAt: toIso(data.createdAt),
      documentsCount: data.documentsCount ?? 0,
      documents: [],
    };
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
};

