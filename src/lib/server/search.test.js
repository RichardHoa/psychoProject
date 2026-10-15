import { describe, expect, it } from 'vitest';
import { search, searchSuggestions } from './search.js';

describe('search', () => {
	it('returns nothing for an empty query', () => {
		expect(search('   ')).toEqual([]);
	});

	it('matches the step title without diacritics', () => {
		expect(search('bao mat')).toEqual([
			expect.objectContaining({ id: 'bao-mat', href: '/hanh-trinh/bao-mat' })
		]);
	});

	it('matches case-, diacritic- and punctuation-insensitively', () => {
		expect(search('BAO MAT').map((r) => r.id)).toEqual(search('Bảo mật?').map((r) => r.id));
	});

	it('searches step titles only, not section or item headings or body text', () => {
		// An item heading, a section heading, and detailed body text.
		expect(search('bên thứ ba')).toEqual([]);
		expect(search('trong những buổi đầu tiên')).toEqual([]);
		expect(search('gồng mình')).toEqual([]);
	});

	it('offers exactly the two quick-pick questions', () => {
		expect(searchSuggestions().map((s) => s.label)).toEqual([
			'Chuyên gia uy tín',
			'Nhà tham vấn làm gì?'
		]);
	});

	it('finds the matching step for each quick-pick question', () => {
		expect(search('chuyen gia uy tin')[0]).toMatchObject({ id: 'chon-chuyen-gia' });
		expect(search('nha tham van lam gi')[0]).toMatchObject({ id: 'nha-tham-van' });
	});

	it('requires every word to match', () => {
		expect(search('bảo mật xyzzy')).toEqual([]);
	});

	it('offers only suggestions that actually return results', () => {
		for (const { label } of searchSuggestions()) {
			expect(search(label).length, label).toBeGreaterThan(0);
		}
	});
});
