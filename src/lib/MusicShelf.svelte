<script>
	import CompactMusicPlayer from './CompactMusicPlayer.svelte';
	import MusicAlbums from './MusicAlbums.svelte';
	import { playTrack, nowPlaying, TRACKS } from './nowPlaying.js';
</script>

<aside class="shelf" aria-label="Listening shelf">
	<div class="shelf-inner">
		<button
			type="button"
			class="official"
			class:selected={$nowPlaying.id === 'rachmaninoff'}
			aria-pressed={$nowPlaying.id === 'rachmaninoff'}
			on:click={() => playTrack('rachmaninoff')}
		>
			<span class="kicker">official</span>
			<span class="label">{TRACKS.rachmaninoff.title}</span>
			<span class="who">Ashkenazy</span>
		</button>

		<CompactMusicPlayer variant="shelf" />
		<MusicAlbums size="sm" />
	</div>
</aside>

<style>
	.shelf {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 60;
		padding: 0.65rem 0.85rem calc(0.65rem + env(safe-area-inset-bottom, 0px));
		background: rgba(255, 255, 255, 0.94);
		border-top: 1px solid #ececec;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	.shelf-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
	}

	.official {
		appearance: none;
		margin: 0;
		padding: 0.55rem 0.7rem;
		border: 1px solid #ececec;
		border-radius: 12px;
		background: #fff;
		cursor: pointer;
		text-align: left;
		max-width: 14rem;
		min-width: 10rem;
	}

	.official.selected {
		border-color: #2c2c2c;
		box-shadow: 0 0 0 1px #2c2c2c;
	}

	.kicker {
		display: block;
		font-size: 0.62rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #8a8a8a;
		margin-bottom: 0.2rem;
	}

	.label {
		display: block;
		font-size: 0.74rem;
		font-weight: 500;
		color: #2c2c2c;
		line-height: 1.3;
	}

	.who {
		display: block;
		margin-top: 0.15rem;
		font-size: 0.66rem;
		color: #7a7a7a;
	}
</style>
