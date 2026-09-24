<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
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

	// Played when the mascot link is clicked, before navigating: a quick wave burst.
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
		class: className = '',
		href,
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

	/**
	 * Without JavaScript this is a plain link. With it, the cat waves first, then navigates.
	 * Modified clicks (new tab, etc.) keep the browser's default behaviour.
	 * @param {MouseEvent} e
	 */
	async function handleClick(e) {
		if (!href || e.defaultPrevented || e.button !== 0) return;
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		await playSequence(clickSequence);
		if (destroyed) return;
		goto(href);
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

{#if href}
	<a
		{href}
		onclick={handleClick}
		aria-label={ariaLabel}
		class="group flex shrink-0 cursor-pointer items-center gap-0.5 text-left select-none focus:outline-hidden {className}"
	>
		{@render stack()}
		{@render children?.()}
	</a>
{:else}
	<div class="pointer-events-none select-none {className}" aria-hidden="true">
		{@render stack()}
	</div>
{/if}
