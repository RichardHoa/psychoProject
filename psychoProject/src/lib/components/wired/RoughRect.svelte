<script>
	import { roughRect } from '$lib/wired/rough.js';

	/**
	 * The hand-drawn border + offset shadow behind a Wired* element, rendered as static SVG so it
	 * is part of the server HTML. Hover/press only move the shadow, in CSS (see layout.css).
	 * @type {Parameters<typeof roughRect>[0]}
	 */
	let props = $props();

	const drawing = $derived(roughRect(props));
</script>

{#if drawing.shadow.length}
	<svg
		class="wired-shadow"
		viewBox={drawing.viewBox}
		preserveAspectRatio="none"
		aria-hidden="true"
		focusable="false"
	>
		{#each drawing.shadow as path, i (i)}
			<path d={path.d} fill={path.fill} stroke="none" />
		{/each}
	</svg>
{/if}
<svg
	class="wired-box"
	viewBox={drawing.viewBox}
	preserveAspectRatio="none"
	aria-hidden="true"
	focusable="false"
>
	{#each drawing.box as path, i (i)}
		<path
			d={path.d}
			fill={path.fill}
			stroke={path.stroke}
			stroke-width={path.strokeWidth}
			vector-effect="non-scaling-stroke"
		/>
	{/each}
</svg>
