import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "./client";

export async function registerWithFirebase(
  email: string,
  password: string,
  name: string,
) {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  await updateProfile(credential.user, { displayName: name });
  return credential.user.getIdToken(true);
}

export async function loginWithFirebase(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return credential.user.getIdToken(true);
}

export function logoutFirebase() {
  return signOut(firebaseAuth);
}

