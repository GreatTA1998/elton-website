<script>
	import { onMount } from 'svelte';
	import {
		initLocale,
		setLocale,
		locale,
		offeredLocales,
		messages,
		LOCALE_LABELS
	} from './i18n.js';

	onMount(() => {
		initLocale();
	});

	$: options = $offeredLocales;
	$: onlyEnglish = options.length === 1 && options[0] === 'en';
</script>

{#if onlyEnglish}
	<div class="lang" aria-label={$messages.language}>
		<span class="label quiet">EN</span>
	</div>
{:else}
	<div class="lang" role="group" aria-label={$messages.language}>
		{#each options as id, i (id)}
			{#if i > 0}
				<span class="sep" aria-hidden="true">·</span>
			{/if}
			<button
				type="button"
				class="label"
				class:active={$locale === id}
				aria-pressed={$locale === id}
				on:click={() => setLocale(id)}
			>
				{LOCALE_LABELS[id]}
			</button>
		{/each}
	</div>
{/if}

<style>
	.lang {
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 50;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		pointer-events: none;
	}

	.lang > * {
		pointer-events: auto;
	}

	.label {
		appearance: none;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		font: inherit;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		line-height: 1;
		color: #b0b0b0;
		cursor: pointer;
	}

	.label.quiet {
		cursor: default;
		pointer-events: none;
		color: #c0c0c0;
	}

	.label.active {
		color: #5a5a5a;
	}

	.sep {
		font-size: 0.65rem;
		line-height: 1;
		color: #d0d0d0;
		user-select: none;
	}

	@media (max-width: 520px) {
		.lang {
			top: 0.65rem;
			left: 0.65rem;
		}
	}
</style>
