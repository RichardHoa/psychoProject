import { FOLDERS_DATA } from './folderData.js';
import { slugify } from '$lib/text.js';
import { readingHref } from '$lib/reading.js';
import { stepPath } from '$lib/routes.js';

/**
 * @typedef {import('./folderData.js').Folder} Folder
 * @typedef {import('./folderData.js').Subfolder} Subfolder
 * @typedef {import('./folderData.js').FolderItem} FolderItem
 * @typedef {Pick<Folder, 'id' | 'title' | 'shortTitle' | 'summary' | 'chapter' | 'nextReason'> & { step: number, minutes: number }} FolderSummary
 */

export const STEP_COUNT = FOLDERS_DATA.length;

// Vietnamese is written one syllable per space-separated word; 200 a minute is an unhurried pace.
const WORDS_PER_MINUTE = 200;

/**
 * Whole minutes (at least 1) to read a step in the short or detailed version, counting the same
 * text the step page shows.
 * @param {Folder} folder
 * @param {boolean} detailed
 */
export function readingMinutes(folder, detailed) {
	const texts = [folder.title, folder.summary];
	for (const sub of folder.subfolders) {
		if (sub.detailOnly && !detailed) continue;
		texts.push(sub.title, sub.desc ?? '');
		for (const item of sub.items) {
			texts.push(item.title, (detailed ? (item.detail ?? item.short) : item.short) ?? '');
		}
	}
	const words = texts.join(' ').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** @param {Folder} folder @param {number} index @returns {FolderSummary} */
function summarize(folder, index) {
	const { id, title, shortTitle, summary, chapter, nextReason } = folder;
	return {
		id,
		title,
		shortTitle,
		summary,
		chapter,
		nextReason,
		step: index + 1,
		minutes: readingMinutes(folder, false)
	};
}

/** The journey steps, in reading order. @returns {FolderSummary[]} */
export function listFolders() {
	return FOLDERS_DATA.map(summarize);
}

/**
 * Page-ready step: every item gets a stable, unique `anchor` so search results and deep links
 * can jump straight to it.
 * @param {string} id
 */
export function getFolder(id) {
	const index = FOLDERS_DATA.findIndex((f) => f.id === id);
	if (index === -1) return null;
	const folder = FOLDERS_DATA[index];
	const prev = FOLDERS_DATA[index - 1];
	const next = FOLDERS_DATA[index + 1];

	return {
		folder: {
			...folder,
			subfolders: folder.subfolders.map((sub) => ({
				...sub,
				items: sub.items.map((item) => ({ ...item, anchor: itemAnchor(sub, item) }))
			}))
		},
		step: index + 1,
		stepCount: STEP_COUNT,
		minutes: { short: readingMinutes(folder, false), detailed: readingMinutes(folder, true) },
		prevFolder: prev ? summarize(prev, index - 1) : null,
		nextFolder: next ? summarize(next, index + 1) : null
	};
}

/**
 * @param {Pick<Subfolder, 'id'>} subfolder
 * @param {Pick<FolderItem, 'title'>} item
 */
export function itemAnchor(subfolder, item) {
	return `${subfolder.id}--${slugify(item.title)}`;
}

/**
 * @param {string} folderId
 * @param {string} [hash]
 * @param {boolean} [detailed] Link to the detailed version (needed for `detailOnly` sections).
 */
export function folderHref(folderId, hash, detailed = false) {
	return readingHref(stepPath(folderId), detailed, hash);
}
