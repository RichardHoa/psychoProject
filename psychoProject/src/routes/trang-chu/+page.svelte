<script>
	import { page } from '$app/state';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import ScreenSlider from '$lib/components/ScreenSlider.svelte';
	import FolderExplorer from '$lib/components/FolderExplorer.svelte';
	import SquareBreathingModal from '$lib/components/SquareBreathingModal.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let activeSlide = $state(0);
	let activeFolder = $state(/** @type {string | null} */ (null));
	let activeSubfolder = $state(/** @type {string | null} */ (null));
	let isBreathingOpen = $state(false);
	let showUsageHint = $state(true);

	// Synchronize with URL search parameters on mount or change
	$effect(() => {
		const fParam = page.url.searchParams.get('folder');
		const subParam = page.url.searchParams.get('sub');
		const slideParam = page.url.searchParams.get('slide');

		if (fParam) {
			activeFolder = fParam;
			activeSlide = 1;
		}
		if (subParam) {
			activeSubfolder = subParam;
			activeSlide = 1;
		}
		if (slideParam !== null) {
			const parsed = parseInt(slideParam, 10);
			if (!isNaN(parsed) && (parsed === 0 || parsed === 1)) {
				activeSlide = parsed;
			}
		}
	});

	// Auto-dismiss usage hint after 6 seconds
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
		activeSlide = index;
		// Hide hint on user interaction
		if (showUsageHint) {
			showUsageHint = false;
		}
	}

	/** 
	 * @param {string | null} folderId 
	 * @param {string | null} subfolderId 
	 */
	function handleFolderNavigation(folderId, subfolderId) {
		activeFolder = folderId;
		activeSubfolder = subfolderId;
	}

	function goToLanding() {
		activeSlide = 0;
		activeFolder = null;
		activeSubfolder = null;
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

<!-- Mobile Viewport Container Shell -->
<div class="w-full h-[100dvh] bg-neutral-900 flex justify-center items-center overflow-hidden font-body select-none">
	<div class="w-full h-full max-w-md sm:max-w-lg md:max-w-xl bg-background flex flex-col shadow-2xl relative overflow-hidden sm:border-x sm:border-surface-variant/50">
		<!-- Top App Bar / Navbar -->
		<header class="h-16 shrink-0 bg-surface-off-white/95 backdrop-blur-md border-b border-surface-variant/80 px-3 flex items-center justify-between gap-2.5 z-30">
			<!-- Logo / Brand Button (Clicking moves directly to Landing Page) -->
			<button
				type="button"
				onclick={goToLanding}
				class="flex items-center gap-1.5 shrink-0 group cursor-pointer text-left focus:outline-hidden"
				aria-label="Về trang chủ"
			>
				<img
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0U642vdyozVbm4M-3nJpX3AxPlujyV00n4-v4o2GJoZm9klemx0agPcGlxqaT1Qt_XWhFc5emfN80Ci_j5gn9r5L9yyqR8IySOIR3Gmnw9R-V5gEYUFFSfd_7QyauIcTKvUAkXSOb5Z_xv18VIVPuQpBYBwPO37Z7tiFmDrH8Q7qagW8n1BEbkRP5d0LZr35KV_rt7_sH9OsxIsCF7so-kMsPyMw9zcfIH4S8aTDnBVgNNUKk-iyHUiijjsYp1eIJGMk"
					alt="MÈO"
					class="h-8 w-auto object-contain transition-transform group-hover:scale-105"
				/>
				<span class="text-lg font-extrabold text-primary tracking-tight">{m.brand_name()}</span>
			</button>

			<!-- Search Bar on Navbar (Hidden on Landing Slide 0 to avoid duplicates; Active on Slide 1 / Folders) -->
			<div class="flex-1 max-w-[200px] sm:max-w-[240px] md:max-w-[280px]">
				{#if activeSlide !== 0}
					<div class="fade-in">
						<SearchBar isCompact={true} placeholder={m.nav_search_placeholder()} />
					</div>
				{/if}
			</div>

			<!-- Emergency Calming Exercise Button (Square Breathing 5s) -->
			<button
				type="button"
				onclick={openBreathing}
				class="shrink-0 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full bg-emergency-red text-white hover:bg-red-600 active:scale-95 transition-all shadow-xs cursor-pointer"
				title="Thở vuông 5 giây giải tỏa căng thẳng khẩn cấp"
			>
				<span class="material-symbols-outlined text-base animate-pulse">spa</span>
				<span class="tracking-tight">Thở 5s</span>
			</button>
		</header>

		<!-- Floating Usage Hint (Positioned at bottom above navigation so it NEVER obstructs main text) -->
		{#if showUsageHint}
			<div
				class="absolute bottom-18 left-4 right-4 z-40 bg-primary/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 border border-white/20 fade-in transition-all duration-500"
			>
				<div class="flex items-center gap-2 text-xs">
					<span class="material-symbols-outlined text-base text-warm-cream animate-bounce">swipe</span>
					<span><strong>Mẹo:</strong> Vuốt sang trái/phải 👈 👉 để chuyển màn hình, hoặc chạm thanh bên dưới.</span>
				</div>
				<button
					type="button"
					onclick={() => (showUsageHint = false)}
					class="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
					aria-label="Đóng hướng dẫn"
				>
					<span class="material-symbols-outlined text-sm">close</span>
				</button>
			</div>
		{/if}

		<!-- Screen Slider System (2 Slides: Home & Folders) -->
		<div class="flex-1 w-full h-[calc(100dvh-4rem)] overflow-hidden">
			<ScreenSlider {activeSlide} onSlideChange={handleSlideChange}>
				{#snippet children()}
					<!-- SLIDE 0: CLEAN SPACIOUS HERO (LANDING) -->
					<div class="w-full shrink-0 h-full overflow-y-auto px-4 py-12 flex flex-col items-center text-center space-y-6 pb-20">
						<!-- Content positioned slightly higher for optimal ergonomics -->
						<div class="w-full max-w-sm flex flex-col items-center space-y-4 pt-12 sm:pt-6">
							<h1 class="text-2xl sm:text-3xl font-extrabold text-primary leading-tight">
								{m.home_hero_title()}
							</h1>

							<p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed px-2">
								{m.home_hero_desc()}
							</p>

							<!-- Main Central Search Bar -->
							<div class="w-full pt-2">
								<SearchBar initialQuery="" />
							</div>
						</div>
					</div>

					<!-- SLIDE 1: 4 FOLDERS KNOWLEDGE HUB -->
					<div class="w-full shrink-0 h-full flex flex-col">
						<FolderExplorer
							initialFolderId={activeFolder}
							initialSubfolderId={activeSubfolder}
							onNavigate={handleFolderNavigation}
						/>
					</div>
				{/snippet}
			</ScreenSlider>
		</div>
	</div>
</div>

<!-- Square Breathing 5s Modal -->
<SquareBreathingModal isOpen={isBreathingOpen} onClose={closeBreathing} />
