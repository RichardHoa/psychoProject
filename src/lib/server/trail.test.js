import { describe, expect, it } from 'vitest';
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

describe('getPicker', () => {
	it('starts by asking who the visitor is', () => {
		const picker = getPicker(null, null);
		expect(picker.personas.map((p) => p.id)).toEqual(['hoc-sinh', 'phu-huynh', 'da-biet']);
		expect(picker.persona).toBeNull();
		expect(picker.concern).toBeNull();
	});

	it('then lists that persona’s concerns', () => {
		const picker = getPicker('phu-huynh', null);
		expect(picker.persona?.concerns.map((c) => c.id)).toContain('con-khac-la');
		expect(picker.concern).toBeNull();
	});

	it('then gives the answer and the Trail, with section titles and reading time filled in', () => {
		const { concern } = getPicker('phu-huynh', 'con-khac-la');
		expect(concern?.trail.key).toBe('phu-huynh.con-khac-la');
		expect(concern?.trail.stops[0]).toMatchObject({
			step: 'ai-giup-ban',
			sectionTitle: '4 vai trò thường gặp'
		});
		const minutes = concern?.trail.stops.reduce((sum, s) => sum + s.minutes, 0);
		expect(concern?.trail.minutes).toBe(minutes);
	});

	it('ignores unknown or mismatched ids', () => {
		expect(getPicker('nobody', 'con-khac-la').persona).toBeNull();
		expect(getPicker('hoc-sinh', 'con-khac-la').concern).toBeNull();
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
