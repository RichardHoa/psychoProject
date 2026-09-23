<script>
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import ScreenSlider from '$lib/components/ScreenSlider.svelte';
	import FolderExplorer from '$lib/components/FolderExplorer.svelte';
	import SquareBreathingModal from '$lib/components/SquareBreathingModal.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import CatMascot from '$lib/components/CatMascot.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import {
		createFolderNav,
		navStateToUrl,
		navStateFromSearchParams
	} from '$lib/nav/folderNav.svelte.js';

	const nav = createFolderNav();
	let isBreathingOpen = $state(false);
	let showUsageHint = $state(true);

	function pushNavState() {
		const snapshot = { slide: nav.slide, folderId: nav.folderId, subfolderId: nav.subfolderId };
		pushState(navStateToUrl(snapshot, page.url.pathname), {
			slide: snapshot.slide,
			folder: snapshot.folderId,
			sub: snapshot.subfolderId
		});
	}

	$effect(() => {
		const state = /** @type {App.PageState} */ (page.state);
		if (state.slide !== undefined) {
			nav.reset({
				slide: state.slide,
				folderId: state.folder ?? null,
				subfolderId: state.sub ?? null
			});
		} else {
			nav.reset(navStateFromSearchParams(page.url.searchParams));
		}
	});

	onMount(async () => {
		await tick();

		const snapshot = navStateFromSearchParams(page.url.searchParams);
		nav.reset(snapshot);
		replaceState(navStateToUrl(snapshot, page.url.pathname), {
			slide: snapshot.slide,
			folder: snapshot.folderId,
			sub: snapshot.subfolderId
		});
	});

	$effect(() => {
		if (typeof window !== 'undefined') {
			const timer = setTimeout(() => {
				showUsageHint = false;
			}, 6000);

			return () => clearTimeout(timer);
		}
	});

	/** @param {number} index */
	function handleSlideChange(index) {
		nav.goToSlide(index);
		pushNavState();
		if (showUsageHint) {
			showUsageHint = false;
		}
	}

	function goToLanding() {
		nav.goToRoot();
		nav.goToSlide(0);
		pushNavState();
	}

	function openBreathing() {
		isBreathingOpen = true;
	}

	function closeBreathing() {
		isBreathingOpen = false;
	}
</script>

<svelte:head>
	<title>{m.home_title()}</title>
</svelte:head>

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
			<!-- Logo / Brand Button: Cat mascot icon -->
			<CatMascot
				autoplay={false}
				onActivate={goToLanding}
				sizeClass="h-11 w-11"
				class="shrink-0"
				ariaLabel="Về trang chủ"
			>
				{#snippet children()}
					<span class="text-xl font-black tracking-tight text-primary">{m.brand_name()}</span>
				{/snippet}
			</CatMascot>

			<!-- Search Bar on Navbar (Slide 1) -->
			<div class="xs:max-w-[180px] max-w-[150px] flex-1 sm:max-w-[220px]">
				{#if nav.slide !== 0}
					<div class="fade-in">
						<SearchBar isCompact={true} placeholder={m.nav_search_placeholder()} />
					</div>
				{/if}
			</div>

			<!-- Emergency Breathing Button -->
			<WiredButton
				onclick={openBreathing}
				fill="#FDF0EE"
				stroke="#D24D48"
				title="Thở vuông 5 giây giải tỏa căng thẳng"
				class="shrink-0"
			>
				<RoughIcon name="spa" size={18} stroke="#D24D48" strokeWidth={1.8} />
				<span class="font-black tracking-tight text-emergency-red">Thở 5s</span>
			</WiredButton>
		</header>

		<!-- Floating Usage Hint (Hand-Drawn Sketch Card) -->
		{#if showUsageHint}
			<div
				class="sketch-card fade-in absolute right-4 bottom-18 left-4 z-40 flex items-center justify-between gap-2 rounded-2xl bg-warm-cream px-4 py-2.5 text-text-main transition-all duration-500"
			>
				<div class="flex items-center gap-2 text-xs">
					<RoughIcon name="swipe" size={16} stroke="#1F523D" strokeWidth={1.8} />
					<span><strong>Mẹo:</strong> Vuốt sang trái/phải 👈 👉 để chuyển màn hình.</span>
				</div>
				<button
					type="button"
					onclick={() => (showUsageHint = false)}
					class="cursor-pointer rounded-full p-1 text-text-subtle hover:text-text-main"
					aria-label="Đóng hướng dẫn"
				>
					<RoughIcon name="close" size={14} stroke="#5A6561" strokeWidth={1.8} />
				</button>
			</div>
		{/if}

		<!-- Screen Slider System (2 Slides: Home & Folders) -->
		<div class="flex-1 overflow-hidden">
			<ScreenSlider
				activeSlide={nav.slide}
				canSwipePrev={!nav.folderId}
				onSlideChange={handleSlideChange}
			>
				{#snippet children()}
					<!-- SLIDE 0: HAND-DRAWN WARM HERO (LANDING) -->
					<div
						class="flex h-full w-full shrink-0 flex-col items-center space-y-6 overflow-y-auto px-5 py-10 pb-20 text-center"
					>
						<div class="flex w-full max-w-sm flex-col items-center space-y-4 pt-10 sm:pt-6">
							<h1
								class="text-2xl leading-tight font-black tracking-tight text-text-main sm:text-3xl"
							>
								{m.home_hero_title()}
							</h1>

							<div class="mx-auto max-w-[140px]">
								<WiredDivider stroke="#1F523D" strokeWidth={1.6} roughness={1.4} />
							</div>

							<p class="px-2 text-xs leading-relaxed text-text-subtle sm:text-sm">
								{m.home_hero_desc()}
							</p>

							<!-- Main Central Search Bar -->
							<div class="w-full pt-2">
								<SearchBar initialQuery="" />
							</div>

							<!-- Quick Access Button to Folders -->
							<div class="flex w-full justify-center pt-4">
								<WiredButton
									onclick={() => handleSlideChange(1)}
									fill="#EAF2EC"
									class="px-5 py-2.5 text-sm"
								>
									<span>Khám phá 4 chủ đề</span>
									<RoughIcon name="arrow_forward" size={18} stroke="#1F523D" strokeWidth={1.8} />
								</WiredButton>
							</div>
						</div>
					</div>

					<!-- SLIDE 1: 4 FOLDERS KNOWLEDGE HUB -->
					<div class="flex h-full w-full shrink-0 flex-col">
						<FolderExplorer {nav} onAfterNavigate={pushNavState} />
					</div>
				{/snippet}
			</ScreenSlider>
		</div>
	</div>
</div>

<!-- Square Breathing 5s Modal -->
<SquareBreathingModal isOpen={isBreathingOpen} onClose={closeBreathing} />
