<!-- TEMP discoverability A/B — delete with experiments.js + TEMP hooks. -->
<script>
	import {
		FLAG_DEFS,
		PRESETS,
		COLOR_MODES,
		ESSAY_MODES,
		READ_MODES,
		OVERLAP_SLIDERS,
		DOCK_SLIDERS,
		COLOR_SLIDERS,
		experiments,
		panelOpen,
		toggleExperiment,
		setPreset,
		setColorMode,
		setEssayMode,
		setReadMode,
		setSlider,
		setPanelOpen
	} from './experiments.js';

	/** @param {HTMLInputElement} node @param {string} id */
	function liveRange(node, id) {
		let dragging = false;
		/** @type {Record<string, boolean | string | number>} */
		let latest = {};
		/** @type {HTMLElement | null} */
		let scrollEl = null;
		let prev = '';
		const sync = () => {
			if (!dragging && node.value !== String(latest[id] ?? '')) node.value = String(latest[id] ?? '');
		};
		const unsub = experiments.subscribe((s) => {
			latest = s;
			sync();
		});
		const onInput = () => setSlider(id, Number(node.value));
		const onDown = () => {
			dragging = true;
			scrollEl = /** @type {HTMLElement | null} */ (node.closest('.exp-body') || node.closest('.exp'));
			if (scrollEl) {
				prev = scrollEl.style.overflow;
				scrollEl.style.overflow = 'hidden';
			}
		};
		const onUp = () => {
			dragging = false;
			if (scrollEl) {
				scrollEl.style.overflow = prev;
				scrollEl = null;
			}
			sync();
		};
		/** @param {TouchEvent} e */
		const blockScroll = (e) => e.preventDefault();
		node.addEventListener('input', onInput);
		node.addEventListener('pointerdown', onDown);
		node.addEventListener('touchstart', onDown, { passive: true });
		node.addEventListener('touchmove', blockScroll, { passive: false });
		for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) node.addEventListener(ev, onUp);
		return {
			/** @param {string} next */ update(next) {
				id = next;
				sync();
			},
			destroy() {
				unsub();
				onUp();
				node.removeEventListener('input', onInput);
				node.removeEventListener('pointerdown', onDown);
				node.removeEventListener('touchstart', onDown);
				node.removeEventListener('touchmove', blockScroll);
				for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) node.removeEventListener(ev, onUp);
			}
		};
	}
</script>

<aside class="exp" class:collapsed={!$panelOpen} aria-label="Experiments">
	<div class="exp-bar">
		<p class="exp-label">Experiments <span class="exp-tag">temp</span></p>
		<button type="button" class="exp-toggle" aria-expanded={$panelOpen} aria-controls="exp-body" on:click={() => setPanelOpen(!$panelOpen)}>
			{$panelOpen ? 'Hide' : 'Show'}
		</button>
	</div>
	{#if $panelOpen}
		<div class="exp-body" id="exp-body">
			{#each FLAG_DEFS as f (f.id)}
				<label class="exp-row" title={f.hint}>
					<input type="checkbox" checked={!!$experiments[f.id]} on:change={() => toggleExperiment(f.id)} />
					<span class="exp-text"><span class="exp-name">{f.label}</span><span class="exp-hint">{f.hint}</span></span>
				</label>
				{#if f.id === 'overlap' && $experiments.overlap}
					<fieldset class="exp-field">
						<legend class="exp-legend">Preset</legend>
						{#each PRESETS as p (p.id)}
							<label class="exp-radio" title={p.hint}
								><input type="radio" name="exp-preset" value={p.id} checked={$experiments.preset === p.id} on:change={() => setPreset(p.id)} /><span>{p.label}</span></label
							>
						{/each}
					</fieldset>
					<div class="exp-sliders">
						{#each OVERLAP_SLIDERS as s (s.id)}
							<label class="exp-slider"
								><span class="exp-slider-meta"><span>{s.label}</span><span class="exp-val">{$experiments[s.id]}</span></span>
								<input type="range" min={s.min} max={s.max} step={s.step} use:liveRange={s.id} /></label
							>
						{/each}
					</div>
				{/if}
				{#if f.id === 'dockSelected' && $experiments.dockSelected}
					<div class="exp-sliders">
						{#each DOCK_SLIDERS as s (s.id)}
							<label class="exp-slider"
								><span class="exp-slider-meta"><span>{s.label}</span><span class="exp-val">{$experiments[s.id]}</span></span>
								<input type="range" min={s.min} max={s.max} step={s.step} use:liveRange={s.id} /></label
							>
						{/each}
					</div>
				{/if}
				{#if f.id === 'colorTheme' && $experiments.colorTheme}
					<fieldset class="exp-field">
						<legend class="exp-legend">Mode</legend>
						{#each COLOR_MODES as m (m.id)}
							<label class="exp-radio" title={m.hint}
								><input type="radio" name="exp-color-mode" value={m.id} checked={$experiments.colorMode === m.id} on:change={() => setColorMode(m.id)} /><span>{m.label}</span></label
							>
						{/each}
					</fieldset>
					<div class="exp-sliders">
						{#each COLOR_SLIDERS as s (s.id)}
							<label class="exp-slider"
								><span class="exp-slider-meta"><span>{s.label}</span><span class="exp-val">{$experiments[s.id]}</span></span>
								<input type="range" min={s.min} max={s.max} step={s.step} use:liveRange={s.id} /></label
							>
						{/each}
					</div>
				{/if}
				{#if f.id === 'essayLayout' && $experiments.essayLayout}
					<fieldset class="exp-field">
						<legend class="exp-legend">Mode</legend>
						{#each ESSAY_MODES as m (m.id)}
							<label class="exp-radio" title={m.hint}
								><input type="radio" name="exp-essay-mode" value={m.id} checked={$experiments.essayMode === m.id} on:change={() => setEssayMode(m.id)} /><span>{m.label}</span></label
							>
						{/each}
					</fieldset>
				{/if}
				{#if f.id === 'textRead' && $experiments.textRead}
					<fieldset class="exp-field">
						<legend class="exp-legend">Read mode</legend>
						{#each READ_MODES as m (m.id)}
							<label class="exp-radio" title={m.hint}
								><input type="radio" name="exp-read-mode" value={m.id} checked={$experiments.readMode === m.id} on:change={() => setReadMode(m.id)} /><span>{m.label}</span></label
							>
						{/each}
					</fieldset>
				{/if}
			{/each}
		</div>
	{/if}
</aside>
