<script>
	import RoughRect from './RoughRect.svelte';

	/**
	 * @type {{
	 *   type?: 'button' | 'submit' | 'reset',
	 *   href?: string,
	 *   target?: string,
	 *   rel?: string,
	 *   formaction?: string,
	 *   onclick?: (e: MouseEvent) => void,
	 *   fill?: string,
	 *   stroke?: string,
	 *   strokeWidth?: number,
	 *   roughness?: number,
	 *   bowing?: number,
	 *   shape?: import('$lib/wired/rough.js').Shape,
	 *   seed?: number,
	 *   class?: string,
	 *   disabled?: boolean,
	 *   title?: string,
	 *   ariaLabel?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		type = 'button',
		href,
		target,
		rel,
		formaction,
		onclick,
		fill = '#FAF4E8',
		stroke = '#242B28',
		strokeWidth = 1.6,
		roughness = 1.1,
		bowing = 0.8,
		shape = 'wide',
		seed = 1,
		class: className = '',
		disabled = false,
		title,
		ariaLabel,
		children
	} = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	type={href ? undefined : type}
	href={href && !disabled ? href : undefined}
	target={href ? target : undefined}
	rel={href ? rel : undefined}
	formaction={href ? undefined : formaction}
	disabled={href ? undefined : disabled}
	aria-disabled={href && disabled ? 'true' : undefined}
	role={href && disabled ? 'link' : undefined}
	{onclick}
	{title}
	aria-label={ariaLabel}
	class="wired wired-button group relative inline-flex cursor-pointer items-center justify-center px-3 py-1.5 select-none {disabled
		? 'cursor-not-allowed opacity-50'
		: ''} {className}"
>
	<RoughRect
		{shape}
		{fill}
		{stroke}
		{strokeWidth}
		{roughness}
		{bowing}
		{seed}
		shadowFill="rgba(36, 43, 40, 0.22)"
	/>

	<span
		class="wired-content relative z-10 flex items-center justify-center gap-1.5 text-xs font-bold text-text-main"
	>
		{@render children?.()}
	</span>
</svelte:element>
