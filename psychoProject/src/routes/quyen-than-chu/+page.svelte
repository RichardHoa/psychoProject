<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>MÈO - Quyền của thân chủ</title>
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
			<span class="text-on-surface font-bold">Quyền của thân chủ</span>
		</div>

		<div class="max-w-3xl mx-auto space-y-8">
			<header class="space-y-3 border-b border-surface-variant pb-6">
				<span
					class="bg-primary/10 text-primary px-3.5 py-1 rounded-full text-sm font-semibold uppercase tracking-wide inline-block"
				>
					Quyền lợi và Bảo mật thông tin
				</span>
				<h1 class="text-3xl md:text-4xl font-extrabold text-primary">
					Quyền của thân chủ
				</h1>
			</header>

			<article class="prose prose-lg max-w-none text-on-surface space-y-6 leading-relaxed">
				<p class="text-base md:text-lg text-on-surface leading-relaxed">
					Thân chủ có quyền:
				</p>

				<ul class="space-y-3.5 text-base">
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">verified</span>
						<span>Được tôn trọng và không bị kỳ thị.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">school</span>
						<span>Được biết bằng cấp và kinh nghiệm của người hỗ trợ.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">payments</span>
						<span>Được giải thích về phương pháp, chi phí và thời lượng.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">folder_shared</span>
						<span>Được biết thông tin được lưu trữ và bảo mật thế nào.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">shield_lock</span>
						<span>Được biết những trường hợp bảo mật có thể bị giới hạn.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">help</span>
						<span>Được đặt câu hỏi về trị liệu.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">block</span>
						<span>Được từ chối một kỹ thuật.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">groups</span>
						<span>Được xin ý kiến chuyên gia khác.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">swap_horiz</span>
						<span>Được đổi chuyên gia hoặc dừng trị liệu.</span>
					</li>
					<li class="bg-surface-off-white p-4 rounded-xl border border-surface-variant shadow-sm flex items-start gap-3">
						<span class="material-symbols-outlined text-primary text-xl mt-0.5">report_problem</span>
						<span>Được biết cách phản ánh hoặc khiếu nại.</span>
					</li>
				</ul>
			</article>
		</div>
	</main>

	<Footer />
</div>
