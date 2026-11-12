import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import CatMascot from './CatMascot.svelte';

// The greeting must be in the server HTML as CSS animations, so it plays without JavaScript.
describe('CatMascot greeting', () => {
	it('is a CSS animation on the server-rendered poses', () => {
		const { body } = render(CatMascot, { props: { autoplay: true } });
		const greeting = body.match(/<img[^>]*class="[^"]*cat-greet[^"]*"[^>]*>/g) ?? [];

		// One stacked <img> per distinct pose, each animated.
		expect(greeting).toHaveLength(6);
		// The rest pose is hidden for the whole greeting (8 frames × 240 ms), then shown again.
		expect(body).toContain('cat-hide 1920ms step-end');
		// Each pose is shown during its own frames, in order.
		expect(body).toContain('cat-frame 240ms step-end 0ms');
		expect(body).toContain('cat-frame 240ms step-end 1680ms');
	});

	it('does not animate without autoplay', () => {
		const { body } = render(CatMascot, { props: { autoplay: false } });
		expect(body).not.toContain('cat-greet');
		expect(body).not.toContain('animation:');
	});

	it('serves modern image formats', () => {
		const { body } = render(CatMascot, { props: { autoplay: false } });
		expect(body).toContain('type="image/avif"');
		expect(body).toContain('type="image/webp"');
	});
});
