// MÈO Portal Main Application Logic

// Search Database Indexing Content from content.txt
const SEARCH_DATABASE = [
    {
        id: "than-chu",
        title: "Thân chủ – Client",
        category: "Các vai trò trong tham vấn và trị liệu",
        type: "article",
        desc: "Thân chủ là người sử dụng dịch vụ tham vấn hoặc trị liệu tâm lý, chủ động tham gia vào quá trình thay đổi.",
        link: "than-chu.html"
    },
    {
        id: "nha-tham-van",
        title: "Nhà tham vấn làm gì?",
        category: "Điều gì diễn ra trong phòng tham vấn?",
        type: "article",
        desc: "9 bước trong những buổi tham vấn đầu tiên, các phương pháp sử dụng và 8 điều cấm kỵ nhà tham vấn không được làm.",
        link: "nha-tham-van.html"
    },
    {
        id: "quyen-than-chu",
        title: "Quyền của thân chủ",
        category: "Quyền lợi và Bảo mật thông tin",
        type: "article",
        desc: "10 quyền lợi nền tảng bảo vệ sự an toàn, tôn trọng và minh bạch của thân chủ trong trị liệu.",
        link: "quyen-than-chu.html"
    },
    {
        id: "bao-mat",
        title: "Phân biệt rõ về bảo mật",
        category: "Quyền lợi và Bảo mật thông tin",
        type: "article",
        desc: "Nguyên tắc bảo mật thông tin trong tham vấn tâm lý và 4 trường hợp ngoại lệ cần chia sẻ thông tin.",
        link: "bao-mat.html"
    }
];

// Voice Recognition & Search Handler
document.addEventListener('DOMContentLoaded', () => {
    const mainSearchInput = document.getElementById('main-search-input');
    const navSearchInput = document.getElementById('nav-search-input');
    const micButton = document.getElementById('mic-search-btn');
    const searchResultsContainer = document.getElementById('search-results');
    const voiceStatus = document.getElementById('voice-status');

    // Handle URL search query parameter (e.g. trang-chu.html?q=than+chu)
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    if (initialQuery && mainSearchInput) {
        mainSearchInput.value = initialQuery;
        triggerSearch(initialQuery);
    }

    // Connect Navbar Search Input across all pages
    if (navSearchInput) {
        navSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = navSearchInput.value.trim();
                if (query) {
                    if (window.location.pathname.endsWith('trang-chu.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                        if (mainSearchInput) {
                            mainSearchInput.value = query;
                            triggerSearch(query);
                            mainSearchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    } else {
                        window.location.href = `trang-chu.html?q=${encodeURIComponent(query)}`;
                    }
                }
            }
        });
    }

    // Voice recognition setup using Web Speech API
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            if (voiceStatus) {
                voiceStatus.classList.remove('hidden');
                voiceStatus.innerHTML = `
                    <div class="flex items-center gap-2 text-primary font-semibold text-sm">
                        <span class="recording-wave"></span>
                        <span class="recording-wave"></span>
                        <span class="recording-wave"></span>
                        Đang lắng nghe... Hãy nói từ khóa bạn cần tìm!
                    </div>
                `;
            }
            if (micButton) micButton.classList.add('text-emergency-red', 'animate-pulse');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (mainSearchInput) {
                mainSearchInput.value = transcript;
                triggerSearch(transcript);
            }
            if (voiceStatus) voiceStatus.classList.add('hidden');
        };

        recognition.onerror = () => {
            if (voiceStatus) {
                voiceStatus.innerHTML = `<span class="text-xs text-emergency-red">Không thể nhận diện giọng nói. Bạn có thể gõ từ khóa vào ô tìm kiếm!</span>`;
            }
            if (micButton) micButton.classList.remove('text-emergency-red', 'animate-pulse');
        };

        recognition.onend = () => {
            if (micButton) micButton.classList.remove('text-emergency-red', 'animate-pulse');
        };
    }

    if (micButton) {
        micButton.addEventListener('click', () => {
            if (recognition) {
                try {
                    recognition.start();
                } catch (e) {
                    recognition.stop();
                }
            } else {
                alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói trực tiếp. Hãy dùng bàn phím để tìm kiếm nhé!');
            }
        });
    }

    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', (e) => {
            triggerSearch(e.target.value);
        });
    }

    function triggerSearch(query) {
        if (!searchResultsContainer) return;
        const trimmed = query.trim().toLowerCase();

        if (trimmed.length === 0) {
            searchResultsContainer.classList.add('hidden');
            searchResultsContainer.innerHTML = '';
            return;
        }

        const filtered = SEARCH_DATABASE.filter(item => 
            item.title.toLowerCase().includes(trimmed) || 
            item.category.toLowerCase().includes(trimmed) || 
            item.desc.toLowerCase().includes(trimmed)
        );

        searchResultsContainer.classList.remove('hidden');
        if (filtered.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="p-6 text-center text-on-surface-variant bg-surface-container-low rounded-2xl border border-surface-variant">
                    <span class="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
                    <p class="font-semibold">Không tìm thấy kết quả phù hợp với "${query}"</p>
                    <p class="text-xs mt-1">Gợi ý: Thử từ khóa như "thân chủ", "bảo mật", "quyền thân chủ" hoặc "nhà tham vấn".</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-semibold text-outline">Tìm thấy ${filtered.length} kết quả phù hợp:</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        `;

        filtered.forEach(item => {
            html += `
                <a href="${item.link}" class="bg-surface-off-white hover:bg-surface-container-low p-4 rounded-2xl border border-surface-variant shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">${item.category}</span>
                        </div>
                        <h4 class="font-bold text-on-surface text-base mb-1 group-hover:text-primary transition-colors">${item.title}</h4>
                        <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-2">${item.desc}</p>
                    </div>
                    <div class="mt-3 pt-2 border-t border-surface-variant/50 flex items-center justify-between text-xs text-primary font-semibold">
                        <span>Đọc bài viết</span>
                        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                </a>
            `;
        });

        html += `</div>`;
        searchResultsContainer.innerHTML = html;
    }
});
