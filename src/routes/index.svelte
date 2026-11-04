<p class="welcome">
	Welcome to my absolutely EPIC website, it's INSANE:
</p>

<h2 class="section-label">software apps</h2>

<div class="app-cards">
	{#each apps as app (app.name)}
		<a class="app-card" target="_blank" rel="noopener noreferrer" href={app.href}>
			<div class="app-card-top">
				<img class="app-card-logo" src={app.logo} alt="{app.name} logo" />
				<div class="app-card-heading">
					<div class="app-card-title-row">
						<strong class="app-card-name">{app.name}</strong>
						{#if app.started}
							<span class="app-card-year">{app.started}</span>
						{:else}
							<span class="app-card-year app-card-year-empty" aria-hidden="true"></span>
						{/if}
					</div>
					<p class="app-card-desc">{app.description}</p>
				</div>
			</div>

			{#if app.platforms && app.platforms.length}
				<ul class="app-card-platforms" aria-label="Platforms">
					{#each app.platforms as platform (platform)}
						<li class="app-platform-chip">{platform}</li>
					{/each}
				</ul>
			{/if}

			<div class="app-card-demo" aria-hidden="true"></div>
		</a>
	{/each}
</div>

<h2 class="section-label">video essays</h2>

<div class="essay-grid">
	<div class="essay-item">
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
	<div class="essay-item">
		<div class="essay-thumb essay-thumb-placeholder" aria-hidden="true"></div>
		<p class="essay-title">Goh's Folly: Seeing What Others Couldn't</p>
		<p class="essay-sentence">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
		</p>
	</div>
	<div class="essay-item">
		<div class="essay-thumb essay-thumb-placeholder" aria-hidden="true"></div>
		<p class="essay-title">《童年回憶：拜訪 Nero——忍鬥風雲 2 開發者》</p>
		<p class="essay-sentence">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud.
		</p>
	</div>
</div>

<h2 class="section-label">music recordings</h2>

<div class="music-row">
	<div class="music-item">
		<img src="david-goggins.png" alt="David Goggins running" />
		<div class="music-audio">
			<audio controls src="chopin-etude-1.mp3" type="audio/mp3"></audio>
		</div>
	</div>

	<div class="music-item">
		<img
			src="https://cdns-images.dzcdn.net/images/cover/d23308fd612026c39ba4ea5f3f99ab83/500x500.jpg"
			alt="Ghost in a Flower album cover"
		/>
		<div class="music-audio">
			<audio controls="true" src="ghost-in-a-flower.mp3" type="audio/mp3"></audio>
		</div>
	</div>

	<div class="music-item">
		<a
			href="https://www.youtube.com/watch?v=Aa8bXkRsP0A&list=OLAK5uy_lgovKkb1IAMZFrPWYa8_Dh71Kimw5RbjA&index=8"
			aria-label="All of Me on YouTube"
		>
			<img
				src="https://m.media-amazon.com/images/I/61b0Mz2-fDL._SY580_.jpg"
				alt="All of Me album cover"
			/>
		</a>
		<div class="music-audio">
			<audio controls="true" src="all-of-me.mp3" type="audio/mp3"></audio>
		</div>
	</div>

	<div class="bach-cover">
		Bach Prelude &amp; Fugue in D
	</div>
</div>

<main>
</main>

<script>
	const apps = [
		{
			name: 'actions.life',
			href: 'https://actions.life',
			logo: '/actions-life-logo.png',
			description: 'Put to-do lists on the calendar.',
			started: 2022,
			platforms: []
		},
		{
			name: 'explanations.io',
			href: 'https://explanations.io',
			logo: '/explanations-logo.png',
			description: 'Blackboard-video explanations.',
			started: 2018,
			platforms: []
		},
		{
			name: 'zetteldraw',
			href: 'https://zetteldraw.com',
			logo: '/zetteldraw-logo.png',
			description: 'Handwriting-first notes on a Boox.',
			platforms: []
		},
		{
			name: 'zen-message',
			href: 'https://zen-message.com',
			logo: '/zen-message-logo.jpg',
			description: 'A calmer, less interruptive messaging system.',
			platforms: []
		}
	];
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
		gap: 12px;
		margin: 0;
		align-items: stretch;
	}

	.app-card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 12px;
		border: 1px solid #ececec;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		box-sizing: border-box;
		background: transparent;
		min-width: 0;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.app-card:hover {
		background: #f7f7f7;
		border-color: #e0e0e0;
	}

	.app-card-top {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		min-width: 0;
	}

	.app-card-logo {
		width: 44px;
		height: 44px;
		object-fit: cover;
		flex-shrink: 0;
		border-radius: 8px;
	}

	.app-card-heading {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		flex: 1;
	}

	.app-card-title-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		min-width: 0;
	}

	.app-card-name {
		font-weight: 500;
		font-size: 0.95rem;
		color: #2c2c2c;
		line-height: 1.3;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.app-card-year {
		flex-shrink: 0;
		font-size: 0.78rem;
		font-weight: 400;
		color: #9a9a9a;
		letter-spacing: 0.01em;
		font-variant-numeric: tabular-nums;
		line-height: 1.3;
		min-width: 2.4em;
		text-align: right;
	}

	.app-card-year-empty {
		visibility: hidden;
		min-height: 1em;
	}

	.app-card-desc {
		margin: 0;
		font-size: 0.875rem;
		color: #6a6a6a;
		line-height: 1.45;
		font-weight: 400;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
	}

	.app-card-platforms {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.app-platform-chip {
		margin: 0;
		padding: 2px 7px;
		font-size: 0.72rem;
		font-weight: 400;
		line-height: 1.4;
		color: #7a7a7a;
		border: 1px solid #ececec;
		border-radius: 5px;
		background: #fafafa;
		letter-spacing: 0.01em;
	}

	.app-card-demo {
		margin-top: auto;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 7px;
		border: 1px dashed #ececec;
		background:
			linear-gradient(135deg, transparent 48%, #f3f3f3 48%, #f3f3f3 52%, transparent 52%),
			#fcfcfc;
		background-size: 10px 10px, auto;
		box-sizing: border-box;
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
	}

	.essay-thumb {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 8px;
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

	.music-row {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0 0 2rem;
		align-items: flex-start;
	}

	.music-item {
		width: 200px;
		flex-shrink: 0;
	}

	.music-item img {
		display: block;
		width: 200px;
		height: auto;
	}

	.music-audio audio {
		width: 200px;
		display: block;
	}

	.bach-cover {
		width: 200px;
		height: 200px;
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
		flex-shrink: 0;
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
