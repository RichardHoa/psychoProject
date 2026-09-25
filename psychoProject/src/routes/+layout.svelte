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

	let { children } = $props();

	// Client-side navigations animate with the View Transitions API where supported. Full page
	// loads (no JavaScript) get the same effect from `@view-transition` in layout.css.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
