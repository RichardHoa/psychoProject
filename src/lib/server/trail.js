import { FOLDERS_DATA } from './folderData.js';
import { PERSONAS } from './trailData.js';
import { readingMinutes } from './content.js';

/**
 * @typedef {import('./trailData.js').Persona} Persona
 * @typedef {import('./trailData.js').Concern} Concern
 * @typedef {import('./trailData.js').TrailStop & { sectionTitle?: string, minutes: number }} PageStop
 */

/** @param {Persona} persona @param {Concern} concern */
const trailKey = (persona, concern) => `${persona.id}.${concern.id}`;

/** @param {import('./trailData.js').TrailStop} stop @returns {PageStop} */
function pageStop(stop) {
	const folder = FOLDERS_DATA.find((f) => f.id === stop.step);
	if (!folder) throw new Error(`Trail stop points at unknown step "${stop.step}"`);
	const section = stop.section && folder.subfolders.find((s) => s.id === stop.section);
	return {
		...stop,
		sectionTitle: section ? section.title : undefined,
		minutes: readingMinutes(folder, false)
	};
}

/** @param {Persona} persona @param {Concern} concern */
function pageTrail(persona, concern) {
	const stops = concern.stops.map(pageStop);
	return {
		key: trailKey(persona, concern),
		question: concern.question,
		stops,
		minutes: stops.reduce((sum, s) => sum + s.minutes, 0)
	};
}

/**
 * The Landing picker at whatever point the URL says: the personas, then (once one is picked) its
 * concerns, then (once one is picked) the instant answer and the Trail behind it. Unknown ids are
 * ignored, so a stale or mistyped link just shows the earlier question.
 * @param {string | null} personaId
 * @param {string | null} concernId
 */
export function getPicker(personaId, concernId) {
	const persona = PERSONAS.find((p) => p.id === personaId);
	const concern = persona?.concerns.find((c) => c.id === concernId);
	return {
		personas: PERSONAS.map(({ id, label, hint }) => ({ id, label, hint })),
		persona: persona
			? {
					id: persona.id,
					concernPrompt: persona.concernPrompt,
					concerns: persona.concerns.map(({ id, label }) => ({ id, label }))
				}
			: null,
		concern:
			persona && concern
				? {
						id: concern.id,
						takeaway: concern.takeaway,
						breathing: concern.breathing ?? false,
						trail: pageTrail(persona, concern)
					}
				: null
	};
}

/**
 * Where a step sits on the visitor's Trail, or null when they aren't following one (or the key
 * doesn't name a Trail that passes through this step).
 * @param {string | null} key
 * @param {string} stepId
 */
export function getTrailPosition(key, stepId) {
	if (!key) return null;
	const [personaId, concernId] = key.split('.');
	const persona = PERSONAS.find((p) => p.id === personaId);
	const concern = persona?.concerns.find((c) => c.id === concernId);
	if (!persona || !concern) return null;
	const index = concern.stops.findIndex((s) => s.step === stepId);
	if (index === -1) return null;
	return { ...pageTrail(persona, concern), index };
}
