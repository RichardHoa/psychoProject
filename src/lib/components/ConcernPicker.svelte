<script>
	import { page } from '$app/state';
	import CatMascot from '$lib/components/CatMascot.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { happyWaving } from '$lib/assets/cat/index.js';
	import { breathingHref } from '$lib/breathing.js';
	import { m } from '$lib/paraglide/messages.js';
	import { JOURNEY_PATH, LANDING_PATH } from '$lib/routes.js';
	import { CONCERN_PARAM, PERSONA_PARAM, PICKER_ANCHOR, trailHref } from '$lib/trail.js';

	/**
	 * The Landing picker: who are you → what's worrying you → a short answer straight away and the
	 * Trail worth reading next. One question at a time, each answer a plain link (so it works
	 * without JavaScript and the back gesture steps back a question). The whole Journey is always
	 * one tap away.
	 * @type {{ picker: ReturnType<typeof import('$lib/server/trail.js').getPicker> }}
	 */
	let { picker } = $props();

	/** @param {string} [personaId] @param {string} [concernId] */
	function pickerHref(personaId, concernId) {
		const params = new URLSearchParams();
		if (personaId) params.set(PERSONA_PARAM, personaId);
		if (concernId) params.set(CONCERN_PARAM, concernId);
		const query = params.size ? `?${params}` : '';
		return `${LANDING_PATH}${query}#${PICKER_ANCHOR}`;
	}
</script>

<section id={PICKER_ANCHOR} class="w-full scroll-mt-4 space-y-4 text-left" aria-live="polite">
	{#if picker.persona}
		<a
			href={pickerHref(picker.concern ? picker.persona.id : undefined)}
			class="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-text-subtle hover:text-primary"
		>
			<RoughIcon name="arrow_back" size={16} stroke="#5A6561" strokeWidth={1.8} />
			{m.picker_back()}
		</a>
	{/if}

	{#if !picker.persona}
		<div class="flex items-center gap-2">
			<CatMascot autoplay={false} restImg={happyWaving} sizeClass="h-12 w-12" sizes="36px" />
			<div>
				<h2 class="text-base font-black">{m.picker_title()}</h2>
				<p class="text-xs text-text-subtle">{m.picker_desc()}</p>
			</div>
		</div>
		<ul class="space-y-2.5">
			{#each picker.personas as persona, i (persona.id)}
				<li>
					<WiredButton
						href={pickerHref(persona.id)}
						shape="bar"
						fill="#FFFFFF"
						seed={i + 5}
						class="min-h-11 w-full px-4 py-2.5"
					>
						<span class="min-w-0 flex-1 text-left">
							<span class="block text-sm font-bold">{persona.label}</span>
							<span class="block text-xs text-text-subtle">{persona.hint}</span>
						</span>
						<RoughIcon name="arrow_forward" size={16} stroke="#1F523D" strokeWidth={1.8} />
					</WiredButton>
				</li>
			{/each}
		</ul>
	{:else if !picker.concern}
		<h2 class="text-base font-black">{picker.persona.concernPrompt}</h2>
		<ul class="space-y-2.5">
			{#each picker.persona.concerns as concern, i (concern.id)}
				<li>
					<WiredButton
						href={pickerHref(picker.persona.id, concern.id)}
						shape="bar"
						fill="#FFFFFF"
						seed={i + 8}
						class="min-h-11 w-full px-4 py-2.5"
					>
						<span class="min-w-0 flex-1 text-left text-sm">{concern.label}</span>
						<RoughIcon name="arrow_forward" size={16} stroke="#1F523D" strokeWidth={1.8} />
					</WiredButton>
				</li>
			{/each}
		</ul>
	{:else}
		{@const { takeaway, trail, breathing } = picker.concern}
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
			href={trailHref(trail.stops[0].step, trail.key, false)}
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
