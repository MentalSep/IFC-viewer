import { create } from "zustand";
import { documentsApi } from "../api/documentsApi";

interface DocumentVersion {
  id: string;
  versionNumber: number;
  fileName: string;
  fileSize: number;
  isActive: boolean;
  createdAt: string;
}

interface Document {
  id: string;
  name: string;
  fileSize: number;
  projectId: string;
  createdBy: string;
  status: string;
  createdAt: string;
  metadata: Record<string, unknown>;
  versions?: DocumentVersion[];
}

interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  versions: DocumentVersion[];
  loading: boolean;
  uploading: boolean;
  error: string | null;

  fetch: (projectId: string) => Promise<void>;
  subscribe: (projectId: string) => () => void;
  upload: (
    projectId: string,
    file: File,
    description?: string,
  ) => Promise<void>;
  selectDocument: (document: Document, projectId: string) => Promise<void>;
  activateVersion: (
    projectId: string,
    docId: string,
    versionId: string,
  ) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: [],
  selectedDocument: null,
  versions: [],
  loading: false,
  uploading: false,
  error: null,

  fetch: async (projectId) => {
    set({ loading: true });
    try {
      const documents = await documentsApi.list(projectId);
      set({ documents, error: null, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  subscribe: (projectId) =>
    documentsApi.subscribe(
      projectId,
      (documents) => {
        set({ documents, loading: false, error: null });
      },
      (error) => {
        set({ error: error.message, loading: false });
      },
    ),

  upload: async (projectId, file, description) => {
    set({ uploading: true });
    try {
      const doc = await documentsApi.upload(projectId, file, description);
      set((state) => ({
        documents: [doc, ...state.documents],
        uploading: false,
      }));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload document";
      set({ error: message, uploading: false });
      throw err;
    }
  },

  selectDocument: async (document, projectId) => {
    set({ selectedDocument: document });
    try {
      const versions = await documentsApi.getVersions(projectId, document.id);
      set({ versions });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load versions";
      set({ error: message });
    }
  },

  activateVersion: async (projectId, docId, versionId) => {
    try {
      await documentsApi.activateVersion(projectId, docId, versionId);
      // Refresh versions
      const versions = await documentsApi.getVersions(projectId, docId);
      set({ versions });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to activate version";
      set({ error: message });
    }
  },
}));
