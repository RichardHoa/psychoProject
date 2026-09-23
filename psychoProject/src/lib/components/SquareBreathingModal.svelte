<script>
	import { m } from '$lib/paraglide/messages.js';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';

	/**
	 * @type {{
	 *   isOpen: boolean,
	 *   onClose: () => void
	 * }}
	 */
	let { isOpen = false, onClose } = $props();

	// Square Breathing 5s cycle states
	// Phases: 'inhale' (5s) -> 'hold1' (5s) -> 'exhale' (5s) -> 'hold2' (5s)
	const CYCLE_SECONDS = 5;
	const PHASES = [
		{ id: 'inhale', text: 'Hít vào chậm qua mũi', icon: 'air', action: 'HÍT VÀO' },
		{ id: 'hold1', text: 'Giữ hơi thở nhẹ nhàng', icon: 'pause_circle', action: 'GIỮ HƠI' },
		{ id: 'exhale', text: 'Thở ra từ từ qua miệng', icon: 'filter_drama', action: 'THỞ RA' },
		{ id: 'hold2', text: 'Thả lỏng toàn bộ cơ thể', icon: 'spa', action: 'NGHỈ NGƠI' }
	];

	let phaseIndex = $state(0);
	let secondsLeft = $state(CYCLE_SECONDS);
	let cycleCount = $state(1);
	let isRunning = $state(true);
	/** @type {any} */
	let intervalId = null;

	let currentPhase = $derived(PHASES[phaseIndex]);

	$effect(() => {
		if (isOpen) {
			phaseIndex = 0;
			secondsLeft = CYCLE_SECONDS;
			cycleCount = 1;
			isRunning = true;
			startBreathing();
		} else {
			stopBreathing();
		}

		return () => {
			stopBreathing();
		};
	});

	function startBreathing() {
		stopBreathing();
		intervalId = setInterval(() => {
			if (!isRunning) return;

			secondsLeft -= 1;
			if (secondsLeft <= 0) {
				secondsLeft = CYCLE_SECONDS;
				phaseIndex = (phaseIndex + 1) % PHASES.length;
				if (phaseIndex === 0) {
					cycleCount += 1;
				}
			}
		}, 1000);
	}

	function stopBreathing() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function togglePause() {
		isRunning = !isRunning;
	}

	/** @param {KeyboardEvent} e */
	function handleKeyDown(e) {
		if (e.key === 'Escape' && isOpen) {
			onClose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen}
	<div
		role="dialog"
		aria-modal="true"
		aria-label="Bài tập thở vuông 5 giây"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop fade-in"
	>
		<!-- Hand-Drawn Modal Box -->
		<div
			class="sketch-card w-full max-w-sm bg-surface-off-white rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden space-y-5"
		>
			<!-- Close Button -->
			<button
				type="button"
				onclick={onClose}
				class="sketch-button absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-text-subtle hover:text-text-main transition-colors"
				aria-label="Đóng"
			>
				<span class="material-symbols-outlined text-lg">close</span>
			</button>

			<!-- Header -->
			<div class="space-y-1 pt-1">
				<span class="sketch-pill inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-warm-sage text-primary uppercase tracking-wide">
					<span class="material-symbols-outlined text-xs">spa</span>
					Thở vuông 5 giây (Box Breathing)
				</span>
				<h3 class="text-lg font-black text-text-main">Điều hòa & Giảm căng thẳng</h3>
			</div>

			<!-- Visual Breathing Box Animation -->
			<div class="relative w-48 h-48 flex items-center justify-center my-2">
				<!-- Outer Pulse Rings -->
				<div
					class="absolute inset-0 rounded-3xl border-2 border-sketch-border transition-all duration-1000 ease-in-out {currentPhase.id === 'inhale'
						? 'scale-110 bg-warm-sage/60'
						: currentPhase.id === 'hold1'
							? 'scale-110 bg-warm-amber/60'
							: currentPhase.id === 'exhale'
								? 'scale-90 bg-warm-terracotta/60'
								: 'scale-95 bg-surface-container-low'}"
				></div>

				<!-- Inner Center Circle with Timer -->
				<div
					class="sketch-card w-32 h-32 rounded-2xl bg-white flex flex-col items-center justify-center transition-all"
				>
					<span class="material-symbols-outlined text-3xl text-primary mb-0.5 animate-bounce">
						{currentPhase.icon}
					</span>
					<span class="text-3xl font-black text-text-main tabular-nums">
						{secondsLeft}s
					</span>
					<span class="text-[10px] font-bold tracking-wider uppercase text-primary mt-0.5">
						{currentPhase.action}
					</span>
				</div>
			</div>

			<!-- Phase Guidance Text -->
			<div class="space-y-1 px-2">
				<p class="text-sm font-black text-text-main">
					{currentPhase.text}
				</p>
				<p class="text-xs text-text-subtle">
					Vòng lặp: {cycleCount} • Nhịp độ 5s giúp làm dịu tâm trí
				</p>
			</div>

			<!-- Control Buttons -->
			<div class="flex items-center gap-3 w-full pt-1">
				<WiredButton onclick={togglePause} fill="#FAF4E8" class="flex-1 py-2">
					<span class="material-symbols-outlined text-base">
						{isRunning ? 'pause' : 'play_arrow'}
					</span>
					<span>{isRunning ? 'Tạm dừng' : 'Tiếp tục'}</span>
				</WiredButton>
				<WiredButton onclick={onClose} fill="#EAF2EC" class="flex-1 py-2">
					<span>Hoàn tất</span>
				</WiredButton>
			</div>
		</div>
	</div>
{/if}
