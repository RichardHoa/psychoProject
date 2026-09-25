import { expect } from '@playwright/test';

/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').BrowserContext} BrowserContext
 * @typedef {import('@playwright/test').TestInfo} TestInfo
 */

/** Session cookie set by the safety gate once it is answered (see $lib/safety/gateCookie.js). */
export const GATE_COOKIE = 'meo_safety_gate';

/**
 * Skips the safety gate for tests that are about something else.
 * @param {BrowserContext} context
 * @param {TestInfo} testInfo
 */
export async function passGate(context, testInfo) {
	const url = /** @type {string} */ (testInfo.project.use.baseURL);
	await context.addCookies([{ name: GATE_COOKIE, value: '1', url }]);
}

/** @param {TestInfo} testInfo */
export function jsEnabled(testInfo) {
	return testInfo.project.use.javaScriptEnabled !== false;
}

/**
 * Records requests that leave the site (third-party fonts, CDNs...) and page errors, including
 * Content-Security-Policy violations reported on the console.
 * @param {Page} page
 * @param {string} baseURL
 */
export function watchPage(page, baseURL) {
	const origin = new URL(baseURL).origin;
	/** @type {string[]} */
	const externalRequests = [];
	/** @type {string[]} */
	const errors = [];

	page.on('request', (request) => {
		const url = new URL(request.url());
		if (url.protocol.startsWith('http') && url.origin !== origin) externalRequests.push(url.href);
	});
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});

	return { externalRequests, errors };
}

/**
 * Clicks like a visitor would. With JavaScript disabled, Playwright's own actionability checks
 * (which run on requestAnimationFrame) can stall for tens of seconds after a meta refresh or a
 * page load with a #fragment, reporting "not stable" / "<html> intercepts pointer events" even
 * though a real click lands fine. So in that project we wait until the element is fully on
 * screen and has stopped moving, let the cross-document view transition (a ~0.25 s fade that
 * swallows input by design) finish, and press the pointer at its centre.
 * @param {import('@playwright/test').Locator} locator
 * @param {TestInfo} testInfo
 */
export async function click(locator, testInfo) {
	if (jsEnabled(testInfo)) return locator.click();

	const page = locator.page();
	await expect(locator).toBeInViewport({ ratio: 1 });
	/** @type {string | undefined} */
	let previous;
	await expect
		.poll(
			async () => {
				const box = JSON.stringify(await locator.boundingBox());
				const settled = box === previous;
				previous = box;
				return settled;
			},
			{ intervals: [100] }
		)
		.toBe(true);
	await page.waitForTimeout(400);

	const box = /** @type {NonNullable<Awaited<ReturnType<typeof locator.boundingBox>>>} */ (
		await locator.boundingBox()
	);
	await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
