// Search index derived from FOLDERS_DATA so results always match the content the reader renders.

/**
 * @typedef {Object} SearchEntry
 * @property {string} id
 * @property {'folder' | 'section' | 'item'} kind
 * @property {string} title
 * @property {string} context      Breadcrumb shown above the title ("Bảo mật › 4 Ngoại lệ…")
 * @property {string} snippet
 * @property {string} icon
 * @property {string} folderId
 * @property {string | null} subfolderId
 * @property {string | null} targetId  DOM id inside FolderReader to scroll to (null = top of folder)
 * @property {string} normTitle
 * @property {string} normContext
 * @property {string} normBody
 */

/** @param {string} subfolderId */
export function sectionAnchorId(subfolderId) {
	return `muc-${subfolderId}`;
}

/**
 * @param {string} subfolderId
 * @param {number} itemIndex
 */
export function itemAnchorId(subfolderId, itemIndex) {
	return `muc-${subfolderId}-${itemIndex}`;
}

/**
 * Lowercase and strip Vietnamese diacritics so "bao mat" matches "Bảo mật".
 * @param {string} text
 */
export function normalizeText(text) {
	return (text || '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * @param {import('$lib/data/folderData.js').Folder[]} folders
 * @returns {SearchEntry[]}
 */
export function buildSearchIndex(folders) {
	/** @type {SearchEntry[]} */
	const entries = [];

	/** @param {Omit<SearchEntry, 'normTitle' | 'normContext' | 'normBody'> & { body: string }} e */
	function add({ body, ...e }) {
		entries.push({
			...e,
			normTitle: normalizeText(e.title),
			normContext: normalizeText(e.context),
			normBody: normalizeText(body)
		});
	}

	for (const folder of folders) {
		const folderLabel = folder.shortTitle || folder.title;
		add({
			id: folder.id,
			kind: 'folder',
			title: folder.title,
			context: folder.category,
			snippet: folder.summary,
			icon: folder.icon,
			folderId: folder.id,
			subfolderId: null,
			targetId: null,
			body: [folder.shortTitle, folder.summary, ...(folder.highlights || [])].join(' ')
		});

		for (const sub of folder.subfolders) {
			add({
				id: `${folder.id}/${sub.id}`,
				kind: 'section',
				title: sub.title,
				context: folderLabel,
				snippet: sub.desc,
				icon: sub.icon,
				folderId: folder.id,
				subfolderId: sub.id,
				targetId: sectionAnchorId(sub.id),
				body: sub.desc
			});

			sub.items.forEach((item, index) => {
				add({
					id: `${folder.id}/${sub.id}/${index}`,
					kind: 'item',
					title: item.title,
					context: `${folderLabel} › ${sub.title}`,
					snippet: item.content,
					icon: item.icon || sub.icon,
					folderId: folder.id,
					subfolderId: sub.id,
					targetId: itemAnchorId(sub.id, index),
					body: [item.content, item.tag].filter(Boolean).join(' ')
				});
			});
		}
	}

	return entries;
}

const KIND_BONUS = { folder: 3, section: 2, item: 0 };

/**
 * Every query word must appear somewhere in the entry; entries whose title matches
 * rank above ones that only mention the words in their body text.
 * @param {SearchEntry[]} index
 * @param {string} query
 * @param {number} [limit]
 * @returns {SearchEntry[]}
 */
export function searchEntries(index, query, limit = 20) {
	const phrase = normalizeText(query);
	if (!phrase) return [];
	const tokens = phrase.split(' ');

	/** @type {Array<{ entry: SearchEntry, score: number, order: number }>} */
	const scored = [];

	index.forEach((entry, order) => {
		const { normTitle, normContext, normBody } = entry;
		let score = 0;

		for (const token of tokens) {
			if (normTitle.includes(token)) score += 10;
			else if (normContext.includes(token)) score += 4;
			else if (normBody.includes(token)) score += 2;
			else return;
		}

		if (normTitle === phrase) score += 60;
		else if (normTitle.startsWith(phrase)) score += 40;
		else if (normTitle.includes(phrase)) score += 25;
		else if (normBody.includes(phrase)) score += 8;

		score += KIND_BONUS[entry.kind];
		scored.push({ entry, score, order });
	});

	scored.sort((a, b) => b.score - a.score || a.order - b.order);
	return scored.slice(0, limit).map((s) => s.entry);
}
