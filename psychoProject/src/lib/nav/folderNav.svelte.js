import { FOLDERS_DATA } from '$lib/data/folderData.js';

/**
 * @typedef {{ slide: number, folderId: string | null, subfolderId: string | null }} NavSnapshot
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

	/** @param {number} index */
	function goToSlide(index) {
		slide = index;
	}

	/** @param {string} id */
	function selectFolder(id) {
		const folder = FOLDERS_DATA.find((f) => f.id === id);
		folderId = id;
		subfolderId = folder?.subfolders[0]?.id ?? null;
		slide = 1;
	}

	/** @param {string} id */
	function selectSubfolder(id) {
		subfolderId = id;
	}

	function goToRoot() {
		folderId = null;
		subfolderId = null;
	}

	/** @param {NavSnapshot} snapshot */
	function reset(snapshot) {
		slide = snapshot.slide;
		folderId = snapshot.folderId;
		subfolderId = snapshot.subfolderId;
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
	const slide = folderId || params.get('slide') === '1' ? 1 : 0;
	return { slide, folderId, subfolderId };
}
