import { afterEach, describe, expect, it, vi } from 'vitest';
import { FOLDERS_DATA } from './folderData.js';
import { PERSONAS } from './trailData.js';
import { getPicker, getTrailPosition } from './trail.js';

describe('trail content', () => {
	const concerns = PERSONAS.flatMap((p) => p.concerns.map((c) => ({ persona: p, concern: c })));

	it.each(concerns)('$persona.id.$concern.id points at real steps and sections', ({ concern }) => {
		for (const stop of concern.stops) {
			const folder = FOLDERS_DATA.find((f) => f.id === stop.step);
			expect(folder, stop.step).toBeDefined();
			if (stop.section) {
				expect(folder?.subfolders.map((s) => s.id)).toContain(stop.section);
			}
		}
	});

	it.each(concerns)('$persona.id.$concern.id visits each step once', ({ concern }) => {
		// A step page finds its place on the Trail by its id, so a step can't appear twice.
		const steps = concern.stops.map((s) => s.step);
		expect(new Set(steps).size).toBe(steps.length);
	});

	it('uses ids that are unique and safe in a `persona.concern` key', () => {
		const ids = PERSONAS.map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const p of PERSONAS) {
			const concernIds = p.concerns.map((c) => c.id);
			expect(new Set(concernIds).size).toBe(concernIds.length);
			for (const id of [p.id, ...concernIds]) expect(id).toMatch(/^[a-z0-9-]+$/);
		}
	});
});

describe('loading the Trails', () => {
	afterEach(() => {
		vi.doUnmock('./trailData.js');
		vi.resetModules();
	});

	/** @param {{ step: string, section?: string }} stop */
	async function loadWithStop(stop) {
		vi.resetModules();
		vi.doMock('./trailData.js', () => ({
			PERSONAS: [
				{
					id: 'p',
					label: '',
					hint: '',
					concernPrompt: '',
					concerns: [
						{
							id: 'c',
							label: '',
							question: '',
							takeaway: { title: '', points: [] },
							stops: [{ ...stop, title: '', why: '' }]
						}
					]
				}
			]
		}));
		return import('./trail.js');
	}

	it('throws when a stop names an unknown step', async () => {
		await expect(loadWithStop({ step: 'nowhere' })).rejects.toThrow(/nowhere/);
	});

	it('throws when a stop names an unknown section', async () => {
		await expect(loadWithStop({ step: 'bao-mat', section: 'nowhere' })).rejects.toThrow(/nowhere/);
	});
});

describe('getPicker', () => {
	it('starts by asking who the visitor is', () => {
		const picker = getPicker(null, null);
		expect(picker.stage).toBe('persona');
		if (picker.stage !== 'persona') return;
		expect(picker.personas.map((p) => p.id)).toEqual(['hoc-sinh', 'phu-huynh', 'da-biet']);
		expect(picker).not.toHaveProperty('backHref');
	});

	it('then lists that persona’s concerns, going back to the first question', () => {
		const picker = getPicker('phu-huynh', null);
		expect(picker.stage).toBe('concern');
		if (picker.stage !== 'concern') return;
		expect(picker.persona.id).toBe('phu-huynh');
		expect(picker.concerns.map((c) => c.id)).toContain('con-khac-la');
		expect(picker.backHref).toBe('/trang-chu#ban-la-ai');
	});

	it('then gives the answer and the Trail, going back to the persona’s concerns', () => {
		const picker = getPicker('phu-huynh', 'con-khac-la');
		expect(picker.stage).toBe('answer');
		if (picker.stage !== 'answer') return;
		expect(picker.backHref).toBe('/trang-chu?ban-la=phu-huynh#ban-la-ai');
		expect(picker.trail.key).toBe('phu-huynh.con-khac-la');
		expect(picker.trail.stops[0]).toMatchObject({
			step: 'ai-giup-ban',
			section: { id: 'bon-vai-tro', title: '4 vai trò thường gặp' }
		});
		const minutes = picker.trail.stops.reduce((sum, s) => sum + s.minutes, 0);
		expect(picker.trail.minutes).toBe(minutes);
	});

	it('falls back to the earliest valid stage for unknown or mismatched ids', () => {
		expect(getPicker('nobody', 'con-khac-la').stage).toBe('persona');
		const mismatched = getPicker('hoc-sinh', 'con-khac-la');
		expect(mismatched.stage).toBe('concern');
		if (mismatched.stage !== 'concern') return;
		expect(mismatched.persona.id).toBe('hoc-sinh');
	});
});

describe('getTrailPosition', () => {
	it('finds where a step sits on the Trail', () => {
		expect(getTrailPosition('phu-huynh.con-khac-la', 'chon-chuyen-gia')?.index).toBe(1);
	});

	it('is null off the Trail or for an unknown key', () => {
		expect(getTrailPosition(null, 'bao-mat')).toBeNull();
		expect(getTrailPosition('phu-huynh.con-khac-la', 'bao-mat')).toBeNull();
		expect(getTrailPosition('phu-huynh', 'ai-giup-ban')).toBeNull();
		expect(getTrailPosition('x.y', 'ai-giup-ban')).toBeNull();
	});
});
