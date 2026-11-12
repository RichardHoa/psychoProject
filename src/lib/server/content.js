import { FOLDERS_DATA } from './folderData.js';
import { slugify } from '$lib/shared/text.js';
import { stepHref } from '$lib/journey/reading.js';
import { JOURNEY_PATH, LANDING_PATH } from '$lib/shared/routes.js';
import { PICKER_ANCHOR } from '$lib/trail/trail.js';
import { m } from '$lib/paraglide/messages.js';

/**
 * @typedef {import('./folderData.js').Folder} Folder
 * @typedef {import('./folderData.js').Subfolder} Subfolder
 * @typedef {import('./folderData.js').FolderItem} FolderItem
 * @typedef {Pick<Folder, 'id' | 'title' | 'shortTitle' | 'summary' | 'chapter' | 'nextReason'> & { step: number, minutes: number }} FolderSummary
 * @typedef {NonNullable<ReturnType<typeof getFolder>>} StepPage
 * @typedef {{ href: string, label: string }} NavLink
 * @typedef {{
 *   position: { step: number, total: number } | null,
 *   versionHrefs: { short: string, detailed: string },
 *   detailOnlyHref: string | null,
 *   upNext: { caption: string, title: string, reason: string } | null,
 *   finished: { title: string, description: string } | null,
 *   prev: NavLink | null,
 *   next: NavLink | null,
 *   end: NavLink,
 *   links: (NavLink & { prominent: boolean })[]
 * }} StepNav
 */

export const STEP_COUNT = FOLDERS_DATA.length;

// Vietnamese is written one syllable per space-separated word; 200 a minute is an unhurried pace.
const WORDS_PER_MINUTE = 200;

/**
 * Whole minutes (at least 1) to read a step in the short or detailed version, counting the same
 * text the step page shows.
 * @param {Folder} folder
 * @param {boolean} detailed
 */
export function readingMinutes(folder, detailed) {
	const texts = [folder.title, folder.summary];
	for (const sub of folder.subfolders) {
		if (sub.detailOnly && !detailed) continue;
		texts.push(sub.title, sub.desc ?? '');
		for (const item of sub.items) {
			texts.push(item.title, (detailed ? (item.detail ?? item.short) : item.short) ?? '');
		}
	}
	const words = texts.join(' ').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** @param {Folder} folder @param {number} index @returns {FolderSummary} */
function summarize(folder, index) {
	const { id, title, shortTitle, summary, chapter, nextReason } = folder;
	return {
		id,
		title,
		shortTitle,
		summary,
		chapter,
		nextReason,
		step: index + 1,
		minutes: readingMinutes(folder, false)
	};
}

/** The journey steps, in reading order. @returns {FolderSummary[]} */
export function listFolders() {
	return FOLDERS_DATA.map(summarize);
}

/**
 * Page-ready step: every item gets a stable, unique `anchor` so search results and deep links
 * can jump straight to it.
 * @param {string} id
 */
export function getFolder(id) {
	const index = FOLDERS_DATA.findIndex((f) => f.id === id);
	if (index === -1) return null;
	const folder = FOLDERS_DATA[index];
	const prev = FOLDERS_DATA[index - 1];
	const next = FOLDERS_DATA[index + 1];

	return {
		folder: {
			...folder,
			subfolders: folder.subfolders.map((sub) => ({
				...sub,
				items: sub.items.map((item) => ({ ...item, anchor: itemAnchor(sub, item) }))
			}))
		},
		step: index + 1,
		stepCount: STEP_COUNT,
		minutes: { short: readingMinutes(folder, false), detailed: readingMinutes(folder, true) },
		prevFolder: prev ? summarize(prev, index - 1) : null,
		nextFolder: next ? summarize(next, index + 1) : null
	};
}

/**
 * @param {Pick<Subfolder, 'id'>} subfolder
 * @param {Pick<FolderItem, 'title'>} item
 */
export function itemAnchor(subfolder, item) {
	return `${subfolder.id}--${slugify(item.title)}`;
}

/**
 * Where a step page sits and where it leads: the Journey's order, or the visitor's Trail when they
 * follow one. Every step link keeps the short/detailed version (and the Trail while on it).
 * @param {StepPage} page
 * @param {import('$lib/trail/trail.js').TrailPosition | null} trail
 * @param {boolean} detailed
 * @returns {StepNav}
 */
export function stepNav(page, trail, detailed) {
	const { folder, nextFolder } = page;
	const key = trail?.key;
	const firstDetailOnly = detailed ? undefined : folder.subfolders.find((s) => s.detailOnly);
	return {
		versionHrefs: {
			short: stepHref(folder.id, { trail: key }),
			detailed: stepHref(folder.id, { detailed: true, trail: key })
		},
		detailOnlyHref: firstDetailOnly
			? stepHref(folder.id, { detailed: true, trail: key, hash: firstDetailOnly.id })
			: null,
		...(trail ? trailNav(trail, nextFolder, detailed) : journeyNav(page, detailed))
	};
}

/** @param {StepPage} page @param {boolean} detailed */
function journeyNav({ step, stepCount, prevFolder, nextFolder }, detailed) {
	return {
		position: { step, total: stepCount },
		upNext: nextFolder
			? {
					caption: m.reader_up_next({ step: nextFolder.step }),
					title: nextFolder.shortTitle,
					reason: nextFolder.nextReason
				}
			: null,
		finished: nextFolder
			? null
			: { title: m.reader_finished_title(), description: m.reader_finished_desc() },
		prev: prevFolder
			? { href: stepHref(prevFolder.id, { detailed }), label: m.reader_prev() }
			: null,
		next: nextFolder
			? { href: stepHref(nextFolder.id, { detailed }), label: m.reader_next() }
			: null,
		end: { href: JOURNEY_PATH, label: m.reader_back_to_journey() },
		links: nextFolder
			? [{ href: JOURNEY_PATH, label: m.reader_back_to_journey(), prominent: true }]
			: []
	};
}

/**
 * On a Trail the Journey's position is hidden and "next" follows the Trail; the Journey's own next
 * step stays one (subtle) tap away.
 * @param {import('$lib/trail/trail.js').TrailPosition} trail
 * @param {FolderSummary | null} nextFolder
 * @param {boolean} detailed
 */
function trailNav(trail, nextFolder, detailed) {
	const { key, index, stops } = trail;
	const prev = stops[index - 1];
	const next = stops[index + 1];
	/** @type {StepNav['links']} */
	const links = [];
	if (!next) links.push({ href: JOURNEY_PATH, label: m.reader_back_to_journey(), prominent: true });
	if (nextFolder) {
		links.push({
			href: stepHref(nextFolder.id, { detailed }),
			label: m.trail_in_order({ step: nextFolder.step, title: nextFolder.shortTitle }),
			prominent: false
		});
	}
	return {
		position: null,
		upNext: next
			? {
					caption: m.trail_up_next({ index: index + 2, count: stops.length }),
					title: next.title,
					reason: next.why
				}
			: null,
		finished: next
			? null
			: {
					title: m.trail_finished_title(),
					description: m.trail_finished_desc({ count: stops.length, question: trail.question })
				},
		prev: prev
			? { href: stepHref(prev.step, { detailed, trail: key }), label: m.trail_prev() }
			: null,
		next: next
			? { href: stepHref(next.step, { detailed, trail: key }), label: m.trail_next() }
			: null,
		end: { href: `${LANDING_PATH}#${PICKER_ANCHOR}`, label: m.trail_ask_again() },
		links
	};
}
