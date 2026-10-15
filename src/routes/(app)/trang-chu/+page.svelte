<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { swipe } from '$lib/gestures/swipe.js';
	import { m } from '$lib/paraglide/messages.js';
	import { JOURNEY_PATH, LEGACY_JOURNEY_HASH } from '$lib/routes.js';
	import { getShell } from '$lib/state/shell.svelte.js';

	const shell = getShell();
	// The hint is about swiping, which needs JavaScript, so it only appears once hydrated.
	let showHint = $state(false);

	// `/trang-chu#chu-de` was the journey slide before the Journey got its own page. The fragment
	// never reaches the server, so the redirect happens here.
	onMount(() => {
		if (location.hash === `#${LEGACY_JOURNEY_HASH}`) goto(JOURNEY_PATH, { replaceState: true });
		showHint = true;
	});

	/**
	 * The navbar shows its compact search only once the hero's big search box has scrolled under it.
	 * @type {import('svelte/attachments').Attachment<HTMLElement>}
	 */
	function trackHeroSearch(el) {
		const observer = new IntersectionObserver(
			([entry]) => {
				shell.heroInView = entry.isIntersecting;
			},
			{ rootMargin: '-64px 0px 0px 0px' }
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			shell.heroInView = true;
		};
	}
</script>

<svelte:head>
	<title>{m.home_title()}</title>
</svelte:head>

<!-- Usage hint: fades out on its own via CSS after a few seconds, no timer needed. -->
{#if showHint}
	<div
		class="usage-hint sketch-card fixed right-4 bottom-4 left-4 z-40 mx-auto flex max-w-md items-center justify-between gap-2 rounded-2xl bg-warm-cream px-4 py-2.5 text-text-main"
	>
		<div class="flex items-center gap-2 text-xs">
			<RoughIcon name="swipe" size={16} stroke="#1F523D" strokeWidth={1.8} />
			<span><strong>{m.usage_hint_label()}</strong> {m.usage_hint()}</span>
		</div>
		<button
			type="button"
			onclick={() => (showHint = false)}
			class="cursor-pointer rounded-full p-1 text-text-subtle hover:text-text-main"
			aria-label={m.usage_hint_close()}
		>
			<RoughIcon name="close" size={14} stroke="#5A6561" strokeWidth={1.8} />
		</button>
	</div>
{/if}

<!-- Swiping left opens the Journey with a sideways slide (JavaScript enhancement; the
     "start the journey" link works without it). Swipes starting at the screen edge are left to
     the phone's own back gesture. -->
<section
	class="flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center space-y-6 px-5 py-10 pb-20 text-center"
	{@attach swipe({
		threshold: 75,
		axisRatio: 1.5,
		edgeMargin: 24,
		onSwipe: (direction) => {
			if (direction === 'left') goto(JOURNEY_PATH);
		}
	})}
>
	<div class="flex w-full max-w-sm flex-col items-center space-y-4 pt-10 sm:pt-6">
		<h1 class="text-2xl leading-tight font-black tracking-tight text-text-main sm:text-3xl">
			{m.home_hero_title()}
		</h1>

		<div class="mx-auto max-w-[140px]">
			<WiredDivider stroke="#1F523D" strokeWidth={1.6} roughness={1.4} />
		</div>

		<p class="px-2 text-xs leading-relaxed text-text-subtle sm:text-sm">
			{m.home_hero_desc()}
		</p>

		<div class="w-full pt-2" {@attach trackHeroSearch}>
			<SearchBar />
		</div>

		<div class="flex w-full justify-center pt-4">
			<WiredButton href={JOURNEY_PATH} fill="#EAF2EC" class="px-5 py-2.5 text-sm">
				<span>{m.home_start_journey()}</span>
				<RoughIcon name="arrow_forward" size={18} stroke="#1F523D" strokeWidth={1.8} />
			</WiredButton>
		</div>
	</div>
</section>

<style>
	.usage-hint {
		animation:
			hintIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both,
			hintOut 0.5s ease-in 6s forwards;
	}

	@keyframes hintIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes hintOut {
		to {
			opacity: 0;
			visibility: hidden;
		}
	}
</style>
