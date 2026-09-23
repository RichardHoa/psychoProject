<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import { hasAnsweredSafetyGate } from '$lib/safety/gateSession.js';
	import { SAFETY_GATE_PATH, resolveGateDestination } from '$lib/safety/gateDestination.js';

	let { children } = $props();

	onMount(() => {
		if (page.url.pathname === SAFETY_GATE_PATH) return;
		if (hasAnsweredSafetyGate()) return;
		const { gateUrl } = resolveGateDestination(page.url);
		goto(gateUrl, { replaceState: true });
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<!-- Global Fullscreen Search Modal (Unconstrained by any parent container or backdrop-blur) -->
<SearchModal />
