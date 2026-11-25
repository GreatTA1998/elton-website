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
		top: clamp(0.55rem, 1.4vw, 0.85rem);
		left: clamp(0.55rem, 1.4vw, 0.85rem);
		z-index: 310;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: clamp(0.36rem, 0.9vw, 0.42rem) clamp(0.55rem, 1.1vw, 0.62rem);
		box-sizing: border-box;
		pointer-events: none;
		background: rgba(255, 255, 255, 0.88);
		border: 1px solid rgba(40, 40, 40, 0.08);
		border-radius: 999px;
	}

	.label {
		appearance: none;
		margin: 0;
		padding: 0.12rem 0.08rem;
		border: none;
		background: transparent;
		font: inherit;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		line-height: 1;
		color: #9a9a9a;
		cursor: pointer;
		pointer-events: auto;
		position: relative;
		z-index: 1;
	}

	.label.active {
		color: #4a4a4a;
	}

	.sep {
		font-size: 0.65rem;
		line-height: 1;
		color: #d0d0d0;
		user-select: none;
		pointer-events: none;
	}
</style>
