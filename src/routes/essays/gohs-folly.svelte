<script>
	import SiteFooter from '$lib/SiteFooter.svelte';
	import { SERIES_PARTS, SERIES_TITLE } from '$lib/essays/series.js';
</script>

<svelte:head>
	<title>{SERIES_TITLE}</title>
	<meta
		name="description"
		content="A four-chapter essay on originality, courage, based on Singapore's founding story."
	/>
</svelte:head>

<div class="intro">
	<p class="back"><a href="/">← Home</a></p>

	<div class="lead">
		<div class="cover-wrap">
			<picture>
				<source srcset="/gohs-folly-cover.avif" type="image/avif" />
				<source srcset="/gohs-folly-cover.webp" type="image/webp" />
				<img
					class="cover"
					src="/gohs-folly-cover.jpg"
					alt="Goh's Folly series cover"
					width="640"
					height="360"
					decoding="async"
				/>
			</picture>
		</div>

		<div class="copy">
			<h1 class="title">{SERIES_TITLE}</h1>
			<p class="blurb">
				Sometimes, we have to devote many years of our life into something that might not work - a
				four-chapter essay on originality, courage, based on Singapore's founding story
			</p>
		</div>
	</div>

	<ol class="chapters" aria-label="Preface and chapters">
		{#each SERIES_PARTS as part (part.id)}
			<li>
				<a class="chapter" href={part.href}>
					<span class="chapter-label">{part.label}</span>
					<span class="chapter-title">{part.title}</span>
				</a>
			</li>
		{/each}
	</ol>
</div>

<SiteFooter />

<style>
	.intro {
		width: 100%;
		max-width: 40rem;
		padding: 2.25rem 2rem 4rem;
		box-sizing: border-box;
	}

	.back {
		margin: 0 0 2rem;
		font-size: 0.9rem;
		color: #6a6a6a;
	}

	.back a {
		text-decoration: none;
	}

	.back a:hover {
		text-decoration: underline;
		color: #2c2c2c;
	}

	.lead {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		margin: 0 0 2rem;
	}

	.cover-wrap {
		display: block;
		width: min(100%, 22rem);
		line-height: 0;
		border-radius: 10px;
		overflow: hidden;
	}

	.cover {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		object-position: center;
	}

	.title {
		margin: 0 0 0.45em;
		font-size: 1.35rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: #2c2c2c;
		line-height: 1.3;
	}

	.blurb {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: #6a6a6a;
		max-width: 32rem;
	}

	.chapters {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		border-top: 1px solid #ececec;
		padding-top: 1rem;
	}

	.chapter {
		display: grid;
		grid-template-columns: 6.5rem minmax(0, 1fr);
		gap: 0.75rem;
		align-items: baseline;
		padding: 0.7rem 0.15rem;
		text-decoration: none;
		color: inherit;
		border-radius: 8px;
		transition: background-color 0.15s ease;
	}

	.chapter:hover {
		background: #fafafa;
	}

	.chapter-label {
		font-size: 0.8rem;
		font-weight: 500;
		color: #8a8a8a;
		letter-spacing: 0.01em;
	}

	.chapter-title {
		font-size: 0.98rem;
		font-weight: 500;
		color: #2c2c2c;
		line-height: 1.4;
	}

	.chapter:hover .chapter-title {
		text-decoration: underline;
		text-decoration-color: #d0d0d0;
		text-underline-offset: 0.15em;
	}

	@media (max-width: 520px) {
		.intro {
			padding: 1.5rem 1.15rem 3.25rem;
		}

		.chapter {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}
	}
</style>
