import { SERIES_SLUGS, SERIES_TITLES, seriesMeta } from './series.js';

/** @type {import('./types').Essay} */
const essay = {
	slug: SERIES_SLUGS.chapter2,
	title: SERIES_TITLES.chapter2,
	summary:
		'What surprised me was this intense humility they had for learning from others — from allies, enemies, history, and first-hand experience.',
	layout: 'continuous',
	series: seriesMeta(2),
	prevChapter: {
		label: 'Previous chapter',
		title: SERIES_TITLES.chapter1,
		href: `/essays/${SERIES_SLUGS.chapter1}`
	},
	nextChapter: {
		label: 'Next chapter',
		title: SERIES_TITLES.chapter3,
		href: `/essays/${SERIES_SLUGS.chapter3}`
	},
	sections: [
		{
			id: 'body',
			blocks: [
				{
					type: 'p',
					text: 'What surprised me was this intense humility they had for learning from others. Sometimes, ignorance helps with originality. But exposure to different ideas - when done right - can broaden our solution space without introducing preconceived notions.'
				},
				{
					type: 'p',
					text: 'They don’t merely know of different ideas and feign understanding. I believe that, implicitly in LKY’s accounts, he not only understands his critics’ arguments, he is able to articulate those arguments in a compelling form, before explaining why they turn out to be wrong.'
				},
				{
					type: 'p',
					text: 'LKY and his team learnt not just from other countries - including hiring Albert Winsemius from Netherlands and a team of military advisors from Israel - but even from their enemies - the communist underground that infiltrated Singapore.'
				},
				{
					type: 'p',
					text: 'They learned from history and preserved their British colonial roots, they learnt from modern economic theories; they learnt from first-hand experiences during Japan’s invasion of Singapore - with an iron understanding of power and reality that cannot be acquired otherwise.'
				},
				{
					type: 'p',
					text: 'It is this confluence of perspectives that lead to a more complete picture of reality, and what to do to change it.'
				},
				{
					type: 'excerpt',
					text: 'Excerpt from Epilogue, From Third World to First'
				}
			]
		}
	]
};

export default essay;
