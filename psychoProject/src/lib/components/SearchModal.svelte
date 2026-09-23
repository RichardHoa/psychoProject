<script>
	import { pushState } from '$app/navigation';
	import { SEARCH_DATABASE } from '$lib/data/searchData.js';
	import { searchState } from '$lib/state/searchState.svelte.js';
	import { m } from '$lib/paraglide/messages.js';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';

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

	// 4 clean suggestion chips
	const suggestionChips = [
		{ label: 'Bảo mật', icon: 'lock' },
		{ label: 'Thân chủ', icon: 'person' },
		{ label: 'Nhà tham vấn', icon: 'psychology' },
		{ label: 'Quyền thân chủ', icon: 'balance' }
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

	/**
	 * @param {MouseEvent} e
	 * @param {string} link
	 */
	function navigateToResult(e, link) {
		e.preventDefault();
		const url = new URL(link, window.location.origin);
		const folder = url.searchParams.get('folder');
		const sub = url.searchParams.get('sub');
		closeSearch();
		pushState(link, { slide: 1, folder, sub });
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
	<!-- Fullscreen Backdrop -->
	<div
		class="fixed inset-0 z-50 modal-backdrop flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto fade-in font-body"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeSearch();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') closeSearch();
		}}
		role="presentation"
	>
		<!-- Center Modal Shell with Sketch Card Style -->
		<div class="sketch-card w-full max-w-lg bg-surface-off-white rounded-3xl flex flex-col overflow-hidden slide-up max-h-[85vh] -translate-y-[15px]">
			<!-- Modal Top Bar / Input -->
			<div class="p-4 sm:p-5 border-b-1.5 border-sketch-border bg-surface-off-white sticky top-0 z-20">
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
						class="w-full h-13 pl-12 pr-24 text-sm sm:text-base bg-white border-1.5 border-sketch-border rounded-2xl shadow-xs text-text-main font-bold outline-hidden transition-all placeholder:text-text-subtle/70"
						placeholder={m.home_search_placeholder()}
					/>

					<!-- Action Controls in Input -->
					<div class="absolute right-2.5 flex items-center gap-1.5">
						{#if searchState.query}
							<button
								type="button"
								onclick={() => searchState.setQuery('')}
								class="p-1.5 text-text-subtle hover:text-text-main rounded-full cursor-pointer"
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
							class="sketch-button p-2 rounded-xl transition-all flex items-center justify-center {isListening
								? 'bg-emergency-red text-white animate-pulse'
								: 'bg-warm-sage text-primary'}"
						>
							<span class="material-symbols-outlined text-lg">mic</span>
						</button>
					</div>
				</div>

				<!-- Voice Status Indicator -->
				{#if isListening}
					<div class="flex items-center gap-2 text-primary font-bold text-xs mt-2.5 px-2 fade-in">
						<span class="material-symbols-outlined text-sm animate-spin">sync</span>
						<span>Đang lắng nghe... Hãy nói từ khóa bạn cần tìm!</span>
					</div>
				{/if}

				{#if voiceError}
					<div class="text-xs text-emergency-red mt-2 px-2 fade-in font-bold">
						{voiceError}
					</div>
				{/if}
			</div>

			<!-- Modal Body -->
			<div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-[200px]">
				{#if !showResults}
					<div class="space-y-3.5 fade-in py-1">
						<div class="flex items-center justify-between px-1">
							<span class="text-xs font-bold text-text-subtle uppercase tracking-wider">
								Gợi ý chủ đề nhanh
							</span>
							<span class="text-[11px] text-text-subtle">Chạm để chọn</span>
						</div>

						<!-- 4 Suggestion Chips in a 2x2 Grid -->
						<div class="grid grid-cols-2 gap-2.5">
							{#each suggestionChips as chip (chip.label)}
								<button
									type="button"
									onclick={() => setSuggestion(chip.label)}
									class="sketch-button inline-flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white text-text-main text-xs sm:text-sm font-bold transition-all active:scale-95"
								>
									<span class="material-symbols-outlined text-lg text-primary shrink-0">{chip.icon}</span>
									<span class="truncate">{chip.label}</span>
								</button>
							{/each}
						</div>
					</div>
				{:else}
					<div class="space-y-2.5 fade-in">
						{#if searchResults.length === 0}
							<div class="py-10 text-center text-text-subtle space-y-2">
								<h3 class="font-bold text-sm text-text-main">Không tìm thấy kết quả cho "{searchState.query}"</h3>
								<p class="text-xs text-text-subtle max-w-xs mx-auto">
									Bạn hãy thử từ khóa như "thân chủ", "bảo mật", "nhà tham vấn"
								</p>
							</div>
						{:else}
							<div class="px-1 text-xs font-bold text-text-subtle">
								<span>Tìm thấy {searchResults.length} kết quả:</span>
							</div>

							<div class="space-y-2.5">
								{#each searchResults as item (item.id)}
									<a
										href={item.link}
										onclick={(e) => navigateToResult(e, item.link)}
										class="sketch-card block p-3.5 rounded-2xl bg-white transition-all group text-left"
									>
										<div class="flex items-center justify-between gap-2 mb-1">
											<span class="sketch-pill text-[10px] font-bold px-2 py-0.5 rounded-md bg-warm-sage text-primary">
												{item.category}
											</span>
											<span class="material-symbols-outlined text-xs text-text-subtle group-hover:text-primary group-hover:translate-x-1 transition-transform">
												arrow_forward
											</span>
										</div>
										<h4 class="font-black text-sm text-text-main group-hover:text-primary transition-colors">
											{item.title}
										</h4>
										<p class="text-xs text-text-subtle line-clamp-2 mt-0.5 leading-relaxed">
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
			<div class="p-3 border-t-1.5 border-sketch-border bg-surface-container-low flex items-center justify-between text-xs text-text-subtle px-4">
				<span>Phím <kbd class="px-1.5 py-0.5 rounded-md bg-white border border-sketch-border font-mono text-[10px] font-bold">ESC</kbd> để đóng</span>
				<WiredButton onclick={closeSearch} fill="#FFFFFF">
					<span>Đóng</span>
				</WiredButton>
			</div>
		</div>
	</div>
{/if}
