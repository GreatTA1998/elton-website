<script>
	import { onMount, onDestroy } from 'svelte';
	import { nowPlaying, currentTrack, TRACKS } from './nowPlaying.js';

	export let variant = 'pill'; // pill | shelf | section

	let playing = false;
	let ytReady = false;
	let embedBlocked = false;
	let playAttempted = false;
	let lastNonce = -1;

	/** @type {HTMLElement | null} */
	let hostEl = null;
	/** @type {HTMLAudioElement | null} */
	let audioEl = null;
	/** @type {any} */
	let ytPlayer;
	let destroyed = false;

	$: track = $currentTrack;
	$: isYoutube = track.kind === 'youtube';
	$: watchUrl = isYoutube ? `https://www.youtube.com/watch?v=${track.videoId}` : null;
	$: canToggle = isYoutube ? ytReady : Boolean(audioEl);
	$: if ($nowPlaying.nonce !== lastNonce) onTrackChange($nowPlaying);

	/** @param {HTMLElement} node */
	function ytHost(node) {
		hostEl = node;
		return {
			destroy() {
				if (hostEl === node) hostEl = null;
			}
		};
	}

	function loadApi() {
		return new Promise((resolve) => {
			if (typeof window === 'undefined') return;
			if (window.YT && window.YT.Player) {
				resolve();
				return;
			}
			const previous = window.onYouTubeIframeAPIReady;
			window.onYouTubeIframeAPIReady = () => {
				if (typeof previous === 'function') previous();
				resolve();
			};
			if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
				const tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/iframe_api';
				tag.async = true;
				document.head.appendChild(tag);
			}
		});
	}

	function createYtPlayer() {
		if (destroyed || !hostEl || ytPlayer) return;
		ytPlayer = new window.YT.Player(hostEl, {
			width: 200,
			height: 200,
			videoId: TRACKS.rachmaninoff.videoId,
			playerVars: {
				autoplay: 0,
				controls: 0,
				disablekb: 1,
				fs: 0,
				iv_load_policy: 3,
				modestbranding: 1,
				playsinline: 1,
				rel: 0,
				origin: typeof window !== 'undefined' ? window.location.origin : undefined
			},
			events: {
				onReady: () => {
					if (destroyed) return;
					ytReady = true;
					if ($nowPlaying.autoplay && TRACKS[$nowPlaying.id]?.kind === 'youtube') {
						startCurrent();
					}
				},
				onStateChange: (event) => {
					if (destroyed || !window.YT) return;
					if (TRACKS[$nowPlaying.id]?.kind !== 'youtube') return;
					const state = event.data;
					if (state === window.YT.PlayerState.PLAYING) playing = true;
					else if (
						state === window.YT.PlayerState.PAUSED ||
						state === window.YT.PlayerState.ENDED
					)
						playing = false;
				},
				onError: () => {
					playing = false;
					if (playAttempted) embedBlocked = true;
				}
			}
		});
	}

	function stopAll() {
		playing = false;
		embedBlocked = false;
		playAttempted = false;
		try {
			ytPlayer?.pauseVideo?.();
		} catch (e) {
			/* ignore */
		}
		if (audioEl) {
			audioEl.pause();
			try {
				audioEl.currentTime = 0;
			} catch (e) {
				/* ignore */
			}
		}
	}

	function startCurrent() {
		const current = TRACKS[$nowPlaying.id];
		if (!current) return;
		embedBlocked = false;
		playAttempted = false;

		if (current.kind === 'youtube') {
			if (!ytPlayer || !ytReady) return;
			playAttempted = true;
			try {
				ytPlayer.loadVideoById?.(current.videoId);
				ytPlayer.playVideo?.();
			} catch (e) {
				embedBlocked = true;
			}
			return;
		}

		if (!audioEl) return;
		audioEl.src = current.src;
		audioEl.play().catch(() => {
			playing = false;
		});
	}

	/** @param {{ id: string, autoplay: boolean, nonce: number }} state */
	function onTrackChange(state) {
		if (!state || state.nonce === lastNonce) return;
		lastNonce = state.nonce;
		stopAll();
		if (state.autoplay) queueMicrotask(() => startCurrent());
	}

	function togglePlay() {
		const current = TRACKS[$nowPlaying.id];
		if (!current) return;

		if (current.kind === 'youtube') {
			if (!ytPlayer || !ytReady) return;
			if (playing) {
				ytPlayer.pauseVideo();
				return;
			}
			playAttempted = true;
			embedBlocked = false;
			ytPlayer.playVideo();
			return;
		}

		if (!audioEl) return;
		if (playing) {
			audioEl.pause();
			return;
		}
		if (!audioEl.getAttribute('src')) audioEl.src = current.src;
		audioEl.play().catch(() => {
			playing = false;
		});
	}

	onMount(async () => {
		await loadApi();
		if (!destroyed) createYtPlayer();
	});

	onDestroy(() => {
		destroyed = true;
		try {
			if (ytPlayer && typeof ytPlayer.destroy === 'function') ytPlayer.destroy();
		} catch (e) {
			/* ignore */
		}
		ytPlayer = null;
	});
</script>

<div
	class="player"
	class:playing
	class:shelf={variant === 'shelf'}
	class:section={variant === 'section'}
	role="region"
	aria-label="Now playing"
>
	<div class="yt-host" aria-hidden="true">
		<div use:ytHost></div>
	</div>
	<audio
		bind:this={audioEl}
		preload="metadata"
		on:play={() => (playing = true)}
		on:pause={() => (playing = false)}
		on:ended={() => (playing = false)}
	></audio>

	<div class="row">
		{#if track.cover}
			<img class="art" src={track.cover} alt="" />
		{/if}
		<button
			type="button"
			class="icon-btn play"
			on:click={togglePlay}
			disabled={!canToggle}
			aria-label={playing ? 'Pause' : 'Play'}
		>
			{#if playing}
				<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
					<path fill="currentColor" d="M7 6h3.25v12H7V6zm6.75 0H17v12h-3.25V6z" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
					<path fill="currentColor" d="M8.2 5.6v12.8L18.4 12 8.2 5.6z" />
				</svg>
			{/if}
		</button>

		<div class="meta">
			<p class="title" title={track.title}>{track.title}</p>
			<p class="credit">{track.credit}</p>
		</div>
	</div>

	{#if embedBlocked && watchUrl}
		<p class="hint">
			<a href={watchUrl} target="_blank" rel="noopener noreferrer">Open recording</a>
		</p>
	{/if}
</div>

<style>
	.player {
		--ink: #2a2a2a;
		--mute: #7a7a7a;
		--line: rgba(40, 40, 40, 0.08);
		--wash: rgba(255, 252, 248, 0.86);
		box-sizing: border-box;
		padding: 0.72rem;
		background: linear-gradient(160deg, var(--wash), rgba(255, 255, 255, 0.78));
		border: 1px solid var(--line);
		border-radius: 14px;
		backdrop-filter: blur(14px) saturate(1.05);
		-webkit-backdrop-filter: blur(14px) saturate(1.05);
		box-shadow: 0 8px 28px rgba(40, 36, 30, 0.05);
		color: var(--ink);
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	.player:not(.shelf):not(.section) {
		position: fixed;
		top: 0.9rem;
		right: 0.9rem;
		z-index: 50;
		width: min(21.5rem, calc(100vw - 1.6rem));
	}

	.player.section {
		position: relative;
		width: min(28rem, 100%);
		margin: 0 0 0.85rem;
		box-shadow: none;
		/* Mode 3: mirrors pill chrome without glass */
		background: #fff;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: #ececec;
	}

	.player.shelf {
		position: relative;
		width: min(22rem, 100%);
		flex: 1 1 auto;
		box-shadow: none;
		background: #fff;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: #ececec;
	}

	.player.playing {
		border-color: rgba(40, 40, 40, 0.11);
	}

	.yt-host {
		position: fixed;
		width: 200px;
		height: 200px;
		bottom: 0;
		right: 0;
		opacity: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: -1;
	}

	audio {
		display: none;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	.art {
		width: 2.05rem;
		height: 2.05rem;
		border-radius: 7px;
		object-fit: cover;
		flex-shrink: 0;
		background: #f0f0f0;
	}

	.meta {
		flex: 1;
		min-width: 0;
	}

	.title {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.35;
		color: var(--ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.credit {
		margin: 0.18rem 0 0;
		font-size: 0.68rem;
		font-weight: 400;
		letter-spacing: 0.01em;
		line-height: 1.3;
		color: var(--mute);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.icon-btn {
		appearance: none;
		border: none;
		background: transparent;
		color: var(--ink);
		padding: 0.28rem;
		margin: 0;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		line-height: 0;
	}

	.icon-btn:disabled {
		opacity: 0.32;
		cursor: default;
	}

	.icon-btn.play {
		flex-shrink: 0;
		width: 2.05rem;
		height: 2.05rem;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid var(--line);
		color: var(--ink);
	}

	.player.playing .icon-btn.play {
		background: #2f2f2f;
		border-color: #2f2f2f;
		color: #fff;
	}

	.hint {
		margin: 0.45rem 0 0;
		font-size: 0.65rem;
		color: var(--mute);
		line-height: 1.3;
	}

	.hint a {
		color: var(--mute);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	@media (max-width: 520px) {
		.player:not(.shelf):not(.section) {
			top: 0.55rem;
			right: 0.55rem;
			width: min(16.8rem, calc(100vw - 1.1rem));
			padding: 0.62rem;
		}
	}
</style>
