import { redirect } from '@sveltejs/kit';
import { hasAnsweredGate, markGateAnswered } from '$lib/safety/gateCookie.js';
import { sanitizeDestination } from '$lib/safety/gateDestination.js';
import { getHotlineStatus } from '$lib/safety/hotlineStatus.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ cookies, url, request }) {
	const destination = sanitizeDestination(url.searchParams.get('dest'));

	// A visitor who already answered this session but lands back here (e.g. browser Back after
	// "No") is not asked again. Only on plain GETs: after a form POST the cookie is already set
	// and the page must still render the answer.
	if (request.method === 'GET' && hasAnsweredGate(cookies)) {
		redirect(303, destination);
	}

	return { destination, ...getHotlineStatus(new Date()) };
}

/** @type {import('./$types').Actions} */
export const actions = {
	no: ({ cookies, url }) => {
		markGateAnswered(cookies, url);
		return { answer: /** @type {const} */ ('no') };
	},
	yes: ({ cookies, url }) => {
		markGateAnswered(cookies, url);
		return { answer: /** @type {const} */ ('yes') };
	}
};
