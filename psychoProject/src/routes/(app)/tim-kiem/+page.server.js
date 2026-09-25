import { search, searchSuggestions } from '$lib/server/search.js';

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
	const query = (url.searchParams.get('q') ?? '').trim();
	return { query, results: search(query), suggestions: searchSuggestions() };
}
