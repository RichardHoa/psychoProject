<script>
	import { onDestroy, onMount } from 'svelte';
	import {
		happy,
		happyOpenEyes,
		happyAlt,
		happyDifferent,
		happyWaving,
		happyOpenEyesWaving
	} from '$lib/assets/cat/index.js';

	// Played once automatically on mount (autoplay): a full hello using every pose.
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

	// Played when the mascot is clicked, before onActivate fires: a quick wave burst.
	const defaultClickSequence = [happyOpenEyesWaving, happyWaving, happyOpenEyesWaving, happy];

	/**
	 * @type {{
	 *   sequence?: string[],
	 *   clickSequence?: string[],
	 *   restImg?: string,
	 *   frameDurationMs?: number,
	 *   autoplay?: boolean,
	 *   sizeClass?: string,
	 *   class?: string,
	 *   onActivate?: () => void,
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
		class: className = '',
		onActivate,
		ariaLabel = 'Về trang chủ',
		children
	} = $props();

	// The poses this instance can ever show: only these are stacked and cross-faded.
	const usedPoses = $derived([...new Set([restImg, ...sequence, ...clickSequence])]);

	let currentImg = $state(restImg);
	let isAnimating = $state(false);
	let destroyed = false;

	onDestroy(() => {
		destroyed = true;
	});

	$effect(() => {
		if (!isAnimating) currentImg = restImg;
	});

	/**
	 * @param {string[]} frames
	 * @returns {Promise<void>}
	 */
	function playSequence(frames) {
		return new Promise((resolve) => {
			if (isAnimating || destroyed || frames.length === 0) {
				resolve();
				return;
			}
			isAnimating = true;
			let i = 0;

			function step() {
				if (destroyed) {
					resolve();
					return;
				}
				currentImg = frames[i];
				i += 1;
				if (i < frames.length) {
					setTimeout(step, frameDurationMs);
				} else {
					isAnimating = false;
					resolve();
				}
			}

			step();
		});
	}

	onMount(() => {
		if (autoplay) playSequence(sequence);
	});

	async function handleClick() {
		if (!onActivate) return;
		await playSequence(clickSequence);
		if (destroyed) return;
		onActivate();
	}
</script>

{#snippet stack()}
	<span class="relative block {sizeClass}">
		{#each usedPoses as pose (pose)}
			<img
				src={pose}
				alt=""
				style="transition-duration: {frameDurationMs}ms"
				class="absolute inset-0 h-full w-full object-contain transition-opacity ease-in-out {pose ===
				currentImg
					? 'opacity-100'
					: 'opacity-0'}"
			/>
		{/each}
	</span>
{/snippet}

{#if onActivate}
	<button
		type="button"
		onclick={handleClick}
		aria-label={ariaLabel}
		class="group flex shrink-0 cursor-pointer items-center gap-0.5 text-left select-none focus:outline-hidden {className}"
	>
		{@render stack()}
		{@render children?.()}
	</button>
{:else}
	<div class="pointer-events-none select-none {className}" aria-hidden="true">
		{@render stack()}
	</div>
{/if}
