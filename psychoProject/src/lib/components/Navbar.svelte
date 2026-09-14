<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';

	/** @type {{ showHotlineBtn?: boolean, onSearchSubmit?: (query: string) => void }} */
	let { showHotlineBtn = false, onSearchSubmit } = $props();

	let navSearchQuery = $state('');

	/** @param {KeyboardEvent} e */
	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			const query = navSearchQuery.trim();
			if (query) {
				if (page.url.pathname === '/trang-chu') {
					if (onSearchSubmit) {
						onSearchSubmit(query);
					} else {
						goto(`/trang-chu?q=${encodeURIComponent(query)}`);
					}
				} else {
					goto(`/trang-chu?q=${encodeURIComponent(query)}`);
				}
			}
		}
	}
</script>

<nav class="bg-surface/90 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full border-b border-surface-variant font-body">
	<div class="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20 py-3">
		<a href="/trang-chu" class="flex items-center gap-3 group">
			<img
				src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0U642vdyozVbm4M-3nJpX3AxPlujyV00n4-v4o2GJoZm9klemx0agPcGlxqaT1Qt_XWhFc5emfN80Ci_j5gn9r5L9yyqR8IySOIR3Gmnw9R-V5gEYUFFSfd_7QyauIcTKvUAkXSOb5Z_xv18VIVPuQpBYBwPO37Z7tiFmDrH8Q7qagW8n1BEbkRP5d0LZr35KV_rt7_sH9OsxIsCF7so-kMsPyMw9zcfIH4S8aTDnBVgNNUKk-iyHUiijjsYp1eIJGMk"
				alt="MÈO Logo"
				class="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
			/>
			<span class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">{m.brand_name()}</span>
		</a>

		<div class="flex items-center gap-8 font-medium text-base">
			<a
				href="/trang-chu"
				class={page.url.pathname === '/trang-chu'
					? 'text-primary font-bold border-b-2 border-primary pb-1'
					: 'text-on-surface-variant hover:text-primary transition-colors'}
			>
				{m.nav_home()}
			</a>
			<a
				href="/tai-nguyen"
				class={page.url.pathname === '/tai-nguyen'
					? 'text-primary font-bold border-b-2 border-primary pb-1'
					: 'text-on-surface-variant hover:text-primary transition-colors'}
			>
				{m.nav_resources()}
			</a>
		</div>

		<div class="flex items-center gap-4">
			{#if showHotlineBtn}
				<a
					href="https://duongdaynongngaymai.vn/"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden sm:inline-flex items-center gap-1.5 text-base font-semibold text-white bg-emergency-red px-4 py-2 rounded-full hover:bg-red-600 transition-all shadow-sm"
				>
					<span class="material-symbols-outlined text-base">call</span>
					{m.nav_hotline()}
				</a>
			{/if}

			<div class="relative w-52 sm:w-68 md:w-76">
				<input
					type="text"
					bind:value={navSearchQuery}
					onkeydown={handleKeyDown}
					placeholder={m.nav_search_placeholder()}
					class="w-full py-2.5 pl-11 pr-4 bg-surface-container-low border border-surface-variant rounded-full text-base font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
				/>
				<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
					search
				</span>
			</div>
		</div>
	</div>
</nav>
