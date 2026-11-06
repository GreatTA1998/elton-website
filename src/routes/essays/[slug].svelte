<script context="module">
	import { getEssay, getEssayRedirect } from '$lib/essays/index.js';

	/** @type {import('@sveltejs/kit').Load} */
	export function load({ params }) {
		const redirectTo = getEssayRedirect(params.slug);
		if (redirectTo) {
			return {
				status: 301,
				redirect: redirectTo
			};
		}

		const essay = getEssay(params.slug);

		if (!essay) {
			return {
				status: 404,
				error: new Error('Essay not found')
			};
		}

		return {
			props: { essay }
		};
	}
</script>

<script>
	import ChapteredEssay from '$lib/ChapteredEssay.svelte';
	import ContinuousEssay from '$lib/ContinuousEssay.svelte';

	export let essay;

	$: isContinuous = essay.layout === 'continuous';
</script>

<svelte:head>
	<title>{essay.title}</title>
	{#if essay.summary}
		<meta name="description" content={essay.summary} />
	{:else if essay.lede}
		<meta name="description" content={essay.lede} />
	{/if}
</svelte:head>

{#if isContinuous}
	<ContinuousEssay {essay} />
{:else}
	<ChapteredEssay {essay} />
{/if}
