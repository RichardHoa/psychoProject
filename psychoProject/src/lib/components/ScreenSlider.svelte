<script>
	import { m } from '$lib/paraglide/messages.js';
	import { createSwipeHandlers } from '$lib/gestures/createSwipeHandlers.js';

	/**
	 * @type {{
	 *   activeSlide?: number,
	 *   canSwipePrev?: boolean,
	 *   canSwipeNext?: boolean,
	 *   onSlideChange?: (index: number) => void,
	 *   children?: import('svelte').Snippet<[{ activeSlide: number, goToSlide: (idx: number) => void }]>
	 * }}
	 */
	let {
		activeSlide = 0,
		canSwipePrev = true,
		canSwipeNext = true,
		onSlideChange,
		children
	} = $props();

	let currentSlide = $state(0);

	$effect(() => {
		if (activeSlide !== undefined && activeSlide !== currentSlide) {
			currentSlide = activeSlide;
		}
	});

	const SLIDES_COUNT = 2;

	/** @param {number} index */
	export function goToSlide(index) {
		if (index >= 0 && index < SLIDES_COUNT) {
			currentSlide = index;
			onSlideChange?.(currentSlide);
		}
	}

	const swipe = createSwipeHandlers({
		threshold: 45,
		axisRatio: 1.3,
		onSwipe: (direction) => {
			if (direction === 'left') {
				if (canSwipeNext && currentSlide < SLIDES_COUNT - 1) {
					goToSlide(currentSlide + 1);
				}
			} else {
				if (canSwipePrev && currentSlide > 0) {
					goToSlide(currentSlide - 1);
				}
			}
		}
	});

	/** @param {KeyboardEvent} e */
	function handleKeyDown(e) {
		const target = /** @type {HTMLElement} */ (e.target);
		if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
			return;
		}

		if (e.key === 'ArrowRight' && canSwipeNext && currentSlide < SLIDES_COUNT - 1) {
			goToSlide(currentSlide + 1);
		} else if (e.key === 'ArrowLeft' && canSwipePrev && currentSlide > 0) {
			goToSlide(currentSlide - 1);
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- Mobile Screen Shell -->
<div
	role="region"
	aria-label="Mobile screen carousel"
	class="w-full h-full flex flex-col justify-between bg-background text-text-main overflow-hidden select-none relative"
	ontouchstart={swipe.handleTouchStart}
	ontouchmove={swipe.handleTouchMove}
	ontouchend={swipe.handleTouchEnd}
>
	<!-- Top Sliding Progress Bar Indicator -->
	<div class="w-full h-1.5 bg-surface-variant flex z-40 border-b border-sketch-border/30">
		{#each Array(SLIDES_COUNT) as _, idx}
			<div
				class="h-full flex-1 transition-all duration-300 {idx === currentSlide
					? 'bg-primary'
					: idx < currentSlide
						? 'bg-primary/40'
						: 'bg-transparent'}"
			></div>
		{/each}
	</div>

	<!-- Main Screen Viewport Deck -->
	<div class="relative flex-1 w-full overflow-hidden">
		<div
			class="flex h-full w-full transition-transform duration-300 ease-out"
			style="transform: translateX(-{currentSlide * 100}%);"
		>
			{@render children?.({ activeSlide: currentSlide, goToSlide })}
		</div>
	</div>
</div>
