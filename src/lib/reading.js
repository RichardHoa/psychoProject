/** Query parameter that switches a step page to its detailed version: `?che-do=chi-tiet`. */
export const DETAIL_PARAM = 'che-do';
export const DETAIL_VALUE = 'chi-tiet';

/** @param {URL} url */
export function isDetailed(url) {
	return url.searchParams.get(DETAIL_PARAM) === DETAIL_VALUE;
}

/**
 * Link to a page in the short (default) or detailed version, so the choice carries over when
 * moving between steps. Plain links, so switching works without JavaScript.
 * @param {string} path
 * @param {boolean} detailed
 * @param {string} [hash]
 */
export function readingHref(path, detailed, hash) {
	return `${path}${detailed ? `?${DETAIL_PARAM}=${DETAIL_VALUE}` : ''}${hash ? `#${hash}` : ''}`;
}
