<!-- TEMP discoverability A/B — delete with experiments.js + TEMP hooks. -->
<script>
	import {
		FLAG_DEFS,
		PRESETS,
		COLOR_MODES,
		OVERLAP_SLIDERS,
		DOCK_SLIDERS,
		COLOR_SLIDERS,
		experiments,
		panelOpen,
		toggleExperiment,
		setPreset,
		setColorMode,
		setSlider,
		setPanelOpen
	} from './experiments.js';

	/** Owns range value; skips store→DOM sync while dragging. @param {HTMLInputElement} node @param {string} id */
	function liveRange(node, id) {
		/** @type {HTMLElement | null} */
		let scrollEl = null;
		let prev = '';
		let dragging = false;
		/** @type {Record<string, boolean | string | number>} */
		let latest = {};
		const syncFromStore = () => {
			if (dragging) return;
			const next = String(latest[id] ?? '');
			if (node.value !== next) node.value = next;
		};
		const unsub = experiments.subscribe((state) => {
			latest = state;
			syncFromStore();
		});
		const onInput = () => setSlider(id, Number(node.value));
		/** @param {TouchEvent} e */
		const onTouchMove = (e) => e.preventDefault();
		const onDown = () => {
			dragging = true;
			scrollEl = /** @type {HTMLElement | null} */ (node.closest('.exp-body') || node.closest('.exp'));
			if (!scrollEl) return;
			prev = scrollEl.style.overflow;
			scrollEl.style.overflow = 'hidden';
		};
		const onUp = () => {
			dragging = false;
			if (scrollEl) {
				scrollEl.style.overflow = prev;
				scrollEl = null;
			}
			syncFromStore();
		};
		const ups = ['pointerup', 'pointercancel', 'lostpointercapture'];
		node.addEventListener('input', onInput);
		node.addEventListener('touchmove', onTouchMove, { passive: false });
		node.addEventListener('pointerdown', onDown);
		node.addEventListener('touchstart', onDown, { passive: true });
		for (const ev of ups) node.addEventListener(ev, onUp);
		return {
			/** @param {string} next */ update(next) {
				id = next;
				syncFromStore();
			},
			destroy() {
				unsub();
				onUp();
				node.removeEventListener('input', onInput);
				node.removeEventListener('touchmove', onTouchMove);
				node.removeEventListener('pointerdown', onDown);
				node.removeEventListener('touchstart', onDown);
				for (const ev of ups) node.removeEventListener(ev, onUp);
			}
		};
	}
</script>

<aside class="exp" class:collapsed={!$panelOpen} aria-label="Experiments">
	<div class="exp-bar">
		<p class="exp-label">Experiments <span class="exp-tag">temp</span></p>
		<button
			type="button"
			class="exp-toggle"
			aria-expanded={$panelOpen}
			aria-controls="exp-body"
			on:click={() => setPanelOpen(!$panelOpen)}
		>
			{$panelOpen ? 'Hide' : 'Show'}
		</button>
	</div>

	{#if $panelOpen}
		<div class="exp-body" id="exp-body">
			{#each FLAG_DEFS as f (f.id)}
				<label class="exp-row" title={f.hint}>
					<input
						type="checkbox"
						checked={!!$experiments[f.id]}
						on:change={() => toggleExperiment(f.id)}
					/>
					<span class="exp-text">
						<span class="exp-name">{f.label}</span>
						<span class="exp-hint">{f.hint}</span>
					</span>
				</label>

				{#if f.id === 'overlap' && $experiments.overlap}
					<fieldset class="exp-field">
						<legend class="exp-legend">Preset</legend>
						{#each PRESETS as p (p.id)}
							<label class="exp-radio" title={p.hint}>
								<input
									type="radio"
									name="exp-preset"
									value={p.id}
									checked={$experiments.preset === p.id}
									on:change={() => setPreset(p.id)}
								/>
								<span>{p.label}</span>
							</label>
						{/each}
					</fieldset>
					<div class="exp-sliders">
						{#each OVERLAP_SLIDERS as s (s.id)}
							<label class="exp-slider">
								<span class="exp-slider-meta"
									><span>{s.label}</span><span class="exp-val">{$experiments[s.id]}</span></span
								>
								<input type="range" min={s.min} max={s.max} step={s.step} use:liveRange={s.id} />
							</label>
						{/each}
					</div>
				{/if}

				{#if f.id === 'dockSelected' && $experiments.dockSelected}
					<div class="exp-sliders">
						{#each DOCK_SLIDERS as s (s.id)}
							<label class="exp-slider">
								<span class="exp-slider-meta"
									><span>{s.label}</span><span class="exp-val">{$experiments[s.id]}</span></span
								>
								<input type="range" min={s.min} max={s.max} step={s.step} use:liveRange={s.id} />
							</label>
						{/each}
					</div>
				{/if}

				{#if f.id === 'colorTheme' && $experiments.colorTheme}
					<fieldset class="exp-field">
						<legend class="exp-legend">Mode</legend>
						{#each COLOR_MODES as m (m.id)}
							<label class="exp-radio" title={m.hint}>
								<input
									type="radio"
									name="exp-color-mode"
									value={m.id}
									checked={$experiments.colorMode === m.id}
									on:change={() => setColorMode(m.id)}
								/>
								<span>{m.label}</span>
							</label>
						{/each}
					</fieldset>
					<div class="exp-sliders">
						{#each COLOR_SLIDERS as s (s.id)}
							<label class="exp-slider">
								<span class="exp-slider-meta"
									><span>{s.label}</span><span class="exp-val">{$experiments[s.id]}</span></span
								>
								<input type="range" min={s.min} max={s.max} step={s.step} use:liveRange={s.id} />
							</label>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</aside>

<style>
	.exp {
		position: fixed;
		left: 0.65rem;
		right: 0.65rem;
		bottom: 0.55rem;
		z-index: 80;
		max-width: 22rem;
		margin: 0 auto;
		padding: 0.45rem 0.65rem 0.55rem;
		box-sizing: border-box;
		background: rgba(250, 249, 247, 0.94);
		border: 1px solid rgba(42, 42, 42, 0.12);
		border-radius: 10px;
		box-shadow: 0 6px 22px rgba(42, 42, 42, 0.08);
		pointer-events: auto;
		overflow: visible;
	}
	.exp.collapsed { padding-bottom: 0.45rem; }
	.exp-bar { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
	.exp-label {
		margin: 0;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #9a9a9a;
	}
	.exp-tag {
		margin-left: 0.35rem;
		padding: 0.05rem 0.32rem;
		border: 1px solid rgba(42, 42, 42, 0.12);
		border-radius: 3px;
		font-size: 0.58rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: lowercase;
		color: #b0b0b0;
	}
	.exp-toggle {
		appearance: none;
		margin: 0;
		padding: 0.12rem 0.45rem;
		border: 1px solid rgba(42, 42, 42, 0.14);
		border-radius: 4px;
		background: transparent;
		font-size: 0.68rem;
		font-weight: 500;
		color: #7a7a7a;
		cursor: pointer;
	}
	.exp-body {
		margin-top: 0.35rem;
		max-height: min(46vh, 24rem);
		overflow: auto;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
	}
	.exp-row {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin: 0.3rem 0;
		cursor: pointer;
		color: #6a6a6a;
	}
	.exp-row input { margin: 0.15rem 0 0; accent-color: #5a5a5a; }
	.exp-text { display: flex; flex-direction: column; gap: 0.08rem; min-width: 0; }
	.exp-name { font-size: 0.78rem; font-weight: 500; color: #4a4a4a; line-height: 1.3; }
	.exp-hint { font-size: 0.68rem; line-height: 1.3; color: #9a9a9a; }
	.exp-field {
		margin: 0.2rem 0 0.3rem 1.35rem;
		padding: 0.3rem 0 0;
		border: none;
		display: grid;
		gap: 0.18rem;
	}
	.exp-legend { padding: 0; font-size: 0.64rem; font-weight: 500; color: #8a8a8a; }
	.exp-radio {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.74rem;
		color: #5a5a5a;
		cursor: pointer;
	}
	.exp-radio input { margin: 0; accent-color: #5a5a5a; }
	.exp-sliders { margin: 0.15rem 0 0.35rem 1.35rem; display: grid; gap: 0.32rem; }
	.exp-slider { display: grid; gap: 0.12rem; font-size: 0.7rem; color: #6a6a6a; touch-action: none; }
	.exp-slider-meta { display: flex; justify-content: space-between; gap: 0.5rem; }
	.exp-val { font-variant-numeric: tabular-nums; color: #9a9a9a; }
	.exp-slider input[type='range'] {
		display: block;
		width: 100%;
		margin: 0;
		padding: 0;
		height: 1.75rem;
		accent-color: #6a6a6a;
		touch-action: none;
		cursor: pointer;
	}
</style>
