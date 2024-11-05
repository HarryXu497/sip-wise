<script lang="ts">
	import '../app.scss';
	import Navbar from '$lib/components/Navbar.svelte';
	import user from '$lib/auth/user.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { AUTHORIZED_ROUTES } from '$lib/auth/routes';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	$effect(() => {
		const unsubscribe = user.listen();

		return unsubscribe;
	});

	onMount(async () => {
		if (!user.loaded || user.value) {
			return;
		}

		const currentPathname = $page.url.pathname;

		for (const { pathname, redirectTo } of AUTHORIZED_ROUTES) {
			if (currentPathname === `${base}${pathname}`) {
				await goto(`${base}${redirectTo}`);
				break;
			}
		}
	});
</script>

<header>
	<Navbar />
</header>

{@render children()}
