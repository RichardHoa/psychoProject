import { redirect } from '@sveltejs/kit';
import { HUB_HASH, LANDING_PATH, folderHref, listFolders } from '$lib/server/content.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
	// Old deep links (`?slide=1&folder=x&sub=y`) from before each topic had its own URL.
	const folder = url.searchParams.get('folder');
	if (folder) redirect(302, folderHref(folder, url.searchParams.get('sub') ?? undefined));
	if (url.searchParams.get('slide') === '1') redirect(302, `${LANDING_PATH}#${HUB_HASH}`);

	return { folders: listFolders() };
}
