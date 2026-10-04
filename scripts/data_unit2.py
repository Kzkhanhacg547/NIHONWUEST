# -*- coding: utf-8 -*-
"""
UNIT 2: CUỘC SỐNG THƯỜNG NGÀY & GIAO TIẾP CƠ BẢN (10 Lessons, 15 Questions each = 150 Questions)
Minna Bài 02 - 09
"""

def get_unit2_lessons(q):
    lessons = []

    # 11. Minna Bài 02: Đại từ chỉ thị đồ vật
    lessons.append((
        "minna-lesson-02-kore-sore-are",
        "Đại từ Chỉ thị Đồ vật (これ・それ・あれ・どれ)",
        "Cách xác định khoảng cách đồ vật với người nói và người nghe, phân biệt [これ] và [この Danh từ].",
        [
            q("GRAMMAR", "Đại từ chỉ thị đồ vật ở gần NGƯỜI NÓI là gì?", "これ (kore)", "それ (sore)", "あれ (are)", "どれ (dore)"),
            q("GRAMMAR", "Đại từ chỉ thị đồ vật ở gần NGƯỜI NGHE là gì?", "それ (sore)", "これ (kore)", "あれ (are)", "どれ (dore)"),
            q("GRAMMAR", "Đại từ chỉ thị đồ vật ở XA CẢ HAI NGƯỜI là gì?", "あれ (are)", "これ (kore)", "それ (sore)", "どれ (dore)"),
            q("GRAMMAR", "Từ để hỏi 'Cái nào?' trong nhóm chỉ thị đồ vật là:", "どれ (dore)", "だれ (dare)", "どこ (doko)", "なに (nani)"),
            q("GRAMMAR", "Phân biệt 'これ' và 'この': sau 'この' bắt buộc phải là gì?", "Một Danh từ (N)", "Một Động từ", "Một Tính từ", "Trợ từ は"),
            q("GRAMMAR", "Dịch câu: 'Quyển sách này là của tôi':", "この本は 私のです。", "これは 本の私です。", "あれは 本です私。", "その本は 私じゃありません。"),
            q("GRAMMAR", "Trợ từ 'の' trong 'Tanaka-san no hon' biểu thị mối quan hệ gì?", "Sở hữu (Sách CỦA anh Tanaka)", "Vị trí", "Thời gian", "Số lượng"),
            q("VOCABULARY", "Từ 'ほん' (hon) có nghĩa là gì?", "Quyển sách", "Quyển vở", "Tờ báo", "Bức tranh"),
            q("VOCABULARY", "Từ 'じしょ' (jisho) có nghĩa là gì?", "Từ điển", "Tạp chí", "Bản đồ", "Bút chì"),
            q("VOCABULARY", "Từ 'ざっし' (zasshi) có nghĩa là gì?", "Tạp chí", "Báo", "Sách", "Vở ghi"),
            q("VOCABULARY", "Từ 'とけい' (tokei) có nghĩa là gì?", "Đồng hồ", "Điện thoại", "Máy tính", "Mắt kính"),
            q("VOCABULARY", "Từ 'かさ' (kasa) có nghĩa là gì?", "Cây dù / Cái ô", "Cái mũ", "Đôi giày", "Cái áo"),
            q("VOCABULARY", "Từ 'くるま' (kuruma) có nghĩa là gì?", "Xe ô tô", "Xe máy", "Tàu điện", "Máy bay"),
            q("GRAMMAR", "Khi người khác hỏi 'Sore wa nan desu ka?', bạn sẽ bắt đầu câu trả lời bằng:", "これは〜です", "それは〜です", "あれは〜です", "どれは〜です"),
            q("EXPRESSION", "Khi trao một món đồ cho ai đó, ta nói một cách lịch sự:", "どうぞ (Douzo)", "どうも", "ありがとう", "はい"),
        ]
    ))

    # 12. Minna Bài 03: Vị trí & Nơi chốn
    lessons.append((
        "minna-lesson-03-koko-soko-asoko",
        "Vị trí, Nơi Chốn & Chỉ Hướng (ここ・そこ・あそこ・どこ)",
        "Xác định địa điểm, vị trí các phòng ban, hỏi giá tiền và cách xưng hô lịch sự với [こちら・そちら].",
        [
            q("GRAMMAR", "Chỉ nơi chốn ở gần NGƯỜI NÓI là từ nào?", "ここ (koko)", "そこ (soko)", "あそこ (asoko)", "どこ (doko)"),
            q("GRAMMAR", "Chỉ nơi chốn ở gần NGƯỜI NGHE là từ nào?", "そこ (soko)", "ここ (koko)", "あそこ (asoko)", "どこ (doko)"),
            q("GRAMMAR", "Chỉ nơi chốn ở XA CẢ HAI NGƯỜI là từ nào?", "あそこ (asoko)", "そこ (soko)", "ここ (koko)", "どこ (doko)"),
            q("GRAMMAR", "Từ để hỏi vị trí/nơi chốn 'Ở đâu?' là:", "どこ (doko)", "だれ (dare)", "なに (nani)", "いつ (itsu)"),
            q("GRAMMAR", "Dạng lịch sự và trang trọng hơn của 'ここ・そこ・あそこ・どこ' là:", "こちら・そちら・あちら・どちら", "これ・それ・あれ・どれ", "この・その・あの・どの", "こっち・そっち・あっち・どっち"),
            q("GRAMMAR", "Mẫu câu hỏi nhà vệ sinh ở đâu lịch sự:", "おてあらいは どこですか？", "おてあらいは だれですか？", "おてあらいは なんですか？", "おてあらいは いつですか？"),
            q("VOCABULARY", "Từ 'きょうしつ' (kyoushitsu) có nghĩa là phòng nào?", "Phòng học / Lớp học", "Phòng ăn", "Văn phòng", "Phòng họp"),
            q("VOCABULARY", "Từ 'しょくどう' (shokudou) có nghĩa là gì?", "Nhà ăn / Căng tin", "Lớp học", "Nhà vệ sinh", "Ký túc xá"),
            q("VOCABULARY", "Từ 'じむしょ' (jimusho) có nghĩa là gì?", "Văn phòng làm việc", "Phòng ngủ", "Bệnh viện", "Sân vận động"),
            q("VOCABULARY", "Từ 'かいぎしつ' (kaigishitsu) có nghĩa là gì?", "Phòng họp", "Phòng tiếp khách", "Nhà kho", "Phòng trà"),
            q("VOCABULARY", "Từ 'うけつけ' (uketsuke) tại các toà nhà có nghĩa là gì?", "Quầy lễ tân / Bàn tiếp tân", "Thang máy", "Cầu thang bộ", "Cửa thoát hiểm"),
            q("VOCABULARY", "Từ 'へや' (heya) có nghĩa là gì?", "Căn phòng", "Ngôi nhà", "Khu vườn", "Nhà bếp"),
            q("GRAMMAR", "Từ để hỏi giá tiền 'Bao nhiêu tiền?' trong tiếng Nhật là:", "いくらですか？", "いくつですか？", "なんじですか？", "なんにんですか？"),
            q("VOCABULARY", "Đơn vị tiền tệ chính thức của Nhật Bản là:", "円 (えん / en)", "USD", "VND", "Won"),
            q("GRAMMAR", "Dịch câu: 'Cái đồng hồ này 5000 Yên':", "この時計は ５０００円です。", "その時計は ５０００本です。", "あの時計は ５０００歳です。", "これ時計は ５０００円です。"),
        ]
    ))

    # 13. Minna Bài 04: Thời gian & Động từ chia thì
    lessons.append((
        "minna-lesson-04-time-and-verbs",
        "Thời Gian, Giờ Giấc & Chia Thì Động Từ (ます・ました)",
        "Hỏi và trả lời giờ giấc, phút, cấu trúc thì hiện tại, tương lai và quá khứ của động từ tiếng Nhật.",
        [
            q("GRAMMAR", "Hậu tố chỉ 'giờ' trong tiếng Nhật là gì?", "〜時 (じ / ji)", "〜分 (ふん)", "〜日 (にち)", "〜年 (ねん)"),
            q("GRAMMAR", "Hậu tố chỉ 'phút' trong tiếng Nhật là gì?", "〜分 (ふん / ぷん)", "〜時 (じ)", "〜秒 (びょう)", "〜月 (がつ)"),
            q("SPECIAL_SOUND", "Cách đọc đặc biệt của '4 giờ' là gì?", "よじ (yoji)", "よんじ", "しじ", "よっじ"),
            q("SPECIAL_SOUND", "Cách đọc đặc biệt của '9 giờ' là gì?", "くじ (kuji)", "きゅうじ", "くうじ", "ここのじ"),
            q("SPECIAL_SOUND", "Cách đọc của '7 giờ' là gì?", "しちじ (shichiji)", "ななじ", "なな時", "しちゅうじ"),
            q("GRAMMAR", "Từ để hỏi 'Mấy giờ?' là:", "何時 (なんじ / nanji)", "何分 (なんぷん)", "何日 (なんにち)", "何曜日 (なんようび)"),
            q("GRAMMAR", "Đuôi khẳng định thì hiện tại/tương lai của động từ lịch sự là:", "〜ます (masu)", "〜ました", "〜ません", "〜ませんでした"),
            q("GRAMMAR", "Đuôi phủ định thì hiện tại/tương lai của động từ lịch sự là:", "〜ません (masen)", "〜ます", "〜ました", "〜ませんでした"),
            q("GRAMMAR", "Đuôi khẳng định thì QUÁ KHỨ (đã làm) của động từ là:", "〜ました (mashita)", "〜ます", "〜ません", "〜ませんでした"),
            q("GRAMMAR", "Đuôi phủ định thì QUÁ KHỨ (đã không làm) của động từ là:", "〜ませんでした (masendeshita)", "〜ません", "〜ました", "〜ない"),
            q("VOCABULARY", "Từ 'おきます' (okimasu) có nghĩa là gì?", "Thức dậy", "Đi ngủ", "Làm việc", "Nghỉ ngơi"),
            q("VOCABULARY", "Từ 'ねます' (nemasu) có nghĩa là gì?", "Đi ngủ", "Thức dậy", "Ăn cơm", "Tắm"),
            q("VOCABULARY", "Từ 'はたらきます' (hatarakimasu) có nghĩa là gì?", "Làm việc", "Học tập", "Nghỉ ngơi", "Đi chơi"),
            q("VOCABULARY", "Từ 'べんきょうします' (benkyoushimasu) có nghĩa là gì?", "Học tập / Học bài", "Tập thể dục", "Dọn dẹp", "Nấu ăn"),
            q("GRAMMAR", "Trợ từ chỉ mốc thời gian cụ thể có con số (VD: thức dậy VÀO LÚC 6 giờ) là:", "に (ni)", "で (de)", "を (wo)", "へ (he)"),
        ]
    ))

    # 14. Minna Bài 04 Part 2: Ngày trong tuần & Trợ từ Kara / Made
    lessons.append((
        "minna-lesson-04-weekdays-kara-made",
        "Thứ Trong Tuần & Cặp Trợ Từ [から] ~ [まで]",
        "Học 7 ngày trong tuần, các mốc thời gian hôm qua/hôm nay/ngày mai và biểu thị khoảng thời gian.",
        [
            q("VOCABULARY", "Thứ Hai trong tiếng Nhật là gì?", "月曜日 (げつようび / getsuyoubi)", "火曜日", "水曜日", "木曜日"),
            q("VOCABULARY", "Thứ Ba gắn liền với nguyên tố 'Lửa' (Hỏa) là:", "火曜日 (かようび / kayoubi)", "水曜日", "金曜日", "土曜日"),
            q("VOCABULARY", "Thứ Tư gắn liền với nguyên tố 'Nước' (Thủy) là:", "水曜日 (すいようび / suiyoubi)", "木曜日", "火曜日", "日曜日"),
            q("VOCABULARY", "Thứ Năm gắn liền với nguyên tố 'Cây' (Mộc) là:", "木曜日 (もくようび / mokuyoubi)", "金曜日", "土曜日", "月曜日"),
            q("VOCABULARY", "Thứ Sáu gắn liền với nguyên tố 'Vàng/Kim loại' (Kim) là:", "金曜日 (きんようび / kinyoubi)", "土曜日", "日曜日", "水曜日"),
            q("VOCABULARY", "Thứ Bảy gắn liền với nguyên tố 'Đất' (Thổ) là:", "土曜日 (どようび / doyoubi)", "日曜日", "月曜日", "火曜日"),
            q("VOCABULARY", "Chủ Nhật gắn liền với 'Mặt trời' (Nhật) là:", "日曜日 (にちようび / nichiyoubi)", "月曜日", "火曜日", "水曜日"),
            q("VOCABULARY", "Từ 'きのう' (kinou) có nghĩa là ngày nào?", "Hôm qua", "Hôm nay", "Ngày mai", "Ngày kia"),
            q("VOCABULARY", "Từ 'きょう' (kyou) có nghĩa là ngày nào?", "Hôm nay", "Hôm qua", "Ngày mai", "Mỗi ngày"),
            q("VOCABULARY", "Từ 'あした' (ashita) có nghĩa là ngày nào?", "Ngày mai", "Hôm qua", "Hôm nay", "Tuần sau"),
            q("GRAMMAR", "Cặp trợ từ '〜から 〜まで' có nghĩa là gì?", "Từ ~ Đến ~", "Trước ~ Sau ~", "Nếu ~ Thì ~", "Vì ~ Nên ~"),
            q("GRAMMAR", "Dịch câu: 'Ngân hàng làm việc từ 9 giờ đến 3 giờ':", "銀行は ９時から ３時までです。", "銀行は ９時まで ３時からです。", "銀行は ９時に ３時へです。", "銀行は ９時で ３時をです。"),
            q("GRAMMAR", "Trợ từ 'と' khi nối hai danh từ (Tanaka-san to Yamada-san) có nghĩa là:", "Và / Với", "Hoặc là", "Nhưng", "Vì"),
            q("VOCABULARY", "Từ 'まいあさ' (maiasa) có nghĩa là gì?", "Mỗi sáng", "Mỗi tối", "Mỗi ngày", "Mỗi tuần"),
            q("VOCABULARY", "Từ 'たいへんですね' (taihen desu ne) dùng để biểu lộ cảm xúc gì?", "Vất vả / Khổ cực quá nhỉ (thấu hiểu, đồng cảm)", "Vui vẻ quá", "Dễ dàng quá", "Tuyệt vời quá"),
        ]
    ))

    # 15. Minna Bài 05: Di chuyển & Đi lại
    lessons.append((
        "minna-lesson-05-movement-verbs",
        "Di Chuyển & Đi Lại (行きます・来ます・帰ります)",
        "Các động từ chuyển động chỉ hướng, trợ từ へ chỉ phương hướng và trợ từ で chỉ phương tiện.",
        [
            q("VOCABULARY", "Động từ 'いきます' (ikimasu) có nghĩa là gì?", "Đi (rời xa vị trí nói)", "Đến", "Về", "Chạy"),
            q("VOCABULARY", "Động từ 'きます' (kimasu) có nghĩa là gì?", "Đến (tiến về phía người nói)", "Đi", "Về", "Đi bộ"),
            q("VOCABULARY", "Động từ 'かえります' (kaerimasu) có nghĩa là gì?", "Trở về (nhà, quê hương, đất nước)", "Đi", "Đến", "Ra ngoài"),
            q("GRAMMAR", "Trợ từ đặt sau danh từ địa điểm đích đến của hành động di chuyển là:", "へ (phát âm là /e/) hoặc に (ni)", "を", "で", "が"),
            q("GRAMMAR", "Dịch câu: 'Tôi đi đến trường học':", "私は 学校へ 行きます。", "私は 学校で 行きます。", "私は 学校を行きます。", "私は 学校に行きますではない。"),
            q("GRAMMAR", "Trợ từ biểu thị phương tiện giao thông (đi BẰNG xe buýt) là:", "で (de)", "に", "へ", "を"),
            q("GRAMMAR", "Khi 'đi bộ' (あるいて), ta có dùng trợ từ 'で' không?", "Không dùng trợ từ で (あるいて 行きます)", "Bắt buộc dùng で", "Dùng へ", "Dùng を"),
            q("GRAMMAR", "Dịch câu: 'Tôi đi tàu điện đến công ty':", "電車で 会社へ 行きます。", "電車へ 会社で 行きます。", "電車に 会社を行きます。", "電車を行きます会社。"),
            q("GRAMMAR", "Trợ từ 'と' trong 'Tomodachi to ikimasu' biểu thị ý nghĩa gì?", "Cùng VỚI bạn bè", "Bằng bạn bè", "Đến bạn bè", "Ở bạn bè"),
            q("GRAMMAR", "Nếu đi 'một mình', ta dùng cụm từ nào?", "一人で (ひとりで / hitori de)", "二人で", "みんなで", "ともだちと"),
            q("GRAMMAR", "Cấu trúc phủ định hoàn toàn: 'Không đi đâu cả':", "どこ［へ］も 行きません。", "どこへ 行きます。", "どこで 行きません。", "どこを行きません。"),
            q("VOCABULARY", "Từ 'ひこうき' (hikouki) có nghĩa là gì?", "Máy bay", "Tàu hỏa", "Tàu ngầm", "Khinh khí cầu"),
            q("VOCABULARY", "Từ 'じてんしゃ' (jitensha) có nghĩa là gì?", "Xe đạp", "Xe máy", "Ô tô", "Xe tải"),
            q("VOCABULARY", "Từ 'たんじょうび' (tanjoubi) có nghĩa là gì?", "Ngày sinh nhật", "Ngày cưới", "Ngày lễ", "Năm mới"),
            q("GRAMMAR", "Câu hỏi thời gian 'Khi nào?' trong tiếng Nhật là:", "いつ (itsu)", "どこ (doko)", "だれ (dare)", "なん (nan)"),
        ]
    ))

    # 16. Minna Bài 06: Tân ngữ Hành động & Nơi chốn
    lessons.append((
        "minna-lesson-06-actions-and-objects",
        "Tân Ngữ Hành Động & Nơi Chốn Thực Hiện (〜を / 〜で)",
        "Trợ từ を đánh dấu đối tượng tác động của tha động từ và trợ từ で chỉ nơi hành động diễn ra.",
        [
            q("GRAMMAR", "Trợ từ đứng sau đối tượng bị tác động bởi tha động từ (Ăn cơm, Uống trà) là:", "を (phát âm là /o/)", "は", "が", "で"),
            q("GRAMMAR", "Dịch câu: 'Tôi ăn bánh mì':", "パンを 食べます。", "パンで 食べます。", "パンに 食べます。", "パンは 食べますではない。"),
            q("GRAMMAR", "Dịch câu: 'Tôi uống nước quả / nước trái cây':", "ジュースを 飲みます。", "ジュースで 飲みます。", "ジュースを食べます。", "ジュースが行きます。"),
            q("GRAMMAR", "Phân biệt trợ từ chỉ nơi chốn: Nơi DIỄN RA HÀNH ĐỘNG dùng trợ từ gì?", "で (de)", "に (ni)", "へ (he)", "を (wo)"),
            q("GRAMMAR", "Dịch câu: 'Tôi đọc sách TẠI thư viện':", "図書館で 本を 読みます。", "図書館に 本を 読みます。", "図書館へ 本を 読みます。", "図書館の本を 読みます。"),
            q("VOCABULARY", "Từ 'ごはん' (gohan) có nghĩa là gì?", "Cơm / Bữa ăn", "Bánh mì", "Trái cây", "Thịt"),
            q("VOCABULARY", "Từ 'あさごはん' (asagohan) có nghĩa là gì?", "Bữa ăn sáng", "Bữa trưa", "Bữa tối", "Bữa ăn nhẹ"),
            q("VOCABULARY", "Từ 'ひるごはん' (hirugohan) có nghĩa là gì?", "Bữa ăn trưa", "Bữa sáng", "Bữa tối", "Ăn khuya"),
            q("VOCABULARY", "Từ 'ばんごはん' (bangohan) có nghĩa là gì?", "Bữa ăn tối", "Bữa sáng", "Bữa trưa", "Tráng miệng"),
            q("VOCABULARY", "Động từ 'かいます' (kaimasu) có nghĩa là gì?", "Mua hàng", "Bán hàng", "Xem hàng", "Đổi hàng"),
            q("VOCABULARY", "Động từ 'みます' (mimasu) có nghĩa là gì?", "Xem / Nhìn", "Nghe", "Nói", "Đọc"),
            q("VOCABULARY", "Động từ 'ききます' (kikimasu) có nghĩa là gì?", "Nghe", "Nhìn", "Ăn", "Ngửi"),
            q("GRAMMAR", "Từ để hỏi 'Bạn làm cái gì?' là:", "何を しますか？ (nani wo shimasu ka?)", "どこを しますか？", "だれを しますか？", "いつを しますか？"),
            q("GRAMMAR", "Để phủ định hoàn toàn: 'Tôi chẳng ăn gì cả':", "何も 食べません (nani mo tabemasen)", "何を 食べます", "何で 食べません", "何か 食べます"),
            q("VOCABULARY", "Từ 'みせ' (mise) có nghĩa là gì?", "Cửa hàng / Tiệm", "Ngôi nhà", "Công ty", "Bệnh viện"),
        ]
    ))

    # 17. Minna Bài 06 Part 2: Rủ rê & Mời gọi
    lessons.append((
        "minna-lesson-06-invitations",
        "Lời Mời Lịch Sự & Rủ Rê Đồng Thuận (〜ませんか / 〜ましょう)",
        "Các mẫu câu giao tiếp tự nhiên khi rủ bạn bè đi ăn, uống cà phê hay cùng làm việc gì.",
        [
            q("GRAMMAR", "Cấu trúc dùng để RỦ RÊ/MỜI MỌC ai đó làm gì một cách lịch sự là:", "Động từ bỏ ます + ませんか", "Động từ + ましょう", "Động từ + ますか", "Động từ + ません"),
            q("GRAMMAR", "Cấu trúc biểu thị sự ĐỒNG Ý hoặc CHỦ ĐỘNG ĐỀ NGHỊ 'Cùng làm... nhé!' là:", "Động từ bỏ ます + ましょう", "Động từ + ませんか", "Động từ + ます", "Động từ + たい"),
            q("GRAMMAR", "Khi bạn được hỏi: 'いっしょに お茶を 飲みませんか？', nếu đồng ý bạn sẽ đáp:", "ええ、飲みましょう！", "いいえ、飲みません。", "いいえ、だめです。", "ええ、飲みませんでした。"),
            q("GRAMMAR", "Từ 'いっしょに' (isshoni) đặt trước động từ có nghĩa là gì?", "Cùng nhau", "Một mình", "Trước tiên", "Từ từ"),
            q("GRAMMAR", "Khi muốn từ chối lời mời một cách khéo léo và tế nhị kiểu người Nhật, người ta thường nói:", "ちょっと… (chotto... kèm vẻ mặt ái ngại)", "だめです！", "いやです！", "きらいです！"),
            q("VOCABULARY", "Động từ 'やすみます' (yasumimasu) có nghĩa là gì?", "Nghỉ ngơi / Nghỉ học, nghỉ làm", "Làm việc", "Đi chơi", "Ngủ say"),
            q("VOCABULARY", "Động từ 'あいます' (aimasu) đi với trợ từ に (VD: ともだちに あいます) nghĩa là gì?", "Gặp gỡ bạn bè", "Đánh bạn bè", "Nhớ bạn bè", "Hỏi bạn bè"),
            q("VOCABULARY", "Từ 'こうえん' (kouen) có nghĩa là nơi nào?", "Công viên", "Sân bay", "Bến xe", "Bãi biển"),
            q("VOCABULARY", "Từ 'えいが' (eiga) có nghĩa là gì?", "Bộ phim điện ảnh", "Bài hát", "Bức tranh", "Vở kịch"),
            q("VOCABULARY", "Từ 'てがみ' (tegami) có nghĩa là gì?", "Bức thư tay", "Tờ báo", "Cuốn sách", "Tin nhắn"),
            q("VOCABULARY", "Từ 'しゃしん' (shashin) có nghĩa là gì?", "Bức ảnh chụp", "Bức tranh vẽ", "Tấm gương", "Tờ tiền"),
            q("GRAMMAR", "Cụm từ 'Chụp ảnh' trong tiếng Nhật là:", "写真を 撮ります (shashin wo torimasu)", "写真を 買います", "写真を 見ます", "写真を 書きます"),
            q("EXPRESSION", "Câu hỏi gợi mở: 'Trưa nay cùng đi ăn cơm không?':", "ひるごはんを いっしょに 食べませんか？", "ひるごはんを 食べましょうか？", "ひるごはんは 食べますか？", "ひるごはんが 食べません。"),
            q("EXPRESSION", "Khi đồng ý nhận lời đề nghị: 'Hay đấy nhỉ!':", "いいですね！ (Ii desu ne!)", "だめですね！", "たいへんですね！", "そうですね！"),
            q("VOCABULARY", "Từ 'ロビー' (robii) mượn từ tiếng Anh có nghĩa là gì?", "Đại sảnh / Tiền sảnh (Lobby)", "Hành lang", "Phòng ăn", "Ban công"),
        ]
    ))

    # 18. Minna Bài 07: Phương tiện, Công cụ & Tặng Nhận
    lessons.append((
        "minna-lesson-07-tools-and-giving",
        "Công Cụ, Phương Tiện & Hành Động Tặng - Nhận (あげます・もらいます)",
        "Biểu đạt cách thức làm việc bằng công cụ gì (bằng đũa, bằng tiếng Nhật) và quan hệ cho nhận.",
        [
            q("GRAMMAR", "Trợ từ biểu thị công cụ, phương tiện (Ăn bằng đũa, viết bằng bút chì) là:", "で (de)", "に", "を", "へ"),
            q("GRAMMAR", "Dịch câu: 'Tôi ăn cơm bằng đũa':", "はしで ごはんを 食べます。", "はしにごはんを 食べます。", "はしをごはんを 食べます。", "はしへごはんを 食べます。"),
            q("GRAMMAR", "Dịch câu: 'Tôi viết báo cáo bằng tiếng Nhật':", "日本語で レポートを 書きます。", "日本語に レポートを 書きます。", "日本語を レポートを 書きます。", "日本語へ レポートを 書きます。"),
            q("GRAMMAR", "Động từ 'あげます' (agemasu) có nghĩa là gì?", "Tặng / Cho (tôi tặng người khác)", "Nhận", "Mượn", "Vay"),
            q("GRAMMAR", "Động từ 'もらいます' (moraimasu) có nghĩa là gì?", "Nhận được (từ ai đó)", "Tặng", "Bán", "Cho đi"),
            q("GRAMMAR", "Trong mẫu câu tặng đồ: [Tôi tặng hoa cho mẹ], trợ từ đứng sau 'Mẹ' là gì?", "に (ni) - chỉ đối tượng tiếp nhận", "で", "を", "へ"),
            q("GRAMMAR", "Dịch câu: 'Tôi tặng hoa cho mẹ':", "私は 母に 花を あげます。", "私は 母で 花を あげます。", "私は 母を 花に あげます。", "私は 母から 花を あげます。"),
            q("GRAMMAR", "Dịch câu: 'Tôi nhận quà từ anh Tanaka':", "私は 田中さんに プレゼントを もらいました。", "私は 田中さんで プレゼントを もらいました。", "私は 田中さんを プレゼントを もらいました。", "私は 田中さんへ プレゼントを あげました。"),
            q("VOCABULARY", "Từ 'はさみ' (hasami) có nghĩa là gì?", "Cây kéo cắt giấy", "Cây dao", "Cái thước", "Cục tẩy"),
            q("VOCABULARY", "Từ 'かします' (kashimasu) có nghĩa là gì?", "Cho mượn / Cho vay", "Mượn", "Trả lại", "Mua"),
            q("VOCABULARY", "Từ 'かります' (karimasu) có nghĩa là gì?", "Đi mượn / Đi vay (từ ai)", "Cho mượn", "Mua", "Tặng"),
            q("VOCABULARY", "Từ 'おしえます' (oshiemasu) có nghĩa là gì?", "Dạy học / Chỉ bảo", "Học", "Hỏi", "Nói"),
            q("VOCABULARY", "Từ 'ならいます' (naraimasu) có nghĩa là gì?", "Học tập (từ thầy cô, người khác)", "Dạy", "Đọc", "Nghe"),
            q("GRAMMAR", "Phó từ 'もう' (mou) trong 'Mou tabemashita ka?' có nghĩa là:", "Đã... rồi", "Chưa", "Sắp", "Vẫn"),
            q("GRAMMAR", "Trả lời phủ định cho câu 'Mou nimotsu wo okurimashita ka?': 'Chưa, vẫn chưa gửi':", "いいえ、まだです。", "いいえ、もうです。", "はい、まだです。", "いいえ、でした。"),
        ]
    ))

    # 19. Minna Bài 08: Tính từ Đuôi い
    lessons.append((
        "minna-lesson-08-i-adjectives",
        "Tính Từ Đuôi い (Đặc Điểm, Phủ Định [〜くない] & Quá Khứ)",
        "Quy tắc chia thì tính từ đuôi i, cách bổ nghĩa trực tiếp cho danh từ và các cặp từ trái nghĩa.",
        [
            q("GRAMMAR", "Đặc điểm nhận dạng của Tính từ đuôi い là gì?", "Tận cùng kết thúc bằng ký tự âm 'い'", "Tận cùng là 'な'", "Tận cùng là 'だ'", "Tận cùng là 'ます'"),
            q("GRAMMAR", "Phủ định thì hiện tại của tính từ đuôi い: bỏ い thêm đuôi gì?", "〜くないです (kunai desu)", "〜じゃないです", "〜でした", "〜くなかったです"),
            q("GRAMMAR", "Dạng phủ định của 'たかい' (đắt/cao) là:", "たかくないです", "たかじゃないです", "たかвомないです", "たかいません"),
            q("GRAMMAR", "Tính từ đặc biệt 'いい' (tốt) khi chia phủ định sẽ biến thành gì?", "よくないです (yokunai desu)", "いくないです", "いいじゃないです", "よかったです"),
            q("GRAMMAR", "Quá khứ khẳng định của tính từ đuôi い: bỏ い thêm gì?", "〜かったです (katta desu)", "〜でした", "〜くなかったです", "〜ます"),
            q("GRAMMAR", "Quá khứ của 'あつい' (nóng) là 'Hôm qua đã rất nóng':", "きのうは あつかったです。", "きのうは あついでした。", "きのうは あつくないでした。", "きのうは あつかったではない。"),
            q("GRAMMAR", "Khi tính từ đuôi い bổ nghĩa trực tiếp cho danh từ đứng sau (VD: Ngọn núi cao):", "Giữ nguyên đuôi い + Danh từ (高い山)", "Thêm な vào giữa", "Thêm の vào giữa", "Bỏ い thêm さ"),
            q("VOCABULARY", "Từ trái nghĩa với 'おおきい' (to lớn) là gì?", "ちいさい (nhỏ bé)", "たかい", "ひくい", "あたらしい"),
            q("VOCABULARY", "Từ trái nghĩa với 'あたらしい' (mới) là gì?", "ふるい (cũ)", "しろい", "くろい", "わるい"),
            q("VOCABULARY", "Từ 'むずかしい' (muzukashii) có nghĩa là gì?", "Khó khăn / Khó", "Dễ dàng", "Thú vị", "Buồn chán"),
            q("VOCABULARY", "Từ 'やさしい' (yasashii) có nghĩa là gì?", "Dễ dãi / Dễ / Hiền từ", "Khó", "Nóng", "Lạnh"),
            q("VOCABULARY", "Từ 'おいしい' (oishii) có nghĩa là gì?", "Ngon miệng", "Dở tệ", "Đắng", "Cay"),
            q("VOCABULARY", "Từ 'いそがしい' (isogashii) có nghĩa là gì?", "Bận rộn", "Rảnh rỗi", "Vui vẻ", "Mệt mỏi"),
            q("GRAMMAR", "Phó từ chỉ mức độ 'とても' (totemo) có nghĩa là gì?", "Rất (khẳng định)", "Không lắm", "Hoàn toàn", "Một chút"),
            q("GRAMMAR", "Phó từ 'あまり' (amari) đi kèm đuôi phủ định có nghĩa là:", "Không... lắm (VD: あまり 寒くない)", "Rất", "Quá", "Cực kỳ"),
        ]
    ))

    # 20. Minna Bài 08-2 & 09: Tính từ Đuôi な & Sở thích, Năng lực
    lessons.append((
        "minna-lesson-08-09-na-adj-preferences",
        "Tính Từ Đuôi な & Sở Thích, Năng Lực (すき・上手・わかります)",
        "Cách chia tính từ đuôi na, trợ từ が đi kèm các từ chỉ cảm xúc, sở thích và năng lực cá nhân.",
        [
            q("GRAMMAR", "Khi Tính từ đuôi な đứng trực tiếp bổ nghĩa trước một Danh từ, ta phải làm gì?", "Thêm chữ 'な' vào giữa tính từ và danh từ", "Thêm 'い'", "Thêm 'の'", "Không cần thêm gì"),
            q("GRAMMAR", "Dịch cụm từ: 'Một thành phố yên tĩnh':", "しずかな まち (shizuka na machi)", "しずか まち", "しずかい まち", "しずかの まち"),
            q("GRAMMAR", "Dạng phủ định của tính từ đuôi な (như: không rảnh rỗi):", "ひまじゃありません / ではありません", "ひまくないです", "ひまないです", "ひまくありません"),
            q("GRAMMAR", "Dạng quá khứ khẳng định của tính từ đuôi な (Hôm qua đã rảnh rỗi):", "ひまでした (hima deshita)", "ひまかったです", "ひまだったです", "ひまあります"),
            q("GRAMMAR", "Các từ chỉ sở thích, ghét, giỏi, kém (すき・きらい・じょうず・へた) đi với trợ từ gì?", "が (ga)", "を", "で", "に"),
            q("GRAMMAR", "Dịch câu: 'Tôi thích món ăn Nhật Bản':", "私は 日本料理が 好きです。", "私は 日本料理を 好きです。", "私は 日本料理で 好きです。", "私は 日本料理に 好きです。"),
            q("GRAMMAR", "Dịch câu: 'Anh Miller rất giỏi tiếng Nhật':", "ミラーさんは 日本語が 上手です。", "ミラーさんは 日本語を 上手です。", "ミラーさんは 日本語で 上手です。", "ミラーさんは 日本語の上手です。"),
            q("GRAMMAR", "Khi ai đó khen bạn 'Nihongo ga jouzu desu ne', câu đáp khiêm tốn chuẩn mực là:", "いいえ、まだまだです。(Chưa đâu, tôi còn kém lắm)", "はい、とても上手です。", "そうです、知っています。", "どういたしまして。"),
            q("GRAMMAR", "Động từ 'わかります' (hiểu) và 'あります' (có) đi với trợ từ gì?", "が (ga)", "を", "で", "へ"),
            q("GRAMMAR", "Dịch câu: 'Tôi hiểu tiếng Anh một chút':", "英語が すこし わかります。", "英語を すこし わかります。", "英語で すこし わかります。", "英語に すこし わかります。"),
            q("VOCABULARY", "Từ 'どんな' (donna) dùng để hỏi cái gì?", "Như thế nào? / Loại nào? (bản chất, tính chất)", "Ở đâu?", "Bao nhiêu tiền?", "Khi nào?"),
            q("VOCABULARY", "Từ 'から' đứng ở cuối mệnh đề (V/A + から) mang ý nghĩa gì?", "Vì... nên... (chỉ lý do nguyên nhân)", "Từ mốc thời gian", "Đến tận", "Và"),
            q("VOCABULARY", "Từ 'どうして' (doushite) dùng để hỏi điều gì?", "Tại sao? / Vì sao?", "Bằng cách nào?", "Là ai?", "Bao nhiêu?"),
            q("VOCABULARY", "Từ 'しずか' (shizuka) có nghĩa là gì?", "Yên tĩnh / Thanh bình", "Ồn ào", "Đẹp đẽ", "Sạch sẽ"),
            q("VOCABULARY", "Từ 'にぎやか' (nigiyaka) có nghĩa là gì?", "Náo nhiệt / Nhộn nhịp / Sầm uất", "Vắng vẻ", "Buồn tẻ", "Tối tăm"),
        ]
    ))

    return lessons
