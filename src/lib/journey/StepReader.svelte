<script>
	import { resolve } from '$app/paths';
	import CatMascot from '$lib/cat/CatMascot.svelte';
	import { RoughIcon, WiredButton, WiredDivider } from '$lib/ui/wired';
	import { m } from '$lib/paraglide/messages.js';
	import TrailHeader from '$lib/trail/TrailHeader.svelte';
	import {
		happy,
		happyAlt,
		happyDifferent,
		happyOpenEyes,
		happyOpenEyesWaving,
		happyWaving
	} from '$lib/cat/index.js';

	/**
	 * @typedef {import('$lib/server/content.js').StepPage} StepPage
	 * @typedef {StepPage['folder']['subfolders'][number]['items'][number]} Item
	 */

	/**
	 * One journey step as a plain reading page. Only links and buttons get hand-drawn boxes;
	 * content is typography, so nothing that can't be pressed looks pressable.
	 * Sections and items carry `id`s, so `/hanh-trinh/<step>#<section>` or `#<item anchor>`
	 * (used by search results) scrolls straight to them and highlights them via `:target`.
	 * Where the step sits and where it leads (the Journey's order or the visitor's Trail) all come
	 * from `nav`; with a `trail`, the Trail header shows above.
	 * @type {{
	 *   folder: StepPage['folder'],
	 *   step: number,
	 *   stepCount: number,
	 *   detailed: boolean,
	 *   trail: import('$lib/trail/trail.js').TrailPosition | null,
	 *   nav: import('$lib/server/content.js').StepNav
	 * }}
	 */
	let { folder, step, stepCount, detailed, trail, nav } = $props();

	const sections = $derived(
		detailed ? folder.subfolders : folder.subfolders.filter((s) => !s.detailOnly)
	);
	const detailOnlySections = $derived(
		detailed ? [] : folder.subfolders.filter((s) => s.detailOnly)
	);

	// A different cat greets the end of each step; the last one waves goodbye.
	const STEP_END_POSES = [happy, happyOpenEyes, happyAlt, happyDifferent, happyWaving];
	const endPose = $derived(
		step < stepCount ? STEP_END_POSES[(step - 1) % STEP_END_POSES.length] : happyOpenEyesWaving
	);

	/** @param {Item} item */
	function itemText(item) {
		return detailed ? (item.detail ?? item.short) : item.short;
	}
</script>

<div class="step-enter w-full bg-background px-5 pt-5 pb-24 font-body text-text-main">
	<!-- 1. WHERE YOU ARE + THE SHORT / DETAILED SWITCH -->
	<header class="space-y-3">
		{#if trail}
			<TrailHeader {trail} {detailed} />
		{/if}
		<!-- On step 1 the bar would mostly show how far there is to go, so it appears from step 2.
		     On a Trail the Journey's position would only confuse, so only the Trail header shows. -->
		{#if nav.position}
			{@const { step: at, total } = nav.position}
			<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
				<p class="text-sm font-semibold text-primary">
					{at > 1 ? m.journey_step_of({ step: at, total }) : m.journey_step({ step: at })}
				</p>
				{#if at > 1}
					<span class="flex gap-1" aria-hidden="true">
						{#each { length: total }, i (i)}
							<span
								class="h-1.5 w-4 rounded-full {i < at
									? 'bg-primary'
									: 'bg-surface-container-highest'}"
							></span>
						{/each}
					</span>
				{/if}
			</div>
		{/if}

		<h1 class="text-2xl font-bold tracking-tight text-balance">
			{folder.title}
		</h1>
		<p class="text-base text-text-subtle">{folder.summary}</p>

		<!-- Plain links, so the switch works without JavaScript. With it, the page updates in place
		     and keeps its scroll position. -->
		<div class="pt-1">
			<nav
				aria-label={m.reader_mode_label()}
				class="sketch-pill inline-flex rounded-2xl bg-white p-1"
			>
				{#each [false, true] as isDetailedLink (isDetailedLink)}
					{@const active = detailed === isDetailedLink}
					<a
						href={resolve(isDetailedLink ? nav.versionHrefs.detailed : nav.versionHrefs.short)}
						aria-current={active ? 'true' : undefined}
						data-sveltekit-noscroll
						data-sveltekit-replacestate
						class="inline-flex min-h-12 items-center rounded-xl px-4 text-base font-semibold transition-colors {active
							? 'bg-warm-sage text-primary'
							: 'text-text-subtle hover:text-primary'}"
					>
						{isDetailedLink ? m.reader_mode_detailed() : m.reader_mode_short()}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<!-- 2. SECTIONS: TYPOGRAPHY ONLY, NO BOXES -->
	{#each sections as subfolder (subfolder.id)}
		{@const alert = subfolder.tone === 'alert'}
		<section id={subfolder.id} class="anchor-target mt-14 space-y-4">
			<div>
				<h2
					class="flex items-center gap-2 text-xl font-bold tracking-tight {alert
						? 'text-emergency-red'
						: 'text-text-main'}"
				>
					{#if alert}
						<RoughIcon name="warning" size={20} class="text-emergency-red" strokeWidth={1.8} />
					{/if}
					<span>{subfolder.title}</span>
				</h2>
				{#if subfolder.desc}
					<p class="mt-1 text-base text-text-subtle">{subfolder.desc}</p>
				{/if}
			</div>

			<div class="max-w-20">
				<WiredDivider
					stroke="currentColor"
					class={alert ? 'text-emergency-red' : 'text-primary'}
					strokeWidth={1.2}
					roughness={1.0}
				/>
			</div>

			{#if subfolder.layout === 'pillars'}
				<ul class="space-y-6 pt-2">
					{#each subfolder.items as item, i (item.anchor)}
						{@const text = itemText(item)}
						<li id={item.anchor} class="anchor-target space-y-1.5">
							<div class="max-w-11">
								<WiredDivider
									stroke="currentColor"
									class="text-primary"
									strokeWidth={2.4}
									roughness={1.4}
									seed={i + 3}
								/>
							</div>
							<p class="text-base font-medium">{item.title}</p>
							{#if text}
								<p class="text-base">{text}</p>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				{@const numbered = subfolder.layout === 'steps'}
				{@const roomy = subfolder.items.some((item) => itemText(item) || item.link)}
				<svelte:element
					this={numbered ? 'ol' : 'ul'}
					class="pt-1 {roomy ? 'space-y-6' : 'space-y-3'}"
				>
					{#each subfolder.items as item, i (item.anchor)}
						{@const text = itemText(item)}
						<li id={item.anchor} class="anchor-target flex gap-3">
							{#if numbered}
								<span
									class="w-5 shrink-0 text-base font-semibold text-primary tabular-nums"
									aria-hidden="true">{i + 1}</span
								>
							{:else}
								<span
									class="mt-[0.65em] size-2 shrink-0 rounded-full {alert || item.isAlert
										? 'bg-emergency-red'
										: 'bg-primary/70'}"
									aria-hidden="true"
								></span>
							{/if}

							<div class="min-w-0 flex-1 space-y-1">
								<p
									class="text-base {text || item.link ? 'font-medium' : ''} {item.isAlert
										? 'text-emergency-red'
										: 'text-text-main'}"
								>
									{item.title}
								</p>
								{#if text}
									<p class="text-base">{text}</p>
								{/if}
								{#if item.link}
									<div class="pt-1.5">
										<a
											href={item.link}
											target="_blank"
											rel="noopener noreferrer"
											class="sketch-button inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-warm-sage px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
										>
											<span>{m.folder_open_link()}</span>
											<RoughIcon
												name="open_in_new"
												size={16}
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
	{#if nav.detailOnlyHref}
		<aside class="mt-14 rounded-2xl bg-warm-cream px-4 py-3.5">
			<p class="text-base leading-relaxed text-text-main">
				{m.reader_more_in_detailed({
					sections: detailOnlySections.map((s) => s.title).join(', ')
				})}
			</p>
			<a
				href={resolve(nav.detailOnlyHref)}
				data-sveltekit-replacestate
				class="mt-1.5 inline-flex min-h-12 items-center gap-1 text-base font-semibold text-primary underline underline-offset-4"
			>
				{m.reader_open_detailed()}
				<RoughIcon name="arrow_forward" size={16} class="text-primary" strokeWidth={1.8} />
			</a>
		</aside>
	{/if}

	<!-- 3. WHAT'S NEXT ON THE JOURNEY -->
	<footer class="mt-16 space-y-5">
		<div class="mx-auto max-w-35">
			<WiredDivider stroke="currentColor" class="text-primary" strokeWidth={1.4} roughness={1.4} />
		</div>

		<CatMascot
			autoplay={false}
			restImg={endPose}
			sizeClass="h-24 w-24"
			sizes="64px"
			class="mx-auto w-fit"
		/>

		<div class="space-y-1 text-center">
			{#if nav.upNext}
				<p class="text-sm font-semibold text-text-subtle">{nav.upNext.caption}</p>
				<p class="text-base font-semibold text-text-main">{nav.upNext.title}</p>
				<p class="text-base leading-relaxed text-text-subtle">{nav.upNext.reason}</p>
			{:else if nav.finished}
				<p class="text-base font-semibold text-text-main">{nav.finished.title}</p>
				<p class="text-base leading-relaxed text-text-subtle">{nav.finished.description}</p>
			{/if}
		</div>

		<div class="flex gap-3">
			<!-- Moving between steps replaces the history entry, so the phone's back gesture from any
			     step returns to where the visitor entered the steps (usually the Journey). -->
			{#if nav.prev}
				<div class="contents" data-sveltekit-replacestate>
					<WiredButton
						href={resolve(nav.prev.href)}
						shape="bar"
						fill="#FFFFFF"
						class="min-h-12 flex-1 py-2.5"
					>
						<RoughIcon name="arrow_back" size={16} stroke="#242B28" strokeWidth={1.8} />
						<span class="text-base">{nav.prev.label}</span>
					</WiredButton>
				</div>
			{/if}
			{#if nav.next}
				<div class="contents" data-sveltekit-replacestate>
					<WiredButton
						href={resolve(nav.next.href)}
						shape="bar"
						seed={2}
						fill="#EAF2EC"
						class="min-h-12 flex-1 py-2.5"
					>
						<span class="text-base font-semibold text-primary">{nav.next.label}</span>
						<RoughIcon name="arrow_forward" size={16} class="text-primary" strokeWidth={1.8} />
					</WiredButton>
				</div>
			{:else}
				<WiredButton
					href={resolve(nav.end.href)}
					shape="bar"
					seed={2}
					fill="#EAF2EC"
					class="min-h-12 flex-1 py-2.5"
				>
					<span class="text-base font-semibold text-primary">{nav.end.label}</span>
				</WiredButton>
			{/if}
		</div>

		{#if nav.links.length > 0}
			<div class="space-y-1 text-center">
				{#each nav.links as link (link.href)}
					<a
						href={resolve(link.href)}
						class="mx-auto flex min-h-12 w-fit items-center text-base font-semibold text-primary underline underline-offset-4"
					>
						{link.label}
					</a>
				{/each}
			</div>
		{/if}
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
