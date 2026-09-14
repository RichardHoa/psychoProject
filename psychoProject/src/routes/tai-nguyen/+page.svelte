<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>MÈO - Thư Viện Tài Nguyên Tham Vấn</title>
</svelte:head>

<div class="bg-background text-text-main font-body min-h-screen flex flex-col">
	<Navbar />

	<main class="flex-grow flex flex-col gap-12 py-16 w-full px-gutter max-w-container-max mx-auto">
		<!-- Hero Header -->
		<section class="text-center flex flex-col items-center gap-4">
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary max-w-3xl leading-tight">
				Khám phá kho tàng kiến thức để chăm sóc tâm hồn bạn.
			</h1>
			<p class="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
				MÈO cung cấp các bài viết, hướng dẫn và công cụ giúp bạn hiểu rõ bản thân và tìm lại sự cân bằng trong cuộc sống.
			</p>
		</section>

		<!-- Topic Categories -->
		<section class="w-full max-w-2xl mx-auto space-y-10 pt-4">
			<!-- Category 1 -->
			<div class="space-y-3">
				<h2 class="text-xl md:text-2xl font-bold text-primary">
					Các vai trò trong tham vấn và trị liệu
				</h2>
				<div class="border-b border-[#cbdad0] w-full"></div>
				<ul class="space-y-3.5 pt-1 pl-4">
					<li>
						<a
							href="/than-chu"
							class="text-base md:text-lg font-normal text-on-surface hover:text-primary transition-colors block"
						>
							Thân chủ – Client
						</a>
					</li>
				</ul>
			</div>

			<!-- Category 2 -->
			<div class="space-y-3">
				<h2 class="text-xl md:text-2xl font-bold text-primary">
					Điều gì diễn ra trong phòng tham vấn?
				</h2>
				<div class="border-b border-[#cbdad0] w-full"></div>
				<ul class="space-y-3.5 pt-1 pl-4">
					<li>
						<a
							href="/nha-tham-van"
							class="text-base md:text-lg font-normal text-on-surface hover:text-primary transition-colors block"
						>
							Nhà tham vấn làm gì?
						</a>
					</li>
				</ul>
			</div>

			<!-- Category 3 -->
			<div class="space-y-3">
				<h2 class="text-xl md:text-2xl font-bold text-primary">
					Quyền lợi và Bảo mật thông tin
				</h2>
				<div class="border-b border-[#cbdad0] w-full"></div>
				<ul class="space-y-4 pt-1 pl-4">
					<li>
						<a
							href="/quyen-than-chu"
							class="text-base md:text-lg font-normal text-on-surface hover:text-primary transition-colors block"
						>
							Quyền của thân chủ
						</a>
					</li>
					<li>
						<a
							href="/bao-mat"
							class="text-base md:text-lg font-normal text-on-surface hover:text-primary transition-colors block"
						>
							Phân biệt rõ về bảo mật
						</a>
					</li>
					<li>
						<a
							href="/bai-viet"
							class="text-base md:text-lg font-normal text-on-surface hover:text-primary transition-colors block"
						>
							Nhận diện và Vượt qua tình trạng Kiệt sức (Burnout)
						</a>
					</li>
				</ul>
			</div>
		</section>
	</main>

	<Footer />
</div>
