import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// The same specs run twice: once exactly as a visitor with JavaScript disabled (or a bundle that
// failed to load) sees the site, and once with JavaScript on, where it only adds enhancements.
export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: BASE_URL,
		locale: 'vi-VN',
		timezoneId: 'Asia/Ho_Chi_Minh',
		trace: 'retain-on-failure',
		launchOptions: {
			// Lets environments with a preinstalled Chromium (instead of `playwright install`) run it.
			executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined
		}
	},
	projects: [
		{
			name: 'no-js',
			use: { ...devices['Pixel 7'], javaScriptEnabled: false }
		},
		{
			name: 'js',
			use: { ...devices['Pixel 7'] }
		}
	],
	webServer: {
		// The production build, served by the local Workers runtime: what `npm run deploy` ships.
		// `npm run preview` serves on port 4173, matching PORT above.
		command: 'npm run preview',
		url: `${BASE_URL}/kiem-tra-an-toan`,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000
	}
});
