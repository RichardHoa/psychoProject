// Journey content: each folder is one step of the guided path, in reading order.

/**
 * Every item has a short version (title, plus `short` when the title alone isn't enough) and a
 * detailed version (`detail`, falling back to `short`). Readers switch between them.
 * @typedef {Object} FolderItem
 * @property {string} title
 * @property {string} [short]
 * @property {string} [detail]
 * @property {boolean} [isAlert]
 * @property {string} [link]
 */

/**
 * `layout`: plain bullets, numbered steps, or side-by-side pillars. `tone: 'alert'` marks a
 * section of warnings. `detailOnly` sections are shown in the detailed version only.
 * @typedef {Object} Subfolder
 * @property {string} id
 * @property {string} title
 * @property {string} [desc]
 * @property {'list' | 'steps' | 'pillars'} [layout]
 * @property {'alert'} [tone]
 * @property {boolean} [detailOnly]
 * @property {FolderItem[]} items
 */

/**
 * `chapter` groups consecutive steps under one heading on the journey. `nextReason` is the
 * one-line "why read this next" shown on the previous step.
 * @typedef {Object} Folder
 * @property {string} id
 * @property {string} title
 * @property {string} shortTitle
 * @property {string} [chapter]
 * @property {string} summary
 * @property {string} nextReason
 * @property {Subfolder[]} subfolders
 */

const IN_THE_ROOM = 'Điều gì diễn ra trong phòng tham vấn?';

/** @type {Folder[]} */
export const FOLDERS_DATA = [
	{
		id: 'than-chu',
		title: 'Bạn là thân chủ',
		shortTitle: 'Bạn là thân chủ',
		summary: 'Người chủ động trong hành trình thay đổi của mình, không phải một "bệnh nhân".',
		nextReason: 'Bắt đầu từ bạn: vai trò của bạn khi đi tham vấn.',
		subfolders: [
			{
				id: 'vai-tro',
				title: 'Thân chủ là ai?',
				desc: 'Người sử dụng dịch vụ tham vấn hoặc trị liệu tâm lý.',
				items: [
					{
						title: 'Người chủ động, không phải "bệnh nhân"',
						short: 'Bạn cùng tham gia vào quá trình thay đổi, không chỉ ngồi chờ được chữa.',
						detail:
							'Thân chủ (client) là người sử dụng dịch vụ tham vấn hoặc trị liệu và chủ động tham gia vào quá trình thay đổi của chính mình, không chỉ là một "bệnh nhân" thụ động chờ được chữa trị.'
					},
					{
						title: 'Người hiểu rõ nhất cuộc đời bạn',
						short: 'Nhà tham vấn hiểu chuyên môn; bạn hiểu rõ nhất trải nghiệm của mình.',
						detail:
							'Hai bên cùng làm việc với nhau: nhà tham vấn mang kiến thức và kỹ năng chuyên môn, còn bạn mang hiểu biết sâu nhất về hoàn cảnh, cảm xúc và mong muốn của chính mình.'
					},
					{
						title: 'Bình đẳng và không bị phán xét',
						short: 'Bạn được lắng nghe trọn vẹn, không bị dán nhãn.',
						detail:
							'Mối quan hệ tham vấn dựa trên sự tôn trọng. Bạn được lắng nghe trọn vẹn và không bị phán xét hay dán nhãn tiêu cực vì những gì mình chia sẻ.'
					}
				]
			},
			{
				id: 'khi-nao',
				title: 'Khi nào bạn có thể tìm đến tham vấn?',
				desc: 'Không cần đợi đến lúc "đủ nặng" mới được tìm hỗ trợ.',
				items: [
					{
						title: 'Khó khăn về cảm xúc',
						detail:
							'Buồn bã, bực bội, trống rỗng kéo dài, hoặc cảm xúc lên xuống khiến bạn khó kiểm soát.'
					},
					{
						title: 'Mâu thuẫn trong các mối quan hệ',
						detail: 'Với gia đình, người yêu, bạn bè hay đồng nghiệp.'
					},
					{
						title: 'Khủng hoảng trong cuộc sống',
						detail:
							'Mất mát, chia tay, mất việc, chuyển nơi ở, hay những biến cố khiến bạn chao đảo.'
					},
					{
						title: 'Trầm cảm, lo âu hoặc sang chấn',
						detail:
							'Những trải nghiệm này cần được hỗ trợ chuyên môn, và bạn không phải tự mình vượt qua.'
					},
					{
						title: 'Khó đưa ra quyết định',
						detail: 'Khi bạn đứng trước một lựa chọn quan trọng và cần một góc nhìn rõ ràng hơn.'
					},
					{
						title: 'Muốn hiểu rõ bản thân hơn',
						detail: 'Bạn không cần đang "có vấn đề" mới được đi tham vấn.'
					},
					{
						title: 'Muốn cải thiện các mối quan hệ và chất lượng sống',
						detail: 'Tham vấn cũng là một cách chăm sóc bản thân chủ động.'
					}
				]
			},
			{
				id: 'tam-the',
				title: 'Tâm thế khi đi tham vấn',
				desc: 'Vài gợi ý để bạn chuẩn bị trước buổi hẹn.',
				detailOnly: true,
				items: [
					{
						title: 'Cho phép mình chân thật',
						detail: 'Không cần hoàn hảo hay gồng mình. Cứ là chính bạn với mọi cung bậc cảm xúc.'
					},
					{
						title: 'Kiên nhẫn với tiến trình',
						detail: 'Thay đổi đến từ những bước nhỏ. Hãy bao dung với tốc độ của riêng bạn.'
					},
					{
						title: 'Đặt ranh giới thoải mái',
						detail:
							'Bạn luôn có quyền nói "Mình chưa sẵn sàng chia sẻ điều này" vào bất cứ lúc nào.'
					}
				]
			}
		]
	},
	{
		id: 'ai-giup-ban',
		title: 'Ai có thể giúp bạn?',
		shortTitle: 'Ai có thể giúp bạn?',
		summary: 'Phân biệt nhà tham vấn, nhà trị liệu, nhà tâm lý lâm sàng và bác sĩ tâm thần.',
		nextReason: 'Biết ai làm gì để tìm đúng người.',
		subfolders: [
			{
				id: 'bon-vai-tro',
				title: '4 vai trò thường gặp',
				layout: 'pillars',
				items: [
					{
						title: 'Nhà tham vấn (Counselor)',
						short: 'Hỗ trợ khó khăn về cảm xúc, các mối quan hệ, sự thích nghi.',
						detail:
							'Chuyên viên được đào tạo để hỗ trợ thân chủ gặp khó khăn về mặt cảm xúc, các mối quan hệ, sự thích nghi, v.v. Phạm vi đào tạo và chuyên môn của từng nhà tham vấn có thể khác nhau.'
					},
					{
						title: 'Nhà trị liệu (Therapist)',
						short: 'Tên gọi chung cho người cung cấp hỗ trợ trị liệu.',
						detail:
							'Một thuật ngữ bao quát, dùng để chỉ chuyên gia cung cấp hỗ trợ trị liệu, bao gồm counselor (chuyên viên tham vấn), psychologist (nhà tâm lý học), psychotherapist (nhà trị liệu tâm lý)... Hãy hỏi về nền tảng chuyên môn, quá trình đào tạo và đăng ký hành nghề của người đó để hiểu rõ mình đang làm việc với ai và có thể kỳ vọng điều gì.'
					},
					{
						title: 'Nhà tâm lý lâm sàng (Clinical Psychologist)',
						short: 'Đánh giá, chẩn đoán và thực hành trị liệu tâm lý.',
						detail:
							'Chuyên viên tâm lý được đào tạo về mặt lâm sàng. Có thể đánh giá, chẩn đoán và thực hành các liệu pháp trị liệu; có thể trị liệu cá nhân, cặp đôi hay hệ thống gia đình.'
					},
					{
						title: 'Bác sĩ tâm thần (Psychiatrist)',
						short: 'Bác sĩ y khoa, được quyền kê thuốc.',
						detail:
							'Bác sĩ y khoa đã được đào tạo chuyên sâu về sức khỏe tâm thần, được quyền kê thuốc để điều trị các bệnh tâm thần. Vai trò của họ là chẩn đoán và quản lý các vấn đề sức khỏe tâm thần dưới góc độ y khoa.'
					}
				]
			},
			{
				id: 'phoi-hop',
				title: 'Họ làm việc cùng nhau',
				items: [
					{
						title: 'Một đội ngũ chăm sóc',
						short: 'Nhà tâm lý, nhà tham vấn và bác sĩ tâm thần có thể cùng hỗ trợ một người.',
						detail:
							'Nhà tâm lý lâm sàng và chuyên viên tham vấn có thể phối hợp làm việc cùng bác sĩ tâm thần như một phần của đội ngũ chăm sóc cho người bệnh.'
					},
					{
						title: 'Khi nào cần gặp bác sĩ tâm thần?',
						short: 'Khi thuốc là một phần quan trọng của việc điều trị.',
						detail:
							'Việc gặp bác sĩ tâm thần là cần thiết khi thuốc là một phần quan trọng của quá trình điều trị. Chỉ bác sĩ mới được kê đơn và điều chỉnh thuốc, nên đừng tự ý ngưng thuốc khi chưa trao đổi với bác sĩ.'
					},
					{
						title: 'Tâm lý gia tập sự',
						short: 'Người đang thực tập, làm việc dưới sự hướng dẫn của người giám sát.',
						detail:
							'Tâm lý gia tập sự là người đang trong quá trình đào tạo, thực hành dưới sự hướng dẫn và giám sát của chuyên gia có kinh nghiệm. Bạn có quyền hỏi ai là người giám sát họ.'
					}
				]
			}
		]
	},
	{
		id: 'nha-tham-van',
		title: 'Nhà tham vấn sẽ làm gì?',
		shortTitle: 'Nhà tham vấn làm gì?',
		chapter: IN_THE_ROOM,
		summary: 'Những buổi đầu tiên, trong mỗi phiên, và những điều nhà tham vấn KHÔNG làm.',
		nextReason: 'Xem trước điều gì diễn ra trong phòng tham vấn.',
		subfolders: [
			{
				id: 'buoi-dau',
				title: 'Trong những buổi đầu tiên',
				desc: 'Nhà tham vấn thường trao đổi với bạn về:',
				layout: 'steps',
				items: [
					{
						title: 'Khuôn khổ làm việc',
						short: 'Vai trò của mỗi bên, chi phí, thời lượng và cách làm việc.',
						detail:
							'Vai trò của từng bên, chi phí, thời lượng mỗi phiên và cách hai bên sẽ làm việc với nhau.'
					},
					{
						title: 'Bảo mật và giới hạn bảo mật',
						short: 'Điều gì được giữ kín, và khi nào có ngoại lệ.',
						detail:
							'Nhà tham vấn giải thích nguyên tắc bảo mật và những giới hạn của bảo mật trong tham vấn tâm lý.'
					},
					{
						title: 'Lý do bạn đến',
						short: 'Điều khiến bạn tìm đến, và tình trạng hiện tại của bạn.',
						detail:
							'Lý do bạn đến tham vấn, cùng những thông tin liên quan đến sức khỏe của bạn như cảm xúc, suy nghĩ, hành vi, các mối quan hệ và hoàn cảnh sống.'
					},
					{
						title: 'Mức độ an toàn',
						short: 'Đánh giá an toàn, đặc biệt khi có nguy cơ tự hại.',
						detail:
							'Nhà tham vấn đánh giá mức độ an toàn, đặc biệt khi nhận thấy bạn có nguy cơ tự hại hay tự sát.'
					},
					{
						title: 'Mục tiêu và kế hoạch',
						short: 'Cùng bạn thống nhất mục tiêu và lên kế hoạch.',
						detail: 'Hai bên cùng thống nhất mục tiêu làm việc và lên kế hoạch để đạt được chúng.'
					}
				]
			},
			{
				id: 'trong-phien',
				title: 'Trong mỗi phiên tham vấn',
				items: [
					{
						title: 'Lắng nghe và đặt câu hỏi',
						short: 'Giúp bạn làm rõ cảm xúc và nhu cầu của mình.',
						detail:
							'Nhà tham vấn lắng nghe bạn, phản hồi hay đặt câu hỏi khi cần thiết để giúp bạn làm rõ cảm xúc và nhu cầu của bản thân, trong một không gian không phán xét.'
					},
					{
						title: 'Xây dựng kỹ năng',
						short: 'Điều tiết cảm xúc, giao tiếp, nhận diện các vòng lặp.',
						detail:
							'Nhà tham vấn có thể giúp bạn xây dựng những kỹ năng như điều tiết cảm xúc, giao tiếp, nhận diện những vòng lặp về suy nghĩ - cảm xúc - hành vi, v.v.'
					},
					{
						title: 'Bài tập giữa các phiên',
						short: 'Để bạn tự luyện tập và dần tự chủ hơn.',
						detail:
							'Những bài tập thực hành (ví dụ: nhật ký cảm xúc, bài tập hít thở) để bạn tự luyện tập giữa các phiên và dần trở nên tự chủ hơn khi gặp khó khăn trong cuộc sống.'
					},
					{
						title: 'Làm việc với gia đình khi cần',
						short: 'Để bạn được hỗ trợ toàn diện hơn.',
						detail:
							'Khi cần thiết, nhà tham vấn có thể làm việc với gia đình và các bên liên quan để bạn nhận được sự hỗ trợ toàn diện hơn bên ngoài phòng tham vấn.'
					}
				]
			},
			{
				id: 'xuyen-suot',
				title: 'Xuyên suốt quá trình',
				items: [
					{
						title: 'Theo dõi tiến triển',
						short: 'Cùng bạn nhìn lại và điều chỉnh kế hoạch khi cần.',
						detail:
							'Nhà tham vấn theo dõi tiến triển và trao đổi với bạn để điều chỉnh kế hoạch nếu cần.'
					},
					{
						title: 'Chuyển ca khi cần',
						short: 'Giới thiệu bạn đến người phù hợp hơn khi vượt quá chuyên môn.',
						detail:
							'Khi nhận thấy tình trạng của bạn vượt quá năng lực chuyên môn của mình, nhà tham vấn sẽ đề xuất chuyển ca (ví dụ đến bác sĩ tâm thần) nhằm bảo vệ quyền lợi và lợi ích của bạn.'
					}
				]
			},
			{
				id: 'khong-lam',
				title: 'Nhà tham vấn KHÔNG làm gì?',
				desc: 'Một nhà tham vấn có năng lực chuyên môn và đạo đức sẽ không:',
				tone: 'alert',
				items: [
					{
						title: 'Quyết định thay cho bạn',
						detail:
							'Quyền tự quyết của bạn cần được tôn trọng, trừ khi nhà tham vấn nhận thấy bạn có nguy cơ gây hại cho bản thân hay người khác.'
					},
					{
						title: 'Ép bạn làm theo quan điểm cá nhân',
						detail:
							'Quan điểm của bạn, kể cả niềm tin tôn giáo và giá trị cá nhân, cần được tôn trọng, ngay cả khi nhà tham vấn không đồng tình.'
					},
					{
						title: 'Hứa chắc chắn chữa khỏi',
						detail:
							'Nhà tham vấn cần rõ ràng và minh bạch về phác đồ điều trị và mục tiêu làm việc với bạn.'
					},
					{
						title: 'Xúc phạm, đe dọa hoặc làm nhục bạn',
						detail: 'Kể cả chế giễu hay thao túng tâm lý (gaslighting).'
					},
					{
						title: 'Có quan hệ tình cảm, tình dục hoặc tài chính với bạn',
						detail:
							'Mối quan hệ giữa nhà tham vấn và thân chủ là mối quan hệ trị liệu; nếu xuất hiện thêm một mối quan hệ khác sẽ có nguy cơ ảnh hưởng đến quá trình trị liệu.'
					},
					{
						title: 'Dùng câu chuyện của bạn để quảng cáo',
						detail:
							'Khi chưa có sự đồng thuận của bạn. Ưu tiên hàng đầu của nhà tham vấn và các dịch vụ tham vấn nói chung là bảo mật thông tin của thân chủ.'
					}
				]
			}
		]
	},
	{
		id: 'quyen-than-chu',
		title: 'Quyền của thân chủ',
		shortTitle: 'Quyền của bạn',
		chapter: IN_THE_ROOM,
		summary: '10 quyền bạn luôn có, và cách lên tiếng khi quyền bị vi phạm.',
		nextReason: 'Biết quyền của mình trước khi bắt đầu.',
		subfolders: [
			{
				id: 'muoi-quyen',
				title: '10 quyền của thân chủ',
				desc: 'Khi đi tham vấn, bạn có quyền:',
				items: [
					{
						title: 'Được tôn trọng và không bị kỳ thị',
						detail:
							'Bất kể bạn là ai: giới tính, xu hướng tính dục, tín ngưỡng, xuất thân hay hoàn cảnh.'
					},
					{
						title: 'Được biết bằng cấp, kinh nghiệm của chuyên gia',
						detail:
							'Bạn có quyền hỏi về bằng cấp, kinh nghiệm, năng lực chuyên môn và phương pháp mà nhà tham vấn sử dụng.'
					},
					{
						title: 'Được giải thích về liệu pháp, chi phí và thời lượng',
						detail:
							'Trước khi bắt đầu, kể cả chính sách hủy hoặc dời buổi. Bạn chỉ tham gia khi đã hiểu rõ và tự nguyện đồng ý.'
					},
					{
						title: 'Được biết thông tin cá nhân được lưu trữ và bảo mật thế nào',
						detail: 'Bạn có thể hỏi hồ sơ của mình được lưu ở đâu và ai được tiếp cận.'
					},
					{
						title: 'Được biết khi nào bảo mật có thể bị phá vỡ',
						detail: 'Xem bước "Bảo mật" để biết 4 trường hợp ngoại lệ.'
					},
					{
						title: 'Được đặt câu hỏi về tiến trình trị liệu',
						detail: 'Bất cứ lúc nào bạn thấy chưa rõ mình đang ở đâu hay vì sao làm điều gì.'
					},
					{
						title: 'Được từ chối một liệu pháp, hoạt động hay bài tập',
						detail: 'Kể cả không trả lời một câu hỏi khi bạn chưa thấy thoải mái.'
					},
					{
						title: 'Được xin ý kiến chuyên gia khác',
						detail: 'Tham khảo thêm một chuyên gia khác (second opinion) là điều bình thường.'
					},
					{
						title: 'Được đổi chuyên gia hoặc ngừng trị liệu',
						detail: 'Vào bất cứ lúc nào, nếu bạn thấy không phù hợp.'
					},
					{
						title: 'Được biết cách phản ánh hoặc khiếu nại',
						detail: 'Khi bạn không hài lòng hoặc chuyên gia vi phạm đạo đức nghề nghiệp.'
					}
				]
			},
			{
				id: 'ung-pho-vi-pham',
				title: 'Khi quyền của bạn bị vi phạm',
				desc: 'Ba bước bạn có thể làm để bảo vệ bản thân.',
				layout: 'steps',
				items: [
					{
						title: 'Phản hồi trực tiếp',
						short: 'Nói rõ điều khiến bạn khó chịu.',
						detail:
							'Nói rõ cảm giác khó chịu hoặc ranh giới bị xâm phạm ngay trong phiên, nếu bạn thấy an toàn để làm vậy.'
					},
					{
						title: 'Yêu cầu đổi chuyên gia',
						short: 'Đề nghị nơi tham vấn chuyển người hỗ trợ khác.',
						detail:
							'Yêu cầu cơ sở hoặc trung tâm chuyển cho bạn người hỗ trợ phù hợp hơn với nhu cầu.'
					},
					{
						title: 'Rời đi và báo cáo',
						short: 'Khi bị xúc phạm, quấy rối hay đe dọa.',
						detail:
							'Nếu bị xúc phạm, quấy rối hay đe dọa, bạn có thể rời phiên ngay và báo cáo với cơ sở hoặc cơ quan chức năng.',
						isAlert: true
					}
				]
			}
		]
	},
	{
		id: 'bao-mat',
		title: 'Bảo mật và giới hạn bảo mật',
		shortTitle: 'Bảo mật',
		chapter: IN_THE_ROOM,
		summary: 'Điều bạn chia sẻ được giữ kín, và 4 trường hợp ngoại lệ.',
		nextReason: 'Điều bạn chia sẻ được giữ kín đến đâu.',
		subfolders: [
			{
				id: 'nguyen-tac',
				title: 'Nguyên tắc nền tảng',
				items: [
					{
						title: 'Điều bạn chia sẻ được giữ kín',
						short: 'Chỉ được tiết lộ khi bạn cho phép.',
						detail:
							'Bảo mật là một trong những nguyên tắc nền tảng của tham vấn tâm lý. Những thông tin bạn chia sẻ trong quá trình trị liệu sẽ không được tiết lộ, trừ khi có sự cho phép của bạn.'
					},
					{
						title: 'Không tiết lộ cho bên thứ ba',
						short: 'Gia đình, trường học hay nơi làm việc không được biết nếu bạn chưa đồng ý.',
						detail:
							'Nhà tham vấn không chia sẻ thông tin của bạn cho gia đình, nhà trường hay công ty khi chưa có sự đồng thuận của bạn.'
					},
					{
						title: 'Hồ sơ được lưu giữ cẩn thận',
						short: 'Ghi chép chuyên môn được cất giữ an toàn.',
						detail:
							'Ghi chép chuyên môn được lưu giữ an toàn. Bạn có quyền hỏi hồ sơ được lưu ở đâu và ai được tiếp cận.'
					}
				]
			},
			{
				id: 'ngoai-le',
				title: '4 trường hợp ngoại lệ',
				desc: 'Nhà tham vấn có thể phải chia sẻ thông tin khi:',
				items: [
					{
						title: 'Bạn có nguy cơ gây hại cho bản thân',
						detail: 'Ví dụ khi có kế hoạch, ý định hoặc hành vi tự hại, tự sát.',
						isAlert: true
					},
					{
						title: 'Có nguy cơ gây hại cho người khác',
						detail: 'Khi có đe dọa trực tiếp đến tính mạng hoặc sự an toàn của người xung quanh.',
						isAlert: true
					},
					{
						title: 'Có yêu cầu hợp pháp từ cơ quan có thẩm quyền',
						detail: 'Ví dụ lệnh hoặc yêu cầu chính thức của tòa án.'
					},
					{
						title: 'Cần trao đổi với ekip giám sát chuyên môn',
						detail:
							'Để đảm bảo chất lượng hỗ trợ. Thông tin nhận dạng của bạn được hạn chế ở mức tối đa.'
					}
				]
			},
			{
				id: 'hoi-dap-bao-mat',
				title: 'Hỏi nhanh về bảo mật',
				items: [
					{
						title: 'Có nói cho cha mẹ tôi không?',
						short: 'Nếu bạn đã đủ 18 tuổi: không, trừ 4 trường hợp ngoại lệ ở trên.',
						detail:
							'Với người đã đủ 18 tuổi, nhà tham vấn không chia sẻ với gia đình khi chưa có sự đồng ý của bạn, trừ 4 trường hợp ngoại lệ ở trên. Nếu bạn chưa đủ 18 tuổi, hãy hỏi nhà tham vấn ngay từ buổi đầu xem cha mẹ hoặc người giám hộ sẽ được biết những gì.'
					},
					{
						title: 'Tôi có được xem hồ sơ không?',
						short: 'Bạn có thể đề nghị xem tóm tắt tiến trình của mình.',
						detail:
							'Bạn có thể đề nghị xem tóm tắt tiến trình và hồ sơ tham vấn của chính mình. Hãy hỏi chính sách cụ thể của nơi bạn tham vấn.'
					}
				]
			}
		]
	},
	{
		id: 'chon-chuyen-gia',
		title: 'Cách nhận biết nhà chuyên môn uy tín',
		shortTitle: 'Chọn chuyên gia uy tín',
		summary: 'Những điểm nên kiểm tra, câu nên hỏi trước khi bắt đầu, và dấu hiệu cảnh báo.',
		nextReason: 'Tìm người phù hợp và đáng tin cậy.',
		subfolders: [
			{
				id: 'nen-kiem-tra',
				title: 'Những điểm nên kiểm tra',
				items: [
					{ title: 'Danh tính và cơ sở làm việc rõ ràng' },
					{ title: 'Bằng cấp có uy tín' },
					{ title: 'Được đào tạo đúng liệu pháp đang thực hành' },
					{ title: 'Có kinh nghiệm với vấn đề và nhóm tuổi của bạn' },
					{
						title: 'Có giấy phép hoặc đăng ký hành nghề',
						detail: 'Khi pháp luật yêu cầu.'
					},
					{ title: 'Giải thích rõ chi phí, lịch hẹn và chính sách hủy buổi' },
					{ title: 'Có thỏa thuận bảo mật' },
					{
						title: 'Biết giới hạn năng lực và sẵn sàng chuyển ca',
						detail: 'Họ sẵn lòng giới thiệu bạn đến người phù hợp hơn khi cần.'
					},
					{ title: 'Không hứa chữa khỏi chắc chắn' },
					{ title: 'Theo dõi tiến triển và tiếp nhận phản hồi' },
					{ title: 'Tôn trọng văn hóa, tôn giáo, giới và xu hướng tính dục' },
					{
						title: 'Công khai việc được giám sát trong thực hành',
						detail: 'Đặc biệt nếu họ đang là tâm lý gia tập sự.'
					}
				]
			},
			{
				id: 'cau-hoi',
				title: 'Những câu nên hỏi trước khi bắt đầu',
				desc: 'Bạn có thể hỏi thẳng. Một chuyên gia uy tín sẽ sẵn lòng trả lời.',
				items: [
					{ title: 'Anh/chị được đào tạo và hành nghề với tư cách nào?' },
					{ title: 'Anh/chị có kinh nghiệm với vấn đề của tôi không?' },
					{ title: 'Phương pháp dự kiến là gì?' },
					{ title: 'Phương pháp này có lợi ích và giới hạn nào?' },
					{ title: 'Bao lâu sẽ đánh giá lại tiến triển?' },
					{ title: 'Bảo mật được áp dụng thế nào?' },
					{ title: 'Trong trường hợp nào thông tin có thể phải được chia sẻ?' },
					{
						title: 'Nếu có khủng hoảng ngoài giờ, tôi cần làm gì?',
						detail:
							'Bạn có quyền được hướng dẫn cụ thể phương án hỗ trợ khi gặp khủng hoảng tinh thần ngoài giờ làm việc.'
					},
					{ title: 'Nếu anh/chị đang thực tập, ai là người giám sát?' }
				]
			},
			{
				id: 'dau-hieu-canh-bao',
				title: 'Dấu hiệu cảnh báo',
				desc: 'Hãy cân nhắc tìm người khác nếu người hành nghề:',
				tone: 'alert',
				items: [
					{ title: 'Hứa chữa khỏi 100%' },
					{
						title: 'Chẩn đoán qua vài tin nhắn hoặc bình luận',
						detail: 'Chẩn đoán cần một quy trình đánh giá đầy đủ.'
					},
					{ title: 'Dùng một phương pháp cho tất cả mọi người' },
					{
						title: 'Khuyên bạn tự ý ngưng thuốc',
						detail: 'Chỉ bác sĩ mới được kê đơn hoặc điều chỉnh thuốc.'
					},
					{ title: 'Né tránh câu hỏi về bằng cấp' },
					{ title: 'Không giải thích về bảo mật' },
					{ title: 'Làm nhục, đe dọa hoặc ép buộc' },
					{ title: 'Có hành vi tình dục hoặc tài chính với thân chủ' },
					{ title: 'Ép thân chủ mua sản phẩm' },
					{ title: 'Yêu cầu giữ bí mật về hành vi của chuyên gia' },
					{ title: 'Đổ lỗi cho nạn nhân' },
					{ title: 'Kỳ thị cộng đồng LGBTQIA+ hoặc thực hiện "trị liệu chuyển đổi"' },
					{ title: 'Không có phương án xử lý tự sát, tự hại hoặc khủng hoảng' }
				]
			}
		]
	},
	{
		id: 'ho-tro-chuyen-nghiep',
		title: 'Nơi hỗ trợ đáng tin cậy',
		shortTitle: 'Nơi bắt đầu tìm',
		summary:
			'Danh sách trung tâm và bệnh viện tham vấn tâm lý độc lập, được tổng hợp làm điểm khởi đầu, không phải sự bảo chứng hay hợp tác chính thức từ MÈO.',
		nextReason: 'Một vài nơi để bạn bắt đầu tìm hỗ trợ.',
		subfolders: [
			{
				id: 'trung-tam-tham-van',
				title: 'Trung tâm tham vấn tâm lý',
				desc: 'Các trung tâm tham vấn tư nhân tại TPHCM.',
				items: [
					{
						title: 'Tâm Lý Lumos',
						detail: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://tamlylumos.com/'
					},
					{
						title: 'Touching Soul',
						detail: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://touchingsoul.art/'
					},
					{
						title: 'Tâm Lý Hoa Sung',
						detail: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://tamlyhoasung.com/'
					},
					{
						title: 'Vietnam Psychology',
						detail: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://www.vietnampsychology.com/'
					},
					{
						title: 'Tâm Lý Việt An',
						detail: 'Trung tâm tham vấn tâm lý tư nhân tại TPHCM.',
						link: 'https://tamlyvietan.com/'
					}
				]
			},
			{
				id: 'benh-vien-tham-van',
				title: 'Bệnh viện có dịch vụ tham vấn',
				desc: 'Các bệnh viện lớn có đơn vị tâm lý lâm sàng hoặc dịch vụ tham vấn.',
				items: [
					{
						title: 'BV Đại học Y Dược TPHCM',
						detail: 'Đơn vị Tâm lý lâm sàng.',
						link: 'https://www.facebook.com/benhviendaihocyduoc/posts/%C4%91%C6%A1n-v%E1%BB%8B-t%C3%A2m-l%C3%BD-l%C3%A2m-s%C3%A0ng-b%E1%BB%87nh-vi%E1%BB%87n-%C4%91%E1%BA%A1i-h%E1%BB%8Dc-y-d%C6%B0%E1%BB%A3c-tphcm-%C4%91%C6%A1n-v%E1%BB%8B-t%C3%A2m-l%C3%BD-l%C3%A2m-s%C3%A0ng-b%E1%BB%87n/1052576551593330/'
					},
					{
						title: 'Bệnh viện FV',
						detail: 'Chương trình tư vấn, chăm sóc sức khỏe tinh thần.',
						link: 'https://www.fvhospital.com/health-programme/tu-van-cham-soc-suc-khoe-tinh-than/'
					},
					{
						title: 'CarePlus',
						detail: 'Tham vấn tâm lý cá nhân dành cho người lớn.',
						link: 'https://www.careplusvn.com/vi/tham-van-tam-ly-ca-nhan-danh-cho-nguoi-lon'
					},
					{
						title: 'Vinmec',
						detail: 'Vinmec Central Park, tham vấn tâm lý.',
						link: 'https://www.facebook.com/Vinmec/posts/vinmec-central-park-tham-v%E1%BA%A5n-t%C3%A2m-l%C3%BD-c%C3%B3-ph%E1%BA%A3i-ch%E1%BB%89-d%C3%A0nh-cho-ng%C6%B0%E1%BB%9Di-m%E1%BA%AFc-v%E1%BA%A5n-%C4%91%E1%BB%81-v%E1%BB%81-s%E1%BB%A9c/1057520075835336/'
					}
				]
			},
			{
				id: 'huong-nghiep',
				title: 'Trung tâm tư vấn hướng nghiệp',
				desc: 'Hỗ trợ định hướng nghề nghiệp.',
				items: [
					{
						title: 'Hướng Nghiệp Sông An',
						detail: 'Trung tâm tư vấn hướng nghiệp.',
						link: 'https://huongnghiepsongan.com/'
					}
				]
			},
			{
				id: 'can-thiep-tre',
				title: 'Trung tâm can thiệp trẻ',
				desc: 'Can thiệp sớm và giáo dục đặc biệt cho trẻ.',
				items: [
					{
						title: 'SEN Box',
						detail: 'Mạng lưới giáo dục đặc biệt (Special Education Network).',
						link: 'https://www.senbox.org/'
					}
				]
			}
		]
	}
];
