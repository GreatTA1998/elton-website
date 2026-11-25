<script>
	import {
		setLocale,
		locale,
		offeredLocales,
		messages,
		LOCALE_LABELS
	} from './i18n.js';

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
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.label {
		appearance: none;
		margin: 0;
		padding: 0.12rem 0.08rem;
		border: none;
		background: transparent;
		font: inherit;
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		line-height: 1;
		color: #9a9a9a;
		cursor: pointer;
	}

	.label.active {
		color: #2c2c2c;
	}

	.sep {
		font-size: 0.75rem;
		line-height: 1;
		color: #d0d0d0;
		user-select: none;
	}
</style>
