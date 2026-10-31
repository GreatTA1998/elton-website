<script>
	export let essay;
</script>

<article class="essay">
	<header class="top">
		<p class="crumb"><a href="/">Home</a><span class="sep">/</span><span>Essay</span></p>
		<h1 class="essay-title">{essay.title}</h1>
		{#if essay.lede}
			<p class="essay-lede">{essay.lede}</p>
		{/if}
	</header>

	{#each essay.sections as section (section.id)}
		<section class="section" id={section.id}>
			<h2 class="section-title">{section.title}</h2>

			{#each section.blocks as block, blockIndex (`${section.id}-${blockIndex}`)}
				{#if block.type === 'p'}
					<p class="body">{block.text}</p>
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
						<img src={block.src} alt={block.alt} />
					</figure>
				{/if}
			{/each}
		</section>
	{/each}
</article>

<style>
	.essay {
		width: 100%;
		max-width: none;
		margin: 0;
		padding: 1.35rem 2.5rem 2.75rem;
		box-sizing: border-box;
	}

	.top {
		margin-bottom: 1.35rem;
		max-width: 72rem;
	}

	.crumb {
		margin: 0 0 0.85rem;
		font-size: 0.8rem;
		color: #6a6a6a;
	}

	.crumb a {
		text-decoration: none;
	}

	.crumb a:hover {
		text-decoration: underline;
		color: #2c2c2c;
	}

	.sep {
		margin: 0 0.4em;
		color: #c0c0c0;
	}

	.essay-title {
		margin: 0 0 0.35em;
		font-size: clamp(1.55rem, 2.4vw, 2.05rem);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.2;
		color: #2c2c2c;
		max-width: 22ch;
	}

	.essay-lede {
		margin: 0;
		font-size: clamp(0.98rem, 1.15vw, 1.08rem);
		line-height: 1.55;
		color: #4a4a4a;
		max-width: 62rem;
	}

	.section {
		margin: 0 0 1.35rem;
		max-width: 72rem;
	}

	.section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		margin: 0 0 0.55rem;
		font-size: clamp(1.05rem, 1.35vw, 1.2rem);
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.3;
		color: #2c2c2c;
	}

	.body {
		margin: 0 0 0.7em;
		font-size: clamp(0.95rem, 1.05vw, 1.05rem);
		line-height: 1.58;
		color: #2c2c2c;
		max-width: 62rem;
	}

	.body:last-child {
		margin-bottom: 0;
	}

	.quote {
		margin: 0 0 0.85rem;
		padding: 0.7rem 0.95rem;
		border-left: 2px solid #2c2c2c;
		background: #fafafa;
		border-radius: 0 8px 8px 0;
		max-width: 62rem;
		box-sizing: border-box;
	}

	.quote p {
		margin: 0 0 0.55em;
		font-size: clamp(0.92rem, 1.02vw, 1.02rem);
		line-height: 1.55;
		color: #2c2c2c;
	}

	.quote p:last-of-type {
		margin-bottom: 0.55em;
	}

	.quote p:only-child,
	.quote p:last-of-type:last-child {
		margin-bottom: 0;
	}

	.attribution {
		margin: 0.55rem 0 0;
		font-size: 0.82rem;
		line-height: 1.4;
		color: #6a6a6a;
	}

	.figure {
		margin: 0.15rem 0 0.85rem;
		max-width: 72rem;
	}

	.figure img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 8px;
		border: 1px solid #ececec;
		background: #fff;
	}

	@media (max-width: 720px) {
		.essay {
			padding: 1.15rem 1.15rem 2.25rem;
		}

		.essay-title {
			max-width: none;
		}
	}
</style>
