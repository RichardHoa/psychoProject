<script>
	import { page } from '$app/state';
	import CatMascot from '$lib/cat/CatMascot.svelte';
	import { RoughIcon, WiredButton } from '$lib/ui/wired';
	import { happyWaving } from '$lib/cat/index.js';
	import { breathingHref } from '$lib/breathing/breathing.js';
	import { m } from '$lib/paraglide/messages.js';
	import { stepHref } from '$lib/journey/reading.js';
	import { JOURNEY_PATH } from '$lib/shared/routes.js';
	import { PICKER_ANCHOR, pickerHref } from '$lib/trail/trail.js';

	/**
	 * The Landing picker: who are you → what's worrying you → a short answer straight away and the
	 * Trail worth reading next. One question at a time, each answer a plain link (so it works
	 * without JavaScript and the back gesture steps back a question). The whole Journey is always
	 * one tap away.
	 * @type {{ picker: import('$lib/trail/trail.js').Picker }}
	 */
	let { picker } = $props();
</script>

<!-- One answer to the current question; the seed keeps each row's hand-drawn shape. -->
{#snippet choiceRow(
	/** @type {string} */ href,
	/** @type {number} */ seed,
	/** @type {string} */ label,
	/** @type {string | undefined} */ hint = undefined
)}
	<li>
		<WiredButton
			{href}
			shape="bar"
			fill="#FFFFFF"
			{seed}
			class="min-h-14 w-full px-5 py-3"
			contentClass="w-full"
		>
			{#if hint}
				<span class="min-w-0 flex-1 text-left">
					<span class="block text-base font-bold">{label}</span>
					<span class="block text-xs font-medium text-text-subtle">{hint}</span>
				</span>
			{:else}
				<span class="min-w-0 flex-1 text-left text-sm font-bold">{label}</span>
			{/if}
			<RoughIcon name="arrow_forward" size={16} stroke="#1F523D" strokeWidth={1.8} />
		</WiredButton>
	</li>
{/snippet}

<section id={PICKER_ANCHOR} class="w-full scroll-mt-4 space-y-4 text-left" aria-live="polite">
	{#if picker.stage !== 'persona'}
		<a
			href={picker.backHref}
			class="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-text-subtle hover:text-primary"
		>
			<RoughIcon name="arrow_back" size={16} stroke="#5A6561" strokeWidth={1.8} />
			{m.picker_back()}
		</a>
	{/if}

	{#if picker.stage === 'persona'}
		<div class="flex flex-col items-center pb-2 text-center">
			<CatMascot autoplay={false} restImg={happyWaving} sizeClass="h-24 w-24" sizes="72px" />
			<h1 class="text-3xl leading-tight font-black tracking-tight">{m.picker_title()}</h1>
			<p class="text-sm text-text-subtle">{m.picker_desc()}</p>
		</div>
		<ul class="space-y-3">
			{#each picker.personas as persona, i (persona.id)}
				{@render choiceRow(pickerHref(persona.id), i + 5, persona.label, persona.hint)}
			{/each}
		</ul>
	{:else if picker.stage === 'concern'}
		<h2 class="text-xl font-black">{picker.persona.concernPrompt}</h2>
		<ul class="space-y-3">
			{#each picker.concerns as concern, i (concern.id)}
				{@render choiceRow(pickerHref(picker.persona.id, concern.id), i + 8, concern.label)}
			{/each}
		</ul>
	{:else}
		{@const { takeaway, trail, breathing } = picker}
		<div>
			<h2 class="text-lg leading-snug font-black text-balance">{takeaway.title}</h2>
			<ul class="mt-2 space-y-1.5 text-sm leading-relaxed">
				{#each takeaway.points as point (point)}
					<li class="flex gap-2">
						<span class="text-primary" aria-hidden="true">•</span><span>{point}</span>
					</li>
				{/each}
			</ul>
		</div>

		{#if breathing}
			<a
				href={breathingHref(page.url)}
				class="inline-flex min-h-10 items-center text-sm font-bold text-primary underline underline-offset-4"
			>
				{m.picker_breathing()}
			</a>
		{/if}

		<div>
			<p class="text-[11px] font-bold tracking-wider text-text-subtle uppercase">
				{m.picker_trail_label({ count: trail.stops.length, minutes: trail.minutes })}
			</p>
			<ol class="mt-2 space-y-2">
				{#each trail.stops as stop, i (stop.step)}
					<li class="flex gap-2.5 text-sm">
						<span class="font-black text-primary">{i + 1}.</span>
						<span>
							<span class="block font-bold">{stop.title}</span>
							<span class="block text-xs text-text-subtle">
								{stop.why} · {m.picker_trail_stop_minutes({ minutes: stop.minutes })}
							</span>
						</span>
					</li>
				{/each}
			</ol>
		</div>

		<WiredButton
			href={stepHref(trail.stops[0].step, { trail: trail.key })}
			fill="#EAF2EC"
			class="w-full px-5 py-2.5 text-sm"
		>
			<span class="font-black text-primary">{m.picker_start_trail()}</span>
			<RoughIcon name="arrow_forward" size={18} stroke="#1F523D" strokeWidth={1.8} />
		</WiredButton>
	{/if}

	<a
		href={JOURNEY_PATH}
		class="mx-auto flex min-h-10 w-fit items-center text-sm font-bold text-primary underline underline-offset-4"
	>
		{m.home_start_journey()}
	</a>
</section>
