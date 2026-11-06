<div class="home">
<p class="welcome">
	Welcome to my absolutely EPIC website, it's INSANE:
</p>

<h2 class="section-label">software apps</h2>

<div class="app-cards">
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://actions.life">
		<img class="app-card-logo" src="/actions-life-logo.png" alt="actions.life logo" />
		<div class="app-card-text">
			<strong>actions.life</strong>
			<span>2022 – current (fully active)</span>
		</div>
	</a>
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://explanations.io">
		<img class="app-card-logo" src="/explanations-logo.png" alt="explanations.io logo" />
		<div class="app-card-text">
			<strong>explanations.io</strong>
			<span>2018 (in development) – current</span>
		</div>
	</a>
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://zetteldraw.com">
		<img class="app-card-logo" src="/zetteldraw-logo.png" alt="zetteldraw logo" />
		<div class="app-card-text">
			<strong>zetteldraw</strong>
			<span>2026 (in private testing) – current</span>
		</div>
	</a>
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://zen-message.com">
		<img class="app-card-logo" src="/zen-message-logo.jpg" alt="zen-message logo" />
		<div class="app-card-text">
			<strong>zen-message</strong>
			<span>2024 (in development)</span>
		</div>
	</a>
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
			Sometimes, we have to devote many years of our life into something that might not work — a
			four-chapter essay on Singapore, originality, and courage.
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
			Notion's two innovations: navigating your own content freely, and organizing it beyond folders and notes.
		</p>
	</div>
	<div class="essay-item">
		<div class="essay-thumb essay-thumb-placeholder" aria-hidden="true"></div>
		<p class="essay-title">《童年回憶：拜訪 Nero——忍鬥風雲 2 開發者》</p>
		<p class="essay-sentence">coming soon</p>
	</div>
</div>

<h2 class="section-label">music recordings</h2>

<div class="music-row">
	<div class="music-item">
		<div class="music-cover">
			<img
				src="https://cdns-images.dzcdn.net/images/cover/d23308fd612026c39ba4ea5f3f99ab83/500x500.jpg"
				alt="Ghost in a Flower album cover"
			/>
			<div class="music-audio">
				<audio controls src="ghost-in-a-flower.mp3" type="audio/mp3"></audio>
			</div>
		</div>
	</div>

	<div class="music-item">
		<div class="music-cover">
			<a
				class="music-cover-link"
				href="https://www.youtube.com/watch?v=Aa8bXkRsP0A&list=OLAK5uy_lgovKkb1IAMZFrPWYa8_Dh71Kimw5RbjA&index=8"
				aria-label="All of Me on YouTube"
			>
				<img
					src="https://m.media-amazon.com/images/I/61b0Mz2-fDL._SY580_.jpg"
					alt="All of Me album cover"
				/>
			</a>
			<div class="music-audio">
				<audio controls src="all-of-me.mp3" type="audio/mp3"></audio>
			</div>
		</div>
	</div>

	<div class="bach-cover">
		Bach Prelude &amp; Fugue in D
	</div>
</div>

<section class="email-section" aria-labelledby="email-updates-label">
	<h2 class="section-label" id="email-updates-label">email updates</h2>
	<SubscribeForm compact />
</section>
</div>

<script>
	import SubscribeForm from '$lib/SubscribeForm.svelte';

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
		margin: 0 0 0.15em;
		font-size: 1.05rem;
		font-weight: 500;
		color: #2c2c2c;
		line-height: 1.5;
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

	.welcome + .section-label {
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
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.app-card:hover {
		background: #f7f7f7;
		border-color: #e0e0e0;
	}

	.app-card-logo {
		width: 48px;
		height: 48px;
		object-fit: cover;
		flex-shrink: 0;
		border-radius: 8px;
	}

	.app-card-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.app-card-text strong {
		font-weight: 500;
		font-size: 0.95rem;
		color: #2c2c2c;
	}

	.app-card-text span {
		font-size: 0.875rem;
		color: #6a6a6a;
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
		background: transparent;
		cursor: pointer;
		text-align: left;
	}

	.essay-thumb {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 8px;
	}

	.essay-video-frame {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		overflow: hidden;
		background: #111;
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

	.essay-thumb-written {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fafafa;
	}

	.essay-thumb-written span {
		font-size: 0.8rem;
		font-weight: 500;
		color: #6a6a6a;
		letter-spacing: 0.02em;
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

	.music-row {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 0 0 2rem;
		align-items: flex-start;
	}

	.music-item {
		width: 200px;
		flex-shrink: 0;
	}

	.music-cover {
		position: relative;
		width: 200px;
		border-radius: 10px;
		overflow: hidden;
		isolation: isolate;
		background: #f0f0f0;
	}

	.music-cover-link {
		display: block;
		line-height: 0;
	}

	.music-cover img {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}

	.music-audio {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: 8px;
		z-index: 2;
		padding: 5px 7px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.34);
		border: 1px solid rgba(255, 255, 255, 0.55);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
		backdrop-filter: blur(16px) saturate(1.35);
		-webkit-backdrop-filter: blur(16px) saturate(1.35);
		box-sizing: border-box;
	}

	.music-audio audio {
		width: 100%;
		height: 28px;
		display: block;
		opacity: 0.92;
	}

	.bach-cover {
		width: 200px;
		height: 200px;
		box-sizing: border-box;
		border: 1px solid #ececec;
		border-radius: 10px;
		background: #fafafa;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 16px;
		color: #555;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-weight: 400;
		font-size: 0.95rem;
		flex-shrink: 0;
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
