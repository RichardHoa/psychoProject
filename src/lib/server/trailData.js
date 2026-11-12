/**
 * The Landing picker's content: who the visitor is, what worries them, a short answer they get
 * straight away, and the Trail (2–3 journey steps, in the order worth reading) behind it.
 * Section titles and reading times come from folderData.js, so they can't drift from the steps.
 *
 * @typedef {object} TrailStop
 * @property {string} step Journey step id; every stop in a trail is a different step.
 * @property {string} [section] The section of that step worth reading first.
 * @property {string} title
 * @property {string} why
 *
 * @typedef {object} Concern
 * @property {string} id
 * @property {string} label How the visitor would say it.
 * @property {string} question The question the trail answers, shown while following it.
 * @property {{ title: string, points: string[] }} takeaway
 * @property {boolean} [breathing] Offer the breathing exercise next to the answer.
 * @property {TrailStop[]} stops
 *
 * @typedef {object} Persona
 * @property {string} id
 * @property {string} label
 * @property {string} hint
 * @property {string} concernPrompt
 * @property {Concern[]} concerns
 */

/** @type {Persona[]} */
export const PERSONAS = [
	{
		id: 'hoc-sinh',
		label: 'Mình là học sinh',
		hint: 'Mới nghe về tham vấn trên mạng',
		concernPrompt: 'Điều gì đang làm bạn bận lòng?',
		concerns: [
			{
				id: 'buon-lo',
				label: 'Mình hay buồn, lo âu hoặc áp lực chuyện học',
				question: 'Buồn và lo âu có đáng đi tham vấn không?',
				breathing: true,
				takeaway: {
					title: 'Đi tham vấn không có nghĩa là bạn "bị bệnh"',
					points: [
						'Khó khăn về cảm xúc và áp lực kéo dài là lý do bình thường để tìm đến tham vấn.',
						'Bạn là người chủ động, không phải "bệnh nhân". Bạn hiểu rõ nhất cuộc đời mình.',
						'Bạn được lắng nghe trọn vẹn, không bị phán xét hay dán nhãn.'
					]
				},
				stops: [
					{
						step: 'than-chu',
						section: 'khi-nao',
						title: 'Chuyện của bạn có đáng đi tham vấn?',
						why: 'Xem chuyện của bạn có nằm trong danh sách không.'
					},
					{
						step: 'nha-tham-van',
						section: 'buoi-dau',
						title: 'Buổi đầu tiên diễn ra thế nào',
						why: 'Bớt sợ vì biết trước điều gì sẽ xảy ra.'
					},
					{
						step: 'bao-mat',
						title: 'Ai sẽ biết những gì bạn kể',
						why: 'Điều được giữ kín, và khi nào có ngoại lệ.'
					}
				]
			},
			{
				id: 'bo-me-biet',
				label: 'Mình sợ bố mẹ hoặc thầy cô biết chuyện',
				question: 'Nhà tham vấn có kể với bố mẹ mình không?',
				takeaway: {
					title: 'Điều bạn kể được giữ kín, với vài ngoại lệ',
					points: [
						'Gia đình, trường học không được biết nếu bạn chưa đồng ý.',
						'Ngoại lệ: khi bạn hoặc người khác có nguy cơ bị hại.',
						'Nếu bạn chưa đủ 18 tuổi, hãy hỏi ngay buổi đầu: bố mẹ sẽ được biết những gì?'
					]
				},
				stops: [
					{
						step: 'bao-mat',
						section: 'ngoai-le',
						title: 'Khi nào bí mật có thể được chia sẻ',
						why: 'Biết chính xác để yên tâm kể.'
					},
					{
						step: 'quyen-than-chu',
						section: 'muoi-quyen',
						title: 'Quyền của bạn',
						why: 'Bạn được hỏi, được từ chối, được đổi người.'
					}
				]
			},
			{
				id: 'to-mo',
				label: 'Mình chỉ tò mò tham vấn là gì',
				question: 'Tham vấn thật ra là gì?',
				takeaway: {
					title: 'Tham vấn trong 3 câu',
					points: [
						'Bạn nói chuyện với người được đào tạo để hiểu và gỡ rối điều đang làm bạn khó khăn.',
						'Họ không quyết định thay bạn, không ép bạn và không hứa "chữa khỏi 100%".',
						'Bạn có thể dừng hoặc đổi người bất cứ lúc nào.'
					]
				},
				stops: [
					{
						step: 'than-chu',
						title: 'Bạn là thân chủ',
						why: 'Vai trò của bạn trong buổi tham vấn.'
					},
					{
						step: 'nha-tham-van',
						title: 'Nhà tham vấn sẽ làm gì?',
						why: 'Và những gì họ không được làm.'
					}
				]
			}
		]
	},
	{
		id: 'phu-huynh',
		label: 'Mình là phụ huynh',
		hint: 'Đang tìm hỗ trợ cho con',
		concernPrompt: 'Điều gì đang làm bố mẹ lo nhất?',
		concerns: [
			{
				id: 'con-khac-la',
				label: 'Con có dấu hiệu khác lạ (thu mình, cáu gắt, mất ngủ, học sa sút)',
				question: 'Con thay đổi tính nết, có nên đưa đi tham vấn?',
				takeaway: {
					title: 'Những điều bố mẹ có thể làm ngay hôm nay',
					points: [
						'Hỏi con bằng câu mở ("Dạo này con thấy thế nào?"), nghe nhiều hơn nói.',
						'Tránh phán xét hay so sánh, để con thấy an toàn khi kể.',
						'Thay đổi kéo dài vài tuần là lý do hợp lý để gặp nhà chuyên môn, không cần đợi "nặng".'
					]
				},
				stops: [
					{
						step: 'ai-giup-ban',
						section: 'bon-vai-tro',
						title: 'Ai có thể giúp con?',
						why: 'Nhà tham vấn, nhà tâm lý lâm sàng hay bác sĩ tâm thần.'
					},
					{
						step: 'chon-chuyen-gia',
						section: 'nen-kiem-tra',
						title: 'Cách nhận biết nơi uy tín',
						why: 'Đặc biệt: có kinh nghiệm với lứa tuổi của con.'
					},
					{
						step: 'ho-tro-chuyen-nghiep',
						title: 'Nơi hỗ trợ đáng tin cậy',
						why: 'Danh sách trung tâm, bệnh viện, can thiệp trẻ.'
					}
				]
			},
			{
				id: 'dua-con-den-ai',
				label: 'Mình không biết nên đưa con đến ai',
				question: 'Nên đưa con đến nhà tham vấn hay bác sĩ tâm thần?',
				takeaway: {
					title: '4 vai trò, nói ngắn gọn',
					points: [
						'Nhà tham vấn: cảm xúc, các mối quan hệ, sự thích nghi.',
						'Nhà tâm lý lâm sàng: đánh giá, chẩn đoán và trị liệu tâm lý.',
						'Bác sĩ tâm thần: bác sĩ y khoa, được kê thuốc.',
						'Họ thường phối hợp, và sẽ chuyển ca nếu con cần người khác phù hợp hơn.'
					]
				},
				stops: [
					{
						step: 'ai-giup-ban',
						title: 'Ai có thể giúp con?',
						why: 'Chi tiết từng vai trò và khi nào cần bác sĩ.'
					},
					{
						step: 'chon-chuyen-gia',
						section: 'cau-hoi',
						title: 'Câu nên hỏi khi gọi cho trung tâm',
						why: 'Mang theo khi liên hệ.'
					},
					{
						step: 'ho-tro-chuyen-nghiep',
						title: 'Nơi hỗ trợ đáng tin cậy',
						why: 'Có cả trung tâm can thiệp trẻ nếu con còn nhỏ.'
					}
				]
			},
			{
				id: 'con-khong-chiu',
				label: 'Con không chịu đi, hoặc sợ bố mẹ biết chuyện',
				question: 'Con không muốn đi tham vấn, phải làm sao?',
				takeaway: {
					title: 'Để con thấy an toàn khi đi',
					points: [
						'Cho con cùng chọn người và nơi tham vấn. Con có quyền đổi người hoặc dừng.',
						'Hỏi nhà tham vấn ngay buổi đầu: bố mẹ sẽ được biết những gì, và khi nào.',
						'Hứa với con rằng bố mẹ không đòi biết chi tiết từng buổi.'
					]
				},
				stops: [
					{
						step: 'bao-mat',
						section: 'hoi-dap-bao-mat',
						title: 'Có nói cho cha mẹ không?',
						why: 'Điều con được giữ kín và các ngoại lệ.'
					},
					{
						step: 'quyen-than-chu',
						section: 'muoi-quyen',
						title: 'Quyền của con khi đi tham vấn',
						why: 'Đọc cùng con để con yên tâm.'
					},
					{
						step: 'nha-tham-van',
						section: 'buoi-dau',
						title: 'Buổi đầu tiên diễn ra thế nào',
						why: 'Để kể trước cho con nghe.'
					}
				]
			},
			{
				id: 'kiem-tra-uy-tin',
				label: 'Mình muốn kiểm tra một nơi có uy tín không',
				question: 'Làm sao biết một nơi tham vấn có uy tín?',
				takeaway: {
					title: 'Dấu hiệu cảnh báo, nên tránh ngay',
					points: [
						'Hứa chữa khỏi 100%, hoặc chẩn đoán qua vài tin nhắn.',
						'Né tránh câu hỏi về bằng cấp, không giải thích về bảo mật.',
						'Ép mua sản phẩm, hoặc không có phương án xử lý khủng hoảng.'
					]
				},
				stops: [
					{
						step: 'chon-chuyen-gia',
						section: 'dau-hieu-canh-bao',
						title: 'Toàn bộ dấu hiệu cảnh báo',
						why: 'Những điều nên tránh, và những câu nên hỏi.'
					},
					{
						step: 'nha-tham-van',
						section: 'khong-lam',
						title: 'Điều nhà tham vấn không được làm',
						why: 'Để nhận ra khi có gì đó không đúng.'
					}
				]
			}
		]
	},
	{
		id: 'da-biet',
		label: 'Mình đã biết về tham vấn',
		hint: 'Du học sinh, học sinh trường quốc tế…',
		concernPrompt: 'Bạn đang cần biết điều gì?',
		concerns: [
			{
				id: 'co-hop-khong',
				label: 'Mình muốn biết nhà tham vấn này có hợp với vấn đề của mình không',
				question: 'Nhà tham vấn này có hợp với mình không?',
				takeaway: {
					title: 'Hỏi họ những câu này trước buổi đầu',
					points: [
						'Anh/chị có kinh nghiệm với vấn đề và nhóm tuổi của tôi không?',
						'Phương pháp dự kiến là gì, có lợi ích và giới hạn nào?',
						'Bao lâu sẽ đánh giá lại tiến triển?',
						'Nếu có khủng hoảng ngoài giờ, tôi cần làm gì?'
					]
				},
				stops: [
					{
						step: 'chon-chuyen-gia',
						section: 'cau-hoi',
						title: 'Câu nên hỏi và điểm nên kiểm tra',
						why: 'Bằng cấp, giấy phép, đào tạo đúng liệu pháp.'
					},
					{
						step: 'nha-tham-van',
						section: 'buoi-dau',
						title: 'Buổi đầu nên thống nhất những gì',
						why: 'Khuôn khổ, mục tiêu và kế hoạch.'
					}
				]
			},
			{
				id: 'counselor-hay-bac-si',
				label: 'Mình không chắc nên gặp counselor, psychologist hay psychiatrist',
				question: 'Counselor, psychologist hay psychiatrist?',
				takeaway: {
					title: 'Khác nhau ở đâu',
					points: [
						'Counselor: cảm xúc, các mối quan hệ, sự thích nghi.',
						'Clinical psychologist: đánh giá, chẩn đoán, trị liệu.',
						'Psychiatrist: bác sĩ y khoa, khi thuốc là một phần quan trọng của điều trị.'
					]
				},
				stops: [
					{
						step: 'ai-giup-ban',
						title: 'Ai có thể giúp bạn?',
						why: 'Và cách họ phối hợp với nhau.'
					},
					{
						step: 'chon-chuyen-gia',
						section: 'nen-kiem-tra',
						title: 'Kiểm tra người bạn định gặp',
						why: 'Giấy phép, kinh nghiệm với vấn đề của bạn.'
					}
				]
			},
			{
				id: 'dang-di-khong-on',
				label: 'Mình đang đi tham vấn nhưng thấy không ổn',
				question: 'Tham vấn không hiệu quả, mình có quyền gì?',
				takeaway: {
					title: 'Bạn có quyền',
					points: [
						'Đặt câu hỏi về tiến trình, và từ chối một bài tập.',
						'Xin ý kiến chuyên gia khác, đổi người hoặc ngừng trị liệu.',
						'Phản ánh hoặc khiếu nại khi bị xúc phạm, quấy rối hay đe dọa.'
					]
				},
				stops: [
					{
						step: 'quyen-than-chu',
						section: 'ung-pho-vi-pham',
						title: 'Khi quyền của bạn bị vi phạm',
						why: 'Ba cách phản hồi, từ nhẹ đến mạnh.'
					},
					{
						step: 'chon-chuyen-gia',
						section: 'dau-hieu-canh-bao',
						title: 'Dấu hiệu cảnh báo',
						why: 'Đối chiếu với trải nghiệm của bạn.'
					}
				]
			}
		]
	}
];
