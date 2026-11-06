<script>
	import { onMount, onDestroy } from 'svelte';

	export let essay;

	const STORAGE_KEY = 'essay-font-scale';
	const FONT_SIZES = {
		default: 1,
		large: 1.2
	};

	/** @type {'default' | 'large'} */
	let fontSize = 'default';
	/** @type {{ src: string, alt: string } | null} */
	let lightbox = null;

	$: fontScale = FONT_SIZES[fontSize];

	onMount(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved === 'large' || saved === 'default') {
				fontSize = saved;
			} else if (saved) {
				const parsed = parseFloat(saved);
				if (!Number.isNaN(parsed)) {
					fontSize = parsed >= 1.15 ? 'large' : 'default';
				}
			}
		} catch (err) {
			// ignore storage errors
		}

		window.addEventListener('keydown', onKeydown);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', onKeydown);
		}
	});

	/** @param {'default' | 'large'} size */
	function setFontSize(size) {
		fontSize = size;
		try {
			localStorage.setItem(STORAGE_KEY, size);
		} catch (err) {
			// ignore storage errors
		}
	}

	function openLightbox(src, alt) {
		lightbox = { src, alt };
	}

	function closeLightbox() {
		lightbox = null;
	}

	function onKeydown(event) {
		if (event.key === 'Escape' && lightbox) {
			event.preventDefault();
			closeLightbox();
		}
	}

	$: series = essay.series || null;
	$: seriesName = series ? series.title : '';
	$: seriesHref = series && series.href ? series.href : '';
	$: seriesChapterLabel = series
		? series.part === 'preface'
			? 'Preface'
			: series.chapterCount
				? `Chapter ${series.chapter} of ${series.chapterCount}`
				: `Chapter ${series.chapter}`
		: '';
	$: seriesLabel = series ? `${series.title} · ${seriesChapterLabel}` : '';
	$: nextChapter = essay.nextChapter || null;
	$: nextHref = nextChapter && nextChapter.href ? nextChapter.href : '';
	$: nextEnabled = Boolean(nextHref);
	$: nextTitle = (nextChapter && nextChapter.title) || '';
	$: nextProgress =
		series && series.chapterCount
			? series.part === 'preface'
				? `1 of ${series.chapterCount}`
				: typeof series.chapter === 'number' && series.chapter < series.chapterCount
					? `${series.chapter + 1} of ${series.chapterCount}`
					: ''
			: '';
	$: nextLabel = nextProgress ? `Next · ${nextProgress}` : (nextChapter && nextChapter.label) || 'Next chapter';
	$: hasSeriesNav = Boolean(nextChapter);
	$: isSeriesEnd =
		Boolean(series) &&
		!nextChapter &&
		series.part === 'chapter' &&
		typeof series.chapter === 'number' &&
		series.chapterCount &&
		series.chapter >= series.chapterCount;
	$: showSeriesOpener = Boolean(series && series.part === 'preface');
</script>

<article class="essay" style="--essay-scale: {fontScale}">
	<header class="top">
		<div class="top-bar">
			<p class="crumb">
				<a href="/">Home</a><span class="sep">/</span>
				{#if series}
					<span class="series-label" title={seriesLabel}>
						{#if seriesHref}
							<a class="series-name" href={seriesHref}>{seriesName}</a>
						{:else}
							<span class="series-name">{seriesName}</span>
						{/if}
						<span class="series-sep" aria-hidden="true">·</span>
						<span class="series-chapter">{seriesChapterLabel}</span>
					</span>
				{:else}
					<span>Essay</span>
				{/if}
			</p>

			<div class="font-control" role="group" aria-label="Text size">
				<button
					type="button"
					class="font-choice size-default"
					class:active={fontSize === 'default'}
					aria-pressed={fontSize === 'default'}
					aria-label="Default text size"
					title="Default"
					on:click={() => setFontSize('default')}
				>
					aA
				</button>
				<button
					type="button"
					class="font-choice size-large"
					class:active={fontSize === 'large'}
					aria-pressed={fontSize === 'large'}
					aria-label="Large text size"
					title="Large"
					on:click={() => setFontSize('large')}
				>
					aA
				</button>
			</div>
		</div>

		{#if showSeriesOpener}
			<div class="series-opener">
				<h1 class="series-hero-title">{seriesName}</h1>
				{#if essay.heroImage}
					<figure class="series-cover">
						<button
							type="button"
							class="image-button"
							on:click={() =>
								openLightbox(
									essay.heroImage.avif || essay.heroImage.webp || essay.heroImage.src,
									essay.heroImage.alt
								)}
							aria-label="Expand cover image"
						>
							<picture>
								{#if essay.heroImage.avif}
									<source srcset={essay.heroImage.avif} type="image/avif" />
								{/if}
								{#if essay.heroImage.webp}
									<source srcset={essay.heroImage.webp} type="image/webp" />
								{/if}
								<img
									src={essay.heroImage.src}
									alt={essay.heroImage.alt}
									loading="eager"
									decoding="async"
								/>
							</picture>
						</button>
					</figure>
				{/if}
			</div>
			<h2 class="essay-title">{essay.title}</h2>
		{:else}
			<h1 class="essay-title">{essay.title}</h1>

			{#if essay.lede}
				<p class="essay-lede">{essay.lede}</p>
			{/if}

			{#if essay.heroImage}
				<figure class="hero-figure">
					<button
						type="button"
						class="image-button"
						on:click={() =>
							openLightbox(
								essay.heroImage.avif || essay.heroImage.webp || essay.heroImage.src,
								essay.heroImage.alt
							)}
						aria-label="Expand chart"
					>
						<picture>
							{#if essay.heroImage.avif}
								<source srcset={essay.heroImage.avif} type="image/avif" />
							{/if}
							{#if essay.heroImage.webp}
								<source srcset={essay.heroImage.webp} type="image/webp" />
							{/if}
							<img
								src={essay.heroImage.src}
								alt={essay.heroImage.alt}
								loading="lazy"
								decoding="async"
							/>
						</picture>
					</button>
				</figure>
			{/if}
		{/if}
	</header>

	{#each essay.sections as section (section.id)}
		<section class="section" id={section.id}>
			{#if section.title}
				<h2 class="section-title">{section.title}</h2>
			{/if}

			{#each section.blocks as block, blockIndex (`${section.id}-${blockIndex}`)}
				{#if block.type === 'p'}
					<p class="body">
						{#if block.parts}
							{#each block.parts as part, partIndex (`${section.id}-${blockIndex}-${partIndex}`)}
								{#if part.highlight}
									<mark class="doc-highlight">{part.text}</mark>
								{:else}
									{part.text}
								{/if}
							{/each}
						{:else}
							{block.text}
						{/if}
					</p>
				{:else if block.type === 'quote'}
					<blockquote class="quote">
						{#each block.paragraphs as qParagraph, qIndex (qIndex)}
							<p>{qParagraph}</p>
						{/each}
						{#if block.attribution}
							<footer class="attribution">— {block.attribution}</footer>
						{/if}
					</blockquote>
				{:else if block.type === 'excerpt'}
					<p class="excerpt-note">{block.text}</p>
				{:else if block.type === 'image'}
					<figure class="figure">
						<button
							type="button"
							class="image-button"
							on:click={() => openLightbox(block.avif || block.webp || block.src, block.alt)}
							aria-label="Expand image"
						>
							<picture>
								{#if block.avif}
									<source srcset={block.avif} type="image/avif" />
								{/if}
								{#if block.webp}
									<source srcset={block.webp} type="image/webp" />
								{/if}
								<img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
							</picture>
						</button>
					</figure>
				{/if}
			{/each}
		</section>
	{/each}

	{#if hasSeriesNav}
		<nav class="chapter-nav" aria-label="Series navigation">
			{#if nextEnabled}
				<a class="nav-link next" href={nextHref}>
					<span class="nav-kicker">{nextLabel}</span>
					{#if nextTitle}
						<span class="nav-title">{nextTitle}</span>
					{/if}
				</a>
			{:else}
				<span class="nav-link next is-disabled" aria-disabled="true" title="Coming soon">
					<span class="nav-kicker">{nextLabel}</span>
					{#if nextTitle}
						<span class="nav-title">{nextTitle}</span>
					{:else}
						<span class="nav-soon">Coming soon</span>
					{/if}
				</span>
			{/if}
		</nav>
	{:else if isSeriesEnd}
		<footer class="series-end">
			<p class="series-end-mark">The end</p>
			{#if essay.furtherReading}
				<div class="further-reading">
					<p class="further-label">{essay.furtherReading.label}</p>
					<ul class="further-list">
						{#each essay.furtherReading.items as item, itemIndex (itemIndex)}
							<li>
								{#if item.href}
									<a href={item.href} target="_blank" rel="noopener noreferrer"
										>{item.label}</a
									>
								{:else}
									{item.label}
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</footer>
	{/if}
</article>

{#if lightbox}
	<button
		type="button"
		class="lightbox"
		on:click={closeLightbox}
		aria-label="Close enlarged image"
	>
		<img src={lightbox.src} alt={lightbox.alt} />
	</button>
{/if}

<style>
	.essay {
		--essay-scale: 1;
		width: 100%;
		max-width: 100%;
		margin: 0;
		padding: 1.35rem 2.5rem calc(3.25rem + env(safe-area-inset-bottom, 0px));
		box-sizing: border-box;
		overflow-x: clip;
		min-width: 0;
	}

	.top,
	.section,
	.chapter-nav {
		width: 100%;
		max-width: min(72rem, 100%);
		min-width: 0;
		box-sizing: border-box;
	}

	.top {
		margin-bottom: 1.25rem;
	}

	.top-bar {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.65rem 1rem;
		margin: 0 0 0.85rem;
		flex-wrap: wrap;
		width: 100%;
		min-width: 0;
	}

	.crumb {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.4;
		color: #6a6a6a;
		min-width: 0;
		flex: 1 1 12rem;
		max-width: 100%;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.crumb a {
		text-decoration: none;
		color: inherit;
	}

	.crumb a:hover {
		text-decoration: underline;
		color: #2c2c2c;
	}

	.sep {
		margin: 0 0.4em;
		color: #c0c0c0;
	}

	.series-label {
		color: inherit;
	}

	.series-name,
	.series-chapter {
		display: inline;
	}

	.series-sep {
		margin: 0 0.35em;
		color: #c0c0c0;
	}

	.font-control {
		display: inline-flex;
		align-items: stretch;
		gap: 0;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		flex: 0 0 auto;
		max-width: 100%;
	}

	.font-choice {
		appearance: none;
		margin: 0;
		padding: 0;
		min-width: 44px;
		min-height: 44px;
		border: 1px solid #e0e0e0;
		background: #fff;
		color: #b5b5b5;
		font-family: inherit;
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.font-choice.size-default {
		font-size: 0.95rem;
		border-radius: 8px 0 0 8px;
		border-right-width: 0;
	}

	.font-choice.size-large {
		font-size: 1.55rem;
		border-radius: 0 8px 8px 0;
	}

	.font-choice:hover {
		color: #8a8a8a;
	}

	.font-choice.active {
		color: #1a1a1a;
		font-weight: 600;
		background: #fff;
		border-color: #e0e0e0;
	}

	.font-choice.active:hover {
		color: #000;
		border-color: #e0e0e0;
	}

	.font-choice.size-default.active {
		border-right-color: #e0e0e0;
	}

	.font-choice:focus-visible {
		outline: 2px solid #2c2c2c;
		outline-offset: 2px;
		z-index: 1;
	}

	.series-opener {
		margin: 0 0 1.65rem;
		max-width: min(62rem, 100%);
	}

	.series-hero-title {
		margin: 0 0 1rem;
		font-size: calc(clamp(1.9rem, 3.4vw, 2.75rem) * var(--essay-scale));
		font-weight: 600;
		letter-spacing: -0.035em;
		line-height: 1.15;
		color: #1f1f1f;
		max-width: 100%;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.series-cover {
		margin: 0;
		max-width: min(22rem, 100%);
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
	}

	.series-cover img {
		display: block;
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 0;
		border: 1px solid #ececec;
		background: #fff;
	}

	.essay-title {
		margin: 0 0 0.75rem;
		font-size: calc(clamp(1.55rem, 2.4vw, 2.05rem) * var(--essay-scale));
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.2;
		color: #2c2c2c;
		max-width: 100%;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.hero-figure,
	.figure {
		margin: 0 0 0.95rem;
		max-width: min(62rem, 100%);
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
	}

	.figure {
		margin: 0.15rem 0 0.8rem;
	}

	.image-button {
		display: block;
		width: 100%;
		max-width: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: zoom-in;
		text-align: left;
		min-width: 0;
		box-sizing: border-box;
	}

	.image-button picture {
		display: block;
		width: 100%;
	}

	.hero-figure img,
	.figure img {
		display: block;
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 0;
		border: none;
		background: #fff;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 40;
		margin: 0;
		padding: 1.5rem;
		border: none;
		background: rgba(255, 255, 255, 0.94);
		cursor: zoom-out;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		overflow: auto;
	}

	.lightbox img {
		display: block;
		max-width: min(1100px, 100%);
		max-height: calc(100vh - 3rem);
		width: auto;
		height: auto;
		border-radius: 8px;
		border: 1px solid #ececec;
		background: #fff;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
	}

	.essay-lede {
		margin: 0 0 0.95rem;
		font-size: calc(clamp(0.98rem, 1.15vw, 1.08rem) * var(--essay-scale));
		line-height: 1.55;
		color: #4a4a4a;
		max-width: min(62rem, 100%);
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.section {
		margin: 0 0 1.25rem;
	}

	.section:last-of-type {
		margin-bottom: 0;
	}

	.section-title {
		margin: 0 0 0.5rem;
		font-size: calc(clamp(1.05rem, 1.35vw, 1.2rem) * var(--essay-scale));
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.3;
		color: #2c2c2c;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.body {
		margin: 0 0 0.65em;
		font-size: calc(clamp(0.95rem, 1.05vw, 1.05rem) * var(--essay-scale));
		line-height: 1.58;
		color: #2c2c2c;
		max-width: min(62rem, 100%);
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.body:last-child {
		margin-bottom: 0;
	}

	.doc-highlight {
		background: #f6e7a3;
		color: inherit;
		padding: 0.05em 0.18em;
		border-radius: 2px;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
	}

	.quote {
		margin: 0 0 0.8rem;
		padding: 0.1rem 0 0.1rem 0.7rem;
		border: none;
		border-left: 1.5px solid #c8c8c8;
		background: transparent;
		border-radius: 0;
		max-width: min(62rem, 100%);
		width: 100%;
		box-sizing: border-box;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.quote p {
		margin: 0 0 0.5em;
		font-size: calc(clamp(0.95rem, 1.05vw, 1.05rem) * var(--essay-scale));
		line-height: 1.58;
		color: #555;
		font-weight: 400;
	}

	.quote p:last-of-type {
		margin-bottom: 0.5em;
	}

	.quote p:only-child,
	.quote p:last-of-type:last-child {
		margin-bottom: 0;
	}

	.attribution {
		margin: 0.45rem 0 0;
		font-size: calc(0.8rem * var(--essay-scale));
		line-height: 1.4;
		color: #8a8a8a;
		font-style: normal;
	}

	.excerpt-note {
		margin: 1rem 0 0;
		font-size: calc(0.82rem * var(--essay-scale));
		line-height: 1.45;
		color: #8a8a8a;
		font-style: italic;
		max-width: min(62rem, 100%);
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.chapter-nav {
		display: block;
		margin: 1.75rem 0 calc(1.25rem + env(safe-area-inset-bottom, 0px));
		max-width: min(62rem, 100%);
		padding-top: 1rem;
		padding-bottom: 0.35rem;
		border-top: 1px solid #ececec;
		box-sizing: border-box;
	}

	.series-end {
		margin: 2.25rem 0 calc(1.5rem + env(safe-area-inset-bottom, 0px));
		max-width: min(62rem, 100%);
		padding-top: 1.35rem;
		border-top: 1px solid #ececec;
		box-sizing: border-box;
	}

	.series-end-mark {
		margin: 0;
		font-size: calc(0.95rem * var(--essay-scale));
		line-height: 1.4;
		letter-spacing: 0.02em;
		color: #6a6a6a;
		font-style: italic;
		font-weight: 400;
	}

	.further-reading {
		margin: 1.35rem 0 0;
		max-width: min(36rem, 100%);
	}

	.further-label {
		margin: 0 0 0.55rem;
		font-size: calc(0.72rem * var(--essay-scale));
		line-height: 1.4;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: #9a9a9a;
		font-weight: 500;
	}

	.further-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.further-list li {
		margin: 0 0 0.45rem;
		font-size: calc(0.88rem * var(--essay-scale));
		line-height: 1.5;
		color: #6a6a6a;
	}

	.further-list li:last-child {
		margin-bottom: 0;
	}

	.further-list a {
		color: #4a4a4a;
		text-decoration: underline;
		text-decoration-color: #d4d4d4;
		text-underline-offset: 0.15em;
	}

	.further-list a:hover {
		color: #2c2c2c;
		text-decoration-color: #9a9a9a;
	}

	.nav-link {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		width: 100%;
		max-width: 100%;
		padding: 0.85rem 1rem;
		color: #2c2c2c;
		text-decoration: none;
		overflow-wrap: anywhere;
		word-break: break-word;
		box-sizing: border-box;
		min-width: 0;
		border: 1px solid #e4e4e4;
		border-radius: 10px;
		background: #fafafa;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.nav-link.next {
		align-items: flex-start;
		text-align: left;
	}

	a.nav-link:hover {
		background: #f3f3f3;
		border-color: #d4d4d4;
	}

	a.nav-link:hover .nav-kicker,
	a.nav-link:hover .nav-title {
		text-decoration: none;
	}

	.nav-link.is-disabled {
		color: #b0b0b0;
		background: #fcfcfc;
		border-color: #ececec;
		cursor: not-allowed;
		pointer-events: none;
		user-select: none;
	}

	.nav-kicker {
		font-size: 0.72rem;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: #6a6a6a;
		font-weight: 500;
	}

	.nav-link.is-disabled .nav-kicker {
		color: inherit;
	}

	.nav-title,
	.nav-soon {
		font-size: 0.95rem;
		line-height: 1.35;
		color: inherit;
		font-weight: 500;
	}

	.nav-soon {
		font-style: italic;
		font-weight: 400;
	}

	@media (max-width: 720px) {
		.essay {
			padding: 1.15rem 1rem calc(4.25rem + env(safe-area-inset-bottom, 0px));
		}

		.top-bar {
			align-items: stretch;
		}

		.font-control {
			margin-left: 0;
		}

		.chapter-nav {
			margin-bottom: calc(1.75rem + env(safe-area-inset-bottom, 0px));
			padding-bottom: 0.5rem;
		}

		.series-end {
			margin-bottom: calc(2rem + env(safe-area-inset-bottom, 0px));
			padding-bottom: 0.35rem;
		}

		.section {
			margin: 0 0 1.55rem;
		}

		.section-title {
			margin: 0 0 0.7rem;
		}

		.body {
			margin: 0 0 1.05em;
			line-height: 1.65;
		}

		.quote {
			margin: 0 0 1.15rem;
		}

		.quote p {
			margin: 0 0 0.7em;
			line-height: 1.65;
		}

		.figure {
			margin: 0.35rem 0 1.1rem;
		}

		.essay-lede {
			margin: 0 0 1.15rem;
			line-height: 1.62;
		}

		.hero-figure {
			margin: 0 0 1.15rem;
		}

		.lightbox {
			padding: 0;
			align-items: center;
			justify-content: stretch;
		}

		.lightbox img {
			width: 100%;
			max-width: 100%;
			max-height: 100vh;
			height: auto;
			border-radius: 0;
			border-left: none;
			border-right: none;
			box-shadow: none;
		}
	}
</style>
