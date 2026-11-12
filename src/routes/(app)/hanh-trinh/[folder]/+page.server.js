import { error } from '@sveltejs/kit';
import { getFolder } from '$lib/server/content.js';
import { getTrailPosition } from '$lib/server/trail.js';
import { isDetailed } from '$lib/reading.js';
import { TRAIL_PARAM } from '$lib/trail.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ params, url }) {
	const page = getFolder(params.folder);
	if (!page) error(404, 'Not found');
	return {
		...page,
		detailed: isDetailed(url),
		// Arriving from the Landing picker: this step's place on the visitor's Trail.
		trail: getTrailPosition(url.searchParams.get(TRAIL_PARAM), params.folder)
	};
}
