<script>
	import { onMount } from 'svelte';
	import rough from 'roughjs';

	/**
	 * @type {{
	 *   stroke?: string,
	 *   strokeWidth?: number,
	 *   roughness?: number,
	 *   class?: string
	 * }}
	 */
	let {
		stroke = '#242B28',
		strokeWidth = 1.4,
		roughness = 1.3,
		class: className = ''
	} = $props();

	/** @type {SVGSVGElement | undefined} */
	let svgElement = $state();
	/** @type {HTMLElement | undefined} */
	let containerElement = $state();
	let width = $state(0);

	function drawLine() {
		if (!svgElement || width <= 0) return;

		while (svgElement.firstChild) {
			svgElement.removeChild(svgElement.firstChild);
		}

		const rc = rough.svg(svgElement);
		const line = rc.line(2, 4, width - 2, 4, {
			roughness,
			stroke,
			strokeWidth
		});
		svgElement.appendChild(line);
	}

	onMount(() => {
		if (!containerElement) return;

		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				let w = 0;
				if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
					w = entry.borderBoxSize[0].inlineSize;
				} else if (containerElement) {
					w = containerElement.offsetWidth;
				} else {
					w = entry.contentRect.width;
				}
				if (w > 0) {
					width = Math.round(w);
					drawLine();
				}
			}
		});

		ro.observe(containerElement);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (width > 0 && stroke) {
			drawLine();
		}
	});
</script>

<div bind:this={containerElement} class="w-full h-2 relative flex items-center {className}">
	<svg
		bind:this={svgElement}
		class="w-full h-full pointer-events-none overflow-visible"
		width={width || '100%'}
		height="8"
	></svg>
</div>
