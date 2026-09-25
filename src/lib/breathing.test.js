import { describe, expect, it } from 'vitest';
import { breathingHref, breathingReturnPath } from './breathing.js';

describe('breathingHref', () => {
	it('remembers the current page', () => {
		expect(breathingHref(new URL('http://x/trang-chu/bao-mat?a=1'))).toBe(
			'/tho-vuong?quay-lai=%2Ftrang-chu%2Fbao-mat%3Fa%3D1'
		);
	});

	it('stays put when already on the exercise', () => {
		expect(breathingHref(new URL('http://x/tho-vuong?quay-lai=%2Ftim-kiem'))).toBe(
			'/tho-vuong?quay-lai=%2Ftim-kiem'
		);
	});
});

describe('breathingReturnPath', () => {
	it('keeps same-site paths', () => {
		expect(breathingReturnPath('/trang-chu/bao-mat')).toBe('/trang-chu/bao-mat');
	});

	it.each([null, '', '//evil.example', 'https://evil.example', '/tho-vuong', '/tho-vuong?x=1'])(
		'falls back to the landing page for %s',
		(value) => {
			expect(breathingReturnPath(value)).toBe('/trang-chu');
		}
	);
});
