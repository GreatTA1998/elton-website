<!-- TEMP discoverability A/B — delete with experiments.js + TEMP hooks. -->
<script>
	import {
		FLAG_DEFS,
		MUSIC_PRESETS,
		APPS_PRESETS,
		MUSIC_SLIDERS,
		APPS_SLIDERS,
		DOCK_SLIDERS,
		experiments,
		toggleExperiment,
		setPreset,
		setSlider
	} from './experiments.js';

	const baseFlags = FLAG_DEFS.filter(
		(d) => d.id === 'defaultSecond' || d.id === 'grayscaleUnselected'
	);
	const musicFlag = FLAG_DEFS.find((d) => d.id === 'overlapMusic');
	const appsFlag = FLAG_DEFS.find((d) => d.id === 'overlapApps');
	const dockFlag = FLAG_DEFS.find((d) => d.id === 'dockSelected');

	/** @param {Event & { currentTarget: HTMLInputElement }} e @param {string} id */
	function onSlider(e, id) {
		setSlider(id, Number(e.currentTarget.value));
	}
</script>

<section class="exp" aria-label="Experiments">
	<p class="exp-label">Experiments <span class="exp-tag">temp</span></p>

	<ul class="exp-list">
		{#each baseFlags as def (def.id)}
			<li>
				<label class="exp-row" title={def.hint}>
					<input
						type="checkbox"
						checked={!!$experiments[def.id]}
						on:change={() => toggleExperiment(def.id)}
					/>
					<span class="exp-text">
						<span class="exp-name">{def.label}</span>
						<span class="exp-hint">{def.hint}</span>
					</span>
				</label>
			</li>
		{/each}
	</ul>

	<p class="exp-section">Overlap</p>

	<label class="exp-row" title={musicFlag.hint}>
		<input
			type="checkbox"
			checked={!!$experiments.overlapMusic}
			on:change={() => toggleExperiment('overlapMusic')}
		/>
		<span class="exp-text">
			<span class="exp-name">{musicFlag.label}</span>
			<span class="exp-hint">{musicFlag.hint}</span>
		</span>
	</label>

	{#if $experiments.overlapMusic}
		<fieldset class="exp-field">
			<legend class="exp-legend">Music preset</legend>
			{#each MUSIC_PRESETS as p (p.id)}
				<label class="exp-radio" title={p.hint}>
					<input
						type="radio"
						name="exp-music-preset"
						value={p.id}
						checked={$experiments.musicPreset === p.id}
						on:change={() => setPreset('music', p.id)}
					/>
					<span>{p.label}</span>
				</label>
			{/each}
		</fieldset>
		<div class="exp-sliders">
			{#each MUSIC_SLIDERS as s (s.id)}
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

	<label class="exp-row" title={appsFlag.hint}>
		<input
			type="checkbox"
			checked={!!$experiments.overlapApps}
			on:change={() => toggleExperiment('overlapApps')}
		/>
		<span class="exp-text">
			<span class="exp-name">{appsFlag.label}</span>
			<span class="exp-hint">{appsFlag.hint}</span>
		</span>
	</label>

	{#if $experiments.overlapApps}
		<fieldset class="exp-field">
			<legend class="exp-legend">Apps preset</legend>
			{#each APPS_PRESETS as p (p.id)}
				<label class="exp-radio" title={p.hint}>
					<input
						type="radio"
						name="exp-apps-preset"
						value={p.id}
						checked={$experiments.appsPreset === p.id}
						on:change={() => setPreset('apps', p.id)}
					/>
					<span>{p.label}</span>
				</label>
			{/each}
		</fieldset>
		<div class="exp-sliders">
			{#each APPS_SLIDERS as s (s.id)}
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

	<p class="exp-section">Extra depth</p>

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
</section>

<style>
	.exp {
		margin-top: 1.75rem;
		padding-top: 1rem;
		border-top: 1px dashed rgba(42, 42, 42, 0.14);
		max-width: 22rem;
	}

	.exp-label {
		margin: 0 0 0.55rem;
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

	.exp-section {
		margin: 0.95rem 0 0.4rem;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #b0b0b0;
	}

	.exp-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.4rem;
	}

	.exp-row {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin: 0.35rem 0;
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
		margin: 0.25rem 0 0.35rem 1.35rem;
		padding: 0.35rem 0 0;
		border: none;
		display: grid;
		gap: 0.22rem;
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
		margin: 0.2rem 0 0.45rem 1.35rem;
		display: grid;
		gap: 0.4rem;
	}

	.exp-slider {
		display: grid;
		gap: 0.15rem;
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
		width: 100%;
		margin: 0;
		accent-color: #6a6a6a;
	}
</style>
