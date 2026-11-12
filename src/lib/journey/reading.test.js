import { describe, expect, it } from 'vitest';
import { isDetailed, stepHref } from './reading.js';

describe('reading version', () => {
	it('is short unless the URL asks for the detailed version', () => {
		expect(isDetailed(new URL('http://x/trang-chu/bao-mat'))).toBe(false);
		expect(isDetailed(new URL('http://x/trang-chu/bao-mat?che-do=chi-tiet'))).toBe(true);
	});
});

describe('step links', () => {
	it('links to the short version by default', () => {
		expect(stepHref('bao-mat')).toBe('/hanh-trinh/bao-mat');
	});

	it('keeps the detailed version', () => {
		expect(stepHref('bao-mat', { detailed: true })).toBe('/hanh-trinh/bao-mat?che-do=chi-tiet');
	});

	it('keeps the Trail', () => {
		expect(stepHref('bao-mat', { trail: 'phu-huynh.con-khac-la' })).toBe(
			'/hanh-trinh/bao-mat?lo-trinh=phu-huynh.con-khac-la'
		);
	});

	it('puts the version before the Trail, as saved links have it', () => {
		expect(stepHref('bao-mat', { detailed: true, trail: 'phu-huynh.con-khac-la' })).toBe(
			'/hanh-trinh/bao-mat?che-do=chi-tiet&lo-trinh=phu-huynh.con-khac-la'
		);
	});

	it('ends with the section or item anchor', () => {
		expect(stepHref('bao-mat', { hash: 'ngoai-le' })).toBe('/hanh-trinh/bao-mat#ngoai-le');
		expect(stepHref('bao-mat', { detailed: true, hash: 'ngoai-le' })).toBe(
			'/hanh-trinh/bao-mat?che-do=chi-tiet#ngoai-le'
		);
		expect(stepHref('bao-mat', { trail: 'a.b', hash: 'ngoai-le' })).toBe(
			'/hanh-trinh/bao-mat?lo-trinh=a.b#ngoai-le'
		);
		expect(stepHref('bao-mat', { detailed: true, trail: 'a.b', hash: 'ngoai-le' })).toBe(
			'/hanh-trinh/bao-mat?che-do=chi-tiet&lo-trinh=a.b#ngoai-le'
		);
	});

	it('encodes a Trail key that needs it', () => {
		expect(stepHref('bao-mat', { trail: 'a&b c' })).toBe('/hanh-trinh/bao-mat?lo-trinh=a%26b+c');
	});
});
