<script>
	import BreadcrumbBar from '$lib/components/BreadcrumbBar.svelte';
	import StepReader from '$lib/components/StepReader.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { JOURNEY_PATH } from '$lib/routes.js';

	let { data } = $props();

	const breadcrumbs = $derived([
		{ id: 'root', label: m.breadcrumb_root(), href: JOURNEY_PATH },
		{ id: data.folder.id, label: data.folder.shortTitle }
	]);
</script>

<svelte:head>
	<title>{data.folder.title} · {m.brand_name()}</title>
	<meta name="description" content={data.folder.summary} />
</svelte:head>

<!-- No swipe-to-go-back here: the phone's own back gesture does that, and a second swipe
     handler fought with it. -->
<div class="w-full bg-background font-body text-text-main select-none">
	<BreadcrumbBar crumbs={breadcrumbs} backHref={JOURNEY_PATH} />
	<!-- Keyed by step, so moving to another step starts at its top; switching between the short
	     and detailed version of the same step keeps the reader in place. -->
	{#key data.folder.id}
		<StepReader
			folder={data.folder}
			step={data.step}
			stepCount={data.stepCount}
			prevFolder={data.prevFolder}
			nextFolder={data.nextFolder}
			backHref={JOURNEY_PATH}
			detailed={data.detailed}
		/>
	{/key}
</div>
