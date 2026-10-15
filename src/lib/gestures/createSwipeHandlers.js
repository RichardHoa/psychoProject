/**
 * @typedef {Object} SwipeHandlerOptions
 * @property {(direction: 'left' | 'right') => void} onSwipe
 * @property {number} [threshold] - minimum horizontal distance (px) to count as a swipe
 * @property {number} [axisRatio] - how much the horizontal delta must dominate the vertical delta
 * @property {number} [edgeMargin] - ignore touches starting this close (px) to the left/right
 *   screen edge, where phones start their own back gesture
 * @property {() => number} [viewportWidth]
 */

/**
 * Tracks a single-touch horizontal swipe and reports its direction once released.
 * Pure JS (no Svelte runes) so it can be unit tested with synthetic touch coordinates.
 *
 * @param {SwipeHandlerOptions} options
 */
export function createSwipeHandlers({
	onSwipe,
	threshold = 50,
	axisRatio = 1.3,
	edgeMargin = 0,
	viewportWidth = () => window.innerWidth
}) {
	let startX = 0;
	let startY = 0;
	let endX = 0;
	let tracking = false;

	/** @param {TouchEvent} e */
	function handleTouchStart(e) {
		if (e.touches.length !== 1) return;
		const x = e.touches[0].clientX;
		if (edgeMargin > 0 && (x < edgeMargin || x > viewportWidth() - edgeMargin)) return;
		startX = x;
		startY = e.touches[0].clientY;
		endX = startX;
		tracking = true;
	}

	/** @param {TouchEvent} e */
	function handleTouchMove(e) {
		if (!tracking || e.touches.length !== 1) return;
		endX = e.touches[0].clientX;
	}

	/** @param {TouchEvent} e */
	function handleTouchEnd(e) {
		if (!tracking) return;
		tracking = false;

		const deltaX = endX - startX;
		const deltaY = (e.changedTouches[0]?.clientY ?? startY) - startY;

		if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY) * axisRatio) {
			onSwipe(deltaX < 0 ? 'left' : 'right');
		}
	}

	return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
