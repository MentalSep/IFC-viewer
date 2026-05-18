import { create } from "zustand";
import {
  projectsApi,
  type ProjectRecord,
  type ProjectRole,
} from "../api/projectsApi";

type Project = ProjectRecord;

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  subscribe: () => () => void;
  create: (name: string, description?: string) => Promise<Project>;
  joinBySessionCode: (sessionCode: string, role?: ProjectRole) => Promise<Project>;
  deleteById: (projectId: string) => Promise<void>;
  setCurrentProject: (project: Project) => void;
  loadProject: (projectId: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
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

  subscribe: () =>
    projectsApi.subscribe(
      (projects) => {
        set({ projects, loading: false, error: null });
      },
      (error) => {
        set({ error: error.message, loading: false });
      },
    ),

  create: async (name, description) => {
    try {
      const project = await projectsApi.create(name, description);
      set((state) => ({ projects: [project, ...state.projects] }));
      return project;
    } catch (err: any) {
      throw err;
    }
  },

  joinBySessionCode: async (sessionCode, role) => {
    set({ loading: true, error: null });
    try {
      const project = await projectsApi.joinBySessionCode(sessionCode, role);
      set((state) => {
        const exists = state.projects.some((item) => item.id === project.id);
        return {
          projects: exists
            ? state.projects.map((item) => (item.id === project.id ? project : item))
            : [project, ...state.projects],
          loading: false,
        };
      });
      return project;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteById: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await projectsApi.deleteById(projectId);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
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
