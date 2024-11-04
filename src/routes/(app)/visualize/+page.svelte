<script lang="ts">
	import Card from "$lib/components/Card.svelte";
	import { firestore } from "$lib/firebase/firebase";
	import { DRINK_TYPES, type DrinkType } from "$lib/models/DrinkCount.model";
	import user from "$lib/auth/user.svelte";
	import { Chart } from "chart.js/auto";
	import { Colors } from 'chart.js/auto';

	import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
	import { onMount, untrack } from "svelte";
	
	interface DrinkTransaction {
		type: DrinkType;
		timestamp: Timestamp;
	};
	
	type DrinkCounts = Record<DrinkType, number>;
	
	let barChart = $state<HTMLCanvasElement>();
	let chart = $state<Chart>();
	let transactions = $state<DrinkTransaction[]>([]);
	let drinkCounts = $state<DrinkCounts>({
		"water": 0,
		"juice": 0,
		"pop": 0,
	});
	let doneLoading = $state(false);

	Chart.register(Colors);

	$effect(() => {
		if (!user.value) {
			return;
		}

		const currentDate = new Date();

		const collectionRef = collection(firestore, "tracking", user.value?.uid, "drinks");

		const q = query(
			collectionRef, 
			where(
				"timestamp",
				">=",
				Timestamp.fromDate(
					new Date(
						currentDate.getFullYear(),
						currentDate.getMonth(),
						currentDate.getDate(),
					),
				),
			),
			where(
				"timestamp",
				"<",
				Timestamp.fromDate(
					new Date(
						currentDate.getFullYear(),
						currentDate.getMonth(),
						currentDate.getDate() + 1,
					),
				),
			)
		);

		onSnapshot(q, (data) => {
			if (data.empty) {
				return;
			}

			const documents = data.docs;

			transactions = documents.map(doc => (
				{
					type: doc.get("type") as DrinkType,
					timestamp: doc.get("timestamp") as Timestamp,
				} as DrinkTransaction
			));

			transactions.forEach(transaction => {
				drinkCounts[transaction.type]++;
			});
		})
	})

	onMount(() => {
		chart = new Chart(
			barChart!,
			{
				type: "bar",
				options: {
					maintainAspectRatio: false,
					responsive: true,
					plugins: {
						legend: {
							display: false
						},
						title: {
							display: true,
							text: `${user.value?.displayName!}'s Drinks`,
							color: "hsl(353, 83%, 50%)",
							font: {
								family: "'Playfair Display', 'serif'",
								size: 32,
							},
						},
					},
					scales: {
						y: {
							suggestedMin: 0,
							suggestedMax: 20,
						}
					}
				},
				data: {
					labels: DRINK_TYPES.map(str => str.charAt(0).toUpperCase() + str.slice(1)),
					datasets: [
						{
							label: "Your Drinks",
							data: [
								0,
								0,
								0,
							],
							backgroundColor: [
								'rgba(54, 162, 235, 0.5)',
								'rgba(255, 159, 64, 0.5)',
								'rgba(255, 99, 132, 0.5)',
							],
							borderColor: [
								'rgb(54, 162, 235)',
								'rgb(255, 159, 64)',
								'rgb(255, 99, 132)',
							],
							borderWidth: 2,
						},
					],
				},
			},
		);
	});

	$effect(() => {
		if (!chart) {
			return;
		}

		doneLoading = true;

		chart.data.datasets[0].data = [
			drinkCounts["water"],
			drinkCounts["juice"],
			drinkCounts["pop"],
		];

		chart.options.plugins!.title!.text = `${user.value?.displayName!}'s Drinks`,

		chart.update();
	})
</script>


<main>
	<Card>
		{#snippet header()}
			<p class="header-text">visualize.exe</p>
		{/snippet}
		<div class="container">
			<canvas bind:this={barChart}>
			
			</canvas>
		</div>
	</Card>
</main>

<style lang="scss">
	@use "../../../sass/exports.scss" as exports;

	@include exports.header-text();

	main {
		margin: 3rem auto;
		width: clamp(32rem, 50%, 64rem);
	}

	.container {
		min-height: 24rem;
	}

	canvas {
		inset: 0;
		height: 10rem;
	}

	@include exports.media-small {
		main {
			width: clamp(16rem, 80%, 64rem);
		}
	}

	@include exports.media-smallest {
		main {
			margin-top: 0;
		}
	}
</style>