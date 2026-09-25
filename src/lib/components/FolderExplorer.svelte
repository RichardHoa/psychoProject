<script>
	import BreadcrumbBar from '$lib/components/BreadcrumbBar.svelte';
	import WiredCard from '$lib/components/wired/WiredCard.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * The 4-topic hub: every card is a real link to that topic's page.
	 * @type {{ folders: import('$lib/server/content.js').FolderSummary[] }}
	 */
	let { folders } = $props();

	const breadcrumbs = [{ id: 'root', label: m.breadcrumb_root(), icon: 'folder_open' }];

	// Hand-drawn color palette configs for folder cards
	const FOLDER_THEMES = [
		{ fill: '#EAF2EC', stroke: '#242B28', tilt: -0.6, iconBg: '#D8E8DC' }, // Bảo mật - Sage
		{ fill: '#FDF2F0', stroke: '#242B28', tilt: 0.5, iconBg: '#F8DFDB' }, // Thân chủ - Terracotta
		{ fill: '#FEF7E6', stroke: '#242B28', tilt: -0.4, iconBg: '#FCEBC6' }, // Nhà tham vấn - Soft Amber
		{ fill: '#F5EFE6', stroke: '#242B28', tilt: 0.6, iconBg: '#E9DFCFA' }, // Quyền thân chủ - Linen
		{ fill: '#FCFBF9', stroke: '#242B28', tilt: 0.0, iconBg: '#EFEAE0' } // Danh bạ - Paper
	];
</script>

<div
	class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-text-main select-none"
>
	<!-- Sticky Hand-Drawn Breadcrumb Bar -->
	<BreadcrumbBar crumbs={breadcrumbs} />

	<!-- Inner Content Area -->
	<div class="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-20">
		<!-- LEVEL 0: ROOT 4 FOLDERS VIEW (WIRED.JS HAND-DRAWN 2x2 GRID) -->
		<div class="fade-in space-y-4">
			<!-- Header Section: Hand-drawn sketched title -->
			<div class="px-2 pt-1 pb-1 text-center">
				<h2 class="text-xl font-black tracking-tight text-text-main sm:text-2xl">
					{m.folder_explore_title()}
				</h2>
				<div class="mx-auto my-1 max-w-[120px]">
					<WiredDivider stroke="#1F523D" strokeWidth={1.5} roughness={1.5} />
				</div>
			</div>

			<!-- Hand-Drawn 4 Core Folders: Clean 2x2 Grid -->
			<div class="grid grid-cols-2 gap-3.5 pt-1">
				{#each folders as folder, idx (folder.id)}
					{@const theme = FOLDER_THEMES[idx] || FOLDER_THEMES[0]}
					<WiredCard
						as="a"
						href="/trang-chu/{folder.id}"
						fill={theme.fill}
						stroke={theme.stroke}
						tilt={theme.tilt}
						roughness={1.2}
						shape={folder.wide ? 'banner' : 'square'}
						seed={idx + 1}
						class="flex flex-col items-center justify-center p-3.5 text-center transition-transform hover:-translate-y-0.5 {folder.wide
							? 'col-span-2 min-h-[96px] sm:min-h-[105px]'
							: 'min-h-[140px] sm:min-h-[155px]'}"
					>
						{#if folder.wide}
							<div class="flex w-full items-center justify-start gap-3.5 px-2">
								<div
									class="border-1.5 border-sketch-border flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs"
								>
									<RoughIcon name={folder.icon} size={24} stroke="#1F523D" strokeWidth={1.8} />
								</div>
								<div class="min-w-0 flex-1 text-left">
									<h3 class="text-sm leading-snug font-black text-text-main sm:text-base">
										{folder.shortTitle || folder.title}
									</h3>
									<p class="mt-0.5 line-clamp-1 text-xs text-text-subtle">
										{folder.summary}
									</p>
								</div>
							</div>
						{:else}
							<!-- Discrete 1 Text + 1 Visualization per Box -->
							<div class="flex w-full flex-col items-center justify-center space-y-2.5 py-1">
								<!-- Focal Hand-Drawn Icon Graphic -->
								<div
									class="border-1.5 border-sketch-border flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs transition-transform group-hover:scale-105 sm:h-13 sm:w-13"
								>
									<RoughIcon name={folder.icon} size={28} stroke="#1F523D" strokeWidth={1.8} />
								</div>

								<!-- Single Clean Text Title -->
								<h3
									class="line-clamp-2 px-1 text-sm leading-snug font-extrabold text-text-main sm:text-base"
								>
									{folder.shortTitle || folder.title}
								</h3>
							</div>
						{/if}
					</WiredCard>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
