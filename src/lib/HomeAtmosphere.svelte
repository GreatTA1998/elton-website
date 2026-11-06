<!--
  Reversible homepage place-atmosphere (vibe-only; no copy on the photo).
  Delete this component (and its import/usage in index.svelte) to remove
  the wisteria patio plane.
-->
<div class="atmosphere" aria-hidden="true">
	<div class="plane">
		<picture>
			<source srcset="/home-wisteria.webp" type="image/webp" />
			<img
				src="/home-wisteria.jpg"
				alt=""
				width="1400"
				height="1866"
				decoding="async"
				fetchpriority="high"
			/>
		</picture>
		<div class="veil"></div>
		<div class="ground"></div>
	</div>
</div>

<style>
	.atmosphere {
		position: relative;
		/* Bleed out of .home horizontal padding; reversible by removing component */
		margin: -2.25rem -2rem 0;
		min-height: min(78vh, 860px);
		overflow: hidden;
		isolation: isolate;
	}

	.plane {
		position: absolute;
		inset: 0;
	}

	.plane picture,
	.plane img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.plane img {
		object-fit: cover;
		object-position: 58% 42%;
		transform: scale(1.02);
		animation: drift 28s ease-in-out infinite alternate;
	}

	.veil {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.12) 0%,
				rgba(255, 255, 255, 0.02) 35%,
				rgba(255, 255, 255, 0.04) 70%,
				rgba(255, 255, 255, 0) 100%
			),
			radial-gradient(
				120% 70% at 70% 18%,
				rgba(170, 140, 210, 0.14) 0%,
				transparent 55%
			);
	}

	.ground {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 32%;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}

	@keyframes drift {
		from {
			transform: scale(1.02) translate3d(0, 0, 0);
		}
		to {
			transform: scale(1.055) translate3d(-1.2%, 0.8%, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.plane img {
			animation: none;
		}
	}

	@media (max-width: 720px) {
		.atmosphere {
			min-height: min(68vh, 640px);
		}

		.plane img {
			object-position: 62% 38%;
		}
	}
</style>
