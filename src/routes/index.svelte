<div class="home">
<HomeAtmosphere />

<div class="spotlights">
	<div class="spotlight-col apps-col">
		<section
			class="spotlight"
			class:exp-overlap={$experiments.overlapApps}
			class:exp-dock={$experiments.dockSelected}
			data-exp-preset={$experiments.overlapApps ? $experiments.appsPreset : null}
			style={$experiments.overlapApps || $experiments.dockSelected ? overlapStyle($experiments) : null}
			aria-label={$messages.softwareApps}
		>
			<div class="spotlight-thumbs" class:exp-gray={$experiments.grayscaleUnselected}>
				{#each apps as app (app.id)}
					<button
						type="button"
						class="spotlight-thumb"
						class:selected={selectedAppId === app.id}
						aria-pressed={selectedAppId === app.id}
						aria-label={app.name}
						on:click={() => (selectedAppId = app.id)}
					>
						<img src={app.logo} alt="" />
					</button>
				{/each}
			</div>

			{#key selectedAppId}
				<div class="spotlight-feature" in:fade={{ duration: fadeMs }}>
					<div class="feature-copy">
						<strong class="feature-title">
							{selectedApp.name}
							{#if selectedApp.ready}
								<span class="ready-tick" role="img" title={$messages.ready} aria-label={$messages.ready}
									>✓</span
								>
							{/if}
						</strong>
						<span class="feature-desc">{$messages[selectedApp.descKey]}</span>
						<span class="feature-status">{$messages[selectedApp.statusKey]}</span>
						<div class="feature-actions">
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
							<button type="button" class="feature-action" on:click={openUpdates}>
								{$messages.emailUpdates}
							</button>
						</div>
					</div>
				</div>
			{/key}
		</section>
	</div>

	<div class="spotlight-col essays-col">
		<section class="spotlight" aria-label={$messages.videoEssays}>
			<div class="essay-row">
				<div class="essay-side">
					<div role="group" aria-label={$messages.videoEssays}>
						{#each essays as essay (essay.id)}
							<button
								type="button"
								class="essay-title-btn"
								class:selected={selectedEssayId === essay.id}
								class:soon={essay.kind === 'soon'}
								aria-pressed={selectedEssayId === essay.id}
								title={essay.title}
								aria-label={essay.title}
								on:click={() => selectEssay(essay.id)}
							>
								{truncateTitle(essay.title)}
							</button>
						{/each}
					</div>
				</div>

				{#key selectedEssayId}
					<div class="essay-media-wrap" in:fade={{ duration: fadeMs }}>
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

						<p class="feature-desc">
							{#if selectedEssay.sentenceKey}
								{$messages[selectedEssay.sentenceKey]}
							{:else}
								{selectedEssay.sentence}
							{/if}
						</p>
					</div>
				{/key}
			</div>
		</section>
	</div>
</div>

<dialog
	class="updates-dialog"
	bind:this={updatesDialog}
	aria-label={$messages.subscribeTitle}
	on:click={onUpdatesDialogClick}
>
	{#key updatesFormKey}
		<SubscribeForm compact />
	{/key}
</dialog>
</div>

<SiteFooter />

<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import HomeAtmosphere from '$lib/HomeAtmosphere.svelte';
	import SiteFooter from '$lib/SiteFooter.svelte';
	import SubscribeForm from '$lib/SubscribeForm.svelte';
	import { messages } from '$lib/i18n.js';
	import { experiments, defaultSecondApply, overlapStyle } from '$lib/experiments.js'; // TEMP experiments

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
			visit: 'https://actions.life'
		},
		{
			id: 'blackboards',
			name: 'blackboards.io',
			logo: '/explanations-logo.png',
			descKey: 'blackboardsDesc',
			statusKey: 'blackboardsStatus',
			ready: false,
			visit: null
		},
		{
			id: 'zetteldraw',
			name: 'zetteldraw',
			logo: '/zetteldraw-logo.png',
			descKey: 'zetteldrawDesc',
			statusKey: 'zetteldrawStatus',
			ready: false,
			visit: null
		},
		{
			id: 'zen',
			name: 'zen-message',
			logo: '/zen-message-logo.jpg',
			descKey: 'zenDesc',
			statusKey: 'zenStatus',
			ready: false,
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
			title: '童年回憶：拜訪 Nero——忍鬥風雲 2 開發者',
			sentenceKey: 'comingSoon'
		}
	];

	let selectedAppId = 'actions';
	let selectedEssayId = 'gohs';
	let notionPlaying = false;
	let updatesDialog;
	let updatesFormKey = 0;

	// TEMP experiments — default select second app when flag is on
	onMount(() =>
		defaultSecondApply.subscribe((on) => {
			selectedAppId = on ? apps[1].id : apps[0].id;
		})
	);

	const TITLE_MAX = 52;

	/** @param {string} text */
	function truncateTitle(text) {
		const value = String(text || '').trim();
		if (value.length <= TITLE_MAX) return value;
		return `${value.slice(0, TITLE_MAX).trimEnd()}…`;
	}

	$: selectedApp = apps.find((app) => app.id === selectedAppId) || apps[0];
	$: selectedEssay = essays.find((essay) => essay.id === selectedEssayId) || essays[0];

	/** @param {string} id */
	function selectEssay(id) {
		if (id !== 'notion') notionPlaying = false;
		selectedEssayId = id;
	}

	function openUpdates() {
		updatesFormKey += 1;
		updatesDialog?.showModal();
	}

	/** @param {MouseEvent} event */
	function onUpdatesDialogClick(event) {
		if (event.target === updatesDialog) updatesDialog.close();
	}
</script>

<style>
	.home {
		width: 100%;
		max-width: none;
		padding: 2.25rem 2rem 3.5rem;
		box-sizing: border-box;
	}

	.spotlights {
		display: flex;
		align-items: flex-start;
		gap: 2rem;
		margin-top: 1.75em;
		width: 100%;
	}

	.spotlight-col {
		min-width: 0;
	}

	.apps-col {
		flex: 0 1 20rem;
		max-width: 22rem;
	}

	.essays-col {
		flex: 0 1 auto;
		min-width: 0;
		max-width: 100%;
	}

	.spotlight {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		width: 100%;
	}

	.spotlight-feature {
		display: flex;
		align-items: center;
		width: auto;
		max-width: 100%;
		padding: 0.85rem 1rem;
		box-sizing: border-box;
		border: 1px solid rgba(40, 40, 40, 0.08);
		border-radius: 1.15rem;
		background: linear-gradient(160deg, rgba(255, 252, 248, 0.92), rgba(255, 255, 255, 0.82));
		box-shadow: 0 6px 20px rgba(40, 36, 30, 0.04);
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
		font-size: 0.92rem;
		color: #1a1a1a;
		line-height: 1.3;
	}

	.feature-desc {
		margin: 0;
		font-size: 0.82rem;
		color: #6a6a6a;
		line-height: 1.4;
	}

	.feature-status {
		font-size: 0.72rem;
		color: #9a9a9a;
		line-height: 1.35;
	}

	.feature-actions {
		display: flex;
		gap: 0.35rem;
		margin-top: 0.35rem;
	}

	.feature-action {
		display: inline-flex;
		align-items: center;
		padding: 0.22rem 0.62rem;
		border: 1px solid #d8d8d8;
		border-radius: 999px;
		background: #fff;
		color: #2c2c2c;
		font: inherit;
		font-size: 0.7rem;
		font-weight: 500;
		line-height: 1.3;
		text-decoration: none;
		cursor: pointer;
	}

	.ready-tick {
		margin-left: 6px;
		color: #2f9e44;
	}

	.spotlight-thumbs {
		display: flex;
		align-items: flex-start;
		gap: 0.45rem;
	}

	.spotlight-thumb {
		appearance: none;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		width: 3rem;
		aspect-ratio: 1;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		flex-shrink: 0;
		transition: width 0.22s ease;
	}

	.spotlight-thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.spotlight-thumb.selected {
		width: 3.55rem;
	}

	/* TEMP experiments — grayscale unselected app logos */
	.spotlight-thumbs.exp-gray .spotlight-thumb:not(.selected) img {
		filter: grayscale(0.92);
		transition: filter 0.22s ease;
	}

	.spotlight-thumbs.exp-gray .spotlight-thumb.selected img {
		filter: none;
	}

	/* TEMP experiments — selected logo only docks into card; inactive stay clear */
	.spotlight.exp-overlap,
	.spotlight.exp-dock {
		gap: 0.14rem;
	}

	.spotlight.exp-overlap .spotlight-thumbs,
	.spotlight.exp-dock .spotlight-thumbs {
		position: relative;
		z-index: 2;
		gap: max(0.16rem, calc(0.45rem - var(--exp-ah, 0.12rem)));
	}

	.spotlight.exp-overlap .spotlight-feature,
	.spotlight.exp-dock .spotlight-feature {
		position: relative;
		z-index: 1;
	}

	.spotlight.exp-overlap .spotlight-thumb,
	.spotlight.exp-dock .spotlight-thumb {
		width: calc(3rem * var(--exp-as, 1));
		position: relative;
		z-index: 0;
		transform-origin: bottom center;
		transition: width 0.22s ease, transform 0.22s ease;
	}

	.spotlight.exp-overlap .spotlight-thumb.selected {
		width: calc(3rem * var(--exp-as, 1) * var(--exp-aa, 1.32));
		transform: translateY(calc(0.78 * var(--exp-av, 0.85rem)));
		z-index: 3;
	}

	.spotlight.exp-overlap[data-exp-preset='sit'] .spotlight-thumb.selected {
		transform: translateY(calc(0.42 * var(--exp-av, 0.85rem)));
	}

	.spotlight.exp-overlap[data-exp-preset='fan'] .spotlight-thumb.selected {
		transform: translate(calc(-0.15 * var(--exp-ah, 0.12rem)), calc(0.9 * var(--exp-av, 0.85rem)))
			rotate(2.5deg);
	}

	.spotlight.exp-dock .spotlight-thumb.selected {
		width: calc(3rem * var(--exp-as, 1) * var(--exp-aa, 1.32));
		transform: translateY(var(--exp-dock, 0.5rem));
		z-index: 3;
	}

	.spotlight.exp-dock.exp-overlap .spotlight-thumb.selected {
		transform: translateY(calc(0.78 * var(--exp-av, 0.85rem) + var(--exp-dock, 0.5rem)));
	}

	.spotlight.exp-dock.exp-overlap[data-exp-preset='sit'] .spotlight-thumb.selected {
		transform: translateY(calc(0.42 * var(--exp-av, 0.85rem) + var(--exp-dock, 0.5rem)));
	}

	.spotlight.exp-dock.exp-overlap[data-exp-preset='fan'] .spotlight-thumb.selected {
		transform: translate(calc(-0.15 * var(--exp-ah, 0.12rem)), calc(0.9 * var(--exp-av, 0.85rem) + var(--exp-dock, 0.5rem)))
			rotate(2.5deg);
	}

	.essay-row {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		max-width: 100%;
		min-width: 0;
	}

	.essay-side {
		flex: 0 1 auto;
		width: max-content;
		max-width: min(52ch, 100%);
		min-width: 0;
	}

	.essay-media-wrap {
		flex: 0 1 auto;
		min-width: 0;
		max-width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 16rem) minmax(0, 22rem);
		gap: 0.65rem;
		align-items: start;
	}

	.essay-feature-media {
		display: block;
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		padding: 0;
		border: none;
		background: transparent;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
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
		width: 2.6rem;
		height: 2.6rem;
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

	.essay-thumb-placeholder {
		background: #e8e8e8;
	}

	.essay-title-btn {
		appearance: none;
		display: block;
		width: 100%;
		margin: 0;
		padding: 0.32rem 0;
		border: none;
		background: transparent;
		color: #7a7a7a;
		font: inherit;
		font-size: 0.8rem;
		line-height: 1.35;
		text-align: left;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.essay-title-btn.selected {
		color: #1a1a1a;
		font-weight: 500;
		font-size: 0.9rem;
	}

	.essay-title-btn.soon {
		opacity: 0.72;
	}

	.updates-dialog {
		box-sizing: border-box;
		width: min(28rem, calc(100vw - 2rem));
		padding: 1.15rem 1.2rem 1.35rem;
		border: 1px solid rgba(40, 40, 40, 0.1);
		border-radius: 1rem;
		background: #faf9f7;
	}

	.updates-dialog::backdrop {
		background: rgba(40, 36, 30, 0.28);
	}

	@media (max-width: 900px) {
		.spotlights {
			flex-direction: column;
			gap: 2.5rem;
		}

		.apps-col,
		.essays-col {
			flex: 1 1 auto;
			max-width: none;
			width: 100%;
		}

		.essay-row {
			flex-direction: column;
			gap: 0.75rem;
		}

		.essay-media-wrap {
			grid-template-columns: minmax(0, 24rem) minmax(0, 1fr);
		}
	}

	@media (max-width: 640px) {
		.essay-media-wrap {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.45rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spotlight-thumb,
		.spotlight.exp-overlap .spotlight-thumb,
		.spotlight.exp-dock .spotlight-thumb { transition: none; }
		.spotlight-thumbs.exp-gray .spotlight-thumb:not(.selected) img { transition: none; }
	}
</style>
