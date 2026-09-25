<script>
	import { page } from '$app/state';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import SquareBreathingModal from '$lib/components/SquareBreathingModal.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import CatMascot from '$lib/components/CatMascot.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { ShellState, setShell } from '$lib/state/shell.svelte.js';

	let { children } = $props();

	const shell = setShell(new ShellState());

	// The Landing hero and the search page already show a full-size search box.
	const showNavSearch = $derived(
		page.route.id === '/(app)/trang-chu' ? !shell.heroInView : page.route.id !== '/(app)/tim-kiem'
	);
</script>

<!-- Mobile Viewport Container Shell with Warm Atmosphere -->
<div
	class="flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#EDE8DF] font-body select-none"
>
	<div
		class="sm:border-x-1.5 sm:border-sketch-border relative flex h-full w-full max-w-md flex-col overflow-hidden bg-background shadow-2xl sm:max-w-lg md:max-w-xl"
	>
		<!-- Top App Bar / Navbar (Hand-Drawn Sketch Header) -->
		<header
			class="border-b-1.5 border-sketch-border z-30 flex h-16 shrink-0 items-center justify-between gap-2 bg-surface-off-white px-4 sm:gap-3"
		>
			<CatMascot
				autoplay={false}
				href="/trang-chu#gioi-thieu"
				sizeClass="h-11 w-11"
				class="shrink-0"
				ariaLabel={m.home_logo_label()}
			>
				{#snippet children()}
					<span class="text-xl font-black tracking-tight text-primary">{m.brand_name()}</span>
				{/snippet}
			</CatMascot>

			<div class="xs:max-w-[180px] max-w-[150px] flex-1 sm:max-w-[220px]">
				{#if showNavSearch}
					<div class="fade-in">
						<SearchBar isCompact={true} placeholder={m.nav_search_placeholder()} />
					</div>
				{/if}
			</div>

			<WiredButton
				onclick={() => (shell.isBreathingOpen = true)}
				fill="#FDF0EE"
				stroke="#D24D48"
				title={m.breathing_btn_title()}
				class="shrink-0"
			>
				<RoughIcon name="spa" size={18} stroke="#D24D48" strokeWidth={1.8} />
				<span class="font-black tracking-tight text-emergency-red">{m.breathing_btn()}</span>
			</WiredButton>
		</header>

		<div class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
			{@render children()}
		</div>
	</div>
</div>

<!-- Shallow-routed search: /tim-kiem opened as an overlay without leaving the current page. -->
{#if page.state.search}
	<SearchModal search={page.state.search} />
{/if}

<SquareBreathingModal
	isOpen={shell.isBreathingOpen}
	onClose={() => (shell.isBreathingOpen = false)}
/>
