<!--
  Reversible homepage place-atmosphere.
  Delete this component (and its import/usage in index.svelte) to restore
  the plain welcome line without the wisteria patio plane.
-->
<header class="atmosphere" aria-label="Home">
	<div class="plane" aria-hidden="true">
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

	<p class="welcome">
		Welcome to my absolutely EPIC website, it's INSANE:
	</p>
</header>

<style>
	.atmosphere {
		position: relative;
		/* Bleed out of .home horizontal padding; reversible by removing component */
		margin: -2.25rem -2rem 0;
		min-height: min(78vh, 860px);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		overflow: hidden;
		isolation: isolate;
	}

	.plane {
		position: absolute;
		inset: 0;
		z-index: 0;
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
				rgba(250, 248, 252, 0.18) 0%,
				rgba(250, 248, 252, 0.05) 28%,
				rgba(20, 16, 24, 0.08) 58%,
				rgba(12, 10, 16, 0.55) 100%
			),
			radial-gradient(
				120% 70% at 70% 18%,
				rgba(170, 140, 210, 0.18) 0%,
				transparent 55%
			);
	}

	.ground {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 28%;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}

	.welcome {
		position: relative;
		z-index: 1;
		margin: 0;
		padding: 0 2rem 1.35rem;
		max-width: 36rem;
		font-size: 1.08rem;
		font-weight: 500;
		color: #f7f4fb;
		line-height: 1.5;
		text-shadow: 0 1px 18px rgba(10, 8, 14, 0.45);
		animation: rise 900ms ease-out both;
	}

	@keyframes drift {
		from {
			transform: scale(1.02) translate3d(0, 0, 0);
		}
		to {
			transform: scale(1.055) translate3d(-1.2%, 0.8%, 0);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.plane img,
		.welcome {
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

		.welcome {
			font-size: 1.02rem;
			padding-bottom: 1.1rem;
		}
	}
</style>
