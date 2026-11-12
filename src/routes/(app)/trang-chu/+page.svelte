<script>
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ConcernPicker from '$lib/trail/ConcernPicker.svelte';
	import { RoughIcon } from '$lib/ui/wired';
	import { swipe } from '$lib/gestures/swipe.js';
	import { m } from '$lib/paraglide/messages.js';
	import { JOURNEY_PATH, LEGACY_JOURNEY_HASH } from '$lib/shared/routes.js';

	let { data } = $props();

	// The hint is about swiping, which needs JavaScript, so it only appears once hydrated.
	let showHint = $state(false);

	// `/trang-chu#chu-de` was the journey slide before the Journey got its own page. The fragment
	// never reaches the server, so the redirect happens here.
	onMount(() => {
		if (location.hash === `#${LEGACY_JOURNEY_HASH}`)
			goto(resolve(JOURNEY_PATH), { replaceState: true });
		showHint = true;
	});
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
			<RoughIcon name="swipe" size={16} class="text-primary" strokeWidth={1.8} />
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
	class="flex w-full flex-col items-center px-5 text-center"
	{@attach swipe({
		threshold: 75,
		axisRatio: 1.5,
		edgeMargin: 24,
		onSwipe: (direction) => {
			if (direction === 'left') goto(resolve(JOURNEY_PATH));
		}
	})}
>
	<!-- The Landing is the picker alone: it fills the whole screen. -->
	<div class="flex min-h-[100dvh] w-full max-w-sm flex-col pt-[8dvh] pb-8">
		<ConcernPicker picker={data.picker} />
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
