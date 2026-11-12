import { readingHref } from '$lib/reading.js';
import { stepPath } from '$lib/routes.js';

/** Query parameter that keeps a step page on the visitor's Trail: `?lo-trinh=<persona>.<concern>`. */
export const TRAIL_PARAM = 'lo-trinh';
/** Landing picker query parameters: who the visitor is, then what worries them. */
export const PERSONA_PARAM = 'ban-la';
export const CONCERN_PARAM = 'lo-ve';
/** Anchor of the Landing picker, so picking an answer (even without JavaScript) lands on it. */
export const PICKER_ANCHOR = 'ban-la-ai';

/**
 * Link to a step page while following a Trail, in the short or detailed version. Lands at the
 * top of the step (not the section), so the visitor first sees where they are in their Trail.
 * @param {string} stepId
 * @param {string} trailKey
 * @param {boolean} detailed
 */
export function trailHref(stepId, trailKey, detailed) {
	const href = readingHref(stepPath(stepId), detailed);
	return `${href}${href.includes('?') ? '&' : '?'}${TRAIL_PARAM}=${trailKey}`;
}
