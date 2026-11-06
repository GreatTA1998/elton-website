/** Shared Goh's Folly series metadata and slugs. */

export const SERIES_TITLE = "Goh's Folly: Seeing What Others Couldn't";
export const SERIES_CHAPTER_COUNT = 4;

export const SERIES_SLUGS = {
	preface: 'gohs-folly',
	chapter1: 'gohs-folly-1',
	chapter2: 'gohs-folly-2',
	chapter3: 'gohs-folly-3',
	chapter4: 'gohs-folly-4'
};

export const SERIES_TITLES = {
	preface: 'Insanely wrong, or insanely right',
	chapter1: "Goh's Folly",
	chapter2: 'Intense humility to learn from the world',
	chapter3: 'Thinking from First Principles',
	chapter4: 'Acting with courage'
};

/**
 * @param {'preface' | 1 | 2 | 3 | 4} part
 * @returns {import('./types').EssaySeries}
 */
export function seriesMeta(part) {
	const href = `/essays/${SERIES_SLUGS.preface}`;

	if (part === 'preface') {
		return {
			title: SERIES_TITLE,
			shortTitle: "Goh's Folly",
			part: 'preface',
			chapterCount: SERIES_CHAPTER_COUNT,
			href
		};
	}

	return {
		title: SERIES_TITLE,
		shortTitle: "Goh's Folly",
		part: 'chapter',
		chapter: part,
		chapterCount: SERIES_CHAPTER_COUNT,
		href
	};
}
