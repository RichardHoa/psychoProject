<script>
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';

	let safetyStatus = $state('idle'); // 'idle' | 'safe' | 'emergency'
	let countdown = $state(3);
	/** @type {any} */
	let timer = null;

	function handleSafe() {
		safetyStatus = 'safe';
		setTimeout(() => {
			goto('/trang-chu');
		}, 400);
	}

	function handleEmergency() {
		safetyStatus = 'emergency';
		countdown = 3;
		timer = setInterval(() => {
			countdown -= 1;
			if (countdown <= 0) {
				clearInterval(timer);
				if (typeof window !== 'undefined') {
					window.open('https://duongdaynongngaymai.vn/', '_blank');
				}
			}
		}, 1000);
	}
</script>

<svelte:head>
	<title>{m.safety_title()}</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center p-gutter md:p-section-gap font-body bg-background text-text-main">
	<div class="w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-full">
		<div class="w-full relative fade-in">
			<!-- Chat Interface Container -->
			<div class="flex flex-col gap-6">
				<!-- Mascot Image -->
				<div class="flex justify-center mb-2">
					<img
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3WBBj8VEg1y3wWLhCYC7Sj9P8TV6DmzeZtyQC5byUFuTp5-bdKiWi5yqVYf3_9eHHnUXAps6RRCvLxJk9rHdnUHBV1v36WLzqT2B6S4u_ooLv3bG-htns39YgWwPA0MvjFTQJzsfqCrTkg1hxZH6U5WsAE1E8LMDik5_jTP8_OUILog5R-5pGFEoHSlLETeVQNjvw1OnC59yjNtemnksoV3xuxABBSIBkY_Vx28OI8FvSUX6Yyh0wI6SjmhDVKZi0-9s"
						alt="MÈO Mascot"
						class="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
					/>
				</div>

				<!-- Conversation Area -->
				<div class="flex flex-col gap-4 w-full">
					<!-- MÈO Intro Bubble -->
					<div class="flex items-end gap-3 fade-in w-full md:w-11/12">
						<div
							class="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center shadow-sm border border-primary/20"
						>
							<span class="material-symbols-outlined text-primary text-2xl">pets</span>
						</div>
						<div
							class="bg-surface-off-white text-on-surface p-4 rounded-2xl rounded-bl-sm shadow-sm border border-surface-variant leading-relaxed"
						>
							{m.safety_intro({ mascot: 'MÈO' })}
						</div>
					</div>

					<!-- Safety Question Bubble -->
					<div class="flex items-end gap-3 fade-in delay-1 w-full md:w-11/12">
						<div class="w-10 h-10 md:w-12 md:h-12 shrink-0"></div>
						<div
							class="bg-primary-container text-on-primary-container p-4 rounded-2xl rounded-bl-sm shadow-md leading-relaxed font-medium"
						>
							{m.safety_question()}
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				{#if safetyStatus !== 'emergency'}
					<div class="flex flex-col items-end gap-3 mt-4 fade-in delay-2">
						<button
							onclick={handleSafe}
							disabled={safetyStatus === 'safe'}
							class="w-full sm:w-auto px-6 py-3 rounded-2xl rounded-br-sm font-semibold bg-surface-off-white border-2 border-primary text-primary hover:bg-surface-container-low transition-all shadow-sm text-right cursor-pointer {safetyStatus ===
							'safe'
								? 'opacity-75 cursor-not-allowed'
								: ''}"
						>
							{m.safety_btn_no()}
						</button>
						<button
							onclick={handleEmergency}
							class="w-full sm:w-auto px-6 py-3 rounded-2xl rounded-br-sm font-semibold bg-emergency-red text-white hover:bg-red-600 transition-all shadow-md text-right cursor-pointer"
						>
							{m.safety_btn_yes()}
						</button>
					</div>
				{/if}

				<!-- Redirection Message -->
				{#if safetyStatus === 'emergency'}
					<div
						class="fade-in mt-6 p-6 bg-error-container rounded-2xl text-left border border-tertiary shadow-sm"
					>
						<div class="flex items-start gap-4">
							<div
								class="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm"
							>
								<span
									class="material-symbols-outlined text-emergency-red text-2xl"
									style="font-variation-settings: 'FILL' 1;">warning</span
								>
							</div>
							<div>
								<h3 class="font-bold text-on-error-container text-lg mb-2">
									{m.safety_alert_title()}
								</h3>
								<p class="text-on-error-container mb-4 leading-relaxed">
									{m.safety_alert_desc()}
								</p>
								<div class="flex flex-wrap items-center gap-3">
									<a
										href="https://duongdaynongngaymai.vn/"
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 font-semibold text-white bg-emergency-red px-6 py-3 rounded-full hover:bg-red-700 transition-all shadow-md"
									>
										<span class="material-symbols-outlined text-base">call</span>
										{m.safety_redirect_btn()}
									</a>
									<span
										class="text-xs font-bold text-emergency-red bg-white px-3 py-1.5 rounded-full border border-emergency-red/20 shadow-sm flex items-center gap-1"
									>
										<span class="material-symbols-outlined text-sm">timer</span>
										{m.safety_countdown({ count: countdown })}
									</span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<p class="mt-8 text-base text-outline text-center max-w-lg mx-auto">
			{m.safety_disclaimer()}
		</p>
	</div>
</main>
