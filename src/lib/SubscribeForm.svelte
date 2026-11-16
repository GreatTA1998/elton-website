<script>
	import { onMount } from 'svelte';
	import { messages } from './i18n.js';

	export let compact = false;

	const EMAIL_KEY = 'elton-site-subscribe-email';

	let email = '';
	/** @type {'updates' | 'digest'} */
	let mode = 'updates';
	let status = 'idle'; // idle | submitting | success | error | not_configured
	let errorMessage = '';
	/** @type {'not_configured' | 'invalid_email' | 'generic' | 'network' | ''} */
	let errorKey = '';

	$: canSubmit = status !== 'submitting' && status !== 'success' && !!email;
	$: if (errorKey === 'not_configured') {
		errorMessage = $messages.notConfigured;
	} else if (errorKey === 'invalid_email') {
		errorMessage = $messages.invalidEmail;
	} else if (errorKey === 'generic') {
		errorMessage = $messages.somethingWrong;
	} else if (errorKey === 'network') {
		errorMessage = $messages.couldntReach;
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem(EMAIL_KEY);
			if (saved) email = saved;
		} catch (e) {
			/* ignore */
		}
	});

	async function handleSubmit() {
		if (status === 'submitting') return;

		status = 'submitting';
		errorMessage = '';
		errorKey = '';

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, preference: mode })
			});

			const data = await res.json().catch(() => ({}));

			if (res.ok && data.ok) {
				status = 'success';
				try {
					localStorage.setItem(EMAIL_KEY, email);
				} catch (e) {
					/* ignore */
				}
				return;
			}

			if (data.error === 'not_configured' || res.status === 503) {
				status = 'not_configured';
				errorKey = 'not_configured';
				errorMessage = data.message || $messages.notConfigured;
				return;
			}

			status = 'error';
			if (data.error === 'invalid_email') {
				errorKey = 'invalid_email';
				errorMessage = $messages.invalidEmail;
			} else {
				errorKey = 'generic';
				errorMessage = $messages.somethingWrong;
			}
		} catch (err) {
			status = 'error';
			errorKey = 'network';
			errorMessage = $messages.couldntReach;
		}
	}

	function onSubmit(event) {
		event.preventDefault();
		handleSubmit();
	}
</script>

<form class="subscribe" class:compact on:submit={onSubmit} novalidate>
	<fieldset class="modes" disabled={status === 'submitting' || status === 'success'}>
		<legend class="sr-only">{$messages.subscribeTitle}</legend>

		<label class="mode">
			<input type="radio" name="subscribe-mode" value="updates" bind:group={mode} />
			<span>{$messages.modeUpdates}</span>
		</label>

		<label class="mode">
			<input type="radio" name="subscribe-mode" value="digest" bind:group={mode} />
			<span>{$messages.modeDigest}</span>
		</label>
	</fieldset>

	<div class="row">
		<label class="sr-only" for="subscribe-email">{$messages.email}</label>
		<input
			id="subscribe-email"
			class="email"
			type="email"
			name="email"
			autocomplete="email"
			bind:value={email}
			required
			disabled={status === 'submitting' || status === 'success'}
		/>
		<button type="submit" disabled={!canSubmit}>
			{#if status === 'submitting'}
				{$messages.sending}
			{:else if status === 'success'}
				{$messages.subscribed}
			{:else}
				{$messages.subscribe}
			{/if}
		</button>
	</div>

	{#if status === 'success'}
		<p class="note ok" role="status">{$messages.onTheList}</p>
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
		max-width: 36rem;
	}

	.modes {
		margin: 0;
		padding: 0;
		border: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.mode {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		font: inherit;
		font-size: 0.95rem;
		line-height: 1.35;
		color: #2c2c2c;
		cursor: pointer;
	}

	.mode input {
		margin: 0;
		flex-shrink: 0;
		accent-color: #2c2c2c;
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

	button[type='submit'] {
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
	}

	button[type='submit']:disabled {
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

		button[type='submit'] {
			width: 100%;
		}
	}
</style>
