<script>
	import { tick } from 'svelte';
	import WiredCard from '$lib/components/wired/WiredCard.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { FOLDERS_DATA } from '$lib/data/folderData.js';
	import { sectionAnchorId, itemAnchorId } from '$lib/search/searchIndex.js';

	/**
	 * @type {{
	 *   folder: import('$lib/data/folderData.js').Folder,
	 *   targetId?: string | null,
	 *   targetVersion?: number,
	 *   onNavigateFolder?: (folderId: string) => void,
	 *   onBack?: () => void
	 * }}
	 */
	let { folder, targetId = null, targetVersion = 0, onNavigateFolder, onBack } = $props();

	/** @type {HTMLDivElement | undefined} */
	let scrollContainer = $state();
	let highlightedId = $state(/** @type {string | null} */ (null));

	// Scroll the reader to the requested section/item (from search or a deep link),
	// or back to the top when a different folder is opened without a target.
	$effect(() => {
		const container = scrollContainer;
		const id = targetId;
		void targetVersion;
		void folder.id;
		if (!container) return;

		let cancelled = false;
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let clearTimer;

		tick().then(() => {
			if (cancelled) return;
			const el = id ? document.getElementById(id) : null;
			if (!el || !container.contains(el)) {
				container.scrollTop = 0;
				return;
			}
			const top =
				el.getBoundingClientRect().top -
				container.getBoundingClientRect().top +
				container.scrollTop -
				12;
			const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
			container.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
			highlightedId = id;
			clearTimer = setTimeout(() => (highlightedId = null), 2000);
		});

		return () => {
			cancelled = true;
			clearTimeout(clearTimer);
		};
	});

	// Calculate next folder for bottom navigation
	let nextFolder = $derived.by(() => {
		if (!folder) return null;
		const currentIndex = FOLDERS_DATA.findIndex((f) => f.id === folder.id);
		if (currentIndex >= 0 && currentIndex < FOLDERS_DATA.length - 1) {
			return FOLDERS_DATA[currentIndex + 1];
		}
		return null;
	});
</script>

<div class="w-full flex-1 flex flex-col min-h-0 bg-background font-body text-text-main overflow-hidden select-none">
	<!-- SCROLLABLE CONTINUOUS READING DOCUMENT (PURE CALM EDITORIAL FLOW) -->
	<div
		bind:this={scrollContainer}
		class="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-24 no-scrollbar folder-unfold-container"
	>
		<!-- 1. FOLDER HEADER & OVERVIEW BANNER -->
		<section class="space-y-3">
			<WiredCard
				fill="#FAF8F5"
				stroke="#242B28"
				roughness={1.0}
				tilt={-0.3}
				class="p-4 sm:p-5 rounded-2xl shadow-xs"
			>
				<div class="space-y-1.5">
					{#if folder.category}
						<p class="text-[11px] font-bold tracking-wider uppercase text-text-subtle">
							{folder.category}
						</p>
					{/if}
					<h1 class="text-xl sm:text-2xl font-black text-text-main leading-tight tracking-tight">
						{folder.title}
					</h1>

					{#if folder.summary}
						<p class="text-xs sm:text-sm text-text-main/90 leading-relaxed font-normal pt-1">
							{folder.summary}
						</p>
					{/if}
				</div>
			</WiredCard>
		</section>

		<!-- 2. SEQUENTIAL SUBFOLDERS & ALL ITEMS (CLEAN EDITORIAL FLOW) -->
		{#each folder.subfolders as subfolder (subfolder.id)}
			{@const sectionId = sectionAnchorId(subfolder.id)}
			<section class="space-y-3">
				<!-- Section Sub-heading (Clean Chapter Header) -->
				<div
					id={sectionId}
					class="pt-2 px-1 rounded-xl search-target"
					class:is-highlighted={highlightedId === sectionId}
				>
					<h2 class="text-base sm:text-lg font-black text-text-main tracking-tight leading-snug">
						{subfolder.title}
					</h2>
					{#if subfolder.desc}
						<p class="text-xs text-text-subtle mt-0.5 leading-relaxed">
							{subfolder.desc}
						</p>
					{/if}
				</div>

				<div class="max-w-[80px] px-1">
					<WiredDivider stroke="#1F523D" strokeWidth={1.2} roughness={1.0} />
				</div>

				<!-- All Items in this Subfolder (Pure Typography, No Clutter/Tags/Icon Walls) -->
				<div class="space-y-3 pt-1">
					{#each subfolder.items as item, itemIndex (item.title)}
						{@const itemId = itemAnchorId(subfolder.id, itemIndex)}
						<div
							id={itemId}
							class="rounded-xl search-target"
							class:is-highlighted={highlightedId === itemId}
						>
						<WiredCard
							fill={item.isAlert ? '#FFF7F6' : '#FFFFFF'}
							stroke={item.isAlert ? '#D9534F' : '#242B28'}
							roughness={1.0}
							tilt={0}
							class="p-4 sm:p-5 rounded-xl shadow-2xs transition-all hover:shadow-xs"
						>
							<div class="space-y-1.5 w-full text-left">
								<h3 class="font-black text-sm sm:text-base leading-snug {item.isAlert ? 'text-emergency-red' : 'text-text-main'}">
									{item.title}
								</h3>

								{#if item.content}
									<p class="text-xs sm:text-sm text-text-main/90 leading-relaxed font-normal">
										{item.content}
									</p>
								{/if}

								{#if item.link}
									<div class="pt-2">
										<a
											href={item.link}
											target="_blank"
											rel="noopener noreferrer"
											class="sketch-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-primary bg-warm-sage hover:bg-primary hover:text-white transition-colors"
										>
											<span>Mở liên kết</span>
											<span class="material-symbols-outlined text-xs">open_in_new</span>
										</a>
									</div>
								{/if}
							</div>
						</WiredCard>
						</div>
					{/each}
				</div>
			</section>
		{/each}

		<!-- 3. FOOTER SIGNIFIER & CALM NAVIGATION ACTIONS -->
		<div class="pt-4 space-y-4">
			<div class="flex flex-col items-center justify-center text-center space-y-1.5 py-2">
				<p class="text-xs font-semibold text-text-subtle">
					Đã hết nội dung chủ đề <strong>{folder.shortTitle || folder.title}</strong>
				</p>
			</div>

			<div class="flex flex-col sm:flex-row items-center gap-3 pt-1">
				<WiredButton
					onclick={onBack}
					fill="#FFFFFF"
					class="w-full sm:flex-1 py-2.5 text-xs sm:text-sm"
				>
					<RoughIcon name="arrow_back" size={16} stroke="#242B28" strokeWidth={1.8} />
					<span>Quay lại 4 chủ đề</span>
				</WiredButton>

				{#if nextFolder}
					<WiredButton
						onclick={() => onNavigateFolder?.(nextFolder.id)}
						fill="#EAF2EC"
						class="w-full sm:flex-1 py-2.5 text-xs sm:text-sm"
					>
						<span class="text-primary font-black">Chủ đề kế: {nextFolder.shortTitle || nextFolder.title}</span>
						<RoughIcon name="arrow_forward" size={16} stroke="#1F523D" strokeWidth={1.8} />
					</WiredButton>
				{/if}
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

	/* Soft Gentle Opening Animation (Calm Tech Design) */
	@keyframes calmFolderUnfold {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.folder-unfold-container {
		animation: calmFolderUnfold 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* Briefly mark the section/item a search result jumped to */
	.search-target {
		transition: box-shadow 0.4s ease;
	}
	.search-target.is-highlighted {
		box-shadow:
			0 0 0 3px var(--color-background, #faf8f5),
			0 0 0 5.5px var(--color-primary, #1f523d);
	}

	@media (prefers-reduced-motion: reduce) {
		.search-target {
			transition: none;
		}
		.folder-unfold-container {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
