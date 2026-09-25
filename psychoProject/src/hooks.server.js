import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { hasAnsweredGate, isGateExempt } from '$lib/safety/gateCookie.js';
import { resolveGateDestination } from '$lib/safety/gateDestination.js';

/** @type {import('@sveltejs/kit').Handle} */ const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

/**
 * Safety check-in gate: runs on the server before any page renders, so a visitor who has not
 * answered it this browser session never sees content first — with or without JavaScript.
 * Client-side navigations (`__data.json` requests) get the same redirect.
 * @type {import('@sveltejs/kit').Handle}
 */
const handleSafetyGate = ({ event, resolve }) => {
	if (!isGateExempt(event.route.id) && !hasAnsweredGate(event.cookies)) {
		redirect(303, resolveGateDestination(event.url).gateUrl);
	}
	return resolve(event);
};

export const handle = sequence(handleParaglide, handleSafetyGate);
