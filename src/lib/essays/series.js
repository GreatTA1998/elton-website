/** Shared Goh's Folly series metadata and slugs. */

export const SERIES_TITLE = "Goh's Folly: Seeing What Others Couldn't";
export const SERIES_CHAPTER_COUNT = 4;
/** Dedicated intro / chapters index (not ContinuousEssay). */
export const SERIES_INTRO_PATH = '/essays/gohs-folly';

export const SERIES_SLUGS = {
	preface: 'gohs-folly-preface',
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

/** Preface + four chapters for the series intro page. */
export const SERIES_PARTS = [
	{
		id: 'preface',
		label: 'Preface',
		title: SERIES_TITLES.preface,
		href: `/essays/${SERIES_SLUGS.preface}`
	},
	{
		id: 'chapter1',
		label: 'Chapter 1',
		title: SERIES_TITLES.chapter1,
		href: `/essays/${SERIES_SLUGS.chapter1}`
	},
	{
		id: 'chapter2',
		label: 'Chapter 2',
		title: SERIES_TITLES.chapter2,
		href: `/essays/${SERIES_SLUGS.chapter2}`
	},
	{
		id: 'chapter3',
		label: 'Chapter 3',
		title: SERIES_TITLES.chapter3,
		href: `/essays/${SERIES_SLUGS.chapter3}`
	},
	{
		id: 'chapter4',
		label: 'Chapter 4',
		title: SERIES_TITLES.chapter4,
		href: `/essays/${SERIES_SLUGS.chapter4}`
	}
];

/**
 * @param {'preface' | 1 | 2 | 3 | 4} part
 * @returns {import('./types').EssaySeries}
 */
export function seriesMeta(part) {
	const href = SERIES_INTRO_PATH;

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
