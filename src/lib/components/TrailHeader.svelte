<script>
	import { m } from '$lib/paraglide/messages.js';
	import { stepHref } from '$lib/reading.js';

	/**
	 * Top of a step page while following a Trail: where this step sits on the visitor's own Trail
	 * (instead of "Bước 5 / 7"), the other stops, and the section worth reading first.
	 * @type {{
	 *   trail: import('$lib/trail.js').TrailPosition,
	 *   stepId: string,
	 *   detailed: boolean
	 * }}
	 */
	let { trail, stepId, detailed } = $props();

	const stop = $derived(trail.stops[trail.index]);
</script>

<div class="space-y-2.5">
	<div class="flex items-baseline justify-between gap-3">
		<p class="text-xs font-black text-primary">
			{m.trail_progress({ index: trail.index + 1, count: trail.stops.length })}
		</p>
		<!-- Leaving keeps the visitor on this step, just back in the Journey's own order. -->
		<a
			href={stepHref(stepId, { detailed })}
			class="shrink-0 text-xs text-text-subtle underline underline-offset-4 hover:text-primary"
		>
			{m.trail_leave()}
		</a>
	</div>
	<p class="text-xs text-text-subtle">{m.trail_question({ question: trail.question })}</p>

	<ol class="space-y-1">
		{#each trail.stops as s, i (s.step)}
			{@const done = i < trail.index}
			{@const current = i === trail.index}
			<li class="flex min-h-7 items-center gap-2 text-sm">
				<span
					class="flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black {done
						? 'bg-primary text-white'
						: current
							? 'bg-background text-primary ring-2 ring-primary'
							: 'bg-surface-container-highest text-text-subtle'}"
					aria-hidden="true">{done ? '✓' : i + 1}</span
				>
				{#if current}
					<span class="font-black" aria-current="step">{s.title}</span>
				{:else}
					<a
						href={stepHref(s.step, { detailed, trail: trail.key })}
						data-sveltekit-replacestate
						class="text-text-subtle underline underline-offset-4 hover:text-primary">{s.title}</a
					>
				{/if}
			</li>
		{/each}
	</ol>

	{#if stop.section}
		<a
			href="#{stop.section.id}"
			class="inline-flex min-h-10 items-center text-sm font-bold text-primary underline underline-offset-4"
		>
			{m.trail_read_section({ section: stop.section.title })} ↓
		</a>
	{/if}
</div>
