<p class="intro">
	Hi — glad you stopped by. Here's a little of what I've been making.
</p>

<p class="welcome">
	Welcome to my absolutely EPIC website, it's INSANE:
</p>

<h2 class="section-label">software apps</h2>

<div class="app-cards">
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://actions.life">
		<img class="app-card-logo" src="/actions-life-logo.png" alt="actions.life logo" />
		<div class="app-card-text">
			<strong>actions.life</strong>
			<span>Put to-do lists on the calendar.</span>
		</div>
	</a>
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://explanations.io">
		<img class="app-card-logo" src="/explanations-logo.png" alt="explanations.io logo" />
		<div class="app-card-text">
			<strong>explanations.io</strong>
			<span>Blackboard-video explanations.</span>
		</div>
	</a>
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://zetteldraw.com">
		<img class="app-card-logo" src="/zetteldraw-logo.png" alt="zetteldraw logo" />
		<div class="app-card-text">
			<strong>zetteldraw</strong>
			<span>Handwriting-first notes on a Boox.</span>
		</div>
	</a>
	<a class="app-card" target="_blank" rel="noopener noreferrer" href="https://zen-message.com">
		<img class="app-card-logo" src="/zen-message-logo.jpg" alt="zen-message logo" />
		<div class="app-card-text">
			<strong>zen-message</strong>
			<span>A calmer, less interruptive messaging system.</span>
		</div>
	</a>
</div>

<h2 class="section-label">video essays</h2>

<div class="essay-grid">
	<div class="essay-left">
		<a
			class="essay-thumb-link"
			target="_blank"
			rel="noopener noreferrer"
			href="https://www.youtube.com/watch?v=DhyhHdN02xc"
		>
			<img
				class="essay-thumb"
				src="/notion-essay-thumb.jpg"
				alt="Beyond the features: what is the point of Notion?"
			/>
		</a>
		<p class="essay-title">
			<a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=DhyhHdN02xc">
				Beyond the features: what is the point of Notion?
			</a>
		</p>
		<p class="essay-sentence">
			Notion's two innovations: navigating your own content freely, and organizing it beyond folders and notes.
		</p>
	</div>
	<div class="empty-frame empty-frame-top" aria-hidden="true"></div>
	<div class="empty-frame empty-frame-bottom" aria-hidden="true"></div>
</div>

<h2 class="section-label">music recordings</h2>

<div class="music-row">
	<div class="music-item">
		<img src="david-goggins.png" alt="David Goggins running" width="400" height="300" />
		<div class="music-audio">
			<audio controls src="chopin-etude-1.mp3" type="audio/mp3" style="width: 400px;"></audio>
		</div>
	</div>

	<div class="music-item">
		<img
			src="https://cdns-images.dzcdn.net/images/cover/d23308fd612026c39ba4ea5f3f99ab83/500x500.jpg"
			width="400"
			alt="Ghost in a Flower album cover"
		/>
		<div>
			<audio controls="true" src="ghost-in-a-flower.mp3" type="audio/mp3" style="width: 400px;"></audio>
		</div>
	</div>

	<div class="music-item">
		<a
			href="https://www.youtube.com/watch?v=Aa8bXkRsP0A&list=OLAK5uy_lgovKkb1IAMZFrPWYa8_Dh71Kimw5RbjA&index=8"
			aria-label="All of Me on YouTube"
		>
			<img
				src="https://m.media-amazon.com/images/I/61b0Mz2-fDL._SY580_.jpg"
				width="400"
				alt="All of Me album cover"
			/>
		</a>
		<div>
			<audio controls="true" src="all-of-me.mp3" type="audio/mp3" style="width: 400px;"></audio>
		</div>
	</div>

	<div class="bach-cover">
		Bach Prelude &amp; Fugue in D
	</div>
</div>

<main>
</main>

<script>
</script>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-weight: 400;
		color: #1c1c1c;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background:
			radial-gradient(ellipse 120% 80% at 10% -10%, rgba(210, 222, 236, 0.55), transparent 55%),
			radial-gradient(ellipse 90% 70% at 95% 8%, rgba(220, 228, 236, 0.4), transparent 50%),
			linear-gradient(180deg, #eef1f5 0%, #f4f6f8 42%, #eef1f4 100%);
		background-attachment: fixed;
		min-height: 100vh;
	}

	:global(body > div) {
		padding: 1.25rem 1.5rem 2.5rem;
		box-sizing: border-box;
	}

	.intro {
		margin: 0 0 0.6em;
		color: #3a3a3a;
		line-height: 1.55;
		max-width: 36em;
		font-size: 1rem;
		font-weight: 400;
	}

	.welcome {
		margin: 0 0 0.25em;
		font-size: 1.05rem;
		font-weight: 500;
		color: #1c1c1c;
		line-height: 1.45;
	}

	.section-label {
		margin: 2.75em 0 0.85em;
		font-size: 1.45rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		text-transform: lowercase;
		color: #1c1c1c;
		line-height: 1.25;
	}

	.welcome + .section-label {
		margin-top: 1.35em;
	}

	.app-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 14px;
		margin: 0 0 8px;
	}

	.app-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 16px;
		border: 1px solid rgba(255, 255, 255, 0.65);
		border-radius: 16px;
		text-decoration: none;
		color: inherit;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.48);
		-webkit-backdrop-filter: blur(18px) saturate(1.35);
		backdrop-filter: blur(18px) saturate(1.35);
		box-shadow:
			0 1px 1px rgba(255, 255, 255, 0.55) inset,
			0 1px 2px rgba(30, 40, 60, 0.04),
			0 6px 16px rgba(30, 40, 60, 0.06),
			0 14px 36px rgba(30, 40, 60, 0.05);
		transition:
			box-shadow 0.22s ease,
			transform 0.22s ease,
			background-color 0.22s ease,
			border-color 0.22s ease;
	}

	.app-card:hover {
		background: rgba(255, 255, 255, 0.62);
		border-color: rgba(255, 255, 255, 0.85);
		transform: translateY(-2px);
		box-shadow:
			0 1px 1px rgba(255, 255, 255, 0.7) inset,
			0 2px 4px rgba(30, 40, 60, 0.05),
			0 10px 24px rgba(30, 40, 60, 0.08),
			0 20px 44px rgba(30, 40, 60, 0.07);
	}

	.app-card-logo {
		width: 56px;
		height: 56px;
		object-fit: cover;
		flex-shrink: 0;
		border-radius: 12px;
	}

	.app-card-text {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.app-card-text strong {
		font-weight: 600;
		font-size: 1.02em;
		color: #1c1c1c;
	}

	.app-card-text span {
		font-size: 0.92em;
		color: #4a4a4a;
		line-height: 1.35;
		font-weight: 400;
	}

	.essay-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 11px;
		margin: 0 0 8px;
		align-items: start;
		max-width: 620px;
	}

	.essay-left {
		min-width: 0;
	}

	.essay-thumb-link {
		display: block;
	}

	.essay-thumb {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 12px;
		box-shadow:
			0 1px 2px rgba(30, 40, 60, 0.05),
			0 6px 16px rgba(30, 40, 60, 0.07);
	}

	.essay-title {
		margin: 10px 0 4px;
		font-size: 0.92rem;
		font-weight: 600;
		line-height: 1.35;
		color: #1c1c1c;
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
		color: #4a4a4a;
		font-size: 0.86rem;
		line-height: 1.45;
		font-weight: 400;
	}

	.empty-frame {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.55);
		background: rgba(255, 255, 255, 0.38);
		-webkit-backdrop-filter: blur(14px) saturate(1.2);
		backdrop-filter: blur(14px) saturate(1.2);
		box-shadow:
			0 1px 1px rgba(255, 255, 255, 0.45) inset,
			0 1px 2px rgba(30, 40, 60, 0.03),
			0 6px 14px rgba(30, 40, 60, 0.05);
	}

	.empty-frame-top {
		align-self: start;
	}

	.empty-frame-bottom {
		grid-column: 1;
	}

	.music-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0;
		margin: 0 0 28px;
	}

	.bach-cover {
		width: 400px;
		height: 400px;
		box-sizing: border-box;
		border: 1px solid rgba(255, 255, 255, 0.65);
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.48);
		-webkit-backdrop-filter: blur(18px) saturate(1.35);
		backdrop-filter: blur(18px) saturate(1.35);
		box-shadow:
			0 1px 1px rgba(255, 255, 255, 0.55) inset,
			0 1px 2px rgba(30, 40, 60, 0.04),
			0 6px 16px rgba(30, 40, 60, 0.06),
			0 14px 36px rgba(30, 40, 60, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 16px;
		color: #3a3a3a;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-weight: 500;
		font-size: 1rem;
	}

	@media (max-width: 900px) {
		.app-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 700px) {
		.app-cards {
			grid-template-columns: 1fr;
		}

		.essay-grid {
			grid-template-columns: 1fr;
			max-width: 100%;
		}

		.empty-frame-bottom {
			grid-column: 1;
		}
	}
</style>
