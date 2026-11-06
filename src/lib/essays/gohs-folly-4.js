import { SERIES_SLUGS, SERIES_TITLES, seriesMeta } from './series.js';

/** @type {import('./types').Essay} */
const essay = {
	slug: SERIES_SLUGS.chapter4,
	title: SERIES_TITLES.chapter4,
	summary:
		'At some point, no amount of intellect and wisdom can eliminate all risk and uncertainty. Jurong worked because they were boldly committed.',
	layout: 'continuous',
	series: seriesMeta(4),
	prevChapter: {
		label: 'Previous chapter',
		title: SERIES_TITLES.chapter3,
		href: `/essays/${SERIES_SLUGS.chapter3}`
	},
	sections: [
		{
			id: 'body',
			blocks: [
				{
					type: 'p',
					text: 'At some point, no amount of intellect and wisdom can eliminate all risk and uncertainty.'
				},
				{
					type: 'p',
					text: 'Jurong worked because they were boldly committed. They moved earth and heaven to make it work - 1.8 million cubic meters of land. They borrowed over $30M USD to prebuild all factories, despite having no customers, and changed everything they could change, little and large, to earn the trust from US multinational corporations.'
				},
				{
					type: 'p',
					text: 'In the end, I think LKY’s story was about courage and daring, from selling glue in the WWII black market to becoming the founding prime minister of a fragile state, it was an epic about life and death, all within the cataclysmic backdrop of China’s Cultural Revolution, Indonesia’s Communist purges, and the Japanese massacre.'
				},
				{
					type: 'p',
					text: 'It says, no matter the difficulties, if we persevere, see the world clearly, and do the right things even if they’re painful, the future can be brighter than ever.'
				},
				{
					type: 'image',
					src: '/gohs-folly-ch4-closing.jpg',
					webp: '/gohs-folly-ch4-closing.webp',
					avif: '/gohs-folly-ch4-closing.avif',
					alt: 'Closing image for Acting with courage'
				}
			]
		}
	]
};

export default essay;
