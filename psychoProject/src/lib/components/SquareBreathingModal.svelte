<script>
	import { m } from '$lib/paraglide/messages.js';

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
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md fade-in"
	>
		<!-- Modal Box -->
		<div
			class="w-full max-w-sm bg-surface-off-white rounded-3xl p-6 shadow-2xl border border-primary/20 flex flex-col items-center text-center relative overflow-hidden space-y-5"
		>
			<!-- Close Button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
				aria-label="Đóng"
			>
				<span class="material-symbols-outlined text-xl">close</span>
			</button>

			<!-- Header -->
			<div class="space-y-1 pt-1">
				<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 uppercase tracking-wide">
					<span class="material-symbols-outlined text-xs">spa</span>
					Thở vuông 5 giây (Box Breathing)
				</span>
				<h3 class="text-lg font-extrabold text-primary">Điều hòa & Giảm căng thẳng</h3>
			</div>

			<!-- Visual Breathing Box Animation -->
			<div class="relative w-48 h-48 flex items-center justify-center my-2">
				<!-- Outer Pulse Rings -->
				<div
					class="absolute inset-0 rounded-3xl border-2 transition-all duration-1000 ease-in-out {currentPhase.id === 'inhale'
						? 'scale-110 border-primary bg-primary/10 shadow-lg'
						: currentPhase.id === 'hold1'
							? 'scale-110 border-emerald-500 bg-emerald-500/10'
							: currentPhase.id === 'exhale'
								? 'scale-90 border-sky-400 bg-sky-500/5'
								: 'scale-95 border-amber-400 bg-amber-500/5'}"
				></div>

				<!-- Inner Center Circle with Timer -->
				<div
					class="w-32 h-32 rounded-2xl bg-surface shadow-md flex flex-col items-center justify-center border border-surface-variant transition-all"
				>
					<span class="material-symbols-outlined text-3xl text-primary mb-0.5 animate-bounce">
						{currentPhase.icon}
					</span>
					<span class="text-3xl font-black text-on-surface tabular-nums">
						{secondsLeft}s
					</span>
					<span class="text-[10px] font-bold tracking-wider uppercase text-primary mt-0.5">
						{currentPhase.action}
					</span>
				</div>
			</div>

			<!-- Phase Guidance Text -->
			<div class="space-y-1 px-2">
				<p class="text-sm font-bold text-on-surface">
					{currentPhase.text}
				</p>
				<p class="text-xs text-on-surface-variant">
					Vòng lặp: {cycleCount} • Nhịp độ 5s giúp cân bằng hệ thần kinh phó giao cảm
				</p>
			</div>

			<!-- Control Buttons -->
			<div class="flex items-center gap-3 w-full pt-1">
				<button
					type="button"
					onclick={togglePause}
					class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer {isRunning
						? 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-variant'
						: 'bg-primary text-white shadow-xs'}"
				>
					<span class="material-symbols-outlined text-base">
						{isRunning ? 'pause' : 'play_arrow'}
					</span>
					<span>{isRunning ? 'Tạm dừng' : 'Tiếp tục'}</span>
				</button>
				<button
					type="button"
					onclick={onClose}
					class="py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm hover:bg-emerald-800 transition-all cursor-pointer"
				>
					<span>Xong</span>
				</button>
			</div>
		</div>
	</div>
{/if}
