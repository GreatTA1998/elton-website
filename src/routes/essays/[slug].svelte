<script context="module">
	import { getEssay } from '$lib/essays/index.js';

	/** @type {import('@sveltejs/kit').Load} */
	export function load({ params }) {
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

	export let essay;
</script>

<svelte:head>
	<title>{essay.title}</title>
	<meta name="description" content={essay.summary} />
</svelte:head>

<ChapteredEssay {essay} />
