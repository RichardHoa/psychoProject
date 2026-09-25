import { createSwipeHandlers } from './createSwipeHandlers.js';

/**
 * Attachment wrapper around createSwipeHandlers: `<div {@attach swipe({ onSwipe })}>`.
 * @param {import('./createSwipeHandlers.js').SwipeHandlerOptions} options
 * @returns {import('svelte/attachments').Attachment<HTMLElement>}
 */
export function swipe(options) {
	return (el) => {
		const handlers = createSwipeHandlers(options);
		el.addEventListener('touchstart', handlers.handleTouchStart, { passive: true });
		el.addEventListener('touchmove', handlers.handleTouchMove, { passive: true });
		el.addEventListener('touchend', handlers.handleTouchEnd);
		return () => {
			el.removeEventListener('touchstart', handlers.handleTouchStart);
			el.removeEventListener('touchmove', handlers.handleTouchMove);
			el.removeEventListener('touchend', handlers.handleTouchEnd);
		};
	};
}
