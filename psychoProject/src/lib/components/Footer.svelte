<script>
	import { m } from '$lib/paraglide/messages.js';
</script>

<footer class="bg-secondary-container text-primary font-body w-full mt-auto border-t border-surface-variant">
	<div class="w-full py-12 px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
		<div class="flex flex-col items-center md:items-start gap-2">
			<div class="flex items-center gap-2 text-xl font-bold text-on-surface">
				<img
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0U642vdyozVbm4M-3nJpX3AxPlujyV00n4-v4o2GJoZm9klemx0agPcGlxqaT1Qt_XWhFc5emfN80Ci_j5gn9r5L9yyqR8IySOIR3Gmnw9R-V5gEYUFFSfd_7QyauIcTKvUAkXSOb5Z_xv18VIVPuQpBYBwPO37Z7tiFmDrH8Q7qagW8n1BEbkRP5d0LZr35KV_rt7_sH9OsxIsCF7so-kMsPyMw9zcfIH4S8aTDnBVgNNUKk-iyHUiijjsYp1eIJGMk"
					alt="MÈO Logo"
					class="h-8 w-auto"
				/>
				<span>{m.brand_name()}</span>
			</div>
			<p class="text-base text-on-surface-variant">{m.footer_tagline()}</p>
		</div>

		<div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base font-medium">
			<a href="https://duongdaynongngaymai.vn/" target="_blank" rel="noopener noreferrer" class="hover:underline text-primary">
				{m.footer_hotline_link()}
			</a>
			<a href="/tai-nguyen" class="hover:underline text-on-surface-variant">
				{m.footer_resources_link()}
			</a>
			<a href="/" class="hover:underline text-on-surface-variant">
				{m.footer_safety_check_link()}
			</a>
		</div>
	</div>
</footer>
