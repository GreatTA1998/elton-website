<!-- TEMP discoverability A/B — delete with experiments.js + TEMP hooks. -->
<script>
	import { EXPERIMENT_DEFS, experiments, toggleExperiment } from './experiments.js';
</script>

<section class="exp" aria-label="Experiments">
	<p class="exp-label">Experiments <span class="exp-tag">temp</span></p>
	<ul class="exp-list">
		{#each EXPERIMENT_DEFS as def (def.id)}
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
</style>
