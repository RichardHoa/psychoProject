import { listFolders } from '$lib/server/content.js';

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return { folders: listFolders() };
}
