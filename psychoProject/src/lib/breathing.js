import { FALLBACK_DESTINATION, sanitizeDestination } from '$lib/safety/gateDestination.js';

export const BREATHING_PATH = '/tho-vuong';
/** Query param carrying the page to go back to when the exercise is done. */
export const RETURN_PARAM = 'quay-lai';

/**
 * Link to the breathing exercise that remembers where the visitor came from.
 * @param {URL} from
 */
export function breathingHref(from) {
	if (from.pathname === BREATHING_PATH) return `${from.pathname}${from.search}`;
	return `${BREATHING_PATH}?${RETURN_PARAM}=${encodeURIComponent(from.pathname + from.search)}`;
}

/**
 * The `quay-lai` param as a safe same-site path (never an open redirect, never the exercise itself).
 * @param {string | null | undefined} value
 */
export function breathingReturnPath(value) {
	const path = sanitizeDestination(value);
	return path === BREATHING_PATH || path.startsWith(`${BREATHING_PATH}?`)
		? FALLBACK_DESTINATION
		: path;
}
