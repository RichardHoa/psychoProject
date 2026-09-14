<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let isPlaying = $state(false);
	let seconds = $state(64); // start with a bit of progress
	let isMuted = $state(false);
	let showVideoModal = $state(false);
	let feedbackMessage = $state('');

	/** @type {any} */
	let audioTimer = null;

	const totalSeconds = 645; // 10:45

	let formattedTime = $derived.by(() => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s < 10 ? '0' : ''}${s} / 10:45`;
	});

	let progressPercent = $derived((seconds / totalSeconds) * 100);

	function togglePlay() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			audioTimer = setInterval(() => {
				seconds += 1;
				if (seconds >= totalSeconds) {
					seconds = 0;
					isPlaying = false;
					clearInterval(audioTimer);
				}
			}, 1000);
		} else {
			clearInterval(audioTimer);
		}
	}

	function toggleMute() {
		isMuted = !isMuted;
	}

	/** @param {'helpful' | 'improve'} type */
	function handleFeedback(type) {
		if (type === 'helpful') {
			feedbackMessage = 'Cảm ơn bạn đã phản hồi!';
		} else {
			feedbackMessage = 'Cảm ơn phản hồi của bạn. MÈO sẽ cải thiện nội dung tốt hơn!';
		}
		setTimeout(() => {
			feedbackMessage = '';
		}, 3000);
	}

	function handleShare() {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			feedbackMessage = 'Đã sao chép liên kết bài viết!';
			setTimeout(() => {
				feedbackMessage = '';
			}, 3000);
		}
	}

	function handleBookmark() {
		feedbackMessage = 'Đã lưu bài viết vào kho cá nhân!';
		setTimeout(() => {
			feedbackMessage = '';
		}, 3000);
	}
</script>

<svelte:head>
	<title>MÈO - Nhận Diện và Vượt Qua Tình Trạng Kiệt Sức (Burnout)</title>
</svelte:head>

<div class="bg-background text-text-main font-body min-h-screen flex flex-col">
	<Navbar />

	<!-- Main Content Body -->
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
			<span class="text-on-surface font-bold truncate">Kiệt sức (Burnout)</span>
		</div>

		<div class="max-w-4xl mx-auto space-y-8">
			<!-- Article Header -->
			<header class="space-y-4">
				<div class="flex flex-wrap items-center gap-3">
					<span
						class="bg-tertiary-container/10 text-tertiary-container px-3.5 py-1 rounded-full text-sm font-semibold"
					>
						Sức khỏe công việc
					</span>
					<span class="text-on-surface-variant flex items-center gap-1 text-base">
						<span class="material-symbols-outlined text-base">schedule</span> 10 phút đọc
					</span>
					<span class="text-on-surface-variant flex items-center gap-1 text-base">
						<span class="material-symbols-outlined text-base">visibility</span> 1.2k lượt xem
					</span>
				</div>

				<h1 class="text-3xl md:text-4xl font-extrabold text-primary-container leading-tight">
					Nhận diện và vượt qua Tình trạng Kiệt sức (Burnout)
				</h1>

				<p class="text-lg text-on-surface-variant leading-relaxed">
					Kiệt sức không chỉ là mệt mỏi thông thường. Đó là một trạng thái cạn kiệt năng lượng về cả
					thể chất, tinh thần và cảm xúc do căng thẳng kéo dài chưa được giải tỏa.
				</p>

				<!-- Audio Player Widget -->
				<div
					class="bg-warm-cream rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-primary/20"
				>
					<button
						onclick={togglePlay}
						class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shrink-0 shadow-md cursor-pointer"
					>
						<span
							class="material-symbols-outlined text-2xl"
							style="font-variation-settings: 'FILL' 1;"
						>
							{isPlaying ? 'pause' : 'play_arrow'}
						</span>
					</button>

					<div class="grow">
						<div class="flex justify-between items-center mb-1">
							<span class="font-bold text-base text-on-surface"
								>Nghe bài viết này (MÈO Audio Voice)</span
							>
							<span class="text-base text-on-surface-variant">{formattedTime}</span>
						</div>
						<!-- Progress Bar -->
						<div
							class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden cursor-pointer"
						>
							<div
								class="bg-primary h-full progress-bar-fill rounded-full"
								style="width: {progressPercent}%;"
							></div>
						</div>
					</div>

					<button
						onclick={toggleMute}
						class="text-on-surface-variant hover:text-primary transition-colors shrink-0 p-2 cursor-pointer"
						title="Âm lượng"
					>
						<span class="material-symbols-outlined text-xl">
							{isMuted ? 'volume_off' : 'volume_up'}
						</span>
					</button>
				</div>
			</header>

			<!-- Video Section with Mascot Speaking -->
			<section
				class="rounded-3xl overflow-hidden bg-surface-container-low shadow-sm border border-surface-variant relative group"
			>
				<div class="aspect-[2.1/1] w-full relative bg-surface-dim flex items-center justify-center">
					<img
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwWhaMIX3Pgum1CvGlFUo_Dvd-dPzAswLO37dV8AsdJqdz24qmmoIO5hfFP-ZltcPzHZfBMZvl1ofbIRuVtpdA6yJat1ZO40n_SIQOXJrnvCxGa4ey6EbmGojWkKhKWj_41EmCwU5CBTSNWq_Q9fAFRGG2gh-OyK0QsCOSSvsTGdIpLqruhVP4-2HC9bdGUB1xtcIwKda8zLBm1oqp6Pd743qUsb-KMrMMDfMwXAa1PcoOOk_xjbmNvQ"
						alt="Mascot MÈO giải thích về kiệt sức"
						class="w-full h-full object-contain p-4"
					/>

					<!-- Play Overlay -->
					<div
						onclick={() => (showVideoModal = true)}
						onkeydown={(e) => e.key === 'Enter' && (showVideoModal = true)}
						role="button"
						tabindex="0"
						class="absolute inset-0 bg-on-surface/25 group-hover:bg-on-surface/15 transition-colors flex flex-col items-center justify-center cursor-pointer"
					>
						<div
							class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-2"
						>
							<span
								class="material-symbols-outlined text-primary text-3xl"
								style="font-variation-settings: 'FILL' 1;">play_arrow</span
							>
						</div>
						<span class="bg-white/90 px-4 py-1.5 rounded-full text-base font-bold text-primary shadow-sm"
							>Xem video MÈO chia sẻ</span
						>
					</div>

					<div
						class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm"
					>
						<span
							class="material-symbols-outlined text-primary text-lg"
							style="font-variation-settings: 'FILL' 1;">closed_caption</span
						>
						<span class="text-sm font-semibold text-on-surface">Phụ đề tiếng Việt đầy đủ</span>
					</div>
				</div>
			</section>

			<!-- Main Article Content Body -->
			<article class="prose prose-lg max-w-none text-on-surface space-y-6 leading-relaxed text-base">
				<h2 class="text-2xl font-bold text-primary mt-6 mb-3">1. Burnout là gì?</h2>
				<p class="text-base leading-relaxed">
					Theo Tổ chức Y tế Thế giới (WHO), hội chứng kiệt sức nghề nghiệp (burnout) được định nghĩa
					là một hội chứng do căng thẳng mãn tính tại nơi làm việc chưa được quản lý thành công. Nó
					đặc trưng bởi 3 khía cạnh chính:
				</p>

				<ul class="space-y-3.5 my-4 pl-2 text-base">
					<li
						class="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-variant"
					>
						<span
							class="material-symbols-outlined text-primary mt-0.5"
							style="font-variation-settings: 'FILL' 1;">check_circle</span
						>
						<span
							><strong>Cạn kiệt năng lượng:</strong> Cảm giác kiệt sức triền miên về thể chất và tinh
							thần ngay cả sau khi vừa ngủ dậy.</span
						>
					</li>
					<li
						class="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-variant"
					>
						<span
							class="material-symbols-outlined text-primary mt-0.5"
							style="font-variation-settings: 'FILL' 1;">check_circle</span
						>
						<span
							><strong>Khoảng cách tinh thần:</strong> Có cảm giác tiêu cực, hoài nghi, xa lánh hoặc
							bất mãn liên quan đến công việc.</span
						>
					</li>
					<li
						class="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-variant"
					>
						<span
							class="material-symbols-outlined text-primary mt-0.5"
							style="font-variation-settings: 'FILL' 1;">check_circle</span
						>
						<span
							><strong>Giảm hiệu quả chuyên môn:</strong> Cảm thấy bản thân kém cỏi, không hoàn
							thành nhiệm vụ như trước.</span
						>
					</li>
				</ul>

				<!-- Visualization Bento Box: 4 Stages -->
				<div
					class="my-8 bg-surface-off-white rounded-3xl p-6 shadow-sm border border-surface-variant space-y-4"
				>
					<h3 class="text-xl font-bold text-on-surface text-center">
						Trực quan hóa: 4 Giai đoạn diễn tiến của Burnout
					</h3>

					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
						<!-- Stage 1 -->
						<div
							class="bg-white p-4 rounded-2xl text-center border-t-4 border-primary shadow-sm hover:-translate-y-1 transition-transform"
						>
							<span class="material-symbols-outlined text-primary text-3xl mb-1"
								>battery_charging_full</span
							>
							<h4 class="font-bold text-base text-on-surface mb-1">1. Tuần trăng mật</h4>
							<p class="text-sm text-on-surface-variant">
								Nhiệt huyết cao nhưng bắt đầu tích tụ căng thẳng nhẹ.
							</p>
						</div>
						<!-- Stage 2 -->
						<div
							class="bg-white p-4 rounded-2xl text-center border-t-4 border-yellow-500 shadow-sm hover:-translate-y-1 transition-transform"
						>
							<span class="material-symbols-outlined text-yellow-600 text-3xl mb-1"
								>battery_5_bar</span
							>
							<h4 class="font-bold text-base text-on-surface mb-1">2. Bắt đầu căng thẳng</h4>
							<p class="text-sm text-on-surface-variant">
								Xuất hiện những ngày mệt mỏi, khó tập trung hơn bình thường.
							</p>
						</div>
						<!-- Stage 3 -->
						<div
							class="bg-white p-4 rounded-2xl text-center border-t-4 border-orange-500 shadow-sm hover:-translate-y-1 transition-transform"
						>
							<span class="material-symbols-outlined text-orange-600 text-3xl mb-1"
								>battery_1_bar</span
							>
							<h4 class="font-bold text-base text-on-surface mb-1">3. Căng thẳng mãn tính</h4>
							<p class="text-sm text-on-surface-variant">
								Căng thẳng diễn ra liên tục, bắt đầu xa lánh đồng nghiệp.
							</p>
						</div>
						<!-- Stage 4 -->
						<div
							class="bg-white p-4 rounded-2xl text-center border-t-4 border-emergency-red shadow-sm hover:-translate-y-1 transition-transform"
						>
							<span class="material-symbols-outlined text-emergency-red text-3xl mb-1"
								>battery_0_bar</span
							>
							<h4 class="font-bold text-base text-on-surface mb-1">4. Kiệt sức hoàn toàn</h4>
							<p class="text-sm text-on-surface-variant">
								Cạn kiệt năng lượng, ảnh hưởng nghiêm trọng sinh hoạt.
							</p>
						</div>
					</div>
				</div>

				<h2 class="text-2xl font-bold text-primary mt-8 mb-3">
					2. Phương pháp phục hồi & Thiết lập ranh giới
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
					<div class="bg-warm-cream p-5 rounded-2xl border border-primary/20 space-y-2">
						<span class="material-symbols-outlined text-primary text-3xl">self_care</span>
						<h4 class="font-bold text-on-surface text-lg">Ưu tiên tự chăm sóc bản thân</h4>
						<p class="text-base text-on-surface-variant leading-relaxed">
							Đảm bảo giấc ngủ chất lượng, dinh dưỡng cân bằng và vận động nhẹ nhàng. Không ép buộc
							bản thân tập luyện quá sức khi thể trạng đang kiệt sức.
						</p>
					</div>

					<div
						class="bg-surface-container-low p-5 rounded-2xl border border-surface-variant space-y-2"
					>
						<span class="material-symbols-outlined text-primary text-3xl">front_hand</span>
						<h4 class="font-bold text-on-surface text-lg">Thiết lập ranh giới công việc</h4>
						<p class="text-base text-on-surface-variant leading-relaxed">
							Học cách nói "Không" một cách lịch sự với công việc vượt quá năng lực hiện tại. Tắt
							thông báo email và tin nhắn làm việc sau giờ hành chính.
						</p>
					</div>
				</div>

				<!-- Warning Banner for Crisis -->
				<div
					class="bg-error-container/30 border-l-4 border-emergency-red p-5 rounded-r-2xl mt-6"
				>
					<div class="flex items-start gap-3.5">
						<span
							class="material-symbols-outlined text-emergency-red text-2xl"
							style="font-variation-settings: 'FILL' 1;">warning</span
						>
						<div>
							<h4 class="font-bold text-on-surface text-base mb-1">
								Khi nào bạn cần tìm sự hỗ trợ của Chuyên gia Tâm lý?
							</h4>
							<p class="text-base text-on-surface-variant leading-relaxed mb-3">
								Nếu tình trạng kiệt sức kéo dài trên vài tuần, ảnh hưởng đến khả năng làm việc hoặc
								xuất hiện suy nghĩ tiêu cực về bản thân, hãy tìm đến sự trợ giúp chuyên môn.
							</p>
							<a
								href="/trang-chu#ban-do-thong-tin"
								class="inline-flex items-center gap-1.5 text-base font-bold text-primary underline hover:text-primary-container"
							>
								Xem Bản đồ thông tin Tham vấn Tâm lý <span
									class="material-symbols-outlined text-base">arrow_forward</span
								>
							</a>
						</div>
					</div>
				</div>
			</article>

			<!-- Feedback Notice -->
			{#if feedbackMessage}
				<div class="bg-primary/10 border border-primary/20 text-primary p-3 rounded-xl text-base font-semibold text-center fade-in">
					{feedbackMessage}
				</div>
			{/if}

			<!-- Feedback Bar -->
			<div
				class="border-t border-surface-variant pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-base"
			>
				<div class="flex items-center gap-3">
					<span class="font-semibold text-on-surface">Bài viết này có hữu ích với bạn không?</span>
					<button
						onclick={() => handleFeedback('helpful')}
						class="px-4 py-2 rounded-full bg-surface-container-low hover:bg-primary/10 text-on-surface border border-surface-variant transition-colors flex items-center gap-1.5 cursor-pointer text-base"
					>
						<span class="material-symbols-outlined text-base">thumb_up</span> Hữu ích
					</button>
					<button
						onclick={() => handleFeedback('improve')}
						class="px-4 py-2 rounded-full bg-surface-container-low hover:bg-red-50 text-on-surface border border-surface-variant transition-colors flex items-center gap-1.5 cursor-pointer text-base"
					>
						<span class="material-symbols-outlined text-base">thumb_down</span> Cần cải thiện
					</button>
				</div>

				<div class="flex items-center gap-4 text-outline">
					<button
						onclick={handleShare}
						class="hover:text-primary flex items-center gap-1.5 cursor-pointer text-base"
					>
						<span class="material-symbols-outlined text-base">share</span> Chia sẻ
					</button>
					<button
						onclick={handleBookmark}
						class="hover:text-primary flex items-center gap-1.5 cursor-pointer text-base"
					>
						<span class="material-symbols-outlined text-base">bookmark</span> Lưu bài
					</button>
				</div>
			</div>
		</div>
	</main>

	<!-- Video Modal Player -->
	{#if showVideoModal}
		<div
			class="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50 fade-in"
		>
			<div
				class="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col border border-surface-variant"
			>
				<div
					class="p-4 bg-surface-container-low border-b border-surface-variant flex items-center justify-between"
				>
					<div class="flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">smart_display</span>
						<h3 class="font-bold text-on-surface text-base">
							MÈO Giải Thích: Tình Trạng Kiệt Sức (Burnout)
						</h3>
					</div>
					<button
						onclick={() => (showVideoModal = false)}
						class="p-1.5 text-outline hover:text-on-surface rounded-full cursor-pointer"
					>
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>

				<div class="relative aspect-video bg-black flex items-center justify-center">
					<img
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwWhaMIX3Pgum1CvGlFUo_Dvd-dPzAswLO37dV8AsdJqdz24qmmoIO5hfFP-ZltcPzHZfBMZvl1ofbIRuVtpdA6yJat1ZO40n_SIQOXJrnvCxGa4ey6EbmGojWkKhKWj_41EmCwU5CBTSNWq_Q9fAFRGG2gh-OyK0QsCOSSvsTGdIpLqruhVP4-2HC9bdGUB1xtcIwKda8zLBm1oqp6Pd743qUsb-KMrMMDfMwXAa1PcoOOk_xjbmNvQ"
						alt="Video Mascot MÈO"
						class="w-full h-full object-contain"
					/>

					<!-- Simulated Subtitles -->
					<div class="absolute bottom-6 left-6 right-6 text-center">
						<span
							class="bg-black/80 text-white px-4 py-2 rounded-xl text-base font-medium shadow-lg inline-block"
						>
							"Chào bạn! Kiệt sức không phải là sự yếu đuối, đó chỉ là tín hiệu cơ thể báo bạn cần được
							nghỉ ngơi và hỗ trợ."
						</span>
					</div>
				</div>

				<div
					class="p-4 bg-surface-container-low border-t border-surface-variant flex justify-between items-center text-base"
				>
					<span class="text-on-surface-variant">Thời lượng: 03:20 • Đội ngũ MÈO thực hiện</span>
					<button
						onclick={() => (showVideoModal = false)}
						class="px-5 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-container cursor-pointer text-base"
					>
						Đóng Video
					</button>
				</div>
			</div>
		</div>
	{/if}

	<Footer />
</div>
