<script>
	export let src;
	export let label = 'Play recording';

	let audio;
	let playing = false;
	let progress = 0;
	let duration = 0;
	let scrubbing = false;

	function togglePlay() {
		if (!audio) return;
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}

	function onPlay() {
		playing = true;
	}

	function onPause() {
		playing = false;
	}

	function onLoadedMetadata() {
		duration = audio?.duration || 0;
	}

	function onTimeUpdate() {
		if (!audio || scrubbing || !duration) return;
		progress = audio.currentTime / duration;
	}

	function onEnded() {
		playing = false;
		progress = 0;
		if (audio) audio.currentTime = 0;
	}

	function seekFromEvent(event) {
		if (!audio || !duration) return;
		const track = event.currentTarget;
		const rect = track.getBoundingClientRect();
		const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
		const next = rect.width ? x / rect.width : 0;
		progress = next;
		audio.currentTime = next * duration;
	}

	function onScrubPointerDown(event) {
		if (!audio || !duration) return;
		scrubbing = true;
		seekFromEvent(event);
		const track = event.currentTarget;

		function onMove(moveEvent) {
			seekFromEvent({ currentTarget: track, clientX: moveEvent.clientX });
		}

		function onUp(upEvent) {
			scrubbing = false;
			seekFromEvent({ currentTarget: track, clientX: upEvent.clientX });
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		}

		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}
</script>

<div class="glass-player">
	<audio
		bind:this={audio}
		{src}
		preload="metadata"
		on:play={onPlay}
		on:pause={onPause}
		on:ended={onEnded}
		on:loadedmetadata={onLoadedMetadata}
		on:timeupdate={onTimeUpdate}
	></audio>

	<button
		type="button"
		class="play-btn"
		aria-label={playing ? `Pause ${label}` : `Play ${label}`}
		on:click={togglePlay}
	>
		{#if playing}
			<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
				<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
				<rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
				<path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
			</svg>
		{/if}
	</button>

	<div
		class="scrub"
		role="slider"
		tabindex="0"
		aria-label={`${label} progress`}
		aria-valuemin="0"
		aria-valuemax="100"
		aria-valuenow={Math.round(progress * 100)}
		on:pointerdown={onScrubPointerDown}
	>
		<div class="scrub-track">
			<div class="scrub-fill" style={`width: ${progress * 100}%`}></div>
		</div>
	</div>
</div>

<style>
	.glass-player {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 10px;
		min-height: 0;
		border-radius: 0 0 10px 10px;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.22) 0%,
			rgba(255, 255, 255, 0.12) 100%
		);
		border: none;
		border-top: 1px solid rgba(255, 255, 255, 0.42);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28);
		backdrop-filter: blur(5px) saturate(1.15);
		-webkit-backdrop-filter: blur(5px) saturate(1.15);
		box-sizing: border-box;
	}

	.play-btn {
		appearance: none;
		flex: 0 0 auto;
		width: 18px;
		height: 18px;
		margin: 0;
		padding: 0;
		border: none;
		border-radius: 0;
		background: transparent;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: none;
	}

	.play-btn:hover {
		color: #fff;
		background: transparent;
		opacity: 0.9;
	}

	.play-btn svg {
		display: block;
	}

	.scrub {
		flex: 1 1 auto;
		min-width: 0;
		height: 16px;
		display: flex;
		align-items: center;
		cursor: pointer;
		touch-action: none;
	}

	.scrub-track {
		position: relative;
		width: 100%;
		height: 3px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.28);
		overflow: hidden;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
	}

	.scrub-fill {
		height: 100%;
		border-radius: inherit;
		background: rgba(255, 255, 255, 0.88);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
	}
</style>
