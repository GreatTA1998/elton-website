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
		font-size: 15px;
		font-weight: 400;
		color: #1e1e1e;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: #f5f5f5;
		min-height: 100vh;
	}

	:global(body > div) {
		padding: 1.5rem 1.75rem 2.75rem;
		box-sizing: border-box;
	}

	.intro {
		margin: 0 0 0.65em;
		color: #757575;
		line-height: 1.55;
		max-width: 36em;
		font-size: 15px;
		font-weight: 400;
	}

	.welcome {
		margin: 0 0 0.25em;
		font-size: 16px;
		font-weight: 500;
		color: #1e1e1e;
		line-height: 1.45;
	}

	.section-label {
		margin: 3em 0 1em;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.01em;
		text-transform: lowercase;
		color: #1e1e1e;
		line-height: 1.25;
	}

	.welcome + .section-label {
		margin-top: 1.75em;
	}

	.app-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		margin: 0 0 8px;
	}

	.app-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px;
		border: 1px solid #e5e5e5;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		box-sizing: border-box;
		background: #ffffff;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.app-card:hover {
		background: #fafafa;
		border-color: #d0d0d0;
	}

	.app-card-logo {
		width: 56px;
		height: 56px;
		object-fit: cover;
		flex-shrink: 0;
		border-radius: 10px;
	}

	.app-card-text {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.app-card-text strong {
		font-weight: 600;
		font-size: 15px;
		color: #1e1e1e;
	}

	.app-card-text span {
		font-size: 14px;
		color: #757575;
		line-height: 1.35;
		font-weight: 400;
	}

	.essay-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin: 0 0 8px;
		align-items: start;
		max-width: 520px;
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
		border-radius: 10px;
		border: 1px solid #e5e5e5;
	}

	.essay-title {
		margin: 10px 0 4px;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.35;
		color: #1e1e1e;
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
		color: #757575;
		font-size: 13px;
		line-height: 1.45;
		font-weight: 400;
	}

	.empty-frame {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 10px;
		border: 1px solid #e5e5e5;
		background: #f0f0f0;
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
		border: 1px solid #e5e5e5;
		border-radius: 12px;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 16px;
		color: #1e1e1e;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-weight: 500;
		font-size: 15px;
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
