import { describe, expect, it } from 'vitest';
import { slideDirection } from './transitions.js';

/** @param {string} path */
const url = (path) => new URL(path, 'https://example.com');

describe('slideDirection', () => {
	it('slides forward from the Landing page to the Journey', () => {
		expect(slideDirection(url('/trang-chu'), url('/hanh-trinh'))).toBe('forward');
	});

	it('slides back from the Journey to the Landing page', () => {
		expect(slideDirection(url('/hanh-trinh'), url('/trang-chu'))).toBe('back');
	});

	it('slides forward from a step on a Trail to the Journey', () => {
		expect(
			slideDirection(url('/hanh-trinh/than-chu?lo-trinh=sinh-vien.thi-cu'), url('/hanh-trinh'))
		).toBe('forward');
	});

	it.each([
		['/hanh-trinh/than-chu', '/hanh-trinh'],
		['/hanh-trinh', '/hanh-trinh/than-chu'],
		['/hanh-trinh/than-chu', '/trang-chu'],
		['/hanh-trinh/than-chu?lo-trinh=sinh-vien.thi-cu', '/trang-chu'],
		['/trang-chu', '/tim-kiem']
	])('does not slide from %s to %s', (from, to) => {
		expect(slideDirection(url(from), url(to))).toBeNull();
	});

	it('does not slide on the first page load', () => {
		expect(slideDirection(undefined, url('/hanh-trinh'))).toBeNull();
	});
});
