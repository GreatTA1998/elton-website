<script>
	import { onMount } from 'svelte';
	import CompactMusicPlayer from '$lib/CompactMusicPlayer.svelte';
	import LanguageToggle from '$lib/LanguageToggle.svelte';
	import WelcomeSplash from '$lib/WelcomeSplash.svelte';
	import { hydrateExperiments } from '$lib/experiments.js'; // TEMP experiments
	import '$lib/expSurfaces.css'; // TEMP experiments

	// TEMP experiments
	onMount(hydrateExperiments);
</script>

<WelcomeSplash />
<LanguageToggle />
<CompactMusicPlayer />

<slot />

<style>
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
	}

	:global(a) {
		color: inherit;
	}
</style>
