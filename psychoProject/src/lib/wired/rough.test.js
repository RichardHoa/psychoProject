import { describe, expect, it } from 'vitest';
import { roughLine, roughRect } from './rough.js';

const OPTIONS = {
	fill: '#FFFFFF',
	stroke: '#242B28',
	strokeWidth: 1.6,
	roughness: 1.2,
	bowing: 1,
	shadowFill: 'rgba(36, 43, 40, 0.18)'
};

describe('roughRect', () => {
	it('is deterministic, so server and browser render identical markup', async () => {
		const first = roughRect(OPTIONS);
		// A fresh module instance (as in a separate process) must produce the same paths.
		const { vi } = await import('vitest');
		vi.resetModules();
		const fresh = await import('./rough.js');
		expect(fresh.roughRect(OPTIONS)).toEqual(first);
	});

	it('returns a fill path, a stroke path and a shadow in the preset box', () => {
		const { viewBox, box, shadow } = roughRect({ ...OPTIONS, shape: 'square' });
		expect(viewBox).toBe('0 0 120 120');
		expect(box.some((p) => p.fill === '#FFFFFF')).toBe(true);
		expect(box.some((p) => p.stroke === '#242B28')).toBe(true);
		expect(shadow.length).toBeGreaterThan(0);
		for (const p of [...box, ...shadow]) expect(p.d).toMatch(/^M/);
	});

	it('differs per seed and omits the shadow when not asked for', () => {
		const a = roughRect({ ...OPTIONS, seed: 1 });
		const b = roughRect({ ...OPTIONS, seed: 2 });
		expect(a.box[0].d).not.toBe(b.box[0].d);
		expect(roughRect({ ...OPTIONS, shadowFill: null }).shadow).toEqual([]);
	});
});

describe('roughLine', () => {
	it('is deterministic', () => {
		const opts = { stroke: '#1F523D', strokeWidth: 1.2, roughness: 1 };
		expect(roughLine(opts)).toEqual(roughLine({ ...opts }));
		expect(roughLine(opts).paths[0].d).toMatch(/^M/);
	});
});
