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

/**
 * Baseline security headers (the Content-Security-Policy itself comes from `csp` in vite.config.js).
 * @type {import('@sveltejs/kit').Handle}
 */
const handleSecurityHeaders = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'DENY');
	// The microphone stays available to this site for voice search.
	response.headers.set(
		'Permissions-Policy',
		'camera=(), geolocation=(), microphone=(self), payment=(), usb=()'
	);
	return response;
};

export const handle = sequence(handleSecurityHeaders, handleParaglide, handleSafetyGate);
