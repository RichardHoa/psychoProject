<script>
	import { SEARCH_DATABASE } from '$lib/data/searchData.js';
	import { m } from '$lib/paraglide/messages.js';

	/** @type {{ initialQuery?: string }} */
	let { initialQuery = '' } = $props();

	let query = $state('');
	let isListening = $state(false);
	let voiceError = $state('');

	// Sync initialQuery prop
	$effect(() => {
		if (initialQuery) {
			query = initialQuery;
		}
	});

	let trimmedQuery = $derived(query.trim().toLowerCase());

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
				query = transcript;
				isListening = false;
			};

			recognition.onerror = () => {
				voiceError = 'Không thể nhận diện giọng nói. Bạn hãy thử lại hoặc gõ phím nhé!';
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

	/** @param {string} term */
	function setSuggestion(term) {
		query = term;
	}
</script>

<div class="w-full flex flex-col items-center gap-5 font-body">
	<div class="w-full max-w-3xl relative group">
		<div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
			<span class="material-symbols-outlined text-outline text-2xl sm:text-3xl">search</span>
		</div>

		<input
			type="text"
			bind:value={query}
			class="w-full h-16 sm:h-18 pl-14 sm:pl-16 pr-16 bg-surface-container-low border border-surface-variant rounded-full shadow-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-medium text-base sm:text-lg transition-all outline-none"
			placeholder={m.home_search_placeholder()}
		/>

		<div class="absolute inset-y-0 right-4 flex items-center gap-1">
			<button
				onclick={toggleVoiceSearch}
				title="Tìm kiếm bằng giọng nói"
				class="p-3 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer {isListening
					? 'text-emergency-red animate-pulse'
					: 'text-primary'}"
			>
				<span class="material-symbols-outlined text-2xl sm:text-3xl">mic</span>
			</button>
		</div>
	</div>

	<!-- Voice Status Indicator -->
	{#if isListening}
		<div class="flex items-center gap-2 text-primary font-semibold text-base fade-in">
			<span class="recording-wave"></span>
			<span class="recording-wave"></span>
			<span class="recording-wave"></span>
			Đang lắng nghe... Hãy nói từ khóa bạn cần tìm!
		</div>
	{/if}

	{#if voiceError}
		<div class="text-base text-emergency-red fade-in">
			{voiceError}
		</div>
	{/if}

	<!-- Suggestion Pills -->
	<div class="flex flex-wrap justify-center gap-2.5 text-base">
		<span class="text-outline py-1 font-medium">Gợi ý tìm kiếm:</span>
		<button
			onclick={() => setSuggestion('Thân chủ')}
			class="bg-surface-container-low hover:bg-primary/10 text-on-surface border border-surface-variant px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
		>
			Thân chủ - Client
		</button>
		<button
			onclick={() => setSuggestion('Bảo mật')}
			class="bg-surface-container-low hover:bg-primary/10 text-on-surface border border-surface-variant px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
		>
			Bảo mật tham vấn
		</button>
		<button
			onclick={() => setSuggestion('Quyền thân chủ')}
			class="bg-surface-container-low hover:bg-primary/10 text-on-surface border border-surface-variant px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
		>
			Quyền của thân chủ
		</button>
		<button
			onclick={() => setSuggestion('Nhà tham vấn')}
			class="bg-surface-container-low hover:bg-primary/10 text-on-surface border border-surface-variant px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
		>
			Nhà tham vấn làm gì?
		</button>
	</div>

	<!-- Search Results Grid -->
	{#if showResults}
		<div class="w-full max-w-3xl mt-2 fade-in">
			{#if searchResults.length === 0}
				<div
					class="p-6 text-center text-on-surface-variant bg-surface-container-low rounded-2xl border border-surface-variant"
				>
					<span class="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
					<p class="font-semibold text-base">Không tìm thấy kết quả phù hợp với "{query}"</p>
					<p class="text-base mt-1">
						Gợi ý: Thử từ khóa như "thân chủ", "bảo mật", "quyền thân chủ" hoặc "nhà tham vấn".
					</p>
				</div>
			{:else}
				<div class="flex justify-between items-center mb-3">
					<span class="text-base font-semibold text-outline">
						Tìm thấy {searchResults.length} kết quả phù hợp:
					</span>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each searchResults as item (item.id)}
						<a
							href={item.link}
							class="bg-surface-off-white hover:bg-surface-container-low p-5 rounded-2xl border border-surface-variant shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
						>
							<div>
								<div class="flex items-center justify-between mb-2">
									<span
										class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold"
									>
										{item.category}
									</span>
								</div>
								<h4
									class="font-bold text-on-surface text-lg mb-1.5 group-hover:text-primary transition-colors"
								>
									{item.title}
								</h4>
								<p class="text-base text-on-surface-variant leading-relaxed line-clamp-2">
									{item.desc}
								</p>
							</div>
							<div
								class="mt-4 pt-3 border-t border-surface-variant/50 flex items-center justify-between text-base text-primary font-semibold"
							>
								<span>{m.read_article()}</span>
								<span
									class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform"
								>
									arrow_forward
								</span>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
