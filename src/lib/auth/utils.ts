import type { FirebaseError } from "firebase/app";

function getErrorMessage(e: Error) {
	if (e.name && e.name === "FirebaseError") {
		const firebaseError = e as FirebaseError;

		if (firebaseError.code === "auth/email-already-in-use") {
			return "Email already in use";
		}

		if (firebaseError.code === "auth/invalid-credential") {
			return "Invalid credentials";
		}
	}

	return "An error occured";
}

export { getErrorMessage };