<script lang="ts">
	import type { DrinkCount } from "$lib/models/DrinkCount.model";
	import user from "$lib/state/auth.svelte";

	let counts = $state<DrinkCount[]>([
		{
			type: "water",
			count: 0,
		},
		{
			type: "juice",
			count: 0,
		},
		{
			type: "pop",
			count: 0,
		}
	]); 
</script>

<main>
	<h1>Hello, {user.value?.displayName}</h1>

</main>

