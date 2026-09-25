<script>
	import { roughLine } from '$lib/wired/rough.js';

	/**
	 * @type {{
	 *   stroke?: string,
	 *   strokeWidth?: number,
	 *   roughness?: number,
	 *   seed?: number,
	 *   class?: string
	 * }}
	 */
	let {
		stroke = '#242B28',
		strokeWidth = 1.4,
		roughness = 1.3,
		seed = 1,
		class: className = ''
	} = $props();

	const drawing = $derived(roughLine({ stroke, strokeWidth, roughness, seed }));
</script>

<svg
	class="block h-2 w-full overflow-visible {className}"
	viewBox={drawing.viewBox}
	preserveAspectRatio="none"
	aria-hidden="true"
	focusable="false"
>
	{#each drawing.paths as path, i (i)}
		<path
			d={path.d}
			fill="none"
			stroke={path.stroke}
			stroke-width={path.strokeWidth}
			vector-effect="non-scaling-stroke"
		/>
	{/each}
</svg>
