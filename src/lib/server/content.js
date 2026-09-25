import { FOLDERS_DATA } from './folderData.js';
import { slugify } from '$lib/text.js';

/**
 * @typedef {import('./folderData.js').Folder} Folder
 * @typedef {import('./folderData.js').Subfolder} Subfolder
 * @typedef {import('./folderData.js').FolderItem} FolderItem
 * @typedef {Pick<Folder, 'id' | 'title' | 'shortTitle' | 'summary' | 'icon' | 'wide'>} FolderSummary
 */

export const LANDING_PATH = '/trang-chu';
/** Fragment of the 4-topic hub screen on the Landing page. */
export const HUB_HASH = 'chu-de';

/** @param {Folder} folder @returns {FolderSummary} */
function summarize({ id, title, shortTitle, summary, icon, wide }) {
	return { id, title, shortTitle, summary, icon, wide };
}

/** @returns {FolderSummary[]} */
export function listFolders() {
	return FOLDERS_DATA.map(summarize);
}

/**
 * Page-ready folder: every item gets a stable, unique `anchor` so search results and deep links
 * can jump straight to it.
 * @param {string} id
 */
export function getFolder(id) {
	const index = FOLDERS_DATA.findIndex((f) => f.id === id);
	if (index === -1) return null;
	const folder = FOLDERS_DATA[index];
	const next = FOLDERS_DATA[index + 1];

	return {
		folder: {
			...folder,
			subfolders: folder.subfolders.map((sub) => ({
				...sub,
				items: sub.items.map((item) => ({ ...item, anchor: itemAnchor(sub, item) }))
			}))
		},
		nextFolder: next ? summarize(next) : null
	};
}

/**
 * @param {Pick<Subfolder, 'id'>} subfolder
 * @param {Pick<FolderItem, 'title'>} item
 */
export function itemAnchor(subfolder, item) {
	return `${subfolder.id}--${slugify(item.title)}`;
}

/** @param {string} folderId @param {string} [hash] */
export function folderHref(folderId, hash) {
	return `${LANDING_PATH}/${folderId}${hash ? `#${hash}` : ''}`;
}
