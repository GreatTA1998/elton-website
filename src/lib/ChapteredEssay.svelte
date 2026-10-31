<script>
	import { fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	export let essay;

	let index = 0;

	$: chapters = essay.chapters;
	$: total = chapters.length;
	$: chapter = chapters[index];
	$: progress = total > 1 ? index / (total - 1) : 1;
	$: isFull = essay.layout === 'full';
	$: bodyParagraphs = chapter.paragraphs || [];

	function goTo(i) {
		if (i < 0 || i >= total) return;
		index = i;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function next() {
		goTo(index + 1);
	}

	function prev() {
		goTo(index - 1);
	}

	function onKey(event) {
		const tag = event.target && event.target.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

		if (event.key === 'ArrowRight' || event.key === 'j') {
			event.preventDefault();
			next();
		} else if (event.key === 'ArrowLeft' || event.key === 'k') {
			event.preventDefault();
			prev();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onKey);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', onKey);
		}
	});
</script>

<article class="essay" class:full={isFull} class:column={!isFull}>
	{#if isFull}
		<aside class="side-nav" aria-label="Chapters">
			<p class="side-label">Chapters</p>
			<p class="side-pos">{index + 1} / {total}</p>

			<div class="side-track" style="--progress: {progress}" aria-hidden="true">
				<div class="side-track-fill"></div>
			</div>

			<ol class="side-steps">
				{#each chapters as ch, i (ch.id)}
					<li>
						<button
							type="button"
							class="side-step"
							class:active={i === index}
							class:done={i < index}
							aria-current={i === index ? 'step' : undefined}
							on:click={() => goTo(i)}
						>
							<span class="side-num">{i + 1}</span>
							<span class="side-title">{ch.title}</span>
						</button>
					</li>
				{/each}
			</ol>

			<p class="side-hint">← → to move</p>
		</aside>
	{/if}

	<div class="main">
		<header class="top">
			<p class="crumb"><a href="/">Home</a><span class="sep">/</span><span>Essay</span></p>
			{#if isFull}
				<p class="layout-note">Full-width layout experiment</p>
			{/if}
			<h1 class="essay-title">{essay.title}</h1>
			{#if essay.lede}
				<p class="essay-lede">{essay.lede}</p>
			{:else if essay.summary}
				<p class="essay-summary">{essay.summary}</p>
			{/if}
		</header>

		{#if !isFull}
			<nav class="rail" aria-label="Chapters">
				<div class="rail-meta">
					<span class="pos">Chapter {index + 1} of {total}</span>
					<span class="current-title">{chapter.title}</span>
				</div>

				<div class="track" style="--progress: {progress}">
					<div class="track-fill" aria-hidden="true"></div>
					<ol class="steps">
						{#each chapters as ch, i (ch.id)}
							<li>
								<button
									type="button"
									class="step"
									class:active={i === index}
									class:done={i < index}
									aria-current={i === index ? 'step' : undefined}
									aria-label={`Chapter ${i + 1}: ${ch.title}`}
									on:click={() => goTo(i)}
								>
									<span class="num">{i + 1}</span>
								</button>
							</li>
						{/each}
					</ol>
				</div>
			</nav>
		{:else}
			<nav class="mobile-rail" aria-label="Chapters">
				<div class="rail-meta">
					<span class="pos">Chapter {index + 1} of {total}</span>
					<span class="current-title">{chapter.title}</span>
				</div>
				<div class="track" style="--progress: {progress}">
					<div class="track-fill" aria-hidden="true"></div>
					<ol class="steps">
						{#each chapters as ch, i (ch.id)}
							<li>
								<button
									type="button"
									class="step"
									class:active={i === index}
									class:done={i < index}
									aria-current={i === index ? 'step' : undefined}
									aria-label={`Chapter ${i + 1}: ${ch.title}`}
									on:click={() => goTo(i)}
								>
									<span class="num">{i + 1}</span>
								</button>
							</li>
						{/each}
					</ol>
				</div>
			</nav>
		{/if}

		{#key chapter.id}
			<section class="chapter" in:fade={{ duration: 180 }}>
				<h2 class="chapter-title">{chapter.title}</h2>

				{#if chapter.image}
					<figure class="figure">
						<img src={chapter.image.src} alt={chapter.image.alt} />
					</figure>
				{/if}

				{#if chapter.quote}
					<blockquote class="quote">
						{#each chapter.quote.paragraphs as qParagraph, qIndex (qIndex)}
							<p>{qParagraph}</p>
						{/each}
						{#if chapter.quote.attribution}
							<footer class="attribution">— {chapter.quote.attribution}</footer>
						{/if}
					</blockquote>
				{/if}

				{#if bodyParagraphs.length}
					<div class="body">
						{#each bodyParagraphs as paragraph, pIndex (pIndex)}
							<p>{paragraph}</p>
						{/each}
					</div>
				{/if}
			</section>
		{/key}

		<footer class="pager">
			<button type="button" class="nav-btn" on:click={prev} disabled={index === 0}>
				<span class="dir">Previous</span>
				{#if index > 0}
					<span class="peer">{chapters[index - 1].title}</span>
				{/if}
			</button>

			<button type="button" class="nav-btn next" on:click={next} disabled={index === total - 1}>
				<span class="dir">Next</span>
				{#if index < total - 1}
					<span class="peer">{chapters[index + 1].title}</span>
				{/if}
			</button>
		</footer>

		{#if !isFull}
			<p class="hint">Keyboard: ← →</p>
		{/if}
	</div>
</article>

<style>
	.essay.column {
		width: 100%;
		max-width: 40rem;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		box-sizing: border-box;
	}

	.essay.full {
		display: grid;
		grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
		gap: 0;
		width: 100%;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.side-nav {
		position: sticky;
		top: 0;
		align-self: start;
		height: 100vh;
		padding: 2rem 1.5rem 2rem 2rem;
		box-sizing: border-box;
		border-right: 1px solid #ececec;
		background: #fafafa;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		overflow: auto;
	}

	.side-label {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #8a8a8a;
	}

	.side-pos {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: #2c2c2c;
	}

	.side-track {
		position: relative;
		height: 2px;
		background: #e6e6e6;
		border-radius: 1px;
		margin: 0.15rem 0 0.35rem;
	}

	.side-track-fill {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: calc(var(--progress) * 100%);
		background: #2c2c2c;
		border-radius: 1px;
		transition: width 0.25s ease;
	}

	.side-steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.side-step {
		width: 100%;
		display: grid;
		grid-template-columns: 1.5rem 1fr;
		gap: 10px;
		align-items: start;
		padding: 10px 10px;
		border: 1px solid transparent;
		border-radius: 10px;
		background: transparent;
		font: inherit;
		text-align: left;
		cursor: pointer;
		color: #6a6a6a;
		transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
	}

	.side-step:hover {
		background: #f0f0f0;
		color: #2c2c2c;
	}

	.side-step.done {
		color: #2c2c2c;
	}

	.side-step.active {
		background: #fff;
		border-color: #e0e0e0;
		color: #2c2c2c;
	}

	.side-num {
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.45;
	}

	.side-title {
		font-size: 0.92rem;
		font-weight: 500;
		line-height: 1.4;
	}

	.side-hint {
		margin: auto 0 0;
		font-size: 0.75rem;
		color: #a0a0a0;
	}

	.main {
		min-width: 0;
		padding: 2rem 3rem 4rem;
		box-sizing: border-box;
	}

	.essay.column .main {
		padding: 0;
	}

	.top {
		margin-bottom: 1.75rem;
	}

	.essay.full .top {
		margin-bottom: 2rem;
		max-width: 56rem;
	}

	.crumb {
		margin: 0 0 1.25rem;
		font-size: 0.84rem;
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

	.layout-note {
		margin: 0 0 0.75rem;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: #8a8a8a;
	}

	.essay-title {
		margin: 0 0 0.45em;
		font-size: 1.45rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.3;
		color: #2c2c2c;
	}

	.essay.full .essay-title {
		font-size: clamp(1.75rem, 3.2vw, 2.45rem);
		letter-spacing: -0.03em;
		max-width: 18ch;
	}

	.essay-lede,
	.essay-summary {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.65;
		color: #6a6a6a;
	}

	.essay.full .essay-lede {
		font-size: clamp(1.05rem, 1.5vw, 1.2rem);
		max-width: 48rem;
		color: #4a4a4a;
	}

	.rail,
	.mobile-rail {
		position: sticky;
		top: 0;
		z-index: 5;
		margin: 0 0 1.75rem;
		padding: 0.85rem 0 1rem;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid #ececec;
	}

	.mobile-rail {
		display: none;
	}

	.rail-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem 1rem;
		margin-bottom: 0.85rem;
	}

	.pos {
		font-size: 0.8rem;
		font-weight: 500;
		color: #6a6a6a;
		letter-spacing: 0.01em;
	}

	.current-title {
		font-size: 0.9rem;
		font-weight: 500;
		color: #2c2c2c;
	}

	.track {
		position: relative;
		padding: 0.35rem 0;
	}

	.track-fill {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		background: #ececec;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.track-fill::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: calc(var(--progress) * 100%);
		background: #2c2c2c;
		transition: width 0.25s ease;
	}

	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: space-between;
		position: relative;
		gap: 0.5rem;
	}

	.step {
		width: 28px;
		height: 28px;
		border-radius: 999px;
		border: 1px solid #d8d8d8;
		background: #fff;
		color: #6a6a6a;
		font: inherit;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease,
			transform 0.15s ease;
	}

	.step:hover {
		border-color: #bdbdbd;
		color: #2c2c2c;
	}

	.step.done {
		border-color: #2c2c2c;
		color: #2c2c2c;
	}

	.step.active {
		background: #2c2c2c;
		border-color: #2c2c2c;
		color: #fff;
		transform: scale(1.06);
	}

	.chapter-title {
		margin: 0 0 1rem;
		font-size: 1.15rem;
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.35;
		color: #2c2c2c;
	}

	.essay.full .chapter-title {
		font-size: clamp(1.25rem, 2vw, 1.6rem);
		margin-bottom: 1.35rem;
	}

	.figure {
		margin: 0 0 1.35rem;
	}

	.figure img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 8px;
		border: 1px solid #ececec;
	}

	.essay.full .figure img {
		max-height: 52vh;
		width: auto;
		max-width: 100%;
		object-fit: cover;
	}

	.quote {
		margin: 0 0 1.5rem;
		padding: 1.1rem 1.25rem;
		border-left: 2px solid #2c2c2c;
		background: #fafafa;
		border-radius: 0 10px 10px 0;
	}

	.essay.full .quote {
		max-width: 52rem;
		padding: 1.35rem 1.5rem;
	}

	.quote p {
		margin: 0 0 0.9em;
		font-size: 1.02rem;
		line-height: 1.7;
		color: #2c2c2c;
	}

	.quote p:last-of-type {
		margin-bottom: 0.85em;
	}

	.attribution {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.45;
		color: #6a6a6a;
		font-style: normal;
	}

	.body p {
		margin: 0 0 1.1em;
		font-size: 1.02rem;
		line-height: 1.7;
		color: #2c2c2c;
	}

	.essay.full .body {
		max-width: 52rem;
	}

	.essay.full .body p {
		font-size: clamp(1.05rem, 1.35vw, 1.18rem);
		line-height: 1.75;
		max-width: 48rem;
	}

	.body p:last-child {
		margin-bottom: 0;
	}

	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 2.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid #ececec;
		max-width: 52rem;
	}

	.nav-btn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		padding: 12px 14px;
		border: 1px solid #ececec;
		border-radius: 10px;
		background: transparent;
		font: inherit;
		text-align: left;
		cursor: pointer;
		min-height: 4.25rem;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.nav-btn.next {
		align-items: flex-end;
		text-align: right;
	}

	.nav-btn:hover:not(:disabled) {
		background: #f7f7f7;
		border-color: #e0e0e0;
	}

	.nav-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.dir {
		font-size: 0.78rem;
		font-weight: 500;
		color: #6a6a6a;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.peer {
		font-size: 0.92rem;
		font-weight: 500;
		color: #2c2c2c;
		line-height: 1.35;
	}

	.hint {
		margin: 1rem 0 0;
		font-size: 0.78rem;
		color: #a0a0a0;
		text-align: center;
	}

	@media (max-width: 900px) {
		.essay.full {
			grid-template-columns: 1fr;
		}

		.side-nav {
			display: none;
		}

		.mobile-rail {
			display: block;
		}

		.main {
			padding: 1.5rem 1.25rem 3rem;
		}

		.essay.full .essay-title {
			max-width: none;
		}
	}

	@media (max-width: 520px) {
		.essay.column {
			padding: 1.5rem 1.15rem 3rem;
		}

		.pager {
			grid-template-columns: 1fr;
		}

		.nav-btn.next {
			align-items: flex-start;
			text-align: left;
		}
	}
</style>
