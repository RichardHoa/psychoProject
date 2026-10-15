<script>
	import CatMascot from '$lib/components/CatMascot.svelte';
	import WiredCard from '$lib/components/wired/WiredCard.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { happyWaving } from '$lib/assets/cat/index.js';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * The guided journey: "where are you?" shortcuts, then every step in reading order. Each step
	 * card is a real link to that step's page.
	 * @type {{ folders: import('$lib/server/content.js').FolderSummary[] }}
	 */
	let { folders } = $props();

	// Start where the visitor is instead of always at step 1.
	const ENTRIES = [
		{ label: m.journey_entry_considering(), stepId: 'than-chu' },
		{ label: m.journey_entry_finding(), stepId: 'ai-giup-ban' },
		{ label: m.journey_entry_in_therapy(), stepId: 'quyen-than-chu' }
	];
</script>

<div
	class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-text-main select-none"
>
	<div class="no-scrollbar fade-in flex-1 overflow-y-auto px-5 pt-6 pb-20">
		<header class="space-y-2 text-center">
			<h2 class="text-xl font-black tracking-tight text-balance sm:text-2xl">
				{m.journey_title()}
			</h2>
			<div class="mx-auto max-w-[120px]">
				<WiredDivider stroke="#1F523D" strokeWidth={1.5} roughness={1.5} />
			</div>
			<p class="text-sm leading-relaxed text-text-subtle">{m.journey_desc()}</p>
		</header>

		<!-- 1. WHERE ARE YOU? -->
		<section class="mt-7 space-y-3" aria-labelledby="journey-entry">
			<div class="flex items-center gap-2">
				<CatMascot autoplay={false} restImg={happyWaving} sizeClass="h-12 w-12" sizes="36px" />
				<h3 id="journey-entry" class="text-base font-black">{m.journey_entry_title()}</h3>
			</div>
			<ul class="space-y-2.5">
				{#each ENTRIES as entry, i (entry.stepId)}
					<li>
						<WiredButton
							href="/trang-chu/{entry.stepId}"
							shape="bar"
							fill="#FFFFFF"
							seed={i + 5}
							class="min-h-11 w-full px-4 py-2.5"
						>
							<span class="text-sm">{entry.label}</span>
							<RoughIcon name="arrow_forward" size={16} stroke="#1F523D" strokeWidth={1.8} />
						</WiredButton>
					</li>
				{/each}
			</ul>
		</section>

		<!-- 2. THE PATH, STEP BY STEP -->
		<section class="mt-9" aria-labelledby="journey-steps">
			<h3 id="journey-steps" class="text-base font-black">{m.journey_steps_title()}</h3>

			<ol class="relative mt-4 space-y-3.5">
				<!-- Hand-drawn feel for the path that joins the step numbers. -->
				<span
					class="absolute top-8 bottom-8 left-[1.3rem] border-l-2 border-dashed border-primary/30"
					aria-hidden="true"
				></span>

				{#each folders as folder, idx (folder.id)}
					{@const chapterStart = folder.chapter && folder.chapter !== folders[idx - 1]?.chapter}
					<li class="relative">
						{#if chapterStart}
							<p class="mb-2 ml-14 text-[11px] font-black tracking-wider text-tertiary uppercase">
								{folder.chapter}
							</p>
						{/if}
						<div class="flex items-start gap-3">
							<span
								class="relative z-10 mt-3 flex size-[2.6rem] shrink-0 items-center justify-center rounded-full bg-background text-lg font-black text-primary ring-2 ring-primary/60"
								aria-hidden="true">{folder.step}</span
							>
							<WiredCard
								as="a"
								href="/trang-chu/{folder.id}"
								fill={folder.chapter ? '#FEF7E6' : '#FFFFFF'}
								roughness={1.1}
								seed={folder.step}
								class="min-w-0 flex-1 px-4 py-3"
							>
								<span class="sr-only">{m.journey_step({ step: folder.step })}:</span>
								<span class="flex items-center gap-2">
									<span class="min-w-0 flex-1">
										<span class="block text-base leading-snug font-black text-text-main">
											{folder.shortTitle}
										</span>
										<span class="mt-0.5 line-clamp-2 block text-sm leading-snug text-text-subtle">
											{folder.summary}
										</span>
									</span>
									<RoughIcon name="arrow_forward" size={16} stroke="#5A6561" strokeWidth={1.8} />
								</span>
							</WiredCard>
						</div>
					</li>
				{/each}
			</ol>
		</section>
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
