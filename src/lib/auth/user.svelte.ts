import { auth } from "$lib/firebase/firebase";
import { onAuthStateChanged, type Unsubscribe, type User } from "firebase/auth";

let userState = $state<User | null>(null);
let loaded = $state(false);

const user = {
	get value() {
		return userState;
	},
	get loaded() {
		return loaded;
	},
	listen(): Unsubscribe {
		return onAuthStateChanged(auth, (u) => {
			loaded = true;
			userState = u
		});
	}
}

export default user;