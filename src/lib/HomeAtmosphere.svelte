<!--
  Reversible homepage place-atmosphere (vibe-only; no copy on the photo).
  Portrait composition is the target (chairs + wisteria + fade).
  Delete this component (and its import/usage in index.svelte) to remove it.
-->
<div class="atmosphere" aria-hidden="true">
	<div class="frame">
		<picture>
			<!-- Desktop: sharp full-res PORTRAIT of the same framing (not a landscape stretch) -->
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
	<div class="ground"></div>
</div>

<style>
	.atmosphere {
		position: relative;
		/* Bleed out of .home horizontal padding; reversible by removing component */
		margin: -2.25rem -2rem 0;
		display: flex;
		justify-content: center;
		align-items: stretch;
		overflow: hidden;
		isolation: isolate;
		background: #ffffff;
	}

	.frame {
		position: relative;
		width: 100%;
		/* Keep portrait framing — never squash into a wide short band */
		aspect-ratio: 3 / 4;
		max-height: min(86vh, 980px);
		overflow: hidden;
	}

	.frame picture,
	.frame .photo {
		display: block;
		width: 100%;
		height: 100%;
	}

	.frame .photo {
		object-fit: cover;
		object-position: 58% 42%;
	}

	.ground {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 18%;
		pointer-events: none;
		z-index: 1;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}

	@media (min-width: 900px) {
		.atmosphere {
			/* Soft side wash so the portrait sits in place without edge stretch */
			background:
				linear-gradient(
					90deg,
					#ffffff 0%,
					rgba(255, 255, 255, 0.92) 12%,
					rgba(255, 255, 255, 0) 28%,
					rgba(255, 255, 255, 0) 72%,
					rgba(255, 255, 255, 0.92) 88%,
					#ffffff 100%
				);
		}

		.frame {
			width: min(100%, calc(min(86vh, 980px) * 0.75));
			max-height: min(86vh, 980px);
			aspect-ratio: 3 / 4;
		}

		.frame .photo {
			/* Chairs + hanging wisteria + petal ground */
			object-position: 55% 44%;
		}
	}

	@media (max-width: 720px) {
		.frame {
			max-height: min(78vh, 760px);
		}

		.frame .photo {
			object-position: 62% 38%;
		}
	}
</style>
