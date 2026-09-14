<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>MÈO - Thân chủ – Client</title>
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
			<span class="text-on-surface font-bold">Thân chủ – Client</span>
		</div>

		<div class="max-w-3xl mx-auto space-y-8">
			<header class="space-y-3 border-b border-surface-variant pb-6">
				<span
					class="bg-primary/10 text-primary px-3.5 py-1 rounded-full text-sm font-semibold uppercase tracking-wide inline-block"
				>
					Các vai trò trong tham vấn và trị liệu
				</span>
				<h1 class="text-3xl md:text-4xl font-extrabold text-primary">
					Thân chủ – Client
				</h1>
			</header>

			<article class="prose prose-lg max-w-none text-on-surface space-y-6 leading-relaxed">
				<div class="bg-surface-off-white p-6 rounded-2xl border border-surface-variant shadow-sm space-y-4">
					<p class="text-base md:text-lg leading-relaxed text-on-surface">
						<strong>Thân chủ</strong> là người sử dụng dịch vụ tham vấn hoặc trị liệu tâm lý.
					</p>
					<p class="text-base text-on-surface-variant leading-relaxed">
						Từ <strong>“thân chủ”</strong> được dùng để nhấn mạnh rằng họ là người <em>chủ động tham gia</em> vào quá trình thay đổi, không chỉ là một “bệnh nhân” thụ động.
					</p>
				</div>

				<div class="space-y-4 mt-8">
					<h2 class="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">help_outline</span>
						Thân chủ có thể tìm đến vì:
					</h2>

					<ul class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-base">
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">sentiment_dissatisfied</span>
							<span>Khó khăn cảm xúc.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">family_restroom</span>
							<span>Mâu thuẫn gia đình.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">warning</span>
							<span>Khủng hoảng cuộc sống.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">psychology_alt</span>
							<span>Trầm cảm, lo âu hoặc sang chấn.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">call_split</span>
							<span>Khó ra quyết định.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">search</span>
							<span>Muốn hiểu rõ bản thân.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 md:col-span-2">
							<span class="material-symbols-outlined text-primary text-xl mt-0.5">favorite</span>
							<span>Muốn cải thiện quan hệ và chất lượng sống.</span>
						</li>
					</ul>
				</div>
			</article>
		</div>
	</main>

	<Footer />
</div>
