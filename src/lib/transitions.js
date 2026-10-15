import { JOURNEY_PATH, LANDING_PATH } from './routes.js';

/**
 * Moving between the Landing page and the Journey slides sideways, as if the Journey sat to the
 * right of the hero; every other navigation (including back from a step) just cross-fades.
 * @param {string | undefined} fromPath
 * @param {string | undefined} toPath
 * @returns {'forward' | 'back' | null}
 */
export function slideDirection(fromPath, toPath) {
	if (fromPath === LANDING_PATH && toPath === JOURNEY_PATH) return 'forward';
	if (fromPath === JOURNEY_PATH && toPath === LANDING_PATH) return 'back';
	return null;
}
