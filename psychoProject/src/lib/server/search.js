import { FOLDERS_DATA } from './folderData.js';
import { folderHref, itemAnchor } from './content.js';
import { foldText } from '$lib/text.js';

/**
 * @typedef {{
 *   id: string,
 *   kind: 'folder' | 'section' | 'item',
 *   title: string,
 *   desc: string,
 *   category: string,
 *   href: string
 * }} SearchResult
 */

const MAX_RESULTS = 20;

/** Built from the real folder content, so every result points at something that exists. */
const INDEX = FOLDERS_DATA.flatMap((folder) => [
	entry({
		id: folder.id,
		kind: 'folder',
		title: folder.title,
		desc: folder.summary,
		category: folder.category,
		href: folderHref(folder.id)
	}),
	...folder.subfolders.flatMap((sub) => [
		entry({
			id: `${folder.id}/${sub.id}`,
			kind: 'section',
			title: sub.title,
			desc: sub.desc,
			category: folder.shortTitle,
			href: folderHref(folder.id, sub.id)
		}),
		...sub.items.map((item) => {
			const anchor = itemAnchor(sub, item);
			return entry({
				id: `${folder.id}/${anchor}`,
				kind: 'item',
				title: item.title,
				desc: item.content,
				category: `${folder.shortTitle} · ${sub.title}`,
				href: folderHref(folder.id, anchor)
			});
		})
	])
]);

/** @param {SearchResult} result */
function entry(result) {
	return {
		result,
		title: foldText(result.title),
		body: foldText(`${result.desc} ${result.category}`)
	};
}

/**
 * Diacritic-insensitive search: every word of the query must appear somewhere in the entry.
 * Title hits rank above body hits; whole folders rank above sections above single items.
 * @param {string} query
 * @returns {SearchResult[]}
 */
export function search(query) {
	const terms = foldText(query).split(/\s+/).filter(Boolean);
	if (terms.length === 0) return [];

	const kindWeight = { folder: 2, section: 1, item: 0 };

	return INDEX.map((e) => {
		let score = 0;
		for (const term of terms) {
			if (e.title.includes(term)) score += 10;
			else if (e.body.includes(term)) score += 3;
			else return null;
		}
		return { result: e.result, score: score + kindWeight[e.result.kind] };
	})
		.filter((hit) => hit !== null)
		.sort((a, b) => b.score - a.score)
		.slice(0, MAX_RESULTS)
		.map((hit) => hit.result);
}

/** Quick-pick chips: the real topics, so every suggestion returns results. */
export function searchSuggestions() {
	return FOLDERS_DATA.map((f) => ({ label: f.shortTitle, icon: f.icon }));
}
