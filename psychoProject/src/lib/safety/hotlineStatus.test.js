import { describe, expect, it } from 'vitest';
import { getHotlineStatus } from './hotlineStatus.js';

// 2024-01-03 is a Wednesday; 2024-01-01 is a Monday. Asia/Ho_Chi_Minh is UTC+7 year-round (no DST).
describe('getHotlineStatus', () => {
	it('is in hours during the staffed window on a valid day', () => {
		const now = new Date('2024-01-03T07:00:00Z'); // 14:00 ICT, Wednesday
		expect(getHotlineStatus(now).inHours).toBe(true);
	});

	it('is not in hours before opening on a valid day', () => {
		const now = new Date('2024-01-03T02:00:00Z'); // 09:00 ICT, Wednesday
		expect(getHotlineStatus(now).inHours).toBe(false);
	});

	it('is not in hours after closing on a valid day', () => {
		const now = new Date('2024-01-03T14:00:00Z'); // 21:00 ICT, Wednesday
		expect(getHotlineStatus(now).inHours).toBe(false);
	});

	it('is not in hours on a day the hotline does not operate', () => {
		const now = new Date('2024-01-01T07:00:00Z'); // 14:00 ICT, Monday
		expect(getHotlineStatus(now).inHours).toBe(false);
	});
});
