<script>
	import { onMount, untrack } from 'svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * Search form + results, shared by the /tim-kiem page and its overlay version.
	 * Without JavaScript it is a plain GET form and plain links. With JavaScript, `onQuery`
	 * takes over and results update as you type.
	 * @type {{
	 *   query: string,
	 *   results: import('$lib/server/search.js').SearchResult[],
	 *   suggestions: { label: string, icon: string }[],
	 *   autofocus?: boolean,
	 *   onQuery?: (query: string) => unknown
	 * }}
	 */
	let { query, results, suggestions, autofocus = false, onQuery } = $props();

	const TYPE_DEBOUNCE_MS = 200;

	// The input is owned locally after the first render: syncing it from `query` on every
	// response would overwrite whatever the visitor typed while the request was in flight.
	let value = $state(untrack(() => query));
	/** @type {HTMLInputElement | undefined} */
	let input = $state();
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let typingTimer;

	const hasQuery = $derived(query.trim().length > 0);

	/** @param {string} next */
	function runNow(next) {
		clearTimeout(typingTimer);
		value = next;
		onQuery?.(next.trim());
	}

	/** @param {Event & { currentTarget: HTMLInputElement }} e */
	function handleInput(e) {
		value = e.currentTarget.value;
		clearTimeout(typingTimer);
		typingTimer = setTimeout(() => onQuery?.(value.trim()), TYPE_DEBOUNCE_MS);
	}

	/** @param {SubmitEvent} e */
	function handleSubmit(e) {
		if (!onQuery) return;
		e.preventDefault();
		runNow(value);
	}

	/**
	 * Chips and "clear" are links (so they work without JavaScript); with it, they update in place.
	 * @param {MouseEvent} e
	 * @param {string} next
	 */
	function handleLink(e, next) {
		if (!onQuery) return;
		e.preventDefault();
		runNow(next);
		input?.focus();
	}

	/** @type {import('svelte/attachments').Attachment<HTMLInputElement>} */
	function focusOnMount(el) {
		if (autofocus) el.focus();
	}

	// ---- Voice search (JavaScript-only enhancement, shown only where the browser supports it) ----
	/** @type {any} */
	let SpeechRecognition = $state(null);
	let isListening = $state(false);
	let voiceError = $state('');
	/** @type {any} */
	let recognition = null;

	onMount(() => {
		// @ts-ignore - vendor-prefixed, not in lib.dom
		SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
		return () => {
			clearTimeout(typingTimer);
			recognition?.stop();
		};
	});

	function toggleVoiceSearch() {
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
				runNow(event.results[0][0].transcript);
				isListening = false;
			};
			recognition.onerror = () => {
				voiceError = m.search_voice_error();
				isListening = false;
			};
			recognition.onend = () => {
				isListening = false;
			};

			recognition.start();
		} catch {
			voiceError = m.search_voice_error();
			isListening = false;
		}
	}
</script>

<div class="flex min-h-0 flex-1 flex-col">
	<!-- Top Bar / Input -->
	<div class="border-b-1.5 border-sketch-border sticky top-0 z-20 bg-surface-off-white p-4 sm:p-5">
		<form
			method="GET"
			action="/tim-kiem"
			role="search"
			onsubmit={handleSubmit}
			class="relative flex items-center"
		>
			<div class="pointer-events-none absolute left-4 flex items-center">
				<RoughIcon name="search" size={22} stroke="#1F523D" strokeWidth={1.8} />
			</div>

			<input
				type="search"
				name="q"
				bind:this={input}
				{value}
				oninput={handleInput}
				autocomplete="off"
				enterkeyhint="search"
				aria-label={m.search_open()}
				placeholder={m.home_search_placeholder()}
				class="border-1.5 border-sketch-border h-13 w-full rounded-2xl bg-white pr-24 pl-12 text-sm font-bold text-text-main shadow-xs outline-hidden transition-all placeholder:text-text-subtle/70 sm:text-base [&::-webkit-search-cancel-button]:hidden"
				{@attach focusOnMount}
			/>

			<div class="absolute right-2.5 flex items-center gap-1.5">
				{#if value}
					<a
						href="/tim-kiem"
						onclick={(e) => handleLink(e, '')}
						class="rounded-full p-1.5 text-text-subtle hover:text-text-main"
						title={m.search_clear()}
						aria-label={m.search_clear()}
					>
						<RoughIcon name="close" size={16} stroke="currentColor" strokeWidth={1.8} />
					</a>
				{/if}

				{#if SpeechRecognition}
					<button
						type="button"
						onclick={toggleVoiceSearch}
						title={m.search_voice()}
						aria-label={m.search_voice()}
						aria-pressed={isListening}
						class="sketch-button flex items-center justify-center rounded-xl p-2 transition-all {isListening
							? 'animate-pulse bg-emergency-red text-white'
							: 'bg-warm-sage text-primary'}"
					>
						<RoughIcon name="mic" size={18} stroke="currentColor" strokeWidth={1.8} />
					</button>
				{:else}
					<button
						type="submit"
						class="sketch-button rounded-xl bg-warm-sage px-2.5 py-1.5 text-xs font-black text-primary"
					>
						{m.search_submit()}
					</button>
				{/if}
			</div>
		</form>

		{#if isListening}
			<p class="fade-in mt-2.5 px-2 text-xs font-bold text-primary" role="status">
				{m.search_listening()}
			</p>
		{/if}

		{#if voiceError}
			<p class="fade-in mt-2 px-2 text-xs font-bold text-emergency-red" role="alert">
				{voiceError}
			</p>
		{/if}
	</div>

	<!-- Body -->
	<div class="min-h-[200px] flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite">
		{#if !hasQuery}
			<div class="fade-in space-y-3.5 py-1">
				<div class="flex items-center justify-between px-1">
					<span class="text-xs font-bold tracking-wider text-text-subtle uppercase">
						{m.search_suggestions()}
					</span>
					<span class="text-[11px] text-text-subtle">{m.search_suggestions_hint()}</span>
				</div>

				<div class="grid grid-cols-2 gap-2.5">
					{#each suggestions as chip (chip.label)}
						<a
							href="/tim-kiem?q={encodeURIComponent(chip.label)}"
							onclick={(e) => handleLink(e, chip.label)}
							class="sketch-button inline-flex items-center justify-start gap-2.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-text-main transition-all active:scale-95 sm:text-sm"
						>
							<RoughIcon name={chip.icon} size={18} stroke="#1F523D" strokeWidth={1.8} />
							<span class="truncate">{chip.label}</span>
						</a>
					{/each}
				</div>
			</div>
		{:else if results.length === 0}
			<div class="fade-in space-y-2 py-10 text-center text-text-subtle">
				<h2 class="text-sm font-bold text-text-main">{m.search_no_results({ query })}</h2>
				<p class="mx-auto max-w-xs text-xs text-text-subtle">{m.search_no_results_hint()}</p>
			</div>
		{:else}
			<div class="fade-in space-y-2.5">
				<p class="px-1 text-xs font-bold text-text-subtle">
					{m.search_result_count({ count: results.length })}
				</p>

				<ul class="space-y-2.5">
					{#each results as item (item.id)}
						<li>
							<a
								href={item.href}
								class="sketch-card group block rounded-2xl bg-white p-3.5 text-left transition-all"
							>
								<span class="mb-1 flex items-center justify-between gap-2">
									<span
										class="sketch-pill truncate rounded-md bg-warm-sage px-2 py-0.5 text-[10px] font-bold text-primary"
									>
										{item.category}
									</span>
									<RoughIcon name="arrow_forward" size={14} stroke="#5A6561" strokeWidth={1.8} />
								</span>
								<span
									class="block text-sm font-black text-text-main transition-colors group-hover:text-primary"
								>
									{item.title}
								</span>
								<span class="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-text-subtle">
									{item.desc}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
