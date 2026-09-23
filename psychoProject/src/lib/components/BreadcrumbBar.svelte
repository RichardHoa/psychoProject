<script>
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * @typedef {{ id: string, label: string, icon?: string, onClick?: () => void }} Crumb
	 */

	/**
	 * @type {{
	 *   crumbs: Crumb[],
	 *   onBack?: () => void
	 * }}
	 */
	let { crumbs = [], onBack } = $props();
</script>

<div class="sticky top-0 z-30 w-full bg-surface-off-white border-b-1.5 border-sketch-border px-3.5 py-2 flex items-center gap-2 shadow-xs transition-all">
	{#if onBack && crumbs.length > 1}
		<button
			type="button"
			onclick={onBack}
			class="sketch-button shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-white text-primary active:scale-95 transition-all cursor-pointer"
			aria-label={m.btn_back()}
			title={m.btn_back()}
		>
			<RoughIcon name="arrow_back" size={16} stroke="#1F523D" strokeWidth={1.8} />
		</button>
	{/if}

	<!-- Horizontal scrollable breadcrumb trail -->
	<nav class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs sm:text-sm font-medium text-text-subtle flex-1 min-w-0">
		{#each crumbs as crumb, index (crumb.id || index)}
			{@const isLast = index === crumbs.length - 1}
			<div class="flex items-center gap-1.5 shrink-0">
				{#if index > 0}
					<span class="text-text-subtle/60 text-xs select-none">→</span>
				{/if}

				{#if isLast}
					<span class="sketch-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-warm-sage text-primary font-bold">
						{#if crumb.icon}
							<RoughIcon name={crumb.icon} size={15} stroke="#1F523D" strokeWidth={1.8} />
						{/if}
						<span class="truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[220px]">{crumb.label}</span>
					</span>
				{:else}
					<button
						type="button"
						onclick={crumb.onClick}
						class="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-container-low text-text-main font-semibold hover:text-primary transition-colors cursor-pointer"
					>
						{#if crumb.icon}
							<RoughIcon name={crumb.icon} size={15} stroke="#5A6561" strokeWidth={1.8} />
						{/if}
						<span class="truncate max-w-[110px] xs:max-w-[130px]">{crumb.label}</span>
					</button>
				{/if}
			</div>
		{/each}
	</nav>
</div>
