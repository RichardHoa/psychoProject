import { expect, test } from '@playwright/test';
import { click, jsEnabled, passGate, watchPage } from './helpers.js';

// The core journey a first-time visitor takes, run with JavaScript off and on:
// safety gate → "No" → the deep link they asked for → topic → search → step result
// → breathing exercise → back where they were.
test('core journey works end to end', async ({ page, baseURL }, testInfo) => {
	const js = jsEnabled(testInfo);
	const { externalRequests, errors } = watchPage(page, /** @type {string} */ (baseURL));

	// 1. A deep link sends a new visitor through the safety gate first, keeping the destination.
	await page.goto('/hanh-trinh/than-chu');
	await expect(page).toHaveURL(/\/kiem-tra-an-toan\?dest=%2Fhanh-trinh%2Fthan-chu$/);
	await expect(page.getByText('Bạn đang có ý định làm hại bản thân không?')).toBeVisible();

	// 2. Answering "No" acknowledges, then continues to the requested page on its own
	//    (meta refresh without JavaScript, a timer with it).
	await click(page.getByRole('button', { name: 'Không, mình ổn.' }), testInfo);
	await expect(page.getByText('Mình rất mừng vì bạn vẫn ổn.', { exact: false })).toBeVisible();
	await page.waitForURL('**/hanh-trinh/than-chu', { timeout: 10_000 });

	// 3. The topic page is fully server-rendered, with linkable sections.
	await expect(page.getByRole('heading', { level: 1 })).toContainText('thân chủ', {
		ignoreCase: true
	});
	await expect(page.locator('section.anchor-target').first()).toHaveAttribute('id', /.+/);

	// 4. Search from the navbar. Without JavaScript it is the /tim-kiem page with a GET form;
	//    with it, the same page opens as an overlay. Only step titles match; diacritics are optional.
	await click(page.getByRole('link', { name: 'Mở tìm kiếm kiến thức' }).first(), testInfo);
	await expect(page).toHaveURL(/\/tim-kiem$/);
	const searchBox = page.getByRole('searchbox');
	await searchBox.fill('bao mat');
	await searchBox.press('Enter');
	await expect(page).toHaveURL(/\/tim-kiem\?q=bao(\+|%20)mat$/);
	const result = page.getByRole('link', { name: /Bảo mật và giới hạn bảo mật/ });
	await expect(result).toBeVisible();

	// 5. A result opens its step.
	await click(result, testInfo);
	await expect(page).toHaveURL(/\/hanh-trinh\/bao-mat$/);
	await expect(page.getByRole('banner')).toBeInViewport({ ratio: 1 });

	// 6. The navbar breathing button is a real link to the exercise.
	await click(page.getByRole('link', { name: /Thở 5s/ }), testInfo);
	await expect(page).toHaveURL(/\/tho-vuong(\?|$)/);
	await expect(page.getByText('Hít vào', { exact: true })).toBeVisible();
	if (js) {
		// With JavaScript it is an overlay: the topic stays underneath.
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.locator('#nguyen-tac--khong-tiet-lo-cho-ben-thu-ba')).toBeAttached();
	}

	// 7. "Done" goes back to the topic the visitor came from.
	await click(page.getByRole('link', { name: 'Hoàn tất' }), testInfo);
	await expect(page).toHaveURL(/\/hanh-trinh\/bao-mat(#.*)?$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);

	expect(externalRequests, 'no third-party requests (fonts, icons, CDNs)').toEqual([]);
	expect(errors, 'no page errors or CSP violations').toEqual([]);
});

test('answering "Yes" shows the hotline as a plain link', async ({ page }, testInfo) => {
	await page.goto('/trang-chu');
	await click(page.getByRole('button', { name: 'Có, mình cần giúp đỡ.' }), testInfo);
	await expect(page.getByText('MÈO luôn ở đây vì bạn.')).toBeVisible();
	await expect(page.locator('a[href^="https://duongdaynongngaymai.vn"]')).toBeVisible();
});

test('the journey links to every step, in order', async ({ page, context }, testInfo) => {
	await passGate(context, testInfo);
	await page.goto('/trang-chu');

	await click(page.getByRole('link', { name: /Bắt đầu hành trình/ }), testInfo);
	await expect(page).toHaveURL(/\/hanh-trinh$/);
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Hành trình');

	const steps = page.locator('ol a[href^="/hanh-trinh/"]');
	await expect(steps).toHaveCount(7);
	await expect(steps.first()).toHaveAttribute('href', '/hanh-trinh/than-chu');

	// "Where are you?" shortcuts start the visitor part-way along.
	await click(page.getByRole('link', { name: /Mình đang đi tham vấn/ }), testInfo);
	await expect(page).toHaveURL(/\/hanh-trinh\/quyen-than-chu$/);
});

test('old step and journey URLs redirect to the Journey page', async ({
	page,
	context
}, testInfo) => {
	await passGate(context, testInfo);

	await page.goto('/trang-chu/bao-mat?che-do=chi-tiet#nguyen-tac');
	await expect(page).toHaveURL(/\/hanh-trinh\/bao-mat\?che-do=chi-tiet#nguyen-tac$/);

	await page.goto('/trang-chu?slide=1');
	await expect(page).toHaveURL(/\/hanh-trinh$/);

	if (jsEnabled(testInfo)) {
		// The fragment never reaches the server, so this one is redirected in the browser.
		await page.goto('/trang-chu#chu-de');
		await expect(page).toHaveURL(/\/hanh-trinh$/);
	}
});

test('back from any step returns to the Journey, not the Landing page', async ({
	page,
	context
}, testInfo) => {
	test.skip(!jsEnabled(testInfo), 'moving between steps only replaces history with JavaScript');
	await passGate(context, testInfo);
	await page.goto('/trang-chu');
	await page.getByRole('link', { name: /Bắt đầu hành trình/ }).click();
	await expect(page).toHaveURL(/\/hanh-trinh$/);

	await page.locator('ol a[href="/hanh-trinh/than-chu"]').click();
	await expect(page).toHaveURL(/\/hanh-trinh\/than-chu$/);
	await page.getByRole('link', { name: 'Bước tiếp theo' }).click();
	await expect(page).toHaveURL(/\/hanh-trinh\/ai-giup-ban$/);
	await page.getByRole('link', { name: 'Bước tiếp theo' }).click();
	await expect(page).toHaveURL(/\/hanh-trinh\/nha-tham-van$/);

	await page.goBack();
	await expect(page).toHaveURL(/\/hanh-trinh$/);
});

test('the cat mascot always opens the Landing page at the top', async ({
	page,
	context
}, testInfo) => {
	await passGate(context, testInfo);
	await page.goto('/hanh-trinh');
	await page.mouse.wheel(0, 2000);
	await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
	// Scrolled down, the navbar is still on screen.
	await expect(page.getByRole('banner')).toBeInViewport({ ratio: 1 });

	await click(page.getByRole('link', { name: 'Về trang chủ' }), testInfo);
	await expect(page).toHaveURL(/\/trang-chu$/);
	await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test('a step switches between its short and detailed version', async ({
	page,
	context
}, testInfo) => {
	await passGate(context, testInfo);
	await page.goto('/hanh-trinh/than-chu');
	await expect(page.locator('#tam-the')).toHaveCount(0);

	await click(page.getByRole('link', { name: 'Chi tiết', exact: true }), testInfo);
	await expect(page).toHaveURL(/\/hanh-trinh\/than-chu\?che-do=chi-tiet$/);
	await expect(page.locator('#tam-the')).toBeVisible();

	// Moving on keeps the version the visitor chose.
	const next = page.getByRole('link', { name: 'Bước tiếp theo' });
	await next.scrollIntoViewIfNeeded();
	await click(next, testInfo);
	await expect(page).toHaveURL(/\/hanh-trinh\/ai-giup-ban\?che-do=chi-tiet$/);
	await expect(page.getByRole('link', { name: 'Chi tiết', exact: true })).toHaveAttribute(
		'aria-current',
		'true'
	);
});
