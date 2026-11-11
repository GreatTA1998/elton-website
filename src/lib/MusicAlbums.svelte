<script>
	import { nowPlaying, TRACKS, ALBUM_IDS, playTrack } from './nowPlaying.js';

	export let size = 'sm'; // sm | md
	export let showOfficial = false;
</script>

<div class="row">
	{#if showOfficial}
		<button
			type="button"
			class="official"
			class:selected={$nowPlaying.id === 'rachmaninoff'}
			aria-pressed={$nowPlaying.id === 'rachmaninoff'}
			aria-label={`Play official recording. ${TRACKS.rachmaninoff.credit}`}
			on:click={() => playTrack('rachmaninoff')}
		>
			<span class="kicker">official</span>
			<span class="name">{TRACKS.rachmaninoff.title}</span>
			<span class="who">Ashkenazy · YouTube</span>
		</button>
	{/if}

	<div class="albums" class:md={size === 'md'} aria-label="My recordings">
		{#each ALBUM_IDS as id (id)}
			{@const track = TRACKS[id]}
			<button
				type="button"
				class="album"
				class:selected={$nowPlaying.id === id}
				aria-pressed={$nowPlaying.id === id}
				aria-label={`Play ${track.title}. ${track.credit}`}
				on:click={() => playTrack(id)}
			>
				<img src={track.cover} alt="" />
				<span class="cap">
					<span class="name">{track.title}</span>
					<span class="who">my playing</span>
				</span>
			</button>
		{/each}

		<div class="album placeholder" aria-disabled="true">
			<span class="name">Bach Prelude &amp; Fugue in D</span>
			<span class="who">coming soon</span>
		</div>
	</div>
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: stretch;
	}

	.official {
		appearance: none;
		width: 148px;
		margin: 0;
		padding: 12px 12px 14px;
		border: 1px solid #ececec;
		border-radius: 10px;
		background: #fff;
		cursor: pointer;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 4px;
		min-height: 148px;
	}

	.official.selected {
		border-color: #2c2c2c;
		box-shadow: 0 0 0 1px #2c2c2c;
	}

	.kicker {
		font-size: 0.62rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #8a8a8a;
		margin-bottom: auto;
	}

	.albums {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: flex-start;
	}

	.album {
		appearance: none;
		width: 118px;
		margin: 0;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 10px;
		background: #fff;
		cursor: pointer;
		text-align: left;
		overflow: hidden;
		box-sizing: border-box;
	}

	.albums.md .album {
		width: 148px;
	}

	.album img {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		transform: scale(1.03);
		transform-origin: center;
		background: #f4f4f4;
	}

	.album.selected {
		border-color: #2c2c2c;
		box-shadow: 0 0 0 1px #2c2c2c;
	}

	.cap,
	.placeholder {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 7px 8px 8px;
	}

	.placeholder {
		width: 118px;
		min-height: 118px;
		border: 1px solid #ececec;
		border-radius: 10px;
		background: #fafafa;
		justify-content: center;
		box-sizing: border-box;
		color: #6a6a6a;
	}

	.albums.md .placeholder {
		width: 148px;
		min-height: 148px;
	}

	.name {
		font-size: 0.72rem;
		font-weight: 500;
		line-height: 1.3;
		color: #2c2c2c;
	}

	.official .name {
		font-size: 0.74rem;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.who {
		font-size: 0.65rem;
		font-weight: 400;
		color: #8a8a8a;
		line-height: 1.3;
	}

	.placeholder .name {
		color: #555;
		font-weight: 400;
		font-size: 0.78rem;
	}
</style>
