import { redirect } from '@sveltejs/kit';
import { stepPath } from '$lib/routes.js';

// Step pages used to live under the Landing page. Browsers keep the `#section` across the redirect.
/** @type {import('./$types').RequestHandler} */
export function GET({ params, url }) {
	redirect(301, stepPath(params.folder) + url.search);
}
