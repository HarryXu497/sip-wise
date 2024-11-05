<script lang="ts">
	import { signOutUser } from '$lib/firebase/auth';
	import user from '$lib/auth/user.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	let mousedownState = $state<boolean[]>(Array(4).fill(false));

	async function onSignOut() {
		await signOutUser();

		await goto(`${base}/`);
	}
</script>

<nav>
	<div class="logo">
		<ul>
			<li>
				<a href="{base}/"
					><span class="primary-highlight">SIP</span>.<span class="primary-highlight">WISE</span></a
				>
			</li>
		</ul>
	</div>
	<div class="links" class:logged-in={user.value}>
		<ul>
			{#if user.value}
				<li>
					<a href="{base}/tracking"> Tracking </a>
				</li>
				<li>
					<a href="{base}/visualize"> Visualize </a>
				</li>
				<li>
					<button onclick={onSignOut}> Sign Out </button>
				</li>
			{:else}
				<li>
					<a href="{base}/sign-in"> Sign In </a>
				</li>
				<li>
					<a href="{base}/sign-up"> Sign Up </a>
				</li>
			{/if}
		</ul>
	</div>
</nav>

<style lang="scss">
	@use '../../sass/exports' as exports;

	nav {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
	}

	.primary-highlight {
		color: var(--color-primary);
	}

	ul,
	li,
	button,
	a {
		all: unset;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	button,
	a {
		width: 100%;
	}

	li {
		display: flex;
		flex-direction: row;
	}

	.links a,
	button {
		@include exports.button;
	}

	.links > ul {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.logo a {
		font-weight: bold;
		font-size: 2rem;
		font-family: 'Jetbrains Mono', monospace;
		cursor: pointer;
	}

	@include exports.media-small {
		nav {
			padding: 2rem;
			flex-direction: column;
			gap: 1.5rem;
		}

		.logo a {
			font-size: 3rem;
		}

		.links a,
		button {
			font-size: 1.125rem;
			padding: 0.5rem 0.75rem;
		}
	}

	@include exports.media-smallest {
		nav {
			gap: 1rem;
		}

		.links a,
		button {
			font-size: 1rem;
		}

		.links > ul {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}

		.links.logged-in > ul li:last-of-type {
			grid-column: 1 / -1;
		}
	}
</style>
