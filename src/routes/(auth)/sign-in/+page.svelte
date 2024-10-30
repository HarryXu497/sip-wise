<script lang="ts">
	import { getErrorMessage } from '$lib/authUtils';
	import { signInUser } from '$lib/firebase/auth';
	import { redirect } from '@sveltejs/kit';

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

		return redirect(302, '/tracking');
	};
</script>

<form method="POST" onsubmit={onSubmit}>
	<div class="form-control">
		<label for="email">Email</label>
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
		<label for="password">Password</label>
		<input
			type="password"
			name="password"
			id="password"
			autocomplete="current-password"
			placeholder="Password"
			bind:value={password}
		/>
	</div>
	<button type="submit">Submit</button>
	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{/if}
</form>
