<script lang="ts">
	import { goto } from '$app/navigation';
	import { getErrorMessage } from '$lib/auth/utils';
	import Card from '$lib/components/Card.svelte';
	import { signUpUser } from '$lib/firebase/auth';
	import { redirect } from '@sveltejs/kit';

	let errorMessage = $state<string | null>(null);
	
	let email = $state<string>("");
	let username = $state<string>("");
	let password = $state<string>("");

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (!email || !username || !password) {
			errorMessage = 'Empty field(s)';
			return;
		}

		try {
			await signUpUser(email, username, password);
		} catch (e: unknown) {
			errorMessage = getErrorMessage(e as Error);
			return;
		}

		await goto("/tracking");
	}

</script>

<main>
	<Card>
		{#snippet header()}
			<p class="header-text">sign_up.exe</p>
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
				<label for="username">Username:</label>
				<input
					type="text"
					name="username"
					id="username"
					autocomplete="off"
					placeholder="Username"
					bind:value={username}
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