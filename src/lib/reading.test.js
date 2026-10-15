import { describe, expect, it } from 'vitest';
import { isDetailed, readingHref } from './reading.js';

describe('reading version', () => {
	it('is short unless the URL asks for the detailed version', () => {
		expect(isDetailed(new URL('http://x/trang-chu/bao-mat'))).toBe(false);
		expect(isDetailed(new URL('http://x/trang-chu/bao-mat?che-do=chi-tiet'))).toBe(true);
	});

	it('builds links that keep the version and the anchor', () => {
		expect(readingHref('/trang-chu/bao-mat', false)).toBe('/trang-chu/bao-mat');
		expect(readingHref('/trang-chu/bao-mat', true, 'ngoai-le')).toBe(
			'/trang-chu/bao-mat?che-do=chi-tiet#ngoai-le'
		);
	});
});
