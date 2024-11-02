<script lang="ts">
	import "../app.scss"
	import Navbar from "$lib/components/Navbar.svelte";
	import user from "$lib/auth/user.svelte";
	import type { Snippet } from "svelte";
	import { page } from "$app/stores";
	import { AUTHORIZED_ROUTES } from "$lib/auth/routes";
	import { goto } from "$app/navigation";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props(); 


	$effect(() => {
		const unsubscribe = user.listen();

		return unsubscribe;
	})

	$effect(() => {
		if (!user.loaded || user.value) {
			return;
		}

		const currentPathname = $page.url.pathname;

		for (const { pathname, redirectTo } of AUTHORIZED_ROUTES) {
			if (currentPathname === pathname) {
				goto(redirectTo);
			}
		}
	})
</script>

<header>
	<Navbar/>
</header>

{@render children()}