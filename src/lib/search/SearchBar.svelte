<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { preloadData, pushState } from '$app/navigation';
	import { RoughIcon } from '$lib/ui/wired';
	import { m } from '$lib/paraglide/messages.js';

	/** @type {{ placeholder?: string, isCompact?: boolean }} */
	let { placeholder = '', isCompact = false } = $props();

	/**
	 * A plain link to the /tim-kiem page. With JavaScript it opens the same page as an overlay
	 * (shallow routing): the URL still becomes /tim-kiem, so reloading or sharing shows the page.
	 * @param {MouseEvent} e
	 */
	async function openOverlay(e) {
		if (page.route.id === '/(app)/tim-kiem') return;
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();

		const href = resolve('/tim-kiem');
		const result = await preloadData(href).catch(() => null);
		if (result?.type === 'loaded' && result.status === 200) {
			const { query, results, suggestions } = result.data;
			pushState(href, { search: { query, results, suggestions } });
		} else {
			// Redirect (e.g. safety gate), error or network failure: fall back to a real navigation.
			location.href = href;
		}
	}
</script>

<a
	href={resolve('/tim-kiem')}
	onclick={openOverlay}
	class="sketch-button flex w-full items-center justify-between rounded-2xl bg-white text-left font-body transition-all {isCompact
		? 'h-10 px-3 text-sm'
		: 'h-13 px-4 text-sm'}"
	aria-label={m.search_open()}
>
	<span class="flex items-center gap-2.5 overflow-hidden">
		<RoughIcon name="search" size={isCompact ? 18 : 20} class="text-primary" strokeWidth={1.8} />
		<span class="truncate font-medium text-text-subtle">
			{placeholder || m.home_search_placeholder()}
		</span>
	</span>

	<span
		class="hidden shrink-0 rounded-md border-[1.5px] border-sketch-border bg-warm-cream px-2 py-0.5 text-sm font-semibold text-text-main sm:inline-block"
	>
		{m.search_submit()}
	</span>
</a>
