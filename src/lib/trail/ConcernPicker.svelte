<script>
	import { resolve } from '$app/paths';
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
	 * without JavaScript and the back gesture steps back a question). Until there's an answer,
	 * the whole Journey is one tap away.
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
			class="min-h-14 w-full px-5 py-4"
			contentClass="w-full"
		>
			{#if hint}
				<span class="min-w-0 flex-1 text-left">
					<span class="block text-base font-semibold">{label}</span>
					<span class="mt-0.5 block text-sm text-text-subtle">{hint}</span>
				</span>
			{:else}
				<span class="min-w-0 flex-1 text-left text-base font-semibold">{label}</span>
			{/if}
			<RoughIcon name="arrow_forward" size={16} class="text-primary" strokeWidth={1.8} />
		</WiredButton>
	</li>
{/snippet}

<section id={PICKER_ANCHOR} class="w-full scroll-mt-4 space-y-8 text-left" aria-live="polite">
	{#if picker.stage !== 'persona'}
		<a
			href={resolve(picker.backHref)}
			class="inline-flex min-h-12 items-center gap-1 text-sm font-semibold text-text-subtle hover:text-primary"
		>
			<RoughIcon name="arrow_back" size={16} stroke="#5A6561" strokeWidth={1.8} />
			{m.picker_back()}
		</a>
	{/if}

	{#if picker.stage === 'persona'}
		<div class="flex flex-col items-center gap-2 text-center">
			<CatMascot autoplay={false} restImg={happyWaving} sizeClass="h-24 w-24" sizes="72px" />
			<h1 class="text-2xl font-bold tracking-tight">{m.picker_title()}</h1>
			<p class="text-base text-balance text-text-subtle">{m.picker_desc()}</p>
		</div>
		<ul class="space-y-4">
			{#each picker.personas as persona, i (persona.id)}
				{@render choiceRow(resolve(pickerHref(persona.id)), i + 5, persona.label, persona.hint)}
			{/each}
		</ul>
	{:else if picker.stage === 'concern'}
		<h2 class="text-xl font-bold text-balance">{picker.persona.concernPrompt}</h2>
		<ul class="space-y-4">
			{#each picker.concerns as concern, i (concern.id)}
				{@render choiceRow(
					resolve(pickerHref(picker.persona.id, concern.id)),
					i + 8,
					concern.label
				)}
			{/each}
		</ul>
	{:else}
		{@const { takeaway, trail, breathing } = picker}
		<div>
			<h2 class="text-xl font-bold text-balance">{takeaway.title}</h2>
			<ul class="mt-4 space-y-3 text-base">
				{#each takeaway.points as point (point)}
					<li class="flex gap-2">
						<span class="text-primary" aria-hidden="true">•</span><span>{point}</span>
					</li>
				{/each}
			</ul>
		</div>

		{#if breathing}
			<a
				href={resolve(breathingHref(page.url))}
				class="inline-flex min-h-12 items-center text-base font-semibold text-primary underline underline-offset-4"
			>
				{m.picker_breathing()}
			</a>
		{/if}

		<div>
			<p class="text-sm font-semibold text-text-subtle">
				{m.picker_trail_label({ count: trail.stops.length, minutes: trail.minutes })}
			</p>
			<ol class="mt-4 space-y-4">
				{#each trail.stops as stop, i (stop.step)}
					<li class="flex gap-3 text-base">
						<span class="font-semibold text-primary">{i + 1}.</span>
						<span>
							<span class="block font-semibold">{stop.title}</span>
							<span class="block text-sm text-text-subtle">
								{stop.why} · {m.picker_trail_stop_minutes({ minutes: stop.minutes })}
							</span>
						</span>
					</li>
				{/each}
			</ol>
		</div>

		<WiredButton
			href={resolve(stepHref(trail.stops[0].step, { trail: trail.key }))}
			fill="#EAF2EC"
			class="min-h-12 w-full px-5 py-3 text-base"
		>
			<span class="font-semibold text-primary">{m.picker_start_trail()}</span>
			<RoughIcon name="arrow_forward" size={18} class="text-primary" strokeWidth={1.8} />
		</WiredButton>
	{/if}

	<!-- Once the visitor has an answer and a Trail, the Trail is the way on; the whole Journey stays
	     a swipe away. -->
	{#if picker.stage !== 'answer'}
		<a
			href={resolve(JOURNEY_PATH)}
			class="mx-auto flex min-h-12 w-fit items-center text-base font-semibold text-primary underline underline-offset-4"
		>
			{m.home_start_journey()}
		</a>
	{/if}
</section>
