import { auth } from "$lib/firebase/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

let user = $state<User | null>(null);

$effect(() => {
	onAuthStateChanged(auth, (u) => user = u);
})

export default user;