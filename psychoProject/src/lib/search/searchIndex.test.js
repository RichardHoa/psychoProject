import { describe, expect, it } from 'vitest';
import { FOLDERS_DATA } from '../data/folderData.js';
import {
	buildSearchIndex,
	itemAnchorId,
	normalizeText,
	searchEntries,
	sectionAnchorId
} from './searchIndex.js';

const index = buildSearchIndex(FOLDERS_DATA);

describe('normalizeText', () => {
	it('strips Vietnamese diacritics, đ and case', () => {
		expect(normalizeText('  Bảo MẬT  Đồng thuận ')).toBe('bao mat dong thuan');
	});
});

describe('buildSearchIndex', () => {
	it('indexes every folder, section and item of the real content', () => {
		const sections = FOLDERS_DATA.flatMap((f) => f.subfolders);
		const items = sections.flatMap((s) => s.items);
		expect(index.filter((e) => e.kind === 'folder')).toHaveLength(FOLDERS_DATA.length);
		expect(index.filter((e) => e.kind === 'section')).toHaveLength(sections.length);
		expect(index.filter((e) => e.kind === 'item')).toHaveLength(items.length);
	});

	it('points every result at a folder that exists and a unique scroll target', () => {
		const folderIds = new Set(FOLDERS_DATA.map((f) => f.id));
		const targets = index.map((e) => e.targetId).filter(Boolean);
		for (const e of index) expect(folderIds.has(e.folderId)).toBe(true);
		expect(new Set(targets).size).toBe(targets.length);
	});

	it('uses the same anchor ids the reader renders', () => {
		const item = index.find((e) => e.title === '3. Yêu cầu pháp lý từ tòa án');
		expect(item?.targetId).toBe(itemAnchorId('ngoai-le', 2));
		const section = index.find((e) => e.kind === 'section' && e.subfolderId === 'ngoai-le');
		expect(section?.targetId).toBe(sectionAnchorId('ngoai-le'));
	});
});

describe('searchEntries', () => {
	it('returns nothing for an empty or unrelated query', () => {
		expect(searchEntries(index, '   ')).toEqual([]);
		expect(searchEntries(index, 'xyzzy khong ton tai')).toEqual([]);
	});

	it('ranks the matching topic first for every suggestion chip', () => {
		for (const folder of FOLDERS_DATA) {
			const results = searchEntries(index, folder.shortTitle || folder.title);
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].folderId).toBe(folder.id);
		}
	});

	it('matches without diacritics', () => {
		const results = searchEntries(index, 'bao mat');
		expect(results[0]).toMatchObject({ kind: 'folder', folderId: 'bao-mat' });
	});

	it('finds text that only appears inside an item and targets that item', () => {
		const [top] = searchEntries(index, 'tòa án');
		expect(top).toMatchObject({
			kind: 'item',
			folderId: 'bao-mat',
			subfolderId: 'ngoai-le',
			targetId: itemAnchorId('ngoai-le', 2)
		});
	});

	it('requires every query word to match', () => {
		for (const e of searchEntries(index, 'cha mẹ')) {
			const hay = `${e.normTitle} ${e.normContext} ${e.normBody}`;
			expect(hay).toContain('cha');
			expect(hay).toContain('me');
		}
	});
});
