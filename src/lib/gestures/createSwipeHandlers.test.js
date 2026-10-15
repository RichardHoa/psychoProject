import { describe, expect, it, vi } from 'vitest';
import { createSwipeHandlers } from './createSwipeHandlers.js';

/** @param {number} x @param {number} [y] */
const touch = (x, y = 100) => ({ clientX: x, clientY: y });

/** @typedef {ReturnType<typeof createSwipeHandlers>} SwipeHandlers */

/**
 * @param {SwipeHandlers} handlers
 * @param {number} fromX
 * @param {number} toX
 */
function swipeFrom(handlers, fromX, toX) {
	handlers.handleTouchStart(/** @type {any} */ ({ touches: [touch(fromX)] }));
	handlers.handleTouchMove(/** @type {any} */ ({ touches: [touch(toX)] }));
	handlers.handleTouchEnd(/** @type {any} */ ({ changedTouches: [touch(toX)] }));
}

describe('createSwipeHandlers', () => {
	it('reports a horizontal swipe', () => {
		const onSwipe = vi.fn();
		swipeFrom(createSwipeHandlers({ onSwipe, viewportWidth: () => 400 }), 300, 100);
		expect(onSwipe).toHaveBeenCalledWith('left');
	});

	it.each([
		['left', 10, 200],
		['right', 395, 150]
	])('ignores swipes starting at the %s screen edge (the phone back gesture)', (_, from, to) => {
		const onSwipe = vi.fn();
		swipeFrom(createSwipeHandlers({ onSwipe, edgeMargin: 24, viewportWidth: () => 400 }), from, to);
		expect(onSwipe).not.toHaveBeenCalled();
	});
});
