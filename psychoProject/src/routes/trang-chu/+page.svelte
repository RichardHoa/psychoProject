<script>
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let queryParam = $derived(page.url.searchParams.get('q') || '');
</script>

<svelte:head>
	<title>{m.home_title()}</title>
</svelte:head>

<div class="bg-background text-text-main font-body min-h-screen flex flex-col">
	<Navbar />

	<!-- Main Content Canvas -->
	<main class="flex-grow flex flex-col items-center px-gutter max-w-container-max mx-auto w-full py-12 relative">
		<!-- Ambient Background Glow -->
		<div class="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex justify-center items-center">
			<div class="w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px]"></div>
		</div>

		<div class="w-full max-w-3xl flex flex-col items-center gap-10 relative z-10">
			<!-- Mascot and Greeting -->
			<div class="flex flex-col items-center gap-4 text-center">
				<img
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYphiHuVC71sLYlI0IH98oh2rCHXuzGuyKRcz6C168PAczXwjaAxDue9ncmKTRJApY3zRwUluSZpmQrWds4IyvYVhmt4duTvLtSeA_d-OgDAtVewfVjv-qhA_Deg-UDG8607LFI2jiad3njp03OiMVAy5-gZ1CoTbMpd9DHtE6CLFSMXzVQlJL2Jv3kvRmsbxvnTMXSyNz92wIrroPWaV0d6-54aeXzTK2RzG-6fL1KyMabbxKLoj-afKj22045PQ9I5o"
					alt="Mèo Mascot"
					class="w-full max-w-[420px] h-auto object-contain drop-shadow-lg"
				/>

				<h1 class="text-3xl md:text-4xl font-extrabold text-primary">
					{m.home_hero_title()}
				</h1>
				<p class="text-lg text-on-surface-variant max-w-xl leading-relaxed">
					{m.home_hero_desc()}
				</p>
			</div>

			<!-- Search Bar -->
			<SearchBar initialQuery={queryParam} />
		</div>
	</main>

	<!-- Information Map Section -->
	<section
		id="ban-do-thong-tin"
		class="bg-[#f2f7f4] py-16 px-gutter w-full overflow-hidden border-t border-surface-variant"
	>
		<div class="max-w-container-max mx-auto">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-3">
					{m.home_map_title()}
				</h2>
				<p class="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto">
					{m.home_map_desc()}
				</p>
			</div>

			<!-- Map Graphic Container -->
			<div
				class="relative w-full max-w-3xl mx-auto h-[420px] sm:h-[460px] flex items-center justify-center"
			>
				<!-- SVG Dashed Arc Lines connecting nodes -->
				<svg
					class="absolute inset-0 w-full h-full pointer-events-none z-0"
					viewBox="0 0 600 450"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<!-- Arc 1: Left Node (Thân chủ) to Top Node (Bảo mật) -->
					<path
						d="M 84 360 Q 80 130 270 72"
						stroke="#94b2a1"
						stroke-width="1.8"
						stroke-dasharray="4 4"
						stroke-linecap="round"
					/>
					<!-- Arc 2: Top Node (Bảo mật) to Right Node (Quyền thân chủ) -->
					<path
						d="M 270 72 Q 440 85 486 234"
						stroke="#94b2a1"
						stroke-width="1.8"
						stroke-dasharray="4 4"
						stroke-linecap="round"
					/>
					<!-- Arc 3: Center-Bottom Node (Nhà tham vấn) to Right Node (Quyền thân chủ) -->
					<path
						d="M 270 315 Q 400 360 486 234"
						stroke="#94b2a1"
						stroke-width="1.8"
						stroke-dasharray="4 4"
						stroke-linecap="round"
					/>
					<!-- Arc 4: Left Node (Thân chủ) to Center-Bottom Node (Nhà tham vấn) -->
					<path
						d="M 84 360 Q 170 325 270 315"
						stroke="#94b2a1"
						stroke-width="1.8"
						stroke-dasharray="4 4"
						stroke-linecap="round"
					/>
				</svg>

				<!-- Map Grid Nodes -->
				<div class="relative w-full h-full z-10">
					<!-- Top Node: Phân biệt về bảo mật -->
					<a
						href="/bao-mat"
						class="absolute top-[16.0%] left-[45.0%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#dbe8e1] hover:bg-[#cbe0d3] border border-[#b8cbbd] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-2 text-center group cursor-pointer"
					>
						<span class="material-symbols-outlined text-primary text-xl sm:text-2xl mb-0.5">lock</span>
						<span
							class="font-bold text-on-surface text-[11px] sm:text-xs leading-snug group-hover:text-primary transition-colors"
						>
							Phân biệt về<br />bảo mật
						</span>
					</a>

					<!-- Left Node: Thân chủ – Client -->
					<a
						href="/than-chu"
						class="absolute top-[80.0%] left-[14.0%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#dbe8e1] hover:bg-[#cbe0d3] border border-[#b8cbbd] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-2 text-center group cursor-pointer"
					>
						<span class="material-symbols-outlined text-primary text-xl sm:text-2xl mb-0.5">person</span>
						<span
							class="font-bold text-on-surface text-[11px] sm:text-xs leading-snug group-hover:text-primary transition-colors"
						>
							Thân chủ –<br />Client
						</span>
					</a>

					<!-- Center-Bottom Node: Nhà tham vấn làm gì? -->
					<a
						href="/nha-tham-van"
						class="absolute top-[70.0%] left-[45.0%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#dbe8e1] hover:bg-[#cbe0d3] border border-[#b8cbbd] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-2 text-center group cursor-pointer"
					>
						<span class="material-symbols-outlined text-primary text-xl sm:text-2xl mb-0.5">psychology</span>
						<span
							class="font-bold text-on-surface text-[11px] sm:text-xs leading-snug group-hover:text-primary transition-colors"
						>
							Nhà tham vấn<br />làm gì?
						</span>
					</a>

					<!-- Right Node: Quyền của thân chủ -->
					<a
						href="/quyen-than-chu"
						class="absolute top-[52.0%] left-[81.0%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#dbe8e1] hover:bg-[#cbe0d3] border border-[#b8cbbd] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-2 text-center group cursor-pointer"
					>
						<span class="material-symbols-outlined text-primary text-xl sm:text-2xl mb-0.5">gavel</span>
						<span
							class="font-bold text-on-surface text-[11px] sm:text-xs leading-snug group-hover:text-primary transition-colors"
						>
							Quyền của thân<br />chủ
						</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<Footer />
</div>
