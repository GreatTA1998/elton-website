<script>
	import { fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	export let essay;

	let index = 0;

	$: chapters = essay.chapters;
	$: total = chapters.length;
	$: chapter = chapters[index];
	$: progress = total > 1 ? index / (total - 1) : 1;

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

<article class="essay">
	<header class="top">
		<p class="crumb"><a href="/">Home</a><span class="sep">/</span><span>Essay</span></p>
		<h1 class="essay-title">{essay.title}</h1>
		<p class="essay-summary">{essay.summary}</p>
	</header>

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

	{#key chapter.id}
		<section class="chapter" in:fade={{ duration: 180 }}>
			<h2 class="chapter-title">{chapter.title}</h2>

			{#if chapter.image}
				<figure class="figure">
					<img src={chapter.image.src} alt={chapter.image.alt} />
				</figure>
			{/if}

			<div class="body">
				{#each chapter.paragraphs as paragraph, pIndex (pIndex)}
					<p>{paragraph}</p>
				{/each}
			</div>
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

	<p class="hint">Keyboard: ← →</p>
</article>

<style>
	.essay {
		width: 100%;
		max-width: 40rem;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		box-sizing: border-box;
	}

	.top {
		margin-bottom: 1.75rem;
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

	.essay-title {
		margin: 0 0 0.45em;
		font-size: 1.45rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.3;
		color: #2c2c2c;
	}

	.essay-summary {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: #6a6a6a;
	}

	.rail {
		position: sticky;
		top: 0;
		z-index: 5;
		margin: 0 0 1.75rem;
		padding: 0.85rem 0 1rem;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid #ececec;
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

	.body p {
		margin: 0 0 1.1em;
		font-size: 1.02rem;
		line-height: 1.7;
		color: #2c2c2c;
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

	@media (max-width: 520px) {
		.essay {
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
