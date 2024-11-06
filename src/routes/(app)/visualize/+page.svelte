<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { firestore } from '$lib/firebase/firebase';
	import { DRINK_TYPES, type DrinkType } from '$lib/models/DrinkCount.model';
	import user from '$lib/auth/user.svelte';
	import { Chart } from 'chart.js/auto';
	import { Colors } from 'chart.js/auto';

	import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
	import { onMount } from 'svelte';

	interface DrinkTransaction {
		type: DrinkType;
		timestamp: Timestamp;
	}

	type DrinkCounts = Record<DrinkType, number>;

	let barChartElement = $state<HTMLCanvasElement>();
	let stackedBarChartElement = $state<HTMLCanvasElement>();
	let barChart = $state<Chart>();
	let stackedBarChart = $state<Chart>();
	let transactions = $state<DrinkTransaction[]>([]);
	let drinkCounts = $state<DrinkCounts>({
		water: 0,
		juice: 0,
		pop: 0
	});
	const formatter =  new Intl.DateTimeFormat('en-CA', {
		dateStyle: 'medium',
		timeStyle: 'medium',
	});

	let transactionsAsDatasets = $derived.by(() => {
		return transactions.map(transaction => {
			const [backgroundColor, borderColor] = getColor(transaction.type);

			return {
				label: formatter.format(transaction.timestamp.toDate()),
				data: [1],
				backgroundColor: [
					backgroundColor
				],
				borderColor: [
					borderColor,
				],
				borderWidth: 2,
			}
		})
	})

	Chart.register(Colors);

	function getColor(color: DrinkType): [string, string] {
		if (color === 'water') {
			return ["rgba(54, 162, 235, 0.5)", 'rgb(54, 162, 235)'];
		} else if (color === 'juice') {
			return ["rgba(255, 159, 64, 0.5)", "rgb(255, 159, 64)"];
		} else if (color === 'pop') {
			return ["rgba(255, 99, 132, 0.5)", "rgb(255, 99, 132)"];
		} else {
			throw Error("Invalid DrinkType.");
		}
	}

	$effect(() => {
		if (!user.value) {
			return;
		}

		const currentDate = new Date();

		const collectionRef = collection(firestore, 'tracking', user.value?.uid, 'drinks');

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
			orderBy("timestamp", "asc"),
		);

		onSnapshot(q, (data) => {
			if (data.empty) {
				return;
			}

			const documents = data.docs;

			transactions = documents.map(
				(doc) =>
					({
						type: doc.get('type') as DrinkType,
						timestamp: doc.get('timestamp') as Timestamp
					}) as DrinkTransaction
			);

			transactions.forEach((transaction) => {
				drinkCounts[transaction.type]++;
			});
		});
	});

	onMount(() => {
		barChart = new Chart(barChartElement!, {
			type: 'bar',
			options: {
				maintainAspectRatio: false,
				responsive: true,
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: `Your Drinks`,
						color: 'hsl(353, 83%, 50%)',
						font: {
							family: "'Playfair Display', 'serif'",
							size: 32,
						},
					}
				},
				scales: {
					y: {
						suggestedMin: 0,
						suggestedMax: 20,
					}
				}
			},
			data: {
				labels: DRINK_TYPES.map((str) => str.charAt(0).toUpperCase() + str.slice(1)),
				datasets: [
					{
						label: 'Your Drinks',
						data: [0, 0, 0],
						backgroundColor: [
							'rgba(54, 162, 235, 0.5)',
							'rgba(255, 159, 64, 0.5)',
							'rgba(255, 99, 132, 0.5)'
						],
						borderColor: ['rgb(54, 162, 235)', 'rgb(255, 159, 64)', 'rgb(255, 99, 132)'],
						borderWidth: 2,
					}
				]
			}
		});

		stackedBarChart = new Chart(stackedBarChartElement!, {
			type: 'bar',
			options: {
				maintainAspectRatio: false,
				responsive: true,
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: ["Your Drinks", "Ordered"],
						color: 'hsl(353, 83%, 50%)',
						font: {
							family: "'Playfair Display', 'serif'",
							size: 32
						}
					},
				},
				scales: {
					y: {
						suggestedMin: 0,
						suggestedMax: 20,
						stacked: true,
					},
					x: {
						stacked: true,
					}
				}
			},
			data: {
				labels: ["Your Drinks"],
				datasets: transactions.map(transaction => {
					const [backgroundColor, borderColor] = getColor(transaction.type);

					return {
						label: transaction.timestamp.toDate().toDateString(),
						data: [1],
						backgroundColor: [
							backgroundColor
						],
						borderColor: [
							borderColor,
						],
						borderWidth: 2,
					}
				}),
			}
		});
	});

	$effect(() => {
		if (!barChart) {
			return;
		}

		barChart.data.datasets[0].data = [drinkCounts['water'], drinkCounts['juice'], drinkCounts['pop']];
		
		barChart.update();
	});

	$effect(() => {
		if (!stackedBarChart) {
			return;
		}

		stackedBarChart.data.datasets = transactionsAsDatasets;
		
		stackedBarChart.update();
	});
</script>

<main>
	<Card>
		{#snippet header()}
			<p class="header-text">visualize.exe</p>
		{/snippet}
		<div class="container-bar">
			<canvas bind:this={barChartElement}> </canvas>
		</div>
	</Card>
	<Card>
		{#snippet header()}
			<p class="header-text">visualize.exe</p>
		{/snippet}
		<div class="container-stacked">
			<canvas bind:this={stackedBarChartElement}> </canvas>
		</div>
	</Card>
</main>

<style lang="scss">
	@use '../../../sass/exports.scss' as exports;

	@include exports.header-text();

	main {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin: 3rem auto;
		width: clamp(32rem, 50%, 64rem);
	}

	.container-bar {
		min-height: 24rem;
	}

	.container-stacked {
		min-height: 32rem;
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
