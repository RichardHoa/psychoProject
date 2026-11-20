/// <reference types="vitest/config" />
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Deployed to Cloudflare Workers; the Worker itself is configured in wrangler.jsonc.
			adapter: adapter(),
			// Content Security Policy: SvelteKit adds a per-request nonce (hash when prerendered) to
			// script-src for its own inline bootstrap script. Styles stay 'unsafe-inline' because
			// components use style attributes (and SvelteKit then skips style nonces). The clarity.ms
			// and c.bing.com sources are for Microsoft Clarity analytics (src/hooks.client.js).
			csp: {
				mode: 'auto',
				directives: {
					'default-src': ['self'],
					'script-src': ['self', 'https://www.clarity.ms', 'https://*.clarity.ms'],
					'style-src': ['self', 'unsafe-inline'],
					'img-src': ['self', 'data:', 'https://*.clarity.ms', 'https://c.bing.com'],
					'font-src': ['self'],
					'connect-src': ['self', 'https://*.clarity.ms', 'https://c.bing.com'],
					'object-src': ['none'],
					'base-uri': ['self'],
					'form-action': ['self'],
					'frame-ancestors': ['none']
				}
			}
		}),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true
		})
	],
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
