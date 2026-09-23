export const SAFETY_GATE_PATH = '/kiem-tra-an-toan';

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
