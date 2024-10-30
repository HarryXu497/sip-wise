<script lang="ts">
	import { signOutUser } from "$lib/firebase/auth";
	import user from "$lib/state/auth.svelte";;
</script>

<nav>
	<div class="logo">
		<ul>
			<li><a href="/">SIP WISE</a></li>
		</ul>
	</div>
	<div class="links">
		<ul>
			{#if user.value}
				<li><a href="/tracking">Tracking</a></li>
				<li><a href="/visualize">Visualize</a></li>
				<li><button onclick={async () => await signOutUser()}>Sign Out</button></li>
			{:else}
				<li><a href="/sign-in">Sign In</a></li>
				<li><a href="/sign-up">Sign Up</a></li>
			{/if}
		</ul>
	</div>
</nav>

<style lang="scss">
	nav {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 1rem 1.5rem;
	}


	ul, li, button {
		all: unset;
	}

	.links > ul {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
</style>