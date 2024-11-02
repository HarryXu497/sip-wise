<script lang="ts">
	import { signOutUser } from '$lib/firebase/auth';
	import user from '$lib/auth/user.svelte';

	let mousedownState = $state<boolean[]>(Array(4).fill(false));
</script>

<nav>
	<div class="logo">
		<ul>
			<li><a href="/"><span class="primary-highlight">SIP</span>.<span class="primary-highlight">WISE</span></a></li>
		</ul>
	</div>
	<div class="links" class:logged-in={user.value}>
		<ul>
			{#if user.value}
				<li>
					<a
						href="/tracking"
					>
						Tracking
					</a>
				</li>
				<li>
					<a
						href="/visualize"
						class:pressed={mousedownState[0]}
						onmousedown={() => (mousedownState[0] = true)}
						onmouseup={() => (mousedownState[0] = false)}
					>
						Visualize
					</a>
				</li>
				<li>
					<button
						onclick={async () => await signOutUser()}
						class:pressed={mousedownState[1]}
						onmousedown={() => (mousedownState[1] = true)}
						onmouseup={() => (mousedownState[1] = false)}
					>
						Sign Out
					</button>
				</li>
			{:else}
				<li>
					<a
						href="/sign-in"
						class:pressed={mousedownState[2]}
						onmousedown={() => (mousedownState[2] = true)}
						onmouseup={() => (mousedownState[2] = false)}
					>
						Sign In
					</a>
				</li>
				<li>
					<a
						href="/sign-up"
						class:pressed={mousedownState[3]}
						onmousedown={() => (mousedownState[3] = true)}
						onmouseup={() => (mousedownState[3] = false)}
					>
						Sign Up
					</a>
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

	button, a {
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
		font-family: "Jetbrains Mono", monospace;
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

		.links a, button {
			font-size: 1.125rem;
			padding: 0.5rem 0.75rem;
		}
	}

	@include exports.media-smallest {
		nav {
			gap: 1rem;
		}

		.links a, button {
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
