import { create } from "zustand";
import { documentsApi } from "../api/documentsApi";

interface Document {
  id: string;
  name: string;
  fileSize: number;
  projectId: string;
  createdBy: string;
  status: string;
  createdAt: string;
  metadata: Record<string, any>;
  versions?: any[];
}

interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  versions: any[];
  loading: boolean;
  uploading: boolean;
  error: string | null;

  fetch: (projectId: string) => Promise<void>;
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

  upload: async (projectId, file, description) => {
    set({ uploading: true });
    try {
      const doc = await documentsApi.upload(projectId, file, description);
      set((state) => ({
        documents: [doc, ...state.documents],
        uploading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, uploading: false });
      throw err;
    }
  },

  selectDocument: async (document, projectId) => {
    set({ selectedDocument: document });
    try {
      const versions = await documentsApi.getVersions(projectId, document.id);
      set({ versions });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  activateVersion: async (projectId, docId, versionId) => {
    try {
      await documentsApi.activateVersion(projectId, docId, versionId);
      // Refresh versions
      const versions = await documentsApi.getVersions(projectId, docId);
      set({ versions });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
