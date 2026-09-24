<script>
	import { page } from '$app/state';
	import CatMascot from '$lib/components/CatMascot.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { happyAlt } from '$lib/assets/cat/index.js';
</script>

<svelte:head>
	<title>{page.status} · {m.brand_name()}</title>
</svelte:head>

<main
	class="flex h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-background px-6 text-center font-body"
>
	<CatMascot autoplay={false} restImg={happyAlt} />
	<h1 class="text-2xl font-black text-text-main">
		{page.status === 404 ? m.error_not_found_title() : m.error_generic_title()}
	</h1>
	<p class="max-w-sm text-sm text-text-subtle">{m.error_desc()}</p>
	<a
		href="/trang-chu"
		class="sketch-button rounded-xl bg-warm-sage px-4 py-2 text-sm font-bold text-primary"
	>
		{m.error_back_home()}
	</a>
</main>
