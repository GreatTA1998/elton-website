<script>
	import { onMount } from 'svelte';
	import CompactMusicPlayer from '$lib/CompactMusicPlayer.svelte';
	import ListenModeSwitcher from '$lib/ListenModeSwitcher.svelte';
	import MusicShelf from '$lib/MusicShelf.svelte';
	import { initListenMode, listenMode } from '$lib/nowPlaying.js';

	onMount(() => {
		initListenMode();
	});

	$: if (typeof document !== 'undefined') {
		document.body.classList.toggle('listen-2', $listenMode === 2);
		document.body.classList.toggle('listen-3', $listenMode === 3);
	}
</script>

{#if $listenMode === 1}
	<CompactMusicPlayer variant="pill" />
{/if}

{#if $listenMode === 2}
	<MusicShelf />
{/if}

<slot />

<ListenModeSwitcher />

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-size: 16px;
		font-weight: 400;
		color: #2c2c2c;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: #ffffff;
		min-height: 100vh;
	}

	:global(body.listen-2) {
		padding-bottom: 9.5rem;
	}

	:global(a) {
		color: inherit;
	}
</style>
