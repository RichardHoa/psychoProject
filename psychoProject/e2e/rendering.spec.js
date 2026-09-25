import { expect, test } from '@playwright/test';
import { passGate, watchPage } from './helpers.js';

// Everything a page needs to look right comes in the server HTML: no borders drawn after load,
// no icon font, no third-party fonts or images.
const PAGES = [
	'/kiem-tra-an-toan',
	'/trang-chu',
	'/trang-chu/bao-mat',
	'/tim-kiem',
	'/tim-kiem?q=bao+mat',
	'/tho-vuong'
];

for (const path of PAGES) {
	test(`${path} renders fully from the server`, async ({ page, context, baseURL }, testInfo) => {
		if (path !== '/kiem-tra-an-toan') await passGate(context, testInfo);
		const { externalRequests, errors } = watchPage(page, /** @type {string} */ (baseURL));

		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		const html = /** @type {string} */ (await response?.text());

		// Hand-drawn borders are SVG paths in the HTML itself, not drawn by rough.js after mount.
		const wired = page.locator('.wired');
		if ((await wired.count()) > 0) {
			await expect(wired.first().locator('svg path').first()).toBeAttached();
		}
		expect(html).not.toContain('<noscript');

		// No icon font: every icon is inline SVG.
		expect(html).not.toContain('material-symbols');
		await expect(page.locator('.material-symbols-outlined')).toHaveCount(0);

		expect(externalRequests, 'no third-party requests').toEqual([]);
		expect(errors, 'no page errors or CSP violations').toEqual([]);
	});
}

test('Be Vietnam Pro is self-hosted and used', async ({ page, context }, testInfo) => {
	await passGate(context, testInfo);
	/** @type {string[]} */
	const fonts = [];
	page.on('response', (r) => {
		if (r.request().resourceType() === 'font') fonts.push(new URL(r.url()).pathname);
	});
	await page.goto('/trang-chu');
	await expect(page.locator('body')).toHaveCSS('font-family', /Be Vietnam Pro/);
	await expect.poll(() => fonts.length).toBeGreaterThan(0);
	expect(fonts.every((p) => p.startsWith('/_app/'))).toBe(true);
});

test('cat mascot images are optimised', async ({ page }) => {
	// The error page shows the mascot (404s are not behind the gate). Its CSS greeting is covered
	// by CatMascot.test.js, since no page currently autoplays it.
	await page.goto('/khong-ton-tai');
	const mascot = page.getByTestId('cat-mascot');
	await expect(mascot).toBeVisible();

	// Modern formats at display size instead of the ~100 KB source PNGs.
	const avif = mascot.locator('picture source[type="image/avif"]').first();
	await expect(avif).toHaveAttribute('srcset', /\s96w\b/);
	await expect(mascot.locator('picture source[type="image/webp"]').first()).toBeAttached();
});

test('security headers and a nonce-based CSP are sent', async ({ page, context }, testInfo) => {
	await passGate(context, testInfo);
	const response = await page.goto('/trang-chu');
	const headers = /** @type {Record<string, string>} */ (response?.headers());

	expect(headers['content-security-policy']).toMatch(/script-src [^;]*'nonce-/);
	expect(headers['content-security-policy']).toContain("object-src 'none'");
	expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
	expect(headers['x-content-type-options']).toBe('nosniff');
	expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
	expect(headers['x-frame-options']).toBe('DENY');
	expect(headers['permissions-policy']).toContain('camera=()');
});
