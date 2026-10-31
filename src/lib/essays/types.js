/**
 * @typedef {{ src: string, alt: string }} EssayImage
 * @typedef {{ paragraphs: string[], attribution?: string }} EssayQuote
 * @typedef {{
 *   id: string,
 *   title: string,
 *   paragraphs?: string[],
 *   image?: EssayImage,
 *   quote?: EssayQuote
 * }} EssayChapter
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   summary?: string,
 *   lede?: string,
 *   layout?: 'column' | 'full',
 *   chapters: EssayChapter[]
 * }} Essay
 */

export {};
