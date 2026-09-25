import rough from 'roughjs';

/**
 * Hand-drawn shapes computed as plain SVG path strings with rough.js's generator (no DOM), from a
 * fixed seed: the server and the browser produce identical markup, so borders are in the HTML
 * from the first byte and hydration never redraws them.
 *
 * Shapes are drawn once in a fixed coordinate box and stretched to the element with
 * `preserveAspectRatio="none"` (strokes use `vector-effect="non-scaling-stroke"`). Pick the preset
 * closest to the element's proportions so the wobble isn't visibly stretched.
 */
export const SHAPES = /** @type {const} */ ({
	square: [120, 120],
	wide: [240, 80],
	banner: [360, 110],
	bar: [480, 60]
});

/** @typedef {keyof typeof SHAPES} Shape */
/** @typedef {{ d: string, stroke: string, strokeWidth: number, fill: string }} RoughPath */

const PAD = 2;
const generator = rough.generator();
/** @type {Map<string, any>} */
const cache = new Map();

/** @param {import('roughjs/bin/core').Drawable} drawable @returns {RoughPath[]} */
function toPaths(drawable) {
	return generator.toPaths(drawable).map(({ d, stroke, strokeWidth, fill }) => ({
		d,
		stroke,
		strokeWidth,
		fill: fill ?? 'none'
	}));
}

/**
 * @param {string} key
 * @param {() => any} compute
 */
function memo(key, compute) {
	let value = cache.get(key);
	if (!value) {
		value = compute();
		cache.set(key, value);
	}
	return value;
}

/**
 * A sketchy rectangle, plus its solid offset shadow.
 * @param {{
 *   shape?: Shape,
 *   fill: string,
 *   stroke: string,
 *   strokeWidth: number,
 *   roughness: number,
 *   bowing: number,
 *   seed?: number,
 *   shadowFill?: string | null
 * }} options
 * @returns {{ viewBox: string, box: RoughPath[], shadow: RoughPath[] }}
 */
export function roughRect({
	shape = 'wide',
	fill,
	stroke,
	strokeWidth,
	roughness,
	bowing,
	seed = 1,
	shadowFill = null
}) {
	const key = JSON.stringify([
		'rect',
		shape,
		fill,
		stroke,
		strokeWidth,
		roughness,
		bowing,
		seed,
		shadowFill
	]);
	return memo(key, () => {
		const [w, h] = SHAPES[shape];
		const common = { bowing, seed, fillStyle: 'solid' };
		return {
			viewBox: `0 0 ${w} ${h}`,
			box: toPaths(
				generator.rectangle(PAD, PAD, w - PAD * 2, h - PAD * 2, {
					...common,
					roughness,
					stroke,
					strokeWidth,
					fill
				})
			),
			shadow: shadowFill
				? toPaths(
						generator.rectangle(PAD, PAD, w - PAD * 2, h - PAD * 2, {
							...common,
							seed: seed + 1,
							roughness: Math.max(roughness * 0.8, 0.8),
							stroke: 'none',
							fill: shadowFill
						})
					)
				: []
		};
	});
}

/**
 * A sketchy horizontal line across a 240×8 box.
 * @param {{ stroke: string, strokeWidth: number, roughness: number, seed?: number }} options
 * @returns {{ viewBox: string, paths: RoughPath[] }}
 */
export function roughLine({ stroke, strokeWidth, roughness, seed = 1 }) {
	const key = JSON.stringify(['line', stroke, strokeWidth, roughness, seed]);
	return memo(key, () => ({
		viewBox: '0 0 240 8',
		paths: toPaths(generator.line(2, 4, 238, 4, { roughness, stroke, strokeWidth, seed }))
	}));
}
