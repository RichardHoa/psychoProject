<script>
	/**
	 * Horizontal full-screen slides built on CSS scroll-snap: swiping, trackpads, keyboard
	 * (when focused) and `#slide-id` links all work natively, with or without JavaScript.
	 * Each child slide should be a `.slide` element with an `id` so it can be linked to.
	 * @type {{
	 *   label: string,
	 *   slideCount: number,
	 *   onActiveChange?: (index: number) => void,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { label, slideCount, onActiveChange, children } = $props();

	let progress = $state(0);

	/** @type {import('svelte/attachments').Attachment<HTMLElement>} */
	function trackScroll(el) {
		let lastActive = -1;
		function update() {
			const max = el.scrollWidth - el.clientWidth;
			progress = max > 0 ? el.scrollLeft / max : 0;
			const active = Math.round(el.scrollLeft / el.clientWidth);
			if (active !== lastActive) {
				lastActive = active;
				onActiveChange?.(active);
			}
		}
		update();
		el.addEventListener('scroll', update, { passive: true });
		return () => el.removeEventListener('scroll', update);
	}
</script>

<div class="slider flex h-full w-full flex-col bg-background text-text-main">
	<!-- Progress bar: scroll-driven animation where supported, JS-updated transform otherwise. -->
	<div
		class="border-sketch-border/30 h-1.5 w-full shrink-0 border-b bg-surface-variant"
		aria-hidden="true"
	>
		<div
			class="progress-fill h-full origin-left bg-primary"
			style:transform="scaleX({(1 + progress * (slideCount - 1)) / slideCount})"
			style:--start-scale={1 / slideCount}
		></div>
	</div>

	<div
		role="region"
		aria-label={label}
		tabindex="-1"
		class="slides no-scrollbar flex min-h-0 w-full flex-1 overflow-x-auto overflow-y-hidden"
		{@attach trackScroll}
	>
		{@render children()}
	</div>
</div>

<style>
	.slider {
		timeline-scope: --slides;
	}

	.slides {
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		overscroll-behavior-x: contain;
		scroll-timeline: --slides x;
	}

	.slides > :global(.slide) {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.no-scrollbar {
		scrollbar-width: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	@supports (animation-timeline: scroll()) {
		.progress-fill {
			animation: slideProgress linear both;
			animation-timeline: --slides;
		}
	}

	@keyframes slideProgress {
		from {
			transform: scaleX(var(--start-scale));
		}
		to {
			transform: scaleX(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.slides {
			scroll-behavior: auto;
		}
	}
</style>
