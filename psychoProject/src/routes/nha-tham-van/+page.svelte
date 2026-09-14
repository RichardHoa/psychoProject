<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>MÈO - Nhà tham vấn làm gì?</title>
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
			<span class="text-on-surface font-bold">Nhà tham vấn làm gì?</span>
		</div>

		<div class="max-w-3xl mx-auto space-y-8">
			<header class="space-y-3 border-b border-surface-variant pb-6">
				<span
					class="bg-primary/10 text-primary px-3.5 py-1 rounded-full text-sm font-semibold uppercase tracking-wide inline-block"
				>
					Điều gì diễn ra trong phòng tham vấn?
				</span>
				<h1 class="text-3xl md:text-4xl font-extrabold text-primary">
					Nhà tham vấn sẽ làm gì?
				</h1>
			</header>

			<article class="prose prose-lg max-w-none text-on-surface space-y-8 leading-relaxed">
				<!-- Section 1: Buổi đầu -->
				<div class="space-y-4">
					<h2 class="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">format_list_numbered</span>
						Trong những buổi đầu, nhà tham vấn thường:
					</h2>

					<ol class="space-y-3 pl-2">
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
							<span>Giải thích vai trò, chi phí, thời lượng và cách làm việc.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
							<span>Giải thích nguyên tắc bảo mật và giới hạn của bảo mật.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
							<span>Tìm hiểu lý do thân chủ đến tham vấn.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
							<span>Hỏi về cảm xúc, suy nghĩ, hành vi, sức khỏe, quan hệ và hoàn cảnh sống.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
							<span>Đánh giá mức độ an toàn, đặc biệt khi có tự hại hoặc tự sát.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">6</span>
							<span>Cùng thân chủ thống nhất mục tiêu.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">7</span>
							<span>Lựa chọn phương pháp phù hợp.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">8</span>
							<span>Theo dõi tiến triển và điều chỉnh kế hoạch.</span>
						</li>
						<li class="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex items-start gap-3 text-base">
							<span class="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">9</span>
							<span>Chuyển tuyến khi vấn đề vượt quá năng lực.</span>
						</li>
					</ol>
				</div>

				<!-- Section 2: Phương pháp -->
				<div class="space-y-4">
					<h2 class="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">psychology</span>
						Nhà tham vấn có thể sử dụng:
					</h2>

					<ul class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-base">
						<li class="bg-warm-cream p-4 rounded-xl border border-primary/20 flex items-center gap-3">
							<span class="material-symbols-outlined text-primary text-xl">hearing</span>
							<span>Lắng nghe và phản hồi.</span>
						</li>
						<li class="bg-warm-cream p-4 rounded-xl border border-primary/20 flex items-center gap-3">
							<span class="material-symbols-outlined text-primary text-xl">help</span>
							<span>Đặt câu hỏi.</span>
						</li>
						<li class="bg-warm-cream p-4 rounded-xl border border-primary/20 flex items-center gap-3">
							<span class="material-symbols-outlined text-primary text-xl">favorite</span>
							<span>Làm rõ cảm xúc và nhu cầu.</span>
						</li>
						<li class="bg-warm-cream p-4 rounded-xl border border-primary/20 flex items-center gap-3">
							<span class="material-symbols-outlined text-primary text-xl">sync</span>
							<span>Nhận diện vòng lặp suy nghĩ – cảm xúc – hành vi.</span>
						</li>
						<li class="bg-warm-cream p-4 rounded-xl border border-primary/20 flex items-center gap-3">
							<span class="material-symbols-outlined text-primary text-xl">forum</span>
							<span>Luyện kỹ năng giao tiếp và điều hòa cảm xúc.</span>
						</li>
						<li class="bg-warm-cream p-4 rounded-xl border border-primary/20 flex items-center gap-3">
							<span class="material-symbols-outlined text-primary text-xl">edit_note</span>
							<span>Giao bài tập thực hành giữa các buổi.</span>
						</li>
						<li class="bg-warm-cream p-4 rounded-xl border border-primary/20 flex items-center gap-3 md:col-span-2">
							<span class="material-symbols-outlined text-primary text-xl">diversity_3</span>
							<span>Làm việc với gia đình hoặc người liên quan khi phù hợp.</span>
						</li>
					</ul>
				</div>

				<!-- Section 3: Cấm kỵ -->
				<div class="space-y-4 bg-error-container/20 p-6 rounded-2xl border border-emergency-red/30">
					<h2 class="text-xl md:text-2xl font-bold text-emergency-red flex items-center gap-2">
						<span class="material-symbols-outlined text-emergency-red">block</span>
						Nhà tham vấn KHÔNG làm gì?
					</h2>

					<ul class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-base text-on-surface">
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Quyết định thay thân chủ.</span>
						</li>
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Ép thân chủ làm theo quan điểm cá nhân.</span>
						</li>
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Hứa chắc chắn chữa khỏi.</span>
						</li>
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Tự ý yêu cầu ngừng thuốc.</span>
						</li>
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Chẩn đoán vội vàng qua vài tin nhắn.</span>
						</li>
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Xúc phạm, đe dọa hoặc làm nhục thân chủ.</span>
						</li>
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Có quan hệ tình cảm, tình dục hoặc tài chính với thân chủ.</span>
						</li>
						<li class="flex items-start gap-2.5 bg-white p-4 rounded-xl border border-surface-variant">
							<span class="material-symbols-outlined text-emergency-red text-lg shrink-0 mt-0.5">close</span>
							<span>Dùng câu chuyện của thân chủ để quảng cáo khi chưa được đồng ý hợp lệ.</span>
						</li>
					</ul>
				</div>
			</article>
		</div>
	</main>

	<Footer />
</div>
