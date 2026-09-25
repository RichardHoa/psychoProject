import { error } from '@sveltejs/kit';
import { getFolder } from '$lib/server/content.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
	const page = getFolder(params.folder);
	if (!page) error(404, 'Not found');
	return page;
}
