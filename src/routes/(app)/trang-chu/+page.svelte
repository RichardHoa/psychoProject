<script>
	import SearchBar from '$lib/components/SearchBar.svelte';
	import ScreenSlider from '$lib/components/ScreenSlider.svelte';
	import FolderExplorer from '$lib/components/FolderExplorer.svelte';
	import WiredButton from '$lib/components/wired/WiredButton.svelte';
	import WiredDivider from '$lib/components/wired/WiredDivider.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getShell } from '$lib/state/shell.svelte.js';

	let { data } = $props();

	const shell = getShell();
	let hintDismissed = $state(false);
</script>

<svelte:head>
	<title>{m.home_title()}</title>
</svelte:head>

<!-- Usage hint: fades out on its own via CSS after a few seconds, no timer needed. -->
{#if !hintDismissed}
	<div
		class="usage-hint sketch-card absolute right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-2 rounded-2xl bg-warm-cream px-4 py-2.5 text-text-main"
	>
		<div class="flex items-center gap-2 text-xs">
			<RoughIcon name="swipe" size={16} stroke="#1F523D" strokeWidth={1.8} />
			<span><strong>{m.usage_hint_label()}</strong> {m.usage_hint()}</span>
		</div>
		<button
			type="button"
			onclick={() => (hintDismissed = true)}
			class="cursor-pointer rounded-full p-1 text-text-subtle hover:text-text-main"
			aria-label={m.usage_hint_close()}
		>
			<RoughIcon name="close" size={14} stroke="#5A6561" strokeWidth={1.8} />
		</button>
	</div>
{/if}

<ScreenSlider
	label={m.slides_label()}
	slideCount={2}
	onActiveChange={(index) => {
		shell.heroInView = index === 0;
		if (index > 0) hintDismissed = true;
	}}
>
	<!-- SLIDE 0: HAND-DRAWN WARM HERO (LANDING) -->
	<section
		id="gioi-thieu"
		class="slide flex h-full w-full shrink-0 flex-col items-center space-y-6 overflow-y-auto px-5 py-10 pb-20 text-center"
	>
		<div class="flex w-full max-w-sm flex-col items-center space-y-4 pt-10 sm:pt-6">
			<h1 class="text-2xl leading-tight font-black tracking-tight text-text-main sm:text-3xl">
				{m.home_hero_title()}
			</h1>

			<div class="mx-auto max-w-[140px]">
				<WiredDivider stroke="#1F523D" strokeWidth={1.6} roughness={1.4} />
			</div>

			<p class="px-2 text-xs leading-relaxed text-text-subtle sm:text-sm">
				{m.home_hero_desc()}
			</p>

			<div class="w-full pt-2">
				<SearchBar />
			</div>

			<div class="flex w-full justify-center pt-4">
				<WiredButton href="#chu-de" fill="#EAF2EC" class="px-5 py-2.5 text-sm">
					<span>{m.home_explore_topics()}</span>
					<RoughIcon name="arrow_forward" size={18} stroke="#1F523D" strokeWidth={1.8} />
				</WiredButton>
			</div>
		</div>
	</section>

	<!-- SLIDE 1: 4 FOLDERS KNOWLEDGE HUB -->
	<section id="chu-de" class="slide flex h-full w-full shrink-0 flex-col">
		<FolderExplorer folders={data.folders} />
	</section>
</ScreenSlider>

<style>
	.usage-hint {
		animation:
			hintIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both,
			hintOut 0.5s ease-in 6s forwards;
	}

	@keyframes hintIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes hintOut {
		to {
			opacity: 0;
			visibility: hidden;
		}
	}
</style>
