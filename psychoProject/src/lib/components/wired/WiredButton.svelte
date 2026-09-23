<script>
	import { onMount } from 'svelte';
	import rough from 'roughjs';

	/**
	 * @type {{
	 *   type?: 'button' | 'submit' | 'reset',
	 *   onclick?: (e: MouseEvent) => void,
	 *   fill?: string,
	 *   stroke?: string,
	 *   strokeWidth?: number,
	 *   roughness?: number,
	 *   bowing?: number,
	 *   class?: string,
	 *   disabled?: boolean,
	 *   title?: string,
	 *   ariaLabel?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		type = 'button',
		onclick,
		fill = '#FAF4E8',
		stroke = '#242B28',
		strokeWidth = 1.6,
		roughness = 1.1,
		bowing = 0.8,
		class: className = '',
		disabled = false,
		title,
		ariaLabel,
		children
	} = $props();

	/** @type {SVGSVGElement | undefined} */
	let svgElement = $state();
	/** @type {HTMLButtonElement | undefined} */
	let buttonElement = $state();
	let width = $state(0);
	let height = $state(0);
	let isHovered = $state(false);
	let isPressed = $state(false);

	function drawButton() {
		if (!svgElement || width <= 0 || height <= 0) return;

		while (svgElement.firstChild) {
			svgElement.removeChild(svgElement.firstChild);
		}

		const rc = rough.svg(svgElement);
		const pad = 2;
		const w = Math.max(width - pad * 2, 8);
		const h = Math.max(height - pad * 2, 8);

		// Shadow offset
		const shadowOffset = isPressed ? 1 : isHovered ? 3 : 2;
		const shadow = rc.rectangle(pad + shadowOffset, pad + shadowOffset, w, h, {
			roughness: 0.8,
			bowing,
			stroke: 'transparent',
			fill: 'rgba(36, 43, 40, 0.22)',
			fillStyle: 'solid'
		});
		svgElement.appendChild(shadow);

		// Main button rect
		const btn = rc.rectangle(pad, pad, w, h, {
			roughness,
			bowing,
			stroke,
			strokeWidth,
			fill,
			fillStyle: 'solid'
		});
		svgElement.appendChild(btn);
	}

	onMount(() => {
		if (!buttonElement) return;

		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				let w = 0;
				let h = 0;
				if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
					w = entry.borderBoxSize[0].inlineSize;
					h = entry.borderBoxSize[0].blockSize;
				} else if (buttonElement) {
					w = buttonElement.offsetWidth;
					h = buttonElement.offsetHeight;
				} else {
					w = entry.contentRect.width;
					h = entry.contentRect.height;
				}
				if (w > 0 && h > 0) {
					width = Math.round(w);
					height = Math.round(h);
					drawButton();
				}
			}
		});

		ro.observe(buttonElement);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (width > 0 && height > 0 && (isHovered !== undefined || isPressed !== undefined || fill || stroke)) {
			drawButton();
		}
	});
</script>

<button
	{type}
	{onclick}
	{disabled}
	{title}
	aria-label={ariaLabel}
	bind:this={buttonElement}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => {
		isHovered = false;
		isPressed = false;
	}}
	onmousedown={() => (isPressed = true)}
	onmouseup={() => (isPressed = false)}
	class="relative group transition-all duration-100 inline-flex items-center justify-center cursor-pointer select-none px-3 py-1.5 {disabled ? 'opacity-50 cursor-not-allowed' : ''} {className}"
>
	<!-- Rough SVG underlay -->
	<svg
		bind:this={svgElement}
		class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
		width={width || '100%'}
		height={height || '100%'}
	></svg>

	<!-- Button Content -->
	<div class="relative z-10 flex items-center justify-center gap-1.5 text-xs font-bold text-text-main {isPressed ? 'translate-x-0.5 translate-y-0.5' : ''}">
		{@render children?.()}
	</div>
</button>
