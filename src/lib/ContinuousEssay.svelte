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
	$: seriesChapterLabel = series
		? series.chapterCount
			? `Chapter ${series.chapter} of ${series.chapterCount}`
			: `Chapter ${series.chapter}`
		: '';
	$: seriesLabel = series ? `${series.title} · ${seriesChapterLabel}` : '';
	$: nextChapter = essay.nextChapter || null;
	$: nextHref = nextChapter && nextChapter.href ? nextChapter.href : '';
	$: nextEnabled = Boolean(nextHref);
	$: nextLabel = (nextChapter && nextChapter.label) || 'Next chapter';
	$: nextTitle = (nextChapter && nextChapter.title) || '';
</script>

<article class="essay" style="--essay-scale: {fontScale}">
	<header class="top">
		<div class="top-bar">
			<p class="crumb">
				<a href="/">Home</a><span class="sep">/</span>
				{#if series}
					<span class="series-label" title={seriesLabel}>
						<span class="series-name">{seriesName}</span>
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

		<h1 class="essay-title">{essay.title}</h1>

		{#if essay.lede}
			<p class="essay-lede">{essay.lede}</p>
		{/if}

		{#if essay.heroImage}
			<figure class="hero-figure">
				<button
					type="button"
					class="image-button"
					on:click={() => openLightbox(essay.heroImage.src, essay.heroImage.alt)}
					aria-label="Expand chart"
				>
					<img src={essay.heroImage.src} alt={essay.heroImage.alt} />
				</button>
			</figure>
		{/if}
	</header>

	{#each essay.sections as section (section.id)}
		<section class="section" id={section.id}>
			<h2 class="section-title">{section.title}</h2>

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
				{:else if block.type === 'image'}
					<figure class="figure">
						<button
							type="button"
							class="image-button"
							on:click={() => openLightbox(block.src, block.alt)}
							aria-label="Expand image"
						>
							<img src={block.src} alt={block.alt} />
						</button>
					</figure>
				{/if}
			{/each}
		</section>
	{/each}

	{#if nextChapter}
		<nav class="chapter-nav" aria-label="Series navigation">
			{#if nextEnabled}
				<a class="next-chapter" href={nextHref}>
					<span class="next-kicker">{nextLabel}</span>
					{#if nextTitle}
						<span class="next-title">{nextTitle}</span>
					{/if}
				</a>
			{:else}
				<span class="next-chapter is-disabled" aria-disabled="true" title="Coming soon">
					<span class="next-kicker">{nextLabel}</span>
					{#if nextTitle}
						<span class="next-title">{nextTitle}</span>
					{:else}
						<span class="next-soon">Coming soon</span>
					{/if}
				</span>
			{/if}
		</nav>
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
		padding: 1.35rem 2.5rem 2.75rem;
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
		border: 1px solid #d8d8d8;
		background: #fff;
		color: #6a6a6a;
		font-family: inherit;
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.font-choice.size-default {
		font-size: 0.8rem;
		border-radius: 8px 0 0 8px;
		border-right-width: 0;
	}

	.font-choice.size-large {
		font-size: 1.05rem;
		border-radius: 0 8px 8px 0;
	}

	.font-choice:hover {
		color: #2c2c2c;
		background: #f7f7f7;
	}

	.font-choice.active {
		color: #2c2c2c;
		background: #f0f0f0;
		border-color: #c8c8c8;
	}

	.font-choice.size-default.active {
		border-right-color: #c8c8c8;
	}

	.font-choice:focus-visible {
		outline: 2px solid #2c2c2c;
		outline-offset: 1px;
		z-index: 1;
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
		max-width: min(36rem, 100%);
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

	.hero-figure img,
	.figure img {
		display: block;
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		border: 1px solid #ececec;
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

	.chapter-nav {
		margin: 1.75rem 0 0;
		max-width: min(62rem, 100%);
		padding-top: 1rem;
		border-top: 1px solid #ececec;
	}

	.next-chapter {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.2rem;
		max-width: 100%;
		padding: 0.15rem 0;
		color: #2c2c2c;
		text-decoration: none;
		overflow-wrap: anywhere;
		word-break: break-word;
		box-sizing: border-box;
	}

	a.next-chapter:hover .next-kicker,
	a.next-chapter:hover .next-title {
		text-decoration: underline;
	}

	.next-chapter.is-disabled {
		color: #b0b0b0;
		cursor: not-allowed;
		pointer-events: none;
		user-select: none;
	}

	.next-kicker {
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: inherit;
	}

	.next-title,
	.next-soon {
		font-size: 0.95rem;
		line-height: 1.35;
		color: inherit;
	}

	.next-soon {
		font-style: italic;
	}

	@media (max-width: 720px) {
		.essay {
			padding: 1.15rem 1rem 2.25rem;
		}

		.top-bar {
			align-items: stretch;
		}

		.font-control {
			margin-left: 0;
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
