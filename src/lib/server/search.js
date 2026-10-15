import { FOLDERS_DATA } from './folderData.js';
import { folderHref } from './content.js';
import { foldText } from '$lib/text.js';

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   desc: string,
 *   category: string,
 *   href: string
 * }} SearchResult
 */

/**
 * One entry per journey step, matched on the step's big title only (or its short name, the same
 * title as shown in the breadcrumb). Section and item headings and body text are not searched.
 */
const INDEX = FOLDERS_DATA.map((folder, index) =>
	entry(
		{
			id: folder.id,
			title: folder.title,
			desc: folder.summary,
			category: `Bước ${index + 1}`,
			href: folderHref(folder.id)
		},
		folder.shortTitle
	)
);

/** @param {SearchResult} result @param {string} [altTitle] Another title to match but not display. */
function entry(result, altTitle = '') {
	return { result, title: normalize(`${result.title} ${altTitle}`) };
}

/**
 * Case- and diacritic-insensitive, punctuation dropped: "Bảo Mật?" and "bao mat" are the same text.
 * @param {string} text
 */
function normalize(text) {
	return foldText(text)
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

/**
 * Every word of the query must appear in the step title; titles containing the whole query as a
 * phrase rank first, otherwise journey order is kept.
 * @param {string} query
 * @returns {SearchResult[]}
 */
export function search(query) {
	const phrase = normalize(query);
	const terms = phrase.split(' ').filter(Boolean);
	if (terms.length === 0) return [];

	const hits = INDEX.filter((e) => terms.every((term) => e.title.includes(term)));
	return [
		...hits.filter((e) => e.title.includes(phrase)),
		...hits.filter((e) => !e.title.includes(phrase))
	].map((e) => e.result);
}

/** Quick-pick questions; the test suite checks each one returns results. */
export function searchSuggestions() {
	return [{ label: 'Chuyên gia uy tín' }, { label: 'Nhà tham vấn làm gì?' }];
}
