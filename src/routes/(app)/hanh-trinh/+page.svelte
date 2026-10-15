<script>
	import { goto } from '$app/navigation';
	import JourneyPath from '$lib/components/JourneyPath.svelte';
	import { swipe } from '$lib/gestures/swipe.js';
	import { m } from '$lib/paraglide/messages.js';
	import { LANDING_PATH } from '$lib/routes.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.journey_title()} · {m.brand_name()}</title>
</svelte:head>

<!-- Swiping right slides back to the Landing page (JavaScript enhancement; the navbar's cat links
     there without it). Swipes starting at the screen edge are left to the phone's own back gesture. -->
<div
	class="flex-1"
	{@attach swipe({
		threshold: 75,
		axisRatio: 1.5,
		edgeMargin: 24,
		onSwipe: (direction) => {
			if (direction === 'right') goto(LANDING_PATH);
		}
	})}
>
	<JourneyPath folders={data.folders} />
</div>
