<script>
	import { messages } from './i18n.js';

	export let compact = false;

	const APP_MARKS = [
		{ src: '/actions-life-logo.png', label: 'actions.life' },
		{ src: '/explanations-logo.png', label: 'blackboards.io' },
		{ src: '/zetteldraw-logo.png', label: 'zetteldraw' },
		{ src: '/zen-message-logo.jpg', label: 'zen-message' }
	];

	let email = '';
	/** @type {'digest' | 'updates'} */
	let mode = 'digest';
	let apps = false;
	let essays = false;
	let status = 'idle'; // idle | submitting | success | error | not_configured
	let errorMessage = '';
	/** @type {'not_configured' | 'invalid_email' | 'invalid_interests' | 'generic' | 'network' | ''} */
	let errorKey = '';

	$: interests =
		mode === 'digest'
			? []
			: [...(apps ? ['apps'] : []), ...(essays ? ['essays'] : [])];
	$: hasInterest = interests.length > 0;
	$: canSubmit =
		status !== 'submitting' &&
		status !== 'success' &&
		!!email &&
		(mode === 'digest' || hasInterest);
	$: if (errorKey === 'not_configured') {
		errorMessage = $messages.notConfigured;
	} else if (errorKey === 'invalid_email') {
		errorMessage = $messages.invalidEmail;
	} else if (errorKey === 'invalid_interests') {
		errorMessage = $messages.pickInterest;
	} else if (errorKey === 'generic') {
		errorMessage = $messages.somethingWrong;
	} else if (errorKey === 'network') {
		errorMessage = $messages.couldntReach;
	}

	const TITLE_MAX = 52;

	/** @param {string} text */
	function truncateTitle(text) {
		const value = String(text || '');
		if (value.length <= TITLE_MAX) return value;
		return `${value.slice(0, TITLE_MAX).trimEnd()}…`;
	}

	function selectUpdates() {
		mode = 'updates';
	}

	function toggleApps() {
		selectUpdates();
		apps = !apps;
	}

	function toggleEssays() {
		selectUpdates();
		essays = !essays;
	}

	async function handleSubmit() {
		if (status === 'submitting') return;
		if (mode === 'updates' && !hasInterest) {
			status = 'error';
			errorKey = 'invalid_interests';
			errorMessage = $messages.pickInterest;
			return;
		}

		status = 'submitting';
		errorMessage = '';
		errorKey = '';

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					preference: mode,
					interests: mode === 'digest' ? [] : interests
				})
			});

			const data = await res.json().catch(() => ({}));

			if (res.ok && data.ok) {
				status = 'success';
				email = '';
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
			} else if (data.error === 'invalid_interests') {
				errorKey = 'invalid_interests';
				errorMessage = $messages.pickInterest;
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
		<legend class="sr-only">{$messages.subscribePreference}</legend>

		<label class="mode-option">
			<input type="radio" name="subscribe-mode" value="digest" bind:group={mode} />
			<span class="mode-title" title={$messages.modeDigest}>{truncateTitle($messages.modeDigest)}</span>
		</label>

		<div class="mode-updates">
			<label class="mode-option">
				<input type="radio" name="subscribe-mode" value="updates" bind:group={mode} />
				<span class="mode-title" title={$messages.modeUpdates}
					>{truncateTitle($messages.modeUpdates)}</span
				>
			</label>

			<div
				class="stream-marks"
				class:active={mode === 'updates'}
				role="group"
				aria-label={$messages.interests}
			>
				<button
					type="button"
					class="mark mark-apps"
					class:selected={apps}
					aria-pressed={apps}
					aria-label={$messages.softwareApps}
					title={$messages.softwareApps}
					on:click={toggleApps}
				>
					{#each APP_MARKS as mark (mark.src)}
						<img src={mark.src} alt="" />
					{/each}
				</button>

				<button
					type="button"
					class="mark mark-essays"
					class:selected={essays}
					aria-pressed={essays}
					aria-label={$messages.essays}
					title={$messages.essays}
					on:click={toggleEssays}
				>
					<img src="/gohs-folly-cover.jpg" alt="" />
				</button>
			</div>
		</div>
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
		gap: 10px;
	}

	.mode-option {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		max-width: 100%;
		font: inherit;
		font-size: 0.95rem;
		line-height: 1.35;
		color: #2c2c2c;
		cursor: pointer;
	}

	.mode-option input {
		margin: 0;
		flex-shrink: 0;
		accent-color: #2c2c2c;
	}

	.mode-title {
		display: block;
		min-width: 0;
		max-width: 52ch;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.mode-updates {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 16px;
	}

	.stream-marks {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 18px;
		opacity: 0.42;
	}

	.stream-marks.active {
		opacity: 1;
	}

	.mark {
		appearance: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		margin: 0;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		overflow: hidden;
		cursor: pointer;
		line-height: 0;
		opacity: 0.55;
	}

	.mark-apps {
		width: auto;
		padding: 0 2px;
		gap: 2px;
	}

	.mark-apps img {
		width: 28px;
		height: 28px;
		border-radius: 6px;
	}

	.mark-essays {
		/* Keep essays visually separate from the apps logo cluster */
		margin-left: 2px;
	}

	.mark.selected {
		opacity: 1;
		border-color: #c8c8c8;
	}

	.mark img {
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
