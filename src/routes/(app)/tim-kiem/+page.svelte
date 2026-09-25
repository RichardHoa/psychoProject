<script>
	import { goto } from '$app/navigation';
	import SearchPanel from '$lib/components/SearchPanel.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();

	/** @param {string} query */
	function runQuery(query) {
		const url = query ? `/tim-kiem?q=${encodeURIComponent(query)}` : '/tim-kiem';
		return goto(url, { keepFocus: true, replaceState: true, noScroll: true });
	}
</script>

<svelte:head>
	<title>{data.query ? `${data.query} · ` : ''}{m.search_title()}</title>
</svelte:head>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-off-white">
	<SearchPanel
		query={data.query}
		results={data.results}
		suggestions={data.suggestions}
		autofocus={!data.query}
		onQuery={runQuery}
	/>
</div>
