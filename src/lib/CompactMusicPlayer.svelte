<script>
	import { onMount, onDestroy } from 'svelte';
	import { nowPlaying, currentTrack, TRACKS, ALBUM_IDS, playTrack } from './nowPlaying.js';
	import { messages } from './i18n.js';

	let playing = false;
	let ytReady = false;
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
	$: canToggle = isYoutube ? ytReady : Boolean(audioEl);
	$: if ($nowPlaying.nonce !== lastNonce) onTrackChange($nowPlaying);
	$: credit =
		track.credit === 'my playing'
			? $messages.myPlaying
			: track.credit === 'Coming soon'
				? $messages.bachComingSoon
				: track.credit;

	/** @param {HTMLElement} node */
	function ytHost(node) {
		hostEl = node;
		return {
			destroy() {
				if (hostEl === node) hostEl = null;
			}
		};
	}

	/** @param {HTMLAudioElement} node */
	function audioHost(node) {
		audioEl = node;
		return {
			destroy() {
				if (audioEl === node) audioEl = null;
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
				}
			}
		});
	}

	function stopAll() {
		playing = false;
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

		if (current.kind === 'youtube') {
			if (!ytPlayer || !ytReady) return;
			try {
				ytPlayer.loadVideoById?.(current.videoId);
				ytPlayer.playVideo?.();
			} catch (e) {
				playing = false;
			}
			return;
		}

		if (current.kind !== 'audio' || !audioEl) return;
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
			ytPlayer.playVideo();
			return;
		}

		if (current.kind !== 'audio' || !audioEl) return;
		if (playing) {
			audioEl.pause();
			return;
		}
		if (!audioEl.getAttribute('src')) audioEl.src = current.src;
		audioEl.play().catch(() => {
			playing = false;
		});
	}

	/** @param {string} id */
	function selectAlbum(id) {
		if ($nowPlaying.id === id) {
			togglePlay();
			return;
		}
		playTrack(id, true);
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

<div class="unit" role="region" aria-label={$messages.musicPlayer}>
	<div class="yt-host" aria-hidden="true">
		<div use:ytHost></div>
	</div>
	<audio
		use:audioHost
		preload="metadata"
		on:play={() => (playing = true)}
		on:pause={() => (playing = false)}
		on:ended={() => (playing = false)}
	></audio>

	<div class="pill">
		<button
			type="button"
			class="icon-btn play"
			on:click={togglePlay}
			disabled={!canToggle}
			aria-label={playing ? $messages.pause : $messages.play}
		>
			{#if playing}
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					<path fill="currentColor" d="M7 6h3.25v12H7V6zm6.75 0H17v12h-3.25V6z" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					<path fill="currentColor" d="M8.2 5.6v12.8L18.4 12 8.2 5.6z" />
				</svg>
			{/if}
		</button>

		<div class="meta">
			<p class="title" title={track.title}>{track.title}</p>
			<p class="credit">{credit}</p>
		</div>
	</div>

	<div class="thumbs" aria-label={$messages.recordings}>
		{#each ALBUM_IDS as id (id)}
			<button
				type="button"
				class="thumb"
				class:selected={$nowPlaying.id === id}
				aria-pressed={$nowPlaying.id === id}
				aria-label={`${$messages.play} ${TRACKS[id].title}. ${
					TRACKS[id].credit === 'my playing' ? $messages.myPlaying : TRACKS[id].credit
				}`}
				on:click={() => selectAlbum(id)}
			>
				<img src={TRACKS[id].cover} alt="" />
			</button>
		{/each}

		<div class="thumb placeholder" aria-disabled="true" title={$messages.bachComingSoonTitle}>
			<img src={TRACKS.bach.cover} alt="" />
		</div>
	</div>
</div>

<style>
	.unit {
		--ink: #2a2a2a;
		--mute: #3a3a3a;
		position: fixed;
		top: 0.9rem;
		right: 0.9rem;
		z-index: 50;
		width: min(21.5rem, calc(100vw - 1.6rem));
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.55rem;
		color: var(--ink);
		pointer-events: none;
	}

	.unit > * {
		pointer-events: auto;
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
		padding: 0.72rem;
		background: rgba(250, 250, 250, 0.58);
		border: 1px solid rgba(42, 42, 42, 0.12);
		border-radius: 999px;
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

	.meta {
		flex: 1;
		min-width: 0;
		padding-right: 0.35rem;
	}

	.title,
	.credit {
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.title {
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.35;
		color: var(--ink);
	}

	.credit {
		margin-top: 0.18rem;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		line-height: 1.3;
		color: var(--mute);
	}

	.icon-btn.play {
		appearance: none;
		border: none;
		flex-shrink: 0;
		width: 2.05rem;
		aspect-ratio: 1;
		margin: 0;
		padding: 0;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		line-height: 0;
		background: rgba(250, 250, 250, 0.42);
	}

	.icon-btn.play:disabled {
		opacity: 0.32;
		cursor: default;
	}

	.thumbs {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 0.45rem;
		padding: 0 0.15rem;
		min-height: 3.4rem;
	}

	.thumb {
		appearance: none;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		width: 2.55rem;
		aspect-ratio: 1;
		border-radius: 0;
		overflow: hidden;
		cursor: pointer;
		flex-shrink: 0;
		transition: width 0.22s ease;
	}

	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb.selected {
		width: 3.35rem;
	}

	.thumb.placeholder {
		cursor: default;
		pointer-events: none;
	}

	@media (max-width: 520px) {
		.unit {
			top: 0.55rem;
			right: 0.55rem;
			width: min(17.2rem, calc(100vw - 1.1rem));
			gap: 0.45rem;
		}

		.pill {
			padding: 0.58rem 0.62rem;
		}

		.title {
			font-size: 0.72rem;
		}

		.credit {
			font-size: 0.64rem;
		}

		.thumb {
			width: 2.2rem;
		}

		.thumb.selected {
			width: 2.9rem;
		}

		.thumbs {
			min-height: 2.95rem;
			gap: 0.35rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.thumb {
			transition: none;
		}
	}
</style>
