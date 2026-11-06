import { SERIES_SLUGS, SERIES_TITLES, seriesMeta } from './series.js';

/** @type {import('./types').Essay} */
const essay = {
	slug: SERIES_SLUGS.chapter3,
	title: SERIES_TITLES.chapter3,
	summary:
		'It’s easy to have contrarian opinions when we don’t think much of others. The blindspot emerges when we have people we admire, whose words we accept as gospel.',
	layout: 'continuous',
	series: seriesMeta(3),
	heroImage: {
		src: '/gohs-folly-ch3-chart.jpg',
		webp: '/gohs-folly-ch3-chart.webp',
		avif: '/gohs-folly-ch3-chart.avif',
		alt: 'Chart accompanying Thinking from First Principles'
	},
	prevChapter: {
		label: 'Previous chapter',
		title: SERIES_TITLES.chapter2,
		href: `/essays/${SERIES_SLUGS.chapter2}`
	},
	nextChapter: {
		label: 'Next chapter',
		title: SERIES_TITLES.chapter4,
		href: `/essays/${SERIES_SLUGS.chapter4}`
	},
	sections: [
		{
			id: 'body',
			blocks: [
				{
					type: 'p',
					text: 'It’s easy to have contrarian opinions when we don’t think much of others. The blindspot emerges when we have people we admire, whose words we accept as gospel. Or when we have total deference to beautiful ideas like freedom and democracy.'
				},
				{
					type: 'p',
					text: 'An ideological analysis of political systems would state that two-party democracy is good and one-party autocracy is evil. A pragmatic analysis would notice that there are trade-offs, that more money is spent fighting elections, that it’s harder to resist short-sighted policies to woo voters.'
				},
				{
					type: 'p',
					text: 'Ideology can induce lazy thinking. To see elegant ideas as true without wanting the inconvenience of engaging and debugging reality. If it’s inevitable that we take certain words as gospel, then equally, we must have the courage to be blasphemous sometimes, letting reality be the guiding star.'
				},
				{
					type: 'image',
					src: '/gohs-folly-excerpt-government-clean.jpg',
					webp: '/gohs-folly-excerpt-government-clean.webp',
					avif: '/gohs-folly-excerpt-government-clean.avif',
					alt: 'Excerpt from Keeping the Government Clean, From Third World to First'
				},
				{
					type: 'excerpt',
					text: 'Excerpt from Keeping the Government Clean, From Third World to First'
				}
			]
		}
	]
};

export default essay;
