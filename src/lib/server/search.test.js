import { describe, expect, it } from 'vitest';
import { search, searchSuggestions } from './search.js';

describe('search', () => {
	it('returns nothing for an empty query', () => {
		expect(search('   ')).toEqual([]);
	});

	it('matches without diacritics and ranks the folder first', () => {
		const results = search('bao mat');
		expect(results[0]).toMatchObject({ kind: 'folder', href: '/trang-chu/bao-mat' });
	});

	it('links single items straight to their anchor', () => {
		const results = search('cha mẹ');
		expect(
			results.some(
				(r) => r.href === '/trang-chu/bao-mat#hoi-dap-bao-mat--co-noi-cho-cha-me-toi-khong'
			)
		).toBe(true);
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
