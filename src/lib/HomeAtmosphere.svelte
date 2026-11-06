<!--
  Reversible homepage place-atmosphere (vibe-only; no copy on the photo).
  Delete this component (and its import/usage in index.svelte) to remove
  the wisteria patio plane.
-->
<div class="atmosphere" aria-hidden="true">
	<div class="plane">
		<picture>
			<!-- Landscape desktop: pre-cropped full-res band — no upscale blur -->
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
				width="1400"
				height="1866"
				decoding="async"
				fetchpriority="high"
			/>
		</picture>
		<div class="ground"></div>
	</div>
</div>

<style>
	.atmosphere {
		position: relative;
		/* Bleed out of .home horizontal padding; reversible by removing component */
		margin: -2.25rem -2rem 0;
		min-height: min(72vh, 780px);
		overflow: hidden;
		isolation: isolate;
	}

	.plane {
		position: absolute;
		inset: 0;
	}

	.plane picture,
	.plane .photo {
		display: block;
		width: 100%;
		height: 100%;
	}

	.plane .photo {
		object-fit: cover;
		/* Portrait mobile: keep chairs + hanging blooms in frame */
		object-position: 62% 40%;
	}

	.ground {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 22%;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}

	@media (min-width: 900px) {
		.atmosphere {
			min-height: min(68vh, 820px);
		}

		.plane .photo {
			/* Desktop landscape crop already framed; nudge to the patio heart */
			object-position: 52% 46%;
		}
	}

	@media (max-width: 720px) {
		.atmosphere {
			min-height: min(64vh, 620px);
		}

		.plane .photo {
			object-position: 64% 36%;
		}
	}
</style>
