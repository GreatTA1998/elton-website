<script>
	export let compact = false;

	let email = '';
	let preference = 'digest';
	let status = 'idle'; // idle | submitting | success | error | not_configured
	let errorMessage = '';

	async function handleSubmit() {
		if (status === 'submitting') return;

		status = 'submitting';
		errorMessage = '';

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, preference })
			});

			const data = await res.json().catch(() => ({}));

			if (res.ok && data.ok) {
				status = 'success';
				email = '';
				return;
			}

			if (data.error === 'not_configured' || res.status === 503) {
				status = 'not_configured';
				errorMessage =
					data.message ||
					'Email isn’t configured yet. Set RESEND_API_KEY and SUBSCRIBE_NOTIFY_TO on the host.';
				return;
			}

			status = 'error';
			if (data.error === 'invalid_email') {
				errorMessage = 'That email doesn’t look right.';
			} else if (data.error === 'invalid_preference') {
				errorMessage = 'Choose how often you’d like to hear from me.';
			} else {
				errorMessage = 'Something went wrong. Try again in a bit.';
			}
		} catch (err) {
			status = 'error';
			errorMessage = 'Couldn’t reach the server. Check your connection and try again.';
		}
	}

	function onSubmit(event) {
		event.preventDefault();
		handleSubmit();
	}
</script>

<form class="subscribe" class:compact on:submit={onSubmit} novalidate>
	<fieldset class="prefs" disabled={status === 'submitting' || status === 'success'}>
		<legend class="sr-only">How often</legend>

		<label class="pref" class:selected={preference === 'digest'}>
			<input type="radio" bind:group={preference} value="digest" />
			<span class="pref-copy">
				<span class="pref-title">Quarterly digest</span>
				<span class="pref-help">A short note a few times a year</span>
			</span>
		</label>

		<label class="pref" class:selected={preference === 'posts'}>
			<input type="radio" bind:group={preference} value="posts" />
			<span class="pref-copy">
				<span class="pref-title">Every new post</span>
				<span class="pref-help">When something is published</span>
			</span>
		</label>
	</fieldset>

	<div class="row">
		<label class="sr-only" for="subscribe-email">Email</label>
		<input
			id="subscribe-email"
			class="email"
			type="email"
			name="email"
			autocomplete="email"
			placeholder="you@example.com"
			bind:value={email}
			required
			disabled={status === 'submitting' || status === 'success'}
		/>
		<button type="submit" disabled={status === 'submitting' || status === 'success' || !email}>
			{#if status === 'submitting'}
				Sending…
			{:else if status === 'success'}
				Subscribed
			{:else}
				Subscribe
			{/if}
		</button>
	</div>

	{#if status === 'success'}
		<p class="note ok" role="status">You’re on the list.</p>
	{:else if status === 'not_configured'}
		<p class="note warn" role="status">{errorMessage}</p>
	{:else if status === 'error'}
		<p class="note err" role="alert">{errorMessage}</p>
	{/if}
</form>

<style>
	.subscribe {
		max-width: 28rem;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.subscribe.compact {
		max-width: 32rem;
	}

	.prefs {
		margin: 0;
		padding: 0;
		border: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.pref {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 12px;
		border: 1px solid #ececec;
		border-radius: 10px;
		cursor: pointer;
		background: transparent;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.pref:hover {
		background: #f7f7f7;
		border-color: #e0e0e0;
	}

	.pref.selected {
		border-color: #d0d0d0;
		background: #fafafa;
	}

	.pref input {
		margin-top: 3px;
		accent-color: #2c2c2c;
	}

	.pref-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.pref-title {
		font-size: 0.95rem;
		font-weight: 500;
		color: #2c2c2c;
		line-height: 1.35;
	}

	.pref-help {
		font-size: 0.84rem;
		color: #6a6a6a;
		line-height: 1.4;
	}

	.row {
		display: flex;
		gap: 8px;
		align-items: stretch;
	}

	.email {
		flex: 1;
		min-width: 0;
		padding: 10px 12px;
		border: 1px solid #ececec;
		border-radius: 10px;
		font: inherit;
		font-size: 0.95rem;
		color: #2c2c2c;
		background: #fff;
		box-sizing: border-box;
	}

	.email:focus {
		outline: none;
		border-color: #c8c8c8;
	}

	.email:disabled {
		opacity: 0.7;
	}

	button {
		flex-shrink: 0;
		padding: 10px 14px;
		border: 1px solid #2c2c2c;
		border-radius: 10px;
		background: #2c2c2c;
		color: #fff;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: opacity 0.15s ease, background-color 0.15s ease;
	}

	button:hover:not(:disabled) {
		background: #1f1f1f;
	}

	button:disabled {
		opacity: 0.55;
		cursor: default;
	}

	.note {
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.45;
	}

	.note.ok {
		color: #3d6b4f;
	}

	.note.warn,
	.note.err {
		color: #8a5a3b;
	}

	.note.err {
		color: #8a3b3b;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 520px) {
		.row {
			flex-direction: column;
		}

		button {
			width: 100%;
		}
	}
</style>
