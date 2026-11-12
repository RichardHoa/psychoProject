<script>
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { readingHref } from '$lib/reading.js';
	import { JOURNEY_PATH, LANDING_PATH, stepPath } from '$lib/routes.js';
	import { PICKER_ANCHOR, trailHref } from '$lib/trail.js';

	/**
	 * End of a step page while following a Trail. "Next" follows the visitor's Trail, not the
	 * Journey's order; the Journey's own next step stays one tap away as the other choice.
	 * @type {{
	 *   trail: NonNullable<ReturnType<typeof import('$lib/server/trail.js').getTrailPosition>>,
	 *   detailed: boolean,
	 *   nextFolder: import('$lib/server/content.js').FolderSummary | null
	 * }}
	 */
	let { trail, detailed, nextFolder } = $props();

	const prev = $derived(trail.stops[trail.index - 1]);
	const next = $derived(trail.stops[trail.index + 1]);
</script>

<div class="space-y-1 text-center">
	{#if next}
		<p class="text-[11px] font-bold tracking-wider text-text-subtle uppercase">
			{m.trail_up_next({ index: trail.index + 2, count: trail.stops.length })}
		</p>
		<p class="text-base font-black text-text-main">{next.title}</p>
		<p class="text-sm text-text-subtle">{next.why}</p>
	{:else}
		<p class="text-base font-black text-text-main">{m.trail_finished_title()}</p>
		<p class="text-sm text-text-subtle">
			{m.trail_finished_desc({ count: trail.stops.length, question: trail.question })}
		</p>
	{/if}
</div>

<div class="flex gap-3">
	<!-- Moving along the Trail replaces the history entry, like moving between steps, so the
	     phone's back gesture returns to where the visitor started it. -->
	{#if prev}
		<div class="contents" data-sveltekit-replacestate>
			<WiredButton
				href={trailHref(prev.step, trail.key, detailed)}
				shape="bar"
				fill="#FFFFFF"
				class="min-h-11 flex-1 py-2.5"
			>
				<RoughIcon name="arrow_back" size={16} stroke="#242B28" strokeWidth={1.8} />
				<span class="text-sm">{m.trail_prev()}</span>
			</WiredButton>
		</div>
	{/if}
	{#if next}
		<div class="contents" data-sveltekit-replacestate>
			<WiredButton
				href={trailHref(next.step, trail.key, detailed)}
				shape="bar"
				seed={2}
				fill="#EAF2EC"
				class="min-h-11 flex-1 py-2.5"
			>
				<span class="text-sm font-black text-primary">{m.trail_next()}</span>
				<RoughIcon name="arrow_forward" size={16} stroke="#1F523D" strokeWidth={1.8} />
			</WiredButton>
		</div>
	{:else}
		<WiredButton
			href="{LANDING_PATH}#{PICKER_ANCHOR}"
			shape="bar"
			seed={2}
			fill="#EAF2EC"
			class="min-h-11 flex-1 py-2.5"
		>
			<span class="text-sm font-black text-primary">{m.trail_ask_again()}</span>
		</WiredButton>
	{/if}
</div>

<div class="space-y-1 text-center">
	{#if !next}
		<a
			href={JOURNEY_PATH}
			class="mx-auto flex min-h-10 w-fit items-center text-sm font-bold text-primary underline underline-offset-4"
		>
			{m.reader_back_to_journey()}
		</a>
	{/if}
	{#if nextFolder}
		<a
			href={readingHref(stepPath(nextFolder.id), detailed)}
			class="mx-auto flex min-h-10 w-fit items-center text-xs text-text-subtle underline underline-offset-4 hover:text-primary"
		>
			{m.trail_in_order({ step: nextFolder.step, title: nextFolder.shortTitle })}
		</a>
	{/if}
</div>
