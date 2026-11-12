import { redirect } from '@sveltejs/kit';
import { stepHref } from '$lib/journey/reading.js';
import { JOURNEY_PATH } from '$lib/shared/routes.js';
import { getPicker } from '$lib/server/trail.js';
import { CONCERN_PARAM, PERSONA_PARAM } from '$lib/trail/trail.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
	// Old deep links (`?slide=1&folder=x&sub=y`) from before each topic had its own URL.
	const folder = url.searchParams.get('folder');
	if (folder) redirect(302, stepHref(folder, { hash: url.searchParams.get('sub') ?? undefined }));
	if (url.searchParams.get('slide') === '1') redirect(302, JOURNEY_PATH);

	return {
		picker: getPicker(url.searchParams.get(PERSONA_PARAM), url.searchParams.get(CONCERN_PARAM))
	};
}
