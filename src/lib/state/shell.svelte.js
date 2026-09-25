import { createContext } from 'svelte';

/**
 * UI state shared between the app shell (+layout) and its pages. Lives in context, not in a
 * module-level singleton, so it is never shared between visitors during server rendering.
 */
export class ShellState {
	/**
	 * Whether the Landing page hero (which has its own big search bar) is on screen. Only read on
	 * the Landing page; starts true because the server always renders the hero first.
	 */
	heroInView = $state(true);
}

export const [getShell, setShell] = /** @type {typeof createContext<ShellState>} */ (
	createContext
)();
