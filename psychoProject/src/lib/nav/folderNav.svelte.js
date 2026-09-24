import { untrack } from 'svelte';
import { FOLDERS_DATA } from '$lib/data/folderData.js';

/**
 * @typedef {{ slide: number, folderId: string | null, subfolderId: string | null, targetId?: string | null }} NavSnapshot
 */

/**
 * Owns the "which slide / folder / subfolder is active" state that used to be
 * kept separately by +page.svelte (URL + page.state) and FolderExplorer (local $state).
 * Callers read the current values through the getters and mutate through the methods;
 * `reset` is the only way to load a snapshot back in (e.g. from browser history).
 */
export function createFolderNav() {
	let slide = $state(0);
	let folderId = $state(/** @type {string | null} */ (null));
	let subfolderId = $state(/** @type {string | null} */ (null));
	// Element inside the folder reader to scroll to (set by search results / deep links).
	let targetId = $state(/** @type {string | null} */ (null));
	// Bumped on every reset that carries a target, so re-selecting the same result scrolls again.
	let targetVersion = $state(0);

	/** @param {number} index */
	function goToSlide(index) {
		slide = index;
	}

	/** @param {string} id */
	function selectFolder(id) {
		const folder = FOLDERS_DATA.find((f) => f.id === id);
		folderId = id;
		subfolderId = folder?.subfolders[0]?.id ?? null;
		targetId = null;
		slide = 1;
	}

	/** @param {string} id */
	function selectSubfolder(id) {
		subfolderId = id;
		targetId = null;
	}

	function goToRoot() {
		folderId = null;
		subfolderId = null;
		targetId = null;
	}

	/** @param {NavSnapshot} snapshot */
	function reset(snapshot) {
		slide = snapshot.slide;
		folderId = snapshot.folderId;
		subfolderId = snapshot.subfolderId;
		const nextTarget = snapshot.targetId ?? null;
		targetId = nextTarget;
		// untrack: reset runs inside the page's $effect, which must not depend on its own write
		if (nextTarget) targetVersion = untrack(() => targetVersion) + 1;
	}

	return {
		get slide() {
			return slide;
		},
		get folderId() {
			return folderId;
		},
		get subfolderId() {
			return subfolderId;
		},
		get targetId() {
			return targetId;
		},
		get targetVersion() {
			return targetVersion;
		},
		goToSlide,
		selectFolder,
		selectSubfolder,
		goToRoot,
		reset
	};
}

/** @typedef {ReturnType<typeof createFolderNav>} FolderNav */

/**
 * @param {NavSnapshot} snapshot
 * @param {string} pathname
 */
export function navStateToUrl(snapshot, pathname) {
	const params = new URLSearchParams();
	if (snapshot.slide) params.set('slide', String(snapshot.slide));
	if (snapshot.folderId) params.set('folder', snapshot.folderId);
	if (snapshot.subfolderId) params.set('sub', snapshot.subfolderId);
	if (snapshot.folderId && snapshot.targetId) params.set('target', snapshot.targetId);
	const qs = params.toString();
	return qs ? `?${qs}` : pathname;
}

/**
 * @param {URLSearchParams} params
 * @returns {NavSnapshot}
 */
export function navStateFromSearchParams(params) {
	const folderId = params.get('folder');
	const subfolderId = params.get('sub');
	const targetId = folderId ? params.get('target') : null;
	const slide = folderId || params.get('slide') === '1' ? 1 : 0;
	return { slide, folderId, subfolderId, targetId };
}
