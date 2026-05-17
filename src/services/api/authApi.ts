import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "../firebase/client";
import { loginWithFirebase, registerWithFirebase } from "../firebase/auth";

interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  access_token: string;
}

async function upsertProfile(nameHint?: string): Promise<AuthResult> {
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser || !currentUser.email) {
    throw new Error("User is not authenticated");
  }

  const userRef = doc(firebaseDb, "users", currentUser.uid);
  const existing = await getDoc(userRef);

  const existingRole = existing.data()?.role;
  const profileName =
    nameHint?.trim() || currentUser.displayName || existing.data()?.name || "User";
  const role = existingRole || "Architect";

  await setDoc(
    userRef,
    {
      email: currentUser.email,
      name: profileName,
      role,
      updatedAt: serverTimestamp(),
      createdAt: existing.exists() ? existing.data()?.createdAt : serverTimestamp(),
    },
    { merge: true },
  );

  const access_token = await currentUser.getIdToken(true);
  return {
    user: {
      id: currentUser.uid,
      email: currentUser.email,
      name: profileName,
      role,
    },
    access_token,
  };
}

export const authApi = {
  register: async (email: string, name: string, password: string) => {
    await registerWithFirebase(email, password, name);
    return upsertProfile(name);
  },

  login: async (email: string, password: string) => {
    await loginWithFirebase(email, password);
    return upsertProfile();
  },

  firebaseLogin: async (_idToken: string, name?: string) => {
    return upsertProfile(name);
  },
};

