import { describe, expect, it } from 'vitest';
import { resolveGateDestination } from './gateDestination.js';

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
