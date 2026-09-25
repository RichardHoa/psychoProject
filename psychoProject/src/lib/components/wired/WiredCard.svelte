<script>
	import RoughRect from './RoughRect.svelte';

	/**
	 * @type {{
	 *   as?: 'div' | 'button' | 'a',
	 *   type?: 'button' | 'submit' | 'reset',
	 *   href?: string,
	 *   target?: string,
	 *   rel?: string,
	 *   fill?: string,
	 *   stroke?: string,
	 *   strokeWidth?: number,
	 *   roughness?: number,
	 *   bowing?: number,
	 *   shape?: import('$lib/wired/rough.js').Shape,
	 *   seed?: number,
	 *   class?: string,
	 *   elevation?: boolean,
	 *   tilt?: number,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		as = 'div',
		type = 'button',
		href,
		target,
		rel,
		fill = '#FFFFFF',
		stroke = '#242B28',
		strokeWidth = 1.6,
		roughness = 1.2,
		bowing = 1.0,
		shape = 'banner',
		seed = 1,
		class: className = '',
		elevation = true,
		tilt = 0,
		children
	} = $props();

	const interactive = $derived(as !== 'div');
</script>

<svelte:element
	this={as}
	type={as === 'button' ? type : undefined}
	href={as === 'a' ? href : undefined}
	target={as === 'a' ? target : undefined}
	rel={as === 'a' ? rel : undefined}
	style:rotate={tilt ? `${tilt}deg` : undefined}
	class="wired wired-card group relative {interactive
		? 'block cursor-pointer text-left select-none active:scale-[0.98]'
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
		shadowFill={elevation ? 'rgba(36, 43, 40, 0.18)' : null}
	/>
	<div class="relative z-10 h-full w-full">
		{@render children?.()}
	</div>
</svelte:element>
