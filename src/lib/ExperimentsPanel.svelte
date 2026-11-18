<!-- TEMP discoverability A/B — delete with experiments.js + TEMP hooks. -->
<script>
	import {
		FLAG_DEFS,
		PRESETS,
		OVERLAP_SLIDERS,
		DOCK_SLIDERS,
		experiments,
		panelOpen,
		toggleExperiment,
		setPreset,
		setSlider,
		setPanelOpen
	} from './experiments.js';

	const defaultFlag = FLAG_DEFS.find((d) => d.id === 'defaultSecond');
	const overlapFlag = FLAG_DEFS.find((d) => d.id === 'overlap');
	const dockFlag = FLAG_DEFS.find((d) => d.id === 'dockSelected');

	/** @param {Event & { currentTarget: HTMLInputElement }} e @param {string} id */
	function onSlider(e, id) {
		setSlider(id, Number(e.currentTarget.value));
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
			<label class="exp-row" title={defaultFlag.hint}>
				<input
					type="checkbox"
					checked={!!$experiments.defaultSecond}
					on:change={() => toggleExperiment('defaultSecond')}
				/>
				<span class="exp-text">
					<span class="exp-name">{defaultFlag.label}</span>
					<span class="exp-hint">{defaultFlag.hint}</span>
				</span>
			</label>

			<label class="exp-row" title={overlapFlag.hint}>
				<input
					type="checkbox"
					checked={!!$experiments.overlap}
					on:change={() => toggleExperiment('overlap')}
				/>
				<span class="exp-text">
					<span class="exp-name">{overlapFlag.label}</span>
					<span class="exp-hint">{overlapFlag.hint}</span>
				</span>
			</label>

			{#if $experiments.overlap}
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
							<span class="exp-slider-meta">
								<span>{s.label}</span>
								<span class="exp-val">{$experiments[s.id]}</span>
							</span>
							<input
								type="range"
								min={s.min}
								max={s.max}
								step={s.step}
								value={$experiments[s.id]}
								on:input={(e) => onSlider(e, s.id)}
							/>
						</label>
					{/each}
				</div>
			{/if}

			<label class="exp-row" title={dockFlag.hint}>
				<input
					type="checkbox"
					checked={!!$experiments.dockSelected}
					on:change={() => toggleExperiment('dockSelected')}
				/>
				<span class="exp-text">
					<span class="exp-name">{dockFlag.label}</span>
					<span class="exp-hint">{dockFlag.hint}</span>
				</span>
			</label>

			{#if $experiments.dockSelected}
				<div class="exp-sliders">
					{#each DOCK_SLIDERS as s (s.id)}
						<label class="exp-slider">
							<span class="exp-slider-meta">
								<span>{s.label}</span>
								<span class="exp-val">{$experiments[s.id]}</span>
							</span>
							<input
								type="range"
								min={s.min}
								max={s.max}
								step={s.step}
								value={$experiments[s.id]}
								on:input={(e) => onSlider(e, s.id)}
							/>
						</label>
					{/each}
				</div>
			{/if}
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
		max-height: min(46vh, 22rem);
		overflow: auto;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
	}

	.exp.collapsed {
		max-height: none;
		overflow: visible;
		padding-bottom: 0.45rem;
	}

	.exp-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

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
	}

	.exp-row {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin: 0.3rem 0;
		cursor: pointer;
		color: #6a6a6a;
	}

	.exp-row input {
		margin: 0.15rem 0 0;
		accent-color: #5a5a5a;
	}

	.exp-text {
		display: flex;
		flex-direction: column;
		gap: 0.08rem;
		min-width: 0;
	}

	.exp-name {
		font-size: 0.78rem;
		font-weight: 500;
		color: #4a4a4a;
		line-height: 1.3;
	}

	.exp-hint {
		font-size: 0.68rem;
		line-height: 1.3;
		color: #9a9a9a;
	}

	.exp-field {
		margin: 0.2rem 0 0.3rem 1.35rem;
		padding: 0.3rem 0 0;
		border: none;
		display: grid;
		gap: 0.18rem;
	}

	.exp-legend {
		padding: 0;
		font-size: 0.64rem;
		font-weight: 500;
		color: #8a8a8a;
	}

	.exp-radio {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.74rem;
		color: #5a5a5a;
		cursor: pointer;
	}

	.exp-radio input {
		margin: 0;
		accent-color: #5a5a5a;
	}

	.exp-sliders {
		margin: 0.15rem 0 0.35rem 1.35rem;
		display: grid;
		gap: 0.32rem;
	}

	.exp-slider {
		display: grid;
		gap: 0.12rem;
		font-size: 0.7rem;
		color: #6a6a6a;
	}

	.exp-slider-meta {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.exp-val {
		font-variant-numeric: tabular-nums;
		color: #9a9a9a;
	}

	.exp-slider input[type='range'] {
		display: block;
		width: 100%;
		margin: 0;
		padding: 0;
		height: 1.75rem;
		accent-color: #6a6a6a;
		/* don’t let the panel’s overflow scroll steal the drag (esp. Active scale on phone) */
		touch-action: none;
		cursor: pointer;
		pointer-events: auto;
	}
</style>
