// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Set when /tim-kiem is shallow-routed as an overlay (see SearchBar). */
			search?: {
				query: string;
				results: import('$lib/server/search.js').SearchResult[];
				suggestions: { label: string; icon: string }[];
			};
			/** Set when /tho-vuong is shallow-routed as a modal (see the app layout). */
			breathing?: {
				/** Where "Done" leads if the history entry is opened on its own. */
				returnTo: string;
			};
		}
		// interface Platform {}
	}
}

export {};
