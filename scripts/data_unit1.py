# -*- coding: utf-8 -*-
"""
UNIT 1: NHẬP MÔN, KANA & CHÀO HỎI (10 Lessons, 15 Questions each = 150 Questions)
"""

def get_unit1_lessons(q):
    lessons = []

    # 1. Hiragana Nguyên Âm
    lessons.append((
        "hiragana-vowels",
        "Hàng Nguyên Âm Hiragana (あ・い・う・え・お)",
        "5 nguyên âm cốt lõi tạo nên toàn bộ hệ thống phát âm tiếng Nhật kèm các từ ghép đầu tiên.",
        [
            q("KANA_RECOGNITION", "Chữ cái nào sau đây là chữ 'a' (あ)?", "あ", "い", "お", "え"),
            q("KANA_TO_ROMAJI", "Chữ 'い' được đọc là gì trong phiên âm Romaji?", "i", "e", "u", "o"),
            q("KANA_RECOGNITION", "Chữ Hiragana tương ứng với âm 'u' là gì?", "う", "つ", "お", "ろ"),
            q("KANA_TO_ROMAJI", "Chữ 'え' đọc là gì trong phiên âm Romaji?", "e", "a", "i", "o"),
            q("KANA_RECOGNITION", "Chữ cái nào là chữ 'o' (お)?", "お", "あ", "む", "め"),
            q("WORD_BUILDING", "Từ ghép 'あい' (ai) trong tiếng Nhật có nghĩa là gì?", "Tình yêu", "Bầu trời", "Ngôi nhà", "Dòng sông"),
            q("WORD_BUILDING", "Từ 'いえ' (ie) có nghĩa là gì?", "Ngôi nhà", "Con mèo", "Cái cây", "Cuốn sách"),
            q("WORD_BUILDING", "Từ 'あお' (ao) có nghĩa là gì?", "Màu xanh da trời / xanh lam", "Màu đỏ", "Màu trắng", "Màu đen"),
            q("WORD_BUILDING", "Từ 'うえ' (ue) có nghĩa là vị trí nào?", "Ở trên", "Ở dưới", "Bên trong", "Bên ngoài"),
            q("WORD_BUILDING", "Từ 'いい' (ii) có nghĩa là gì?", "Tốt / Đẹp / Được", "Xấu", "Nóng", "Lạnh"),
            q("ROMAJI_TO_KANA", "Chữ Romaji 'oe' được viết bằng Hiragana là gì?", "おえ", "あえ", "うえ", "いえ"),
            q("ROMAJI_TO_KANA", "Chữ Romaji 'ai' được viết bằng Hiragana là gì?", "あい", "おい", "えい", "うい"),
            q("SPECIAL_SOUND", "Trong 5 nguyên âm, chữ nào có nét thắt vòng tròn giống chữ 'あ' nhưng cấu tạo tròn liền khối?", "お", "う", "え", "い"),
            q("VOCABULARY", "Từ 'あう' (au) là động từ có nghĩa là gì?", "Gặp mặt", "Nói chuyện", "Uống", "Ăn"),
            q("VOCABULARY", "Từ 'いう' (iu) là động từ có nghĩa là gì?", "Nói", "Xem", "Nghe", "Đọc"),
        ]
    ))

    # 2. Hiragana Ka & Sa
    lessons.append((
        "hiragana-ka-sa",
        "Hàng Ka & Hàng Sa (か・き・く・け・こ / さ・し・す・せ・そ)",
        "Mở rộng hệ thống phụ âm với hàng Ka và hàng Sa kèm biến âm đặc biệt 'shi'.",
        [
            q("KANA_RECOGNITION", "Chữ 'か' có phiên âm Romaji là gì?", "ka", "ki", "ku", "ko"),
            q("KANA_RECOGNITION", "Chữ 'き' đọc là gì?", "ki", "ka", "ke", "ko"),
            q("KANA_RECOGNITION", "Chữ 'く' đọc là gì?", "ku", "tsu", "he", "shi"),
            q("KANA_RECOGNITION", "Chữ 'け' đọc là gì?", "ke", "ka", "ki", "ko"),
            q("KANA_RECOGNITION", "Chữ 'こ' đọc là gì?", "ko", "so", "to", "ro"),
            q("SPECIAL_SOUND", "Trong hàng Sa (sa, shi, su, se, so), chữ nào phát âm đặc biệt là /ɕi/?", "し (shi)", "さ (sa)", "す (su)", "せ (se)"),
            q("WORD_BUILDING", "Từ 'かさ' (kasa) có nghĩa là gì?", "Cây dù / Cái ô", "Cái áo", "Đôi giày", "Cái nón"),
            q("WORD_BUILDING", "Từ 'すし' (sushi) ghép từ hai ký tự nào?", "す + し", "さ + し", "そ + し", "す + き"),
            q("WORD_BUILDING", "Từ 'あさ' (asa) có nghĩa là buổi nào trong ngày?", "Buổi sáng", "Buổi trưa", "Buổi tối", "Nửa đêm"),
            q("WORD_BUILDING", "Từ 'えき' (eki) có nghĩa là gì?", "Nhà ga xe điện", "Bệnh viện", "Trường học", "Ngân hàng"),
            q("WORD_BUILDING", "Từ 'きく' (kiku) có nghĩa là gì?", "Nghe / Hoa cúc", "Ăn", "Viết", "Đi"),
            q("WORD_BUILDING", "Từ 'さけ' (sake) có nghĩa là gì?", "Rượu sake / Cá hồi", "Trà", "Cơm", "Thịt"),
            q("ROMAJI_TO_KANA", "Chữ Romaji 'seki' viết bằng Hiragana là:", "せき", "さき", "そき", "すき"),
            q("ROMAJI_TO_KANA", "Chữ Romaji 'soko' viết bằng Hiragana là:", "そこ", "さこ", "すこ", "せこ"),
            q("VOCABULARY", "Từ 'せかい' (sekai) có nghĩa là gì?", "Thế giới", "Đất nước", "Thành phố", "Bầu trời"),
        ]
    ))

    # 3. Hiragana Ta & Na
    lessons.append((
        "hiragana-ta-na",
        "Hàng Ta & Hàng Na (た・ち・つ・て・と / な・に・ぬ・ね・の)",
        "Hai biến âm đặc biệt 'chi' và 'tsu' trong hàng Ta và sự mềm mại của hàng Na.",
        [
            q("SPECIAL_SOUND", "Trong hàng Ta, hai chữ cái có phát âm biến âm đặc biệt là gì?", "chi (ち) và tsu (つ)", "ta và te", "to và ta", "ti và tu"),
            q("KANA_RECOGNITION", "Chữ Hiragana tương ứng với âm 'te' là gì?", "て", "た", "と", "ち"),
            q("KANA_RECOGNITION", "Chữ Hiragana tương ứng với âm 'to' là gì?", "と", "て", "つ", "た"),
            q("KANA_RECOGNITION", "Chữ 'な' đọc là gì?", "na", "ni", "nu", "ne"),
            q("KANA_RECOGNITION", "Chữ 'に' đọc là gì?", "ni", "na", "ne", "no"),
            q("KANA_RECOGNITION", "Chữ 'ぬ' đọc là gì?", "nu", "me", "ne", "re"),
            q("KANA_RECOGNITION", "Chữ 'ね' đọc là gì?", "ne", "re", "wa", "nu"),
            q("KANA_RECOGNITION", "Chữ 'の' đọc là gì?", "no", "me", "so", "o"),
            q("WORD_BUILDING", "Từ 'ねこ' (neko) có nghĩa là gì?", "Con mèo", "Con chó", "Con chim", "Con cá"),
            q("WORD_BUILDING", "Từ 'いぬ' (inu) có nghĩa là gì?", "Con chó", "Con mèo", "Con bò", "Con ngựa"),
            q("WORD_BUILDING", "Từ 'さかな' (sakana) có nghĩa là gì?", "Con cá", "Bông hoa", "Trái cây", "Rau củ"),
            q("WORD_BUILDING", "Từ 'て' (te) có nghĩa là bộ phận nào trên cơ thể?", "Bàn tay", "Bàn chân", "Cái mắt", "Cái tai"),
            q("WORD_BUILDING", "Từ 'つき' (tsuki) có nghĩa là gì?", "Mặt trăng / Tháng", "Mặt trời", "Ngôi sao", "Đám mây"),
            q("ROMAJI_TO_KANA", "Chữ 'natsu' (mùa hè) viết bằng Hiragana là:", "なつ", "ぬつ", "ねつ", "につ"),
            q("VOCABULARY", "Từ 'くに' (kuni) có nghĩa là gì?", "Đất nước / Quốc gia", "Thành phố", "Khu phố", "Ngôi làng"),
        ]
    ))

    # 4. Hiragana Ha & Ma
    lessons.append((
        "hiragana-ha-ma",
        "Hàng Ha & Hàng Ma (は・ひ・ふ・へ・ほ / ま・み・む・め・も)",
        "Làm chủ phát âm chữ Fu (ふ) và hàng Ma trong tiếng Nhật.",
        [
            q("SPECIAL_SOUND", "Chữ nào trong hàng Ha có cách phát âm là /ɸɯ/ (âm gió 'fu')?", "ふ (fu)", "は (ha)", "ひ (hi)", "ほ (ho)"),
            q("KANA_RECOGNITION", "Chữ 'は' đọc là gì khi đứng độc lập?", "ha", "he", "ho", "hi"),
            q("KANA_RECOGNITION", "Chữ 'ひ' đọc là gì?", "hi", "ha", "fu", "ho"),
            q("KANA_RECOGNITION", "Chữ 'へ' đọc là gì?", "he", "e", "te", "ku"),
            q("KANA_RECOGNITION", "Chữ 'ほ' đọc là gì?", "ho", "ha", "ma", "yo"),
            q("KANA_RECOGNITION", "Chữ 'ま' đọc là gì?", "ma", "mo", "mu", "mi"),
            q("KANA_RECOGNITION", "Chữ 'み' đọc là gì?", "mi", "ma", "me", "mu"),
            q("KANA_RECOGNITION", "Chữ 'む' đọc là gì?", "mu", "su", "nu", "me"),
            q("KANA_RECOGNITION", "Chữ 'め' đọc là gì?", "me", "nu", "ne", "re"),
            q("KANA_RECOGNITION", "Chữ 'も' đọc là gì?", "mo", "ma", "ko", "to"),
            q("WORD_BUILDING", "Từ 'はな' (hana) có nghĩa là gì?", "Bông hoa / Cái mũi", "Cái tai", "Bàn tay", "Đôi mắt"),
            q("WORD_BUILDING", "Từ 'やま' (yama) có nghĩa là gì?", "Ngọn núi", "Dòng sông", "Biển cả", "Cánh đồng"),
            q("WORD_BUILDING", "Từ 'みず' (mizu) có nghĩa là gì?", "Nước uống", "Lửa", "Gió", "Đất"),
            q("WORD_BUILDING", "Từ 'まち' (machi) có nghĩa là gì?", "Thành phố / Khu phố", "Đất nước", "Ngôi nhà", "Cửa hàng"),
            q("WORD_BUILDING", "Từ 'ひと' (hito) có nghĩa là gì?", "Con người / Người", "Bạn bè", "Gia đình", "Thầy cô"),
        ]
    ))

    # 5. Hiragana Ya, Ra, Wa & N
    lessons.append((
        "hiragana-ya-ra-wa-n",
        "Hàng Ya, Ra, Wa & Âm Mũi N (ん)",
        "Hoàn tất 46 ký tự Hiragana cơ bản với hàng Ya, Ra, Wa và âm mũi duy nhất ん.",
        [
            q("KANA_RECOGNITION", "Hàng Ya chỉ gồm 3 chữ cái nào?", "や (ya), ゆ (yu), よ (yo)", "ya, yi, yu", "ya, yu, ye", "ya, yo, yuu"),
            q("KANA_RECOGNITION", "Chữ 'ら' đọc là gì?", "ra", "ri", "ru", "ro"),
            q("KANA_RECOGNITION", "Chữ 'り' đọc là gì?", "ri", "ra", "ru", "re"),
            q("KANA_RECOGNITION", "Chữ 'る' đọc là gì?", "ru", "ro", "re", "ra"),
            q("KANA_RECOGNITION", "Chữ 'れ' đọc là gì?", "re", "ne", "wa", "ru"),
            q("KANA_RECOGNITION", "Chữ 'ろ' đọc là gì?", "ro", "ru", "ko", "so"),
            q("KANA_RECOGNITION", "Chữ 'わ' đọc là gì?", "wa", "re", "ne", "o"),
            q("SPECIAL_SOUND", "Ký tự duy nhất không đi kèm nguyên âm trong tiếng Nhật là:", "ん (n)", "わ (wa)", "を (wo)", "や (ya)"),
            q("WORD_BUILDING", "Từ 'さくら' (sakura) ghép từ các chữ cái nào?", "さ + く + ら", "し + く + ら", "す + け + ろ", "さ + こ + り"),
            q("WORD_BUILDING", "Từ 'にほん' (nihon) có nghĩa là gì?", "Nhật Bản", "Việt Nam", "Hàn Quốc", "Trung Quốc"),
            q("WORD_BUILDING", "Từ 'くるま' (kuruma) có nghĩa là gì?", "Xe ô tô / Xe hơi", "Xe đạp", "Tàu điện", "Máy bay"),
            q("WORD_BUILDING", "Từ 'とり' (tori) có nghĩa là con gì?", "Con chim", "Con cá", "Con chó", "Con mèo"),
            q("WORD_BUILDING", "Từ 'よる' (yoru) có nghĩa là buổi nào?", "Buổi tối / Đêm", "Buổi sáng", "Buổi trưa", "Buổi chiều"),
            q("WORD_BUILDING", "Từ 'ほん' (hon) có nghĩa là gì?", "Cuốn sách", "Cây bút", "Cái bàn", "Cái ghế"),
            q("WORD_BUILDING", "Từ 'ゆき' (yuki) có nghĩa là hiện tượng thời tiết nào?", "Tuyết rơi / Tuyết", "Mưa", "Gió", "Nắng"),
        ]
    ))

    # 6. Biến Âm Đục & Bán Đục
    lessons.append((
        "dakuten-handakuten",
        "Biến Âm Đục (Dakuten: が・ざ・だ・ば) & Bán Đục (Handakuten: ぱ)",
        "Làm chủ 20 âm đục với dấu Tenten (゛) và 5 âm bán đục với dấu Maru (゜).",
        [
            q("SPECIAL_SOUND", "Hàng Ka (k) khi thêm dấu Ten-ten (゛) sẽ biến thành âm gì?", "Hàng Ga (g: が・ぎ・ぐ・げ・ご)", "Hàng Za", "Hàng Da", "Hàng Ba"),
            q("SPECIAL_SOUND", "Hàng Sa (s) khi thêm dấu Ten-ten (゛) sẽ biến thành âm gì?", "Hàng Za (z: ざ・じ・ず・ぜ・ぞ)", "Hàng Ga", "Hàng Da", "Hàng Ba"),
            q("SPECIAL_SOUND", "Chữ 'し' (shi) khi thêm Ten-ten (゛) đọc là gì?", "ji (じ)", "zi", "di", "gi"),
            q("SPECIAL_SOUND", "Hàng Ta (t) khi thêm Ten-ten (゛) sẽ biến thành âm gì?", "Hàng Da (d: だ・ぢ・づ・で・ど)", "Hàng Za", "Hàng Ba", "Hàng Ga"),
            q("SPECIAL_SOUND", "Hàng Ha (h) khi thêm dấu Ten-ten (゛) sẽ biến thành âm gì?", "Hàng Ba (b: ば・び・ぶ・べ・ぼ)", "Hàng Pa", "Hàng Da", "Hàng Ga"),
            q("SPECIAL_SOUND", "Hàng Ha (h) khi thêm dấu Maru tròn (゜) sẽ biến thành âm gì?", "Hàng Pa (p: ぱ・ぴ・ぷ・ぺ・ぽ)", "Hàng Ba", "Hàng Da", "Hàng Za"),
            q("WORD_BUILDING", "Từ 'でんしゃ' (densha) có nghĩa là gì?", "Tàu điện", "Xe buýt", "Xe đạp", "Xe taxi"),
            q("WORD_BUILDING", "Từ 'がくせい' (gakusei) có nghĩa là gì?", "Học sinh / Sinh viên", "Bác sĩ", "Kỹ sư", "Nhân viên"),
            q("WORD_BUILDING", "Từ 'かぞく' (kazoku) có nghĩa là gì?", "Gia đình", "Bạn bè", "Lớp học", "Công ty"),
            q("WORD_BUILDING", "Từ 'みず' (mizu) có chứa chữ đục nào?", "ず (zu)", "が (ga)", "だ (da)", "ば (ba)"),
            q("WORD_BUILDING", "Từ 'えんぴつ' (enpitsu) có nghĩa là gì?", "Cây bút chì", "Cây bút bi", "Cục tẩy", "Thước kẻ"),
            q("WORD_BUILDING", "Từ 'かぎ' (kagi) có nghĩa là gì?", "Chìa khóa", "Ví tiền", "Đồng hồ", "Cái dù"),
            q("WORD_BUILDING", "Từ 'てがみ' (tegami) có nghĩa là gì?", "Bức thư", "Tờ báo", "Cuốn sách", "Bản đồ"),
            q("WORD_BUILDING", "Từ 'しんぶん' (shinbun) có nghĩa là gì?", "Tờ báo giấy", "Cuốn tạp chí", "Tiểu thuyết", "Truyện tranh"),
            q("WORD_BUILDING", "Từ 'たべます' (tabemasu) có nghĩa là gì?", "Ăn", "Uống", "Đi", "Ngủ"),
        ]
    ))

    # 7. Ảo Âm & Âm Ngắt & Trường Âm
    lessons.append((
        "yoon-sokuon-chouon",
        "Ảo Âm (Yoon: きゃ・しゃ・ちゃ) & Âm Ngắt (っ) & Trường Âm",
        "Các âm ghép chữ nhỏ ya, yu, yo, âm ngắt tsu nhỏ và quy tắc kéo dài âm tiết.",
        [
            q("SPECIAL_SOUND", "Ảo âm (Yoon) được tạo bằng cách ghép cột 'i' với 3 chữ nhỏ nào?", "ゃ (ya), ゅ (yu), ょ (yo) nhỏ", "a, i, u nhỏ", "wa, wo, n", "tsu, chi, shi"),
            q("SPECIAL_SOUND", "Chữ 'き' ghép với 'ゃ' nhỏ (きゃ) đọc là gì?", "kya", "kiya", "ka", "kaya"),
            q("SPECIAL_SOUND", "Chữ 'し' ghép với 'ゃ' nhỏ (しゃ) đọc là gì?", "sha", "shiya", "sa", "shaya"),
            q("SPECIAL_SOUND", "Âm ngắt (Sokuon) trong Hiragana được biểu thị bằng chữ nào viết nhỏ?", "っ (tsu nhỏ)", "ッ (tsu cứng)", "ん (n)", "い (i)"),
            q("SPECIAL_SOUND", "Từ 'きって' (kitte - tem thư) khi phát âm có hiện tượng gì ở chữ 'っ'?", "Dừng/ngắt 1 nhịp âm trước phụ âm t", "Đọc to âm tsu", "Đọc nối dài âm ki", "Không phát âm"),
            q("WORD_BUILDING", "Từ 'きょう' (kyou - hôm nay) có chứa trường âm của nguyên âm nào?", "Âm お kéo dài bằng う", "Âm あ kéo dài", "Âm い kéo dài", "Âm え kéo dài"),
            q("WORD_BUILDING", "Từ 'がっこう' (gakkou) có nghĩa là gì?", "Trường học", "Bệnh viện", "Nhà hàng", "Công ty"),
            q("WORD_BUILDING", "Từ 'おちゃ' (ocha) có nghĩa là gì?", "Trà xanh", "Cà phê", "Nước lọc", "Rượu"),
            q("WORD_BUILDING", "Từ 'びょういん' (byouin) có nghĩa là gì?", "Bệnh viện", "Tiệm cắt tóc", "Ngân hàng", "Bưu điện"),
            q("WORD_BUILDING", "Từ 'とうきょう' (Toukyou) gồm mấy âm tiết khi đếm nhịp phách?", "4 nhịp (To - u - kyo - u)", "2 nhịp", "3 nhịp", "5 nhịp"),
            q("WORD_BUILDING", "Từ 'ざっし' (zasshi) có nghĩa là gì?", "Tạp chí", "Từ điển", "Báo", "Sách giáo khoa"),
            q("WORD_BUILDING", "Từ 'ちょっと' (chotto) có nghĩa là gì?", "Một chút / Một lát", "Rất nhiều", "Hoàn toàn", "Không bao giờ"),
            q("WORD_BUILDING", "Từ 'いっしょに' (isshoni) có nghĩa là gì?", "Cùng nhau", "Một mình", "Mọi người", "Ai đó"),
            q("SPECIAL_SOUND", "Phân biệt 'びょういん' (bệnh viện) và 'びよういん' (tiệm uốn tóc):", "Chữ よ nhỏ (byouin) là bệnh viện, よ to (biyouin) là tiệm tóc", "Cả hai giống nhau", "びょういん là tiệm tóc", "Khác nhau ở chữ び"),
            q("WORD_BUILDING", "Từ 'きっぷ' (kippu) có nghĩa là gì?", "Tấm vé (tàu, xe)", "Cái tem", "Cái ví", "Bức tranh"),
        ]
    ))

    # 8. Katakana Cơ Bản
    lessons.append((
        "katakana-basics",
        "Bảng Chữ Cứng Katakana & Từ Mượn Quốc Tế (Gairaigo)",
        "Làm quen với bảng chữ cái góc cạnh Katakana chuyên dùng ghi từ mượn tiếng nước ngoài.",
        [
            q("KANA_RECOGNITION", "Bảng chữ cái Katakana thường được dùng trong trường hợp nào?", "Từ mượn tiếng nước ngoài, tên người nước ngoài, tên địa danh quốc tế", "Chỉ dùng viết tên vua", "Chỉ dùng cho văn thơ cổ", "Thay thế hoàn toàn Kanji"),
            q("KANA_RECOGNITION", "Chữ Katakana 'ア' tương ứng với âm nào trong Hiragana?", "あ (a)", "い (i)", "う (u)", "え (e)"),
            q("KANA_RECOGNITION", "Chữ Katakana 'カ' tương ứng với âm nào?", "か (ka)", "き (ki)", "く (ku)", "こ (ko)"),
            q("SPECIAL_SOUND", "Trường âm trong chữ Katakana được ký hiệu bằng dấu gì?", "Dấu gạch ngang dài (ー)", "Chữ う", "Chữ お", "Dấu hai chấm"),
            q("WORD_BUILDING", "Từ Katakana 'コーヒー' (koohii) mượn từ tiếng Anh có nghĩa là gì?", "Cà phê (Coffee)", "Cô ca", "Ca cao", "Nước ép"),
            q("WORD_BUILDING", "Từ Katakana 'パン' (pan) có nghĩa là gì?", "Bánh mì (gốc Bồ Đào Nha: pão)", "Cái chảo", "Bút viết", "Cái chăn"),
            q("WORD_BUILDING", "Từ 'カメラ' (kamera) có nghĩa là gì?", "Máy ảnh (Camera)", "Tivi", "Máy tính", "Điện thoại"),
            q("WORD_BUILDING", "Từ 'テレビ' (terebi) có nghĩa là gì?", "Chiếc tivi (Television)", "Đài radio", "Máy ảnh", "Tủ lạnh"),
            q("WORD_BUILDING", "Từ 'ホテル' (hoteru) có nghĩa là gì?", "Khách sạn (Hotel)", "Nhà hàng", "Sân bay", "Ký túc xá"),
            q("WORD_BUILDING", "Từ 'タクシー' (takushii) có nghĩa là gì?", "Xe taxi", "Xe buýt", "Tàu điện", "Tàu thủy"),
            q("WORD_BUILDING", "Từ 'バス' (basu) có nghĩa là gì?", "Xe buýt (Bus)", "Bồn tắm", "Bóng rổ", "Tàu hỏa"),
            q("WORD_BUILDING", "Từ 'パソコン' (pasokon) là từ viết tắt của gì?", "Personal Computer (Máy tính cá nhân)", "Passport", "Passcode", "Package"),
            q("WORD_BUILDING", "Từ 'スーパー' (suupaa) có nghĩa là gì?", "Siêu thị (Supermarket)", "Người siêu phàm", "Súp canh", "Thịt bò"),
            q("WORD_BUILDING", "Từ 'レストラン' (resutoran) có nghĩa là gì?", "Nhà hàng ăn uống (Restaurant)", "Khách sạn", "Quán cà phê", "Cửa hàng"),
            q("WORD_BUILDING", "Tên đất nước 'ベトナム' trong chữ Katakana đọc là gì?", "Việt Nam (Betonamu)", "Bỉ", "Vatican", "Venezuela"),
        ]
    ))

    # 9. Chào Hỏi & Nghi Thức Văn Hóa
    lessons.append((
        "daily-greetings-culture",
        "Chào Hỏi Hàng Ngày & Văn Hóa Ứng Xử Cúi Chào Ojigi",
        "Các nghi thức chào hỏi chuẩn mực từ sáng đến tối và các câu cửa miệng thiết yếu.",
        [
            q("EXPRESSION", "Câu chào buổi sáng lịch sự trong tiếng Nhật là:", "おはようございます", "こんにちは", "こんばんは", "さようなら"),
            q("EXPRESSION", "Câu chào ban ngày (từ khoảng 10h sáng đến khi trời tối) là:", "こんにちは", "おはよう", "こんばんは", "おやすみ"),
            q("EXPRESSION", "Câu chào buổi tối (khi trời đã tối) là:", "こんばんは", "こんにちは", "おやすみなさい", "いただきます"),
            q("EXPRESSION", "Chúc ai đó ngủ ngon trước khi đi ngủ, ta nói:", "おやすみなさい", "さようなら", "じゃあね", "こんばんは"),
            q("EXPRESSION", "Nói lời cảm ơn chân thành bằng tiếng Nhật:", "ありがとうございます", "すみません", "ごめんなさい", "どうぞ"),
            q("EXPRESSION", "Đáp lại lời cảm ơn 'Không có chi đâu ạ':", "どういたしまして", "いいえ、だめです", "こちらこそ", "さようなら"),
            q("EXPRESSION", "Nói trước khi bắt đầu ăn cơm để cảm ơn người nấu và thiên nhiên:", "いただきます", "ごちそうさまでした", "おいしいです", "おねがいします"),
            q("EXPRESSION", "Nói sau khi ăn xong bữa cơm:", "ごちそうさまでした", "いただきます", "おなかいっぱいです", "ありがとう"),
            q("EXPRESSION", "Khi muốn gọi nhân viên phục vụ hoặc xin lỗi nhẹ khi làm phiền ai:", "すみません", "ごめんなさい", "もしもし", "あのう"),
            q("EXPRESSION", "Lời xin lỗi chân thành khi làm sai điều gì:", "ごめんなさい / 申し訳ありません", "どういたしまして", "おねがいします", "しつれいします"),
            q("EXPRESSION", "Khi rời khỏi nhà hoặc công ty ra ngoài có việc, ta nói:", "行ってきます (ittekimasu)", "ただいま", "おかえりなさい", "いってらっしゃい"),
            q("EXPRESSION", "Người ở nhà đáp lại người sắp ra ngoài:", "行ってらっしゃい (itterasshai)", "おかえりなさい", "ただいま", "いってきます"),
            q("EXPRESSION", "Khi trở về nhà, câu đầu tiên nói là:", "ただいま (tadaima)", "おかえりなさい", "いってきます", "こんにちは"),
            q("EXPRESSION", "Người ở nhà chào đón người vừa về:", "お帰りなさい (okaerinasai)", "ただいま", "いってらっしゃい", "おやすみなさい"),
            q("CULTURE", "Nghi thức cúi đầu chào trong văn hóa Nhật gọi là gì?", "お辞儀 (Ojigi)", "Kimono", "Origami", "Ikebana"),
        ]
    ))

    # 10. Giới Thiệu Bản Thân
    lessons.append((
        "self-introduction-grammar",
        "Giới Thiệu Bản Thân & Khẳng Định / Phủ Định (です・じゃありません)",
        "Làm chủ mẫu câu [Danh từ 1 は Danh từ 2 です] và cách xưng hô chuẩn người Nhật.",
        [
            q("GRAMMAR", "Cấu trúc câu khẳng định 'A là B' trong tiếng Nhật là gì?", "A は B です。", "A が B です。", "A を B です。", "A に B です。"),
            q("GRAMMAR", "Dạng phủ định lịch sự của 'です' (không phải là) là:", "ではありません / じゃありません", "でした", "ですない", "くないです"),
            q("GRAMMAR", "Trợ từ đặt ở cuối câu để biến câu thành câu hỏi nghi vấn là:", "か (ka)", "ね (ne)", "よ (yo)", "わ (wa)"),
            q("GRAMMAR", "Trợ từ mang ý nghĩa 'cũng' (Tôi cũng là sinh viên) là:", "も (mo)", "は (wa)", "の (no)", "と (to)"),
            q("GRAMMAR", "Hậu tố lịch sự gắn sau tên người khác (như anh Tanaka, chị Hoa) là:", "〜さん (san)", "〜ちゃん", "〜くん", "〜どの"),
            q("GRAMMAR", "Khi tự giới thiệu tên của CHÍNH MÌNH, ta có được thêm '〜さん' vào sau tên mình không?", "Tuyệt đối không được", "Bắt buộc phải thêm", "Tùy ý", "Chỉ thêm khi nói với sếp"),
            q("EXPRESSION", "Câu mở đầu khi giới thiệu bản thân lần đầu tiên gặp mặt là:", "初めまして (Hajimemashite)", "こんにちは", "さようなら", "ありがとう"),
            q("EXPRESSION", "Câu kết thúc bài tự giới thiệu 'Rất mong nhận được sự giúp đỡ':", "どうぞ よろしく お願いします。", "ごちそうさまでした。", "おやすみなさい。", "いただきます。"),
            q("VOCABULARY", "Từ 'せんせい' (sensei) dùng để gọi ai?", "Thầy cô giáo, bác sĩ, chuyên gia", "Học sinh", "Bản thân mình", "Em bé"),
            q("VOCABULARY", "Từ 'かいしゃいん' (kaishain) có nghĩa là gì?", "Nhân viên công ty", "Bác sĩ", "Học sinh", "Kỹ sư"),
            q("VOCABULARY", "Từ 'ぎんこういん' (ginkouin) có nghĩa là gì?", "Nhân viên ngân hàng", "Giáo viên", "Bác sĩ", "Luật sư"),
            q("VOCABULARY", "Để nói 'Tôi là người Việt Nam':", "私は ベトナム人です。", "私は ベトナム語です。", "私は ベトナムです。", "私は ベトナム本です。"),
            q("GRAMMAR", "Câu hỏi tuổi 'Bạn bao nhiêu tuổi?' lịch sự là:", "おいくつですか？ / 何歳ですか？", "いくらですか？", "どこですか？", "だれですか？"),
            q("SPECIAL_SOUND", "Chữ 'は' khi đóng vai trò trợ từ chủ đề câu thì đọc là gì?", "/wa/", "/ha/", "/fa/", "/ba/"),
            q("VOCABULARY", "Từ 'だれ' (dare) có nghĩa là gì?", "Ai?", "Cái gì?", "Ở đâu?", "Bao nhiêu?"),
        ]
    ))

    return lessons
