export const SAFETY_GATE_PATH = '/kiem-tra-an-toan';
export const FALLBACK_DESTINATION = '/trang-chu';

/**
 * Computes the safety gate's redirect target from an originally requested URL,
 * preserving the full path and query string unchanged.
 * @param {URL | string} url
 * @returns {{ original: string, gateUrl: string }}
 */
export function resolveGateDestination(url) {
	const target = typeof url === 'string' ? new URL(url, 'http://localhost') : url;
	const original = `${target.pathname}${target.search}`;

	return {
		original,
		gateUrl: `${SAFETY_GATE_PATH}?dest=${encodeURIComponent(original)}`
	};
}

/**
 * Turns the gate's `dest` query param back into a safe same-site path.
 * `URLSearchParams.get()` already URL-decodes once, so the value is used as-is.
 * Anything that is not a single-slash path (e.g. "//evil.com", "https://…") falls back
 * to the Landing page, so the gate can never be used as an open redirect.
 * @param {string | null | undefined} dest
 * @returns {string}
 */
export function sanitizeDestination(dest) {
	if (!dest || !dest.startsWith('/') || dest.startsWith('//') || dest.startsWith('/\\')) {
		return FALLBACK_DESTINATION;
	}
	if (dest === SAFETY_GATE_PATH || dest.startsWith(`${SAFETY_GATE_PATH}?`)) {
		return FALLBACK_DESTINATION;
	}
	return dest;
}
