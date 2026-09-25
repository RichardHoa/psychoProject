<script>
	import WiredCard from '$lib/components/wired/WiredCard.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * @typedef {NonNullable<ReturnType<typeof import('$lib/server/content.js').getFolder>>} FolderPage
	 */

	/**
	 * Sections and items carry `id`s, so `/trang-chu/<folder>#<section>` or `#<item anchor>`
	 * (used by search results) scrolls straight to them and highlights them via `:target`.
	 * @type {{
	 *   folder: FolderPage['folder'],
	 *   nextFolder: FolderPage['nextFolder'],
	 *   backHref: string
	 * }}
	 */
	let { folder, nextFolder, backHref } = $props();
</script>

<div
	class="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-background font-body text-text-main select-none"
>
	<!-- SCROLLABLE CONTINUOUS READING DOCUMENT (PURE CALM EDITORIAL FLOW) -->
	<div
		class="no-scrollbar folder-unfold-container flex-1 space-y-6 overflow-y-auto px-4 py-4 pb-24"
	>
		<!-- 1. FOLDER HEADER & OVERVIEW BANNER -->
		<section class="space-y-3">
			<WiredCard
				fill="#FAF8F5"
				stroke="#242B28"
				roughness={1.0}
				tilt={-0.3}
				class="rounded-2xl p-4 shadow-xs sm:p-5"
			>
				<div class="space-y-1.5">
					{#if folder.category}
						<p class="text-[11px] font-bold tracking-wider text-text-subtle uppercase">
							{folder.category}
						</p>
					{/if}
					<h1 class="text-xl leading-tight font-black tracking-tight text-text-main sm:text-2xl">
						{folder.title}
					</h1>

					{#if folder.summary}
						<p class="pt-1 text-xs leading-relaxed font-normal text-text-main/90 sm:text-sm">
							{folder.summary}
						</p>
					{/if}
				</div>
			</WiredCard>
		</section>

		<!-- 2. SEQUENTIAL SUBFOLDERS & ALL ITEMS (CLEAN EDITORIAL FLOW) -->
		{#each folder.subfolders as subfolder (subfolder.id)}
			<section id={subfolder.id} class="anchor-target space-y-3">
				<!-- Section Sub-heading (Clean Chapter Header) -->
				<div class="px-1 pt-2">
					<h2 class="text-base leading-snug font-black tracking-tight text-text-main sm:text-lg">
						{subfolder.title}
					</h2>
					{#if subfolder.desc}
						<p class="mt-0.5 text-xs leading-relaxed text-text-subtle">
							{subfolder.desc}
						</p>
					{/if}
				</div>

				<div class="max-w-[80px] px-1">
					<WiredDivider stroke="#1F523D" strokeWidth={1.2} roughness={1.0} />
				</div>

				<!-- All Items in this Subfolder (Pure Typography, No Clutter/Tags/Icon Walls) -->
				<div class="space-y-3 pt-1">
					{#each subfolder.items as item (item.anchor)}
						<div id={item.anchor} class="anchor-target">
							<WiredCard
								seed={item.anchor.length}
								fill={item.isAlert ? '#FFF7F6' : '#FFFFFF'}
								stroke={item.isAlert ? '#D9534F' : '#242B28'}
								roughness={1.0}
								tilt={0}
								class="rounded-xl p-4 shadow-2xs transition-all hover:shadow-xs sm:p-5"
							>
								<div class="w-full space-y-1.5 text-left">
									<h3
										class="text-sm leading-snug font-black sm:text-base {item.isAlert
											? 'text-emergency-red'
											: 'text-text-main'}"
									>
										{item.title}
									</h3>

									{#if item.content}
										<p class="text-xs leading-relaxed font-normal text-text-main/90 sm:text-sm">
											{item.content}
										</p>
									{/if}

									{#if item.link}
										<div class="pt-2">
											<a
												href={item.link}
												target="_blank"
												rel="noopener noreferrer"
												class="sketch-button inline-flex items-center gap-1.5 rounded-xl bg-warm-sage px-3 py-1.5 text-xs font-black text-primary transition-colors hover:bg-primary hover:text-white"
											>
												<span>{m.folder_open_link()}</span>
												<RoughIcon
													name="open_in_new"
													size={13}
													stroke="currentColor"
													strokeWidth={2}
												/>
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
		<div class="space-y-4 pt-4">
			<div class="flex flex-col items-center justify-center space-y-1.5 py-2 text-center">
				<p class="text-xs font-semibold text-text-subtle">
					{m.folder_end()} <strong>{folder.shortTitle || folder.title}</strong>
				</p>
			</div>

			<div class="flex flex-col items-center gap-3 pt-1 sm:flex-row">
				<WiredButton
					href={backHref}
					shape="bar"
					fill="#FFFFFF"
					class="w-full py-2.5 text-xs sm:flex-1 sm:text-sm"
				>
					<RoughIcon name="arrow_back" size={16} stroke="#242B28" strokeWidth={1.8} />
					<span>{m.folder_back_to_hub()}</span>
				</WiredButton>

				{#if nextFolder}
					<WiredButton
						href="/trang-chu/{nextFolder.id}"
						shape="bar"
						seed={2}
						fill="#EAF2EC"
						class="w-full py-2.5 text-xs sm:flex-1 sm:text-sm"
					>
						<span class="font-black text-primary"
							>{m.folder_next()} {nextFolder.shortTitle || nextFolder.title}</span
						>
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

	@media (prefers-reduced-motion: reduce) {
		.folder-unfold-container {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
