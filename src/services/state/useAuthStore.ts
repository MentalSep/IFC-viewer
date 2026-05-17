import { create } from "zustand";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { authApi } from "../api/authApi";
import {
  loginWithFirebase,
  logoutFirebase,
  registerWithFirebase,
} from "../firebase/auth";
import { firebaseAuth } from "../firebase/client";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "user";

function resolveErrorMessage(err: unknown, fallback: string) {
  if (err && typeof err === "object" && "message" in err) {
    const message = (err as { message?: string }).message;
    if (message) return message;
  }
  return fallback;
}

function parseStoredUser(value: string | null): User | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

function persistSession(token: string, user: User) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

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
  initialized: boolean;
  error: string | null;

  register: (email: string, name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,
  error: null,

  register: async (email, name, password) => {
    set({ loading: true, error: null });
    try {
      const idToken = await registerWithFirebase(email, password, name);
      const data = await authApi.firebaseLogin(idToken, name);
      persistSession(data.access_token, data.user);
      set({ user: data.user, token: data.access_token, loading: false });
    } catch (err: unknown) {
      const message = resolveErrorMessage(err, "Registration failed");
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const idToken = await loginWithFirebase(email, password);
      const data = await authApi.firebaseLogin(idToken);
      persistSession(data.access_token, data.user);
      set({ user: data.user, token: data.access_token, loading: false });
    } catch (err: unknown) {
      const message = resolveErrorMessage(err, "Login failed");
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    void logoutFirebase();
    clearSession();
    set({ user: null, token: null });
  },

  initializeAuth: () =>
    onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        clearSession();
        set({ user: null, token: null, initialized: true, loading: false });
        return;
      }

      try {
        const idToken = await firebaseUser.getIdToken();
        const parsedUser = parseStoredUser(localStorage.getItem(AUTH_USER_KEY));
        if (parsedUser) {
          set({
            user: parsedUser,
            token: idToken,
            initialized: true,
            loading: false,
            error: null,
          });
          persistSession(idToken, parsedUser);
          return;
        }

        const data = await authApi.firebaseLogin(idToken, firebaseUser.displayName ?? undefined);
        persistSession(data.access_token, data.user);
        set({
          user: data.user,
          token: data.access_token,
          initialized: true,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        const message = resolveErrorMessage(err, "Failed to restore session");
        set({ error: message, initialized: true, loading: false });
      }
    }),
}));
