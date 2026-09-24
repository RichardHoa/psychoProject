<script>
	import { preloadData, replaceState } from '$app/navigation';
	import SearchPanel from '$lib/components/SearchPanel.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * The /tim-kiem page shown as an overlay via shallow routing. Its state lives in
	 * `page.state.search`, so closing it is just going back in history.
	 * @type {{ search: NonNullable<App.PageState['search']> }}
	 */
	let { search } = $props();

	let latestRequest = 0;

	/** @param {string} query */
	async function runQuery(query) {
		const request = ++latestRequest;
		const url = query ? `/tim-kiem?q=${encodeURIComponent(query)}` : '/tim-kiem';
		const result = await preloadData(url);
		// Ignore responses that arrive after a newer query was sent.
		if (request !== latestRequest || result.type !== 'loaded' || result.status !== 200) return;
		replaceState(url, {
			search: {
				query: result.data.query,
				results: result.data.results,
				suggestions: search.suggestions
			}
		});
	}

	function close() {
		history.back();
	}

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="modal-backdrop fade-in fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto p-4 font-body sm:p-6"
	onclick={(e) => {
		if (e.target === e.currentTarget) close();
	}}
	role="presentation"
>
	<div
		role="dialog"
		aria-modal="true"
		aria-label={m.search_open()}
		class="sketch-card slide-up flex max-h-[85vh] w-full max-w-lg -translate-y-[15px] flex-col overflow-hidden rounded-3xl bg-surface-off-white"
	>
		<SearchPanel
			query={search.query}
			results={search.results}
			suggestions={search.suggestions}
			autofocus
			onQuery={runQuery}
		/>

		<div
			class="border-t-1.5 border-sketch-border flex items-center justify-between bg-surface-container-low p-3 px-4 text-xs text-text-subtle"
		>
			<span>
				<kbd
					class="border-sketch-border rounded-md border bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold"
					>ESC</kbd
				>
				{m.search_esc_hint()}
			</span>
			<WiredButton onclick={close} fill="#FFFFFF">
				<span>{m.search_close()}</span>
			</WiredButton>
		</div>
	</div>
</div>
