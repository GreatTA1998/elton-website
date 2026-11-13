<div class="home">
<HomeAtmosphere />

<p class="welcome">
	{$messages.welcome}
</p>

<h2 class="section-label" id="software-apps-label">{$messages.softwareApps}</h2>

<section class="spotlight apps-spotlight" aria-labelledby="software-apps-label">
	{#key selectedAppId}
		<div class="spotlight-feature" class:muted={selectedApp.muted} in:fade={{ duration: fadeMs }}>
			<div class="feature-copy">
				<strong class="feature-title">
					{selectedApp.name}
					{#if selectedApp.ready}
						<span class="ready-tick" role="img" title={$messages.ready} aria-label={$messages.ready}>
							<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
								<circle cx="8" cy="8" r="8" fill="#2f9e44" />
								<path
									d="M4.6 8.2l2.1 2.1 4.7-4.7"
									fill="none"
									stroke="#fff"
									stroke-width="1.7"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					{/if}
				</strong>
				<span class="feature-desc">{$messages[selectedApp.descKey]}</span>
				<span class="feature-status">{$messages[selectedApp.statusKey]}</span>
				{#if selectedApp.visit}
					<a
						class="feature-action"
						target="_blank"
						rel="noopener noreferrer"
						href={selectedApp.visit}
					>
						{$messages.visit}
					</a>
				{/if}
			</div>
		</div>
	{/key}

	<div class="spotlight-thumbs">
		{#each apps as app (app.id)}
			<button
				type="button"
				class="spotlight-thumb app-thumb"
				class:selected={selectedAppId === app.id}
				class:quiet={app.muted}
				aria-pressed={selectedAppId === app.id}
				aria-label={app.name}
				on:click={() => selectApp(app.id)}
			>
				<img src={app.logo} alt="" />
			</button>
		{/each}
	</div>
</section>

<h2 class="section-label" id="video-essays-label">{$messages.videoEssays}</h2>

<section class="spotlight essays-spotlight" aria-labelledby="video-essays-label">
	{#key selectedEssayId}
		<div class="essay-feature" in:fade={{ duration: fadeMs }}>
			{#if selectedEssay.kind === 'essay'}
				<a class="essay-feature-media" href={selectedEssay.href}>
					<picture>
						<source srcset={selectedEssay.coverAvif} type="image/avif" />
						<source srcset={selectedEssay.coverWebp} type="image/webp" />
						<img
							src={selectedEssay.coverJpg}
							alt={selectedEssay.title}
							loading="lazy"
							decoding="async"
						/>
					</picture>
				</a>
			{:else if selectedEssay.kind === 'video'}
				{#if notionPlaying}
					<div class="essay-feature-media essay-video-frame">
						<iframe
							src="https://www.youtube-nocookie.com/embed/{selectedEssay.youtubeId}?autoplay=1&rel=0"
							title={selectedEssay.title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</div>
				{:else}
					<button
						type="button"
						class="essay-feature-media essay-feature-play"
						aria-label={`${$messages.play}: ${selectedEssay.title}`}
						on:click={() => (notionPlaying = true)}
					>
						<img src={selectedEssay.thumb} alt="" />
						<span class="essay-play" aria-hidden="true">
							<svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
								<path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
							</svg>
						</span>
					</button>
				{/if}
			{:else}
				<div class="essay-feature-media essay-thumb-placeholder" aria-hidden="true"></div>
			{/if}

			<div class="essay-feature-copy">
				{#if selectedEssay.href}
					<p class="feature-title essay-feature-title">
						<a href={selectedEssay.href}>{selectedEssay.title}</a>
					</p>
				{:else}
					<p class="feature-title essay-feature-title">{selectedEssay.title}</p>
				{/if}
				<p class="feature-desc essay-feature-desc">
					{#if selectedEssay.sentenceKey}
						{$messages[selectedEssay.sentenceKey]}
					{:else}
						{selectedEssay.sentence}
					{/if}
				</p>
			</div>
		</div>
	{/key}

	<div class="spotlight-thumbs essay-thumbs">
		{#each essays as essay (essay.id)}
			{#if essay.id !== selectedEssayId}
				<button
					type="button"
					class="spotlight-thumb essay-thumb"
					class:placeholder={essay.kind === 'soon'}
					aria-pressed="false"
					aria-label={essay.title}
					on:click={() => selectEssay(essay.id)}
				>
					{#if essay.kind === 'essay'}
						<img src={essay.coverJpg} alt="" />
					{:else if essay.kind === 'video'}
						<img src={essay.thumb} alt="" />
					{:else}
						<span class="essay-thumb-blank" aria-hidden="true"></span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>
</section>

<section class="email-section" aria-labelledby="email-updates-label">
	<h2 class="section-label" id="email-updates-label">{$messages.emailUpdates}</h2>
	<SubscribeForm compact />
</section>
</div>

<SiteFooter />

<script>
	import { fade } from 'svelte/transition';
	import HomeAtmosphere from '$lib/HomeAtmosphere.svelte';
	import SiteFooter from '$lib/SiteFooter.svelte';
	import SubscribeForm from '$lib/SubscribeForm.svelte';
	import { messages } from '$lib/i18n.js';

	const reduceMotion =
		typeof window !== 'undefined' &&
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const fadeMs = reduceMotion ? 0 : 180;

	const apps = [
		{
			id: 'actions',
			name: 'actions.life',
			logo: '/actions-life-logo.png',
			descKey: 'actionsDesc',
			statusKey: 'actionsStatus',
			ready: true,
			muted: false,
			visit: 'https://actions.life'
		},
		{
			id: 'blackboards',
			name: 'blackboards.io',
			logo: '/explanations-logo.png',
			descKey: 'blackboardsDesc',
			statusKey: 'blackboardsStatus',
			ready: false,
			muted: true,
			visit: null
		},
		{
			id: 'zetteldraw',
			name: 'zetteldraw',
			logo: '/zetteldraw-logo.png',
			descKey: 'zetteldrawDesc',
			statusKey: 'zetteldrawStatus',
			ready: false,
			muted: true,
			visit: null
		},
		{
			id: 'zen',
			name: 'zen-message',
			logo: '/zen-message-logo.jpg',
			descKey: 'zenDesc',
			statusKey: 'zenStatus',
			ready: false,
			muted: true,
			visit: null
		}
	];

	const essays = [
		{
			id: 'gohs',
			kind: 'essay',
			href: '/essays/gohs-folly',
			title: "Goh's Folly: Seeing What Others Couldn't",
			sentence:
				"Sometimes, we have to devote many years of our life into something that might not work - a four-chapter essay on originality, courage, based on Singapore's founding story",
			coverAvif: '/gohs-folly-cover.avif',
			coverWebp: '/gohs-folly-cover.webp',
			coverJpg: '/gohs-folly-cover.jpg'
		},
		{
			id: 'notion',
			kind: 'video',
			title: 'Beyond the features: what is the point of Notion?',
			sentence: 'True freedom to customize the UI by drag-and-drop, and databases',
			thumb: '/notion-essay-thumb.jpg',
			youtubeId: 'DhyhHdN02xc'
		},
		{
			id: 'nero',
			kind: 'soon',
			title: '《童年回憶：拜訪 Nero——忍鬥風雲 2 開發者》',
			sentenceKey: 'comingSoon'
		}
	];

	let selectedAppId = 'actions';
	let selectedEssayId = 'gohs';
	let notionPlaying = false;

	$: selectedApp = apps.find((app) => app.id === selectedAppId) || apps[0];
	$: selectedEssay = essays.find((essay) => essay.id === selectedEssayId) || essays[0];

	/** @param {string} id */
	function selectApp(id) {
		selectedAppId = id;
	}

	/** @param {string} id */
	function selectEssay(id) {
		if (id !== 'notion') notionPlaying = false;
		selectedEssayId = id;
	}
</script>

<style>
	.home {
		width: 100%;
		max-width: none;
		padding: 2.25rem 2rem 3.5rem;
		box-sizing: border-box;
	}

	.welcome {
		margin: 1.35rem 0 0;
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

	.spotlight {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.85rem;
		width: 100%;
		max-width: 42rem;
	}

	.spotlight-feature {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 1rem 1.25rem;
		box-sizing: border-box;
		border: 1px solid rgba(40, 40, 40, 0.08);
		border-radius: 1.35rem;
		background: linear-gradient(160deg, rgba(255, 252, 248, 0.92), rgba(255, 255, 255, 0.82));
		box-shadow: 0 8px 28px rgba(40, 36, 30, 0.05);
	}

	.spotlight-feature.muted {
		opacity: 0.72;
	}

	.feature-copy {
		display: flex;
		flex-direction: column;
		gap: 0.22rem;
		min-width: 0;
		width: 100%;
	}

	.feature-title {
		display: inline-flex;
		align-items: center;
		margin: 0;
		font-weight: 600;
		font-size: 0.98rem;
		color: #1a1a1a;
		line-height: 1.35;
	}

	.feature-desc {
		font-size: 0.875rem;
		color: #6a6a6a;
		line-height: 1.45;
		font-weight: 400;
	}

	.feature-status {
		font-size: 0.78rem;
		color: #9a9a9a;
		line-height: 1.4;
		font-weight: 400;
	}

	.feature-action {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		margin-top: 0.45rem;
		padding: 0.28rem 0.72rem;
		border: 1px solid #d8d8d8;
		border-radius: 999px;
		background: #fff;
		color: #2c2c2c;
		font-size: 0.72rem;
		font-weight: 500;
		line-height: 1.3;
		letter-spacing: 0.01em;
		text-decoration: none;
	}

	.ready-tick {
		display: inline-flex;
		align-items: center;
		margin-left: 6px;
		vertical-align: -1px;
	}

	.spotlight-thumbs {
		display: flex;
		align-items: flex-end;
		gap: 0.55rem;
		min-height: 3.5rem;
		padding: 0 0.1rem;
	}

	.spotlight-thumb {
		appearance: none;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		width: 2.55rem;
		height: 2.55rem;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		flex-shrink: 0;
		transition: width 0.22s ease, height 0.22s ease, opacity 0.22s ease;
	}

	.spotlight-thumb img,
	.essay-thumb-blank {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.spotlight-thumb.selected {
		width: 3.35rem;
		height: 3.35rem;
	}

	.spotlight-thumb.quiet {
		opacity: 0.62;
	}

	.spotlight-thumb.quiet.selected {
		opacity: 0.78;
	}

	.essay-feature {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.7rem;
		width: 100%;
	}

	.essay-feature-media {
		display: block;
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		padding: 0;
		border: none;
		background: transparent;
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;
		text-align: left;
	}

	.essay-feature-media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.essay-video-frame {
		cursor: default;
		background: #111;
	}

	.essay-video-frame iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.essay-play {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		background: rgba(20, 20, 20, 0.72);
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.essay-play svg {
		display: block;
		margin-left: 2px;
	}

	.essay-thumb-placeholder,
	.essay-thumb-blank {
		background: #e8e8e8;
	}

	.essay-feature-title {
		font-size: 0.95rem;
	}

	.essay-feature-title a {
		color: inherit;
		text-decoration: none;
	}

	.essay-feature-desc {
		margin: 0;
	}

	.essay-thumbs {
		display: flex;
		width: 100%;
		align-items: stretch;
		gap: 0.7rem;
		min-height: 0;
		padding: 0;
	}

	.essay-thumbs .spotlight-thumb {
		flex: 1 1 0;
		width: 0;
		height: auto;
		aspect-ratio: 4 / 3;
		border-radius: 10px;
		min-width: 0;
	}

	.essay-thumbs .spotlight-thumb.placeholder {
		opacity: 0.7;
	}

	.email-section {
		margin-top: 0.5rem;
		padding-top: 0.25rem;
		max-width: 36rem;
	}

	@media (max-width: 720px) {
		.spotlight {
			max-width: none;
		}

		.spotlight-feature {
			padding: 0.9rem 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spotlight-thumb {
			transition: none;
		}
	}
</style>
