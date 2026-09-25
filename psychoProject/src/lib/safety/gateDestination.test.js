import { describe, expect, it } from 'vitest';
import { resolveGateDestination, sanitizeDestination } from './gateDestination.js';

describe('resolveGateDestination', () => {
	it('preserves a bare root/landing request', () => {
		const result = resolveGateDestination(new URL('http://localhost/trang-chu'));
		expect(result.original).toBe('/trang-chu');
		expect(result.gateUrl).toBe('/kiem-tra-an-toan?dest=%2Ftrang-chu');
	});

	it('preserves a deep-link request carrying query params', () => {
		const result = resolveGateDestination(
			new URL('http://localhost/trang-chu?slide=1&folder=quyen-than-chu&sub=10-quyen-loi')
		);
		expect(result.original).toBe('/trang-chu?slide=1&folder=quyen-than-chu&sub=10-quyen-loi');
		expect(decodeURIComponent(result.gateUrl.split('?dest=')[1])).toBe(result.original);
	});
});

describe('sanitizeDestination', () => {
	it('keeps a same-site path with its query string', () => {
		expect(sanitizeDestination('/trang-chu/bao-mat?x=1')).toBe('/trang-chu/bao-mat?x=1');
	});

	it.each([null, '', 'trang-chu', '//evil.example', '/\\evil.example', 'https://evil.example'])(
		'falls back to the Landing page for %s',
		(dest) => {
			expect(sanitizeDestination(dest)).toBe('/trang-chu');
		}
	);

	it('never sends the visitor back into the gate itself', () => {
		expect(sanitizeDestination('/kiem-tra-an-toan?dest=%2Ftrang-chu')).toBe('/trang-chu');
	});
});
