<script>
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import CatMascot from '$lib/components/CatMascot.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { HOTLINE_URL } from '$lib/safety/hotlineStatus.js';
	import { happyAlt, happyDifferent, happyOpenEyes, happyWaving } from '$lib/assets/cat/index.js';

	let { data, form } = $props();

	const ACK_DELAY_S = 2;
	const COUNTDOWN_START = 5;

	// Placeholder Vietnamese copy (safety_intro, safety_ack_no, safety_offhours_*) — needs review
	// by the clinical/comms team before this gate ships to real visitors.

	const answer = $derived(form?.answer ?? null);

	// Without JavaScript the answer arrives as a full page response and a <meta refresh> does the
	// redirect. With JavaScript, `use:enhance` flips this flag and timers take over instead, so the
	// two mechanisms never both fire.
	let enhanced = $state(false);
	let submitting = $state(false);
	let countdown = $state(COUNTDOWN_START);

	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let ackTimer;
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let countdownInterval;

	onDestroy(() => {
		clearTimeout(ackTimer);
		clearInterval(countdownInterval);
	});

	/** @type {import('./$types').SubmitFunction} */
	function submitAnswer() {
		// Before `update()` renders the answer: otherwise the no-JS <meta refresh> would be in the
		// head for one render, and browsers don't cancel a refresh once it has been inserted.
		enhanced = true;
		submitting = true;
		return async ({ result, update }) => {
			// Keep the current load data: re-running load now would see the fresh cookie and
			// redirect away before the visitor reads the answer.
			await update({ invalidateAll: false });
			submitting = false;
			if (result.type !== 'success') return;
			if (result.data?.answer === 'no') {
				ackTimer = setTimeout(() => goto(data.destination), ACK_DELAY_S * 1000);
			} else if (data.inHours) {
				startCountdown();
			}
		};
	}

	function startCountdown() {
		countdown = COUNTDOWN_START;
		countdownInterval = setInterval(() => {
			countdown -= 1;
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				window.open(HOTLINE_URL, '_blank', 'noopener,noreferrer');
			}
		}, 1000);
	}
</script>

<svelte:head>
	<title>{m.safety_title()}</title>
	{#if !enhanced && answer === 'no'}
		<meta http-equiv="refresh" content="{ACK_DELAY_S};url={data.destination}" />
	{:else if !enhanced && answer === 'yes' && data.inHours}
		<meta http-equiv="refresh" content="{COUNTDOWN_START};url={HOTLINE_URL}" />
	{/if}
</svelte:head>

<div class="flex h-[100dvh] w-full items-center justify-center bg-[#EDE8DF] font-body select-none">
	<div
		class="sm:border-x-1.5 sm:border-sketch-border relative flex h-full w-full max-w-md flex-col overflow-hidden bg-background shadow-2xl sm:max-w-lg"
	>
		<header
			class="border-b-1.5 border-sketch-border flex h-16 shrink-0 items-center gap-3 bg-surface-off-white px-4"
		>
			<CatMascot autoplay={false} sizeClass="h-11 w-11" sizes="30px" class="shrink-0" />
			<div>
				<p class="text-sm font-black tracking-tight text-primary">{m.brand_name()}</p>
				<p class="text-[11px] text-text-subtle">{m.safety_title()}</p>
			</div>
		</header>

		<div class="flex-1 space-y-4 overflow-y-auto px-4 py-6" aria-live="polite">
			<!-- Bubbles reveal with CSS animation delays, so the sequence plays without JavaScript. -->
			<div class="bubble flex items-start gap-2" style:--delay={answer ? '0ms' : '400ms'}>
				<CatMascot
					autoplay={false}
					restImg={happyWaving}
					sizeClass="h-11 w-11"
					sizes="30px"
					class="shrink-0"
				/>
				<div
					class="sketch-card max-w-[80%] rounded-2xl rounded-tl-sm bg-warm-cream px-3.5 py-2.5 text-sm text-text-main"
				>
					{m.safety_intro({ mascot: m.brand_name() })}
				</div>
			</div>

			<div class="bubble flex items-start gap-2" style:--delay={answer ? '0ms' : '1300ms'}>
				<CatMascot
					autoplay={false}
					restImg={happyOpenEyes}
					sizeClass="h-11 w-11"
					sizes="30px"
					class="shrink-0"
				/>
				<div class="flex max-w-[85%] flex-col gap-3">
					<div
						class="sketch-card rounded-2xl rounded-tl-sm bg-warm-cream px-3.5 py-2.5 text-sm font-semibold text-text-main"
					>
						{m.safety_question()}
					</div>
					{#if !answer}
						<form method="POST" use:enhance={submitAnswer} class="flex flex-wrap gap-2">
							<WiredButton
								type="submit"
								formaction="?/no&dest={encodeURIComponent(data.destination)}"
								disabled={submitting}
								fill="#EAF2EC"
							>
								{m.safety_btn_no()}
							</WiredButton>
							<WiredButton
								type="submit"
								formaction="?/yes&dest={encodeURIComponent(data.destination)}"
								disabled={submitting}
								fill="#FDF0EE"
								stroke="#D24D48"
							>
								{m.safety_btn_yes()}
							</WiredButton>
						</form>
					{/if}
				</div>
			</div>

			{#if answer === 'no'}
				<div
					class="slide-up ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-white"
				>
					{m.safety_btn_no()}
				</div>
				<div class="bubble flex items-start gap-2" style:--delay="400ms">
					<CatMascot
						autoplay={false}
						restImg={happyAlt}
						sizeClass="h-11 w-11"
						sizes="30px"
						class="shrink-0"
					/>
					<div
						class="sketch-card max-w-[80%] rounded-2xl rounded-tl-sm bg-warm-cream px-3.5 py-2.5 text-sm text-text-main"
					>
						<p>{m.safety_ack_no()}</p>
						<a href={data.destination} class="mt-2 inline-block font-bold text-primary underline">
							{m.safety_continue()}
						</a>
					</div>
				</div>
			{/if}

			{#if answer === 'yes'}
				<div
					class="slide-up ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-white"
				>
					{m.safety_btn_yes()}
				</div>
				<div class="bubble flex items-start gap-2" style:--delay="400ms">
					<CatMascot
						autoplay={false}
						restImg={happyDifferent}
						sizeClass="h-11 w-11"
						sizes="30px"
						class="shrink-0"
					/>
					<div class="flex max-w-[85%] flex-col gap-3">
						<div
							class="sketch-card rounded-2xl rounded-tl-sm bg-warm-terracotta px-3.5 py-2.5 text-sm text-text-main"
						>
							<p class="font-semibold">{m.safety_alert_title()}</p>
							<p class="mt-1 text-text-subtle">{m.safety_alert_desc()}</p>
						</div>

						{#if data.inHours}
							<div
								class="sketch-card rounded-2xl bg-white px-3.5 py-2.5 text-sm font-semibold text-emergency-red"
							>
								{#if enhanced}
									{m.safety_countdown({ count: countdown })}
								{:else}
									{m.safety_countdown({ count: COUNTDOWN_START })}
								{/if}
							</div>
							<div class="flex flex-wrap gap-2">
								<WiredButton
									href={HOTLINE_URL}
									target="_blank"
									rel="noopener noreferrer"
									fill="#FDF0EE"
									stroke="#D24D48"
								>
									{m.safety_redirect_btn()}
								</WiredButton>
							</div>
						{:else}
							<div class="sketch-card rounded-2xl bg-white px-3.5 py-2.5 text-sm text-text-main">
								<p class="font-semibold">{m.safety_offhours_title()}</p>
								<p class="mt-1 text-text-subtle">{m.safety_offhours_desc()}</p>
							</div>
							<div class="flex flex-wrap gap-2">
								<WiredButton
									href={HOTLINE_URL}
									target="_blank"
									rel="noopener noreferrer"
									fill="#FDF0EE"
									stroke="#D24D48"
								>
									{m.safety_go_anyway()}
								</WiredButton>
							</div>
						{/if}

						<p class="text-[11px] text-text-subtle">{m.safety_disclaimer()}</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.bubble {
		animation: bubbleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: var(--delay, 0ms);
	}

	@keyframes bubbleIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bubble {
			animation: none;
		}
	}
</style>
