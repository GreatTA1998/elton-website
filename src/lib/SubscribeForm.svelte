<script>
	export let compact = false;

	const APPS = [
		{ id: 'actions.life', label: 'actions.life', src: '/actions-life-logo.png' },
		{ id: 'blackboards.io', label: 'blackboards.io', src: '/explanations-logo.png' },
		{ id: 'zetteldraw', label: 'zetteldraw', src: '/zetteldraw-logo.png' },
		{ id: 'zen-message', label: 'zen-message', src: '/zen-message-logo.jpg' }
	];

	let email = '';
	let essays = false;
	let music = false;
	/** @type {Record<string, boolean>} */
	let apps = {
		'actions.life': false,
		'blackboards.io': false,
		zetteldraw: false,
		'zen-message': false
	};
	let status = 'idle'; // idle | submitting | success | error | not_configured
	let errorMessage = '';

	$: interests = [
		...(essays ? ['essays'] : []),
		...(music ? ['music'] : []),
		...APPS.map((app) => app.id).filter((id) => apps[id])
	];
	$: hasInterest = interests.length > 0;

	function toggleTopic(topic) {
		if (topic === 'essays') essays = !essays;
		if (topic === 'music') music = !music;
	}

	function toggleApp(id) {
		apps = { ...apps, [id]: !apps[id] };
	}

	async function handleSubmit() {
		if (status === 'submitting') return;

		status = 'submitting';
		errorMessage = '';

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, interests })
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
			} else if (data.error === 'invalid_interests') {
				errorMessage = 'Pick at least one interest.';
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
	<fieldset class="interests" disabled={status === 'submitting' || status === 'success'}>
		<legend class="sr-only">Interests</legend>

		<div class="interest-row" role="group" aria-label="Interests">
			{#each APPS as app (app.id)}
				<button
					type="button"
					class="app-icon"
					class:selected={apps[app.id]}
					aria-pressed={apps[app.id]}
					aria-label={app.label}
					title={app.label}
					on:click={() => toggleApp(app.id)}
				>
					<img src={app.src} alt="" />
				</button>
			{/each}

			<button
				type="button"
				class="chip"
				class:selected={essays}
				aria-pressed={essays}
				on:click={() => toggleTopic('essays')}
			>
				Essays
			</button>
			<button
				type="button"
				class="chip"
				class:selected={music}
				aria-pressed={music}
				on:click={() => toggleTopic('music')}
			>
				Music
			</button>
		</div>
	</fieldset>

	<div class="row">
		<label class="sr-only" for="subscribe-email">Email</label>
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
		<button
			type="submit"
			disabled={status === 'submitting' || status === 'success' || !email || !hasInterest}
		>
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

	.interests {
		margin: 0;
		padding: 0;
		border: none;
	}

	.interest-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}

	.chip {
		appearance: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		min-height: 44px;
		padding: 8px 12px;
		border: 1px solid #e4e4e4;
		border-radius: 10px;
		cursor: pointer;
		background: #fff;
		font: inherit;
		font-size: 0.92rem;
		font-weight: 500;
		color: #2c2c2c;
		line-height: 1.3;
		box-sizing: border-box;
		transform: scale(1);
		box-shadow: none;
		transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease,
			transform 0.15s ease, box-shadow 0.15s ease;
	}

	.chip:hover {
		background: #f7f7f7;
		border-color: #d8d8d8;
	}

	.chip.selected {
		border-color: transparent;
		background: #2c2c2c;
		color: #fff;
		transform: scale(1.04);
		box-shadow: 0 0 0 1px rgba(44, 44, 44, 0.08), 0 4px 14px rgba(40, 40, 40, 0.18);
	}

	.chip.selected:hover {
		background: #1f1f1f;
		border-color: transparent;
		color: #fff;
	}

	.app-icon {
		appearance: none;
		width: 44px;
		height: 44px;
		margin: 0;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 10px;
		background: #fff;
		overflow: hidden;
		cursor: pointer;
		line-height: 0;
		opacity: 0.88;
		transform: scale(1);
		box-shadow: none;
		transition: opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
	}

	.app-icon:hover {
		background: #fff;
		opacity: 1;
	}

	.app-icon.selected {
		opacity: 1;
		transform: scale(1.1);
		box-shadow: 0 0 0 1px rgba(44, 44, 44, 0.06), 0 5px 16px rgba(40, 40, 40, 0.16);
	}

	.app-icon img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
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
		transition: opacity 0.15s ease, background-color 0.15s ease;
	}

	button[type='submit']:hover:not(:disabled) {
		background: #1f1f1f;
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
