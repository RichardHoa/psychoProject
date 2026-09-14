<script>
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

<div class="sticky top-0 z-30 w-full bg-surface-off-white/95 backdrop-blur-md border-b border-surface-variant px-3 py-2.5 flex items-center gap-2 shadow-xs transition-all">
	{#if onBack && crumbs.length > 1}
		<button
			type="button"
			onclick={onBack}
			class="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-low hover:bg-primary/10 active:scale-95 text-primary border border-surface-variant transition-all cursor-pointer"
			aria-label={m.btn_back()}
			title={m.btn_back()}
		>
			<span class="material-symbols-outlined text-xl">arrow_back</span>
		</button>
	{/if}

	<!-- Horizontal scrollable breadcrumb trail -->
	<nav class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs sm:text-sm font-medium text-on-surface-variant">
		{#each crumbs as crumb, index (crumb.id || index)}
			{@const isLast = index === crumbs.length - 1}
			<div class="flex items-center gap-1 shrink-0">
				{#if index > 0}
					<span class="material-symbols-outlined text-outline text-sm select-none">chevron_right</span>
				{/if}

				{#if isLast}
					<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold shadow-xs">
						{#if crumb.icon}
							<span class="material-symbols-outlined text-base">{crumb.icon}</span>
						{/if}
						<span class="truncate max-w-[160px] sm:max-w-[200px]">{crumb.label}</span>
					</span>
				{:else}
					<button
						type="button"
						onclick={crumb.onClick}
						class="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-container-low active:bg-surface-container hover:text-primary transition-colors cursor-pointer"
					>
						{#if crumb.icon}
							<span class="material-symbols-outlined text-base text-outline">{crumb.icon}</span>
						{/if}
						<span class="truncate max-w-[120px]">{crumb.label}</span>
					</button>
				{/if}
			</div>
		{/each}
	</nav>
</div>
