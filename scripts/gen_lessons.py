# -*- coding: utf-8 -*-
import os
import json

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_file = os.path.join(workspace_dir, "prisma", "seed-data", "lessons.ts")

# Helper to construct options
def make_opts(correct_text, wrong1, wrong2, wrong3):
    return [
        {"label": "A", "text": correct_text, "isCorrect": True, "order": 0},
        {"label": "B", "text": wrong1, "isCorrect": False, "order": 1},
        {"label": "C", "text": wrong2, "isCorrect": False, "order": 2},
        {"label": "D", "text": wrong3, "isCorrect": False, "order": 3},
    ]

# Construct 30 comprehensive lessons
lessons = [
    # --- UNIT 1: NHẬP MÔN & CHÀO HỎI ---
    {
        "slug": "hiragana-vowels",
        "title": "Hiragana 1: Hàng Nguyên Âm (あ・い・う・え・お)",
        "description": "Khởi đầu nền tảng tiếng Nhật với 5 nguyên âm cốt lõi: A, I, U, E, O kèm từ vựng ghép âm.",
        "level": "N5",
        "order": 0,
        "xpReward": 50,
        "exercises": [
            {"type": "KANA_RECOGNITION", "question": "Chữ cái nào sau đây là chữ 'a' (あ)?", "correctAnswer": "あ", "points": 10, "order": 0, "options": make_opts("あ", "い", "お", "え")},
            {"type": "KANA_TO_ROMAJI", "question": "Chữ 'い' được đọc là gì trong phiên âm Romaji?", "correctAnswer": "i", "points": 10, "order": 1, "options": make_opts("i", "e", "u", "o")},
            {"type": "WORD_BUILDING", "question": "Từ ghép 'あい' (ai) trong tiếng Nhật có nghĩa là gì?", "correctAnswer": "Tình yêu", "points": 10, "order": 2, "options": make_opts("Tình yêu", "Bầu trời", "Cái nhà", "Dòng sông")},
            {"type": "ROMAJI_TO_KANA", "question": "Chữ Hiragana tương ứng với âm 'e' là chữ nào?", "correctAnswer": "え", "points": 10, "order": 3, "options": make_opts("え", "う", "あ", "い")},
            {"type": "VOCABULARY", "question": "Từ 'いえ' (ie) trong tiếng Nhật có nghĩa là gì?", "correctAnswer": "Ngôi nhà", "points": 10, "order": 4, "options": make_opts("Ngôi nhà", "Con mèo", "Cái cây", "Quyển sách")},
            {"type": "WORD_BUILDING", "question": "Từ 'あお' (ao) có nghĩa là màu gì?", "correctAnswer": "Màu xanh da trời / xanh lam", "points": 10, "order": 5, "options": make_opts("Màu xanh da trời / xanh lam", "Màu đỏ", "Màu vàng", "Màu đen")},
        ]
    },
    {
        "slug": "hiragana-ka-sa",
        "title": "Hiragana 2: Hàng Ka & Hàng Sa (か・さ)",
        "description": "Mở rộng bảng chữ với hàng Ka (か・き・く・け・こ) và hàng Sa (さ・し・す・せ・そ).",
        "level": "N5",
        "order": 1,
        "xpReward": 60,
        "exercises": [
            {"type": "KANA_RECOGNITION", "question": "Ký tự 'か' có cách đọc phiên âm Romaji là gì?", "correctAnswer": "ka", "points": 10, "order": 0, "options": make_opts("ka", "ki", "ku", "ko")},
            {"type": "SPECIAL_SOUND", "question": "Trong hàng Sa, chữ nào có phát âm đặc biệt là /ɕi/ ('shi') chứ không phải 'si'?", "correctAnswer": "し", "points": 10, "order": 1, "options": make_opts("し", "さ", "す", "せ")},
            {"type": "VOCABULARY", "question": "Từ ghép 'すし' (sushi) được cấu tạo từ hai ký tự nào?", "correctAnswer": "す + し", "points": 10, "order": 2, "options": make_opts("す + し", "さ + し", "そ + し", "す + き")},
            {"type": "VOCABULARY", "question": "Từ 'かさ' (kasa) trong tiếng Nhật có nghĩa là gì?", "correctAnswer": "Cây dù / Cái ô", "points": 10, "order": 3, "options": make_opts("Cây dù / Cái ô", "Cái nón", "Đôi giày", "Cái áo")},
            {"type": "VOCABULARY", "question": "Từ 'あさ' (asa) trong tiếng Nhật có nghĩa là buổi nào?", "correctAnswer": "Buổi sáng", "points": 10, "order": 4, "options": make_opts("Buổi sáng", "Buổi tối", "Buổi trưa", "Nửa đêm")},
            {"type": "KANA_RECOGNITION", "question": "Chữ 'き' (ki) khi thêm dấu Ten-ten (゛) sẽ đọc là gì?", "correctAnswer": "gi (ぎ)", "points": 10, "order": 5, "options": make_opts("gi (ぎ)", "za (ざ)", "bi (び)", "pi (ぴ)")},
        ]
    },
    {
        "slug": "hiragana-ta-na",
        "title": "Hiragana 3: Hàng Ta, Hàng Na & Hàng Ha",
        "description": "Học các ký tự た・ち・つ・て・と, な・に・ぬ・ね・の và は・ひ・ふ・へ・ほ kèm âm đặc biệt.",
        "level": "N5",
        "order": 2,
        "xpReward": 60,
        "exercises": [
            {"type": "SPECIAL_SOUND", "question": "Trong hàng Ta, hai chữ cái có phát âm biến âm đặc biệt là gì?", "correctAnswer": "chi (ち) và tsu (つ)", "points": 10, "order": 0, "options": make_opts("chi (ち) và tsu (つ)", "ta (た) và te (て)", "ti và tu", "to và ta")},
            {"type": "VOCABULARY", "question": "Từ 'ねこ' (neko) trong tiếng Nhật có nghĩa là gì?", "correctAnswer": "Con mèo", "points": 10, "order": 1, "options": make_opts("Con mèo", "Con chó", "Con cá", "Con chim")},
            {"type": "VOCABULARY", "question": "Từ 'はな' (hana) có nghĩa là gì?", "correctAnswer": "Bông hoa / Cái mũi", "points": 10, "order": 2, "options": make_opts("Bông hoa / Cái mũi", "Cái miệng", "Ngôi sao", "Cơn mưa")},
            {"type": "KANA_RECOGNITION", "question": "Chữ Hiragana tương ứng với âm 'fu' là gì?", "correctAnswer": "ふ", "points": 10, "order": 3, "options": make_opts("ふ", "は", "ひ", "ほ")},
            {"type": "VOCABULARY", "question": "Từ 'ひと' (hito) có nghĩa là gì?", "correctAnswer": "Con người / Người", "points": 10, "order": 4, "options": make_opts("Con người / Người", "Đất nước", "Thành phố", "Ngôi trường")},
            {"type": "SPECIAL_SOUND", "question": "Trong tiếng Nhật, chữ 'は' khi đóng vai trò trợ từ chủ đề được phát âm là gì?", "correctAnswer": "/wa/", "points": 10, "order": 5, "options": make_opts("/wa/", "/ha/", "/fa/", "/ba/")},
        ]
    },
    {
        "slug": "hiragana-ma-wa",
        "title": "Hiragana 4: Hàng Ma, Ya, Ra, Wa & Âm N (ん)",
        "description": "Hoàn thiện trọn vẹn 46 ký tự Hiragana cơ bản với các hàng cuối cùng và âm mũi 'n'.",
        "level": "N5",
        "order": 3,
        "xpReward": 70,
        "exercises": [
            {"type": "VOCABULARY", "question": "Từ 'さくら' (sakura) gồm các ký tự nào ghép lại?", "correctAnswer": "さ + く + ら", "points": 10, "order": 0, "options": make_opts("さ + く + ら", "し + く + ら", "す + け + ろ", "さ + こ + り")},
            {"type": "VOCABULARY", "question": "Từ 'やま' (yama) có nghĩa là gì?", "correctAnswer": "Núi, Ngọn núi", "points": 10, "order": 1, "options": make_opts("Núi, Ngọn núi", "Sông ngòi", "Biển cả", "Cánh đồng")},
            {"type": "KANA_RECOGNITION", "question": "Ký tự duy nhất chỉ có phụ âm và không đi kèm nguyên âm trong tiếng Nhật là gì?", "correctAnswer": "ん (n)", "points": 10, "order": 2, "options": make_opts("ん (n)", "わ (wa)", "を (wo)", "や (ya)")},
            {"type": "VOCABULARY", "question": "Từ 'にほん' (nihon) có nghĩa là gì?", "correctAnswer": "Nhật Bản", "points": 10, "order": 3, "options": make_opts("Nhật Bản", "Việt Nam", "Hàn Quốc", "Trung Quốc")},
            {"type": "VOCABULARY", "question": "Từ 'くるま' (kuruma) trong tiếng Nhật có nghĩa là gì?", "correctAnswer": "Xe hơi / Xe ô tô", "points": 10, "order": 4, "options": make_opts("Xe hơi / Xe ô tô", "Xe đạp", "Tàu điện", "Máy bay")},
            {"type": "WORD_BUILDING", "question": "Từ 'かわ' (kawa) có nghĩa là gì?", "correctAnswer": "Dòng sông", "points": 10, "order": 5, "options": make_opts("Dòng sông", "Ngọn núi", "Bầu trời", "Khu rừng")},
        ]
    },
    {
        "slug": "greetings-intro",
        "title": "Minna Bài 01: Câu Chào Hỏi & Tự Giới Thiệu (自己紹介)",
        "description": "Làm chủ cấu trúc [A は B です] và mẫu câu tự giới thiệu bản thân chuẩn phong cách Nhật.",
        "level": "N5",
        "order": 4,
        "xpReward": 70,
        "exercises": [
            {"type": "EXPRESSION", "question": "Câu chào buổi sáng lịch sự bằng tiếng Nhật là gì?", "correctAnswer": "おはようございます", "points": 10, "order": 0, "options": make_opts("おはようございます", "こんにちは", "こんばんは", "さようなら")},
            {"type": "GRAMMAR", "question": "Để nói 'Tôi là Nam' trong tiếng Nhật, câu chuẩn ngữ pháp là gì?", "correctAnswer": "わたしは ナムです。", "points": 10, "order": 1, "options": make_opts("わたしは ナムです。", "わたしが ナムです。", "わたしを ナムです。", "わたしに ナムです。")},
            {"type": "EXPRESSION", "question": "Câu nói lịch sự khi gặp ai đó lần đầu tiên là gì?", "correctAnswer": "はじめまして、どうぞよろしくおねがいします。", "points": 10, "order": 2, "options": make_opts("はじめまして、どうぞよろしくおねがいします。", "いただきます。", "ごちそうさまでした。", "すみません。")},
            {"type": "GRAMMAR", "question": "Trợ từ nào mang ý nghĩa 'cũng' (Tôi cũng là sinh viên)?", "correctAnswer": "も (mo)", "points": 10, "order": 3, "options": make_opts("も (mo)", "は (wa)", "の (no)", "か (ka)")},
            {"type": "GRAMMAR", "question": "Phủ định lịch sự của '学生です' (Là học sinh) là gì?", "correctAnswer": "学生ではありません / 学生じゃありません", "points": 10, "order": 4, "options": make_opts("学生ではありません / 学生じゃありません", "学生でした", "学生ですない", "学生ません")},
            {"type": "GRAMMAR", "question": "Để nối hai danh từ biểu thị quyền sở hữu (Sách của tôi), ta dùng trợ từ nào?", "correctAnswer": "の (わたしの本)", "points": 10, "order": 5, "options": make_opts("の (わたしの本)", "は (わたしは本)", "を (わたしを本)", "と (わたしと本)")},
        ]
    },

    # --- UNIT 2: CUỘC SỐNG THƯỜNG NGÀY ---
    {
        "slug": "kore-sore-are",
        "title": "Minna Bài 02: Đồ Vật Quanh Ta & Bộ Ba これ・それ・あれ",
        "description": "Phân biệt chính xác đại từ chỉ vật gần mình, gần người nghe và ở xa cả hai người.",
        "level": "N5",
        "order": 5,
        "xpReward": 70,
        "exercises": [
            {"type": "GRAMMAR", "question": "Vật ở gần người nói thì dùng đại từ chỉ định nào?", "correctAnswer": "これ (kore)", "points": 10, "order": 0, "options": make_opts("これ (kore)", "それ (sore)", "あれ (are)", "どれ (dore)")},
            {"type": "GRAMMAR", "question": "Vật ở xa cả người nói lẫn người nghe thì dùng đại từ nào?", "correctAnswer": "あれ (are)", "points": 10, "order": 1, "options": make_opts("あれ (are)", "これ (kore)", "それ (sore)", "どれ (dore)")},
            {"type": "GRAMMAR", "question": "Khi muốn bổ nghĩa trực tiếp cho danh từ 'cuốn sách này', ta phải dùng:", "correctAnswer": "この ほん (kono hon)", "points": 10, "order": 2, "options": make_opts("この ほん (kono hon)", "これ ほん", "その ほん", "あれ ほん")},
            {"type": "VOCABULARY", "question": "Từ 'じしょ' (jisho) trong tiếng Nhật có nghĩa là gì?", "correctAnswer": "Từ điển", "points": 10, "order": 3, "options": make_opts("Từ điển", "Quyển vở", "Cây bút", "Cái bàn")},
            {"type": "GRAMMAR", "question": "Câu hỏi 'Cái này là cái gì?' bằng tiếng Nhật là:", "correctAnswer": "これは 何ですか？ (Kore wa nan desu ka?)", "points": 10, "order": 4, "options": make_opts("これは 何ですか？ (Kore wa nan desu ka?)", "これは だれですか？", "これは どこですか？", "これは いくらですか？")},
            {"type": "VOCABULARY", "question": "Từ 'とけい' (tokei) có nghĩa là gì?", "correctAnswer": "Đồng hồ", "points": 10, "order": 5, "options": make_opts("Đồng hồ", "Điện thoại", "Cái ví", "Chiếc chìa khóa")},
        ]
    },
    {
        "slug": "koko-soko-places",
        "title": "Minna Bài 03: Vị Trí, Địa Điểm & Hỏi Giá Cả (いくら)",
        "description": "Làm chủ ここ・そこ・あそこ, cách hỏi địa điểm công cộng và cấu trúc hỏi giá tiền.",
        "level": "N5",
        "order": 6,
        "xpReward": 70,
        "exercises": [
            {"type": "GRAMMAR", "question": "Câu hỏi 'Nhà vệ sinh ở đâu ạ?' trong tiếng Nhật là gì?", "correctAnswer": "お手洗いは どこですか？ (Otearai wa doko desu ka?)", "points": 10, "order": 0, "options": make_opts("お手洗いは どこですか？ (Otearai wa doko desu ka?)", "お手洗いは だれですか？", "お手洗いは 何ですか？", "お手洗いは いくらですか？")},
            {"type": "GRAMMAR", "question": "Từ hỏi giá tiền 'Bao nhiêu tiền?' trong tiếng Nhật là:", "correctAnswer": "いくら (ikura)", "points": 10, "order": 1, "options": make_opts("いくら (ikura)", "どこ (doko)", "だれ (dare)", "いつ (itsu)")},
            {"type": "VOCABULARY", "question": "Từ 'ぎんこう' (ginkou) có nghĩa là gì?", "correctAnswer": "Ngân hàng", "points": 10, "order": 2, "options": make_opts("Ngân hàng", "Bệnh viện", "Nhà ga", "Bưu điện")},
            {"type": "GRAMMAR", "question": "Dạng lịch sự của 'ここ' (ở đây) trong giao tiếp là gì?", "correctAnswer": "こちら (kochira)", "points": 10, "order": 3, "options": make_opts("こちら (kochira)", "そちら (sochira)", "あちら (achira)", "どちら (dochira)")},
            {"type": "VOCABULARY", "question": "Từ 'きょうしつ' (kyoushitsu) có nghĩa là gì?", "correctAnswer": "Phòng học / Lớp học", "points": 10, "order": 4, "options": make_opts("Phòng học / Lớp học", "Văn phòng", "Phòng ăn", "Hội trường")},
            {"type": "GRAMMAR", "question": "Số '1,500 Yên' trong tiếng Nhật đọc là gì?", "correctAnswer": "せんごひゃくえん (sen gohyaku en)", "points": 10, "order": 5, "options": make_opts("せんごひゃくえん (sen gohyaku en)", "いちごひゃくえん", "まんごひゃくえん", "じゅうごひゃくえん")},
        ]
    },
    {
        "slug": "time-numbers-routine",
        "title": "Minna Bài 04: Thời Gian, Ngày Trong Tuần & Giờ Giấc",
        "description": "Nắm vững cách đọc giờ phút, các thứ trong tuần và mẫu câu hỏi 'Bây giờ là mấy giờ?'.",
        "level": "N5",
        "order": 7,
        "xpReward": 70,
        "exercises": [
            {"type": "SPECIAL_SOUND", "question": "'4 giờ' và '9 giờ' trong tiếng Nhật được đọc chuẩn là gì?", "correctAnswer": "よじ (4 giờ) và くじ (9 giờ)", "points": 10, "order": 0, "options": make_opts("よじ (4 giờ) và くじ (9 giờ)", "よんじ và きゅうじ", "しじ và くじ", "よじ và きゅうじ")},
            {"type": "VOCABULARY", "question": "'Hôm nay', 'Ngày mai', 'Hôm qua' lần lượt là:", "correctAnswer": "きょう (hôm nay), あした (ngày mai), きのう (hôm qua)", "points": 10, "order": 1, "options": make_opts("きょう (hôm nay), あした (ngày mai), きのう (hôm qua)", "あした, きのう, きょう", "きのう, きょう, あした", "まいあさ, まいばん, まいにち")},
            {"type": "GRAMMAR", "question": "Cặp trợ từ biểu thị 'Từ ... đến ...' trong tiếng Nhật là gì?", "correctAnswer": "から 〜 まで (kara ~ made)", "points": 10, "order": 2, "options": make_opts("から 〜 まで (kara ~ made)", "に 〜 へ", "で 〜 と", "は 〜 が")},
            {"type": "VOCABULARY", "question": "Thứ hai trong tiếng Nhật là gì?", "correctAnswer": "月曜日 (げつようび)", "points": 10, "order": 3, "options": make_opts("月曜日 (げつようび)", "火曜日 (かようび)", "水曜日 (すいようび)", "日曜日 (にちようび)")},
            {"type": "GRAMMAR", "question": "Quá khứ khẳng định của động từ đuôi '〜ます' là gì?", "correctAnswer": "〜ました (〜mashita)", "points": 10, "order": 4, "options": make_opts("〜ました (〜mashita)", "〜ません", "〜ませんでした", "〜ている")},
            {"type": "GRAMMAR", "question": "Trợ từ nào đi sau mốc thời gian cụ thể (Ví dụ: thức dậy LÚC 6 giờ)?", "correctAnswer": "に (6時に起きます)", "points": 10, "order": 5, "options": make_opts("に (6時に起きます)", "で (6時でおきます)", "を (6時をおきます)", "へ (6時へおきます)")},
        ]
    },
    {
        "slug": "daily-verbs-motion",
        "title": "Minna Bài 05: Động Từ Di Chuyển & Đi Bằng Phương Tiện Gì (へ・で)",
        "description": "Làm chủ 行きます (đi), 来ます (đến), 帰ります (về) kèm trợ từ chỉ hướng へ và phương tiện で.",
        "level": "N5",
        "order": 8,
        "xpReward": 70,
        "exercises": [
            {"type": "GRAMMAR", "question": "Trợ từ nào đánh dấu phương hướng di chuyển (Đi ĐẾN Nhật Bản)?", "correctAnswer": "へ (phát âm là /e/)", "points": 10, "order": 0, "options": make_opts("へ (phát âm là /e/)", "を", "で", "から")},
            {"type": "GRAMMAR", "question": "Khi muốn nói 'Tôi đi đến trường BẰNG xe buýt', ta dùng trợ từ nào?", "correctAnswer": "で (バスで行きます)", "points": 10, "order": 1, "options": make_opts("で (バスで行きます)", "に", "を", "へ")},
            {"type": "SPECIAL_SOUND", "question": "Khi 'Đi bộ đến trường', ta dùng từ nào mà KHÔNG đi với trợ từ で?", "correctAnswer": "あるいて (歩いて行きます)", "points": 10, "order": 2, "options": make_opts("あるいて (歩いて行きます)", "じてんしゃで", "くるまで", "でんしゃで")},
            {"type": "VOCABULARY", "question": "Từ 'しんかんせん' (shinkansen) có nghĩa là gì?", "correctAnswer": "Tàu cao tốc Nhật Bản", "points": 10, "order": 3, "options": make_opts("Tàu cao tốc Nhật Bản", "Tàu điện ngầm", "Xe buýt nhanh", "Máy bay phản lực")},
            {"type": "GRAMMAR", "question": "Đi đâu CÙNG VỚI AI ĐÓ thì dùng trợ từ nào (Đi cùng bạn bè)?", "correctAnswer": "と (友達と行きます)", "points": 10, "order": 4, "options": make_opts("と (友達と行きます)", "で", "を", "に")},
            {"type": "VOCABULARY", "question": "Từ 'らいしゅう' (raishuu) có nghĩa là thời gian nào?", "correctAnswer": "Tuần sau", "points": 10, "order": 5, "options": make_opts("Tuần sau", "Tuần này", "Tuần trước", "Hàng tuần")},
        ]
    },
    {
        "slug": "object-particles-wo-de",
        "title": "Minna Bài 06: Tân Ngữ Trực Tiếp & Nơi Diễn Ra Hành Động (を・で)",
        "description": "Làm chủ trợ từ を (ăn gì, uống gì) và trợ từ で (ở đâu) kèm lời mời rủ rê 〜ませんか.",
        "level": "N5",
        "order": 9,
        "xpReward": 70,
        "exercises": [
            {"type": "GRAMMAR", "question": "Trợ từ nào đánh dấu tân ngữ trực tiếp (Ăn cơm, uống nước)?", "correctAnswer": "を (wo/o)", "points": 10, "order": 0, "options": make_opts("を (wo/o)", "は", "に", "で")},
            {"type": "GRAMMAR", "question": "Để nói 'Tôi đọc sách Ở thư viện', trợ từ đi sau 'thư viện' là gì?", "correctAnswer": "で (図書館で本を読みます)", "points": 10, "order": 1, "options": make_opts("で (図書館で本を読みます)", "に", "を", "へ")},
            {"type": "GRAMMAR", "question": "Mẫu câu dùng để rủ rê lịch sự 'Cùng đi ăn với tôi không?' là:", "correctAnswer": "いっしょに 食べませんか？", "points": 10, "order": 2, "options": make_opts("いっしょに 食べませんか？", "いっしょに 食べましたか？", "いっしょに 食べるですか？", "いっしょに 食べないですか？")},
            {"type": "VOCABULARY", "question": "Từ 'おちゃ' (ocha) và 'みず' (mizu) lần lượt là:", "correctAnswer": "Trà và Nước", "points": 10, "order": 3, "options": make_opts("Trà và Nước", "Nước và Cà phê", "Rượu và Trà", "Nước ép và Sữa")},
            {"type": "GRAMMAR", "question": "Để đáp lại lời rủ rê 'Được đấy, cùng làm thôi!', ta nói:", "correctAnswer": "ええ、〜ましょう！", "points": 10, "order": 4, "options": make_opts("ええ、〜ましょう！", "いいえ、〜ません", "はい、〜ました", "ええ、〜です")},
            {"type": "VOCABULARY", "question": "Từ 'えいが' (eiga) trong tiếng Nhật có nghĩa là gì?", "correctAnswer": "Bộ phim điện ảnh", "points": 10, "order": 5, "options": make_opts("Bộ phim điện ảnh", "Bài hát", "Tranh vẽ", "Vở kịch")},
        ]
    },

    # --- UNIT 3: MUA SẮM, ẨM THỰC & TẶNG QUÀ ---
    {
        "slug": "giving-receiving-tools",
        "title": "Minna Bài 07: Tặng Quà, Nhận Quà & Công Cụ (あげます・もらいます)",
        "description": "Nắm vững cách tặng quà cho ai, nhận quà từ ai và cách diễn đạt công cụ dụng cụ.",
        "level": "N5",
        "order": 10,
        "xpReward": 70,
        "exercises": [
            {"type": "GRAMMAR", "question": "Khi tôi TẶNG quà cho bạn bè, tôi dùng động từ nào?", "correctAnswer": "あげます (友達にあげます)", "points": 10, "order": 0, "options": make_opts("あげます (友達にあげます)", "もらいます", "くれます", "とります")},
            {"type": "GRAMMAR", "question": "Khi tôi NHẬN được quà từ mẹ, tôi dùng động từ nào?", "correctAnswer": "もらいます (母にもらいました)", "points": 10, "order": 1, "options": make_opts("もらいます (母にもらいました)", "あげます", "だします", "おきます")},
            {"type": "GRAMMAR", "question": "Để nói 'Tôi viết thư BẰNG bút bi', trợ từ cần điền là gì?", "correctAnswer": "で (ボールペンで手紙を書きます)", "points": 10, "order": 2, "options": make_opts("で (ボールペンで手紙を書きます)", "を", "に", "へ")},
            {"type": "GRAMMAR", "question": "Mẫu câu 'もう 〜ましたか？' dùng để hỏi điều gì?", "correctAnswer": "Đã làm việc gì đó xong chưa?", "points": 10, "order": 3, "options": make_opts("Đã làm việc gì đó xong chưa?", "Bao giờ sẽ làm?", "Có thích làm không?", "Làm ở đâu thế?")},
            {"type": "EXPRESSION", "question": "Khi được hỏi 'Đã ăn trưa chưa?', câu trả lời 'Chưa, tôi chưa ăn' là:", "correctAnswer": "いいえ、まだです。", "points": 10, "order": 4, "options": make_opts("いいえ、まだです。", "いいえ、食べませんでした。", "はい、まだです。", "いいえ、もうです。")},
            {"type": "VOCABULARY", "question": "Từ 'はし' (hashi) trong bữa ăn người Nhật là gì?", "correctAnswer": "Đôi đũa", "points": 10, "order": 5, "options": make_opts("Đôi đũa", "Cái muỗng", "Cái dĩa", "Cái dao")},
        ]
    },
    {
        "slug": "adjectives-i-na",
        "title": "Minna Bài 08: Thế Giới Tính Từ Đuôi い & Tính Từ Đuôi な",
        "description": "Nắm vững cách chia tính từ đuôi い và đuôi な ở các thì khẳng định, phủ định và bổ nghĩa danh từ.",
        "level": "N5",
        "order": 11,
        "xpReward": 75,
        "exercises": [
            {"type": "GRAMMAR", "question": "Phủ định của tính từ đuôi い 'さむい' (lạnh) là gì?", "correctAnswer": "さむくないです (samukunai desu)", "points": 10, "order": 0, "options": make_opts("さむくないです (samukunai desu)", "さむいじゃありません", "さむくないでした", "さむいではありません")},
            {"type": "GRAMMAR", "question": "Tính từ nào sau đây tận cùng là âm 'i' nhưng THỰC CHẤT là tính từ đuôi な?", "correctAnswer": "きれい (kirei - đẹp, sạch sẽ)", "points": 10, "order": 1, "options": make_opts("きれい (kirei - đẹp, sạch sẽ)", "おいしい (oishii)", "あつい (atsui)", "たかい (takai)")},
            {"type": "GRAMMAR", "question": "Tính từ đuôi な khi đứng trước bổ nghĩa cho danh từ thì:", "correctAnswer": "Giữ nguyên 'な' (しずかな まち)", "points": 10, "order": 2, "options": make_opts("Giữ nguyên 'な' (しずかな まち)", "Bỏ 'な'", "Thêm 'の'", "Thêm 'い'")},
            {"type": "SPECIAL_SOUND", "question": "Dạng phủ định của tính từ 'いい' (tốt) là gì?", "correctAnswer": "よくないです (yokunai desu)", "points": 10, "order": 3, "options": make_opts("よくないです (yokunai desu)", "いくないです", "いいじゃないです", "よいじゃないです")},
            {"type": "VOCABULARY", "question": "Cặp tính từ trái nghĩa của 'たかい' (đắt) và 'あたらしい' (mới) là:", "correctAnswer": "やすい (rẻ) và ふるい (cũ)", "points": 10, "order": 4, "options": make_opts("やすい (rẻ) và ふるい (cũ)", "ひくい và おおきい", "ちいさい và やすい", "ながい và みじかい")},
            {"type": "GRAMMAR", "question": "Quá khứ của tính từ đuôi い 'あつい' (nóng) là gì?", "correctAnswer": "あつかったです (atsukatta desu)", "points": 10, "order": 5, "options": make_opts("あつかったです (atsukatta desu)", "あつかったでした", "あついでした", "あつくないでした")},
        ]
    },
    {
        "slug": "likes-dislikes-hobbies",
        "title": "Minna Bài 09: Sở Thích, Khả Năng & Cảm Xúc (好き・上手・分かります)",
        "description": "Làm chủ trợ từ が đi kèm các từ chỉ cảm xúc, sở thích và năng lực hiểu biết.",
        "level": "N5",
        "order": 12,
        "xpReward": 75,
        "exercises": [
            {"type": "GRAMMAR", "question": "Trước các từ 'すき' (thích), 'きらい' (ghét), ta bắt buộc dùng trợ từ nào?", "correctAnswer": "が (アニメが好きです)", "points": 10, "order": 0, "options": make_opts("が (アニメが好きです)", "を", "に", "で")},
            {"type": "GRAMMAR", "question": "Để nói 'Tôi hiểu tiếng Nhật', câu chuẩn ngữ pháp là:", "correctAnswer": "日本語が 分かります。", "points": 10, "order": 1, "options": make_opts("日本語が 分かります。", "日本語を 分かります。", "日本語に 分かります。", "日本語で 分かります。")},
            {"type": "VOCABULARY", "question": "Cặp từ 'じょうず' (giỏi) và 'へた' (kém) dùng để miêu tả điều gì?", "correctAnswer": "Năng lực, kỹ năng làm một việc gì đó", "points": 10, "order": 2, "options": make_opts("Năng lực, kỹ năng làm một việc gì đó", "Tính cách con người", "Thời tiết các mùa", "Mùi vị thức ăn")},
            {"type": "GRAMMAR", "question": "Khi biểu thị lý do 'Vì ... nên ...', ta đặt từ nào ở cuối mệnh đề lý do?", "correctAnswer": "から (kara)", "points": 10, "order": 3, "options": make_opts("から (kara)", "まで", "けど", "ので")},
            {"type": "VOCABULARY", "question": "Từ 'りょうり' (ryouri) và 'うた' (uta) có nghĩa là gì?", "correctAnswer": "Món ăn/nấu ăn và Bài hát", "points": 10, "order": 4, "options": make_opts("Món ăn/nấu ăn và Bài hát", "Điện ảnh và Hội họa", "Thể thao và Đọc sách", "Du lịch và Mua sắm")},
            {"type": "GRAMMAR", "question": "Từ phó từ 'ぜんぜん' (hoàn toàn không) luôn đi với đuôi câu nào?", "correctAnswer": "Đuôi câu phủ định (ぜんぜん分かりません)", "points": 10, "order": 5, "options": make_opts("Đuôi câu phủ định (ぜんぜん分かりません)", "Đuôi câu khẳng định", "Đuôi câu nghi vấn", "Đuôi câu cầu khiến")},
        ]
    },
    {
        "slug": "existence-arimasu-imasu",
        "title": "Minna Bài 10: Sự Tồn Tại Của Vật & Người (あります・います)",
        "description": "Phân biệt rạch ròi giữa あります (vật vô tri, cây cối) và います (người, động vật cử động).",
        "level": "N5",
        "order": 13,
        "xpReward": 75,
        "exercises": [
            {"type": "GRAMMAR", "question": "Với đồ vật vô tri hoặc cây cối, ta dùng động từ tồn tại nào?", "correctAnswer": "あります (arimasu)", "points": 10, "order": 0, "options": make_opts("あります (arimasu)", "います (imasu)", "します", "おきます")},
            {"type": "GRAMMAR", "question": "Với người và động vật có thể cử động, ta dùng động từ nào?", "correctAnswer": "います (imasu)", "points": 10, "order": 1, "options": make_opts("います (imasu)", "あります (arimasu)", "なります", "いきます")},
            {"type": "GRAMMAR", "question": "Trợ từ đi sau địa điểm tồn tại trong câu 'Trong phòng có chú mèo' là gì?", "correctAnswer": "に (部屋に猫がいます)", "points": 10, "order": 2, "options": make_opts("に (部屋に猫がいます)", "で", "を", "へ")},
            {"type": "VOCABULARY", "question": "Cặp từ 'うえ' (trên) và 'した' (dưới) có nghĩa đối nghịch nào đúng?", "correctAnswer": "Trên và Dưới", "points": 10, "order": 3, "options": make_opts("Trên và Dưới", "Trước và Sau", "Trong và Ngoài", "Trái và Phải")},
            {"type": "VOCABULARY", "question": "Từ 'となり' (tonari) và 'あいだ' (aida) lần lượt có nghĩa là:", "correctAnswer": "Bên cạnh và Ở giữa", "points": 10, "order": 4, "options": make_opts("Bên cạnh và Ở giữa", "Phía trước và Phía sau", "Bên trên và Bên dưới", "Bên trong và Bên ngoài")},
            {"type": "GRAMMAR", "question": "Câu 'Trên bàn có sách và bút' dùng từ nối liệt kê nào?", "correctAnswer": "と (本とペンがあります)", "points": 10, "order": 5, "options": make_opts("と (本とペンがあります)", "や", "も", "か")},
        ]
    },
    {
        "slug": "counters-quantifiers",
        "title": "Minna Bài 11: Số Đếm & Lượng Từ Đồ Vật (つ・人・本・枚)",
        "description": "Làm chủ cách đếm đồ vật thuần Nhật ひとつ、ふたつ... và vị trí đặt lượng từ trong câu.",
        "level": "N5",
        "order": 14,
        "xpReward": 75,
        "exercises": [
            {"type": "SPECIAL_SOUND", "question": "'1 cái', '2 cái', '3 cái' đếm đồ vật chung lần lượt là:", "correctAnswer": "ひとつ, ふたつ, みっつ", "points": 10, "order": 0, "options": make_opts("ひとつ, ふたつ, みっつ", "いち, に, さん", "ひとり, ふたり, さんにん", "いっぽん, にほん, さんぼん")},
            {"type": "SPECIAL_SOUND", "question": "'1 người' và '2 người' trong tiếng Nhật đọc đặc biệt là gì?", "correctAnswer": "ひとり (1 người) và ふたり (2 người)", "points": 10, "order": 1, "options": make_opts("ひとり (1 người) và ふたり (2 người)", "いちにん và ににん", "ひとつ và ふたつ", "いちめい và にめい")},
            {"type": "GRAMMAR", "question": "Lượng từ đếm vật mỏng phẳng như tờ giấy, áo sơ mi, vé tàu là gì?", "correctAnswer": "〜枚 (まい - mai)", "points": 10, "order": 2, "options": make_opts("〜枚 (まい - mai)", "〜本 (ほん)", "〜台 (だい)", "〜冊 (さつ)")},
            {"type": "GRAMMAR", "question": "Lượng từ đếm vật thon dài như chai nước, bút, cây dù là gì?", "correctAnswer": "〜本 (ほん/ぽん/ぼん)", "points": 10, "order": 3, "options": make_opts("〜本 (ほん/ぽん/ぼん)", "〜枚", "〜個", "〜匹")},
            {"type": "GRAMMAR", "question": "Vị trí chuẩn của lượng từ trong câu 'Tôi đã mua 3 quả táo' là:", "correctAnswer": "りんごを 3つ 買いました。", "points": 10, "order": 4, "options": make_opts("りんごを 3つ 買いました。", "3つを りんご 買いました。", "りんご 3つを 買いました。", "りんごに 3つ 買いました。")},
            {"type": "VOCABULARY", "question": "Từ hỏi số lượng đồ vật 'Mấy cái / Bao nhiêu cái?' là:", "correctAnswer": "いくつ (ikutsu)", "points": 10, "order": 5, "options": make_opts("いくつ (ikutsu)", "いくら", "どれ", "なんにん")},
        ]
    },

    # --- UNIT 4: GIAO TIẾP & DIỄN ĐẠT CẢM XÚC ---
    {
        "slug": "comparisons-preferences",
        "title": "Minna Bài 12: Câu So Sánh Hơn Nhất & Các Mùa Trong Năm",
        "description": "Làm chủ cấu trúc so sánh hơn [A より B のほうが...] và so sánh nhất [一番].",
        "level": "N5",
        "order": 15,
        "xpReward": 80,
        "exercises": [
            {"type": "GRAMMAR", "question": "Trong câu 'A より B のほうが [Tính từ] です', vế nào mang tính chất hơn?", "correctAnswer": "Vế B (bên có 'のほうが')", "points": 10, "order": 0, "options": make_opts("Vế B (bên có 'のほうが')", "Vế A (bên có 'より')", "Cả hai bằng nhau", "Tùy thuộc vào động từ")},
            {"type": "GRAMMAR", "question": "Từ dùng để biểu thị so sánh nhất 'Nhất / Số một' là gì?", "correctAnswer": "いちばん (一番)", "points": 10, "order": 1, "options": make_opts("いちばん (一番)", "もっと", "ずっと", "とても")},
            {"type": "VOCABULARY", "question": "Bốn mùa 'Xuân, Hạ, Thu, Đông' trong tiếng Nhật lần lượt là:", "correctAnswer": "はる, なつ, あき, ふゆ", "points": 10, "order": 2, "options": make_opts("はる, なつ, あき, ふゆ", "なつ, はる, ふゆ, あき", "あき, ふゆ, はる, なつ", "ふゆ, なつ, はる, あき")},
            {"type": "GRAMMAR", "question": "Câu hỏi lựa chọn 'Giữa thịt và cá, bạn thích món nào hơn?' là:", "correctAnswer": "肉と 魚と どちらが 好きですか？", "points": 10, "order": 3, "options": make_opts("肉と 魚と どちらが 好きですか？", "肉と 魚と どれが 好きですか？", "肉と 魚と だれが 好きですか？", "肉と 魚と なにが 好きですか？")},
            {"type": "GRAMMAR", "question": "Để nói 'Trong 1 năm, tôi thích mùa xuân nhất':", "correctAnswer": "1年の中で 春が 一番好きです。", "points": 10, "order": 4, "options": make_opts("1年の中で 春が 一番好きです。", "1年のより 春のほうが 一番好きです。", "1年で 春より 好きです。", "1年に 春が 一番です。")},
            {"type": "VOCABULARY", "question": "Từ 'ずっと' (zutto) trong câu so sánh mang ý nghĩa gì?", "correctAnswer": "Hơn hẳn / Rõ rệt", "points": 10, "order": 5, "options": make_opts("Hơn hẳn / Rõ rệt", "Một chút", "Không hẳn", "Cực kỳ kém")},
        ]
    },
    {
        "slug": "desires-tai-hoshii",
        "title": "Minna Bài 13: Bày Tỏ Ước Muốn (〜たい・〜がほしい) & Mục Đích Di Chuyển",
        "description": "Làm chủ cách nói muốn làm gì, muốn có vật gì và cấu trúc 'Đi đâu để làm gì'.",
        "level": "N5",
        "order": 16,
        "xpReward": 80,
        "exercises": [
            {"type": "GRAMMAR", "question": "Để nói 'Tôi muốn đi Nhật', động từ '行きます' chuyển thành gì?", "correctAnswer": "行きたいです (ikitai desu)", "points": 10, "order": 0, "options": make_opts("行きたいです (ikitai desu)", "行きたくないです", "行くほしいです", "行きますたいです")},
            {"type": "GRAMMAR", "question": "Muốn có đồ vật gì đó (Tôi muốn có xe ô tô mới), ta dùng mẫu câu nào?", "correctAnswer": "[Danh từ] + が ほしいです", "points": 10, "order": 1, "options": make_opts("[Danh từ] + が ほしいです", "[Danh từ] + を ほしいです", "[Danh từ] + に ほしいです", "[Danh từ] + で ほしいです")},
            {"type": "GRAMMAR", "question": "Cấu trúc 'Đi siêu thị ĐỂ MUA sữa' chuyển động từ '買いま す' thành:", "correctAnswer": "買いに (スーパーへ牛乳を買いに行きます)", "points": 10, "order": 2, "options": make_opts("買いに (スーパーへ牛乳を買いに行きます)", "買いますに", "買うで", "買いて")},
            {"type": "GRAMMAR", "question": "Phủ định của '食べたいです' (Muốn ăn) là gì?", "correctAnswer": "食べたくないです (tabetakunai desu)", "points": 10, "order": 3, "options": make_opts("食べたくないです (tabetakunai desu)", "食べたいではありません", "食べませんたい", "食べないたいです")},
            {"type": "VOCABULARY", "question": "Hai câu hỏi cửa miệng khi đói và khát nước là:", "correctAnswer": "おなかが すきました (đói bụng) & のどが かわきました (khát nước)", "points": 10, "order": 4, "options": make_opts("おなかが すきました (đói bụng) & のどが かわきました (khát nước)", "あたまが いたいです & ねつが あります", "きぶんが いいです & げんきです", "つかれました & ねむいです")},
            {"type": "GRAMMAR", "question": "Đuôi '〜たい' được chia biến thể theo quy tắc của loại từ nào?", "correctAnswer": "Tính từ đuôi い (i-Adjective)", "points": 10, "order": 5, "options": make_opts("Tính từ đuôi い (i-Adjective)", "Tính từ đuôi な", "Động từ nhóm 1", "Danh từ")},
        ]
    },
    {
        "slug": "te-form-requests",
        "title": "Minna Bài 14: Tuyệt Kỹ Thể Te (〜て形) & Yêu Cầu Lịch Sự (〜てください)",
        "description": "Nắm trọn vẹn quy tắc chia động từ nhóm 1, 2, 3 sang thể Te và câu yêu cầu xin hãy làm gì.",
        "level": "N5",
        "order": 17,
        "xpReward": 85,
        "exercises": [
            {"type": "CONJUGATION", "question": "Động từ nhóm 1 'かきます' (viết) chia sang thể Te là gì?", "correctAnswer": "かいて (kaite)", "points": 10, "order": 0, "options": make_opts("かいて (kaite)", "かくて", "かいって", "かきって")},
            {"type": "CONJUGATION", "question": "Động từ nhóm 1 đặc biệt 'いきます' (đi) chia sang thể Te là gì?", "correctAnswer": "いって (itte)", "points": 10, "order": 1, "options": make_opts("いって (itte)", "いいて", "いきって", "いだいて")},
            {"type": "CONJUGATION", "question": "Động từ 'のみます' (uống) khi chia sang thể Te là gì?", "correctAnswer": "のんで (nonde)", "points": 10, "order": 2, "options": make_opts("のんで (nonde)", "のみて", "のって", "のだて")},
            {"type": "GRAMMAR", "question": "Để nói lịch sự 'Xin hãy chờ một chút', câu tiếng Nhật là:", "correctAnswer": "ちょっと 待ってください (Chotto matte kudasai)", "points": 10, "order": 3, "options": make_opts("ちょっと 待ってください (Chotto matte kudasai)", "ちょっと 待ちてください", "ちょっと 待つください", "ちょっと 待たないでください")},
            {"type": "CONJUGATION", "question": "Động từ nhóm 2 'たべます' (ăn) và 'みます' (xem) chia sang thể Te là:", "correctAnswer": "たべて & みて", "points": 10, "order": 4, "options": make_opts("たべて & みて", "たべって & みって", "たべんで & みんで", "たべして & みして")},
            {"type": "CONJUGATION", "question": "Hai động từ nhóm 3 'します' (làm) và 'きます' (đến) chia sang thể Te là:", "correctAnswer": "して & きて", "points": 10, "order": 5, "options": make_opts("して & きて", "しって & きって", "しんで & きんで", "すて & くつ")},
        ]
    },
    {
        "slug": "permission-prohibition",
        "title": "Minna Bài 15: Cho Phép & Cấm Đoán (〜てもいい・〜てはいけません)",
        "description": "Làm chủ cách xin phép làm gì và các biển báo, quy tắc cấm đoán nơi công cộng.",
        "level": "N5",
        "order": 18,
        "xpReward": 85,
        "exercises": [
            {"type": "GRAMMAR", "question": "Khi muốn xin phép 'Tôi chụp ảnh ở đây có được không?', ta dùng mẫu câu nào?", "correctAnswer": "写真を撮ってもいいですか？", "points": 10, "order": 0, "options": make_opts("写真を撮ってもいいですか？", "写真を撮ってはいけませんか？", "写真を撮らなければなりませんか？", "写真を撮ることができますか？")},
            {"type": "GRAMMAR", "question": "Mẫu câu cấm đoán 'Không được hút thuốc ở đây' là:", "correctAnswer": "ここで タバコを 吸っては いけません。", "points": 10, "order": 1, "options": make_opts("ここで タバコを 吸っては いけません。", "ここで タバコを 吸ってもいいです。", "ここで タバコを 吸いてください。", "ここで タバコを 吸いません。")},
            {"type": "GRAMMAR", "question": "Các động từ trạng thái như 'đang sinh sống tại Hà Nội' dùng thể nào?", "correctAnswer": "ハノイに 住んでいます (Te-imasu)", "points": 10, "order": 2, "options": make_opts("ハノイに 住んでいます (Te-imasu)", "ハノイに 住みます", "ハノイで 住んでいます", "ハノイを 住んでいます")},
            {"type": "GRAMMAR", "question": "Động từ 'biết' khi ở thể khẳng định dùng '知っています', còn khi phủ định 'không biết' thì dùng:", "correctAnswer": "知りません (shirimasen)", "points": 10, "order": 3, "options": make_opts("知りません (shirimasen)", "知っていません", "知らなくてです", "知りませんでした")},
            {"type": "VOCABULARY", "question": "Từ 'けっこんしています' (kekkon shite imasu) có nghĩa là gì?", "correctAnswer": "Đã kết hôn / Lập gia đình", "points": 10, "order": 4, "options": make_opts("Đã kết hôn / Lập gia đình", "Đang độc thân", "Đang đi học", "Đã nghỉ hưu")},
            {"type": "GRAMMAR", "question": "Để từ chối một lời xin phép một cách khéo léo, tế nhị, người Nhật thường nói:", "correctAnswer": "すみません、ちょっと...", "points": 10, "order": 5, "options": make_opts("すみません、ちょっと...", "だめです！", "いけません！", "いやです！")},
        ]
    },
    {
        "slug": "action-sequence-te-kara",
        "title": "Minna Bài 16: Trình Tự Hành Động (〜てから) & Nối Tính Từ",
        "description": "Nắm vững cách diễn đạt thứ tự hành động A trước B sau và cách ghép chuỗi tính từ.",
        "level": "N5",
        "order": 19,
        "xpReward": 85,
        "exercises": [
            {"type": "GRAMMAR", "question": "Mẫu câu 'Sau khi rửa tay thì mới ăn cơm' trong tiếng Nhật là:", "correctAnswer": "手を洗ってから、ご飯を食べます。", "points": 10, "order": 0, "options": make_opts("手を洗ってから、ご飯を食べます。", "手を洗うまえに、ご飯を食べます。", "手を洗うとき、ご飯を食べます。", "手を洗ったら、ご飯を食べます。")},
            {"type": "GRAMMAR", "question": "Khi nối hai tính từ đuôi い (Ví dụ: Món ăn này vừa rẻ vừa ngon), ta chuyển thành:", "correctAnswer": "安くて、美味しいです (yasukute, oishii desu)", "points": 10, "order": 1, "options": make_opts("安くて、美味しいです (yasukute, oishii desu)", "安いと、美味しいです", "安いで、美味しいです", "安くても、美味しいです")},
            {"type": "GRAMMAR", "question": "Khi nối tính từ đuôi な (Thành phố vừa yên tĩnh vừa đẹp), ta dùng:", "correctAnswer": "静かで、綺麗です (shizuka de, kirei desu)", "points": 10, "order": 2, "options": make_opts("静かで、綺麗です (shizuka de, kirei desu)", "静かくて、綺麗です", "静かなと、綺麗です", "静かに、綺麗です")},
            {"type": "GRAMMAR", "question": "Câu hỏi cách thức đi lại 'Làm thế nào để đến được ga?' là:", "correctAnswer": "どうやって 駅へ 行きますか？", "points": 10, "order": 3, "options": make_opts("どうやって 駅へ 行きますか？", "なんで 駅へ 行きますか？", "だれと 駅へ 行きますか？", "いつ 駅へ 行きますか？")},
            {"type": "VOCABULARY", "question": "Hành động 'lên tàu' (乗ります) và 'xuống tàu' (降ります) đi với trợ từ gì?", "correctAnswer": "電車に 乗ります & 電車を 降ります", "points": 10, "order": 4, "options": make_opts("電車に 乗ります & 電車を 降ります", "電車を 乗ります & 電車に 降ります", "電車で 乗ります & 電車で 降ります", "電車へ 乗ります & 電車から 降ります")},
            {"type": "GRAMMAR", "question": "Miêu tả đặc điểm ngoại hình 'Chị Maria có đôi mắt to':", "correctAnswer": "マリアさんは 目が 大きいです。", "points": 10, "order": 5, "options": make_opts("マリアさんは 目が 大きいです。", "マリアさんは 目を 大きいです。", "マリアさんの 目は 大きいです。", "マリアさんは 目に 大きいです。")},
        ]
    },

    # --- UNIT 5: NGỮ PHÁP N5 THỰC CHIẾN NÂNG CAO ---
    {
        "slug": "nai-form-prohibitions",
        "title": "Minna Bài 17: Thể Nai (〜ない形) & Xin Đừng Làm Gì (〜ないでください)",
        "description": "Làm chủ thể phủ định ngắn Nai-form và các lời dặn dò, xin đừng làm gì.",
        "level": "N5",
        "order": 20,
        "xpReward": 85,
        "exercises": [
            {"type": "CONJUGATION", "question": "Động từ nhóm 1 'かきます' (viết) chia sang thể Nai là gì?", "correctAnswer": "かかない (kakanai)", "points": 10, "order": 0, "options": make_opts("かかない (kakanai)", "かきない", "かくない", "かこない")},
            {"type": "CONJUGATION", "question": "Động từ nhóm 1 'あいます' (gặp) chia sang thể Nai đặc biệt là:", "correctAnswer": "あわない (awanai)", "points": 10, "order": 1, "options": make_opts("あわない (awanai)", "ああない", "あいない", "あえない")},
            {"type": "GRAMMAR", "question": "Mẫu câu 'Xin đừng quên hộ chiếu' là:", "correctAnswer": "パスポートを 忘れないでください。", "points": 10, "order": 2, "options": make_opts("パスポートを 忘れないでください。", "パスポートを 忘れるないでください。", "パスポートを 忘れてください。", "パスポートを 忘れないてください。")},
            {"type": "CONJUGATION", "question": "Hai động từ nhóm 3 'します' và 'きます' chia sang thể Nai là:", "correctAnswer": "しない (shinai) & こない (konai)", "points": 10, "order": 3, "options": make_opts("しない (shinai) & こない (konai)", "すない & きない", "しない & きない", "さない & こない")},
            {"type": "GRAMMAR", "question": "Động từ 'あります' (có) chia sang thể Nai đặc biệt là gì?", "correctAnswer": "ない (nai)", "points": 10, "order": 4, "options": make_opts("ない (nai)", "あらない", "ありない", "あるない")},
            {"type": "VOCABULARY", "question": "Từ 'しんぱいします' (shinpai shimasu) có nghĩa là gì?", "correctAnswer": "Lo lắng", "points": 10, "order": 5, "options": make_opts("Lo lắng", "Bận rộn", "Mệt mỏi", "Vui mừng")},
        ]
    },
    {
        "slug": "must-do-nakereba",
        "title": "Minna Bài 17 (Tiếp): Bắt Buộc Phải Làm (〜なければなりません)",
        "description": "Biểu thị nghĩa vụ phải làm gì và không cần thiết phải làm gì (〜なくてもいいです).",
        "level": "N5",
        "order": 21,
        "xpReward": 85,
        "exercises": [
            {"type": "GRAMMAR", "question": "Để nói 'Mỗi ngày tôi đều PHẢI uống thuốc', mẫu câu chuẩn là:", "correctAnswer": "薬を 飲まなければなりません。", "points": 10, "order": 0, "options": make_opts("薬を 飲まなければなりません。", "薬を 飲みてはいけません。", "薬を 飲まないでください。", "薬を 飲むことができます。")},
            {"type": "GRAMMAR", "question": "Mẫu câu 'Không cần phải làm gì cũng được' là:", "correctAnswer": "[V-ない bỏ い] + くてもいいです", "points": 10, "order": 1, "options": make_opts("[V-ない bỏ い] + くてもいいです", "[V-ない] + でもいいです", "[V-て] + もいいです", "[V-ます] + なくてもいいです")},
            {"type": "GRAMMAR", "question": "Câu 'Ngày mai là ngày nghỉ nên không cần phải dậy sớm' dịch là:", "correctAnswer": "明日は休みですから、早く起きなくてもいいです。", "points": 10, "order": 2, "options": make_opts("明日は休みですから、早く起きなくてもいいです。", "明日は休みですから、早く起きなければなりません。", "明日は休みですから、早く起きないでください。", "明日は休みですから、早く起きてはいけません。")},
            {"type": "GRAMMAR", "question": "Khẩu ngữ thường ngày của '〜なければなりません' người Nhật hay nói tắt là:", "correctAnswer": "〜なきゃ (nakya) / 〜ないと", "points": 10, "order": 3, "options": make_opts("〜なきゃ (nakya) / 〜ないと", "〜ても", "〜ちゃう", "〜とく")},
            {"type": "VOCABULARY", "question": "Từ 'くすり' (kusuri) có nghĩa là gì?", "correctAnswer": "Thuốc uống", "points": 10, "order": 4, "options": make_opts("Thuốc uống", "Bác sĩ", "Bệnh viện", "Sức khỏe")},
            {"type": "GRAMMAR", "question": "Trợ từ đi với mốc thời gian hạn chót 'phải nộp báo cáo TRƯỚC thứ sáu' là:", "correctAnswer": "までに (金曜日までに)", "points": 10, "order": 5, "options": make_opts("までに (金曜日までに)", "まで", "から", "に")},
        ]
    },
    {
        "slug": "dictionary-form-can-do",
        "title": "Minna Bài 18: Thể Từ Điển (辞書形) & Mẫu Câu Khả Năng (〜ことができる)",
        "description": "Làm quen thể nguyên bản từ điển, cách nói sở thích và diễn đạt năng lực có thể làm được việc gì.",
        "level": "N5",
        "order": 22,
        "xpReward": 85,
        "exercises": [
            {"type": "CONJUGATION", "question": "Động từ nhóm 1 'はなします' (nói chuyện) chuyển sang thể Từ điển là gì?", "correctAnswer": "はなす (hanasu)", "points": 10, "order": 0, "options": make_opts("はなす (hanasu)", "はなせる", "はなすう", "はなした")},
            {"type": "GRAMMAR", "question": "Để nói 'Tôi có thể bơi lội', câu tiếng Nhật là:", "correctAnswer": "泳ぐことが できます (Oyogu koto ga dekimasu)", "points": 10, "order": 1, "options": make_opts("泳ぐことが できます (Oyogu koto ga dekimasu)", "泳ぎが できます", "泳ぐを できます", "泳ぐに できます")},
            {"type": "GRAMMAR", "question": "Mẫu câu nói về sở thích 'Sở thích của tôi là nghe nhạc':", "correctAnswer": "私の趣味は 音楽を聞くことです。", "points": 10, "order": 2, "options": make_opts("私の趣味は 音楽を聞くことです。", "私の趣味は 音楽を聞きますです。", "私の趣味は 音楽を聞いてことです。", "私の趣味は 音楽を聞くんです。")},
            {"type": "GRAMMAR", "question": "Trước từ 'まえに' (trước khi), động từ luôn chia ở thể nào?", "correctAnswer": "Thể Từ điển (V-る)", "points": 10, "order": 3, "options": make_opts("Thể Từ điển (V-る)", "Thể Masu", "Thể Te", "Thể Ta")},
            {"type": "VOCABULARY", "question": "Từ 'しゅみ' (shumi) và 'ピアノ' (piano) lần lượt là:", "correctAnswer": "Sở thích và Đàn dương cầm", "points": 10, "order": 4, "options": make_opts("Sở thích và Đàn dương cầm", "Nghề nghiệp và Âm nhạc", "Thói quen và Bài hát", "Ước mơ và Đàn ghi-ta")},
            {"type": "GRAMMAR", "question": "Câu 'Trước khi đi ngủ tôi viết nhật ký' dịch là:", "correctAnswer": "寝るまえに、日記を書きます。", "points": 10, "order": 5, "options": make_opts("寝るまえに、日記を書きます。", "寝たまえに、日記を書きます。", "寝てまえに、日記を書きます。", "寝ますまえに、日記を書きます。")},
        ]
    },
    {
        "slug": "ta-form-experience",
        "title": "Minna Bài 19: Thể Ta (〜た形) & Kinh Nghiệm Từng Trải (〜たことがある)",
        "description": "Nắm vững cách chia thể Ta quá khứ ngắn, kể về trải nghiệm đã từng làm gì và liệt kê 〜たり〜たり.",
        "level": "N5",
        "order": 23,
        "xpReward": 85,
        "exercises": [
            {"type": "CONJUGATION", "question": "Quy tắc chia thể Ta (〜た形) có nguyên lý hoàn toàn tương đồng với thể nào?", "correctAnswer": "Thể Te (thay て bằng た, で bằng だ)", "points": 10, "order": 0, "options": make_opts("Thể Te (thay て bằng た, で bằng だ)", "Thể Nai", "Thể Từ điển", "Thể Khả năng")},
            {"type": "GRAMMAR", "question": "Để nói 'Tôi đã từng leo núi Phú Sĩ', mẫu câu chuẩn là:", "correctAnswer": "富士山に 登ったことが あります。", "points": 10, "order": 1, "options": make_opts("富士山に 登ったことが あります。", "富士山に 登ることが あります。", "富士山に 登ってことが あります。", "富士山に 登りことが あります。")},
            {"type": "GRAMMAR", "question": "Mẫu câu dùng để liệt kê hành động tiêu biểu 'Lúc thì làm A, lúc thì làm B...' là:", "correctAnswer": "〜たり、〜たり します", "points": 10, "order": 2, "options": make_opts("〜たり、〜たり します", "〜て、〜て します", "〜たら、〜たら します", "〜と、〜と します")},
            {"type": "GRAMMAR", "question": "Khi muốn nói trạng thái trở nên (Trời trở nên lạnh):", "correctAnswer": "寒くなります (samuku narimasu)", "points": 10, "order": 3, "options": make_opts("寒くなります (samuku narimasu)", "寒いになります", "寒いくなります", "寒いでなります")},
            {"type": "GRAMMAR", "question": "Với tính từ đuôi な và danh từ, khi đi với 'biến đổi trở nên' (〜なります) thì ta thêm gì?", "correctAnswer": "に (元気になります / 医者になります)", "points": 10, "order": 4, "options": make_opts("に (元気になります / 医者になります)", "く", "で", "を")},
            {"type": "VOCABULARY", "question": "Động từ 'のぼります' (noborimasu) đi với trợ từ に có nghĩa là gì?", "correctAnswer": "Leo, trèo lên (núi)", "points": 10, "order": 5, "options": make_opts("Leo, trèo lên (núi)", "Đi xuống dốc", "Bơi qua sông", "Băng qua đường")},
        ]
    },
    {
        "slug": "plain-form-opinions",
        "title": "Minna Bài 20-21: Thể Thông Thường & Bày Tỏ Quan Điểm (〜と思う)",
        "description": "Nắm vững thể thông thường (Futsuukei), cách bày tỏ suy nghĩ ý kiến cá nhân và trích dẫn lời nói.",
        "level": "N5",
        "order": 24,
        "xpReward": 85,
        "exercises": [
            {"type": "GRAMMAR", "question": "Thể thông thường (Futsuukei) của '食べます' và '食べません' là:", "correctAnswer": "食べる & 食べない", "points": 10, "order": 0, "options": make_opts("食べる & 食べない", "食べた & 食べなかった", "食べて & 食べないで", "食べろ & 食べるな")},
            {"type": "GRAMMAR", "question": "Để nói 'Tôi nghĩ ngày mai trời sẽ mưa':", "correctAnswer": "明日 雨が 降ると思います。", "points": 10, "order": 1, "options": make_opts("明日 雨が 降ると思います。", "明日 雨が 降りますと思います。", "明日 雨が 降ると言いました。", "明日 雨が 降るそうです。")},
            {"type": "GRAMMAR", "question": "Khi trích dẫn lời nói 'Anh Tanaka nói rằng tuần sau sẽ đi Tokyo':", "correctAnswer": "田中さんは 来週東京へ 行くと言いました。", "points": 10, "order": 2, "options": make_opts("田中さんは 来週東京へ 行くと言いました。", "田中さんは 来週東京へ 行くと思います。", "田中さんは 来週東京へ 行きますと言いました。", "田中さんは 来週東京へ 行くと聞きました。")},
            {"type": "GRAMMAR", "question": "Trước '〜と思います', nếu là Danh từ hoặc Tính từ đuôi な ở thể khẳng định thì phải thêm gì?", "correctAnswer": "だ (有名だと思います)", "points": 10, "order": 3, "options": make_opts("だ (有名だと思います)", "な", "の", "です")},
            {"type": "VOCABULARY", "question": "Từ 'ぶっか' (bukka) trong câu '日本の物価は高い' có nghĩa là gì?", "correctAnswer": "Vật giá / Giá cả sinh hoạt", "points": 10, "order": 4, "options": make_opts("Vật giá / Giá cả sinh hoạt", "Tiền lương", "Nhà ở", "Giao thông")},
            {"type": "EXPRESSION", "question": "Câu xác nhận ý kiến nhẹ nhàng '... đúng không nhỉ?' thường kết thúc bằng:", "correctAnswer": "〜でしょう？ (deshou?)", "points": 10, "order": 5, "options": make_opts("〜でしょう？ (deshou?)", "〜ですか？", "〜ますか？", "〜ですね！")},
        ]
    },

    # --- UNIT 6: LUYỆN THI CHUYÊN ĐỀ & ĐỀ THI THỬ JLPT N5 MOCK TEST ---
    {
        "slug": "n5-particles-mastery",
        "title": "Chuyên Đề 01: Làm Chủ 10 Trợ Từ Cốt Lõi JLPT N5 (は・が・を・に・で・へ・と・から・まで・も)",
        "description": "Tổng hợp bẫy trợ từ thực chiến hay xuất hiện nhất trong các đề thi năng lực Nhật ngữ N5.",
        "level": "N5",
        "order": 25,
        "xpReward": 100,
        "exercises": [
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: 私は 毎朝 7時 ( ___ ) 起きます。", "correctAnswer": "に", "points": 10, "order": 0, "options": make_opts("に", "で", "を", "へ")},
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: レストラン ( ___ ) 友達と ご飯を 食べました。", "correctAnswer": "で", "points": 10, "order": 1, "options": make_opts("で", "に", "へ", "を")},
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: 教室 ( ___ ) 学生が 10人 います。", "correctAnswer": "に", "points": 10, "order": 2, "options": make_opts("に", "で", "を", "と")},
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: 鉛筆 ( ___ ) 手紙を 書かないでください。", "correctAnswer": "で", "points": 10, "order": 3, "options": make_opts("で", "に", "を", "へ")},
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: 私は 日本語 ( ___ ) 上手じゃありません。", "correctAnswer": "が", "points": 10, "order": 4, "options": make_opts("が", "を", "に", "で")},
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: 9時 ( ___ ) 5時 ( ___ ) 働きます。", "correctAnswer": "から / まで", "points": 10, "order": 5, "options": make_opts("から / まで", "に / へ", "で / と", "は / が")},
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: 明日 どこ ( ___ ) 行きません。", "correctAnswer": "へも", "points": 10, "order": 6, "options": make_opts("へも", "にも", "をも", "でも")},
            {"type": "PARTICLE_TEST", "question": "Điền trợ từ thích hợp: 私は 母 ( ___ ) 花を あげました。", "correctAnswer": "に", "points": 10, "order": 7, "options": make_opts("に", "を", "で", "から")},
        ]
    },
    {
        "slug": "n5-counters-numbers",
        "title": "Chuyên Đề 02: Bách Khoa Số Đếm & Lượng Từ Đời Sống (つ・人・本・枚・匹・冊・台・回)",
        "description": "Luyện tập phản xạ đọc đúng các biến âm số đếm đặc biệt trong đề thi JLPT N5.",
        "level": "N5",
        "order": 26,
        "xpReward": 100,
        "exercises": [
            {"type": "COUNTER_TEST", "question": "Đếm 1 con mèo và 3 con chó nhỏ dùng lượng từ nào?", "correctAnswer": "1匹 (いっぴき) & 3匹 (さんびき)", "points": 10, "order": 0, "options": make_opts("1匹 (いっぴき) & 3匹 (さんびき)", "1本 & 3本", "1個 & 3個", "1頭 & 3頭")},
            {"type": "COUNTER_TEST", "question": "Đếm 2 chiếc xe ô tô hoặc 1 chiếc máy vi tính dùng lượng từ:", "correctAnswer": "〜台 (だい - dai)", "points": 10, "order": 1, "options": make_opts("〜台 (だい - dai)", "〜枚", "〜冊", "〜本")},
            {"type": "COUNTER_TEST", "question": "Đếm 5 cuốn sách hoặc từ điển dùng lượng từ nào?", "correctAnswer": "5冊 (ごさつ - gosatsu)", "points": 10, "order": 2, "options": make_opts("5冊 (ごさつ - gosatsu)", "5本", "5枚", "5つ")},
            {"type": "COUNTER_TEST", "question": "'3 cốc bia' trong tiếng Nhật đọc chuẩn là gì?", "correctAnswer": "さんばい (3杯 - sanbai)", "points": 10, "order": 3, "options": make_opts("さんばい (3杯 - sanbai)", "さんはい", "さんぱい", "さんぼん")},
            {"type": "COUNTER_TEST", "question": "Số đếm 'Ngày mồng 1', 'Ngày mồng 4', 'Ngày mồng 8' trong tháng đọc là:", "correctAnswer": "ついたち, よっか, ようか", "points": 10, "order": 4, "options": make_opts("ついたち, よっか, ようか", "いちにち, よんにち, はちにち", "ふつか, みっか, いつか", "むいか, なのか, ここのか")},
            {"type": "COUNTER_TEST", "question": "Đếm số lần thực hiện hành động (Ví dụ: 1 tuần 2 LẦN) dùng lượng từ gì?", "correctAnswer": "〜回 (かい - kai)", "points": 10, "order": 5, "options": make_opts("〜回 (かい - kai)", "〜度", "〜番", "〜目")},
            {"type": "COUNTER_TEST", "question": "'14 ngày' (ngày 14) và '20 ngày' (ngày 20) đọc đặc biệt là:", "correctAnswer": "じゅうよっか & はつか", "points": 10, "order": 6, "options": make_opts("じゅうよっか & はつか", "じゅうよんにち & にじゅうにち", "じゅうよっか & にじゅうにち", "じゅうしにち & はつか")},
            {"type": "COUNTER_TEST", "question": "'20 tuổi' trong tiếng Nhật có cách đọc đặc biệt truyền thống là gì?", "correctAnswer": "はたち (hatachi)", "points": 10, "order": 7, "options": make_opts("はたち (hatachi)", "にじゅっさい", "にじっさい", "にじゅうさい")},
        ]
    },
    {
        "slug": "n5-verb-conjugations",
        "title": "Chuyên Đề 03: Phản Xạ 4 Thể Biến Đổi Động Từ (Masu・Te・Nai・Ta・Jisho)",
        "description": "Luyện tập tốc độ biến hình động từ qua lại giữa 4 thể cốt lõi quyết định 60% ngữ pháp N5.",
        "level": "N5",
        "order": 27,
        "xpReward": 100,
        "exercises": [
            {"type": "CONJUGATION_CHALLENGE", "question": "Thể Te của động từ '待つ' (matsu - chờ đợi) là:", "correctAnswer": "待って (matte)", "points": 10, "order": 0, "options": make_opts("待って (matte)", "待いて", "待ちて", "待んで")},
            {"type": "CONJUGATION_CHALLENGE", "question": "Thể Nai của động từ '買う' (kau - mua) là:", "correctAnswer": "買わない (kawanai)", "points": 10, "order": 1, "options": make_opts("買わない (kawanai)", "買あない", "買いない", "買えない")},
            {"type": "CONJUGATION_CHALLENGE", "question": "Thể Ta của động từ '泳ぐ' (oyogu - bơi) là:", "correctAnswer": "泳いだ (oyoida)", "points": 10, "order": 2, "options": make_opts("泳いだ (oyoida)", "泳いた", "泳った", "泳んだ")},
            {"type": "CONJUGATION_CHALLENGE", "question": "Thể Từ điển của động từ '食べます' (ăn) là:", "correctAnswer": "食べる (taberu)", "points": 10, "order": 3, "options": make_opts("食べる (taberu)", "食べす", "食べた", "食べない")},
            {"type": "CONJUGATION_CHALLENGE", "question": "Động từ '来る' (kuru - đến) khi chia sang thể Nai là gì?", "correctAnswer": "こない (konai)", "points": 10, "order": 4, "options": make_opts("こない (konai)", "きない", "くない", "くるない")},
            {"type": "CONJUGATION_CHALLENGE", "question": "Thể Ta của động từ '話す' (hanasu - nói chuyện) là:", "correctAnswer": "話した (hanashita)", "points": 10, "order": 5, "options": make_opts("話した (hanashita)", "話いた", "話った", "話んだ")},
            {"type": "CONJUGATION_CHALLENGE", "question": "Thể Te của động từ '死ぬ' (shinu - mất/chết) là:", "correctAnswer": "死んで (shinde)", "points": 10, "order": 6, "options": make_opts("死んで (shinde)", "死って", "死いて", "死して")},
            {"type": "CONJUGATION_CHALLENGE", "question": "Thể Từ điển của động từ 'します' (làm) là:", "correctAnswer": "する (suru)", "points": 10, "order": 7, "options": make_opts("する (suru)", "す", "した", "しない")},
        ]
    },
    {
        "slug": "n5-reading-dokkai",
        "title": "Chuyên Đề 04: Đọc Hiểu Biển Báo & Đoạn Văn Ngắn (Dokkai N5)",
        "description": "Rèn luyện kỹ năng đọc hiểu thực tế: Biển báo nhà ga, thực đơn, email xin nghỉ và thông báo.",
        "level": "N5",
        "order": 28,
        "xpReward": 100,
        "exercises": [
            {"type": "READING_TEST", "question": "Biển báo ghi:【立入禁止 (たちいりきんし)】. Ý nghĩa là gì?", "correctAnswer": "Cấm vào / Không phận sự miễn vào", "points": 10, "order": 0, "options": make_opts("Cấm vào / Không phận sự miễn vào", "Cấm hút thuốc", "Cấm chụp ảnh", "Lối thoát hiểm")},
            {"type": "READING_TEST", "question": "Biển báo ghi:【非常口 (ひじょうぐち)】thường thấy ở đâu và có ý nghĩa gì?", "correctAnswer": "Cửa thoát hiểm khẩn cấp", "points": 10, "order": 1, "options": make_opts("Cửa thoát hiểm khẩn cấp", "Cửa vào nhà ga", "Cửa bán vé", "Phòng chờ")},
            {"type": "READING_TEST", "question": "Biển hiệu cửa hàng ghi:【年中無休 (ねんじゅうむきゅう)】nghĩa là gì?", "correctAnswer": "Mở cửa quanh năm không có ngày nghỉ", "points": 10, "order": 2, "options": make_opts("Mở cửa quanh năm không có ngày nghỉ", "Đang đóng cửa sửa chữa", "Nghỉ lễ cuối tuần", "Chỉ mở vào ban đêm")},
            {"type": "READING_TEST", "question": "Đoạn văn:「田中さんは 毎朝 7時に起きて、パンを食べて、8時の電車で 会社へ行きます。」Hỏi: Anh Tanaka đi làm bằng gì?", "correctAnswer": "Tàu điện (電車)", "points": 10, "order": 3, "options": make_opts("Tàu điện (電車)", "Xe buýt", "Xe ô tô", "Đi bộ")},
            {"type": "READING_TEST", "question": "Đoạn văn:「日曜日に 友達と 図書館へ 行きました。本を 3冊 借りました。」Hỏi: Bạn ấy đã mượn bao nhiêu cuốn sách?", "correctAnswer": "3 cuốn sách (3冊)", "points": 10, "order": 4, "options": make_opts("3 cuốn sách (3冊)", "1 cuốn", "2 cuốn", "4 cuốn")},
            {"type": "READING_TEST", "question": "Mẫu tin nhắn:「熱がありますから、今日の授業を 休みます。」Nội dung tin nhắn là gì?", "correctAnswer": "Vì bị sốt nên xin phép nghỉ học hôm nay", "points": 10, "order": 5, "options": make_opts("Vì bị sốt nên xin phép nghỉ học hôm nay", "Xin phép đến muộn", "Hỏi bài tập về nhà", "Rủ bạn đi chơi")},
            {"type": "READING_TEST", "question": "Chữ trên nút bấm thang máy:【開】và【閉】lần lượt là gì?", "correctAnswer": "Mở cửa (開) và Đóng cửa (閉)", "points": 10, "order": 6, "options": make_opts("Mở cửa (開) và Đóng cửa (閉)", "Đi lên và Đi xuống", "Khẩn cấp và Dừng lại", "Tầng trên và Tầng dưới")},
            {"type": "READING_TEST", "question": "Thực đơn ghi:【本日のおすすめ (ほんじつのおすすめ)】. Đây là mục gì?", "correctAnswer": "Món ăn gợi ý đặc sắc của ngày hôm nay", "points": 10, "order": 7, "options": make_opts("Món ăn gợi ý đặc sắc của ngày hôm nay", "Món ăn đắt nhất", "Đồ uống có cồn", "Món ăn tráng miệng")},
        ]
    },
    {
        "slug": "n5-jlpt-mock-test-1",
        "title": "Đề Thi Thử Tổng Hợp JLPT N5 — Mock Exam Phản Xạ Đạt Chuẩn",
        "description": "Bài thi tổng hợp 10 câu hỏi tiêu biểu bao gồm cả Từ vựng, Chữ Hán, Ngữ pháp và Phản xạ.",
        "level": "N5",
        "order": 29,
        "xpReward": 120,
        "exercises": [
            {"type": "MOCK_KANJI", "question": "Chữ Hán của từ「あたら・しい」trong「新しい車」là chữ nào?", "correctAnswer": "新", "points": 10, "order": 0, "options": make_opts("新", "古", "高", "安")},
            {"type": "MOCK_KANJI", "question": "Chữ「時間」có cách đọc Hiragana đúng là gì?", "correctAnswer": "じかん (jikan)", "points": 10, "order": 1, "options": make_opts("じかん (jikan)", "ときあいだ", "じけん", "とけい")},
            {"type": "MOCK_VOCAB", "question": "Từ trái nghĩa với「たかい」(cao, đắt) trong ngữ cảnh giá tiền là gì?", "correctAnswer": "やすい (安)", "points": 10, "order": 2, "options": make_opts("やすい (安)", "ひくい", "みじかい", "おそい")},
            {"type": "MOCK_GRAMMAR", "question": "明日、天気が いい ( ___ )、海へ 行きましょう。", "correctAnswer": "なら (hoặc だったら)", "points": 10, "order": 3, "options": make_opts("なら", "から", "ので", "でも")},
            {"type": "MOCK_GRAMMAR", "question": "机の上に りんごが 3 ( ___ ) あります。", "correctAnswer": "つ", "points": 10, "order": 4, "options": make_opts("つ", "枚", "人", "本")},
            {"type": "MOCK_GRAMMAR", "question": "ここで 写真を ( ___ ) ください。", "correctAnswer": "撮らないで", "points": 10, "order": 5, "options": make_opts("撮らないで", "撮らなくて", "撮りないで", "撮るないで")},
            {"type": "MOCK_GRAMMAR", "question": "田中さんは どこですか？ —「会議室に ( ___ ) よ。」", "correctAnswer": "います", "points": 10, "order": 6, "options": make_opts("います", "あります", "します", "いきます")},
            {"type": "MOCK_GRAMMAR", "question": "富士山に ( ___ ) ことが ありますか？", "correctAnswer": "登った", "points": 10, "order": 7, "options": make_opts("登った", "登る", "登り", "登って")},
            {"type": "MOCK_GRAMMAR", "question": "この部屋は 静かで ( ___ ) です。", "correctAnswer": "綺麗", "points": 10, "order": 8, "options": make_opts("綺麗", "綺麗な", "綺麗に", "綺麗だ")},
            {"type": "MOCK_DOKKAI", "question": "「私は 毎晩 11時に 寝て、朝 6時に 起きます。」Hỏi: Người này ngủ mấy tiếng mỗi đêm?", "correctAnswer": "7 tiếng (7時間)", "points": 10, "order": 9, "options": make_opts("7 tiếng (7時間)", "6 tiếng", "8 tiếng", "5 tiếng")},
        ]
    }
]

out_content = f"""// Generated Comprehensive N5 Lessons Seed Data
export const LESSONS = {json.dumps(lessons, ensure_ascii=False, indent=2)};
"""

with open(target_file, "w", encoding="utf-8") as f:
    f.write(out_content)

print(f"Successfully generated {target_file} with {len(lessons)} lessons and {sum(len(l['exercises']) for l in lessons)} total exercises.")
