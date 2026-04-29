import apiClient from "./client";

export const documentsApi = {
  list: async (projectId: string) => {
    const res = await apiClient.get(`/projects/${projectId}/documents`);
    return res.data;
  },

  upload: async (projectId: string, file: File, description?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (description) formData.append("description", description);

    const res = await apiClient.post(
      `/projects/${projectId}/documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  getVersions: async (projectId: string, docId: string) => {
    const res = await apiClient.get(
      `/projects/${projectId}/documents/${docId}/versions`,
    );
    return res.data;
  },

  activateVersion: async (
    projectId: string,
    docId: string,
    versionId: string,
  ) => {
    const res = await apiClient.patch(
      `/projects/${projectId}/documents/${docId}/versions/${versionId}/activate`,
    );
    return res.data;
  },

  download: (projectId: string, docId: string) => {
    return `${import.meta.env.VITE_API_URL}/projects/${projectId}/documents/${docId}/download`;
  },
};
