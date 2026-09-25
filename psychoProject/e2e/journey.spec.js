import { expect, test } from '@playwright/test';
import { click, jsEnabled, passGate, watchPage } from './helpers.js';

// The core journey a first-time visitor takes, run with JavaScript off and on:
// safety gate → "No" → the deep link they asked for → topic → search → exact result anchor
// → breathing exercise → back where they were.
test('core journey works end to end', async ({ page, baseURL }, testInfo) => {
	const js = jsEnabled(testInfo);
	const { externalRequests, errors } = watchPage(page, /** @type {string} */ (baseURL));

	// 1. A deep link sends a new visitor through the safety gate first, keeping the destination.
	await page.goto('/trang-chu/than-chu');
	await expect(page).toHaveURL(/\/kiem-tra-an-toan\?dest=%2Ftrang-chu%2Fthan-chu$/);
	await expect(page.getByText('Bạn đang có ý định làm hại bản thân không?')).toBeVisible();

	// 2. Answering "No" acknowledges, then continues to the requested page on its own
	//    (meta refresh without JavaScript, a timer with it).
	await click(page.getByRole('button', { name: 'Không, mình ổn.' }), testInfo);
	await expect(page.getByText('Mình rất mừng vì bạn vẫn ổn.', { exact: false })).toBeVisible();
	await page.waitForURL('**/trang-chu/than-chu', { timeout: 10_000 });

	// 3. The topic page is fully server-rendered, with linkable sections.
	await expect(page.getByRole('heading', { level: 1 })).toContainText('thân chủ', {
		ignoreCase: true
	});
	await expect(page.locator('section.anchor-target').first()).toHaveAttribute('id', /.+/);

	// 4. Search from the navbar. Without JavaScript it is the /tim-kiem page with a GET form;
	//    with it, the same page opens as an overlay. Diacritics are optional.
	await click(page.getByRole('link', { name: 'Mở tìm kiếm kiến thức' }).first(), testInfo);
	await expect(page).toHaveURL(/\/tim-kiem$/);
	const searchBox = page.getByRole('searchbox');
	await searchBox.fill('ben thu ba');
	await searchBox.press('Enter');
	await expect(page).toHaveURL(/\/tim-kiem\?q=ben(\+|%20)thu(\+|%20)ba$/);
	const result = page.getByRole('link', { name: /Không tiết lộ cho bên thứ ba/ });
	await expect(result).toBeVisible();

	// 5. A result opens its topic scrolled to, and highlighting, the exact item.
	await click(result, testInfo);
	await expect(page).toHaveURL(/\/trang-chu\/bao-mat#nguyen-tac--khong-tiet-lo-cho-ben-thu-ba$/);
	const target = page.locator('#nguyen-tac--khong-tiet-lo-cho-ben-thu-ba');
	await expect(target).toBeInViewport();
	await expect(target).toHaveCSS('outline-style', 'dashed');

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
	await expect(page).toHaveURL(/\/trang-chu\/bao-mat(#.*)?$/);
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

test('landing hub cards link to every topic', async ({ page, context }, testInfo) => {
	await passGate(context, testInfo);
	await page.goto('/trang-chu');

	await click(page.getByRole('link', { name: /Khám phá 4 chủ đề/ }), testInfo);
	await expect(page).toHaveURL(/#chu-de$/);
	await expect(page.locator('#chu-de')).toBeInViewport();

	const cards = page.locator('#chu-de a[href^="/trang-chu/"]');
	await expect(cards).toHaveCount(5);
	await click(cards.first(), testInfo);
	await expect(page).toHaveURL(/\/trang-chu\/bao-mat$/);
});
