<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { DrinkCount } from '$lib/models/DrinkCount.model';
	import user from '$lib/state/auth.svelte';

	let counts = $state<DrinkCount[]>([
		{
			type: 'water',
			count: 0
		},
		{
			type: 'juice',
			count: 0
		},
		{
			type: 'pop',
			count: 0
		}
	]);

	const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' } satisfies Intl.DateTimeFormatOptions;
</script>

<main>
	<Card>
		{#snippet header()}
			<p class="header-text">tracking.exe</p>
		{/snippet}
		<div class="wrapper">
			<h1>Hello, <span class="red-highlight">{user.value?.displayName}</span>.</h1>

			<div class="hr"></div>

			<h2>Your <span class="red-highlight">Sip Stats</span> for <span class="red-highlight">{new Date().toLocaleDateString('en-us', options)}</span>:</h2>

			<section class="beverage-container">
				{#each counts as count}
					<div class="beverage-counter">
						<span class="beverage-count">{count.count}</span>
						<button onclick={() => count.count++}>Add {count.type}</button>
					</div>
				{/each}
			</section>
		</div>
	</Card>
</main>

<style lang="scss">
	@use '../../../sass/exports.scss' as exports;

	main {
		--h1-font-size: 5rem;
		--h2-font-size: 1.75rem;
		--count-font-size: 8rem;

		width: clamp(32rem, 50%, 64rem);
		margin: 0 auto;
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.hr {
		border-bottom: 2px solid var(--color-dark-100);
	}

	.header-text {
		font-size: 1.5rem;
		color: var(--color-light);
		padding: 0.5rem;
	}

	h1 {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		
		font-size: var(--h1-font-size);
		padding-bottom: 0.5rem;
		font-family: 'Playfair Display', serif;
		color: var(--color-dark);
	}

	h2 {
		font-size: var(--h2-font-size);
		padding-bottom: 0.5rem;
		color: var(--color-dark-400);
	}

	.red-highlight {
		color: var(--color-primary);
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.beverage-container {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;

		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}

	.beverage-count {
		font-size: var(--count-font-size);
		font-weight: lighter;
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 1rem;
	}

	.beverage-counter {
		button {
			@include exports.button();
			
			width: 100%;
			font-size: 1.125rem;
			text-transform: capitalize;
		}
	}

	@include exports.media-large {
		.beverage-container {
			margin-top: 0;
		}
	}
	
	@include exports.media-small {
		main {
			width: clamp(16rem, 80%, 64rem);
		}
	}
	
</style>
