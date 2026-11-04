<script>
	import { onMount, onDestroy } from 'svelte';

	/** Listening playlist — other people’s recordings, not Elton’s. */
	const tracks = [
		{
			videoId: 'J7FNWtUwBD0',
			title: 'Rachmaninoff: 10 Preludes, Op. 23: No. 4 in D Major (Andante cantabile)',
			credit: 'Vladimir Ashkenazy · Decca'
		},
		{
			videoId: '20Gb0JcviRA',
			title: 'Brahms - Intermezzo in A major, Op. 118 No. 2 (Stephen Kovacevich) - 1981',
			credit: 'Stephen Kovacevich · Philips, 1981'
		}
	];

	let trackIndex = 0;
	let playing = false;
	let ready = false;
	let collapsed = false;

	/** @type {HTMLElement} */
	let hostEl;
	/** @type {any} */
	let player;
	let destroyed = false;

	$: track = tracks[trackIndex];

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
				onReady: () => {
					if (!destroyed) ready = true;
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
				}
			}
		});
	}

	function togglePlay() {
		if (!player || !ready) return;
		if (playing) {
			player.pauseVideo();
		} else {
			player.playVideo();
		}
	}

	/**
	 * @param {boolean} [autoplay]
	 */
	function selectTrack(nextIndex, autoplay = playing) {
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

	function toggleCollapsed() {
		collapsed = !collapsed;
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
	class:collapsed
	class:playing
	role="region"
	aria-label="Listening — recordings by other musicians"
>
	<!-- YouTube host: kept for API / ToS presence, visually suppressed -->
	<div class="yt-host" aria-hidden="true">
		<div bind:this={hostEl}></div>
	</div>

	{#if collapsed}
		<button
			type="button"
			class="icon-btn expand"
			on:click={toggleCollapsed}
			aria-label="Expand listening player"
			title="Listening"
		>
			<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
				<path
					fill="currentColor"
					d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"
				/>
			</svg>
		</button>
	{:else}
		<div class="chrome">
			<p class="eyebrow">Listening</p>
			<button
				type="button"
				class="icon-btn dismiss"
				on:click={toggleCollapsed}
				aria-label="Minimize listening player"
			>
				<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
					<path fill="currentColor" d="M6 12h12v2H6z" />
				</svg>
			</button>
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
					<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
						<path fill="currentColor" d="M7 6h3v12H7V6zm7 0h3v12h-3V6z" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
						<path fill="currentColor" d="M8 5v14l11-7L8 5z" />
					</svg>
				{/if}
			</button>

			<div class="meta">
				<p class="title" title={track.title}>{track.title}</p>
				<p class="credit">{track.credit}</p>
			</div>

			<div class="nav">
				<button
					type="button"
					class="icon-btn"
					on:click={() => prevTrack()}
					disabled={!ready}
					aria-label="Previous piece"
				>
					<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
						<path fill="currentColor" d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
					</svg>
				</button>
				<button
					type="button"
					class="icon-btn"
					on:click={() => nextTrack()}
					disabled={!ready}
					aria-label="Next piece"
				>
					<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
						<path fill="currentColor" d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
					</svg>
				</button>
			</div>
		</div>

		<a
			class="source"
			href={`https://www.youtube.com/watch?v=${track.videoId}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			YouTube
		</a>
	{/if}
</div>

<style>
	.player {
		position: fixed;
		top: 0.85rem;
		right: 0.85rem;
		z-index: 50;
		width: min(22.5rem, calc(100vw - 1.5rem));
		box-sizing: border-box;
		padding: 0.7rem 0.75rem 0.65rem;
		background: rgba(255, 255, 255, 0.92);
		border: 1px solid #ececec;
		border-radius: 10px;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
		color: #2c2c2c;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	.player.collapsed {
		width: auto;
		padding: 0.4rem;
		right: 0.75rem;
		top: 0.75rem;
	}

	.yt-host {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
		padding: 0;
		pointer-events: none;
	}

	.chrome {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.35rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #8a8a8a;
		line-height: 1.2;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		min-width: 0;
	}

	.meta {
		flex: 1;
		min-width: 0;
	}

	.title {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.35;
		color: #2c2c2c;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.credit {
		margin: 0.12rem 0 0;
		font-size: 0.7rem;
		font-weight: 400;
		line-height: 1.3;
		color: #6a6a6a;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.1rem;
	}

	.icon-btn {
		appearance: none;
		border: none;
		background: transparent;
		color: #2c2c2c;
		padding: 0.28rem;
		margin: 0;
		border-radius: 6px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		line-height: 0;
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.icon-btn:hover:not(:disabled) {
		background: #f3f3f3;
	}

	.icon-btn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.icon-btn.play {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: #f5f5f5;
		border: 1px solid #ececec;
	}

	.player.playing .icon-btn.play {
		background: #2c2c2c;
		border-color: #2c2c2c;
		color: #fff;
	}

	.icon-btn.play:hover:not(:disabled) {
		background: #ebebeb;
	}

	.player.playing .icon-btn.play:hover:not(:disabled) {
		background: #1f1f1f;
	}

	.icon-btn.dismiss {
		color: #8a8a8a;
		padding: 0.15rem;
	}

	.icon-btn.expand {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: #fff;
		border: 1px solid #ececec;
		color: #2c2c2c;
	}

	.player.playing .icon-btn.expand {
		background: #2c2c2c;
		border-color: #2c2c2c;
		color: #fff;
	}

	.source {
		display: inline-block;
		margin-top: 0.4rem;
		font-size: 0.65rem;
		color: #9a9a9a;
		text-decoration: none;
		letter-spacing: 0.01em;
	}

	.source:hover {
		color: #6a6a6a;
		text-decoration: underline;
	}

	@media (max-width: 520px) {
		.player:not(.collapsed) {
			top: 0.55rem;
			right: 0.55rem;
			width: min(17.5rem, calc(100vw - 1.1rem));
			padding: 0.55rem 0.55rem 0.5rem;
		}

		.nav button:first-child {
			display: none;
		}

		.title {
			font-size: 0.74rem;
		}

		.credit {
			font-size: 0.66rem;
		}
	}
</style>
