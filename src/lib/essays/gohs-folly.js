import { SERIES_SLUGS, SERIES_TITLES, seriesMeta } from './series.js';

/** @type {import('./types').Essay} */
const essay = {
	slug: SERIES_SLUGS.preface,
	title: SERIES_TITLES.preface,
	summary:
		'Sometimes, we have to devote many years of our life into something that might not work. A four-chapter essay on Singapore, originality, and courage.',
	layout: 'continuous',
	series: seriesMeta('preface'),
	nextChapter: {
		label: 'Next chapter',
		title: SERIES_TITLES.chapter1,
		href: `/essays/${SERIES_SLUGS.chapter1}`
	},
	sections: [
		{
			id: 'body',
			blocks: [
				{
					type: 'p',
					text: 'Sometimes, we have to devote many years of our life into something that might not work. With such high stakes, how can we ever understand a world so complicated, with so many contradictory viewpoints from different people, and do what’s right?'
				},
				{
					type: 'p',
					text: 'Naturally, I became fascinated by the unwanted country that pays its ministers 60% the market rate, sets racial quotas for its public housing, only to end up with a multiethnic society as safe as Japan, a government as transparent as the Nordics, and an economy with the highest GDP per capita in the world adjusted for purchasing powers.'
				},
				{
					type: 'p',
					text: 'This four-chapter essay is based on Lee Kuan Yew’s two books: “A Memoir” and “From Third World to First”, and CNA’s two-documentary: “Separation: Declassified”.'
				}
			]
		}
	]
};

export default essay;
