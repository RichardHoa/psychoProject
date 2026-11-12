import { stepPath } from '$lib/shared/routes.js';
import { TRAIL_PARAM } from '$lib/trail/trail.js';

/** Query parameter that switches a step page to its detailed version: `?che-do=chi-tiet`. */
export const DETAIL_PARAM = 'che-do';
export const DETAIL_VALUE = 'chi-tiet';

/** @param {URL} url */
export function isDetailed(url) {
	return url.searchParams.get(DETAIL_PARAM) === DETAIL_VALUE;
}

/**
 * The one way to link to a step page: in the short (default) or detailed version, optionally on
 * the visitor's Trail, optionally at a section or item anchor. The version comes before the Trail
 * (`?che-do=chi-tiet&lo-trinh=…`), as saved and shared links have it. Plain links, so they work
 * without JavaScript.
 * @param {string} stepId
 * @param {{ detailed?: boolean, trail?: string, hash?: string }} [options]
 * @returns {import('$lib/shared/routes.js').AppPath}
 */
export function stepHref(stepId, { detailed = false, trail, hash } = {}) {
	const params = new URLSearchParams();
	if (detailed) params.set(DETAIL_PARAM, DETAIL_VALUE);
	if (trail) params.set(TRAIL_PARAM, trail);
	const query = String(params);
	return `${stepPath(stepId)}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}
