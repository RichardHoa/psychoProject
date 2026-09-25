<script>
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import RoughRect from '$lib/components/wired/RoughRect.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * Box breathing (4 × 5 s: inhale, hold, exhale, rest) in pure CSS: the square, the phase
	 * labels, the seconds counter and the cycle counter are all animations on one 20 s clock,
	 * and the pause toggle is a checkbox. Works identically with JavaScript off.
	 * @type {{
	 *   doneHref: string,
	 *   onDone?: (e: MouseEvent) => void,
	 *   headingTag?: 'h1' | 'h2'
	 * }}
	 */
	let { doneHref, onDone, headingTag = 'h1' } = $props();

	const PHASES = [
		{ id: 'inhale', label: m.breathing_phase_inhale(), tip: m.breathing_tip_inhale() },
		{ id: 'hold', label: m.breathing_phase_hold(), tip: m.breathing_tip_hold() },
		{ id: 'exhale', label: m.breathing_phase_exhale(), tip: m.breathing_tip_exhale() },
		{ id: 'rest', label: m.breathing_phase_rest(), tip: m.breathing_tip_rest() }
	];
</script>

<div class="box-breathing flex flex-col items-center space-y-5 text-center">
	<div class="space-y-1 pt-1">
		<span
			class="sketch-pill inline-flex items-center gap-1 rounded-full bg-warm-sage px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-primary uppercase"
		>
			<RoughIcon name="spa" size={12} stroke="currentColor" strokeWidth={2} />
			{m.breathing_badge()}
		</span>
		<svelte:element this={headingTag} class="text-lg font-black text-text-main">
			{m.breathing_heading()}
		</svelte:element>
	</div>

	<!-- The square breathes (grows on inhale, shrinks on exhale) while a dot traces its edges. -->
	<div class="relative my-2 flex h-48 w-48 items-center justify-center">
		<div
			class="square border-sketch-border absolute inset-3 rounded-3xl border-2"
			data-testid="breathing-square"
		>
			<span class="dot" aria-hidden="true"></span>
		</div>

		<div
			class="sketch-card relative flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-white"
		>
			<span
				class="seconds text-3xl font-black text-text-main tabular-nums"
				data-testid="breathing-seconds"
				aria-hidden="true"
			></span>
			<div class="phases mt-0.5 grid">
				{#each PHASES as phase, i (phase.id)}
					<span
						class="phase text-[11px] font-bold tracking-wider text-primary uppercase"
						style:--i={i}>{phase.label}</span
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="space-y-1 px-2">
		<div class="phases grid">
			{#each PHASES as phase, i (phase.id)}
				<p class="phase text-sm font-black text-text-main" style:--i={i}>{phase.tip}</p>
			{/each}
		</div>
		<p class="text-xs text-text-subtle">
			{m.breathing_cycle()} <span class="cycles" aria-hidden="true"></span> • {m.breathing_pace()}
		</p>
	</div>

	<div class="flex w-full items-center gap-3 pt-1">
		<!-- A checkbox, so pausing needs no JavaScript: `:has(:checked)` pauses every animation. -->
		<label
			class="pause-toggle wired wired-button group relative inline-flex flex-1 cursor-pointer items-center justify-center px-3 py-2 select-none"
		>
			<RoughRect
				fill="#FAF4E8"
				stroke="#242B28"
				strokeWidth={1.6}
				roughness={1.1}
				bowing={0.8}
				shadowFill="rgba(36, 43, 40, 0.22)"
			/>
			<input type="checkbox" class="pause-input sr-only" />
			<span
				class="wired-content relative z-10 flex items-center gap-1.5 text-xs font-bold text-text-main"
			>
				<span class="when-running flex items-center gap-1.5">
					<RoughIcon name="pause" size={16} strokeWidth={2} />
					<span>{m.breathing_pause()}</span>
				</span>
				<span class="when-paused flex items-center gap-1.5">
					<RoughIcon name="play_arrow" size={16} strokeWidth={2} />
					<span>{m.breathing_resume()}</span>
				</span>
			</span>
		</label>

		<WiredButton href={doneHref} onclick={onDone} fill="#EAF2EC" seed={2} class="flex-1 py-2">
			<span>{m.breathing_done()}</span>
		</WiredButton>
	</div>
</div>

<style>
	/* One 20 s clock: inhale 0–5 s, hold 5–10 s, exhale 10–15 s, rest 15–20 s. */
	.square {
		animation:
			breath-scale 20s ease-in-out infinite,
			breath-color 20s steps(1, end) infinite;
	}

	@keyframes breath-scale {
		0%,
		100% {
			scale: 0.85;
		}
		25%,
		50% {
			scale: 1.08;
		}
		75% {
			scale: 0.85;
		}
	}

	@keyframes breath-color {
		0% {
			background-color: rgb(232 240 234 / 0.7);
		}
		25% {
			background-color: rgb(254 246 228 / 0.7);
		}
		50% {
			background-color: rgb(250 236 233 / 0.7);
		}
		75%,
		100% {
			background-color: var(--color-surface-container-low);
		}
	}

	.dot {
		position: absolute;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 9999px;
		background: var(--color-primary);
		border: 1.5px solid var(--color-surface-off-white);
		translate: -50% -50%;
		animation: breath-trace 20s linear infinite;
	}

	/* Up the left edge (inhale), across the top (hold), down the right (exhale), back (rest). */
	@keyframes breath-trace {
		0%,
		100% {
			left: 0;
			top: 100%;
		}
		25% {
			left: 0;
			top: 0;
		}
		50% {
			left: 100%;
			top: 0;
		}
		75% {
			left: 100%;
			top: 100%;
		}
	}

	/* The four labels share one grid cell; each is visible for its 5 s quarter of the cycle.
	   Negative delays line them up from the very first frame. */
	.phases > * {
		grid-area: 1 / 1;
	}

	.phase {
		visibility: hidden;
		animation: breath-phase 20s steps(1, end) infinite;
		animation-delay: calc(var(--i) * 5s - 20s);
	}

	@keyframes breath-phase {
		0% {
			visibility: visible;
		}
		25%,
		100% {
			visibility: hidden;
		}
	}

	/* Seconds left in the phase (5 → 1) and completed cycles, via animated integer counters. */
	@property --breath-seconds {
		syntax: '<integer>';
		inherits: false;
		initial-value: 5;
	}

	@property --breath-cycle {
		syntax: '<integer>';
		inherits: false;
		initial-value: 1;
	}

	.seconds {
		counter-reset: breath-seconds var(--breath-seconds);
		animation: breath-count 5s steps(5, jump-end) infinite;
	}

	.seconds::after {
		content: counter(breath-seconds) 's';
	}

	@keyframes breath-count {
		from {
			--breath-seconds: 5;
		}
		to {
			--breath-seconds: 0;
		}
	}

	.cycles {
		counter-reset: breath-cycle var(--breath-cycle);
		/* 99 cycles of 20 s, then it starts again at 1. */
		animation: breath-cycles 1980s steps(99, jump-end) infinite;
	}

	.cycles::after {
		content: counter(breath-cycle);
	}

	@keyframes breath-cycles {
		from {
			--breath-cycle: 1;
		}
		to {
			--breath-cycle: 100;
		}
	}

	/* Pause / resume. */
	.box-breathing:has(.pause-input:checked) :is(.square, .dot, .phase, .seconds, .cycles) {
		animation-play-state: paused;
	}

	.when-paused,
	.pause-toggle:has(.pause-input:checked) .when-running {
		display: none;
	}

	.pause-toggle:has(.pause-input:checked) .when-paused {
		display: flex;
	}

	.pause-toggle:has(.pause-input:focus-visible) {
		outline: 2.5px solid var(--color-primary);
		outline-offset: 3px;
		border-radius: 0.5rem;
	}

	@media (prefers-reduced-motion: reduce) {
		/* Keep the timing cues (labels, counters, colour) but drop the movement. */
		.square {
			animation: breath-color 20s steps(1, end) infinite;
		}

		.dot {
			display: none;
		}
	}
</style>
