<script lang="ts">
	import { enhance } from '$app/forms';
	import { signUpUser } from '$lib/firebase/auth';
	import type { SubmitFunction } from '@sveltejs/kit';

	let errorMessage = $state<string | null>(null);

	const onSubmit = (async ({ formData, cancel }) => {
		const email = formData.get('email') as string | null;
		const username = formData.get('username') as string | null;
		const password = formData.get('password') as string | null;

		if (!email || !username || !password) {
			errorMessage = 'Empty field(s)';
			cancel();
			return;
		}

		try {
			await signUpUser(email, username, password);
		} catch (e) {
			console.log(e);
		}
	}) as SubmitFunction;
</script>

<form method="POST" use:enhance={onSubmit}>
	<div class="form-control">
		<label for="email">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			autocomplete="email"
			placeholder="Email"
		/>
	</div>
	<div class="form-control">
		<label for="username">Username</label>
		<input
			type="text"
			name="username"
			id="username"
			autocomplete="username"
			placeholder="Username"
		/>
	</div>
	<div class="form-control">
		<label for="password">Password</label>
		<input
			type="password"
			name="password"
			id="password"
			autocomplete="current-password"
			placeholder="Password"
		/>
	</div>
	<button type="submit"> Submit </button>
	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{/if}
</form>
