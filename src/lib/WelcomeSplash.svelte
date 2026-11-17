<script>
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { messages } from './i18n.js';
	import { nowPlaying, playTrack } from './nowPlaying.js';

	const KEY = 'elton-welcome-seen';
	let show = false;
	let autoplay = true;
	/** @type {HTMLButtonElement | null} */
	let enterBtn = null;

	onMount(() => {
		try {
			show = localStorage.getItem(KEY) !== '1';
		} catch {
			show = true;
		}
		if (!show) return;
		/** @param {KeyboardEvent} e */
		const onKey = (e) => {
			if (e.key !== 'Enter' || e.metaKey || e.ctrlKey || e.altKey) return;
			e.preventDefault();
			enter();
		};
		window.addEventListener('keydown', onKey);
		tick().then(() => enterBtn?.focus());
		return () => window.removeEventListener('keydown', onKey);
	});

	function enter() {
		if (!show) return;
		try {
			localStorage.setItem(KEY, '1');
		} catch {
			/* ignore */
		}
		const wantMusic = autoplay;
		show = false;
		if (wantMusic) playTrack(get(nowPlaying).id, true);
	}
</script>

{#if show}
	<div class="splash" role="dialog" aria-modal="true" aria-labelledby="welcome-splash-title">
		<h1 id="welcome-splash-title">{$messages.welcome}</h1>
		<p id="welcome-splash-copy">
			Hello! I'm Elton, a startup founder since 2021. This place centralizes my software,
			music recordings, essays and contact information.
		</p>
		<div class="row">
			<button type="button" class="enter" bind:this={enterBtn} on:click={enter}>Enter</button>
			<label class="tog"><input type="checkbox" bind:checked={autoplay} /> autoplay music</label>
		</div>
	</div>
{/if}

<style>
	.splash {
		position: fixed;
		inset: 0;
		z-index: 300;
		display: grid;
		place-content: center;
		gap: 1.25rem;
		padding: 1.5rem;
		box-sizing: border-box;
		background: #fafafa;
		color: #2c2c2c;
	}
	.splash h1,
	.splash p {
		margin: 0;
		max-width: 28rem;
	}
	.splash h1 {
		font-size: 1.4rem;
		font-weight: 650;
		line-height: 1.3;
	}
	.splash p {
		font-size: 0.98rem;
		font-weight: 400;
		line-height: 1.55;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.enter {
		appearance: none;
		margin: 0;
		padding: 0.5rem 1rem 1.4rem 0.85rem;
		border: 1px solid rgba(42, 42, 42, 0.28);
		clip-path: polygon(0 0, 100% 0, 100% 52%, 46% 52%, 46% 100%, 0 100%);
		background: #fff;
		color: #2a2a2a;
		font: inherit;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
	}
	.tog {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		font-weight: 500;
		color: #3a3a3a;
		cursor: pointer;
		user-select: none;
	}
	.tog input {
		margin: 0;
		accent-color: #2a2a2a;
	}
</style>
