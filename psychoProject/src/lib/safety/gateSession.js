const STORAGE_KEY = 'meo:safety-gate-answered';

/**
 * Whether the visitor has already answered the safety gate this browser session.
 * @returns {boolean}
 */
export function hasAnsweredSafetyGate() {
	if (typeof sessionStorage === 'undefined') return false;
	try {
		return sessionStorage.getItem(STORAGE_KEY) === 'true';
	} catch {
		return false;
	}
}

export function markSafetyGateAnswered() {
	if (typeof sessionStorage === 'undefined') return;
	try {
		sessionStorage.setItem(STORAGE_KEY, 'true');
	} catch {
		// sessionStorage unavailable (e.g. private browsing) — the gate will just show again, which is safe.
	}
}
