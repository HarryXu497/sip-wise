import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth, firestore } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export async function signUpUser(email: string, username: string, password: string) {
	const credentials = await createUserWithEmailAndPassword(auth, email, password);

	await updateProfile(credentials.user, {
		displayName: username,
	})
}

export async function signInUser(email: string, password: string) {
	const credentials = await signInWithEmailAndPassword(auth, email, password);

	const docRef = doc(firestore, "tracking", credentials.user.uid);

	// Denormalize data to reduce queries
	await setDoc(docRef, {
		waterCount: 0,
		juiceCount: 0,
		popCount: 0,
	});
}

export async function signOutUser() {
	await signOut(auth);
}