// Shared reactive search state using Svelte 5 class rune

class SearchState {
	isOpen = $state(false);
	query = $state('');

	/** @param {string} [initial] */
	open(initial = '') {
		if (initial) {
			this.query = initial;
		}
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	/** @param {string} val */
	setQuery(val) {
		this.query = val;
	}
}

export const searchState = new SearchState();
