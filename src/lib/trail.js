import { LANDING_PATH } from '$lib/routes.js';

/**
 * One stop on a Trail: a journey step, why it's worth reading, and the section to read first.
 * @typedef {object} TrailStop
 * @property {string} step Journey step id.
 * @property {string} title
 * @property {string} why
 * @property {number} minutes Reading time of the step's short version.
 * @property {{ id: string, title: string }} [section] The section of that step worth reading first.
 *
 * @typedef {object} Trail
 * @property {string} key `<persona>.<concern>`, the value of {@link TRAIL_PARAM}.
 * @property {string} question The question the Trail answers.
 * @property {number} minutes Reading time of every stop together.
 * @property {TrailStop[]} stops
 *
 * Where a step page sits on the visitor's Trail.
 * @typedef {Trail & { index: number }} TrailPosition
 *
 * The Landing picker's first question: who the visitor is.
 * @typedef {object} PersonaStage
 * @property {'persona'} stage
 * @property {{ id: string, label: string, hint: string }[]} personas
 *
 * The second question: what worries the chosen persona.
 * @typedef {object} ConcernStage
 * @property {'concern'} stage
 * @property {string} backHref Back to the first question.
 * @property {{ id: string, concernPrompt: string }} persona
 * @property {{ id: string, label: string }[]} concerns
 *
 * The answer to the chosen worry, and the Trail behind it.
 * @typedef {object} AnswerStage
 * @property {'answer'} stage
 * @property {string} backHref Back to the persona's worries.
 * @property {{ title: string, points: string[] }} takeaway
 * @property {boolean} breathing Offer the breathing exercise next to the answer.
 * @property {Trail} trail
 *
 * The Landing picker at whichever question the URL says.
 * @typedef {PersonaStage | ConcernStage | AnswerStage} Picker
 */

/** Query parameter that keeps a step page on the visitor's Trail: `?lo-trinh=<persona>.<concern>`. */
export const TRAIL_PARAM = 'lo-trinh';
/** Landing picker query parameters: who the visitor is, then what worries them. */
export const PERSONA_PARAM = 'ban-la';
export const CONCERN_PARAM = 'lo-ve';
/** Anchor of the Landing picker, so picking an answer (even without JavaScript) lands on it. */
export const PICKER_ANCHOR = 'ban-la-ai';

/**
 * Link to the Landing picker at the question after the given answers (none: who are you).
 * @param {string} [personaId]
 * @param {string} [concernId]
 */
export function pickerHref(personaId, concernId) {
	const params = new URLSearchParams();
	if (personaId) params.set(PERSONA_PARAM, personaId);
	if (concernId) params.set(CONCERN_PARAM, concernId);
	const query = params.size ? `?${params}` : '';
	return `${LANDING_PATH}${query}#${PICKER_ANCHOR}`;
}
