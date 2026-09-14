<script>
	import { FOLDERS_DATA } from '$lib/data/folderData.js';
	import BreadcrumbBar from '$lib/components/BreadcrumbBar.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * @type {{
	 *   initialFolderId?: string | null,
	 *   initialSubfolderId?: string | null,
	 *   onNavigate?: (folderId: string | null, subfolderId: string | null) => void
	 * }}
	 */
	let { initialFolderId = null, initialSubfolderId = null, onNavigate } = $props();

	let activeFolderId = $state(/** @type {string | null} */ (null));
	let activeSubfolderId = $state(/** @type {string | null} */ (null));
	let filterQuery = $state('');

	// Sync when props change
	$effect(() => {
		activeFolderId = initialFolderId ?? null;
		activeSubfolderId = initialSubfolderId ?? null;
	});

	let currentFolder = $derived(
		FOLDERS_DATA.find((f) => f.id === activeFolderId) || null
	);

	let currentSubfolder = $derived(
		currentFolder?.subfolders.find((s) => s.id === activeSubfolderId) || null
	);

	/** @param {string} folderId */
	function selectFolder(folderId) {
		activeFolderId = folderId;
		activeSubfolderId = null;
		filterQuery = '';
		onNavigate?.(activeFolderId, null);
	}

	/** @param {string} subfolderId */
	function selectSubfolder(subfolderId) {
		activeSubfolderId = subfolderId;
		filterQuery = '';
		onNavigate?.(activeFolderId, activeSubfolderId);
	}

	function goBack() {
		if (activeSubfolderId) {
			activeSubfolderId = null;
			onNavigate?.(activeFolderId, null);
		} else if (activeFolderId) {
			activeFolderId = null;
			onNavigate?.(null, null);
		}
	}

	function resetToRoot() {
		activeFolderId = null;
		activeSubfolderId = null;
		onNavigate?.(null, null);
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
				onClick: () => {
					activeSubfolderId = null;
					onNavigate?.(currentFolder.id, null);
				}
			});
		}

		if (currentSubfolder) {
			list.push({
				id: currentSubfolder.id,
				label: currentSubfolder.title,
				icon: currentSubfolder.icon,
				onClick: () => {}
			});
		}

		return list;
	});

	// Filtered items when searching within a subfolder
	let filteredItems = $derived.by(() => {
		if (!currentSubfolder) return [];
		if (!filterQuery.trim()) return currentSubfolder.items;
		const q = filterQuery.toLowerCase();
		return currentSubfolder.items.filter(
			(item) => item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)
		);
	});
</script>

<div class="w-full flex flex-col h-full bg-background relative overflow-hidden font-body">
	<!-- Sticky Breadcrumb Bar (Depth >= 1 or Root) -->
	<BreadcrumbBar crumbs={breadcrumbs} onBack={activeFolderId ? goBack : undefined} />

	<!-- Inner Scrollable Content Area -->
	<div class="flex-1 overflow-y-auto px-3.5 sm:px-4 py-3 sm:py-4 space-y-4 pb-20 no-scrollbar">
		<!-- LEVEL 0: ROOT 4 FOLDERS VIEW (STRICT 2x2 GRID) -->
		{#if !currentFolder}
			<div class="space-y-3.5 fade-in">
				<!-- Header Section -->
				<div class="text-center px-2 py-0.5">
					<div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
						<span class="material-symbols-outlined text-xs">folder_special</span>
						<span>4 Thư mục cốt lõi</span>
					</div>
					<h2 class="text-lg sm:text-xl font-extrabold text-primary mt-1.5">
						{m.folder_explore_title()}
					</h2>
					<p class="text-xs text-on-surface-variant max-w-xs mx-auto mt-0.5 leading-relaxed line-clamp-1">
						Chạm vào thư mục để khám phá chi tiết
					</p>
				</div>

				<!-- 4 Tactile Folders: Strict 2x2 Grid (2 Folders Per Row) -->
				<div class="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
					{#each FOLDERS_DATA as folder (folder.id)}
						<button
							type="button"
							onclick={() => selectFolder(folder.id)}
							class="group relative text-left bg-surface-off-white hover:bg-surface-container-low rounded-2xl p-3 sm:p-3.5 border border-surface-variant/90 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97] cursor-pointer flex flex-col justify-between overflow-hidden min-h-[160px] sm:min-h-[175px]"
						>
							<!-- Tactile Folder Top Tab Accent -->
							<div class="absolute top-0 left-3 w-12 h-1 rounded-b-full bg-primary/40 group-hover:bg-primary transition-colors"></div>

							<!-- Folder Icon & Badge -->
							<div>
								<div class="flex items-start justify-between gap-1 mb-2.5">
									<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border {folder.accentColor} transition-transform group-hover:scale-105 shadow-xs">
										<span class="material-symbols-outlined text-xl sm:text-2xl">{folder.icon}</span>
									</div>
									<span class="text-[10px] font-bold px-2 py-0.5 rounded-full {folder.badgeColor} shrink-0">
										{folder.subfolders.length} mục
									</span>
								</div>

								<!-- Folder Title -->
								<h3 class="font-bold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors leading-tight">
									{folder.shortTitle || folder.title}
								</h3>
								<p class="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
									{folder.summary}
								</p>
							</div>

							<!-- Visual Highlights Tags -->
							<div class="mt-2.5 pt-2 border-t border-surface-variant/60">
								<div class="flex flex-wrap gap-1">
									{#each (folder.highlights || []).slice(0, 2) as tag}
										<span class="text-[9.5px] font-medium px-1.5 py-0.5 rounded-md bg-surface-container-high/60 text-on-surface-variant">
											#{tag}
										</span>
									{/each}
								</div>
								<div class="flex items-center justify-between mt-1.5 text-[11px] font-bold text-primary">
									<span>Mở xem</span>
									<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>

		<!-- LEVEL 1: SUBFOLDERS LIST VIEW (VISUAL INFOGRAPHIC TOPICS) -->
		{:else if currentFolder && !currentSubfolder}
			<div class="space-y-3.5 fade-in">
				<!-- Folder Header Visual Card -->
				<div class="p-3.5 sm:p-4 rounded-2xl border {currentFolder.accentColor} flex items-center justify-between gap-3 shadow-xs">
					<div class="flex items-center gap-3">
						<div class="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-xs border border-primary/20">
							<span class="material-symbols-outlined text-2xl text-primary">{currentFolder.icon}</span>
						</div>
						<div>
							<span class="text-[10px] font-bold px-2 py-0.5 rounded-full {currentFolder.badgeColor}">
								{currentFolder.shortTitle || currentFolder.title}
							</span>
							<h2 class="text-base sm:text-lg font-extrabold text-on-surface mt-0.5 leading-tight">
								{currentFolder.title}
							</h2>
						</div>
					</div>
					<button
						type="button"
						onclick={goBack}
						class="shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-white text-primary border border-primary/20 cursor-pointer flex items-center gap-1 shadow-xs"
					>
						<span class="material-symbols-outlined text-sm">arrow_back</span>
						<span>Trở lại</span>
					</button>
				</div>

				<!-- Subfolders Visual Grid / List -->
				<div class="space-y-2">
					<div class="flex items-center justify-between px-1">
						<h3 class="text-[11px] font-bold uppercase tracking-wider text-outline">
							Chọn chủ đề cần xem
						</h3>
						<span class="text-[10px] text-outline">{currentFolder.subfolders.length} danh mục</span>
					</div>

					<div class="space-y-2.5">
						{#each currentFolder.subfolders as subfolder (subfolder.id)}
							<button
								type="button"
								onclick={() => selectSubfolder(subfolder.id)}
								class="w-full text-left bg-surface-off-white hover:bg-surface-container-low rounded-2xl p-3.5 border border-surface-variant hover:border-primary/40 shadow-xs hover:shadow-sm transition-all active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer group"
							>
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
										<span class="material-symbols-outlined text-xl">{subfolder.icon}</span>
									</div>
									<div>
										<div class="flex items-center gap-1.5">
											<h4 class="font-bold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors">
												{subfolder.title}
											</h4>
											<span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
												{subfolder.items.length} thẻ
											</span>
										</div>
										<p class="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
											{subfolder.desc}
										</p>
									</div>
								</div>
								<span class="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
							</button>
						{/each}
					</div>
				</div>
			</div>

		<!-- LEVEL 2: DEEP TOPIC READING CARDS (VISUAL INFOGRAPHIC CARDS - LESS WORDS, HIGH VISUALIZATION) -->
		{:else if currentFolder && currentSubfolder}
			<div class="space-y-3 fade-in">
				<!-- Subfolder Header Banner -->
				<div class="p-3 bg-surface-off-white rounded-xl border border-surface-variant shadow-xs flex items-center justify-between gap-2.5">
					<div class="flex items-center gap-2.5">
						<div class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-xl">{currentSubfolder.icon}</span>
						</div>
						<div>
							<h2 class="font-bold text-sm sm:text-base text-on-surface leading-tight">
								{currentSubfolder.title}
							</h2>
							<p class="text-[11px] text-on-surface-variant line-clamp-1">
								{currentSubfolder.desc}
							</p>
						</div>
					</div>
					<button
						type="button"
						onclick={goBack}
						class="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary border border-surface-variant cursor-pointer flex items-center gap-1"
					>
						<span class="material-symbols-outlined text-xs">arrow_back</span>
						<span>{m.btn_back()}</span>
					</button>
				</div>

				<!-- Quick Filter Search Input -->
				{#if currentSubfolder.items.length > 4}
					<div class="relative">
						<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">search</span>
						<input
							type="text"
							bind:value={filterQuery}
							placeholder="Lọc nhanh thẻ nội dung..."
							class="w-full bg-surface-off-white border border-surface-variant rounded-xl pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-hidden focus:border-primary transition-colors"
						/>
					</div>
				{/if}

				<!-- Visual Infographic Cards Grid / List -->
				<div class="space-y-2.5">
					{#each filteredItems as item, idx (item.title)}
						<div
							class="p-3 sm:p-3.5 rounded-2xl border transition-all shadow-xs {item.isAlert
								? 'bg-error-container/20 border-emergency-red/40'
								: 'bg-surface-off-white hover:bg-surface-container-low/40 border-surface-variant'}"
						>
							<div class="flex items-start gap-3">
								<!-- Visual Icon Emblem -->
								<div
									class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-xs {item.isAlert
										? 'bg-emergency-red text-white'
										: 'bg-primary/10 text-primary border border-primary/20'}"
								>
									{#if item.icon}
										<span class="material-symbols-outlined text-lg sm:text-xl">{item.icon}</span>
									{:else}
										<span class="font-extrabold text-xs">{idx + 1}</span>
									{/if}
								</div>

								<!-- Content Body -->
								<div class="space-y-1 flex-1">
									<div class="flex items-center justify-between gap-1 flex-wrap">
										<h4
											class="font-bold text-xs sm:text-sm {item.isAlert
												? 'text-emergency-red'
												: 'text-on-surface'}"
										>
											{item.title}
										</h4>
										{#if item.tag}
											<span
												class="text-[10px] font-bold px-2 py-0.5 rounded-full {item.isAlert
													? 'bg-emergency-red/20 text-emergency-red'
													: 'bg-primary/10 text-primary'}"
											>
												{item.tag}
											</span>
										{/if}
									</div>

									<p class="text-xs text-on-surface-variant leading-relaxed">
										{item.content}
									</p>
								</div>
							</div>
						</div>
					{/each}

					{#if filteredItems.length === 0}
						<div class="text-center py-8 text-on-surface-variant text-xs">
							Không tìm thấy kết quả phù hợp với "{filterQuery}".
						</div>
					{/if}
				</div>
			</div>
		{/if}
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
