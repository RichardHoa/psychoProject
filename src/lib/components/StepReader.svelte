<script>
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { readingHref } from '$lib/reading.js';
	import { stepPath } from '$lib/routes.js';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * @typedef {NonNullable<ReturnType<typeof import('$lib/server/content.js').getFolder>>} StepPage
	 * @typedef {StepPage['folder']['subfolders'][number]['items'][number]} Item
	 */

	/**
	 * One journey step as a plain reading page. Only links and buttons get hand-drawn boxes;
	 * content is typography, so nothing that can't be pressed looks pressable.
	 * Sections and items carry `id`s, so `/hanh-trinh/<step>#<section>` or `#<item anchor>`
	 * (used by search results) scrolls straight to them and highlights them via `:target`.
	 * @type {{
	 *   folder: StepPage['folder'],
	 *   step: number,
	 *   stepCount: number,
	 *   prevFolder: StepPage['prevFolder'],
	 *   nextFolder: StepPage['nextFolder'],
	 *   backHref: string,
	 *   detailed: boolean
	 * }}
	 */
	let { folder, step, stepCount, prevFolder, nextFolder, backHref, detailed } = $props();

	const sections = $derived(
		detailed ? folder.subfolders : folder.subfolders.filter((s) => !s.detailOnly)
	);
	const detailOnlySections = $derived(
		detailed ? [] : folder.subfolders.filter((s) => s.detailOnly)
	);

	/** @param {Item} item */
	function itemText(item) {
		return detailed ? (item.detail ?? item.short) : item.short;
	}
</script>

<div class="step-enter w-full bg-background px-5 pt-5 pb-24 font-body text-text-main">
	<!-- 1. WHERE YOU ARE + THE SHORT / DETAILED SWITCH -->
	<header class="space-y-3">
		<div class="flex items-center gap-3">
			<p class="text-xs font-black text-primary">
				{m.journey_step_of({ step, total: stepCount })}
			</p>
			<span class="flex gap-1" aria-hidden="true">
				{#each { length: stepCount }, i (i)}
					<span
						class="h-1.5 w-4 rounded-full {i < step
							? 'bg-primary'
							: 'bg-surface-container-highest'}"
					></span>
				{/each}
			</span>
		</div>

		{#if folder.chapter}
			<p class="text-[11px] font-bold tracking-wider text-tertiary uppercase">
				{folder.chapter}
			</p>
		{/if}

		<h1 class="text-2xl leading-tight font-black tracking-tight text-balance">
			{folder.title}
		</h1>
		<p class="text-sm leading-relaxed text-text-subtle sm:text-base">{folder.summary}</p>

		<!-- Plain links, so the switch works without JavaScript. With it, the page updates in place
		     and keeps its scroll position. -->
		<div class="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
			<nav
				aria-label={m.reader_mode_label()}
				class="sketch-pill inline-flex rounded-2xl bg-white p-1"
			>
				{#each [false, true] as isDetailedLink (isDetailedLink)}
					{@const active = detailed === isDetailedLink}
					<a
						href={readingHref(stepPath(folder.id), isDetailedLink)}
						aria-current={active ? 'true' : undefined}
						data-sveltekit-noscroll
						data-sveltekit-replacestate
						class="inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-bold transition-colors {active
							? 'bg-warm-sage text-primary'
							: 'text-text-subtle hover:text-primary'}"
					>
						{isDetailedLink ? m.reader_mode_detailed() : m.reader_mode_short()}
					</a>
				{/each}
			</nav>
			<p class="text-xs text-text-subtle">
				{detailed ? m.reader_mode_hint_detailed() : m.reader_mode_hint_short()}
			</p>
		</div>
	</header>

	<!-- 2. SECTIONS: TYPOGRAPHY ONLY, NO BOXES -->
	{#each sections as subfolder (subfolder.id)}
		{@const alert = subfolder.tone === 'alert'}
		<section id={subfolder.id} class="anchor-target mt-10 space-y-3">
			<div>
				<h2
					class="flex items-center gap-2 text-lg leading-snug font-black tracking-tight {alert
						? 'text-emergency-red'
						: 'text-text-main'}"
				>
					{#if alert}
						<RoughIcon name="warning" size={20} stroke="#D24D48" strokeWidth={1.8} />
					{/if}
					<span>{subfolder.title}</span>
				</h2>
				{#if subfolder.desc}
					<p class="mt-1 text-sm leading-relaxed text-text-subtle">{subfolder.desc}</p>
				{/if}
			</div>

			<div class="max-w-[80px]">
				<WiredDivider stroke={alert ? '#D24D48' : '#1F523D'} strokeWidth={1.2} roughness={1.0} />
			</div>

			{#if subfolder.layout === 'pillars'}
				<ul class="grid gap-x-5 gap-y-6 pt-2 {detailed ? 'grid-cols-1' : 'grid-cols-2'}">
					{#each subfolder.items as item, i (item.anchor)}
						{@const text = itemText(item)}
						<li id={item.anchor} class="anchor-target space-y-1.5">
							<div class="max-w-[44px]">
								<WiredDivider stroke="#1F523D" strokeWidth={2.4} roughness={1.4} seed={i + 3} />
							</div>
							<p class="text-base leading-snug">{item.title}</p>
							{#if text}
								<p class="text-sm leading-relaxed text-text-main/80">{text}</p>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				{@const numbered = subfolder.layout === 'steps'}
				{@const roomy = subfolder.items.some((item) => itemText(item) || item.link)}
				<svelte:element
					this={numbered ? 'ol' : 'ul'}
					class="pt-1 {roomy ? 'space-y-5' : 'space-y-3'}"
				>
					{#each subfolder.items as item, i (item.anchor)}
						{@const text = itemText(item)}
						<li id={item.anchor} class="anchor-target flex gap-3">
							{#if numbered}
								<span
									class="w-5 shrink-0 text-base leading-snug text-primary tabular-nums"
									aria-hidden="true">{i + 1}</span
								>
							{:else}
								<span
									class="mt-[0.55em] size-2 shrink-0 rounded-full {alert || item.isAlert
										? 'bg-emergency-red'
										: 'bg-primary/70'}"
									aria-hidden="true"
								></span>
							{/if}

							<div class="min-w-0 flex-1 space-y-1">
								<p
									class="text-[15px] leading-snug sm:text-base {item.isAlert
										? 'text-emergency-red'
										: 'text-text-main'}"
								>
									{item.title}
								</p>
								{#if text}
									<p class="text-sm leading-relaxed text-text-main/80">{text}</p>
								{/if}
								{#if item.link}
									<div class="pt-1.5">
										<a
											href={item.link}
											target="_blank"
											rel="noopener noreferrer"
											class="sketch-button inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-warm-sage px-3 py-1.5 text-xs font-black text-primary transition-colors hover:bg-primary hover:text-white"
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
						</li>
					{/each}
				</svelte:element>
			{/if}
		</section>
	{/each}

	<!-- In the short version, say what the detailed one adds instead of hiding it silently. -->
	{#if detailOnlySections.length > 0}
		<aside class="mt-10 rounded-2xl bg-warm-cream px-4 py-3.5">
			<p class="text-sm leading-relaxed text-text-main">
				{m.reader_more_in_detailed({
					sections: detailOnlySections.map((s) => s.title).join(', ')
				})}
			</p>
			<a
				href={readingHref(stepPath(folder.id), true, detailOnlySections[0].id)}
				data-sveltekit-replacestate
				class="mt-1.5 inline-flex min-h-9 items-center gap-1 text-sm font-black text-primary underline underline-offset-4"
			>
				{m.reader_open_detailed()}
				<RoughIcon name="arrow_forward" size={15} stroke="#1F523D" strokeWidth={1.8} />
			</a>
		</aside>
	{/if}

	<!-- 3. WHAT'S NEXT ON THE JOURNEY -->
	<footer class="mt-12 space-y-5">
		<div class="mx-auto max-w-[140px]">
			<WiredDivider stroke="#1F523D" strokeWidth={1.4} roughness={1.4} />
		</div>

		<div class="space-y-1 text-center">
			{#if nextFolder}
				<p class="text-[11px] font-bold tracking-wider text-text-subtle uppercase">
					{m.reader_up_next({ step: nextFolder.step })}
				</p>
				<p class="text-base font-black text-text-main">{nextFolder.shortTitle}</p>
				<p class="text-sm text-text-subtle">{nextFolder.nextReason}</p>
			{:else}
				<p class="text-base font-black text-text-main">{m.reader_finished_title()}</p>
				<p class="text-sm text-text-subtle">{m.reader_finished_desc()}</p>
			{/if}
		</div>

		<div class="flex gap-3">
			<!-- Moving between steps replaces the history entry, so the phone's back gesture from any
			     step returns to where the visitor entered the steps (usually the Journey). -->
			{#if prevFolder}
				<div class="contents" data-sveltekit-replacestate>
					<WiredButton
						href={readingHref(stepPath(prevFolder.id), detailed)}
						shape="bar"
						fill="#FFFFFF"
						class="min-h-11 flex-1 py-2.5"
					>
						<RoughIcon name="arrow_back" size={16} stroke="#242B28" strokeWidth={1.8} />
						<span class="text-sm">{m.reader_prev()}</span>
					</WiredButton>
				</div>
			{/if}
			{#if nextFolder}
				<div class="contents" data-sveltekit-replacestate>
					<WiredButton
						href={readingHref(stepPath(nextFolder.id), detailed)}
						shape="bar"
						seed={2}
						fill="#EAF2EC"
						class="min-h-11 flex-1 py-2.5"
					>
						<span class="text-sm font-black text-primary">{m.reader_next()}</span>
						<RoughIcon name="arrow_forward" size={16} stroke="#1F523D" strokeWidth={1.8} />
					</WiredButton>
				</div>
			{:else}
				<WiredButton
					href={backHref}
					shape="bar"
					seed={2}
					fill="#EAF2EC"
					class="min-h-11 flex-1 py-2.5"
				>
					<span class="text-sm font-black text-primary">{m.reader_back_to_journey()}</span>
				</WiredButton>
			{/if}
		</div>

		{#if nextFolder}
			<a
				href={backHref}
				class="mx-auto flex min-h-10 w-fit items-center text-sm font-bold text-primary underline underline-offset-4"
			>
				{m.reader_back_to_journey()}
			</a>
		{/if}

		<p class="pt-2 text-center text-xs leading-relaxed text-text-subtle">
			{m.reader_disclaimer()}
		</p>
	</footer>
</div>

<style>
	/* Soft, gentle entrance when a step opens. */
	@keyframes stepEnter {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.step-enter {
		animation: stepEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@media (prefers-reduced-motion: reduce) {
		.step-enter {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
