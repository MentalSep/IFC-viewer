import apiClient from "./client";

export const authApi = {
  register: async (email: string, name: string, password: string) => {
    const res = await apiClient.post("/auth/register", {
      email,
      name,
      password,
    });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },
};
