<script>
	import SearchBar from '$lib/components/SearchBar.svelte';
	import SquareBreathingModal from '$lib/components/SquareBreathingModal.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let isBreathingOpen = $state(false);

	function openBreathing() {
		isBreathingOpen = true;
	}

	function closeBreathing() {
		isBreathingOpen = false;
	}
</script>

<nav class="bg-surface-off-white/95 backdrop-blur-md shadow-xs sticky top-0 z-40 w-full border-b border-surface-variant font-body">
	<div class="flex items-center justify-between gap-3 w-full px-4 max-w-container-max mx-auto h-16 py-2">
		<!-- Brand / Logo -->
		<a href="/trang-chu" class="flex items-center gap-2 group shrink-0">
			<img
				src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0U642vdyozVbm4M-3nJpX3AxPlujyV00n4-v4o2GJoZm9klemx0agPcGlxqaT1Qt_XWhFc5emfN80Ci_j5gn9r5L9yyqR8IySOIR3Gmnw9R-V5gEYUFFSfd_7QyauIcTKvUAkXSOb5Z_xv18VIVPuQpBYBwPO37Z7tiFmDrH8Q7qagW8n1BEbkRP5d0LZr35KV_rt7_sH9OsxIsCF7so-kMsPyMw9zcfIH4S8aTDnBVgNNUKk-iyHUiijjsYp1eIJGMk"
				alt="MÈO Logo"
				class="h-9 w-auto object-contain transition-transform group-hover:scale-105"
			/>
			<span class="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">{m.brand_name()}</span>
		</a>

		<!-- Search Bar -->
		<div class="flex-1 max-w-xs sm:max-w-md">
			<SearchBar isCompact={true} placeholder={m.nav_search_placeholder()} />
		</div>

		<!-- Emergency Calming Exercise Button (Square Breathing 5s) -->
		<button
			type="button"
			onclick={openBreathing}
			class="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-emergency-red text-white hover:bg-red-600 active:scale-95 transition-all shadow-xs cursor-pointer"
			title="Thở vuông 5 giây giải tỏa căng thẳng khẩn cấp"
		>
			<span class="material-symbols-outlined text-base animate-pulse">spa</span>
			<span class="tracking-tight hidden xs:inline">Thở 5s</span>
		</button>
	</div>
</nav>

<!-- Square Breathing Modal -->
<SquareBreathingModal isOpen={isBreathingOpen} onClose={closeBreathing} />
