import { expect, test } from '@playwright/test';
import { jsEnabled, passGate } from './helpers.js';

// The box-breathing exercise is pure CSS: a 20 s cycle of four 5 s phases, a seconds counter
// and a pause toggle, all without JavaScript.
test.describe('box breathing page', () => {
	test.beforeEach(async ({ context, page }, testInfo) => {
		await passGate(context, testInfo);
		await page.goto('/tho-vuong');
	});

	test('is a real, shareable page', async ({ page }) => {
		await expect(page).toHaveTitle(/Thở vuông/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		for (const phase of ['Hít vào', 'Giữ hơi', 'Thở ra', 'Nghỉ ngơi']) {
			await expect(page.getByText(phase, { exact: true })).toBeAttached();
		}
	});

	test('phases advance on their own every 5 seconds', async ({ page }) => {
		const inhale = page.getByText('Hít vào', { exact: true });
		const hold = page.getByText('Giữ hơi', { exact: true });

		await expect(inhale).toBeVisible();
		await expect(hold).toBeHidden();

		await expect(hold).toBeVisible({ timeout: 7_000 });
		await expect(inhale).toBeHidden();
	});

	test('the seconds counter counts down', async ({ page }) => {
		const counter = page.getByTestId('breathing-seconds');
		await expect(counter).toHaveCSS('animation-play-state', /^running(, running)*$/);
		await expect(counter).not.toHaveCSS('animation-name', 'none');
	});

	test('pause stops the cycle and resume continues it', async ({ page }) => {
		const inhale = page.getByText('Hít vào', { exact: true });
		const hold = page.getByText('Giữ hơi', { exact: true });
		const square = page.getByTestId('breathing-square');

		await page.getByText('Tạm dừng', { exact: true }).click();
		await expect(square).toHaveCSS('animation-play-state', /^paused(, paused)*$/);
		await expect(page.getByText('Tiếp tục', { exact: true })).toBeVisible();

		// Paused well past the end of the first phase: still inhaling.
		await page.waitForTimeout(6_000);
		await expect(inhale).toBeVisible();
		await expect(hold).toBeHidden();

		await page.getByText('Tiếp tục', { exact: true }).click();
		await expect(square).toHaveCSS('animation-play-state', /^running(, running)*$/);
		await expect(hold).toBeVisible({ timeout: 7_000 });
	});

	test('"Done" without a return path goes to the landing page', async ({ page }) => {
		await page.getByRole('link', { name: 'Hoàn tất' }).click();
		await expect(page).toHaveURL(/\/trang-chu(#.*)?$/);
	});
});

test('the return path is sanitised (no open redirect)', async ({ page, context }, testInfo) => {
	await passGate(context, testInfo);
	await page.goto('/tho-vuong?quay-lai=' + encodeURIComponent('//evil.example'));
	await expect(page.getByRole('link', { name: 'Hoàn tất' })).toHaveAttribute('href', '/trang-chu');
});

test('with JavaScript the exercise opens over the current page and Escape closes it', async ({
	page,
	context
}, testInfo) => {
	test.skip(!jsEnabled(testInfo), 'enhancement only');
	await passGate(context, testInfo);
	await page.goto('/trang-chu/than-chu');
	await page.getByRole('link', { name: /Thở 5s/ }).click();

	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await expect(page).toHaveURL(/\/tho-vuong/);
	await expect(page.getByRole('heading', { name: /thân chủ/i, level: 1 })).toBeAttached();

	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
	await expect(page).toHaveURL(/\/trang-chu\/than-chu$/);
});
