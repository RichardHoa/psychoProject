import Clarity from '@microsoft/clarity';

// Microsoft Clarity analytics (session replays, heatmaps). Runs once when the app starts in the
// browser; pages served without client-side JavaScript are not tracked.
/** @type {import('@sveltejs/kit').ClientInit} */
export const init = () => {
	Clarity.init('zgf452bb4f');
};
