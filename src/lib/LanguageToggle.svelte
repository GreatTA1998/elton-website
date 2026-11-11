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
	$: showToggle = options.length > 1;
</script>

{#if showToggle}
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
		/* Above the hero (0) and sticky rails (5); under the essay lightbox (40) and music player (50). */
		z-index: 10;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		/* Pass clicks through the gap so Home links underneath stay usable. */
		pointer-events: none;
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
		pointer-events: auto;
	}

	.label.active {
		color: #5a5a5a;
	}

	.sep {
		font-size: 0.65rem;
		line-height: 1;
		color: #d0d0d0;
		user-select: none;
		pointer-events: none;
	}

	@media (max-width: 520px) {
		.lang {
			top: 0.65rem;
			left: 0.65rem;
		}
	}
</style>
