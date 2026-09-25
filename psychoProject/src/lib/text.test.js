import { describe, expect, it } from 'vitest';
import { foldText, slugify } from './text.js';

describe('foldText', () => {
	it('strips Vietnamese diacritics and case', () => {
		expect(foldText('Bảo Mật')).toBe('bao mat');
		expect(foldText('Đường dây nóng')).toBe('duong day nong');
	});
});

describe('slugify', () => {
	it('builds a fragment-safe id from a title', () => {
		expect(slugify('1. Nguy cơ gây hại bản thân')).toBe('1-nguy-co-gay-hai-ban-than');
		expect(slugify('Bình đẳng & Không phán xét')).toBe('binh-dang-khong-phan-xet');
	});
});
