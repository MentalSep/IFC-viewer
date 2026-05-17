import { create } from "zustand";
import { projectsApi } from "../api/projectsApi";

interface Project {
  id: string;
  name: string;
  description?: string;
  code?: string;
  ownerId: string;
  status: string;
  createdAt: string;
  documentsCount?: number;
  documents: any[];
}

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  create: (name: string, description?: string) => Promise<Project>;
  setCurrentProject: (project: Project) => void;
  loadProject: (projectId: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true });
    try {
      const projects = await projectsApi.list();
      set({ projects, error: null, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  create: async (name, description) => {
    try {
      const project = await projectsApi.create(name, description);
      set((state) => ({ projects: [project, ...state.projects] }));
      return project;
    } catch (err: any) {
      throw err;
    }
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  loadProject: async (projectId) => {
    try {
      const project = await projectsApi.get(projectId);
      set({ currentProject: project });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
