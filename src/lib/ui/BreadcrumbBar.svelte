<script>
	import { RoughIcon } from '$lib/ui/wired';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * @typedef {{ id: string, label: string, href?: string }} Crumb
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
	class="sticky top-16 z-20 flex w-full items-center gap-2 border-b-[1.5px] border-sketch-border bg-surface-off-white px-3.5 py-2 shadow-xs transition-all"
>
	{#if backHref && crumbs.length > 1}
		<a
			href={backHref}
			class="sketch-button flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-primary transition-all active:scale-95"
			aria-label={m.btn_back()}
			title={m.btn_back()}
		>
			<RoughIcon name="arrow_back" size={16} class="text-primary" strokeWidth={1.8} />
		</a>
	{/if}

	<!-- Horizontal scrollable breadcrumb trail -->
	<nav
		aria-label="Breadcrumb"
		class="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5 text-sm font-medium text-text-subtle"
	>
		{#each crumbs as crumb, index (crumb.id)}
			{@const isLast = index === crumbs.length - 1}
			<div class="flex shrink-0 items-center gap-1.5">
				{#if index > 0}
					<span class="text-sm text-text-subtle/60 select-none" aria-hidden="true">→</span>
				{/if}

				{#if isLast}
					<span
						aria-current="page"
						class="sketch-pill inline-flex items-center gap-1 rounded-xl bg-warm-sage px-2.5 py-1 font-semibold text-primary"
					>
						<span class="max-w-35 truncate xs:max-w-45 sm:max-w-55">{crumb.label}</span>
					</span>
				{:else}
					<a
						href={crumb.href}
						class="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-text-main transition-colors hover:bg-surface-container-low hover:text-primary"
					>
						<span class="max-w-27.5 truncate xs:max-w-32.5">{crumb.label}</span>
					</a>
				{/if}
			</div>
		{/each}
	</nav>
</div>
