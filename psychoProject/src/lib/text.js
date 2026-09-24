/**
 * Lowercases and strips Vietnamese diacritics so "bảo mật", "Bảo Mật" and "bao mat" compare equal.
 * @param {string} text
 */
export function foldText(text) {
	return text
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
		.toLowerCase();
}

/**
 * URL-fragment-safe id from a Vietnamese title, e.g. "1. Nguy cơ gây hại bản thân" →
 * "1-nguy-co-gay-hai-ban-than".
 * @param {string} text
 */
export function slugify(text) {
	return foldText(text)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
