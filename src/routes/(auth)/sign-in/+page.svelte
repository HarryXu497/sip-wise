<script lang="ts">
	import { goto } from '$app/navigation';
	import { getErrorMessage } from '$lib/auth/utils';
	import Card from '$lib/components/Card.svelte';
	import { signInUser } from '$lib/firebase/auth';

	let errorMessage = $state<string | null>(null);
	let email = $state<string>("");
	let password = $state<string>("");

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (!email || !password) {
			errorMessage = 'Empty field(s)';
			return;
		}

		try {
			await signInUser(email, password);
		} catch (e: unknown) {
			errorMessage = getErrorMessage(e as Error);
			return;
		}

		await goto('/tracking');
	};
</script>

<main>
	<Card>
		{#snippet header()}
			<p class="header-text">sign_in.exe</p>
		{/snippet}
		<form method="POST" onsubmit={onSubmit}>
			<div class="form-control">
				<label for="email">Email:</label>
				<input
					type="email"
					name="email"
					id="email"
					autocomplete="email"
					placeholder="Email"
					bind:value={email}
				/>
			</div>
			<div class="form-control">
				<label for="password">Password:</label>
				<input
					type="password"
					name="password"
					id="password"
					autocomplete="current-password"
					placeholder="Password"
					bind:value={password}
				/>
			</div>
			<button type="submit" class="submit">Submit</button>
			{#if errorMessage}
				<p class="error-message">{errorMessage}</p>
			{/if}
		</form>
	</Card>
</main>

<style lang="scss">
	@use "../../../sass/exports" as exports;

	@include exports.auth-form;
</style>
