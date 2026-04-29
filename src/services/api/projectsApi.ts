import apiClient from "./client";

export const projectsApi = {
  list: async () => {
    const res = await apiClient.get("/projects");
    return res.data;
  },

  create: async (name: string, description?: string) => {
    const res = await apiClient.post("/projects", { name, description });
    return res.data;
  },

  get: async (projectId: string) => {
    const res = await apiClient.get(`/projects/${projectId}`);
    return res.data;
  },

  update: async (projectId: string, data: any) => {
    const res = await apiClient.patch(`/projects/${projectId}`, data);
    return res.data;
  },
};
