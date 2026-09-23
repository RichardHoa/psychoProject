<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CatMascot from '$lib/components/CatMascot.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { hasAnsweredSafetyGate, markSafetyGateAnswered } from '$lib/safety/gateSession.js';
	import { HOTLINE_URL } from '$lib/safety/hotlineStatus.js';
	import { happyAlt, happyDifferent, happyOpenEyes, happyWaving } from '$lib/assets/cat/index.js';

	let { data } = $props();

	const FALLBACK_DESTINATION = '/trang-chu';
	const ACK_DELAY_MS = 2000;
	const COUNTDOWN_START = 5;

	/** @returns {string} */
	function resolveDestination() {
		// URLSearchParams.get() already URL-decodes once — do not decode again.
		const dest = page.url.searchParams.get('dest');
		if (!dest) return FALLBACK_DESTINATION;
		// Require a same-document path: single leading slash, not protocol-relative ("//host/...").
		return dest.startsWith('/') && !dest.startsWith('//') ? dest : FALLBACK_DESTINATION;
	}

	const destination = resolveDestination();

	let showIntro = $state(false);
	let showQuestion = $state(false);
	let answer = $state(/** @type {'yes' | 'no' | null} */ (null));
	let showNoAck = $state(false);
	let showYesResponse = $state(false);
	let countdown = $state(COUNTDOWN_START);

	/** @type {Array<ReturnType<typeof setTimeout>>} */
	const timers = [];
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let countdownInterval;

	/** @param {number} ms @param {() => void} fn */
	function after(ms, fn) {
		timers.push(setTimeout(fn, ms));
	}

	onMount(() => {
		// A visitor who already answered this session but lands back here (e.g. browser
		// Back after "No") should not be re-asked — send them straight to their destination.
		if (hasAnsweredSafetyGate()) {
			goto(destination, { replaceState: true });
			return;
		}
		// Placeholder Vietnamese copy (safety_intro, safety_ack_no, safety_offhours_*) — needs review
		// by the clinical/comms team before this gate ships to real visitors.
		after(400, () => (showIntro = true));
		after(1300, () => (showQuestion = true));
	});

	onDestroy(() => {
		timers.forEach(clearTimeout);
		if (countdownInterval) clearInterval(countdownInterval);
	});

	function handleNo() {
		if (answer) return;
		answer = 'no';
		markSafetyGateAnswered();
		after(400, () => {
			showNoAck = true;
			after(ACK_DELAY_MS, () => goto(destination));
		});
	}

	function handleYes() {
		if (answer) return;
		answer = 'yes';
		markSafetyGateAnswered();
		after(400, () => {
			showYesResponse = true;
			if (data.inHours) startCountdown();
		});
	}

	function startCountdown() {
		countdown = COUNTDOWN_START;
		countdownInterval = setInterval(() => {
			countdown -= 1;
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				goToHotline();
			}
		}, 1000);
	}

	function skipWait() {
		if (countdownInterval) clearInterval(countdownInterval);
		goToHotline();
	}

	function goToHotline() {
		window.open(HOTLINE_URL, '_blank', 'noopener,noreferrer');
	}
</script>

<svelte:head>
	<title>{m.safety_title()}</title>
</svelte:head>

<div class="flex h-[100dvh] w-full items-center justify-center bg-[#EDE8DF] font-body select-none">
	<div
		class="sm:border-x-1.5 sm:border-sketch-border relative flex h-full w-full max-w-md flex-col overflow-hidden bg-background shadow-2xl sm:max-w-lg"
	>
		<header
			class="border-b-1.5 border-sketch-border flex h-16 shrink-0 items-center gap-3 bg-surface-off-white px-4"
		>
			<CatMascot autoplay={false} sizeClass="h-11 w-11" class="shrink-0" />
			<div>
				<p class="text-sm font-black tracking-tight text-primary">{m.brand_name()}</p>
				<p class="text-[11px] text-text-subtle">{m.safety_title()}</p>
			</div>
		</header>

		<div class="flex-1 space-y-4 overflow-y-auto px-4 py-6">
			{#if showIntro}
				<div class="fade-in flex items-start gap-2">
					<CatMascot
						autoplay={false}
						restImg={happyWaving}
						sizeClass="h-11 w-11"
						class="shrink-0"
					/>
					<div
						class="sketch-card max-w-[80%] rounded-2xl rounded-tl-sm bg-warm-cream px-3.5 py-2.5 text-sm text-text-main"
					>
						{m.safety_intro({ mascot: m.brand_name() })}
					</div>
				</div>
			{/if}

			{#if showQuestion}
				<div class="fade-in flex items-start gap-2">
					<CatMascot
						autoplay={false}
						restImg={happyOpenEyes}
						sizeClass="h-11 w-11"
						class="shrink-0"
					/>
					<div class="flex max-w-[85%] flex-col gap-3">
						<div
							class="sketch-card rounded-2xl rounded-tl-sm bg-warm-cream px-3.5 py-2.5 text-sm font-semibold text-text-main"
						>
							{m.safety_question()}
						</div>
						{#if !answer}
							<div class="slide-up flex flex-wrap gap-2">
								<WiredButton onclick={handleNo} fill="#EAF2EC">
									{m.safety_btn_no()}
								</WiredButton>
								<WiredButton onclick={handleYes} fill="#FDF0EE" stroke="#D24D48">
									{m.safety_btn_yes()}
								</WiredButton>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#if answer === 'no'}
				<div
					class="slide-up ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-white"
				>
					{m.safety_btn_no()}
				</div>
				{#if showNoAck}
					<div class="fade-in flex items-start gap-2">
						<CatMascot autoplay={false} restImg={happyAlt} sizeClass="h-11 w-11" class="shrink-0" />
						<div
							class="sketch-card max-w-[80%] rounded-2xl rounded-tl-sm bg-warm-cream px-3.5 py-2.5 text-sm text-text-main"
						>
							{m.safety_ack_no()}
						</div>
					</div>
				{/if}
			{/if}

			{#if answer === 'yes'}
				<div
					class="slide-up ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-white"
				>
					{m.safety_btn_yes()}
				</div>
				{#if showYesResponse}
					<div class="fade-in flex items-start gap-2">
						<CatMascot
							autoplay={false}
							restImg={happyDifferent}
							sizeClass="h-11 w-11"
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
									{m.safety_countdown({ count: countdown })}
								</div>
								<div class="flex flex-wrap gap-2">
									<WiredButton onclick={skipWait} fill="#FDF0EE" stroke="#D24D48">
										{m.safety_redirect_btn()}
									</WiredButton>
								</div>
							{:else}
								<div class="sketch-card rounded-2xl bg-white px-3.5 py-2.5 text-sm text-text-main">
									<p class="font-semibold">{m.safety_offhours_title()}</p>
									<p class="mt-1 text-text-subtle">{m.safety_offhours_desc()}</p>
								</div>
								<div class="flex flex-wrap gap-2">
									<WiredButton onclick={goToHotline} fill="#FDF0EE" stroke="#D24D48">
										{m.safety_go_anyway()}
									</WiredButton>
								</div>
							{/if}

							<p class="text-[11px] text-text-subtle">{m.safety_disclaimer()}</p>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
