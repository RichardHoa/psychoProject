<script>
	import { searchState } from '$lib/state/searchState.svelte.js';
	import { m } from '$lib/paraglide/messages.js';

	/** @type {{ initialQuery?: string, placeholder?: string, isCompact?: boolean }} */
	let { initialQuery = '', placeholder = '', isCompact = false } = $props();

	function handleOpen() {
		searchState.open(initialQuery || searchState.query);
	}
</script>

<!-- TRIGGER SEARCH BAR (Opens Global Fullscreen Unconstrained Modal) -->
<div class="w-full relative font-body">
	<button
		type="button"
		onclick={handleOpen}
		class="w-full flex items-center justify-between text-left cursor-pointer group transition-all"
		aria-label="Mở tìm kiếm kiến thức"
	>
		<div
			class="w-full {isCompact
				? 'h-10 pl-3 pr-3 text-xs'
				: 'h-12 sm:h-14 pl-4 pr-4 text-xs sm:text-sm'} bg-surface-off-white border border-surface-variant hover:border-primary/50 rounded-full shadow-xs flex items-center justify-between gap-2 text-outline group-hover:text-on-surface transition-colors"
		>
			<div class="flex items-center gap-2.5 overflow-hidden">
				<span class="material-symbols-outlined {isCompact ? 'text-lg' : 'text-xl'} text-primary shrink-0">search</span>
				<span class="truncate text-on-surface-variant/80 font-medium">
					{placeholder || m.home_search_placeholder()}
				</span>
			</div>

			<div class="flex items-center gap-1 shrink-0 text-outline">
				<span class="material-symbols-outlined {isCompact ? 'text-base' : 'text-lg'} text-primary/70 group-hover:text-primary">mic</span>
				<span class="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant/70 border border-surface-variant">
					Tìm kiếm
				</span>
			</div>
		</div>
	</button>
</div>
