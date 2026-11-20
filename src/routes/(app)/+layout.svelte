<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import SearchBar from '$lib/search/SearchBar.svelte';
	import SearchModal from '$lib/search/SearchModal.svelte';
	import BreathingDialog from '$lib/breathing/BreathingDialog.svelte';
	import { RoughIcon, WiredButton } from '$lib/ui/wired';
	import CatMascot from '$lib/cat/CatMascot.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { BREATHING_PATH, breathingHref } from '$lib/breathing/breathing.js';
	import { LANDING_PATH } from '$lib/shared/routes.js';

	let { children } = $props();

	// The Landing page is the picker alone, full screen, with no navbar.
	const isLanding = $derived(page.route.id === '/(app)/trang-chu');

	// The search page already shows a full-size search box.
	const showNavSearch = $derived(page.route.id !== '/(app)/tim-kiem');

	// A real link to /tho-vuong (remembering this page for "Done"). With JavaScript it opens the
	// same exercise as an overlay via shallow routing, keeping the current page underneath.
	const breathingLink = $derived(resolve(breathingHref(page.url)));

	/** @param {MouseEvent} e */
	function openBreathing(e) {
		if (page.url.pathname === BREATHING_PATH) return;
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		pushState(resolve(breathingHref(page.url)), {
			breathing: { returnTo: page.url.pathname + page.url.search }
		});
	}
</script>

<!-- Mobile-width column with a warm backdrop. The page itself scrolls (not an inner box), so
     the browser resets scroll on navigation, restores it on back, and anchor jumps can never push
     the navbar away. -->
<div class="flex min-h-[100dvh] w-full justify-center bg-backdrop font-body select-none">
	<div
		class="shell-column relative flex min-h-[100dvh] w-full max-w-md flex-col bg-background shadow-2xl sm:max-w-lg sm:border-x-[1.5px] sm:border-sketch-border md:max-w-xl"
	>
		<!-- Top App Bar / Navbar (Hand-Drawn Sketch Header), on screen everywhere but the Landing. -->
		{#if !isLanding}
			<header
				class="navbar sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b-[1.5px] border-sketch-border bg-surface-off-white px-4 sm:gap-3"
			>
				<CatMascot
					autoplay={false}
					clickSequence={[]}
					href={resolve(LANDING_PATH)}
					sizeClass="h-11 w-11"
					sizes="30px"
					class="shrink-0"
					ariaLabel={m.home_logo_label()}
				>
					<span class="text-xl font-bold tracking-tight text-primary">{m.brand_name()}</span>
				</CatMascot>

				<div class="max-w-37.5 flex-1 xs:max-w-45 sm:max-w-55">
					{#if showNavSearch}
						<SearchBar isCompact={true} placeholder={m.nav_search_placeholder()} />
					{/if}
				</div>

				<WiredButton
					href={breathingLink}
					onclick={openBreathing}
					fill="#EAF2EC"
					title={m.breathing_btn_title()}
					class="shrink-0"
				>
					<RoughIcon name="spa" size={18} class="text-primary" strokeWidth={1.8} />
					<span class="font-bold tracking-tight text-primary">{m.breathing_btn()}</span>
				</WiredButton>
			</header>
		{/if}

		<div class="relative flex flex-1 flex-col">
			{@render children()}
		</div>
	</div>
</div>

<!-- Shallow-routed search: /tim-kiem opened as an overlay without leaving the current page. -->
{#if page.state.search}
	<SearchModal search={page.state.search} />
{/if}

<!-- Shallow-routed breathing exercise: /tho-vuong opened as a modal over the current page. -->
{#if page.state.breathing}
	<BreathingDialog doneHref={page.state.breathing.returnTo} />
{/if}

<style>
	/* Clip sideways overflow without becoming a scroll container, so the sticky navbar sticks to
	   the viewport. */
	.shell-column {
		overflow-x: clip;
	}

	/* Stays put while the page beneath it cross-fades or slides (see the root +layout). */
	.navbar {
		view-transition-name: navbar;
	}
</style>
