import { SERIES_SLUGS, SERIES_TITLES, seriesMeta } from './series.js';

/** @type {import('./types').Essay} */
const essay = {
	slug: SERIES_SLUGS.chapter1,
	title: SERIES_TITLES.chapter1,
	summary:
		'In 1964, a race riot between the Malays and Chinese killed 23 people. Amidst the instability, Dr Goh Keng Swee had a gambit to create jobs.',
	layout: 'continuous',
	series: seriesMeta(1),
	prevChapter: {
		label: 'Preface',
		title: SERIES_TITLES.preface,
		href: `/essays/${SERIES_SLUGS.preface}`
	},
	nextChapter: {
		label: 'Next chapter',
		title: SERIES_TITLES.chapter2,
		href: `/essays/${SERIES_SLUGS.chapter2}`
	},
	sections: [
		{
			id: 'body',
			blocks: [
				{
					type: 'p',
					text: 'In 1964, a race riot between the Malays and Chinese killed 23 people. Total casualties were 454, more than Singapore’s per capita GDP at the time.'
				},
				{
					type: 'p',
					text: 'Amidst the instability, Dr Goh Keng Swee had a gambit to create jobs, which is to spend $33M USD to convert a swamp into a factory hub for multinational companies. When it was completed, only two companies came. The project was ridiculed as “Goh’s Folly”.'
				},
				{
					type: 'p',
					text: '10 years later, Texas Instruments, Hewlett-Packard, General Electric came, and the rest was history. It created 70000 jobs and enabled Singapore’s industrialization.'
				},
				{
					type: 'p',
					text: 'The particulars on how they succeeded is already well documented, so instead I’ll write my personal takeaways for why they are able to be original and daring without becoming delusional.'
				},
				{
					type: 'image',
					src: '/gohs-folly-excerpt-surviving.jpg',
					webp: '/gohs-folly-excerpt-surviving.webp',
					avif: '/gohs-folly-excerpt-surviving.avif',
					alt: 'Excerpt from Surviving Without a Winterland, From Third World to First'
				},
				{
					type: 'excerpt',
					text: 'Excerpt from Surviving Without a Winterland, From Third World to First'
				}
			]
		}
	]
};

export default essay;
