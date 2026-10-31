import gohsFolly from './gohs-folly.js';

/** @type {Record<string, import('./types').Essay>} */
const essays = {
	[gohsFolly.slug]: gohsFolly
};

/**
 * @param {string} slug
 */
export function getEssay(slug) {
	return essays[slug] || null;
}

export function listEssays() {
	return Object.values(essays).map(({ slug, title, summary }) => ({
		slug,
		title,
		summary
	}));
}
