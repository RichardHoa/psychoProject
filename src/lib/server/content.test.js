import { describe, expect, it } from 'vitest';
import { readingMinutes } from './content.js';

/** @param {number} n */
const words = (n) => Array.from({ length: n }, () => 'chữ').join(' ');

const folder = {
	id: 'x',
	title: 'Hai chữ',
	shortTitle: 'x',
	summary: 'Ba chữ nữa',
	nextReason: '',
	subfolders: [
		{
			id: 'a',
			title: 'Một',
			items: [{ title: 'Bốn chữ ở đây', short: words(190), detail: words(400) }]
		},
		{ id: 'b', title: 'Một', detailOnly: true, items: [{ title: words(300) }] }
	]
};

describe('reading time', () => {
	it('counts only what the short version shows, rounding up', () => {
		// 2 + 3 + 1 + 4 + 190 = 200 words: exactly one minute.
		expect(readingMinutes(folder, false)).toBe(1);
	});

	it('counts detailed text and detail-only sections in the detailed version', () => {
		// 2 + 3 + 1 + 4 + 400 + 1 + 300 = 711 words.
		expect(readingMinutes(folder, true)).toBe(4);
	});

	it('is at least one minute', () => {
		expect(readingMinutes({ ...folder, subfolders: [] }, false)).toBe(1);
	});
});
