<script>
	import { onMount, onDestroy } from 'svelte';
	import { nowPlaying, currentTrack, TRACKS, ALBUM_IDS, playTrack } from './nowPlaying.js';
	import { messages } from './i18n.js';
	import { experiments, overlapStyle } from './experiments.js'; // TEMP experiments

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

<div
	class="unit"
	class:exp-gray={$experiments.grayscaleUnselected}
	class:exp-overlap={$experiments.overlapMusic}
	class:exp-dock={$experiments.dockSelected}
	data-exp-preset={$experiments.overlapMusic ? $experiments.musicPreset : null}
	style={$experiments.overlapMusic || $experiments.dockSelected ? overlapStyle($experiments) : null}
	role="region"
	aria-label={$messages.musicPlayer}
>
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
		--thumb: clamp(2.2rem, 4.2vw, 2.55rem);
		--thumb-on: clamp(2.9rem, 5.2vw, 3.35rem);
		position: fixed;
		top: clamp(0.55rem, 1.4vw, 0.9rem);
		right: clamp(0.55rem, 1.4vw, 0.9rem);
		z-index: 50;
		width: min(clamp(17.2rem, 42vw, 21.5rem), calc(100vw - 1.1rem));
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: clamp(0.45rem, 1vw, 0.55rem);
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
		padding: clamp(0.58rem, 1.2vw, 0.72rem) clamp(0.62rem, 1.2vw, 0.72rem);
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
		font-size: clamp(0.72rem, 1.5vw, 0.78rem);
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.35;
		color: var(--ink);
	}

	.credit {
		margin-top: 0.18rem;
		font-size: clamp(0.64rem, 1.3vw, 0.68rem);
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
		gap: clamp(0.35rem, 0.9vw, 0.45rem);
		padding: 0 0.15rem;
		min-height: clamp(2.95rem, 6vw, 3.4rem);
	}

	.thumb {
		appearance: none;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		width: var(--thumb);
		aspect-ratio: 1;
		border-radius: 2px;
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
		width: var(--thumb-on);
	}

	.thumb.placeholder {
		cursor: default;
		pointer-events: none;
	}

	/* TEMP experiments — grayscale unselected album arts */
	.unit.exp-gray .thumb:not(.selected) img {
		filter: grayscale(0.92);
		transition: filter 0.22s ease;
	}

	.unit.exp-gray .thumb.selected img {
		filter: none;
	}

	/* TEMP experiments — overlap album arts with player pill */
	.unit.exp-overlap {
		gap: 0;
	}

	.unit.exp-overlap .pill {
		position: relative;
		z-index: 2;
	}

	.unit.exp-overlap .thumbs {
		position: relative;
		z-index: 1;
		margin-top: calc(-1 * var(--exp-mv, 0.9rem));
		gap: max(0.12rem, calc(0.45rem - var(--exp-mh, 0.25rem)));
		padding-top: 0.15rem;
		min-height: calc(var(--thumb-on) + 0.2rem);
	}

	.unit.exp-overlap .thumb {
		width: calc(var(--thumb) * var(--exp-ms, 1));
		transform-origin: bottom center;
		transition: width 0.22s ease, transform 0.22s ease;
	}

	.unit.exp-overlap .thumb.selected {
		width: calc(var(--thumb-on) * var(--exp-ms, 1));
	}

	.unit.exp-overlap[data-exp-preset='tuck'] .thumbs {
		z-index: 0;
	}

	.unit.exp-overlap[data-exp-preset='tuck'] .pill {
		z-index: 2;
		/* keep tucked thumbs clickable under the translucent wash */
		pointer-events: none;
	}

	.unit.exp-overlap[data-exp-preset='tuck'] .pill > * {
		pointer-events: auto;
	}

	.unit.exp-overlap[data-exp-preset='straddle'] .thumbs {
		z-index: 1;
		margin-top: calc(-0.55 * var(--exp-mv, 0.9rem));
	}

	.unit.exp-overlap[data-exp-preset='straddle'] .thumb {
		transform: translateY(calc(-0.22 * var(--exp-mv, 0.9rem)));
	}

	.unit.exp-overlap[data-exp-preset='fan'] .thumb:nth-child(1) {
		transform: translate(calc(0.35 * var(--exp-mh, 0.25rem)), calc(0.15 * var(--exp-mv, 0.9rem)))
			rotate(-4deg);
	}

	.unit.exp-overlap[data-exp-preset='fan'] .thumb:nth-child(2) {
		transform: translate(0, calc(-0.05 * var(--exp-mv, 0.9rem))) rotate(-1deg);
		z-index: 1;
	}

	.unit.exp-overlap[data-exp-preset='fan'] .thumb:nth-child(3) {
		transform: translate(calc(-0.2 * var(--exp-mh, 0.25rem)), calc(0.28 * var(--exp-mv, 0.9rem)))
			rotate(3deg);
	}

	.unit.exp-overlap[data-exp-preset='fan'] .thumb:nth-child(4) {
		transform: translate(calc(-0.45 * var(--exp-mh, 0.25rem)), calc(0.55 * var(--exp-mv, 0.9rem)))
			rotate(6deg);
	}

	/* TEMP experiments — selected album docks into pill edge */
	.unit.exp-dock:not(.exp-overlap) {
		gap: 0.18rem;
	}

	.unit.exp-dock .pill {
		position: relative;
		z-index: 2;
	}

	.unit.exp-dock .thumbs {
		position: relative;
		z-index: 3;
	}

	.unit.exp-dock .thumb.selected {
		transform: translateY(calc(-1 * var(--exp-dock, 0.7rem)));
		z-index: 4;
		transition: width 0.22s ease, transform 0.22s ease;
	}

	.unit.exp-dock.exp-overlap[data-exp-preset='straddle'] .thumb.selected {
		transform: translateY(calc(-0.22 * var(--exp-mv, 0.9rem) - var(--exp-dock, 0.7rem)));
	}

	.unit.exp-dock.exp-overlap[data-exp-preset='fan'] .thumb.selected {
		transform: translateY(calc(-1 * var(--exp-dock, 0.7rem)));
	}

	@media (prefers-reduced-motion: reduce) {
		.thumb { transition: none; }
		.unit.exp-gray .thumb:not(.selected) img { transition: none; }
		.unit.exp-overlap .thumb,
		.unit.exp-dock .thumb.selected { transition: none; }
	}
</style>
