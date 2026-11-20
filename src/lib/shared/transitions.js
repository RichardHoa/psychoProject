import { TRAIL_PARAM } from '$lib/trail/trail.js';
import { JOURNEY_PATH, LANDING_PATH } from './routes.js';

/**
 * Moving between the Landing page and the Journey slides sideways, as if the Journey sat to the
 * right of the hero. A step read on a Trail came from the Landing picker, so leaving it for the
 * Journey slides forward too. Every other navigation (including back from a step) just
 * cross-fades.
 * @param {URL | undefined} from
 * @param {URL | undefined} to
 * @returns {'forward' | 'back' | null}
 */
export function slideDirection(from, to) {
	if (!from || !to) return null;
	if (to.pathname === JOURNEY_PATH) {
		if (from.pathname === LANDING_PATH) return 'forward';
		if (from.pathname.startsWith(`${JOURNEY_PATH}/`) && from.searchParams.has(TRAIL_PARAM))
			return 'forward';
	}
	if (from.pathname === JOURNEY_PATH && to.pathname === LANDING_PATH) return 'back';
	return null;
}
