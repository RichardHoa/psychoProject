import { describe, expect, it } from 'vitest';
import { getFolder, readingMinutes, stepNav } from './content.js';
import { getTrailPosition } from './trail.js';

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

describe('step navigation on the Journey', () => {
	/** @param {string} id @param {boolean} [detailed] */
	const nav = (id, detailed = false) =>
		stepNav(/** @type {import('./content.js').StepPage} */ (getFolder(id)), null, detailed);

	it('shows where a middle step sits and leads to the next step', () => {
		const n = nav('ai-giup-ban');
		expect(n.position).toEqual({ step: 2, total: 7 });
		expect(n.upNext).toMatchObject({ caption: 'Tiếp theo · Bước 3' });
		expect(n.finished).toBeNull();
		expect(n.prev).toEqual({ href: '/hanh-trinh/than-chu', label: 'Bước trước' });
		expect(n.next).toEqual({ href: '/hanh-trinh/nha-tham-van', label: 'Bước tiếp theo' });
		expect(n.links).toEqual([
			{ href: '/hanh-trinh', label: 'Xem toàn bộ hành trình', prominent: true }
		]);
	});

	it('has no previous step on the first step', () => {
		const n = nav('than-chu');
		expect(n.position).toEqual({ step: 1, total: 7 });
		expect(n.prev).toBeNull();
		expect(n.next?.href).toBe('/hanh-trinh/ai-giup-ban');
	});

	it('ends the Journey on the last step with a way back to it', () => {
		const n = nav('ho-tro-chuyen-nghiep');
		expect(n.upNext).toBeNull();
		expect(n.finished).toEqual({
			title: 'Bạn đã đi hết hành trình.',
			description: 'Bạn có thể quay lại bất kỳ bước nào khi cần.'
		});
		expect(n.prev?.href).toBe('/hanh-trinh/chon-chuyen-gia');
		expect(n.next).toBeNull();
		expect(n.end).toEqual({ href: '/hanh-trinh', label: 'Xem toàn bộ hành trình' });
		expect(n.links).toEqual([]);
	});

	it('switches version on the same step and keeps the detailed version when moving on', () => {
		const n = nav('ai-giup-ban', true);
		expect(n.versionHrefs).toEqual({
			short: '/hanh-trinh/ai-giup-ban',
			detailed: '/hanh-trinh/ai-giup-ban?che-do=chi-tiet'
		});
		expect(n.prev?.href).toBe('/hanh-trinh/than-chu?che-do=chi-tiet');
		expect(n.next?.href).toBe('/hanh-trinh/nha-tham-van?che-do=chi-tiet');
	});

	it('links the short version to the first detailed-only section', () => {
		expect(nav('than-chu').detailOnlyHref).toBe('/hanh-trinh/than-chu?che-do=chi-tiet#tam-the');
		expect(nav('than-chu', true).detailOnlyHref).toBeNull();
	});
});

describe('step navigation on a Trail', () => {
	const key = 'phu-huynh.con-khac-la';
	/** @param {string} id @param {boolean} [detailed] */
	const nav = (id, detailed = false) =>
		stepNav(
			/** @type {import('./content.js').StepPage} */ (getFolder(id)),
			getTrailPosition(key, id),
			detailed
		);

	it('follows the Trail from its first stop and keeps the Trail', () => {
		const n = nav('ai-giup-ban');
		expect(n.position).toBeNull();
		expect(n.upNext).toEqual({
			caption: 'Tiếp theo trong lộ trình · Phần 2 / 3',
			title: 'Cách nhận biết nơi uy tín',
			reason: 'Đặc biệt: có kinh nghiệm với lứa tuổi của con.'
		});
		expect(n.prev).toBeNull();
		expect(n.next).toEqual({
			href: '/hanh-trinh/chon-chuyen-gia?lo-trinh=phu-huynh.con-khac-la',
			label: 'Phần tiếp'
		});
	});

	it('goes back along the Trail from a middle stop, not the Journey', () => {
		const n = nav('chon-chuyen-gia');
		expect(n.prev).toEqual({
			href: '/hanh-trinh/ai-giup-ban?lo-trinh=phu-huynh.con-khac-la',
			label: 'Phần trước'
		});
		expect(n.next?.href).toBe('/hanh-trinh/ho-tro-chuyen-nghiep?lo-trinh=phu-huynh.con-khac-la');
	});

	it('offers to read the Journey in order while the Journey has a next step', () => {
		expect(nav('chon-chuyen-gia').links).toEqual([
			{
				href: '/hanh-trinh/ho-tro-chuyen-nghiep',
				label: 'Hoặc đọc theo thứ tự: Bước 7, Nơi bắt đầu tìm',
				prominent: false
			}
		]);
	});

	it('ends the Trail with "ask again" and a link to the whole Journey', () => {
		const n = nav('ho-tro-chuyen-nghiep');
		expect(n.upNext).toBeNull();
		expect(n.finished).toEqual({
			title: 'Bạn đã đi hết lộ trình của mình',
			description:
				'Đó là 3 phần cho câu hỏi “Con thay đổi tính nết, có nên đưa đi tham vấn?”. Bạn muốn làm gì tiếp?'
		});
		expect(n.next).toBeNull();
		expect(n.end).toEqual({ href: '/trang-chu#ban-la-ai', label: 'Hỏi Mèo điều khác' });
		// The last step of the Journey has no next step to read in order.
		expect(n.links).toEqual([
			{ href: '/hanh-trinh', label: 'Xem toàn bộ hành trình', prominent: true }
		]);
	});

	it('keeps both the detailed version and the Trail on every step link', () => {
		const n = nav('chon-chuyen-gia', true);
		const onTrail = '?che-do=chi-tiet&lo-trinh=phu-huynh.con-khac-la';
		expect(n.versionHrefs).toEqual({
			short: '/hanh-trinh/chon-chuyen-gia?lo-trinh=phu-huynh.con-khac-la',
			detailed: `/hanh-trinh/chon-chuyen-gia${onTrail}`
		});
		expect(n.prev?.href).toBe(`/hanh-trinh/ai-giup-ban${onTrail}`);
		expect(n.next?.href).toBe(`/hanh-trinh/ho-tro-chuyen-nghiep${onTrail}`);
		// Reading in order leaves the Trail but keeps the version.
		expect(n.links[0].href).toBe('/hanh-trinh/ho-tro-chuyen-nghiep?che-do=chi-tiet');
	});
});
