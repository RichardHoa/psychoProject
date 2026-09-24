import { SAFETY_GATE_PATH } from './gateDestination.js';

/**
 * Session cookie (no Max-Age/Expires) marking that the visitor answered the safety gate.
 * The browser drops it when the browsing session ends, so returning visitors are asked again.
 */
export const GATE_COOKIE = 'meo_safety_gate';

/**
 * Routes that stay reachable before the gate is answered.
 * @param {string | null} routeId
 */
export function isGateExempt(routeId) {
	// No matched route (static assets, 404s) → nothing to protect.
	return routeId === null || routeId === SAFETY_GATE_PATH;
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export function hasAnsweredGate(cookies) {
	return cookies.get(GATE_COOKIE) === '1';
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {URL} url
 */
export function markGateAnswered(cookies, url) {
	cookies.set(GATE_COOKIE, '1', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		// SvelteKit defaults `secure` to true; a plain-HTTP deploy (e.g. `make prod` on an IP)
		// would then never store the cookie and loop visitors through the gate forever.
		secure: url.protocol === 'https:'
	});
}
