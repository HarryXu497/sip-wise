import { auth } from "$lib/firebase/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

let userState = $state<User | null>(null);

const user = {
	get value() {
		return userState;
	},
	listen() {
		onAuthStateChanged(auth, (u) => userState = u);
	}
}

export default user;