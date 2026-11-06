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
 * @typedef {{ text: string, highlight?: boolean }} EssayTextPart
 * @typedef {{ type: 'p', text?: string, parts?: EssayTextPart[] }} EssayParagraphBlock
 * @typedef {{ type: 'quote', paragraphs: string[], attribution?: string }} EssayQuoteBlock
 * @typedef {{ type: 'image', src: string, alt: string }} EssayImageBlock
 * @typedef {{ type: 'excerpt', text: string }} EssayExcerptBlock
 * @typedef {EssayParagraphBlock | EssayQuoteBlock | EssayImageBlock | EssayExcerptBlock} EssayBlock
 * @typedef {{ id: string, title?: string, blocks: EssayBlock[] }} EssaySection
 * @typedef {{
 *   title: string,
 *   shortTitle?: string,
 *   chapter?: number,
 *   chapterCount?: number,
 *   part?: 'preface' | 'chapter',
 *   href?: string
 * }} EssaySeries
 * @typedef {{
 *   label?: string,
 *   title?: string,
 *   href?: string
 * }} EssayNavLink
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   summary?: string,
 *   lede?: string,
 *   heroImage?: EssayImage,
 *   layout?: 'column' | 'full' | 'continuous',
 *   series?: EssaySeries,
 *   prevChapter?: EssayNavLink,
 *   nextChapter?: EssayNavLink,
 *   chapters?: EssayChapter[],
 *   sections?: EssaySection[]
 * }} Essay
 */

export {};
