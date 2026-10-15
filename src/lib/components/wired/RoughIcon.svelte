<script>
	/**
	 * @type {{
	 *   name: string,
	 *   size?: number | string,
	 *   stroke?: string,
	 *   strokeWidth?: number,
	 *   class?: string
	 * }}
	 */
	let {
		name,
		size = 24,
		stroke = 'currentColor',
		strokeWidth = 1.8,
		class: className = ''
	} = $props();

	// Crisp, beautifully styled organic stroke paths (Feather / Phosphor aesthetic)
	// Guaranteed 100% clarity with rounded joints that match hand-drawn sketch vibes
	const ICONS_SVG_MAP = {
		spa: `
			<path d="M12 3c-2 4-5 7-7 11a7 7 0 0 0 14 0c-2-4-5-7-7-11z"></path>
			<path d="M12 21V12"></path>
			<path d="M8 15c2-1 4-1 4-1"></path>
			<path d="M16 15c-2-1-4-1-4-1"></path>
		`,
		arrow_back: `
			<path d="M19 12H5"></path>
			<path d="M12 19l-7-7 7-7"></path>
		`,
		arrow_forward: `
			<path d="M5 12h14"></path>
			<path d="M12 5l7 7-7 7"></path>
		`,
		search: `
			<circle cx="11" cy="11" r="7"></circle>
			<path d="M21 21l-4.35-4.35"></path>
		`,
		close: `
			<path d="M18 6L6 18"></path>
			<path d="M6 6l12 12"></path>
		`,
		check: `
			<path d="M20 6L9 17l-5-5"></path>
		`,
		check_circle: `
			<circle cx="12" cy="12" r="10"></circle>
			<path d="M8 12l3 3 5-5"></path>
		`,
		warning: `
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
			<line x1="12" y1="9" x2="12" y2="13"></line>
			<line x1="12" y1="17" x2="12.01" y2="17"></line>
		`,
		swipe: `
			<path d="M4 12l3-3-3-3"></path>
			<path d="M20 12l-3 3 3 3"></path>
			<path d="M6 12h12"></path>
		`,
		mic: `
			<rect x="9" y="3" width="6" height="11" rx="3"></rect>
			<path d="M5 11a7 7 0 0 0 14 0"></path>
			<path d="M12 18v3"></path>
		`,
		open_in_new: `
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
			<path d="M15 3h6v6"></path>
			<path d="M10 14L21 3"></path>
		`,
		pause: `
			<path d="M9 5v14"></path>
			<path d="M15 5v14"></path>
		`,
		play_arrow: `
			<path d="M7 4.5v15l12-7.5z"></path>
		`
	};

	// Unknown names render nothing (no icon font fallback: every icon is inline SVG).
	let svgContent = $derived(ICONS_SVG_MAP[/** @type {keyof typeof ICONS_SVG_MAP} */ (name)] || '');
</script>

{#if svgContent}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={size}
		height={size}
		fill="none"
		{stroke}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		class="inline-block shrink-0 select-none {className}"
		aria-hidden="true"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html svgContent}
	</svg>
{/if}
