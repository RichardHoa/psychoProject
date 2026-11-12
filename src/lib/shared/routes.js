/** The Landing page: the Landing picker, where the navbar's cat mascot always leads. */
export const LANDING_PATH = '/trang-chu';
/** The Journey page, listing every step; each step page sits under it. */
export const JOURNEY_PATH = '/hanh-trinh';
/** Fragment of the journey slide on the old two-slide Landing page (`/trang-chu#chu-de`). */
export const LEGACY_JOURNEY_HASH = 'chu-de';

/**
 * An internal pathname (optionally with a query or hash), ready for `resolve()` from `$app/paths`.
 * @typedef {import('$app/types').PathnameWithSearchOrHash} AppPath
 */

/**
 * @param {string} stepId
 * @returns {`/hanh-trinh/${string}`}
 */
export function stepPath(stepId) {
	return `${JOURNEY_PATH}/${stepId}`;
}
