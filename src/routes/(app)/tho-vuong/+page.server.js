import { breathingReturnPath } from '$lib/breathing/breathing.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
	return { returnTo: breathingReturnPath(url.searchParams.get('quay-lai')) };
}
