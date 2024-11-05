<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { firestore } from '$lib/firebase/firebase';
	import type { DrinkCount } from '$lib/models/DrinkCount.model';
	import user from '$lib/auth/user.svelte';
	import {
		collection,
		addDoc,
		serverTimestamp,
		query,
		getCountFromServer,
		where,
		Timestamp
	} from 'firebase/firestore';

	let doneLoading = $state(false);

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

	// Retrieve counts
	$effect(() => {
		if (!user.value) {
			return;
		}

		Promise.all(counts.map(setCountFromFirestore)).then(() => {
			doneLoading = true;
		});
	});

	async function setCountFromFirestore(counter: DrinkCount) {
		if (!user.value?.uid) {
			return;
		}

		const collectionRef = collection(firestore, 'tracking', user.value.uid, 'drinks');
		const currentDate = new Date();

		const q = query(
			collectionRef,
			where(
				'timestamp',
				'>=',
				Timestamp.fromDate(
					new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
				)
			),
			where(
				'timestamp',
				'<',
				Timestamp.fromDate(
					new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
				)
			),
			where('type', '==', counter.type)
		);

		const serverCount = await getCountFromServer(q);

		counter.count = serverCount.data().count;
	}

	async function onAddDrink(counter: DrinkCount) {
		if (!user.value?.uid) {
			return;
		}

		counter.count++;

		const collectionRef = collection(firestore, 'tracking', user.value.uid, 'drinks');

		await addDoc(collectionRef, {
			type: counter.type,
			timestamp: serverTimestamp()
		});

		await setCountFromFirestore(counter);
	}

	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	} satisfies Intl.DateTimeFormatOptions;
</script>

<main>
	<Card>
		{#snippet header()}
			<p class="header-text">tracking.exe</p>
		{/snippet}
		<div class="wrapper">
			<h1>Hello, <span><span class="red-highlight">{user.value?.displayName}</span>.</span></h1>

			<div class="hr"></div>

			<h2>
				Your <span class="red-highlight">Sip Stats</span> for
				<span class="red-highlight">{new Date().toLocaleDateString('en-us', options)}</span>:
			</h2>

			<section class="beverage-container">
				{#each counts as count}
					<div class="beverage-counter">
						<span class="beverage-count" class:red-highlight={!doneLoading}>
							{#if doneLoading}
								{count.count}
							{:else}
								·
							{/if}
						</span>
						<button onclick={() => onAddDrink(count)}>Add {count.type}</button>
					</div>
				{/each}
			</section>
		</div>
	</Card>
</main>

<style lang="scss">
	@use '../../../sass/exports.scss' as exports;

	@include exports.header-text();

	main {
		--h1-font-size: 5rem;
		--h2-font-size: 1.75rem;
		--count-font-size: 8rem;
		--button-font-size: 1.125rem;

		width: clamp(36rem, 60%, 64rem);
		margin: 3rem auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.hr {
		border-bottom: 2px solid var(--color-dark-100);
	}

	h1 {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;

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
		gap: 1.5rem;
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
			font-size: var(--button-font-size);
			text-transform: capitalize;
		}
	}

	@include exports.media-largest() {
		main {
			--h1-font-size: 4.5rem;
			--h2-font-size: 1.5rem;
			--count-font-size: 4rem;
			--button-font-size: 1rem;
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

		.beverage-container {
			grid-template-columns: repeat(1, 1fr);
		}

		main {
			--h1-font-size: 4.5rem;
			--h2-font-size: 1.5rem;
			--count-font-size: 7rem;
			--button-font-size: 1.5rem;
		}
	}

	@include exports.media-smallest {
		main {
			margin-top: 0;
		}
	}
</style>
