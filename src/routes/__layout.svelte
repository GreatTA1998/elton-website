<script>
	import CompactMusicPlayer from '$lib/CompactMusicPlayer.svelte';
	import LanguageToggle from '$lib/LanguageToggle.svelte';
</script>

<LanguageToggle />
<CompactMusicPlayer />

<slot />

<style>
	:global(html),
	:global(body) {
		margin: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-size: 16px;
		font-weight: 400;
		color: #2c2c2c;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: #fafafa;
		min-height: 100vh;
		min-height: -webkit-fill-available;
	}

	:global(a) {
		color: inherit;
	}
</style>
