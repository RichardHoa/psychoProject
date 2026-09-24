<script>
	import { FOLDERS_DATA } from '$lib/data/folderData.js';
	import BreadcrumbBar from '$lib/components/BreadcrumbBar.svelte';
	import WiredCard from '$lib/components/wired/WiredCard.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import FolderReader from '$lib/components/FolderReader.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { createSwipeHandlers } from '$lib/gestures/createSwipeHandlers.js';

	/**
	 * @type {{
	 *   nav: import('$lib/nav/folderNav.svelte.js').FolderNav,
	 *   onAfterNavigate?: () => void
	 * }}
	 */
	let { nav, onAfterNavigate } = $props();

	let currentFolder = $derived(
		FOLDERS_DATA.find((f) => f.id === nav.folderId) || null
	);

	let currentSubfolder = $derived(
		currentFolder?.subfolders.find((s) => s.id === nav.subfolderId) || null
	);

	/** @param {string} folderId */
	function selectFolder(folderId) {
		nav.selectFolder(folderId);
		onAfterNavigate?.();
	}

	/** @param {string} subfolderId */
	function selectSubfolder(subfolderId) {
		nav.selectSubfolder(subfolderId);
		onAfterNavigate?.();
	}

	function goBack() {
		if (typeof window !== 'undefined') {
			window.history.back();
		}
	}

	function resetToRoot() {
		nav.goToRoot();
		onAfterNavigate?.();
	}

	let breadcrumbs = $derived.by(() => {
		/** @type {Array<{ id: string, label: string, icon?: string, onClick?: () => void }>} */
		const list = [
			{
				id: 'root',
				label: m.breadcrumb_root(),
				icon: 'folder_open',
				onClick: resetToRoot
			}
		];

		if (currentFolder) {
			list.push({
				id: currentFolder.id,
				label: currentFolder.shortTitle || currentFolder.title,
				icon: currentFolder.icon,
				onClick: () => {}
			});
		}

		return list;
	});

	const swipe = createSwipeHandlers({
		threshold: 75,
		axisRatio: 1.5,
		onSwipe: (direction) => {
			// Swipe Right on edge -> Go back
			if (direction === 'right' && nav.folderId) goBack();
		}
	});

	// Hand-drawn color palette configs for folder cards
	const FOLDER_THEMES = [
		{ fill: '#EAF2EC', stroke: '#242B28', tilt: -0.6, iconBg: '#D8E8DC' }, // Bảo mật - Sage
		{ fill: '#FDF2F0', stroke: '#242B28', tilt: 0.5, iconBg: '#F8DFDB' },  // Thân chủ - Terracotta
		{ fill: '#FEF7E6', stroke: '#242B28', tilt: -0.4, iconBg: '#FCEBC6' }, // Nhà tham vấn - Soft Amber
		{ fill: '#F5EFE6', stroke: '#242B28', tilt: 0.6, iconBg: '#E9DFCFA' },  // Quyền thân chủ - Linen
		{ fill: '#FCFBF9', stroke: '#242B28', tilt: 0.0, iconBg: '#EFEAE0' }   // Danh bạ - Paper
	];
</script>

<div
	role="region"
	aria-label="Khám phá thư mục"
	class="w-full flex flex-col h-full bg-background relative overflow-hidden font-body text-text-main select-none"
	ontouchstart={swipe.handleTouchStart}
	ontouchmove={swipe.handleTouchMove}
	ontouchend={swipe.handleTouchEnd}
>
	<!-- Sticky Hand-Drawn Breadcrumb Bar -->
	<BreadcrumbBar crumbs={breadcrumbs} onBack={nav.folderId ? goBack : undefined} />

	<!-- Inner Content Area -->
	{#if !currentFolder}
		<div class="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20 no-scrollbar">
			<!-- LEVEL 0: ROOT 4 FOLDERS VIEW (WIRED.JS HAND-DRAWN 2x2 GRID) -->
			<div class="space-y-4 fade-in">
				<!-- Header Section: Hand-drawn sketched title -->
				<div class="text-center px-2 pt-1 pb-1">
					<h2 class="text-xl sm:text-2xl font-black text-text-main tracking-tight">
						{m.folder_explore_title()}
					</h2>
					<div class="max-w-[120px] mx-auto my-1">
						<WiredDivider stroke="#1F523D" strokeWidth={1.5} roughness={1.5} />
					</div>
				</div>

				<!-- Hand-Drawn 4 Core Folders: Clean 2x2 Grid -->
				<div class="grid grid-cols-2 gap-3.5 pt-1">
					{#each FOLDERS_DATA as folder, idx (folder.id)}
						{@const theme = FOLDER_THEMES[idx] || FOLDER_THEMES[0]}
						<WiredCard
							as="button"
							onclick={() => selectFolder(folder.id)}
							fill={theme.fill}
							stroke={theme.stroke}
							tilt={theme.tilt}
							roughness={1.2}
							class="p-3.5 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5 {folder.wide ? 'col-span-2 min-h-[96px] sm:min-h-[105px]' : 'min-h-[140px] sm:min-h-[155px]'}"
						>
							{#if folder.wide}
								<div class="flex items-center justify-start gap-3.5 w-full px-2">
									<div class="w-11 h-11 rounded-2xl border-1.5 border-sketch-border flex items-center justify-center shrink-0 shadow-xs bg-white">
										<RoughIcon name={folder.icon} size={24} stroke="#1F523D" strokeWidth={1.8} />
									</div>
									<div class="text-left flex-1 min-w-0">
										<h3 class="font-black text-sm sm:text-base text-text-main leading-snug">
											{folder.shortTitle || folder.title}
										</h3>
										<p class="text-xs text-text-subtle line-clamp-1 mt-0.5">
											{folder.summary}
										</p>
									</div>
								</div>
							{:else}
								<!-- Discrete 1 Text + 1 Visualization per Box -->
								<div class="flex flex-col items-center justify-center space-y-2.5 w-full py-1">
									<!-- Focal Hand-Drawn Icon Graphic -->
									<div class="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border-1.5 border-sketch-border flex items-center justify-center shadow-xs bg-white transition-transform group-hover:scale-105">
										<RoughIcon name={folder.icon} size={28} stroke="#1F523D" strokeWidth={1.8} />
									</div>

									<!-- Single Clean Text Title -->
									<h3 class="font-extrabold text-sm sm:text-base text-text-main leading-snug px-1 line-clamp-2">
										{folder.shortTitle || folder.title}
									</h3>
								</div>
							{/if}
						</WiredCard>
					{/each}
				</div>
			</div>
		</div>

	<!-- LEVEL 1: CALM DOCUMENT FOLDER READER -->
	{:else}
		<FolderReader
			folder={currentFolder}
			targetId={nav.targetId}
			targetVersion={nav.targetVersion}
			onNavigateFolder={selectFolder}
			onBack={goBack}
		/>
	{/if}
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
