import { getHotlineStatus } from '$lib/safety/hotlineStatus.js';

export function load() {
	return getHotlineStatus(new Date());
}
