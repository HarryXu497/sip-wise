import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

export async function signUpUser(email: string, username: string, password: string) {
	const credentials = await createUserWithEmailAndPassword(auth, email, password);

	await updateProfile(credentials.user, {
		displayName: username,
	})
}

export async function signInUser(email: string, password: string) {
	await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
	await signOut(auth);
}