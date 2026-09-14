<script>
	import { SEARCH_DATABASE } from '$lib/data/searchData.js';
	import { searchState } from '$lib/state/searchState.svelte.js';
	import { m } from '$lib/paraglide/messages.js';

	let isListening = $state(false);
	let voiceError = $state('');
	/** @type {HTMLInputElement | null} */
	let modalInputRef = $state(null);

	// Focus input whenever modal opens
	$effect(() => {
		if (searchState.isOpen && modalInputRef) {
			setTimeout(() => {
				modalInputRef?.focus();
			}, 100);
		}
	});

	let trimmedQuery = $derived(searchState.query.trim().toLowerCase());

	let searchResults = $derived.by(() => {
		if (!trimmedQuery) return [];
		return SEARCH_DATABASE.filter(
			(item) =>
				item.title.toLowerCase().includes(trimmedQuery) ||
				item.category.toLowerCase().includes(trimmedQuery) ||
				item.desc.toLowerCase().includes(trimmedQuery)
		);
	});

	let showResults = $derived(trimmedQuery.length > 0);

	/** @type {any} */
	let recognition = null;

	function toggleVoiceSearch() {
		if (typeof window === 'undefined') return;

		const SpeechRecognition =
			// @ts-ignore
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			alert(
				'Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói trực tiếp. Hãy dùng bàn phím để tìm kiếm nhé!'
			);
			return;
		}

		if (isListening && recognition) {
			recognition.stop();
			isListening = false;
			return;
		}

		try {
			recognition = new SpeechRecognition();
			recognition.lang = 'vi-VN';
			recognition.continuous = false;
			recognition.interimResults = false;

			recognition.onstart = () => {
				isListening = true;
				voiceError = '';
			};

			/** @param {any} event */
			recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				searchState.setQuery(transcript);
				isListening = false;
			};

			recognition.onerror = () => {
				voiceError = 'Không thể nhận diện giọng nói. Bạn hãy thử lại nhé!';
				isListening = false;
			};

			recognition.onend = () => {
				isListening = false;
			};

			recognition.start();
		} catch (e) {
			voiceError = 'Lỗi khởi động nhận diện giọng nói.';
			isListening = false;
		}
	}

	// Maximum 4 clean suggestion chips as requested
	const suggestionChips = [
		{ label: 'Bảo mật', icon: 'lock' },
		{ label: 'Thân chủ', icon: 'person' },
		{ label: 'Nhà tham vấn', icon: 'psychology' },
		{ label: 'Quyền thân chủ', icon: 'gavel' }
	];

	/** @param {string} term */
	function setSuggestion(term) {
		searchState.setQuery(term);
		modalInputRef?.focus();
	}

	function closeSearch() {
		searchState.close();
		if (isListening && recognition) {
			recognition.stop();
			isListening = false;
		}
	}

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key === 'Escape' && searchState.isOpen) {
			closeSearch();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if searchState.isOpen}
	<!-- Fullscreen Blurred Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-neutral-950/65 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto fade-in font-body"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeSearch();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') closeSearch();
		}}
		role="presentation"
	>
		<!-- Center Modal Shell (Centered in screen, shifted 30px upward) -->
		<div class="w-full max-w-lg bg-surface-off-white rounded-3xl shadow-2xl border border-surface-variant flex flex-col overflow-hidden slide-up max-h-[85vh] -translate-y-[15px]">
			<!-- Modal Top Bar / Input -->
			<div class="p-4 sm:p-5 border-b border-surface-variant/80 bg-surface-off-white sticky top-0 z-20">
				<div class="relative flex items-center">
					<!-- Search Icon -->
					<div class="absolute left-4 flex items-center pointer-events-none text-primary">
						<span class="material-symbols-outlined text-2xl">search</span>
					</div>

					<!-- Search Input -->
					<input
						type="text"
						bind:this={modalInputRef}
						bind:value={searchState.query}
						class="w-full h-14 pl-12 pr-24 text-sm sm:text-base bg-surface-container-low border border-surface-variant rounded-2xl shadow-xs focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-semibold outline-hidden transition-all placeholder:text-outline"
						placeholder={m.home_search_placeholder()}
					/>

					<!-- Action Controls in Input -->
					<div class="absolute right-2.5 flex items-center gap-1.5">
						{#if searchState.query}
							<button
								type="button"
								onclick={() => searchState.setQuery('')}
								class="p-2 text-outline hover:text-on-surface hover:bg-surface-variant/60 rounded-full cursor-pointer transition-colors"
								title="Xóa chữ"
							>
								<span class="material-symbols-outlined text-lg">close</span>
							</button>
						{/if}

						<!-- Voice button -->
						<button
							type="button"
							onclick={toggleVoiceSearch}
							title="Tìm kiếm bằng giọng nói"
							class="p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer {isListening
								? 'bg-emergency-red text-white animate-pulse'
								: 'bg-primary/10 text-primary hover:bg-primary/20'}"
						>
							<span class="material-symbols-outlined text-xl">mic</span>
						</button>
					</div>
				</div>

				<!-- Voice Status Indicator -->
				{#if isListening}
					<div class="flex items-center gap-2 text-primary font-semibold text-xs mt-2.5 px-2 fade-in">
						<span class="material-symbols-outlined text-sm animate-spin">sync</span>
						<span>Đang lắng nghe... Hãy nói từ khóa bạn cần tìm!</span>
					</div>
				{/if}

				{#if voiceError}
					<div class="text-xs text-emergency-red mt-2 px-2 fade-in">
						{voiceError}
					</div>
				{/if}
			</div>

			<!-- Modal Body (4 Chips Max or Search Results) -->
			<div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 min-h-[220px]">
				<!-- IF NO QUERY: SHOW EXACTLY 4 CLEAN SUGGESTION CHIPS -->
				{#if !showResults}
					<div class="space-y-4 fade-in py-2">
						<div class="flex items-center justify-between px-1">
							<span class="text-xs font-bold text-outline uppercase tracking-wider">
								Gợi ý chủ đề nhanh
							</span>
							<span class="text-[11px] text-outline">Chạm để lọc</span>
						</div>

						<!-- 4 Suggestion Chips in a 2x2 Grid -->
						<div class="grid grid-cols-2 gap-2.5 pt-1">
							{#each suggestionChips as chip (chip.label)}
								<button
									type="button"
									onclick={() => setSuggestion(chip.label)}
									class="inline-flex items-center justify-start gap-2.5 px-3.5 py-3 rounded-2xl bg-surface-container-low hover:bg-primary/10 hover:text-primary text-on-surface border border-surface-variant/90 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs hover:border-primary/40"
								>
									<span class="material-symbols-outlined text-lg text-primary shrink-0">{chip.icon}</span>
									<span class="truncate">{chip.label}</span>
								</button>
							{/each}
						</div>

						<!-- Open Airy Space For Typing -->
						<div class="pt-8 pb-4 text-center">
							<p class="text-xs text-outline leading-relaxed max-w-xs mx-auto">
								Gõ bất kỳ từ khóa hoặc câu hỏi nào để tìm kiếm câu trả lời nhanh chóng.
							</p>
						</div>
					</div>

				<!-- IF QUERY TYPED: SHOW SPACIOUS RESULTS -->
				{:else}
					<div class="space-y-3 fade-in">
						{#if searchResults.length === 0}
							<div class="py-12 text-center text-on-surface-variant space-y-2">
								<div class="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-outline">
									<span class="material-symbols-outlined text-2xl">search_off</span>
								</div>
								<h3 class="font-bold text-sm text-on-surface">Không tìm thấy kết quả cho "{searchState.query}"</h3>
								<p class="text-xs text-outline max-w-xs mx-auto">
									Bạn hãy thử các từ khóa như "thân chủ", "bảo mật", "nhà tham vấn", "quyền thân chủ"
								</p>
							</div>
						{:else}
							<div class="flex justify-between items-center px-1 text-xs font-bold text-outline">
								<span>Tìm thấy {searchResults.length} kết quả phù hợp:</span>
							</div>

							<div class="space-y-2.5">
								{#each searchResults as item (item.id)}
									<a
										href={item.link}
										onclick={closeSearch}
										class="block p-3.5 rounded-2xl bg-surface-container-low hover:bg-primary/10 border border-surface-variant/80 hover:border-primary/40 transition-all group text-left shadow-xs"
									>
										<div class="flex items-center justify-between gap-2 mb-1">
											<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
												{item.category}
											</span>
											<span class="material-symbols-outlined text-xs text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform">
												arrow_forward
											</span>
										</div>
										<h4 class="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
											{item.title}
										</h4>
										<p class="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
											{item.desc}
										</p>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Modal Bottom Bar -->
			<div class="p-3.5 border-t border-surface-variant/80 bg-surface-container-low/60 flex items-center justify-between text-xs text-outline px-5">
				<span>Phím <kbd class="px-1.5 py-0.5 rounded-md bg-surface-off-white border border-surface-variant font-mono text-[10px] font-bold">ESC</kbd> để đóng</span>
				<button
					type="button"
					onclick={closeSearch}
					class="px-4 py-1.5 rounded-xl bg-surface-off-white hover:bg-surface-variant text-on-surface font-semibold border border-surface-variant transition-colors cursor-pointer text-xs"
				>
					Đóng
				</button>
			</div>
		</div>
	</div>
{/if}
