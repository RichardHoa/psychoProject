<script>
	import { goto } from '$app/navigation';
	import BreadcrumbBar from '$lib/components/BreadcrumbBar.svelte';
	import FolderReader from '$lib/components/FolderReader.svelte';
	import { swipe } from '$lib/gestures/swipe.js';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();

	const HUB_HREF = '/trang-chu#chu-de';

	const breadcrumbs = $derived([
		{ id: 'root', label: m.breadcrumb_root(), icon: 'folder_open', href: HUB_HREF },
		{
			id: data.folder.id,
			label: data.folder.shortTitle || data.folder.title,
			icon: data.folder.icon
		}
	]);
</script>

<svelte:head>
	<title>{data.folder.title} · {m.brand_name()}</title>
	<meta name="description" content={data.folder.summary} />
</svelte:head>

<!-- Swipe right returns to the hub (JavaScript enhancement; the back link works without it). -->
<div
	class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-text-main select-none"
	{@attach swipe({
		threshold: 75,
		axisRatio: 1.5,
		onSwipe: (direction) => {
			if (direction === 'right') goto(HUB_HREF);
		}
	})}
>
	<BreadcrumbBar crumbs={breadcrumbs} backHref={HUB_HREF} />
	<FolderReader folder={data.folder} nextFolder={data.nextFolder} backHref={HUB_HREF} />
</div>
