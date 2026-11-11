<!--
  Reversible homepage place-atmosphere (vibe-only photo + quiet lived places).
  Portrait composition; Hsinchu → wisteria, Boston → Maseeh snow, Tokyo → rainy alley. No white fade overlay.
  Quiet ~5s crossfade among places that have scenery. Delete this component
  (and its import/usage in index.svelte) to remove it.
-->
<script>
	import { onMount } from 'svelte';
	import { messages } from './i18n.js';

	// Cities only (>short stops omitted). No country suffixes, no London/Taipei.
	const places = [
		'Hsinchu',
		'Shanghai',
		'Eindhoven',
		'Milton Keynes',
		'Boston',
		'Tokyo'
	];

	/** @type {Record<string, { mobileJpg: string; mobileWebp: string; desktopJpg: string; desktopWebp: string; position: string; desktopPosition: string }>} */
	const scenery = {
		Hsinchu: {
			mobileJpg: '/home-wisteria.jpg',
			mobileWebp: '/home-wisteria.webp',
			desktopJpg: '/home-wisteria-desktop.jpg',
			desktopWebp: '/home-wisteria-desktop.webp',
			position: '62% 38%',
			desktopPosition: '55% 44%'
		},
		Boston: {
			mobileJpg: '/home-boston.jpg',
			mobileWebp: '/home-boston.webp',
			desktopJpg: '/home-boston-desktop.jpg',
			desktopWebp: '/home-boston-desktop.webp',
			position: '50% 42%',
			desktopPosition: '50% 40%'
		},
		Tokyo: {
			mobileJpg: '/home-tokyo.jpg',
			mobileWebp: '/home-tokyo.webp',
			desktopJpg: '/home-tokyo-desktop.jpg',
			desktopWebp: '/home-tokyo-desktop.webp',
			position: '48% 42%',
			desktopPosition: '48% 40%'
		}
	};

	const scenicPlaces = places.filter((p) => scenery[p]);
	const HOLD_MS = 5000;
	const FADE_MS = 1100;

	let activePlace = scenicPlaces[0];
	let layerA = scenery[scenicPlaces[0]];
	let layerB = scenery[scenicPlaces[0]];
	let showA = true;
	let reducedMotion = false;
	let paused = false;
	/** @type {ReturnType<typeof setTimeout> | null} */
	let holdTimer = null;
	/** @type {ReturnType<typeof setTimeout> | null} */
	let fadeTimer = null;
	let scenicIndex = 0;

	function clearHold() {
		if (holdTimer) {
			clearTimeout(holdTimer);
			holdTimer = null;
		}
	}

	function clearTimers() {
		clearHold();
		if (fadeTimer) {
			clearTimeout(fadeTimer);
			fadeTimer = null;
		}
	}

	function scheduleNext() {
		clearHold();
		if (reducedMotion || paused || scenicPlaces.length < 2 || fadeTimer) return;
		holdTimer = setTimeout(advance, HOLD_MS);
	}

	function advance() {
		if (reducedMotion || paused || scenicPlaces.length < 2) return;
		scenicIndex = (scenicIndex + 1) % scenicPlaces.length;
		const nextPlace = scenicPlaces[scenicIndex];
		const nextScene = scenery[nextPlace];

		if (showA) {
			layerB = nextScene;
			showA = false;
		} else {
			layerA = nextScene;
			showA = true;
		}

		// Commit active place after the quiet crossfade settles
		fadeTimer = setTimeout(() => {
			activePlace = nextPlace;
			fadeTimer = null;
			if (!paused) scheduleNext();
		}, FADE_MS);
	}

	function pause() {
		paused = true;
		clearHold();
	}

	function resume() {
		paused = false;
		scheduleNext();
	}

	function onVisibility() {
		if (typeof document === 'undefined') return;
		if (document.hidden) pause();
		else resume();
	}

	onMount(() => {
		const mq =
			typeof window !== 'undefined' && window.matchMedia
				? window.matchMedia('(prefers-reduced-motion: reduce)')
				: null;
		reducedMotion = !!(mq && mq.matches);

		const onMq = () => {
			reducedMotion = !!(mq && mq.matches);
			if (reducedMotion) {
				clearTimers();
				activePlace = scenicPlaces[0];
				layerA = scenery[scenicPlaces[0]];
				layerB = layerA;
				showA = true;
				scenicIndex = 0;
			} else {
				scheduleNext();
			}
		};

		if (mq) {
			if (mq.addEventListener) mq.addEventListener('change', onMq);
			else mq.addListener(onMq);
		}

		document.addEventListener('visibilitychange', onVisibility);
		scheduleNext();

		return () => {
			clearTimers();
			document.removeEventListener('visibilitychange', onVisibility);
			if (mq) {
				if (mq.removeEventListener) mq.removeEventListener('change', onMq);
				else mq.removeListener(onMq);
			}
		};
	});
</script>

<div class="atmosphere">
	<div
		class="frame"
		aria-hidden="true"
		on:pointerenter={pause}
		on:pointerleave={resume}
	>
		<div class="layer" class:visible={showA} style="--pos: {layerA.position}; --pos-desk: {layerA.desktopPosition}">
			<picture>
				<source media="(min-width: 900px)" srcset={layerA.desktopWebp} type="image/webp" />
				<source media="(min-width: 900px)" srcset={layerA.desktopJpg} type="image/jpeg" />
				<source srcset={layerA.mobileWebp} type="image/webp" />
				<img
					class="photo"
					src={layerA.mobileJpg}
					alt=""
					width="1200"
					height="1600"
					decoding="async"
					fetchpriority={showA ? 'high' : 'low'}
				/>
			</picture>
		</div>
		<div class="layer" class:visible={!showA} style="--pos: {layerB.position}; --pos-desk: {layerB.desktopPosition}">
			<picture>
				<source media="(min-width: 900px)" srcset={layerB.desktopWebp} type="image/webp" />
				<source media="(min-width: 900px)" srcset={layerB.desktopJpg} type="image/jpeg" />
				<source srcset={layerB.mobileWebp} type="image/webp" />
				<img
					class="photo"
					src={layerB.mobileJpg}
					alt=""
					width="1200"
					height="1600"
					decoding="async"
					fetchpriority={!showA ? 'high' : 'low'}
				/>
			</picture>
		</div>
	</div>

	<ol
		class="places"
		aria-label={$messages.placesLived}
		on:pointerenter={pause}
		on:pointerleave={resume}
		on:focusin={pause}
		on:focusout={resume}
	>
		{#each places as place, i (place)}
			<li>
				{#if i > 0}
					<span class="sep" aria-hidden="true">→</span>
				{/if}
				<span class="place" class:active={place === activePlace && !!scenery[place]}>{place}</span>
			</li>
		{/each}
	</ol>
</div>

<style>
	.atmosphere {
		position: relative;
		/* Bleed out of .home horizontal padding; reversible by removing component */
		margin: -2.25rem -2rem 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		gap: 0.85rem;
		overflow: hidden;
		isolation: isolate;
		background: #ffffff;
		padding: 0 2rem 0.35rem;
		box-sizing: border-box;
		/* Never intercept chrome (language toggle) over the hero */
		pointer-events: none;
		z-index: 0;
	}

	.frame {
		position: relative;
		width: calc(100% + 4rem);
		margin-left: -2rem;
		margin-right: -2rem;
		/* Keep portrait framing — never squash into a wide short band */
		aspect-ratio: 3 / 4;
		max-height: min(78vh, 760px);
		overflow: hidden;
		flex-shrink: 0;
		/* Allow hover pause without blocking language toggle (atmosphere is pointer-events:none) */
		pointer-events: auto;
		z-index: 0;
	}

	.layer {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 1.1s ease;
		pointer-events: none;
	}

	.layer.visible {
		opacity: 1;
	}

	.layer picture,
	.layer .photo {
		display: block;
		width: 100%;
		height: 100%;
	}

	.layer .photo {
		object-fit: cover;
		object-position: var(--pos, 62% 38%);
	}

	.places {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0 0 0.15rem;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.2rem;
		row-gap: 0.2rem;
		max-width: 36rem;
		pointer-events: auto;
	}

	.places li {
		display: inline-flex;
		align-items: baseline;
		gap: 0.2rem;
		margin: 0;
		padding: 0;
	}

	.place {
		font-size: 0.78rem;
		font-weight: 400;
		letter-spacing: 0.01em;
		line-height: 1.45;
		color: #8a8a8a;
		transition: color 0.35s ease;
	}

	.place.active {
		color: #4a4a4a;
	}

	.sep {
		font-size: 0.72rem;
		line-height: 1;
		color: #c4c4c4;
		padding: 0 0.05rem;
	}

	@media (min-width: 900px) {
		.atmosphere {
			flex-direction: row;
			align-items: center;
			gap: 1.75rem;
			padding: 0 2rem 0;
			min-height: min(86vh, 980px);
		}

		.frame {
			width: min(100%, calc(min(86vh, 980px) * 0.75));
			max-height: min(86vh, 980px);
			margin-left: -2rem;
			margin-right: 0;
			aspect-ratio: 3 / 4;
		}

		.layer .photo {
			object-position: var(--pos-desk, 55% 44%);
		}

		.places {
			flex-direction: column;
			flex-wrap: nowrap;
			align-items: flex-start;
			row-gap: 0.55rem;
			padding: 0;
			max-width: none;
		}

		.places li {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.55rem;
		}

		.places li:first-child .sep {
			display: none;
		}

		.sep {
			display: block;
			padding: 0;
			font-size: 0.65rem;
			transform: rotate(90deg);
			transform-origin: center;
			margin-left: 0.15rem;
			color: #d0d0d0;
		}

		.place {
			font-size: 0.8rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.layer {
			transition: none;
		}

		.place {
			transition: none;
		}
	}
</style>
