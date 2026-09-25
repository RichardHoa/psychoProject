<script>
	import BoxBreathing from '$lib/components/BoxBreathing.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.breathing_page_title()}</title>
</svelte:head>

<div class="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 py-8">
	<div class="sketch-card w-full max-w-sm rounded-3xl bg-surface-off-white p-6">
		<BoxBreathing doneHref={data.returnTo} />
	</div>
</div>
