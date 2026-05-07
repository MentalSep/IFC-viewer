import { create } from "zustand";
import { authApi } from "../api/authApi";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  register: (email: string, name: string, password: string, role?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  register: async (email, name, password, role = "member") => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.register(email, name, password, role);
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, loading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, loading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  hydrate: () => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },
}));