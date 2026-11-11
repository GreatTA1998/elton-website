<div class="home">
<HomeAtmosphere />

<p class="welcome">
	Welcome to my absolutely EPIC website, it's INSANE:
</p>
<p class="welcome-sub">
	I'm a solo founder who dreams of being useful and making it big some day.
</p>

<h2 class="section-label">software apps</h2>

<div class="app-cards">
	<div class="app-card app-card-ready">
		<img class="app-card-logo" src="/actions-life-logo.png" alt="actions.life logo" />
		<div class="app-card-text">
			<strong>
				actions.life
				<span class="ready-tick" title="Ready" aria-label="Ready">
					<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
						<circle cx="8" cy="8" r="8" fill="#2f9e44" />
						<path
							d="M4.6 8.2l2.1 2.1 4.7-4.7"
							fill="none"
							stroke="#fff"
							stroke-width="1.7"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</strong>
			<span class="app-desc"
				>Put to-do lists on the calendar. Fully using since 2024; currently v2 after 2380
				commits.</span
			>
			<span class="app-status">2022 – current · fully active / usable</span>
			<a
				class="app-explore"
				target="_blank"
				rel="noopener noreferrer"
				href="https://actions.life"
			>
				Explore
			</a>
		</div>
	</div>
	<a
		class="app-card"
		target="_blank"
		rel="noopener noreferrer"
		href="https://blackboards.io"
	>
		<img class="app-card-logo" src="/explanations-logo.png" alt="blackboards.io logo" />
		<div class="app-card-text">
			<strong>blackboards.io</strong>
			<span class="app-desc"
				>Blackboard-video explanations. Previously explain.mit.edu — ~800 students/teachers across
				~10 MIT classes during COVID-19.</span
			>
			<span class="app-status">2018 (under rework) – current</span>
		</div>
	</a>
	<div class="app-card app-card-quiet" aria-disabled="true">
		<img class="app-card-logo" src="/zetteldraw-logo.png" alt="zetteldraw logo" />
		<div class="app-card-text">
			<strong>zetteldraw</strong>
			<span class="app-desc">Handwriting-first notes on a Boox.</span>
			<span class="app-status">2026 (in private testing) – current</span>
		</div>
	</div>
	<div class="app-card app-card-quiet" aria-disabled="true">
		<img class="app-card-logo" src="/zen-message-logo.jpg" alt="zen-message logo" />
		<div class="app-card-text">
			<strong>zen-message</strong>
			<span class="app-desc">A calmer, less interruptive messaging system.</span>
			<span class="app-status">2024 (in development)</span>
		</div>
	</div>
</div>

<h2 class="section-label">video essays</h2>

<div class="essay-grid">
	<div class="essay-item">
		<a class="essay-thumb-link" href="/essays/gohs-folly">
			<picture>
				<source srcset="/gohs-folly-cover.avif" type="image/avif" />
				<source srcset="/gohs-folly-cover.webp" type="image/webp" />
				<img
					class="essay-thumb"
					src="/gohs-folly-cover.jpg"
					alt="Goh's Folly: Seeing What Others Couldn't"
					loading="lazy"
					decoding="async"
				/>
			</picture>
		</a>
		<p class="essay-title">
			<a href="/essays/gohs-folly">Goh's Folly: Seeing What Others Couldn't</a>
		</p>
		<p class="essay-sentence">
			Sometimes, we have to devote many years of our life into something that might not work - a
			four-chapter essay on originality, courage, based on Singapore's founding story
		</p>
	</div>
	<div class="essay-item">
		{#if notionPlaying}
			<div class="essay-video-frame">
				<iframe
					src="https://www.youtube-nocookie.com/embed/DhyhHdN02xc?autoplay=1&rel=0"
					title="Beyond the features: what is the point of Notion?"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		{:else}
			<button
				type="button"
				class="essay-thumb-link essay-thumb-link-video"
				aria-label="Play video: Beyond the features: what is the point of Notion?"
				on:click={() => (notionPlaying = true)}
			>
				<img
					class="essay-thumb"
					src="/notion-essay-thumb.jpg"
					alt="Beyond the features: what is the point of Notion?"
				/>
				<span class="essay-play" aria-hidden="true">
					<svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
						<path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
					</svg>
				</span>
			</button>
		{/if}
		<p class="essay-title">Beyond the features: what is the point of Notion?</p>
		<p class="essay-sentence">
			True freedom to customize the UI by drag-and-drop, and databases
		</p>
	</div>
	<div class="essay-item">
		<div class="essay-thumb essay-thumb-placeholder" aria-hidden="true"></div>
		<p class="essay-title">《童年回憶：拜訪 Nero——忍鬥風雲 2 開發者》</p>
		<p class="essay-sentence">coming soon</p>
	</div>
</div>

<h2 class="section-label">music recordings</h2>

{#if $listenMode === 2}
	<p class="music-hint">
		Listening shelf is docked at the bottom — pick <em>official</em> Ashkenazy or
		<em>my playing</em>.
	</p>
{:else}
	{#if $listenMode === 3}
		<CompactMusicPlayer variant="section" />
	{/if}
	<MusicAlbums size={$listenMode === 3 ? 'md' : 'sm'} showOfficial />
{/if}

<section class="email-section" aria-labelledby="email-updates-label">
	<h2 class="section-label" id="email-updates-label">email updates</h2>
	<SubscribeForm compact />
</section>
</div>

<SiteFooter />

<script>
	import CompactMusicPlayer from '$lib/CompactMusicPlayer.svelte';
	import HomeAtmosphere from '$lib/HomeAtmosphere.svelte';
	import MusicAlbums from '$lib/MusicAlbums.svelte';
	import SiteFooter from '$lib/SiteFooter.svelte';
	import SubscribeForm from '$lib/SubscribeForm.svelte';
	import { listenMode } from '$lib/nowPlaying.js';

	let notionPlaying = false;
</script>

<style>
	.home {
		width: 100%;
		max-width: none;
		padding: 2.25rem 2rem 3.5rem;
		box-sizing: border-box;
	}

	.welcome {
		margin: 1.35rem 0 0.15em;
		font-size: 1.05rem;
		font-weight: 500;
		color: #2c2c2c;
		line-height: 1.5;
	}

	.welcome-sub {
		margin: 0.35em 0 0;
		max-width: 34rem;
		font-size: 0.95rem;
		font-weight: 400;
		color: #6a6a6a;
		line-height: 1.55;
	}

	.section-label {
		margin: 2.75em 0 0.85em;
		font-size: 1.05rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: lowercase;
		color: #2c2c2c;
		line-height: 1.3;
	}

	.welcome-sub + .section-label {
		margin-top: 2em;
	}

	.app-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		margin: 0;
	}

	.app-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 12px 12px 10px;
		border: 1px solid #ececec;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		box-sizing: border-box;
		background: transparent;
	}

	a.app-card:hover,
	a.app-card:focus {
		background: transparent;
		border-color: #ececec;
	}

	.app-card-ready .app-card-text strong {
		font-weight: 600;
		color: #1a1a1a;
	}

	.app-explore {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		margin-top: 6px;
		padding: 3px 9px;
		border: 1px solid #d8d8d8;
		border-radius: 999px;
		background: #fff;
		color: #2c2c2c;
		font-size: 0.72rem;
		font-weight: 500;
		line-height: 1.3;
		letter-spacing: 0.01em;
		text-decoration: none;
	}

	.app-explore:hover,
	.app-explore:focus {
		background: #fff;
		border-color: #d8d8d8;
		color: #2c2c2c;
	}

	.ready-tick {
		display: inline-flex;
		align-items: center;
		margin-left: 6px;
		vertical-align: -1px;
	}

	.app-card-quiet {
		opacity: 0.62;
		cursor: default;
		pointer-events: none;
	}

	.app-card-logo {
		width: 48px;
		height: 48px;
		object-fit: cover;
		flex-shrink: 0;
		border-radius: 8px;
	}

	.app-card-quiet .app-card-logo {
		filter: grayscale(0.35);
	}

	.app-card-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.app-card-text strong {
		display: inline-flex;
		align-items: center;
		font-weight: 500;
		font-size: 0.95rem;
		color: #2c2c2c;
	}

	.app-desc {
		font-size: 0.875rem;
		color: #6a6a6a;
		line-height: 1.4;
		font-weight: 400;
	}

	.app-status {
		font-size: 0.78rem;
		color: #9a9a9a;
		line-height: 1.4;
		font-weight: 400;
	}

	.essay-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin: 0;
		align-items: start;
		width: 100%;
		box-sizing: border-box;
	}

	.essay-item {
		min-width: 0;
		width: 100%;
	}

	.essay-thumb-link {
		display: block;
		position: relative;
		width: 100%;
		padding: 0;
		border: none;
		background: #fff;
		cursor: pointer;
		text-align: left;
		border-radius: 8px;
		overflow: hidden;
		isolation: isolate;
	}

	.essay-thumb {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		/* Parent clips radius — avoid dual-radius subpixel black fringe */
		border-radius: 0;
		transform: scale(1.02);
		transform-origin: center;
	}

	.essay-video-frame {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		overflow: hidden;
		background: #fff;
	}

	.essay-video-frame iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.essay-play {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		background: rgba(20, 20, 20, 0.72);
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
	}

	.essay-play svg {
		display: block;
		margin-left: 2px;
	}

	.essay-thumb-link-video:hover .essay-play {
		background: rgba(20, 20, 20, 0.86);
	}

	.essay-thumb-placeholder {
		background: #e8e8e8;
		border: 1px solid #ececec;
		box-sizing: border-box;
	}

	.essay-title {
		margin: 10px 0 4px;
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.4;
		color: #2c2c2c;
	}

	.essay-title a {
		color: inherit;
		text-decoration: none;
	}

	.essay-title a:hover {
		text-decoration: underline;
	}

	.essay-sentence {
		margin: 0;
		color: #6a6a6a;
		font-size: 0.84rem;
		line-height: 1.5;
		font-weight: 400;
	}

	.music-hint {
		margin: 0 0 2rem;
		max-width: 28rem;
		font-size: 0.9rem;
		line-height: 1.5;
		color: #6a6a6a;
	}

	.music-hint em {
		font-style: normal;
		font-weight: 500;
		color: #2c2c2c;
	}

	.email-section {
		margin-top: 0.5rem;
		padding-top: 0.25rem;
		max-width: 36rem;
	}

	@media (max-width: 900px) {
		.app-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 720px) {
		.app-cards {
			grid-template-columns: 1fr;
		}

		.essay-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
