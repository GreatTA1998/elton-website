<script>
	import { LISTEN_MODES, listenMode, setListenMode } from './nowPlaying.js';
</script>

<nav class="switcher" aria-label="Listening layout comparison">
	<span class="label">listen</span>
	{#each LISTEN_MODES as mode (mode.id)}
		<button
			type="button"
			class:active={$listenMode === mode.id}
			aria-pressed={$listenMode === mode.id}
			on:click={() => setListenMode(/** @type {1|2|3} */ (mode.id))}
		>
			{mode.label}
		</button>
	{/each}
</nav>

<style>
	.switcher {
		position: fixed;
		left: 0.75rem;
		bottom: 0.75rem;
		z-index: 70;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px;
		border: 1px solid #ececec;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.94);
		box-shadow: 0 6px 20px rgba(40, 36, 30, 0.06);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	.label {
		padding: 0 6px 0 8px;
		font-size: 0.65rem;
		color: #8a8a8a;
		letter-spacing: 0.02em;
	}

	button {
		appearance: none;
		margin: 0;
		padding: 5px 9px;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: #555;
		font: inherit;
		font-size: 0.68rem;
		font-weight: 500;
		cursor: pointer;
		line-height: 1.2;
	}

	button.active {
		background: #2c2c2c;
		color: #fff;
	}

	:global(body.listen-2) .switcher {
		bottom: calc(7.5rem + env(safe-area-inset-bottom, 0px));
	}
</style>
