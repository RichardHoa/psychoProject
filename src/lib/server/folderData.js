// Knowledge Folders Hub Data for Mobile-First Hierarchical Visual Infographics Navigation

/**
 * @typedef {Object} FolderItem
 * @property {string} title
 * @property {string} content
 * @property {string} [tag]
 * @property {string} [icon]
 * @property {boolean} [isAlert]
 * @property {string} [link]
 */

/**
 * @typedef {Object} Subfolder
 * @property {string} id
 * @property {string} title
 * @property {string} icon
 * @property {string} desc
 * @property {FolderItem[]} items
 */

/**
 * @typedef {Object} Folder
 * @property {string} id
 * @property {string} title
 * @property {string} shortTitle
 * @property {string} category
 * @property {string} icon
 * @property {string} colorName
 * @property {string} accentColor
 * @property {string} badgeColor
 * @property {string} summary
 * @property {string[]} highlights
 * @property {boolean} [wide]
 * @property {Subfolder[]} subfolders
 */

/** @type {Folder[]} */
export const FOLDERS_DATA = [
	{
		id: 'bao-mat',
		title: 'Phân biệt về bảo mật',
		shortTitle: 'Bảo mật',
		category: 'Quyền lợi và Bảo mật thông tin',
		icon: 'lock',
		colorName: 'primary',
		accentColor: 'text-primary bg-primary/10 border-primary/20',
		badgeColor: 'bg-primary/10 text-primary',
		summary: 'Nguyên tắc nền tảng & 4 giới hạn an toàn',
		highlights: ['Riêng tư', '4 ngoại lệ', 'Mã hóa'],
		subfolders: [
			{
				id: 'nguyen-tac',
				title: 'Nguyên tắc nền tảng',
				icon: 'verified_user',
				desc: 'Cam kết đạo đức cốt lõi tạo không gian an toàn.',
				items: [
					{
						title: 'Không gian riêng tư tuyệt đối',
						content: 'Mọi câu chuyện và cảm xúc trong phòng tham vấn đều được bảo vệ nghiêm ngặt.',
						tag: 'Riêng tư 100%',
						icon: 'lock'
					},
					{
						title: 'Không tiết lộ cho bên thứ ba',
						content: 'Không chia sẻ cho gia đình, nhà trường hay công ty nếu chưa có đồng thuận văn bản.',
						tag: 'Bảo vệ danh tính',
						icon: 'shield'
					},
					{
						title: 'Lưu trữ hồ sơ an toàn',
						content: 'Ghi chép chuyên môn được mã hóa và cất giữ cẩn mật chuẩn y tế & tâm lý.',
						tag: 'Mã hóa dữ liệu',
						icon: 'folder_special'
					}
				]
			},
			{
				id: 'ngoai-le',
				title: '4 Ngoại lệ cần chia sẻ',
				icon: 'warning',
				desc: 'Các tình huống khẩn cấp bắt buộc để bảo toàn sinh mạng.',
				items: [
					{
						title: '1. Nguy cơ gây hại bản thân',
						content: 'Khi có kế hoạch, ý định hoặc hành vi tự hại hoặc tự sát nghiêm trọng.',
						tag: 'Khẩn cấp',
						icon: 'person_alert',
						isAlert: true
					},
					{
						title: '2. Nguy cơ gây hại người khác',
						content: 'Khi có đe dọa trực tiếp đến tính mạng hoặc sự an toàn của người xung quanh.',
						tag: 'Khẩn cấp',
						icon: 'group_off',
						isAlert: true
					},
					{
						title: '3. Yêu cầu pháp lý từ tòa án',
						content: 'Khi có lệnh triệu tập hoặc yêu cầu hợp pháp chính thức từ tòa án có thẩm quyền.',
						tag: 'Pháp lý',
						icon: 'gavel'
					},
					{
						title: '4. Giám sát chuyên môn kín',
						content: 'Trao đổi với Supervisor để nâng cao chất lượng hỗ trợ (100% ẩn danh thông tin).',
						tag: 'Ẩn danh',
						icon: 'supervisor_account'
					}
				]
			},
			{
				id: 'hoi-dap-bao-mat',
				title: 'Hỏi đáp nhanh về bảo mật',
				icon: 'help_center',
				desc: 'Giải đáp thắc mắc phổ biến nhất trước buổi tham vấn.',
				items: [
					{
						title: 'Có nói cho cha mẹ tôi không?',
						content: 'Nếu bạn từ 18 tuổi trở lên, tuyệt đối KHÔNG chia sẻ trừ khi nguy cấp tính mạng.',
						tag: 'Từ 18 tuổi',
						icon: 'family_restroom'
					},
					{
						title: 'Tôi có được xem hồ sơ không?',
						content: 'Bạn luôn có quyền xem tóm tắt tiến trình và hồ sơ tham vấn của chính mình.',
						tag: 'Xem hồ sơ',
						icon: 'description'
					}
				]
			}
		]
	},
	{
		id: 'than-chu',
		title: 'Thân chủ – Client',
		shortTitle: 'Thân chủ',
		category: 'Các vai trò trong tham vấn và trị liệu',
		icon: 'person',
		colorName: 'tertiary',
		accentColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
		badgeColor: 'bg-tertiary/10 text-tertiary',
		summary: 'Trung tâm tiến trình & chuyên gia cuộc đời mình',
		highlights: ['Bình đẳng', 'Chủ động', 'Ranh giới'],
		subfolders: [
			{
				id: 'vai-tro',
				title: 'Thân chủ là ai?',
				icon: 'badge',
				desc: 'Định nghĩa đúng đắn và góc nhìn nhân văn về thân chủ.',
				items: [
					{
						title: 'Người chủ động đồng hành',
						content: 'Chủ động tìm kiếm trợ giúp, cùng nhà chuyên môn tạo nên sự thay đổi tích cực.',
						tag: 'Chủ động',
						icon: 'explore'
					},
					{
						title: 'Chuyên gia của cuộc đời bạn',
						content: 'Nhà tham vấn hiểu chuyên môn, nhưng bạn là người hiểu rõ nhất trải nghiệm bản thân.',
						tag: 'Chuyên gia',
						icon: 'lightbulb'
					},
					{
						title: 'Bình đẳng & Không phán xét',
						content: 'Vị thế bình đẳng, được lắng nghe trọn vẹn và không bị dán nhãn tiêu cực.',
						tag: 'Không phán xét',
						icon: 'favorite'
					}
				]
			},
			{
				id: 'tam-the',
				title: 'Tâm thế khi tham vấn',
				icon: 'spa',
				desc: 'Gợi ý chuẩn bị tốt nhất trước khi bước vào buổi hẹn.',
				items: [
					{
						title: 'Cho phép mình chân thật',
						content: 'Không cần hoàn hảo hay gồng mình. Cứ là chính bạn với mọi cung bậc cảm xúc.',
						tag: 'Chân thật',
						icon: 'self_improvement'
					},
					{
						title: 'Kiên nhẫn với tiến trình',
						content: 'Chữa lành là hành trình từng bước nhỏ, hãy bao dung với tốc độ của riêng bạn.',
						tag: 'Từng bước',
						icon: 'schedule'
					},
					{
						title: 'Đặt ranh giới thoải mái',
						content: 'Bạn luôn có quyền nói "Tôi chưa sẵn sàng chia sẻ điều này" bất cứ lúc nào.',
						tag: 'Ranh giới an toàn',
						icon: 'front_hand'
					}
				]
			}
		]
	},
	{
		id: 'nha-tham-van',
		title: 'Nhà tham vấn làm gì?',
		shortTitle: 'Nhà tham vấn',
		category: 'Điều gì diễn ra trong phòng tham vấn?',
		icon: 'psychology',
		colorName: 'teal',
		accentColor: 'text-primary bg-surface-off-white border-primary/20',
		badgeColor: 'bg-primary/10 text-primary',
		summary: '9 bước đầu, phương pháp & 8 điều cấm kỵ',
		highlights: ['9 bước đầu', 'Thấu cảm', '8 điều cấm'],
		subfolders: [
			{
				id: '9-buoc-dau',
				title: '9 Bước trong các buổi đầu',
				icon: 'format_list_numbered',
				desc: 'Quy trình chuẩn mực để thiết lập lộ trình hỗ trợ.',
				items: [
					{
						title: '1. Giới thiệu khuôn khổ',
						content: 'Rõ ràng về vai trò, chi phí, thời lượng phiên và phương thức tương tác.',
						tag: 'Bước 1',
						icon: 'info'
					},
					{
						title: '2. Thống nhất bảo mật',
						content: 'Giải thích chi tiết nguyên tắc bảo mật và các ngoại lệ an toàn bắt buộc.',
						tag: 'Bước 2',
						icon: 'lock'
					},
					{
						title: '3. Lắng nghe lý do đến',
						content: 'Chia sẻ khó khăn, trăn trở hoặc sự kiện thúc đẩy bạn tìm kiếm hỗ trợ.',
						tag: 'Bước 3',
						icon: 'forum'
					},
					{
						title: '4. Khảo sát toàn diện',
						content: 'Tìm hiểu cảm xúc, suy nghĩ, hành vi, thể chất và môi trường sống.',
						tag: 'Bước 4',
						icon: 'psychology'
					},
					{
						title: '5. Đánh giá mức độ an toàn',
						content: 'Kiểm tra mức độ an toàn, tầm soát nguy cơ tự hại hoặc khủng hoảng.',
						tag: 'Bước 5 • An toàn',
						icon: 'health_and_safety',
						isAlert: true
					},
					{
						title: '6. Đồng thuận mục tiêu',
						content: 'Cùng thảo luận và thống nhất những mục tiêu cụ thể muốn đạt được.',
						tag: 'Bước 6',
						icon: 'flag'
					},
					{
						title: '7. Lựa chọn phương pháp',
						content: 'Áp dụng trường phái trị liệu khoa học phù hợp nhất với tính cách của bạn.',
						tag: 'Bước 7',
						icon: 'design_services'
					},
					{
						title: '8. Theo dõi & Điều chỉnh',
						content: 'Định kỳ đánh giá tiến triển và linh hoạt điều chỉnh kế hoạch.',
						tag: 'Bước 8',
						icon: 'tune'
					},
					{
						title: '9. Chuyển tuyến khi cần',
						content: 'Giới thiệu bác sĩ chuyên khoa khi vấn đề vượt quá phạm vi năng lực.',
						tag: 'Bước 9',
						icon: 'transfer_within_a_station'
					}
				]
			},
			{
				id: 'phuong-phap',
				title: 'Phương pháp tiếp cận',
				icon: 'auto_fix_high',
				desc: 'Các công cụ khoa học nhà tham vấn sử dụng.',
				items: [
					{
						title: 'Lắng nghe chủ động & Thấu cảm',
						content: 'Không gian an toàn tuyệt đối để bạn trải lòng mà không sợ bị phán xét.',
						tag: 'Thấu cảm',
						icon: 'hearing'
					},
					{
						title: 'Nhận diện vòng lặp nhận thức',
						content: 'Gỡ rối mối liên hệ giữa Suy nghĩ – Cảm xúc – Hành vi.',
						tag: 'Nhận thức',
						icon: 'sync'
					},
					{
						title: 'Kỹ năng điều hòa hệ thần kinh',
						content: 'Bài tập hít thở, thư giãn và kỹ năng giao tiếp lành mạnh.',
						tag: 'Điều hòa',
						icon: 'spa'
					},
					{
						title: 'Thực hành giữa các buổi',
						content: 'Nhật ký cảm xúc hoặc thử thách nhỏ áp dụng vào cuộc sống thực tế.',
						tag: 'Thực hành',
						icon: 'edit_note'
					}
				]
			},
			{
				id: '8-dieu-cam-ky',
				title: '8 Điều CẤM KỴ nhà tham vấn',
				icon: 'block',
				desc: 'Những hành vi vi phạm đạo đức TUYỆT ĐỐI không được làm.',
				items: [
					{
						title: '1. Quyết định thay cho bạn',
						content: 'Không ép buộc thân chủ ly hôn, nghỉ việc hay chọn lựa thay bạn.',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					},
					{
						title: '2. Ép buộc quan điểm cá nhân',
						content: 'Không áp đặt định kiến tôn giáo, chính trị hay giá trị cá nhân.',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					},
					{
						title: '3. Hứa chắc chắn chữa khỏi',
						content: 'Không đưa ra cam kết chữa khỏi 100% không có căn cứ khoa học.',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					},
					{
						title: '4. Tự ý yêu cầu ngừng thuốc',
						content: 'Chỉ bác sĩ tâm thần mới có quyền kê đơn hoặc điều chỉnh thuốc.',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					},
					{
						title: '5. Chẩn đoán vội vã qua tin nhắn',
						content: 'Không dán nhãn bệnh lý tâm thần qua loa mà không qua quy trình chuẩn.',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					},
					{
						title: '6. Xúc phạm hoặc thao túng',
						content: 'Không bao giờ đe dọa, chế giễu hay thao túng tâm lý (gaslighting).',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					},
					{
						title: '7. Quan hệ tình cảm & tiền bạc',
						content: 'Cấm quan hệ tình cảm, tình dục hoặc vay mượn tiền bạc với thân chủ.',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					},
					{
						title: '8. Dùng chuyện riêng để PR',
						content: 'Không công khai câu chuyện thân chủ nhằm mục đích thương mại.',
						tag: 'Vi phạm',
						icon: 'close',
						isAlert: true
					}
				]
			}
		]
	},
	{
		id: 'quyen-than-chu',
		title: 'Quyền của thân chủ',
		shortTitle: 'Quyền thân chủ',
		category: 'Quyền lợi và Bảo mật thông tin',
		icon: 'gavel',
		colorName: 'tertiary',
		accentColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
		badgeColor: 'bg-tertiary/10 text-tertiary',
		summary: '10 quyền lợi pháp lý & ứng phó vi phạm',
		highlights: ['10 quyền lợi', 'Minh bạch', 'Ứng phó vi phạm'],
		subfolders: [
			{
				id: '10-quyen-loi',
				title: '10 Quyền lợi nền tảng',
				icon: 'policy',
				desc: 'Quyền lực thuộc về bạn trong suốt hành trình chăm sóc tâm lý.',
				items: [
					{
						title: '1. Thông tin minh bạch',
						content: 'Biết rõ bằng cấp, kinh nghiệm và phương pháp can thiệp của chuyên gia.',
						tag: 'Minh bạch',
						icon: 'info'
					},
					{
						title: '2. Tôn trọng tuyệt đối',
						content: 'Tôn trọng giá trị cá nhân, giới tính, tín ngưỡng và xuất thân.',
						tag: 'Tôn trọng',
						icon: 'diversity_1'
					},
					{
						title: '3. Bảo mật thông tin',
						content: 'Bảo vệ dữ liệu cá nhân và nội dung trò chuyện theo chuẩn đạo đức & pháp luật.',
						tag: 'Bảo mật',
						icon: 'lock'
					},
					{
						title: '4. Tự nguyện & Đồng thuận',
						content: 'Chỉ tham gia khi bạn tự nguyện hiểu rõ mục đích và phương thức (Informed Consent).',
						tag: 'Tự nguyện',
						icon: 'handshake'
					},
					{
						title: '5. Từ chối trả lời',
						content: 'Bạn hoàn toàn có quyền không trả lời câu hỏi khi chưa thấy thoải mái.',
						tag: 'Từ chối',
						icon: 'do_not_disturb_on'
					},
					{
						title: '6. Tạm dừng hoặc kết thúc',
						content: 'Bạn có quyền dừng hoặc ngưng quá trình tham vấn bất kỳ lúc nào.',
						tag: 'Tự do dừng',
						icon: 'pause_circle'
					},
					{
						title: '7. Phản hồi & Khiếu nại',
						content: 'Được bày tỏ không hài lòng và khiếu nại nếu chuyên gia vi phạm đạo đức.',
						tag: 'Khiếu nại',
						icon: 'campaign'
					},
					{
						title: '8. Ý kiến thứ hai (Second Opinion)',
						content: 'Tự do tham khảo thêm chuyên gia khác hoặc yêu cầu đổi người hỗ trợ.',
						tag: 'Ý kiến thứ 2',
						icon: 'group_add'
					},
					{
						title: '9. Giải thích rõ chi phí',
						content: 'Minh bạch về mức phí, thời lượng và chính sách hoàn hủy trước buổi gặp.',
						tag: 'Minh bạch phí',
						icon: 'payments'
					},
					{
						title: '10. Hỗ trợ khẩn cấp',
						content: 'Được hướng dẫn cụ thể phương án trợ giúp khi gặp khủng hoảng tinh thần.',
						tag: 'Cấp cứu 24/7',
						icon: 'emergency'
					}
				]
			},
			{
				id: 'ung-pho-vi-pham',
				title: 'Làm gì khi quyền bị vi phạm?',
				icon: 'report_problem',
				desc: '3 Bước hành động ngay để bảo vệ bản thân khi có dấu hiệu bất thường.',
				items: [
					{
						title: 'Bước 1: Phản hồi trực tiếp',
						content: 'Nói rõ cảm giác khó chịu hoặc ranh giới bị xâm phạm ngay trong phiên.',
						tag: 'Bước 1 • Phản hồi',
						icon: 'chat'
					},
					{
						title: 'Bước 2: Yêu cầu đổi chuyên gia',
						content: 'Yêu cầu cơ sở/trung tâm chuyển người hỗ trợ phù hợp hơn với nhu cầu.',
						tag: 'Bước 2 • Đổi người',
						icon: 'swap_horiz'
					},
					{
						title: 'Bước 3: Rời đi & Báo cáo',
						content: 'Nếu bị xúc phạm, quấy rối hay đe dọa, lập tức rời phiên và báo cáo cơ quan chức năng.',
						tag: 'Bước 3 • Khẩn cấp',
						icon: 'exit_to_app',
						isAlert: true
					}
				]
			}
		]
	},
	{
		id: 'ho-tro-chuyen-nghiep',
		title: 'Nơi hỗ trợ đáng tin cậy',
		shortTitle: 'Trung tâm & BV tham vấn',
		category: 'Kết nối với chuyên gia bên ngoài MÈO',
		icon: 'connect_without_contact',
		colorName: 'tertiary',
		accentColor: 'text-tertiary bg-warm-cream border-tertiary/30',
		badgeColor: 'bg-tertiary/10 text-tertiary',
		summary: 'Danh sách trung tâm & bệnh viện tham vấn tâm lý độc lập, được tổng hợp làm điểm khởi đầu — không phải sự bảo chứng hay hợp tác chính thức từ MÈO.',
		highlights: ['Độc lập', 'Đã kiểm chứng', 'Ngoài MÈO'],
		wide: true,
		subfolders: [
			{
				id: 'trung-tam-tham-van',
				title: 'Trung tâm tham vấn tâm lý',
				icon: 'diversity_3',
				desc: 'Các trung tâm tham vấn tư nhân tại TPHCM.',
				items: [
					{
						title: 'Tâm Lý Lumos',
						content: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://tamlylumos.com/'
					},
					{
						title: 'Touching Soul',
						content: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://touchingsoul.art/'
					},
					{
						title: 'Tâm Lý Hoa Sung',
						content: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://tamlyhoasung.com/'
					},
					{
						title: 'Vietnam Psychology',
						content: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://www.vietnampsychology.com/'
					},
					{
						title: 'Tâm Lý Việt An',
						content: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://tamlyvietan.com/'
					}
				]
			},
			{
				id: 'benh-vien-tham-van',
				title: 'Bệnh viện có dịch vụ tham vấn',
				icon: 'local_hospital',
				desc: 'Các bệnh viện lớn có đơn vị tâm lý lâm sàng hoặc dịch vụ tham vấn.',
				items: [
					{
						title: 'BV Đại học Y Dược TPHCM',
						content: 'Đơn vị Tâm lý lâm sàng.',
						link: 'https://www.facebook.com/benhviendaihocyduoc/posts/%C4%91%C6%A1n-v%E1%BB%8B-t%C3%A2m-l%C3%BD-l%C3%A2m-s%C3%A0ng-b%E1%BB%87nh-vi%E1%BB%87n-%C4%91%E1%BA%A1i-h%E1%BB%8Dc-y-d%C6%B0%E1%BB%A3c-tphcm-%C4%91%C6%A1n-v%E1%BB%8B-t%C3%A2m-l%C3%BD-l%C3%A2m-s%C3%A0ng-b%E1%BB%87n/1052576551593330/'
					},
					{
						title: 'Bệnh viện FV',
						content: 'Chương trình tư vấn, chăm sóc sức khỏe tinh thần.',
						link: 'https://www.fvhospital.com/health-programme/tu-van-cham-soc-suc-khoe-tinh-than/'
					},
					{
						title: 'CarePlus',
						content: 'Tham vấn tâm lý cá nhân dành cho người lớn.',
						link: 'https://www.careplusvn.com/vi/tham-van-tam-ly-ca-nhan-danh-cho-nguoi-lon'
					},
					{
						title: 'Vinmec',
						content: 'Vinmec Central Park — tham vấn tâm lý.',
						link: 'https://www.facebook.com/Vinmec/posts/vinmec-central-park-tham-v%E1%BA%A5n-t%C3%A2m-l%C3%BD-c%C3%B3-ph%E1%BA%A3i-ch%E1%BB%89-d%C3%A0nh-cho-ng%C6%B0%E1%BB%9Di-m%E1%BA%AFc-v%E1%BA%A5n-%C4%91%E1%BB%81-v%E1%BB%81-s%E1%BB%A9c/1057520075835336/'
					}
				]
			},
			{
				id: 'huong-nghiep',
				title: 'Trung tâm tư vấn hướng nghiệp',
				icon: 'work',
				desc: 'Hỗ trợ định hướng nghề nghiệp.',
				items: [
					{
						title: 'Hướng Nghiệp Sông An',
						content: 'Trung tâm tư vấn hướng nghiệp.',
						link: 'https://huongnghiepsongan.com/'
					}
				]
			},
			{
				id: 'can-thiep-tre',
				title: 'Trung tâm can thiệp trẻ',
				icon: 'child_care',
				desc: 'Can thiệp sớm và giáo dục đặc biệt cho trẻ.',
				items: [
					{
						title: 'Learning Strategies',
						content: 'Trung tâm can thiệp và giáo dục trẻ.',
						link: 'https://learning-strategies.org/'
					},
					{
						title: 'SEN Box',
						content: 'Mạng lưới giáo dục đặc biệt (Special Education Network).',
						link: 'https://www.senbox.org/'
					}
				]
			}
		]
	}
];
