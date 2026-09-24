<script>
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * @typedef {{ id: string, label: string, icon?: string, href?: string }} Crumb
	 */

	/**
	 * @type {{
	 *   crumbs: Crumb[],
	 *   backHref?: string
	 * }}
	 */
	let { crumbs = [], backHref } = $props();
</script>

<div
	class="border-b-1.5 border-sketch-border sticky top-0 z-30 flex w-full items-center gap-2 bg-surface-off-white px-3.5 py-2 shadow-xs transition-all"
>
	{#if backHref && crumbs.length > 1}
		<a
			href={backHref}
			class="sketch-button flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-primary transition-all active:scale-95"
			aria-label={m.btn_back()}
			title={m.btn_back()}
		>
			<RoughIcon name="arrow_back" size={16} stroke="#1F523D" strokeWidth={1.8} />
		</a>
	{/if}

	<!-- Horizontal scrollable breadcrumb trail -->
	<nav
		aria-label="Breadcrumb"
		class="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5 text-xs font-medium text-text-subtle sm:text-sm"
	>
		{#each crumbs as crumb, index (crumb.id)}
			{@const isLast = index === crumbs.length - 1}
			<div class="flex shrink-0 items-center gap-1.5">
				{#if index > 0}
					<span class="text-xs text-text-subtle/60 select-none" aria-hidden="true">→</span>
				{/if}

				{#if isLast}
					<span
						aria-current="page"
						class="sketch-pill inline-flex items-center gap-1 rounded-xl bg-warm-sage px-2.5 py-1 font-bold text-primary"
					>
						{#if crumb.icon}
							<RoughIcon name={crumb.icon} size={15} stroke="#1F523D" strokeWidth={1.8} />
						{/if}
						<span class="xs:max-w-[180px] max-w-[140px] truncate sm:max-w-[220px]"
							>{crumb.label}</span
						>
					</span>
				{:else}
					<a
						href={crumb.href}
						class="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-text-main transition-colors hover:bg-surface-container-low hover:text-primary"
					>
						{#if crumb.icon}
							<RoughIcon name={crumb.icon} size={15} stroke="#5A6561" strokeWidth={1.8} />
						{/if}
						<span class="xs:max-w-[130px] max-w-[110px] truncate">{crumb.label}</span>
					</a>
				{/if}
			</div>
		{/each}
	</nav>
</div>
