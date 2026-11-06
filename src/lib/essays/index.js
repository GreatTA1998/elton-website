import gohsFolly from './gohs-folly.js';
import gohsFolly1 from './gohs-folly-1.js';
import gohsFolly2 from './gohs-folly-2.js';
import gohsFolly3 from './gohs-folly-3.js';
import gohsFolly4 from './gohs-folly-4.js';
import { SERIES_SLUGS } from './series.js';

/** @type {Record<string, import('./types').Essay>} */
const essays = {
	[gohsFolly.slug]: gohsFolly,
	[gohsFolly1.slug]: gohsFolly1,
	[gohsFolly2.slug]: gohsFolly2,
	[gohsFolly3.slug]: gohsFolly3,
	[gohsFolly4.slug]: gohsFolly4
};

/** Old Ch3 draft URL → new series chapter. */
const redirects = {
	'courage-to-be-blasphemous': `/essays/${SERIES_SLUGS.chapter3}`
};

/**
 * @param {string} slug
 */
export function getEssay(slug) {
	return essays[slug] || null;
}

/**
 * @param {string} slug
 * @returns {string | null}
 */
export function getEssayRedirect(slug) {
	return redirects[slug] || null;
}

export function listEssays() {
	return Object.values(essays).map(({ slug, title, summary }) => ({
		slug,
		title,
		summary
	}));
}
