<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>MÈO - Phân biệt rõ về bảo mật</title>
</svelte:head>

<div class="bg-background text-text-main font-body min-h-screen flex flex-col">
	<Navbar />

	<main class="flex-grow w-full px-gutter max-w-container-max mx-auto py-10">
		<!-- Breadcrumb -->
		<div class="flex items-center gap-2 mb-6 text-base text-on-surface-variant font-medium">
			<a href="/trang-chu" class="hover:text-primary flex items-center gap-1">
				<span class="material-symbols-outlined text-lg">arrow_back</span>
				Trang chủ
			</a>
			<span class="text-outline">/</span>
			<a href="/tai-nguyen" class="hover:text-primary">Tài nguyên</a>
			<span class="text-outline">/</span>
			<span class="text-on-surface font-bold">Phân biệt rõ về bảo mật</span>
		</div>

		<div class="max-w-3xl mx-auto space-y-8">
			<header class="space-y-3 border-b border-surface-variant pb-6">
				<span
					class="bg-primary/10 text-primary px-3.5 py-1 rounded-full text-sm font-semibold uppercase tracking-wide inline-block"
				>
					Quyền lợi và Bảo mật thông tin
				</span>
				<h1 class="text-3xl md:text-4xl font-extrabold text-primary">
					Phân biệt rõ về bảo mật
				</h1>
			</header>

			<article class="prose prose-lg max-w-none text-on-surface space-y-6 leading-relaxed">
				<div class="bg-warm-cream p-6 rounded-2xl border border-primary/20 space-y-2">
					<div class="flex items-center gap-2 text-primary font-bold text-lg">
						<span class="material-symbols-outlined">lock</span>
						Nguyên tắc nền tảng
					</div>
					<p class="text-base md:text-lg text-on-surface leading-relaxed">
						Bảo mật là nguyên tắc nền tảng, nhưng không phải lúc nào cũng tuyệt đối.
					</p>
				</div>

				<div class="space-y-4 mt-6">
					<h2 class="text-xl md:text-2xl font-bold text-emergency-red flex items-center gap-2">
						<span class="material-symbols-outlined text-emergency-red">warning</span>
						Nhà chuyên môn có thể phải chia sẻ thông tin khi:
					</h2>

					<ul class="space-y-3.5 text-base">
						<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
							<span class="material-symbols-outlined text-emergency-red text-xl mt-0.5">person_alert</span>
							<span>Thân chủ có nguy cơ gây hại đối với bản thân.</span>
						</li>
						<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
							<span class="material-symbols-outlined text-emergency-red text-xl mt-0.5">group_off</span>
							<span>Có nguy cơ gây hại đối với người khác.</span>
						</li>
						<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">gavel</span>
							<span>Có yêu cầu hợp pháp từ cơ quan có thẩm quyền.</span>
						</li>
						<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">supervisor_account</span>
							<span>Cần trao đổi trong giám sát chuyên môn, với thông tin được bảo vệ phù hợp.</span>
						</li>
					</ul>
				</div>
			</article>
		</div>
	</main>

	<Footer />
</div>
