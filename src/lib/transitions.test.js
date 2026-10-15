import { describe, expect, it } from 'vitest';
import { slideDirection } from './transitions.js';

describe('slideDirection', () => {
	it('slides forward from the Landing page to the Journey', () => {
		expect(slideDirection('/trang-chu', '/hanh-trinh')).toBe('forward');
	});

	it('slides back from the Journey to the Landing page', () => {
		expect(slideDirection('/hanh-trinh', '/trang-chu')).toBe('back');
	});

	it.each([
		['/hanh-trinh/than-chu', '/hanh-trinh'],
		['/hanh-trinh', '/hanh-trinh/than-chu'],
		['/hanh-trinh/than-chu', '/trang-chu'],
		['/trang-chu', '/tim-kiem'],
		[undefined, '/hanh-trinh']
	])('does not slide from %s to %s', (from, to) => {
		expect(slideDirection(from, to)).toBeNull();
	});
});
