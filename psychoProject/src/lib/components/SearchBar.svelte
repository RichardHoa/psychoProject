<script>
	import { searchState } from '$lib/state/searchState.svelte.js';
	import { m } from '$lib/paraglide/messages.js';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';

	/** @type {{ initialQuery?: string, placeholder?: string, isCompact?: boolean }} */
	let { initialQuery = '', placeholder = '', isCompact = false } = $props();

	function handleOpen() {
		searchState.open(initialQuery || searchState.query);
	}
</script>

<!-- TRIGGER SEARCH BAR (Wired Hand-Drawn Sketch Box) -->
<div class="w-full relative font-body">
	<button
		type="button"
		onclick={handleOpen}
		class="sketch-button w-full flex items-center justify-between text-left cursor-pointer transition-all bg-white rounded-2xl {isCompact
			? 'h-10 px-3 text-xs'
			: 'h-13 px-4 text-xs sm:text-sm'}"
		aria-label="Mở tìm kiếm kiến thức"
	>
		<div class="flex items-center gap-2.5 overflow-hidden">
			<RoughIcon name="search" size={isCompact ? 17 : 20} stroke="#1F523D" strokeWidth={1.9} />
			<span class="truncate text-text-subtle font-medium">
				{placeholder || m.home_search_placeholder()}
			</span>
		</div>

		<div class="flex items-center gap-1 shrink-0">
			<RoughIcon name="mic" size={isCompact ? 16 : 18} stroke="#1F523D" strokeWidth={1.8} />
			<span class="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-warm-cream border-1.5 border-sketch-border text-text-main">
				Tìm
			</span>
		</div>
	</button>
</div>
