import { describe, expect, it } from 'vitest';
import { createFolderNav, navStateFromSearchParams, navStateToUrl } from './folderNav.svelte.js';

describe('folder nav URL', () => {
	it('round-trips a search target through the URL', () => {
		const snapshot = {
			slide: 1,
			folderId: 'bao-mat',
			subfolderId: 'ngoai-le',
			targetId: 'muc-ngoai-le-2'
		};
		const url = navStateToUrl(snapshot, '/trang-chu');
		expect(url).toBe('?slide=1&folder=bao-mat&sub=ngoai-le&target=muc-ngoai-le-2');
		expect(navStateFromSearchParams(new URLSearchParams(url))).toEqual(snapshot);
	});

	it('ignores a target without a folder', () => {
		expect(navStateFromSearchParams(new URLSearchParams('?target=muc-x')).targetId).toBeNull();
		expect(
			navStateToUrl({ slide: 0, folderId: null, subfolderId: null, targetId: 'muc-x' }, '/p')
		).toBe('/p');
	});
});

describe('createFolderNav', () => {
	it('bumps targetVersion on every reset with a target so the same result scrolls again', () => {
		const nav = createFolderNav();
		const snap = {
			slide: 1,
			folderId: 'bao-mat',
			subfolderId: 'ngoai-le',
			targetId: 'muc-ngoai-le-2'
		};
		nav.reset(snap);
		const v = nav.targetVersion;
		nav.reset(snap);
		expect(nav.targetId).toBe('muc-ngoai-le-2');
		expect(nav.targetVersion).toBe(v + 1);
	});

	it('clears the target when the user navigates by hand', () => {
		const nav = createFolderNav();
		nav.reset({
			slide: 1,
			folderId: 'bao-mat',
			subfolderId: 'ngoai-le',
			targetId: 'muc-ngoai-le-2'
		});
		nav.selectFolder('than-chu');
		expect(nav.targetId).toBeNull();
	});
});
