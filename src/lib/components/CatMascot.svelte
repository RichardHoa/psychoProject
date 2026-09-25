<script>
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		happy,
		happyOpenEyes,
		happyAlt,
		happyDifferent,
		happyWaving,
		happyOpenEyesWaving
	} from '$lib/assets/cat/index.js';

	/** @typedef {import('vite-imagetools').Picture} Pose */

	// Played once on load (autoplay): a full hello using every pose. Pure CSS, see greetStyle().
	const defaultGreetSequence = [
		happy,
		happyOpenEyes,
		happyOpenEyesWaving,
		happyWaving,
		happyOpenEyesWaving,
		happyAlt,
		happyDifferent,
		happy
	];

	// Played when the mascot link is clicked, before navigating: a quick wave (JavaScript extra).
	const defaultClickSequence = [happyOpenEyesWaving, happyWaving, happyOpenEyesWaving, happy];

	/**
	 * @type {{
	 *   sequence?: Pose[],
	 *   clickSequence?: Pose[],
	 *   restImg?: Pose,
	 *   frameDurationMs?: number,
	 *   autoplay?: boolean,
	 *   sizeClass?: string,
	 *   sizes?: string,
	 *   class?: string,
	 *   href?: string,
	 *   ariaLabel?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		sequence = defaultGreetSequence,
		clickSequence = defaultClickSequence,
		restImg = happy,
		frameDurationMs = 240,
		autoplay = true,
		sizeClass = 'h-28 w-28 sm:h-36 sm:w-36',
		// Rendered width of the (portrait) pose inside the square box, for choosing a srcset size.
		sizes = '96px',
		class: className = '',
		href,
		ariaLabel,
		children
	} = $props();

	// The poses this instance can ever show: only these are stacked.
	const usedPoses = $derived([...new Set([restImg, ...sequence, ...clickSequence])]);

	/** Pose shown by the JavaScript click wave; null when it is not playing. */
	/** @type {Pose | null} */
	let wavePose = $state(null);
	let hasWaved = $state(false);
	let destroyed = false;

	onDestroy(() => {
		destroyed = true;
	});

	/**
	 * The greeting as CSS: each pose is shown (`cat-frame`) during each of its frames, and the rest
	 * pose is hidden (`cat-hide`) for the whole greeting except its own frames. Later animations in
	 * the list win while active, and none of them fill, so the rest pose remains afterwards.
	 * @param {Pose} pose
	 */
	function greetStyle(pose) {
		const d = frameDurationMs;
		const animations = sequence.flatMap((frame, i) =>
			frame === pose ? [`cat-frame ${d}ms step-end ${i * d}ms`] : []
		);
		if (pose === restImg) animations.unshift(`cat-hide ${sequence.length * d}ms step-end`);
		return animations.length ? `animation: ${animations.join(', ')}` : undefined;
	}

	/** @param {Pose[]} frames */
	async function playWave(frames) {
		hasWaved = true;
		for (const frame of frames) {
			if (destroyed) return;
			wavePose = frame;
			await new Promise((resolve) => setTimeout(resolve, frameDurationMs));
		}
		wavePose = null;
	}

	/**
	 * Without JavaScript this is a plain link. With it, the cat waves first, then navigates.
	 * Modified clicks (new tab, etc.) keep the browser's default behaviour.
	 * @param {MouseEvent} e
	 */
	async function handleClick(e) {
		if (!href || e.defaultPrevented || e.button !== 0) return;
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		if (wavePose) return;
		await playWave(clickSequence);
		if (!destroyed) goto(href);
	}
</script>

{#snippet stack()}
	<span class="relative block {sizeClass}">
		{#each usedPoses as pose (pose)}
			{@const greeting = autoplay && !hasWaved}
			<enhanced:img
				src={pose}
				alt=""
				{sizes}
				style={greeting ? greetStyle(pose) : undefined}
				class="absolute inset-0 h-full w-full object-contain {greeting ? 'cat-greet' : ''} {pose ===
				(wavePose ?? restImg)
					? 'opacity-100'
					: 'opacity-0'}"
			/>
		{/each}
	</span>
{/snippet}

{#if href}
	<a
		{href}
		onclick={handleClick}
		aria-label={ariaLabel}
		data-testid="cat-mascot"
		class="group flex shrink-0 cursor-pointer items-center gap-0.5 text-left select-none focus:outline-hidden {className}"
	>
		{@render stack()}
		{@render children?.()}
	</a>
{:else}
	<div
		class="pointer-events-none select-none {className}"
		aria-hidden="true"
		data-testid="cat-mascot"
	>
		{@render stack()}
	</div>
{/if}

<style>
	@keyframes -global-cat-frame {
		from,
		to {
			opacity: 1;
		}
	}

	@keyframes -global-cat-hide {
		from,
		to {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.cat-greet) {
			animation: none !important;
		}
	}
</style>
