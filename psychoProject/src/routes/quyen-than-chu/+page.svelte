<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const rights = [
		{ title: 'Tôn trọng tuyệt đối', desc: 'Được đối xử công bằng, tôn trọng và không bị kỳ thị dưới mọi hình thức.', icon: 'diversity_1', tag: 'Tôn trọng' },
		{ title: 'Minh bạch chuyên môn', desc: 'Biết rõ bằng cấp, kinh nghiệm và phương pháp tiếp cận của người hỗ trợ.', icon: 'school', tag: 'Minh bạch' },
		{ title: 'Giải thích rõ chi phí', desc: 'Rõ ràng về phương pháp, mức phí, thời lượng và chính sách buổi hẹn.', icon: 'payments', tag: 'Chi phí' },
		{ title: 'Bảo mật thông tin', desc: 'Được thông báo rõ ràng về cách thức mã hóa và bảo vệ dữ liệu cá nhân.', icon: 'lock', tag: 'Bảo mật' },
		{ title: 'Giới hạn bảo mật', desc: 'Được giải thích trước 4 trường hợp ngoại lệ liên quan đến an toàn tính mạng.', icon: 'shield_lock', tag: 'An toàn' },
		{ title: 'Đặt câu hỏi trị liệu', desc: 'Tự do trao đổi, thắc mắc về tiến trình và kỹ thuật đang được áp dụng.', icon: 'help', tag: 'Hỏi đáp' },
		{ title: 'Quyền từ chối kỹ thuật', desc: 'Có quyền từ chối bất kỳ bài tập hoặc kỹ thuật nào bạn chưa sẵn sàng.', icon: 'block', tag: 'Từ chối' },
		{ title: 'Ý kiến chuyên gia thứ 2', desc: 'Được tự do xin thêm ý kiến từ các chuyên gia khác để đối chiếu.', icon: 'group_add', tag: 'Ý kiến 2' },
		{ title: 'Đổi chuyên gia / Dừng', desc: 'Có toàn quyền yêu cầu đổi người phụ trách hoặc kết thúc tham vấn bất cứ lúc nào.', icon: 'swap_horiz', tag: 'Tự do chọn' },
		{ title: 'Phản ánh & Khiếu nại', desc: 'Được hướng dẫn quy trình phản ánh hoặc khiếu nại nếu quyền bị xâm phạm.', icon: 'report_problem', tag: 'Khiếu nại', isAlert: true }
	];
</script>

<svelte:head>
	<title>MÈO - 10 Quyền của thân chủ</title>
</svelte:head>

<div class="bg-background text-text-main font-body min-h-screen flex flex-col">
	<Navbar />

	<main class="flex-grow w-full px-4 sm:px-gutter max-w-container-max mx-auto py-8">
		<!-- Breadcrumb -->
		<div class="flex items-center gap-2 mb-6 text-xs sm:text-sm text-on-surface-variant font-medium">
			<a href="/trang-chu" class="hover:text-primary flex items-center gap-1">
				<span class="material-symbols-outlined text-base">arrow_back</span>
				Trang chủ
			</a>
			<span class="text-outline">/</span>
			<a href="/trang-chu?folder=quyen-than-chu" class="hover:text-primary">Thư mục Quyền thân chủ</a>
			<span class="text-outline">/</span>
			<span class="text-on-surface font-bold">10 Quyền lợi</span>
		</div>

		<div class="max-w-4xl mx-auto space-y-6">
			<header class="space-y-2 border-b border-surface-variant pb-5 text-center sm:text-left">
				<span
					class="bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block"
				>
					Quyền lợi và Bảo mật thông tin
				</span>
				<h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">
					10 Quyền cơ bản của thân chủ
				</h1>
				<p class="text-xs sm:text-sm text-on-surface-variant max-w-xl leading-relaxed">
					Quyền lực và sự an toàn luôn thuộc về bạn trong suốt tiến trình đồng hành cùng nhà chuyên môn.
				</p>
			</header>

			<!-- 2-Column Visual Infographic Cards Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
				{#each rights as r, i}
					<div
						class="p-4 rounded-2xl border transition-all shadow-xs flex items-start gap-3.5 {r.isAlert
							? 'bg-error-container/20 border-emergency-red/40'
							: 'bg-surface-off-white hover:bg-surface-container-low/60 border-surface-variant'}"
					>
						<div
							class="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center shadow-xs {r.isAlert
								? 'bg-emergency-red text-white'
								: 'bg-primary/10 text-primary border border-primary/20'}"
						>
							<span class="material-symbols-outlined text-2xl">{r.icon}</span>
						</div>

						<div class="space-y-1 flex-1">
							<div class="flex items-center justify-between gap-1 flex-wrap">
								<h3
									class="font-bold text-sm sm:text-base {r.isAlert
										? 'text-emergency-red'
										: 'text-on-surface'}"
								>
									{i + 1}. {r.title}
								</h3>
								<span
									class="text-[10px] font-bold px-2 py-0.5 rounded-full {r.isAlert
										? 'bg-emergency-red/20 text-emergency-red'
										: 'bg-primary/10 text-primary'}"
								>
									{r.tag}
								</span>
							</div>
							<p class="text-xs text-on-surface-variant leading-relaxed">
								{r.desc}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Back to 4 Folders CTA -->
			<div class="pt-6 text-center">
				<a
					href="/trang-chu?slide=1"
					class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-container transition-all shadow-md active:scale-95"
				>
					<span class="material-symbols-outlined text-base">folder_open</span>
					<span>Khám phá các thư mục kiến thức khác</span>
				</a>
			</div>
		</div>
	</main>

	<Footer />
</div>
