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
		font-size: 16px;
		font-weight: 400;
		color: #2c2c2c;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: #ffffff;
		min-height: 100vh;
	}

	:global(body > div) {
		max-width: 1100px;
		padding: 2.25rem 1.75rem 3.5rem;
		box-sizing: border-box;
	}

	.intro {
		margin: 0 0 0.55em;
		color: #555;
		line-height: 1.6;
		max-width: 34em;
		font-size: 1.05rem;
		font-weight: 400;
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
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin: 0;
		align-items: start;
		max-width: 480px;
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
		border-radius: 8px;
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

	.empty-frame {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		border: 1px solid #ececec;
		background: #f6f6f6;
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
		margin: 0 0 2rem;
	}

	.bach-cover {
		width: 400px;
		height: 400px;
		box-sizing: border-box;
		border: 1px solid #ececec;
		border-radius: 8px;
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
