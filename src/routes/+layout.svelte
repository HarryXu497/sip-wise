<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import user from "$lib/state/auth.svelte";
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props(); 

	$effect(() => {
		user.listen();
	})
</script>

<header>
	<Navbar/>
</header>

{@render children()}