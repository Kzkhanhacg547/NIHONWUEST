# -*- coding: utf-8 -*-
"""
UNIT 3: TỒN TẠI, ĐẾM SỐ, SO SÁNH & THỂ TE (10 Lessons, 15 Questions each = 150 Questions)
Minna Bài 10 - 16
"""

def get_unit3_lessons(q):
    lessons = []

    # 21. Minna Bài 10: Sự tồn tại đồ vật & người
    lessons.append((
        "minna-lesson-10-arimasu-imasu",
        "Sự Tồn Tại Đồ Vật & Sinh Vật (あります・います, Trợ Từ に)",
        "Phân biệt đối tượng vô tri vô giác (あります) và sinh vật sống di chuyển (います), vị trí không gian.",
        [
            q("GRAMMAR", "Động từ biểu thị sự tồn tại của ĐỒ VẬT VÔ TRI, CÂY CỎ là gì?", "あります (arimasu)", "います (imasu)", "おきます", "します"),
            q("GRAMMAR", "Động từ biểu thị sự tồn tại của NGƯỜI và ĐỘNG VẬT có tri giác là gì?", "います (imasu)", "あります (arimasu)", "きます", "いきます"),
            q("GRAMMAR", "Cấu trúc: 'Ở Nơi chốn có Đối tượng':", "[Địa điểm] に [Đối tượng] が あります/います。", "[Địa điểm] で [Đối tượng] を あります。", "[Địa điểm] を [Đối tượng] に います。", "[Địa điểm] から [Đối tượng] まで います。"),
            q("GRAMMAR", "Dịch câu: 'Trong phòng có một con mèo':", "部屋に 猫が います。", "部屋で 猫が います。", "部屋に 猫が あります。", "部屋を 猫が います。"),
            q("GRAMMAR", "Dịch câu: 'Trên bàn có cuốn sách':", "机の上に 本が あります。", "机の上で 本が あります。", "机の上に 本が います。", "机の上が 本に あります。"),
            q("VOCABULARY", "Từ 'うえ' (ue) có nghĩa là gì?", "Ở trên", "Ở dưới", "Ở trong", "Ở ngoài"),
            q("VOCABULARY", "Từ 'した' (shita) có nghĩa là gì?", "Ở dưới", "Ở trên", "Bên cạnh", "Phía trước"),
            q("VOCABULARY", "Từ 'まえ' (mae) có nghĩa là gì?", "Phía trước", "Phía sau", "Bên trong", "Bên ngoài"),
            q("VOCABULARY", "Từ 'うしろ' (ushiro) có nghĩa là gì?", "Phía sau", "Phía trước", "Bên phải", "Bên trái"),
            q("VOCABULARY", "Từ 'なか' (naka) có nghĩa là gì?", "Bên trong", "Bên ngoài", "Ở giữa", "Kế bên"),
            q("VOCABULARY", "Từ 'そと' (soto) có nghĩa là gì?", "Bên ngoài", "Bên trong", "Ở trên", "Ở dưới"),
            q("VOCABULARY", "Từ 'となり' (tonari) có nghĩa là gì?", "Bên cạnh (cùng loại, sát vách)", "Ở xa", "Ở giữa", "Đối diện"),
            q("VOCABULARY", "Từ 'あいだ' (aida) trong cấu trúc 'A と B の あいだ' có nghĩa là:", "Ở giữa A và B", "Ở trên A và B", "Ở ngoài A và B", "Ở dưới A và B"),
            q("GRAMMAR", "Câu hỏi xác nhận: 'Trong hộp có cái gì thế?':", "箱の中に 何が ありますか？", "箱の中で 何を ありますか？", "箱の中に だれが いますか？", "箱の中は なんですか？"),
            q("GRAMMAR", "Phủ định hoàn toàn: 'Không có ai ở đây cả':", "だれも いません (dare mo imasen)", "だれが いません", "だれも ありません", "だれに いません"),
        ]
    ))

    # 22. Minna Bài 11: Lượng từ & Đơn vị đếm
    lessons.append((
        "minna-lesson-11-counters-quantifiers",
        "Lượng Từ & Đơn Vị Đếm (ひとつ・〜人・〜本・〜枚・〜台)",
        "Nắm vững hệ thống đếm thuần Nhật (1-10 cái), các hậu tố đếm chuyên dụng và hỏi tần suất, thời gian.",
        [
            q("SPECIAL_SOUND", "Đếm 1 cái đồ vật thuần Nhật là gì?", "ひとつ (hitotsu)", "ふたつ", "みっつ", "よっつ"),
            q("SPECIAL_SOUND", "Đếm 2 cái đồ vật thuần Nhật là gì?", "ふたつ (futatsu)", "ひとつ", "みっつ", "いつつ"),
            q("SPECIAL_SOUND", "Đếm 3 cái đồ vật thuần Nhật là gì?", "みっつ (mittsu)", "むっつ", "ななつ", "やっつ"),
            q("SPECIAL_SOUND", "Đếm 4 cái đồ vật thuần Nhật là gì?", "よっつ (yottsu)", "ここのつ", "とお", "みっつ"),
            q("SPECIAL_SOUND", "Đếm 10 cái đồ vật thuần Nhật là gì?", "とお (too)", "じゅう", "ここのつ", "やっつ"),
            q("GRAMMAR", "Hậu tố đếm NGƯỜI đặc biệt: 1 người và 2 người là gì?", "一人 (ひとり) và 二人 (ふたり)", "いちにん và ににん", "ひとつ và ふたつ", "いちめい và にめい"),
            q("GRAMMAR", "Hậu tố '〜枚' (まい / mai) dùng để đếm loại vật thể nào?", "Vật mỏng phẳng như giấy, áo sơ mi, đĩa, vé", "Đồ vật dài", "Máy móc xe cộ", "Con vật nhỏ"),
            q("GRAMMAR", "Hậu tố '〜台' (だい / dai) dùng để đếm loại vật thể nào?", "Máy móc, thiết bị điện tử, xe cộ cơ giới", "Vật mỏng", "Sách báo", "Đồ uống chai lọ"),
            q("GRAMMAR", "Hậu tố '〜本' (ほん / hon) dùng để đếm loại vật thể nào?", "Vật thon dài hình trụ: bút chì, chai bia, cây cối, chuối", "Đĩa CD", "Con vật", "Tòa nhà"),
            q("GRAMMAR", "Hậu tố '〜匹' (ひき / hiki) dùng để đếm loại nào?", "Động vật nhỏ: chó, mèo, cá, côn trùng", "Người", "Xe cộ", "Máy bay"),
            q("GRAMMAR", "Vị trí của lượng từ trong câu thường đặt ở đâu?", "Ngay trước động từ hoặc sau trợ từ", "Đứng đầu câu", "Đứng cuối câu sau です", "Trước danh từ có の"),
            q("GRAMMAR", "Dịch câu: 'Tôi đã mua 3 quả táo':", "りんごを ３つ 買いました。", "３つの りんご 買いました。", "りんごは ３つで 買いました。", "りんごに ３つを 買いました。"),
            q("GRAMMAR", "Cụm từ hỏi khoảng thời gian mất bao lâu: 'Từ Tokyo đến Osaka mất bao lâu?':", "どのくらい かかりますか？", "いくらですか？", "なんじですか？", "いくつですか？"),
            q("GRAMMAR", "Động từ 'かかります' (kakarimasu) dùng để biểu thị tiêu tốn cái gì?", "Tốn thời gian hoặc tiền bạc", "Tốn công sức", "Bị cảm lạnh", "Treo đồ"),
            q("GRAMMAR", "Cấu trúc tần suất: '1 tháng đi xem phim 2 lần':", "１か月に ２回 映画を見ます。", "１か月で ２回 映画を見ます。", "１か月を ２回 映画を見ます。", "１か月へ ２回 映画を見ます。"),
        ]
    ))

    # 23. Minna Bài 12: So sánh trong tiếng Nhật
    lessons.append((
        "minna-lesson-12-comparisons",
        "So Sánh Hơn, So Sánh Lựa Chọn & So Sánh Nhất (より・のほうが・いちばん)",
        "Các mẫu câu so sánh giữa 2 đối tượng và tìm ra đối tượng nổi trội nhất trong một tập hợp.",
        [
            q("GRAMMAR", "Cấu trúc so sánh hơn: 'A hơn B về mặt tính từ':", "A は B より [Tính từ] です。", "A は B のほうが [Tính từ] です。", "A より B は [Tính từ] です。", "A も B も [Tính từ] です。"),
            q("GRAMMAR", "Dịch câu: 'Mùa hè nóng hơn mùa đông':", "夏は 冬より 暑いです。", "冬は 夏より 暑いです。", "夏より 冬のほうが 暑いです。", "夏は 冬ほど 暑いです。"),
            q("GRAMMAR", "Mẫu câu hỏi lựa chọn giữa hai vật: 'A và B, cái nào [Tính từ] hơn?':", "A と B と どちらが [Tính từ] ですか？", "A と B は どれが [Tính từ] ですか？", "A と B に だれが [Tính từ] ですか？", "A と B で なにが [Tính từ] ですか？"),
            q("GRAMMAR", "Trả lời cho câu hỏi lựa chọn: 'A [Tính từ] hơn':", "A のほうが [Tính từ] です。", "A より [Tính từ] です。", "A は [Tính từ] です。", "A がいちばん [Tính từ] です。"),
            q("GRAMMAR", "Cấu trúc so sánh nhất: 'Trong phạm vi [N] thì A là nhất':", "[Phạm vi] の中で A が いちばん [Tính từ] です。", "[Phạm vi] より A のほうが いちばん です。", "[Phạm vi] で A より [Tính từ] です。", "[Phạm vi] は A ほど [Tính từ] です。"),
            q("GRAMMAR", "Dịch câu: 'Trong 1 năm, tháng 8 nóng nhất':", "１年の中で ８月が いちばん 暑いです。", "１年は ８月より 暑いです。", "１年で ８月のほうが 暑いです。", "１年に ８月が 暑いですか。"),
            q("VOCABULARY", "Từ 'ずっと' (zutto) đứng trước tính từ so sánh có nghĩa là gì?", "Hơn hẳn / Rõ rệt (nhấn mạnh mức độ chênh lệch lớn)", "Bằng nhau", "Kém hơn", "Ít hơn"),
            q("VOCABULARY", "Từ 'どちら' (dochira) dùng khi nào?", "Khi so sánh lựa chọn giữa 2 đối tượng", "Khi so sánh giữa 3 đối tượng trở lên", "Khi hỏi về thời gian", "Khi hỏi giá tiền"),
            q("VOCABULARY", "Từ 'どれ' (dore) dùng khi nào?", "Khi lựa chọn trong 3 đối tượng trở lên", "Khi chỉ có 2 đối tượng", "Khi hỏi người", "Khi hỏi nơi chốn"),
            q("VOCABULARY", "Từ 'きせつ' (kisetsu) có nghĩa là gì?", "Mùa trong năm", "Thời tiết", "Khí hậu", "Nhiệt độ"),
            q("VOCABULARY", "Bốn mùa trong tiếng Nhật lần lượt là: Haru, Natsu, Aki, Fuyu có nghĩa là:", "Xuân, Hạ, Thu, Đông", "Hạ, Thu, Đông, Xuân", "Đông, Xuân, Hạ, Thu", "Thu, Đông, Xuân, Hạ"),
            q("VOCABULARY", "Từ 'もみじ' (momiji) tượng trưng cho mùa thu ở Nhật là gì?", "Lá phong đỏ", "Hoa anh đào", "Tuyết rơi", "Pháo hoa"),
            q("GRAMMAR", "Khi hai bên ngang nhau hoặc cả hai đều thích, ta nói:", "どちらも 好きです (Dochira mo suki desu)", "どちらが 好きです", "どちらより 好きです", "どちらのほうが 嫌いです"),
            q("VOCABULARY", "Từ 'くだもの' (kudamono) có nghĩa là gì?", "Trái cây / Hoa quả", "Rau xanh", "Hải sản", "Bánh kẹo"),
            q("VOCABULARY", "Từ 'まつり' (matsuri) có nghĩa là gì?", "Lễ hội truyền thống", "Cuộc thi", "Kỳ nghỉ hè", "Buổi hòa nhạc"),
        ]
    ))

    # 24. Minna Bài 13: Mong muốn & Mục đích
    lessons.append((
        "minna-lesson-13-desires-and-purposes",
        "Bày Tỏ Nguyện Vọng (ほしい・〜たい) & Mục Đích Di Chuyển",
        "Mẫu câu muốn có đồ vật (ほしい), muốn làm gì (Vたい) và đi đâu để thực hiện mục đích gì.",
        [
            q("GRAMMAR", "Mẫu câu muốn SỞ HỮU một đồ vật gì đó:", "私は [Danh từ] が ほしいです。", "私は [Danh từ] を ほしいです。", "私は [Danh từ] に ほしいです。", "私は [Danh từ] で ほしいです。"),
            q("GRAMMAR", "Dịch câu: 'Tôi muốn có một chiếc ô tô mới':", "私は 新しい車が ほしいです。", "私は 新しい車を ほしいです。", "私は 新しい車に ほしいです。", "私は 新しい車で ほしいです。"),
            q("GRAMMAR", "Phủ định của 'ほしいです' (không muốn có):", "ほしくないです (hoshikunai desu)", "ほしいじゃないです", "ほしくありませんでした", "ほしくないでした"),
            q("GRAMMAR", "Mẫu câu muốn LÀM một hành động gì đó (bản thân người nói muốn):", "Động từ bỏ ます + たいです", "Động từ + たいです", "Động từ + てほしい", "Động từ + ますたい"),
            q("GRAMMAR", "Dịch câu: 'Tôi muốn ăn sushi':", "私は すしが / を 食べたいです。", "私は すしに 食べたいです。", "私は すしで 食べたいです。", "私は すしへ 食べたいです。"),
            q("GRAMMAR", "Phủ định của Vたい (không muốn làm gì):", "Động từ bỏ ます + たくないです", "Động từ + たいじゃないです", "Động từ + ませんたい", "Động từ + たくないでした"),
            q("GRAMMAR", "LƯU Ý quan trọng: Mẫu câu 'ほしい' và '〜たい' có dùng trực tiếp để hỏi hoặc nói về mong muốn của NGƯỜI THỨ BA không?", "Không dùng trực tiếp cho người thứ ba hoặc bề trên", "Dùng thoải mái mọi đối tượng", "Chỉ dùng cho người lớn tuổi", "Bắt buộc dùng"),
            q("GRAMMAR", "Cấu trúc chỉ mục đích di chuyển: 'Đi đến đâu để làm gì':", "[Địa điểm] へ [V bỏ ます / Danh từ] に 行きます/来ます/帰ります。", "[Địa điểm] で [V ます] を 行きます。", "[Địa điểm] に [V て] で 行きます。", "[Địa điểm] を [V ます] に 行きます。"),
            q("GRAMMAR", "Dịch câu: 'Tôi đi đến bưu điện để gửi thư':", "郵便局へ 手紙を 出しに 行きます。", "郵便局で 手紙を 出すに 行きます。", "郵便局に 手紙を 出して 行きます。", "郵便局へ 手紙を 出しますに 行きます。"),
            q("GRAMMAR", "Dịch câu: 'Tôi đi Nhật Bản để du học':", "日本へ 留学に 行きます。", "日本で 留学を 行きます。", "日本に 留学で 行きます。", "日本へ 留学へ 行きます。"),
            q("VOCABULARY", "Từ 'おなかが すきました' (onaka ga sukimashita) có nghĩa là gì?", "Tôi bị đói bụng rồi", "Tôi no bụng rồi", "Tôi khát nước", "Tôi đau bụng"),
            q("VOCABULARY", "Từ 'のどが かわきました' (nodo ga kawakimashita) có nghĩa là gì?", "Tôi bị khát nước khô cổ rồi", "Tôi đói bụng", "Tôi nghẹn họng", "Tôi bị sốt"),
            q("EXPRESSION", "Khi đã đói bụng, câu đề nghị tiếp theo thường là:", "何か 食べましょう (Cùng ăn gì đó đi)", "何も 食べません", "何が 食べますか", "どこへ 行きますか"),
            q("VOCABULARY", "Từ 'かいもの' (kaimono) có nghĩa là hành động gì?", "Việc mua sắm", "Việc nấu nướng", "Việc dọn dẹp", "Việc giặt giũ"),
            q("EXPRESSION", "Lời chào của nhân viên quán khi khách bước vào:", "いらっしゃいませ (Irasshaimase)", "おかえりなさい", "いってらっしゃい", "ごめんください"),
        ]
    ))

    # 25. Minna Bài 14: Thể Te & Chuyển đổi 3 nhóm động từ
    lessons.append((
        "minna-lesson-14-te-form-rules",
        "Thể Te (て形) & Quy Tắc Biến Đổi 3 Nhóm Động Từ",
        "Bí quyết nắm chắc quy tắc chia thể Te cho Nhóm 1, Nhóm 2, Nhóm 3 - chìa khóa ngữ pháp cốt lõi tiếng Nhật.",
        [
            q("GRAMMAR", "Động từ tiếng Nhật được phân chia làm mấy nhóm chính?", "3 nhóm (Nhóm 1, Nhóm 2, Nhóm 3)", "2 nhóm", "4 nhóm", "5 nhóm"),
            q("GRAMMAR", "Động từ Nhóm 3 gồm những động từ nào?", "きます (đến) và します (làm / Danh động từ + します)", "Chỉ có します", "Tất cả động từ kết thúc bằng ru", "Tất cả tha động từ"),
            q("GRAMMAR", "Động từ Nhóm 2 chia sang thể Te bằng cách nào?", "Bỏ ます thêm て (VD: たべます -> たべて)", "Thêm って", "Thêm んで", "Biến đổi bất quy tắc"),
            q("GRAMMAR", "Nhóm 1: Các đuôi [い, ち, り] khi chuyển sang thể Te sẽ biến thành gì?", "〜って (âm ngắt っ + て)", "〜んで", "〜いて", "〜して"),
            q("GRAMMAR", "Chia thể Te của động từ 'かいます' (mua):", "かって (katte)", "かいって", "かいて", "かんで"),
            q("GRAMMAR", "Nhóm 1: Các đuôi [み, び, に] khi chuyển sang thể Te sẽ biến thành gì?", "〜んで (nde)", "〜って", "〜いて", "〜いで"),
            q("GRAMMAR", "Chia thể Te của động từ 'のみます' (uống):", "のんで (nonde)", "のみて", "のって", "のいで"),
            q("GRAMMAR", "Nhóm 1: Đuôi [き] chuyển sang thể Te là gì?", "〜いて (ite)", "〜いで", "〜って", "〜して"),
            q("GRAMMAR", "Chia thể Te của động từ 'かきます' (viết):", "かいて (kaite)", "かって", "かんで", "かして"),
            q("GRAMMAR", "TRƯỜNG HỢP NGOẠI LỆ DUY NHẤT: Động từ 'いきます' (ikimasu - đi) sang thể Te là gì?", "いって (itte - có âm ngắt っ)", "いいて", "いんで", "いきて"),
            q("GRAMMAR", "Nhóm 1: Đuôi [ぎ] biến thành gì trong thể Te?", "〜いで (ide)", "〜いて", "〜って", "〜ぜ"),
            q("GRAMMAR", "Chia thể Te của động từ 'いそぎます' (vội vã/gấp rút):", "いそいで (isoide)", "いそいて", "いそって", "いそんで"),
            q("GRAMMAR", "Nhóm 1: Đuôi [し] biến thành gì trong thể Te?", "〜して (shite)", "〜って", "〜いて", "〜んで"),
            q("GRAMMAR", "Chia thể Te của động từ 'はなします' (nói chuyện):", "はなして (hanashite)", "はなって", "はなない", "はなして"),
            q("GRAMMAR", "Thể Te của động từ Nhóm 3 'きます' (kimasu) và 'します' (shimasu) là:", "きて (kite) và して (shite)", "こて và して", "きって và しって", "きいて và して"),
        ]
    ))

    # 26. Minna Bài 14-2: Yêu cầu lịch sự & Đang diễn ra
    lessons.append((
        "minna-lesson-14-requests-and-progressive",
        "Yêu Cầu Lịch Sự (〜てください) & Đang Diễn Ra (〜ています)",
        "Nhờ vả lịch sự, chỉ dẫn hành động và cách diễn đạt thì hiện tại tiếp diễn trong tiếng Nhật.",
        [
            q("GRAMMAR", "Mẫu câu nhờ ai đó làm việc gì một cách lịch sự:", "Động từ thể Te + ください", "Động từ thể Masu + ください", "Động từ thể Nai + ください", "Động từ nguyên mẫu + ください"),
            q("GRAMMAR", "Dịch câu: 'Xin hãy đọc quyển sách này':", "この本を 読んでください。", "この本を 読みてください。", "この本を 読まないでください。", "この本を 読みますください。"),
            q("GRAMMAR", "Dịch câu: 'Xin hãy viết tên vào đây':", "ここに 名前を 書いてください。", "ここで 名前を 書いてください。", "ここに 名前を 書きますください。", "ここへ 名前を 書くください。"),
            q("GRAMMAR", "Mẫu câu biểu thị hành động ĐANG DIỄN RA tại thời điểm nói:", "Động từ thể Te + います", "Động từ thể Te + あります", "Động từ thể Masu + います", "Động từ thể Nai + います"),
            q("GRAMMAR", "Dịch câu: 'Bây giờ anh Miller đang đọc báo':", "ミラーさんは 今 新聞を 読んでいます。", "ミラーさんは 今 新聞を 読みます。", "ミラーさんは 今 新聞を 読みました。", "ミラーさんは 今 新聞を 読んであります。"),
            q("GRAMMAR", "Dịch câu: 'Trời đang mưa':", "雨が 降っています (Ame ga futte imasu)。", "雨が 降ります。", "雨を 降っています。", "雨で 降っています。"),
            q("VOCABULARY", "Động từ 'つけます' (tsukemasu) thiết bị điện có nghĩa là gì?", "Bật (đèn, máy lạnh, tivi)", "Tắt", "Mở cửa", "Đóng cửa"),
            q("VOCABULARY", "Động từ 'けします' (keshimasu) thiết bị điện có nghĩa là gì?", "Tắt (đèn, điều hòa, lửa)", "Bật", "Khóa", "Sửa"),
            q("VOCABULARY", "Động từ 'あけます' (akemasu) có nghĩa là gì?", "Mở (cửa sổ, cửa chính, nắp hộp)", "Đóng", "Bật", "Kéo"),
            q("VOCABULARY", "Động từ 'しめます' (shimemasu) có nghĩa là gì?", "Đóng (cửa, hộp)", "Mở", "Bật", "Tắt"),
            q("VOCABULARY", "Động từ 'てつだいます' (tetsudaimasu) có nghĩa là gì?", "Giúp đỡ / Hỗ trợ", "Cản trở", "Làm hộ", "Nhờ cậy"),
            q("GRAMMAR", "Mẫu câu CHỦ ĐỘNG ĐỀ NGHỊ giúp đỡ người khác: 'Để tôi làm giúp bạn nhé!':", "〜ましょうか？ (〜mashou ka?)", "〜ませんか？", "〜てください", "〜ましょう"),
            q("EXPRESSION", "Đáp lại đề nghị giúp đỡ khi bạn đồng ý: 'Làm ơn, nhờ bạn nhé':", "すみません、お願いします。", "いいえ、だめです。", "どういたしまして。", "ごちそうさまでした。"),
            q("VOCABULARY", "Từ 'ゆっくり' (yukkuri) có nghĩa là gì?", "Chậm rãi / Thong thả / Từ từ", "Nhanh chóng", "Vội vã", "Lập tức"),
            q("VOCABULARY", "Từ 'すぐ' (sugu) có nghĩa là gì?", "Ngay lập tức / Ngay", "Chậm rãi", "Một lát sau", "Ngày mai"),
        ]
    ))

    # 27. Minna Bài 15: Xin phép & Cấm đoán
    lessons.append((
        "minna-lesson-15-permission-prohibition",
        "Xin Phép (〜てもいいですか) & Cấm Đoán (〜てはいけません)",
        "Hỏi xin sự cho phép và đưa ra quy tắc cấm chỉ nghiêm ngặt trong đời sống và giao thông.",
        [
            q("GRAMMAR", "Mẫu câu XIN PHÉP: 'Tôi làm... có được không?':", "Động từ thể Te + もいいですか？", "Động từ thể Te + はいけません", "Động từ thể Te + ください", "Động từ thể Nai + でください"),
            q("GRAMMAR", "Dịch câu: 'Tôi chụp ảnh ở đây có được không?':", "ここで 写真を 撮ってもいいですか？", "ここに 写真を 撮ってはいけません。", "ここで 写真を 撮りましょうか？", "ここで 写真を 撮ってくださいか？"),
            q("GRAMMAR", "Cách trả lời ĐỒNG Ý cho phép ai đó làm gì:", "ええ、いいですよ。どうぞ。(Được chứ, xin mời)", "いいえ、だめです。", "いいえ、いけません。", "すみません、だめです。"),
            q("GRAMMAR", "Mẫu câu CẤM ĐOÁN: 'Không được phép làm...':", "Động từ thể Te + は いけません", "Động từ thể Te + もいいです", "Động từ thể Nai + なければなりません", "Động từ + てください"),
            q("GRAMMAR", "Dịch câu: 'Không được hút thuốc ở đây!':", "ここで たばこを 吸ってはいけません。", "ここで たばこを 吸ってもいいです。", "ここに たばこを 吸わないでください。", "ここで たばこを 吸います。"),
            q("VOCABULARY", "Từ 'たばこを すいます' (tabako wo suimasu) có nghĩa là gì?", "Hút thuốc lá", "Bỏ thuốc", "Mua thuốc lá", "Châm lửa lá"),
            q("VOCABULARY", "Từ 'すわります' (suwarimasu) đi với trợ từ に có nghĩa là gì?", "Ngồi xuống (ghế, chiếu)", "Đứng lên", "Nằm xuống", "Bước đi"),
            q("VOCABULARY", "Từ 'たちます' (tachimasu) có nghĩa là gì?", "Đứng dậy / Đứng", "Ngồi", "Chạy", "Nhảy"),
            q("VOCABULARY", "Từ 'つかいます' (tsukaimasu) có nghĩa là gì?", "Sử dụng / Dùng", "Bỏ đi", "Cất giấu", "Làm hư"),
            q("VOCABULARY", "Từ 'おきます' (okimasu) với chữ Hán 置 có nghĩa là gì?", "Đặt / Để đồ vật xuống", "Thức dậy", "Đứng lên", "Đi ngủ"),
            q("VOCABULARY", "Từ 'つくります' (tsukurimasu) có nghĩa là gì?", "Chế tạo / Làm ra / Nấu tạo ra", "Mua", "Bán", "Phá hủy"),
            q("VOCABULARY", "Từ 'うります' (urimasu) có nghĩa là gì?", "Bán đồ", "Mua đồ", "Đổi đồ", "Mượn đồ"),
            q("VOCABULARY", "Từ 'しりょう' (shiryou) có nghĩa là gì?", "Tài liệu", "Sách giáo khoa", "Hợp đồng", "Tạp chí"),
            q("VOCABULARY", "Từ 'カタログ' (katarogu) có nghĩa là gì?", "Tập catalogue / Danh mục sản phẩm", "Bản đồ", "Tờ rơi", "Cuốn lịch"),
            q("VOCABULARY", "Từ 'きんえん' (kinen) trên các biển báo có nghĩa là gì?", "Cấm hút thuốc", "Được hút thuốc", "Khu vực hút thuốc", "Bán thuốc lá"),
        ]
    ))

    # 28. Minna Bài 15-2: Trạng thái & Thói quen nghề nghiệp
    lessons.append((
        "minna-lesson-15-status-and-profession",
        "Trạng Thái Kết Quả & Thói Quen Nghề Nghiệp (〜ています)",
        "Diễn đạt trạng thái hôn nhân, nơi sinh sống cư trú, công việc thường nhật và sở hữu kiến thức.",
        [
            q("GRAMMAR", "Động từ 'しります' (biết) ở dạng khẳng định biểu thị trạng thái đã biết là gì?", "知っています (shitte imasu)", "知ります", "知りました", "知っていますでした"),
            q("GRAMMAR", "Phủ định của '知っています' (Tôi không biết) là dạng ĐẶC BIỆT nào?", "知りません (shirimasen)", "知っていません", "知りませんでした", "知らなくてです"),
            q("GRAMMAR", "Để nói tình trạng 'đã kết hôn/lập gia đình', ta dùng dạng:", "結婚しています (kekkon shite imasu)", "結婚します", "結婚しました", "結婚してあります"),
            q("GRAMMAR", "Để nói 'Tôi đang sống/cư trú tại Hà Nội', ta dùng cấu trúc:", "ハノイに 住んでいます (sunde imasu)。", "ハノイで 住みます。", "ハノイを行きます。", "ハノイから 住んでいます。"),
            q("GRAMMAR", "Trợ từ đi với nơi cư trú lâu dài '住んでいます' là gì?", "に (ni) - chỉ điểm định vị cư trú", "で", "を", "へ"),
            q("GRAMMAR", "Dịch câu: 'Tôi đang làm việc tại công ty IMC':", "IMCで 働いています。", "IMCに 働きます。", "IMCへ 働いています。", "IMCを 働いています。"),
            q("GRAMMAR", "Cửa hàng đang 'bán' mặt hàng gì (kinh doanh ổn định):", "この店で 古い本を 売っています。", "この店で 古い本を 売ります。", "この店に 古い本を 売っています。", "この店の 古い本が 売ります。"),
            q("VOCABULARY", "Từ 'はいしゃ' (haisha) có nghĩa là bác sĩ chuyên khoa nào?", "Nha sĩ / Bác sĩ răng hàm mặt", "Bác sĩ mắt", "Bác sĩ da liễu", "Bác sĩ nhi"),
            q("VOCABULARY", "Từ 'どくしん' (dokushin) có nghĩa là tình trạng nào?", "Độc thân (chưa kết hôn)", "Đã có gia đình", "Góa phụ", "Đính hôn"),
            q("VOCABULARY", "Từ 'おもいだします' (omoidashimasu) có nghĩa là gì?", "Nhớ ra / Hồi tưởng lại", "Quên mất", "Suy nghĩ", "Hiểu ra"),
            q("VOCABULARY", "Từ 'せいひん' (seihin) có nghĩa là gì?", "Sản phẩm chế tạo", "Nguyên liệu", "Nhà máy", "Máy móc"),
            q("VOCABULARY", "Từ 'ふく' (fuku) có nghĩa là gì?", "Quần áo", "Giày dép", "Túi xách", "Mũ nón"),
            q("VOCABULARY", "Từ 'せんもん' (senmon) có nghĩa là gì?", "Chuyên môn / Chuyên ngành", "Sở thích", "Ngoại ngữ", "Năng khiếu"),
            q("EXPRESSION", "Khi muốn bắt đầu một câu hỏi tế nhị hoặc xin phép hỏi: 'Xin lỗi, cho tôi hỏi...':", "失礼ですが (Shitsurei desu ga...)", "すみませんですが", "ごめんなさいですが", "ありがとうございますが"),
            q("EXPRESSION", "Hỏi nghề nghiệp của ai đó: 'Anh/chị đang làm công việc gì thế?':", "お仕事は 何を されていますか / なんですか？", "お仕事は どこですか？", "お仕事は だれですか？", "お仕事は いつですか？"),
        ]
    ))

    # 29. Minna Bài 16: Nối câu Động từ & Tính từ
    lessons.append((
        "minna-lesson-16-connecting-clauses",
        "Nối Câu Động Từ & Tính Từ (〜て, 〜て, 〜ます / 〜くて / 〜で)",
        "Nối chuỗi các hành động liên tiếp nhau theo thứ tự thời gian và ghép nối các đặc điểm tính từ.",
        [
            q("GRAMMAR", "Khi muốn nối 2 hay nhiều hành động diễn ra liên tiếp theo thời gian:", "Chia các động từ trước sang thể Te, động từ cuối cùng chia thì cho cả câu", "Dùng từ と nối tất cả", "Chia tất cả sang thể Masu", "Chia tất cả sang quá khứ Mashita"),
            q("GRAMMAR", "Dịch câu: 'Sáng nay tôi thức dậy lúc 6h, ăn sáng rồi đi học':", "朝 ６時に 起きて、ごはんを 食べて、学校へ 行きました。", "朝 ６時に 起きます、ごはんを 食べます、学校へ 行きました。", "朝 ６時に 起きてと ごはんを 食べてと 学校へ 行きました。", "朝 ６時に 起きた、ごはんを 食べた、学校へ 行った。"),
            q("GRAMMAR", "Khi nối hai Tính từ Đuôi い (như: Món này vừa ngon vừa rẻ):", "Tính từ trước bỏ い thay bằng 〜くて (VD: おいしくて、やすい)", "Thêm と vào giữa", "Thêm で vào giữa", "Bỏ い thêm くてと"),
            q("GRAMMAR", "Dịch câu: 'Khách sạn này vừa mới vừa sạch đẹp':", "このホテルは 新しくて、きれいです。", "このホテルは 新しいで、きれいです。", "このホテルは 新しいと、きれいです。", "このホテルは 新しくて、きれいかったです。"),
            q("GRAMMAR", "Tính từ đặc biệt 'いい' (tốt) khi nối câu biến thành gì?", "よくて (yokute)", "いくて", "いいで", "よかったで"),
            q("GRAMMAR", "Khi nối Tính từ Đuôi な hoặc Danh từ (như: Anh Tanaka 28 tuổi và còn độc thân):", "Dùng đuôi 〜で (VD: ２８歳で、独身です)", "Dùng 〜くて", "Dùng 〜なで", "Dùng 〜ので"),
            q("GRAMMAR", "Dịch câu: 'Thầy giáo là người vừa trẻ trung vừa nhiệt tình thân thiện':", "先生は 若くて、親切です。", "先生は 若いで、親切です。", "先生は 若いな、親切です。", "先生は 若いと、親切です。"),
            q("VOCABULARY", "Động từ 'おります' (orimasu) đi với tàu xe (〜を おります) có nghĩa là gì?", "Xuống (xe buýt, tàu điện)", "Lên xe", "Đổi chuyến", "Lái xe"),
            q("VOCABULARY", "Động từ 'のります' (norimasu) đi với phương tiện (〜に のります) có nghĩa là gì?", "Lên (tàu điện, xe buýt)", "Xuống xe", "Mua vé", "Lỡ chuyến"),
            q("VOCABULARY", "Động từ 'のりかえます' (norikaemasu) có nghĩa là gì?", "Chuyển tàu / Đổi tuyến xe", "Lên xe", "Xuống xe", "Hủy vé"),
            q("VOCABULARY", "Động từ 'あびます' (abimasu) trong cụm 'シャワーを あびます' là gì?", "Tắm vòi hoa sen", "Uống nước", "Giặt đồ", "Rửa mặt"),
            q("VOCABULARY", "Từ 'あたま' (atama) có nghĩa là bộ phận nào?", "Đầu", "Bụng", "Chân", "Mắt"),
            q("VOCABULARY", "Từ 'せ' (se) trong cụm '背が高い' (se ga takai) có nghĩa là gì?", "Dáng người / Chiều cao cơ thể", "Cái lưng", "Cái cổ", "Cánh tay"),
            q("VOCABULARY", "Từ 'あかるい' (akarui) có nghĩa là gì?", "Sáng sủa / Tươi sáng / Tính cách vui vẻ cởi mở", "Tối tăm", "Trầm lặng", "Lạnh lùng"),
            q("VOCABULARY", "Từ 'みどり' (midori) có nghĩa là màu sắc nào?", "Màu xanh lá cây", "Màu đỏ", "Màu xanh dương", "Màu vàng"),
        ]
    ))

    # 30. Minna Bài 16-2: Vてから & Đặc điểm cơ thể
    lessons.append((
        "minna-lesson-16-te-kara-body",
        "Hành Động Sau Khi (〜てから) & Miêu Tả Ngoại Hình (は...が)",
        "Nhấn mạnh thứ tự trước sau [Làm xong V1 rồi mới làm V2] và mẫu câu miêu tả đặc điểm ngoại hình.",
        [
            q("GRAMMAR", "Cấu trúc 'V1 てから V2' có ý nghĩa là gì?", "Sau khi làm xong V1 thì làm V2", "Trước khi làm V1", "Trong khi làm V1", "Vừa làm V1 vừa làm V2"),
            q("GRAMMAR", "Dịch câu: 'Sau khi làm xong bài tập, tôi đi ngủ':", "宿題を してから、寝ます。", "宿題を して、寝ますから。", "宿題を しますから、寝ます。", "宿題を する前に、寝ます。"),
            q("GRAMMAR", "Dịch câu: 'Sau khi kết thúc công việc, tôi đi uống bia':", "仕事が 終わってから、ビールを 飲みに行きます。", "仕事が 終わりますから、ビールを 飲みます。", "仕事の 前に、ビールを 飲みます。", "仕事が 終わるから、ビールを 飲みます。"),
            q("GRAMMAR", "Mẫu câu miêu tả đặc điểm ngoại hình một bộ phận của chủ thể:", "[Chủ thể] は [Bộ phận] が [Tính từ] です。", "[Chủ thể] の [Bộ phận] は [Tính từ] です。", "[Chủ thể] が [Bộ phận] を [Tính từ] です。", "[Chủ thể] に [Bộ phận] が [Tính từ] です。"),
            q("GRAMMAR", "Dịch câu: 'Cô Maria có đôi mắt to':", "マリアさんは 目が 大きいです。", "マリアさんの 目は 大きいです。", "マリアさんは 目を 大きいです。", "マリアさんに 目が 大きいです。"),
            q("GRAMMAR", "Dịch câu: 'Anh Santos có mái tóc đen ngắn':", "サントスさんは 髪が 短くて、黒いです。", "サントスさんは 髪の 短いと 黒いです。", "サントスさんは 髪で 短いです。", "サントスさんは 髪を 短いです。"),
            q("VOCABULARY", "Từ 'おろします' (oroshimasu) trong cụm 'おかねを おろします' là gì?", "Rút tiền (tại cây ATM / ngân hàng)", "Nạp tiền", "Đổi tiền", "Mất tiền"),
            q("VOCABULARY", "Cụm từ hỏi đường: 'Làm thế nào để đi đến... được ạ?':", "どうやって 行きますか？ (dou yatte ikimasu ka?)", "どこへ 行きますか？", "いくら 行きますか？", "だれと 行きますか？"),
            q("VOCABULARY", "Từ 'どの' (dono) trong 'どの 人ですか' có nghĩa là gì?", "Người nào? (yêu cầu xác định đối tượng cụ thể)", "Người ở đâu?", "Ai đó?", "Người kia?"),
            q("VOCABULARY", "Từ 'からだ' (karada) có nghĩa là gì?", "Cơ thể / Thân thể", "Trái tim", "Khí chất", "Bệnh tật"),
            q("VOCABULARY", "Từ 'かお' (kao) có nghĩa là gì?", "Khuôn mặt", "Cái mũi", "Cái miệng", "Đôi tai"),
            q("VOCABULARY", "Từ 'かみ' (kami) có nghĩa là gì khi miêu tả ngoại hình?", "Mái tóc", "Tờ giấy", "Thần linh", "Hàm răng"),
            q("VOCABULARY", "Từ 'みみ' (mimi) có nghĩa là gì?", "Cái tai", "Cái mắt", "Cái miệng", "Bàn chân"),
            q("VOCABULARY", "Từ 'は' (ha) trong khoang miệng có nghĩa là gì?", "Răng", "Lưỡi", "Môi", "Họng"),
            q("EXPRESSION", "Câu hỏi xác nhận thông tin khi nghe điện thoại hoặc trao đổi: 'Được chứ ạ? / Đã hiểu chưa ạ?':", "よろしいですか？", "どうですか？", "だめですか？", "そうですか？"),
        ]
    ))

    return lessons
