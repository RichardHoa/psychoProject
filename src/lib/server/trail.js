import { FOLDERS_DATA } from './folderData.js';
import { PERSONAS } from './trailData.js';
import { readingMinutes } from './content.js';
import { pickerHref } from '$lib/trail.js';

/**
 * @typedef {import('./trailData.js').TrailStop} StopData
 * @typedef {import('$lib/trail.js').Trail} Trail
 * @typedef {import('$lib/trail.js').TrailStop} TrailStop
 * @typedef {import('$lib/trail.js').TrailPosition} TrailPosition
 * @typedef {import('$lib/trail.js').Picker} Picker
 */

/** @param {string} personaId @param {string} concernId */
const trailKey = (personaId, concernId) => `${personaId}.${concernId}`;

/** @param {StopData} stop @returns {TrailStop} */
function buildStop({ step, section: sectionId, title, why }) {
	const folder = FOLDERS_DATA.find((f) => f.id === step);
	if (!folder) throw new Error(`Trail stop points at unknown step "${step}"`);
	const section = sectionId && folder.subfolders.find((s) => s.id === sectionId);
	if (sectionId && !section) {
		throw new Error(`Trail stop points at unknown section "${sectionId}" of step "${step}"`);
	}
	return {
		step,
		title,
		why,
		minutes: readingMinutes(folder, false),
		...(section && { section: { id: section.id, title: section.title } })
	};
}

/** Every Trail, keyed by `<persona>.<concern>`; built (and checked) once, when the module loads. */
const TRAILS = new Map(
	PERSONAS.flatMap((persona) =>
		persona.concerns.map((concern) => {
			const key = trailKey(persona.id, concern.id);
			const stops = concern.stops.map(buildStop);
			/** @type {Trail} */
			const trail = {
				key,
				question: concern.question,
				minutes: stops.reduce((sum, s) => sum + s.minutes, 0),
				stops
			};
			return /** @type {const} */ ([key, trail]);
		})
	)
);

/**
 * The persona and (if it is one of that persona's) the concern with these ids.
 * @param {string | null} personaId
 * @param {string | null} concernId
 */
function findConcern(personaId, concernId) {
	const persona = PERSONAS.find((p) => p.id === personaId);
	const concern = persona?.concerns.find((c) => c.id === concernId);
	return { persona, concern };
}

/**
 * The Landing picker at whatever point the URL says: the personas, then (once one is picked) its
 * concerns, then (once one is picked) the instant answer and the Trail behind it. Unknown or
 * mismatched ids fall back to the earlier question, so a stale or mistyped link still works.
 * @param {string | null} personaId
 * @param {string | null} concernId
 * @returns {Picker}
 */
export function getPicker(personaId, concernId) {
	const { persona, concern } = findConcern(personaId, concernId);
	if (!persona) {
		return {
			stage: 'persona',
			personas: PERSONAS.map(({ id, label, hint }) => ({ id, label, hint }))
		};
	}
	if (!concern) {
		return {
			stage: 'concern',
			backHref: pickerHref(),
			persona: { id: persona.id, concernPrompt: persona.concernPrompt },
			concerns: persona.concerns.map(({ id, label }) => ({ id, label }))
		};
	}
	return {
		stage: 'answer',
		backHref: pickerHref(persona.id),
		takeaway: concern.takeaway,
		breathing: concern.breathing ?? false,
		trail: /** @type {Trail} */ (TRAILS.get(trailKey(persona.id, concern.id)))
	};
}

/**
 * Where a step sits on the visitor's Trail, or null when they aren't following one (or the key
 * doesn't name a Trail that passes through this step).
 * @param {string | null} key
 * @param {string} stepId
 * @returns {TrailPosition | null}
 */
export function getTrailPosition(key, stepId) {
	const trail = key ? TRAILS.get(key) : undefined;
	if (!trail) return null;
	const index = trail.stops.findIndex((s) => s.step === stepId);
	if (index === -1) return null;
	return { ...trail, index };
}
