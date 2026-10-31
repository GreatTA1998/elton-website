<script>
	import { onMount, onDestroy } from 'svelte';

	export let essay;

	const STORAGE_KEY = 'essay-font-scale';
	const MIN_SCALE = 0.8;
	const MAX_SCALE = 1.6;
	const STEP = 0.2;

	let fontScale = 1;
	/** @type {{ src: string, alt: string } | null} */
	let lightbox = null;

	onMount(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = parseFloat(saved);
				if (!Number.isNaN(parsed)) {
					fontScale = snap(parsed);
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

	function clamp(value) {
		return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
	}

	function snap(value) {
		const stepped = Math.round(value / STEP) * STEP;
		return Math.round(clamp(stepped) * 100) / 100;
	}

	function setScale(value) {
		fontScale = snap(value);
		try {
			localStorage.setItem(STORAGE_KEY, String(fontScale));
		} catch (err) {
			// ignore storage errors
		}
	}

	function onScaleInput(event) {
		setScale(parseFloat(event.currentTarget.value));
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
	$: seriesLabel = series ? `${series.title} · Chapter ${series.chapter}` : '';
	$: nextChapter = essay.nextChapter || null;
	$: nextHref = nextChapter && nextChapter.href ? nextChapter.href : '';
	$: nextEnabled = Boolean(nextHref);
	$: nextLabel = (nextChapter && nextChapter.label) || 'Next chapter';
	$: nextTitle = (nextChapter && nextChapter.title) || '';
</script>

<article class="essay" style="--essay-scale: {fontScale}">
	<header class="top">
		<div class="top-bar">
			<div class="top-bar-start">
				<p class="crumb">
					<a href="/">Home</a><span class="sep">/</span>
					{#if series}
						<span class="series-label" title={seriesLabel}
							>{seriesName}<span class="series-sep" aria-hidden="true">·</span>Chapter {series.chapter}</span
						>
					{:else}
						<span>Essay</span>
					{/if}
				</p>
			</div>

			<label class="font-control" title="Adjust text size">
				<span class="font-label">Text size</span>
				<input
					class="font-slider"
					type="range"
					min={MIN_SCALE}
					max={MAX_SCALE}
					step={STEP}
					value={fontScale}
					on:input={onScaleInput}
					aria-valuetext="{Math.round(fontScale * 100)} percent"
					aria-label="Text size"
				/>
				<span class="font-value" aria-hidden="true">{Math.round(fontScale * 100)}%</span>
			</label>
		</div>

		<h1 class="essay-title">{essay.title}</h1>

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

		{#if essay.lede}
			<p class="essay-lede">{essay.lede}</p>
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
		max-width: none;
		margin: 0;
		padding: 1.35rem 2.5rem 2.75rem;
		box-sizing: border-box;
	}

	.top {
		margin-bottom: 1.25rem;
		max-width: 72rem;
	}

	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1rem;
		margin: 0 0 0.85rem;
		flex-wrap: wrap;
	}

	.top-bar-start {
		display: flex;
		align-items: center;
		gap: 0.55rem 0.85rem;
		min-width: 0;
		flex: 1 1 auto;
		flex-wrap: wrap;
	}

	.crumb {
		margin: 0;
		font-size: 0.8rem;
		color: #6a6a6a;
		min-width: 0;
		white-space: nowrap;
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
		white-space: nowrap;
	}

	.series-sep {
		margin: 0 0.35em;
		color: #c0c0c0;
	}

	.font-control {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		margin-left: auto;
		padding: 0;
		border: none;
		border-radius: 0;
		background: transparent;
		font-size: 0.78rem;
		color: #6a6a6a;
		user-select: none;
		width: fit-content;
		max-width: 100%;
		box-sizing: border-box;
		flex: 0 0 auto;
	}

	.font-label {
		font-weight: 500;
		letter-spacing: 0.01em;
		white-space: nowrap;
	}

	.font-slider {
		width: 72px;
		accent-color: #2c2c2c;
		cursor: pointer;
		flex: 0 0 auto;
	}

	.font-value {
		min-width: 2.4rem;
		font-variant-numeric: tabular-nums;
		font-weight: 500;
		color: #6a6a6a;
	}

	.essay-title {
		margin: 0 0 0.75rem;
		font-size: calc(clamp(1.55rem, 2.4vw, 2.05rem) * var(--essay-scale));
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.2;
		color: #2c2c2c;
		max-width: none;
	}

	.hero-figure {
		margin: 0 0 0.95rem;
		max-width: min(36rem, 100%);
	}

	.image-button {
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: zoom-in;
		text-align: left;
	}

	.hero-figure img,
	.figure img {
		display: block;
		width: 100%;
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
		margin: 0;
		font-size: calc(clamp(0.98rem, 1.15vw, 1.08rem) * var(--essay-scale));
		line-height: 1.55;
		color: #4a4a4a;
		max-width: 62rem;
	}

	.section {
		margin: 0 0 1.25rem;
		max-width: 72rem;
	}

	.section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		margin: 0 0 0.5rem;
		font-size: calc(clamp(1.05rem, 1.35vw, 1.2rem) * var(--essay-scale));
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.3;
		color: #2c2c2c;
	}

	.body {
		margin: 0 0 0.65em;
		font-size: calc(clamp(0.95rem, 1.05vw, 1.05rem) * var(--essay-scale));
		line-height: 1.58;
		color: #2c2c2c;
		max-width: 62rem;
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
		padding: 0.65rem 0.9rem;
		border-left: 2px solid #2c2c2c;
		background: #fafafa;
		border-radius: 0 8px 8px 0;
		max-width: 62rem;
		box-sizing: border-box;
	}

	.quote p {
		margin: 0 0 0.5em;
		font-size: calc(clamp(0.92rem, 1.02vw, 1.02rem) * var(--essay-scale));
		line-height: 1.55;
		color: #2c2c2c;
	}

	.quote p:last-of-type {
		margin-bottom: 0.5em;
	}

	.quote p:only-child,
	.quote p:last-of-type:last-child {
		margin-bottom: 0;
	}

	.attribution {
		margin: 0.5rem 0 0;
		font-size: calc(0.82rem * var(--essay-scale));
		line-height: 1.4;
		color: #6a6a6a;
	}

	.figure {
		margin: 0.15rem 0 0.8rem;
		max-width: min(36rem, 100%);
	}

	.chapter-nav {
		margin: 1.75rem 0 0;
		max-width: 62rem;
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
			padding: 1.15rem 1.15rem 2.25rem;
		}
	}
</style>
