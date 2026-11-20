<script>
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { stepHref } from '$lib/journey/reading.js';
	import { JOURNEY_PATH } from '$lib/shared/routes.js';

	/**
	 * Top of a step page while following a Trail: where this step sits on the visitor's own Trail
	 * (instead of "Bước 5 / 7") and the other stops.
	 * @type {{
	 *   trail: import('$lib/trail/trail.js').TrailPosition,
	 *   detailed: boolean
	 * }}
	 */
	let { trail, detailed } = $props();
</script>

<div class="space-y-2">
	<div class="flex flex-wrap items-center justify-between gap-x-3">
		<p class="text-sm font-semibold text-primary">
			{m.trail_progress({ index: trail.index + 1, count: trail.stops.length })}
		</p>
		<!-- Leaving opens the whole Journey, where the visitor can pick any step. -->
		<a
			href={resolve(JOURNEY_PATH)}
			class="flex min-h-12 shrink-0 items-center text-sm text-text-subtle underline underline-offset-4 hover:text-primary"
		>
			{m.trail_leave()}
		</a>
	</div>
	<p class="text-sm text-text-subtle">{m.trail_question({ question: trail.question })}</p>

	<ol>
		{#each trail.stops as s, i (s.step)}
			{@const done = i < trail.index}
			{@const current = i === trail.index}
			<li class="flex min-h-12 items-center gap-2.5 text-base">
				<span
					class="flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold {done
						? 'bg-primary text-white'
						: current
							? 'bg-background text-primary ring-2 ring-primary'
							: 'bg-surface-container-highest text-text-subtle'}"
					aria-hidden="true">{done ? '✓' : i + 1}</span
				>
				{#if current}
					<span class="font-semibold" aria-current="step">{s.title}</span>
				{:else}
					<a
						href={resolve(stepHref(s.step, { detailed, trail: trail.key }))}
						data-sveltekit-replacestate
						class="text-text-subtle underline underline-offset-4 hover:text-primary">{s.title}</a
					>
				{/if}
			</li>
		{/each}
	</ol>
</div>
