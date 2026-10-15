import { FOLDERS_DATA } from './folderData.js';
import { slugify } from '$lib/text.js';
import { readingHref } from '$lib/reading.js';
import { stepPath } from '$lib/routes.js';

/**
 * @typedef {import('./folderData.js').Folder} Folder
 * @typedef {import('./folderData.js').Subfolder} Subfolder
 * @typedef {import('./folderData.js').FolderItem} FolderItem
 * @typedef {Pick<Folder, 'id' | 'title' | 'shortTitle' | 'summary' | 'chapter' | 'nextReason'> & { step: number }} FolderSummary
 */

export const STEP_COUNT = FOLDERS_DATA.length;

/** @param {Folder} folder @param {number} index @returns {FolderSummary} */
function summarize({ id, title, shortTitle, summary, chapter, nextReason }, index) {
	return { id, title, shortTitle, summary, chapter, nextReason, step: index + 1 };
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
