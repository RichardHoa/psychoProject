<script>
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * @type {{
	 *   activeSlide?: number,
	 *   onSlideChange?: (index: number) => void,
	 *   children?: import('svelte').Snippet<[{ activeSlide: number, goToSlide: (idx: number) => void }]>
	 * }}
	 */
	let { activeSlide = 0, onSlideChange, children } = $props();

	let currentSlide = $state(0);
	let touchStartX = $state(0);
	let touchStartY = $state(0);
	let touchEndX = $state(0);
	let isSwiping = $state(false);

	$effect(() => {
		if (activeSlide !== undefined && activeSlide !== currentSlide) {
			currentSlide = activeSlide;
		}
	});

	const SLIDES_COUNT = 2;

	const slideTabs = [
		{ index: 0, label: m.slide_home(), icon: 'home' },
		{ index: 1, label: m.slide_folders(), icon: 'folder_open' }
	];

	/** @param {number} index */
	export function goToSlide(index) {
		if (index >= 0 && index < SLIDES_COUNT) {
			currentSlide = index;
			onSlideChange?.(currentSlide);
		}
	}

	/** @param {TouchEvent} e */
	function handleTouchStart(e) {
		if (e.touches.length === 1) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchEndX = touchStartX;
			isSwiping = true;
		}
	}

	/** @param {TouchEvent} e */
	function handleTouchMove(e) {
		if (!isSwiping || e.touches.length !== 1) return;
		touchEndX = e.touches[0].clientX;
	}

	/** @param {TouchEvent} e */
	function handleTouchEnd(e) {
		if (!isSwiping) return;
		isSwiping = false;

		const deltaX = touchEndX - touchStartX;
		const deltaY = (e.changedTouches[0]?.clientY || touchStartY) - touchStartY;

		// Only trigger slide if horizontal swipe is significantly greater than vertical movement
		if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
			if (deltaX < 0) {
				// Swipe Left -> Next Slide
				if (currentSlide < SLIDES_COUNT - 1) {
					goToSlide(currentSlide + 1);
				}
			} else {
				// Swipe Right -> Prev Slide
				if (currentSlide > 0) {
					goToSlide(currentSlide - 1);
				}
			}
		}
	}

	/** @param {KeyboardEvent} e */
	function handleKeyDown(e) {
		// Avoid hijacking arrow keys inside inputs
		const target = /** @type {HTMLElement} */ (e.target);
		if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
			return;
		}

		if (e.key === 'ArrowRight' && currentSlide < SLIDES_COUNT - 1) {
			goToSlide(currentSlide + 1);
		} else if (e.key === 'ArrowLeft' && currentSlide > 0) {
			goToSlide(currentSlide - 1);
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- Mobile Screen Shell -->
<div
	role="region"
	aria-label="Mobile screen carousel"
	class="w-full h-full min-h-[100dvh] flex flex-col justify-between bg-background text-text-main overflow-hidden select-none relative"
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
>
	<!-- Top Sliding Progress Bar Indicator -->
	<div class="w-full h-1 bg-surface-variant/50 flex z-40">
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

	<!-- Bottom Mobile Navigation Bar -->
	<nav
		class="sticky bottom-0 left-0 right-0 z-40 bg-surface-off-white/95 backdrop-blur-md border-t border-surface-variant/80 px-4 py-1.5 shadow-lg safe-area-bottom"
	>
		<div class="max-w-xs mx-auto flex items-center justify-around gap-3">
			{#each slideTabs as tab (tab.index)}
				{@const isActive = currentSlide === tab.index}
				<button
					type="button"
					onclick={() => goToSlide(tab.index)}
					class="relative flex-1 py-1.5 px-3 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer {isActive
						? 'text-primary font-bold bg-primary/10'
						: 'text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-low active:scale-95'}"
				>
					<span
						class="material-symbols-outlined text-2xl transition-transform {isActive ? 'scale-110' : ''}"
						style={isActive ? "font-variation-settings: 'FILL' 1;" : ''}
					>
						{tab.icon}
					</span>
					<span class="text-[11px] leading-none tracking-tight">
						{tab.label}
					</span>
				</button>
			{/each}
		</div>
	</nav>
</div>

<style>
	.safe-area-bottom {
		padding-bottom: max(0.375rem, env(safe-area-inset-bottom));
	}
</style>
