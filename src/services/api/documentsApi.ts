import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
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

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^\w.-]/g, "_");
}

const LOCAL_FILES_DB = "ifc-viewer-local-files";
const LOCAL_FILES_STORE = "files";

function openLocalFilesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_FILES_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(LOCAL_FILES_STORE)) {
        db.createObjectStore(LOCAL_FILES_STORE, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Failed to open local files database"));
  });
}

function putLocalFile(key: string, blob: Blob): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await openLocalFilesDb();
    const tx = db.transaction(LOCAL_FILES_STORE, "readwrite");
    const store = tx.objectStore(LOCAL_FILES_STORE);
    store.put({ key, blob, createdAt: Date.now() });
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("Failed to store file locally"));
    };
  });
}

function getLocalFile(key: string): Promise<Blob | null> {
  return new Promise(async (resolve, reject) => {
    const db = await openLocalFilesDb();
    const tx = db.transaction(LOCAL_FILES_STORE, "readonly");
    const store = tx.objectStore(LOCAL_FILES_STORE);
    const request = store.get(key);
    request.onsuccess = () => {
      db.close();
      const result = request.result as { blob?: Blob } | undefined;
      resolve(result?.blob ?? null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Failed to read local file"));
    };
  });
}

async function getDocumentRef(projectId: string, fileName: string) {
  const docsQuery = query(
    collection(firebaseDb, "projects", projectId, "documents"),
    where("name", "==", fileName),
    limit(1),
  );
  const docsSnap = await getDocs(docsQuery);
  if (!docsSnap.empty) {
    return docsSnap.docs[0].ref;
  }

  return addDoc(collection(firebaseDb, "projects", projectId, "documents"), {
    name: fileName,
    fileSize: 0,
    projectId,
    createdBy: requireUid(),
    status: "active",
    metadata: {},
    currentVersionNumber: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export const documentsApi = {
  list: async (projectId: string) => {
    const docsQuery = query(
      collection(firebaseDb, "projects", projectId, "documents"),
      orderBy("updatedAt", "desc"),
    );
    const docsSnap = await getDocs(docsQuery);
    return docsSnap.docs.map((documentDoc) => {
      const data = documentDoc.data();
      return {
        id: documentDoc.id,
        name: data.name ?? "Unnamed document",
        fileSize: data.fileSize ?? 0,
        projectId,
        createdBy: data.createdBy ?? "",
        status: data.status ?? "active",
        createdAt: toIso(data.createdAt),
        metadata: data.metadata ?? {},
      };
    });
  },

  upload: async (projectId: string, file: File, description?: string) => {
    const uid = requireUid();
    const documentRef = await getDocumentRef(projectId, file.name);
    const currentDoc = await getDoc(documentRef);
    const currentVersion = currentDoc.data()?.currentVersionNumber ?? 0;
    const versionNumber = currentVersion + 1;

    const safeFileName = sanitizeFileName(file.name);
    const localFileKey = `projects/${projectId}/documents/${documentRef.id}/v${versionNumber}-${Date.now()}-${safeFileName}`;
    await putLocalFile(localFileKey, file);

    const versionsRef = collection(
      firebaseDb,
      "projects",
      projectId,
      "documents",
      documentRef.id,
      "versions",
    );
    const previousActiveId = currentDoc.data()?.activeVersionId as string | undefined;
    const createdVersion = await addDoc(versionsRef, {
      versionNumber,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      localFileKey,
      changelog: description ?? "",
      createdBy: uid,
      isActive: true,
      createdAt: serverTimestamp(),
    });

    const batch = writeBatch(firebaseDb);
    if (previousActiveId) {
      const prevRef = doc(versionsRef, previousActiveId);
      batch.update(prevRef, { isActive: false });
    }
    batch.update(documentRef, {
      fileSize: file.size,
      metadata: {
        ...(currentDoc.data()?.metadata ?? {}),
        mimeType: file.type || "application/octet-stream",
      },
      currentVersionNumber: versionNumber,
      activeVersionId: createdVersion.id,
      status: "active",
      updatedAt: serverTimestamp(),
    });

    const projectRef = doc(firebaseDb, "projects", projectId);
    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists()) {
      const currentCount = projectSnap.data().documentsCount ?? 0;
      if (!currentDoc.exists()) {
        batch.update(projectRef, {
          documentsCount: currentCount + 1,
          updatedAt: serverTimestamp(),
        });
      }
    }

    await batch.commit();

    return {
      id: documentRef.id,
      name: file.name,
      fileSize: file.size,
      projectId,
      createdBy: uid,
      status: "active",
      createdAt: toIso(currentDoc.data()?.createdAt),
      metadata: { mimeType: file.type || "application/octet-stream" },
    };
  },

  getVersions: async (projectId: string, docId: string) => {
    const versionsQuery = query(
      collection(firebaseDb, "projects", projectId, "documents", docId, "versions"),
      orderBy("versionNumber", "desc"),
    );
    const snapshot = await getDocs(versionsQuery);
    return snapshot.docs.map((versionDoc) => {
      const data = versionDoc.data();
      return {
        id: versionDoc.id,
        versionNumber: data.versionNumber ?? 1,
        fileName: data.fileName ?? "",
        fileSize: data.fileSize ?? 0,
        isActive: Boolean(data.isActive),
        createdAt: toIso(data.createdAt),
      };
    });
  },

  activateVersion: async (projectId: string, docId: string, versionId: string) => {
    const versionsRef = collection(
      firebaseDb,
      "projects",
      projectId,
      "documents",
      docId,
      "versions",
    );
    const allVersions = await getDocs(versionsRef);
    const selectedVersion = allVersions.docs.find((item) => item.id === versionId);
    if (!selectedVersion) {
      throw new Error("Version not found");
    }

    const batch = writeBatch(firebaseDb);
    allVersions.docs.forEach((item) => {
      batch.update(item.ref, { isActive: item.id === versionId });
    });
    batch.update(doc(firebaseDb, "projects", projectId, "documents", docId), {
      activeVersionId: versionId,
      currentVersionNumber: selectedVersion.data().versionNumber ?? 1,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
    return { success: true };
  },

  download: async (projectId: string, docId: string) => {
    const documentSnap = await getDoc(
      doc(firebaseDb, "projects", projectId, "documents", docId),
    );
    if (!documentSnap.exists()) throw new Error("Document not found");
    const activeVersionId = documentSnap.data().activeVersionId;
    if (!activeVersionId) throw new Error("No active version available");

    const activeVersionSnap = await getDoc(
      doc(
        firebaseDb,
        "projects",
        projectId,
        "documents",
        docId,
        "versions",
        activeVersionId,
      ),
    );
    if (!activeVersionSnap.exists()) throw new Error("Active version not found");

    const localFileKey = activeVersionSnap.data().localFileKey as
      | string
      | undefined;
    if (localFileKey) {
      const localBlob = await getLocalFile(localFileKey);
      if (!localBlob) {
        throw new Error(
          "This version is stored locally on another browser/device. Re-upload it from this device.",
        );
      }
      return URL.createObjectURL(localBlob);
    }

    const path = activeVersionSnap.data().storagePath as string | undefined;
    const url = activeVersionSnap.data().downloadUrl as string | undefined;
    if (url) return url;
    if (!path) throw new Error("Version file path not found");
    throw new Error(
      "Cloud file storage is not configured for this version on the current plan.",
    );
  },
};

