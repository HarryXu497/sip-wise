<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet;
		children: Snippet;
	}

	let { header, children }: Props = $props();
</script>

<div class="card">
	<div class="header">
		{@render header?.()}
	</div>
	<div class="content">
		{@render children()}
	</div>
</div>

<style lang="scss">
	.card {
		--color-card-top-left-inner: hsl(0, 0%, 50%);
		--color-card-bottom-right-inner: hsl(0, 0%, 71%);
		--color-card-shadow-outer: hsl(0, 0%, 9%);
		--color-card-header-outer: hsl(353, 81%, 25%);
		--color-card-header-inner: hsl(353, 83%, 70%);
		--card-font-size: 1.125rem;

		font-size: var(--card-font-size);

		background-color: var(--color-light-100);

		border-right: 5px var(--color-card-shadow-outer) solid;
		border-bottom: 5px var(--color-card-shadow-outer) solid;
	}

	.content {
		padding: 1rem;

		border-top: 5px var(--color-card-top-left-inner) solid;
		border-left: 5px var(--color-card-top-left-inner) solid;
		border-bottom: 5px var(--color-card-bottom-right-inner) solid;
		border-right: 5px var(--color-card-bottom-right-inner) solid;
	}

	.header {
		min-height: 2rem;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		width: 100%;
		background-color: var(--color-primary);
		box-sizing: border-box;

		border-top: 5px var(--color-card-header-outer) solid;
		border-left: 5px var(--color-card-header-outer) solid;
		border-bottom: 5px var(--color-card-header-inner) solid;
		border-right: 5px var(--color-card-header-inner) solid;
	}
</style>
