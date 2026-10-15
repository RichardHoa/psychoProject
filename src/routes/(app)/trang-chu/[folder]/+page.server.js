import { error } from '@sveltejs/kit';
import { getFolder } from '$lib/server/content.js';
import { isDetailed } from '$lib/reading.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ params, url }) {
	const page = getFolder(params.folder);
	if (!page) error(404, 'Not found');
	return { ...page, detailed: isDetailed(url) };
}
