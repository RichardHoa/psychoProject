<script>
	import { onMount } from 'svelte';
	import rough from 'roughjs';

	/**
	 * @type {{
	 *   as?: 'div' | 'button' | 'a',
	 *   type?: 'button' | 'submit' | 'reset',
	 *   href?: string,
	 *   target?: string,
	 *   rel?: string,
	 *   onclick?: (e: MouseEvent) => void,
	 *   fill?: string,
	 *   stroke?: string,
	 *   strokeWidth?: number,
	 *   roughness?: number,
	 *   bowing?: number,
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
		onclick,
		fill = '#FFFFFF',
		stroke = '#242B28',
		strokeWidth = 1.6,
		roughness = 1.2,
		bowing = 1.0,
		class: className = '',
		elevation = true,
		tilt = 0,
		children
	} = $props();

	/** @type {SVGSVGElement | undefined} */
	let svgElement = $state();
	/** @type {HTMLElement | undefined} */
	let containerElement = $state();
	let width = $state(0);
	let height = $state(0);

	function drawCard() {
		if (!svgElement || width <= 0 || height <= 0) return;

		// Clear previous rough elements
		while (svgElement.firstChild) {
			svgElement.removeChild(svgElement.firstChild);
		}

		const rc = rough.svg(svgElement);
		const pad = 3;
		const w = Math.max(width - pad * 2, 10);
		const h = Math.max(height - pad * 2, 10);

		// Draw shadow offset if elevation enabled
		if (elevation) {
			const shadow = rc.rectangle(pad + 3, pad + 3, w, h, {
				roughness: Math.max(roughness * 0.8, 0.8),
				bowing,
				stroke: 'transparent',
				fill: 'rgba(36, 43, 40, 0.18)',
				fillStyle: 'solid'
			});
			svgElement.appendChild(shadow);
		}

		// Draw main hand-drawn card box
		const box = rc.rectangle(pad, pad, w, h, {
			roughness,
			bowing,
			stroke,
			strokeWidth,
			fill,
			fillStyle: 'solid'
		});
		svgElement.appendChild(box);
	}

	onMount(() => {
		if (!containerElement) return;

		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				let w = 0;
				let h = 0;
				if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
					w = entry.borderBoxSize[0].inlineSize;
					h = entry.borderBoxSize[0].blockSize;
				} else if (containerElement) {
					w = containerElement.offsetWidth;
					h = containerElement.offsetHeight;
				} else {
					w = entry.contentRect.width;
					h = entry.contentRect.height;
				}
				if (w > 0 && h > 0) {
					width = Math.round(w);
					height = Math.round(h);
					drawCard();
				}
			}
		});

		ro.observe(containerElement);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (width > 0 && height > 0 && fill && stroke) {
			drawCard();
		}
	});
</script>

{#if as === 'button'}
	<button
		type={type}
		{onclick}
		bind:this={containerElement}
		style="transform: rotate({tilt}deg);"
		style:--wired-fill={fill}
		style:--wired-stroke={stroke}
		class="wired relative group transition-all duration-150 cursor-pointer active:scale-[0.98] text-left select-none {className}"
	>
		<svg
			bind:this={svgElement}
			class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
			width={width || '100%'}
			height={height || '100%'}
		></svg>
		<div class="relative z-10 w-full h-full">
			{@render children?.()}
		</div>
	</button>
{:else if as === 'a'}
	<a
		{href}
		{target}
		{rel}
		{onclick}
		bind:this={containerElement}
		style="transform: rotate({tilt}deg);"
		style:--wired-fill={fill}
		style:--wired-stroke={stroke}
		class="wired relative group transition-all duration-150 cursor-pointer active:scale-[0.98] block {className}"
	>
		<svg
			bind:this={svgElement}
			class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
			width={width || '100%'}
			height={height || '100%'}
		></svg>
		<div class="relative z-10 w-full h-full">
			{@render children?.()}
		</div>
	</a>
{:else}
	<div
		bind:this={containerElement}
		style="transform: rotate({tilt}deg);"
		style:--wired-fill={fill}
		style:--wired-stroke={stroke}
		class="wired relative group transition-all duration-150 {className}"
	>
		<svg
			bind:this={svgElement}
			class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
			width={width || '100%'}
			height={height || '100%'}
		></svg>
		<div class="relative z-10 w-full h-full">
			{@render children?.()}
		</div>
	</div>
{/if}
