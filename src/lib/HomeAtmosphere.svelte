<!--
  Reversible homepage place-atmosphere (vibe-only photo + quiet lived places).
  Portrait composition is the target (chairs + wisteria). No white fade overlay.
  Delete this component (and its import/usage in index.svelte) to remove it.
-->
<script>
	// Cities only (>short stops omitted). No country suffixes, no London/Taipei.
	// Later: selecting a place can swap scenery; Hsinchu = current home-wisteria photo.
	const places = [
		'Hsinchu',
		'Shanghai',
		'Eindhoven',
		'Milton Keynes',
		'Boston',
		'Tokyo'
	];
</script>

<div class="atmosphere">
	<div class="frame" aria-hidden="true">
		<picture>
			<source
				media="(min-width: 900px)"
				srcset="/home-wisteria-desktop.webp"
				type="image/webp"
			/>
			<source
				media="(min-width: 900px)"
				srcset="/home-wisteria-desktop.jpg"
				type="image/jpeg"
			/>
			<source srcset="/home-wisteria.webp" type="image/webp" />
			<img
				class="photo"
				src="/home-wisteria.jpg"
				alt=""
				width="1200"
				height="1600"
				decoding="async"
				fetchpriority="high"
			/>
		</picture>
	</div>

	<ol class="places" aria-label="Places lived">
		{#each places as place, i (place)}
			<li>
				{#if i > 0}
					<span class="sep" aria-hidden="true">→</span>
				{/if}
				<span class="place">{place}</span>
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
	}

	.frame picture,
	.frame .photo {
		display: block;
		width: 100%;
		height: 100%;
	}

	.frame .photo {
		object-fit: cover;
		object-position: 62% 38%;
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

		.frame .photo {
			object-position: 55% 44%;
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
</style>
