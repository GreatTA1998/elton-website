<!--
  Reversible homepage place-atmosphere (vibe-only photo + quiet lived places).
  Portrait frame; Hsinchu → wisteria, Milton Keynes → rainbow garden,
  Boston → Maseeh snow, Tokyo → rainy alley. No white fade overlay.
  Quiet ~5s crossfade among all four places. Selecting a city crossfades
  to that place and resets the ~5s cycle from there (does not permanently
  stop rotation). Hover/focus on the frame or list pauses temporarily.
  Delete this component (and its import/usage in index.svelte) to remove it.
-->
<script>
	import { onMount, tick } from 'svelte';
	import { messages } from './i18n.js';

	// Cities only (>short stops omitted). No country suffixes, no London/Taipei.
	const places = ['Hsinchu', 'Milton Keynes', 'Boston', 'Tokyo'];

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
		'Milton Keynes': {
			mobileJpg: '/home-milton-keynes.jpg',
			mobileWebp: '/home-milton-keynes.webp',
			desktopJpg: '/home-milton-keynes-desktop.jpg',
			desktopWebp: '/home-milton-keynes-desktop.webp',
			position: '55% 40%',
			desktopPosition: '52% 38%'
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
			/* Landscape asset; cover-crop inside portrait frame */
			position: '52% 45%',
			desktopPosition: '50% 42%'
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
	let advancing = false;
	/** Bumps when a newer goToPlace supersedes an in-flight crossfade */
	let goGen = 0;
	/** @type {HTMLElement | null} */
	let frameEl = null;
	/** @type {HTMLElement | null} */
	let placesEl = null;
	/** @type {HTMLImageElement | null} */
	let imgA = null;
	/** @type {HTMLImageElement | null} */
	let imgB = null;

	function preferredSrc(scene) {
		const desktop =
			typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches;
		// Match what <picture> will actually paint (WebP first)
		return desktop ? scene.desktopWebp : scene.mobileWebp;
	}

	function preloadScene(scene) {
		return new Promise((resolve) => {
			if (typeof Image === 'undefined') {
				resolve();
				return;
			}
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () => resolve();
			img.src = preferredSrc(scene);
		});
	}

	function waitForImg(el) {
		if (!el) return Promise.resolve();
		// complete with width 0 = broken/settled; still resolve so rotation cannot stall
		if (el.complete) {
			if (el.naturalWidth > 0 && el.decode) {
				return el.decode().catch(() => {});
			}
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			let settled = false;
			const finish = () => {
				if (settled) return;
				settled = true;
				el.removeEventListener('load', finish);
				el.removeEventListener('error', finish);
				clearTimeout(timer);
				if (el.naturalWidth > 0 && el.decode) {
					el.decode().then(resolve).catch(resolve);
				} else {
					resolve();
				}
			};
			const timer = setTimeout(finish, 4000);
			el.addEventListener('load', finish);
			el.addEventListener('error', finish);
		});
	}

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

	function rotationAllowed() {
		return !reducedMotion && !paused;
	}

	/** Snap both layers to the committed active scene (clean slate mid-fade). */
	function snapLayersToActive() {
		const scene = scenery[activePlace];
		layerA = scene;
		layerB = scene;
		showA = true;
		if (fadeTimer) {
			clearTimeout(fadeTimer);
			fadeTimer = null;
		}
		advancing = false;
	}

	function scheduleNext() {
		clearHold();
		if (!rotationAllowed() || scenicPlaces.length < 2 || fadeTimer || advancing) return;
		holdTimer = setTimeout(() => {
			if (!rotationAllowed()) return;
			advance();
		}, HOLD_MS);
	}

	/**
	 * Crossfade to a scenic place via dual-layer preload (no empty flash).
	 * @param {string} nextPlace
	 * @param {{ user?: boolean }} [opts]
	 */
	async function goToPlace(nextPlace, opts = {}) {
		const user = !!opts.user;
		const nextIndex = scenicPlaces.indexOf(nextPlace);
		if (nextIndex < 0) return;

		// Auto path: skip if busy, paused, or already on target
		if (!user) {
			if (advancing || fadeTimer || !rotationAllowed()) return;
			if (nextPlace === activePlace) return;
		}

		const myGen = ++goGen;
		advancing = true;
		clearHold();
		const nextScene = scenery[nextPlace];
		const incomingIsB = showA;

		// Assign incoming layer first (still opacity 0), wait for the painted asset, then fade
		if (incomingIsB) layerB = nextScene;
		else layerA = nextScene;

		try {
			await preloadScene(nextScene);
			await tick();
			await waitForImg(incomingIsB ? imgB : imgA);
		} catch (_) {
			/* still proceed — better a soft fade than a stuck carousel */
		}

		// Superseded by a newer selection/advance
		if (myGen !== goGen) {
			return;
		}

		// Auto path: abort if pause/reduced-motion landed during preload
		if (!user && !rotationAllowed()) {
			advancing = false;
			return;
		}

		scenicIndex = nextIndex;
		showA = !showA;
		// Selected label tracks commit-to-fade (not fade end) so click feedback is immediate
		activePlace = nextPlace;

		fadeTimer = setTimeout(() => {
			if (myGen !== goGen) return;
			fadeTimer = null;
			advancing = false;
			if (rotationAllowed()) scheduleNext();
		}, FADE_MS);
	}

	async function advance() {
		if (!rotationAllowed() || scenicPlaces.length < 2 || advancing || fadeTimer) return;
		const nextIndex = (scenicIndex + 1) % scenicPlaces.length;
		await goToPlace(scenicPlaces[nextIndex]);
	}

	function selectPlace(place) {
		if (!scenery[place]) return;

		// Cancel pending hold and invalidate any in-flight auto advance
		clearHold();
		goGen += 1;

		// Mid-fade / mid-preload: snap to current activePlace so paint never
		// lands on the still-visible fading-out layer, then continue cleanly
		if (fadeTimer || advancing) {
			snapLayersToActive();
		}

		// Blur so focusin-pause on the city button cannot stall the reset timer
		if (typeof document !== 'undefined' && document.activeElement) {
			const focused = document.activeElement;
			if (placesEl && placesEl.contains(focused) && typeof focused.blur === 'function') {
				focused.blur();
			}
		}

		if (place === activePlace) {
			// Re-clicking the current city still resets the ~5s hold
			advancing = false;
			if (rotationAllowed()) scheduleNext();
			else syncPauseFromPointer();
			return;
		}

		goToPlace(place, { user: true });
	}

	function pause() {
		paused = true;
		clearHold();
	}

	function resume() {
		paused = false;
		scheduleNext();
	}

	function isPointerOverAtmosphere() {
		return !!(
			(frameEl && frameEl.matches(':hover')) ||
			(placesEl && (placesEl.matches(':hover') || placesEl.contains(document.activeElement)))
		);
	}

	function syncPauseFromPointer() {
		if (typeof document === 'undefined') return;
		if (document.hidden || isPointerOverAtmosphere()) pause();
		else resume();
	}

	function onVisibility() {
		if (typeof document === 'undefined') return;
		if (document.hidden) pause();
		else syncPauseFromPointer();
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
				goGen += 1;
				advancing = false;
				// Keep current activePlace / layers — only stop advancing
			} else if (!paused) {
				scheduleNext();
			}
		};

		if (mq) {
			if (mq.addEventListener) mq.addEventListener('change', onMq);
			else mq.addListener(onMq);
		}

		// Warm scenic images so the first crossfade is not empty
		scenicPlaces.forEach((place) => {
			preloadScene(scenery[place]);
		});

		document.addEventListener('visibilitychange', onVisibility);
		// Cursor may already be over the hero/list on first paint
		requestAnimationFrame(syncPauseFromPointer);
		if (!paused) scheduleNext();

		return () => {
			clearTimers();
			advancing = false;
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
		bind:this={frameEl}
		on:pointerenter={pause}
		on:pointerleave={resume}
	>
		<div class="layer" class:visible={showA} style="--pos: {layerA.position}; --pos-desk: {layerA.desktopPosition}">
			<picture>
				<source media="(min-width: 900px)" srcset={layerA.desktopWebp} type="image/webp" />
				<source media="(min-width: 900px)" srcset={layerA.desktopJpg} type="image/jpeg" />
				<source srcset={layerA.mobileWebp} type="image/webp" />
				<img
					bind:this={imgA}
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
					bind:this={imgB}
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
		bind:this={placesEl}
		on:pointerenter={pause}
		on:pointerleave={resume}
		on:focusin={pause}
		on:focusout={syncPauseFromPointer}
	>
		{#each places as place, i (place)}
			<li>
				{#if i > 0}
					<span class="sep" aria-hidden="true">→</span>
				{/if}
				<button
					type="button"
					class="place"
					class:active={place === activePlace}
					aria-pressed={place === activePlace}
					on:click={() => selectPlace(place)}
				>{place}</button>
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
		appearance: none;
		background: none;
		border: none;
		margin: 0;
		padding: 0;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 400;
		letter-spacing: 0.01em;
		line-height: 1.45;
		cursor: pointer;
		color: #9a9a9a;
		opacity: 1;
		transition: color 0.35s ease, font-weight 0.35s ease;
	}

	.place.active {
		color: #5a5a5a;
		font-weight: 600;
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
