<script>
	import { onMount, onDestroy } from 'svelte';

	/** Other people’s recordings — not Elton’s. */
	const tracks = [
		{
			videoId: 'J7FNWtUwBD0',
			title: 'Rachmaninoff: 10 Preludes, Op. 23: No. 4 in D Major (Andante cantabile)',
			credit: 'Ashkenazy'
		},
		{
			videoId: '20Gb0JcviRA',
			title: 'Brahms - Intermezzo in A major, Op. 118 No. 2 (Stephen Kovacevich) - 1981',
			credit: 'Kovacevich, 1981'
		}
	];

	let trackIndex = 0;
	let playing = false;
	let ready = false;
	let embedBlocked = false;
	let playAttempted = false;
	let titleKey = 0;

	/** @type {HTMLElement} */
	let hostEl;
	/** @type {any} */
	let player;
	let destroyed = false;

	$: track = tracks[trackIndex];
	$: watchUrl = `https://www.youtube.com/watch?v=${track.videoId}`;

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

	function createPlayer() {
		if (destroyed || !hostEl) return;
		player = new window.YT.Player(hostEl, {
			width: 200,
			height: 200,
			videoId: tracks[trackIndex].videoId,
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
				onReady: (event) => {
					if (destroyed) return;
					const iframe = event.target.getIframe?.() || hostEl?.querySelector?.('iframe');
					if (iframe) {
						iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
						iframe.setAttribute(
							'allow',
							'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						);
					}
					ready = true;
				},
				onStateChange: (event) => {
					if (destroyed || !window.YT) return;
					const state = event.data;
					if (state === window.YT.PlayerState.PLAYING) {
						playing = true;
					} else if (
						state === window.YT.PlayerState.PAUSED ||
						state === window.YT.PlayerState.ENDED
					) {
						playing = false;
						if (state === window.YT.PlayerState.ENDED) {
							nextTrack(true);
						}
					}
				},
				onError: () => {
					playing = false;
					if (playAttempted) embedBlocked = true;
				}
			}
		});
	}

	function togglePlay() {
		if (!player || !ready) return;
		if (playing) {
			player.pauseVideo();
			return;
		}
		playAttempted = true;
		embedBlocked = false;
		player.playVideo();
		setTimeout(() => {
			if (destroyed || playing || !player || !playAttempted) return;
			try {
				const state = player.getPlayerState?.();
				if (
					state !== window.YT?.PlayerState?.PLAYING &&
					state !== window.YT?.PlayerState?.BUFFERING
				) {
					embedBlocked = true;
				}
			} catch (e) {
				embedBlocked = true;
			}
		}, 2500);
	}

	/**
	 * @param {boolean} [autoplay]
	 */
	function selectTrack(nextIndex, autoplay = playing) {
		embedBlocked = false;
		playAttempted = false;
		titleKey += 1;
		if (!player || !ready) {
			trackIndex = nextIndex;
			return;
		}
		trackIndex = nextIndex;
		const id = tracks[trackIndex].videoId;
		if (autoplay) {
			player.loadVideoById(id);
		} else {
			player.cueVideoById(id);
			playing = false;
		}
	}

	/**
	 * @param {boolean} [autoplay]
	 */
	function nextTrack(autoplay = playing) {
		selectTrack((trackIndex + 1) % tracks.length, autoplay);
	}

	/**
	 * @param {boolean} [autoplay]
	 */
	function prevTrack(autoplay = playing) {
		selectTrack((trackIndex - 1 + tracks.length) % tracks.length, autoplay);
	}

	onMount(async () => {
		await loadApi();
		if (!destroyed) createPlayer();
	});

	onDestroy(() => {
		destroyed = true;
		try {
			if (player && typeof player.destroy === 'function') player.destroy();
		} catch (e) {
			/* ignore */
		}
		player = null;
	});
</script>

<div
	class="player"
	class:playing
	role="region"
	aria-label="Music player — recordings by other musicians"
>
	<div class="yt-host" aria-hidden="true">
		<div bind:this={hostEl}></div>
	</div>

	<div class="row">
		<button
			type="button"
			class="icon-btn play"
			on:click={togglePlay}
			disabled={!ready}
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
			{#key titleKey}
				<p class="title" title={track.title}>{track.title}</p>
				<p class="credit">{track.credit}</p>
			{/key}
		</div>

		<div class="nav">
			<button
				type="button"
				class="icon-btn"
				on:click={() => prevTrack()}
				disabled={!ready}
				aria-label="Previous piece"
			>
				<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
					<path fill="currentColor" d="M6.5 6h1.6v12H6.5V6zm3.2 6 8.3 5.7V6.3L9.7 12z" />
				</svg>
			</button>
			<button
				type="button"
				class="icon-btn"
				on:click={() => nextTrack()}
				disabled={!ready}
				aria-label="Next piece"
			>
				<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
					<path fill="currentColor" d="M16 6h1.6v12H16V6zM6 17.7 14.3 12 6 6.3v11.4z" />
				</svg>
			</button>
		</div>
	</div>

	{#if embedBlocked}
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
		position: fixed;
		top: 0.9rem;
		right: 0.9rem;
		z-index: 50;
		width: min(21.5rem, calc(100vw - 1.6rem));
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
		transition: box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
	}

	.player.playing {
		border-color: rgba(40, 40, 40, 0.11);
		box-shadow: 0 10px 32px rgba(40, 36, 30, 0.07);
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

	.row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
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
		animation: rise 0.45s ease;
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
		animation: rise 0.55s ease;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.nav {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.05rem;
		opacity: 0.72;
		transition: opacity 0.25s ease;
	}

	.player:hover .nav {
		opacity: 1;
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
		transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease,
			opacity 0.2s ease;
	}

	.icon-btn:hover:not(:disabled) {
		background: rgba(40, 40, 40, 0.05);
	}

	.icon-btn:active:not(:disabled) {
		transform: scale(0.96);
	}

	.icon-btn:disabled {
		opacity: 0.32;
		cursor: default;
	}

	.icon-btn.play {
		position: relative;
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

	.icon-btn.play:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.95);
	}

	.player.playing .icon-btn.play:hover:not(:disabled) {
		background: #222;
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

	.hint a:hover {
		color: var(--ink);
	}

	@media (max-width: 520px) {
		.player {
			top: 0.55rem;
			right: 0.55rem;
			width: min(16.8rem, calc(100vw - 1.1rem));
			padding: 0.62rem;
		}

		.nav button:first-child {
			display: none;
		}

		.title {
			font-size: 0.72rem;
		}

		.credit {
			font-size: 0.64rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.title,
		.credit {
			animation: none;
		}

		.icon-btn,
		.nav,
		.player {
			transition: none;
		}
	}
</style>
