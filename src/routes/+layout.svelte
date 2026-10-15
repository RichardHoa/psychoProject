<script>
	import { onNavigate } from '$app/navigation';
	// Self-hosted Be Vietnam Pro (each file carries Vietnamese/Latin subsets via unicode-range).
	import '@fontsource/be-vietnam-pro/400.css';
	import '@fontsource/be-vietnam-pro/500.css';
	import '@fontsource/be-vietnam-pro/600.css';
	import '@fontsource/be-vietnam-pro/700.css';
	import '@fontsource/be-vietnam-pro/800.css';
	import '@fontsource/be-vietnam-pro/900.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { slideDirection } from '$lib/transitions.js';

	let { children } = $props();

	// Client-side navigations animate with the View Transitions API where supported: a sideways
	// slide between the Landing page and the Journey, a cross-fade everywhere else. Full page
	// loads (no JavaScript) get the cross-fade from `@view-transition` in layout.css.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		const from = navigation.from?.url.pathname;
		const to = navigation.to?.url.pathname;
		if (from === to) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const root = document.documentElement;
		const slide = slideDirection(from, to);
		if (slide) root.dataset.slide = slide;

		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => delete root.dataset.slide);
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
