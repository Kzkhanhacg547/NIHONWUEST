# -*- coding: utf-8 -*-
"""
UNIT 5: KANJI N5, TRỢ TỪ CỐT LÕI, ĐỌC HIỂU & ĐỀ THI THỬ JLPT (10 Lessons, 15 Questions each = 150 Questions)
Kanji Master & JLPT N5 Preparation
"""

def get_unit5_lessons(q):
    lessons = []

    # 41. Kanji N5 - Chuyên đề 1: Số đếm, Thời gian & Tự nhiên
    lessons.append((
        "n5-kanji-numbers-nature",
        "Số Đếm, Lịch & Tự Nhiên (一 二 三 四 五 六 七 八 九 十 百 千 万 日 月 年 山 川 木)",
        "Các chữ Hán cơ bản nhất về số học, ngày tháng năm và cảnh sắc thiên nhiên quen thuộc.",
        [
            q("KANJI_READING", "Chữ Hán '一' (Nhất) có Onyomi và Kunyomi cơ bản là gì?", "ICHI / hito(tsu)", "NI / futa", "SAN / mi", "SHI / yo"),
            q("KANJI_READING", "Từ ghép '一日' khi chỉ ngày mồng 1 đầu tháng đọc là gì?", "ついたち (tsuitachi)", "いちにち", "ひとひ", "いちひ"),
            q("KANJI_READING", "Từ ghép '二十日' khi chỉ ngày 20 trong tháng đọc là gì?", "はつか (hatsuka)", "にじゅうにち", "はつひ", "ふたじゅうにち"),
            q("KANJI_READING", "Chữ Hán '百' có âm đọc và ý nghĩa là gì?", "ひゃく (hyaku) - Một trăm", "せん - Một nghìn", "まん - Mười nghìn", "じゅう - Mười"),
            q("KANJI_READING", "Chữ Hán '千' trong '三千' (3000) biến âm đọc là gì?", "さんぜん (sanzen)", "さんせん", "さんびゃく", "さんまん"),
            q("KANJI_READING", "Chữ Hán '万' trong '一万' (10,000) đọc là gì?", "いちまん (ichiman)", "いちぜん", "いっぴゃく", "いちじゅう"),
            q("KANJI_MEANING", "Chữ Hán '日' tượng hình cho hình ảnh gì trong tự nhiên?", "Mặt trời / Ngày", "Mặt trăng", "Ngôi sao", "Đám mây"),
            q("KANJI_READING", "Từ ghép '月曜日' có cách đọc Hiragana là gì?", "げつようび (getsuyoubi)", "がつようび", "つきようび", "げつよび"),
            q("KANJI_READING", "Chữ Hán '年' trong '今年' (năm nay) đọc là gì?", "ことし (kotoshi)", "こんねん", "いまねん", "きねん"),
            q("KANJI_MEANING", "Chữ Hán '山' (Sơn) có nghĩa là gì?", "Ngọn núi", "Dòng sông", "Cánh đồng", "Khu rừng"),
            q("KANJI_READING", "Tên ngọn núi biểu tượng '富士山' đọc là gì?", "ふじさん (Fujisan)", "ふじやま", "ふじざん", "ふじかわ"),
            q("KANJI_MEANING", "Chữ Hán '川' (Xuyên) tượng hình cho dòng nước chảy có nghĩa là gì?", "Dòng sông", "Ngọn núi", "Hồ nước", "Biển cả"),
            q("KANJI_READING", "Chữ Hán '木' (Mộc) khi đứng một mình đọc theo Kunyomi là gì?", "き (ki - cái cây)", "もく", "ぼく", "こ"),
            q("KANJI_READING", "Từ ghép '木曜日' đọc là gì?", "もくようび (mokuyoubi)", "きようび", "ぼくようび", "もくよび"),
            q("KANJI_MEANING", "Chữ Hán '雨' (Vũ) tượng hình cho giọt nước rơi từ đám mây có nghĩa là:", "Cơn mưa (あめ)", "Tuyết rơi", "Gió bão", "Sấm sét"),
        ]
    ))

    # 42. Kanji N5 - Chuyên đề 2: Con người & Bộ phận cơ thể
    lessons.append((
        "n5-kanji-people-body",
        "Con Người, Gia Đình & Cơ Thể (人 子 女 男 父 母 目 耳 口 手 足 上 下 中)",
        "Các chữ Hán miêu tả con người, vai vế xưng hô gia đình, bộ phận thân thể và vị trí không gian.",
        [
            q("KANJI_READING", "Chữ Hán '人' trong '日本人' (người Nhật) đọc là gì?", "にほんじん (Nihonjin)", "にほんひと", "にほんびと", "にほんちん"),
            q("KANJI_READING", "Chữ Hán '子' trong '子ども' (trẻ em) đọc là gì?", "こども (kodomo)", "しども", "すども", "ねども"),
            q("KANJI_READING", "Từ ghép '女の子' có nghĩa là gì?", "Bé gái / Cô gái", "Bé trai", "Người phụ nữ lớn tuổi", "Em bé"),
            q("KANJI_READING", "Chữ Hán '男' (Nam) gồm bộ 'Điền' (田) ở trên và bộ gì ở dưới?", "Bộ Lực (力 - sức mạnh làm ruộng)", "Bộ Khẩu (口)", "Bộ Mộc (木)", "Bộ Nhật (日)"),
            q("KANJI_READING", "Chữ Hán '父' khi nói về bố của người khác một cách kính trọng là:", "お父さん (おとうさん)", "父さん", "ちち", "ふさん"),
            q("KANJI_READING", "Chữ Hán '母' khi tự xưng mẹ của mình với người ngoài là gì?", "母 (ちち: bố, はは: mẹ)", "はは (haha)", "おかあさん", "ぼぼ"),
            q("KANJI_READING", "Chữ Hán '目' (Mục) có Kunyomi chỉ bộ phận nào trên mặt?", "め (me - đôi mắt)", "みみ", "くち", "はな"),
            q("KANJI_READING", "Chữ Hán '耳' (Nhĩ) chỉ bộ phận nào?", "みみ (mimi - cái tai)", "め", "て", "あし"),
            q("KANJI_READING", "Chữ Hán '口' trong '出口' (cửa ra) đọc là gì?", "でぐち (deguchi)", "でくち", "でこう", "でろ"),
            q("KANJI_READING", "Chữ Hán '手' trong '上手' (giỏi) đọc là gì?", "じょうず (jouzu)", "じょうて", "じょうしゅ", "うわて"),
            q("KANJI_READING", "Chữ Hán '足' (Túc) có nghĩa là gì?", "あし (ashi - bàn chân / đôi chân)", "Bàn tay", "Cái đầu", "Cái bụng"),
            q("KANJI_READING", "Chữ Hán '上' trong '机の上' đọc là gì?", "うえ (ue - ở trên)", "した", "なか", "じょう"),
            q("KANJI_READING", "Chữ Hán '下' trong '地下鉄' (tàu điện ngầm) đọc theo Onyomi là gì?", "ちかてつ (chikatetsu)", "ちしたてつ", "ちげてつ", "じかてつ"),
            q("KANJI_READING", "Chữ Hán '中' trong '一日中' (suốt cả ngày) đọc là gì?", "いちにちじゅう (ichinichijuu)", "いちにちなか", "いちにちちゅう", "いちにちしょう"),
            q("KANJI_MEANING", "Cặp chữ Hán chỉ phương hướng '左' và '右' lần lượt có nghĩa là:", "Trái (ひだり) và Phải (みぎ)", "Phải và Trái", "Trên và Dưới", "Trước và Sau"),
        ]
    ))

    # 43. Kanji N5 - Chuyên đề 3: Động từ đời sống & Địa điểm
    lessons.append((
        "n5-kanji-verbs-places",
        "Động Từ Đời Sống & Nơi Chốn (行 来 帰 食 飲 見 聞 読 書 話 買 校 駅 車)",
        "Các động từ căn bản xuất hiện liên tục trong bài thi JLPT N5 và các địa điểm công cộng.",
        [
            q("KANJI_READING", "Chữ Hán '行' trong '行きます' đọc là gì?", "いきます (ikimasu)", "きます", "かえります", "たべます"),
            q("KANJI_READING", "Chữ Hán '来' trong '来週' (tuần tới) đọc là gì?", "らいしゅう (raishuu)", "きしゅう", "こしゅう", "くしゅう"),
            q("KANJI_READING", "Chữ Hán '帰' trong '帰ります' có nghĩa là gì?", "Trở về (nhà, quê hương)", "Đi đến", "Xuất phát", "Ở lại"),
            q("KANJI_READING", "Chữ Hán '食' trong '食堂' (nhà ăn căng tin) đọc là gì?", "しょくどう (shokudou)", "たべどう", "じきどう", "しょくとう"),
            q("KANJI_READING", "Chữ Hán '飲' trong '飲み物' (đồ uống) đọc là gì?", "のみもの (nomimono)", "いんもの", "のみぶつ", "いんぶつ"),
            q("KANJI_READING", "Chữ Hán '見' trong '見学' (tham quan học tập) đọc theo Onyomi là:", "けんがく (kengaku)", "みんがく", "かんがく", "みつがく"),
            q("KANJI_READING", "Chữ Hán '聞' trong '新聞' (tờ báo) đọc là gì?", "しんぶん (shinbun)", "しんもん", "しんきき", "じんぶん"),
            q("KANJI_READING", "Chữ Hán '読' trong '読書' (đọc sách) đọc là gì?", "どくしょ (dokusho)", "よみしょ", "とうしょ", "とくしょ"),
            q("KANJI_READING", "Chữ Hán '書' trong '辞書' (từ điển) đọc là gì?", "じしょ (jisho)", "じかき", "じしょく", "じぞ"),
            q("KANJI_READING", "Chữ Hán '話' trong '電話' (điện thoại) đọc là gì?", "でんわ (denwa)", "でんはなし", "でんわん", "でんご"),
            q("KANJI_READING", "Chữ Hán '買' trong '買い物' (mua sắm) đọc là gì?", "かいもの (kaimono)", "ばいもの", "かうもの", "まいもの"),
            q("KANJI_READING", "Chữ Hán '校' trong '学校' (trường học) đọc là gì?", "がっこう (gakkou)", "がくこう", "がくきょう", "がっきょう"),
            q("KANJI_READING", "Chữ Hán '駅' trong '駅員' (nhân viên nhà ga) đọc là gì?", "えきいん (ekiin)", "やくあん", "うまあん", "えきおん"),
            q("KANJI_READING", "Chữ Hán '車' trong '電車' (tàu điện) đọc theo Onyomi là gì?", "でんしゃ (densha)", "でんくるま", "でんしゃあ", "でんこ"),
            q("KANJI_READING", "Từ ghép '自転車' (xe đạp) đọc là gì?", "じてんしゃ (jitensha)", "じどうしゃ", "じでんしゃ", "じてんくるま"),
        ]
    ))

    # 44. Kanji N5 - Chuyên đề 4: Tính từ trái nghĩa & Kích thước
    lessons.append((
        "n5-kanji-adjectives-opposites",
        "Cặp Tính Từ Trái Nghĩa (大/小, 高/安, 長/短, 白/赤, 新/古, 多/少)",
        "Ghi nhớ các cặp chữ Hán đối lập về kích thước, phẩm chất, giá cả, thời gian và màu sắc.",
        [
            q("KANJI_READING", "Cặp chữ Hán '大' (Đại) và '小' (Tiểu) khi đứng một mình có Kunyomi là:", "おお(きい) và ちい(さい)", "たか(い) và ひく(い)", "なが(い) và みじか(い)", "しろ(い) và くろ(い)"),
            q("KANJI_READING", "Từ ghép '大学' (trường đại học) đọc là gì?", "だいがく (daigaku)", "おおがく", "たいがく", "だいきゃく"),
            q("KANJI_READING", "Chữ Hán '高' trong '高校' (trường cấp 3) đọc là gì?", "こうこう (koukou)", "たかこう", "きょうこう", "こうきょう"),
            q("KANJI_READING", "Chữ Hán '安' trong '安全' (an toàn) và '安い' (rẻ) có Kunyomi là:", "やす(い) (yasui)", "あん(い)", "たか(い)", "ひく(い)"),
            q("KANJI_READING", "Chữ Hán '長' trong '社長' (giám đốc công ty) đọc là gì?", "しゃちょう (shachou)", "しゃなが", "しゃじょう", "じゃちょう"),
            q("KANJI_READING", "Chữ Hán '白' (Bạch) trong '白い' (màu trắng) đọc là gì?", "しろい (shiroi)", "あかい", "あおい", "くろい"),
            q("KANJI_READING", "Chữ Hán '赤' (Xích) trong '赤ちゃん' (em bé sơ sinh) đọc là gì?", "あかちゃん (akachan)", "せきちゃん", "しゃくちゃん", "しろちゃん"),
            q("KANJI_READING", "Cặp Hán tự trái nghĩa '新' (Tân - mới) và '古' (Cổ - cũ) có âm Kunyomi là:", "あたら(しい) và ふる(い)", "なが(い) và みじか(い)", "たか(い) và やす(い)", "おお(きい) và ちい(さい)"),
            q("KANJI_READING", "Chữ Hán '新' trong '新幹線' (tàu cao tốc Shinkansen) đọc theo Onyomi là:", "しんかんせん (Shinkansen)", "あたらしかんせん", "じんかんせん", "にゅうかんせん"),
            q("KANJI_READING", "Chữ Hán '多' trong '多い' (nhiều) có cách đọc là:", "おおい (ooi)", "すくない", "たかい", "ひろい"),
            q("KANJI_READING", "Chữ Hán '少' trong '少し' (một chút / một ít) đọc là gì?", "すこし (sukoshi)", "おおし", "しょうし", "すくなし"),
            q("KANJI_READING", "Chữ Hán '早' trong '早く' (nhanh chóng / sớm) đọc là gì?", "はやく (hayaku)", "そうく", "おそく", "あさく"),
            q("KANJI_READING", "Từ ghép '毎朝' (mỗi sáng) đọc là gì?", "まいあさ (maiasa)", "まいちょう", "まいあした", "まいくる"),
            q("KANJI_READING", "Từ ghép '毎週' (mỗi tuần) đọc là gì?", "まいしゅう (maishuu)", "まいしゅ", "まいしゅうかん", "まいすう"),
            q("KANJI_READING", "Từ ghép '外国' (nước ngoài) đọc là gì?", "がいこく (gaikoku)", "そとくに", "がいごく", "けっこく"),
        ]
    ))

    # 45. Ngữ pháp Tổng hợp N5: 10 Trợ từ Cốt lõi
    lessons.append((
        "n5-grammar-10-core-particles",
        "10 Trợ Từ Cốt Lõi (は, が, を, に, で, へ, と, から, まで, より)",
        "Hệ thống hóa toàn diện cách dùng, phân biệt các cặp trợ từ dễ nhầm lẫn nhất trong đề thi JLPT N5.",
        [
            q("PARTICLE", "Phân biệt は và が: Trợ từ nào dùng để giới thiệu thông tin MỚI hoặc làm chủ ngữ trong câu tồn tại / câu có nghi vấn từ đứng đầu?", "が (ga)", "は (wa)", "を (wo)", "で (de)"),
            q("PARTICLE", "Điền trợ từ thích hợp: 'だれ [ ? ] 来ましたか。' (Ai đã đến thế?)", "が (ga - nghi vấn từ làm chủ ngữ bắt buộc đi với が)", "は", "を", "に"),
            q("PARTICLE", "Điền trợ từ: '私は 毎朝 ７時 [ ? ] 起きます。'", "に (ni - mốc thời gian cụ thể)", "で", "を", "へ"),
            q("PARTICLE", "Điền trợ từ: 'スーパー [ ? ] りんごを 買いました。'", "で (de - nơi diễn ra hành động mua bán)", "に", "へ", "を"),
            q("PARTICLE", "Điền trợ từ: '教室 [ ? ] 学生が １０人 います。'", "に (ni - nơi chốn của sự tồn tại)", "で", "へ", "を"),
            q("PARTICLE", "Điền trợ từ phương hướng: '来月 日本 [ ? ] 行きます。'", "へ (he) hoặc に (ni)", "で", "を", "から"),
            q("PARTICLE", "Điền trợ từ công cụ: 'はし [ ? ] ごはんを 食べます。'", "で (de - bằng đũa)", "に", "を", "へ"),
            q("PARTICLE", "Điền trợ từ đối tượng tác động: '音楽 [ ? ] 聴きます。'", "を (wo - nghe nhạc)", "で", "に", "が"),
            q("PARTICLE", "Điền trợ từ cùng ai đó: '友達 [ ? ] 一緒に 映画を 見ました。'", "と (to - cùng với bạn bè)", "に", "で", "を"),
            q("PARTICLE", "Điền cặp trợ từ: '家 [ ? ] 駅 [ ? ] 歩いて １５分 かかります。'", "から / まで (kara / made - từ nhà đến ga)", "まで / から", "に / へ", "で / を"),
            q("PARTICLE", "Điền trợ từ đối tượng tiếp nhận quà: '田中さん [ ? ] 花を あげました。'", "に (ni - tặng cho anh Tanaka)", "で", "を", "から"),
            q("PARTICLE", "Điền trợ từ đối tượng nguồn: '山田さん [ ? ] 本を 借りました。'", "から / に (mượn từ anh Yamada)", "で", "を", "へ"),
            q("PARTICLE", "Điền trợ từ so sánh: '飛行機は 新幹線 [ ? ] 速いです。'", "より (yori - máy bay nhanh hơn tàu Shinkansen)", "のほうが", "ほど", "から"),
            q("PARTICLE", "Trợ từ 'だけ' (dake) biểu thị ý nghĩa gì?", "Chỉ / Duy nhất (VD: ひとつだけ)", "Cũng", "Đến tận", "Khoảng chừng"),
            q("PARTICLE", "Trợ từ 'しか' luôn luôn đi kèm với dạng câu nào ở đuôi câu?", "Đuôi câu PHỦ ĐỊNH (〜しか...ない / chỉ vỏn vẹn)", "Đuôi câu khẳng định", "Đuôi câu nghi vấn", "Đuôi câu quá khứ"),
        ]
    ))

    # 46. Ngữ pháp Tổng hợp N5: 5 Thể Động từ
    lessons.append((
        "n5-grammar-verb-conjugation-master",
        "Bảng Chia 5 Thể Động Từ (Masu, Te, Nai, Ta, Jisho)",
        "Luyện phản xạ chuyển đổi tức thì giữa 5 dạng biến đổi hình thái then chốt của động từ N5.",
        [
            q("CONJUGATION", "Chuyển động từ 'まちます' (chờ đợi) sang thể Te:", "まって (matte)", "まちて", "まいで", "まった"),
            q("CONJUGATION", "Chuyển động từ 'まちます' sang thể Nai:", "またない (matanai)", "まちない", "まつない", "まてない"),
            q("CONJUGATION", "Chuyển động từ 'まちます' sang thể Từ điển:", "まつ (matsu)", "まちる", "またる", "まてる"),
            q("CONJUGATION", "Chuyển động từ 'まちます' sang thể Ta:", "まった (matta)", "まちた", "まいた", "まんだ"),
            q("CONJUGATION", "Chuyển động từ 'あそびます' (chơi) sang thể Te:", "あそんで (asonde)", "あそびて", "あそって", "あそいで"),
            q("CONJUGATION", "Chuyển động từ 'あそびます' sang thể Nai:", "あそばない (asobanai)", "あそびない", "あそぶない", "あそば"),
            q("CONJUGATION", "Chuyển động từ 'とります' (chụp ảnh / lấy) sang thể Te:", "とって (totte)", "とりて", "といで", "とんで"),
            q("CONJUGATION", "Chuyển động từ 'おきます' (thức dậy - Nhóm 2) sang thể Nai:", "おきない (okinai)", "おかない", "おきらない", "おくてない"),
            q("CONJUGATION", "Chuyển động từ 'みます' (xem - Nhóm 2) sang thể Từ điển:", "みる (miru)", "みす", "まう", "み"),
            q("CONJUGATION", "Chuyển động từ 'きます' (đến - Nhóm 3) sang thể Nai:", "こない (konai)", "きない", "くない", "こなくて"),
            q("CONJUGATION", "Chuyển động từ 'します' (làm - Nhóm 3) sang thể Ta:", "した (shita)", "しった", "すた", "してた"),
            q("CONJUGATION", "Động từ 'かえります' (về) thuộc nhóm động từ nào?", "Nhóm 1 (kết thúc bằng -iri nhưng là Nhóm 1)", "Nhóm 2", "Nhóm 3", "Bất quy tắc"),
            q("CONJUGATION", "Động từ '入ります' (はいります - đi vào) thuộc nhóm nào?", "Nhóm 1 (ngoại lệ quan trọng)", "Nhóm 2", "Nhóm 3", "Nhóm 4"),
            q("CONJUGATION", "Chia thể Te của động từ 'はいります':", "はいって (haitte)", "はいりて", "はいんで", "はいいて"),
            q("CONJUGATION", "Chuyển động từ 'しにます' (chết) sang thể Te:", "しんで (shinde)", "しにて", "しって", "しいで"),
        ]
    ))

    # 47. Đọc hiểu N5: Thông báo, Biển báo & Bảng tin
    lessons.append((
        "n5-reading-notices-signs",
        "Đọc Hiểu: Bảng Tin, Thông Báo Giờ Mở Cửa & Thực Đơn",
        "Rèn luyện kỹ năng quét tìm thông tin (Scanning) trên các biển chỉ dẫn thực tế tại Nhật Bản.",
        [
            q("READING", "Đọc bảng thông báo: [休館日: 毎週月曜日 (祝日の場合は翌日)] - Hỏi bảo tàng nghỉ vào thứ mấy?", "Thứ Hai hàng tuần (nếu trùng ngày lễ thì nghỉ ngày kế tiếp)", "Thứ Bảy và Chủ Nhật", "Chỉ nghỉ ngày lễ", "Mở cửa tất cả các ngày"),
            q("READING", "Biển báo giờ mở cửa: [営業時間: 11:00 〜 22:00 (ラストオーダー 21:30)] - Khách có thể gọi món muộn nhất lúc mấy giờ?", "21:30 (Last order)", "22:00", "21:00", "11:00"),
            q("READING", "Biển báo trên cửa xe buýt: [前のり・後おり / 運賃後払い] - Hành khách lên và trả tiền như thế nào?", "Lên cửa trước, xuống cửa sau, trả tiền khi xuống xe", "Lên cửa sau, trả tiền trước", "Lên cửa nào cũng được", "Đi xe miễn phí"),
            q("READING", "Biển báo rác: [もえるごみ: 火・金] có nghĩa là gì?", "Rác cháy được thu gom vào Thứ Ba và Thứ Sáu", "Cấm vứt rác", "Rác chai nhựa", "Rác đồ điện tử"),
            q("READING", "Dòng chữ trên bao bì thuốc: [食後に 飲んでください] - Bệnh nhân phải uống thuốc vào lúc nào?", "Sau bữa ăn (しょくご)", "Trước bữa ăn", "Trong khi ăn", "Trước khi đi ngủ"),
            q("READING", "Thông báo tại thư viện: [本は １人 ５冊まで、２週間 借りられます] - Bạn có thể mượn tối đa bao nhiêu cuốn và trong bao lâu?", "Tối đa 5 cuốn trong vòng 2 tuần", "Tối đa 2 cuốn trong 5 tuần", "Tùy ý số lượng", "Chỉ được mượn 1 ngày"),
            q("READING", "Biển chỉ dẫn tại ga: [１番線: 東京方面 / ２番線: 新宿方面] - Để đi Tokyo, bạn phải ra ke tàu số mấy?", "Ke tàu số 1 (１番線)", "Ke tàu số 2", "Ke tàu số 3", "Lối ra cửa Tây"),
            q("READING", "Thực đơn quán ăn: [ランチセット: ラーメン + 半チャーハン 850円 (平日限定)] - Suất ăn này được phục vụ khi nào?", "Chỉ các ngày trong tuần từ Thứ Hai đến Thứ Sáu (平日限定)", "Chỉ phục vụ cuối tuần", "Phục vụ 24/7", "Chỉ phục vụ buổi tối"),
            q("READING", "Biển báo: [非常口] (Hijouguchi) có đèn nền màu xanh lá chỉ vị trí nào?", "Cửa thoát hiểm khẩn cấp", "Nhà vệ sinh", "Thang máy", "Quầy lễ tân"),
            q("READING", "Biển báo: [立入禁止] (Tachiiri Kinshi) có nghĩa là gì?", "Cấm vào / Cấm xâm phạm", "Được phép vào", "Khu vực chụp ảnh", "Lối đi bộ"),
            q("READING", "Thông báo giảm giá: [本日 全品 ２０％ 引き] có nghĩa là gì?", "Hôm nay toàn bộ sản phẩm được giảm giá 20%", "Tăng giá 20%", "Mua 1 tặng 1", "Chỉ bán 20 sản phẩm"),
            q("READING", "Dòng chữ: [送料無料] (Souryou Muryou) khi mua sắm online có nghĩa là:", "Miễn phí cước vận chuyển giao hàng", "Tính thêm tiền ship", "Không giao hàng tận nhà", "Giao hàng hỏa tốc"),
            q("READING", "Biển cảnh báo: [足元にご注意ください] có nghĩa là gì?", "Xin chú ý dưới chân (tránh trượt ngã, bước hụt)", "Xin chú ý trên đầu", "Xin đừng chạy", "Xin giữ yên lặng"),
            q("READING", "Biển báo thang cuốn: [歩かないでください] có nghĩa là gì?", "Xin đừng đi bộ trên thang cuốn (hãy đứng yên)", "Hãy chạy nhanh lên", "Không dùng thang cuốn", "Cấm mang hành lý"),
            q("READING", "Dòng chữ: [両替機] (Ryougaeki) tại các khu vực máy bán hàng tự động là máy gì?", "Máy đổi tiền lẻ / tiền xu", "Máy rút tiền ngân hàng", "Máy nạp thẻ tàu", "Máy bán vé"),
        ]
    ))

    # 48. Đọc hiểu N5: Email, Tin nhắn & Nhật ký
    lessons.append((
        "n5-reading-emails-messages",
        "Đọc Hiểu: Email Hẹn Gặp, Tin Nhắn & Nhật Ký Ngắn",
        "Nắm bắt đại ý, người gửi, người nhận, thời gian địa điểm hẹn và lý do trong các đoạn văn bản ngắn.",
        [
            q("READING", "Đọc tin nhắn: '田中さん、明日の会議は 10時から 11時に 変更になりました。場所は 会議室Aです。' - Cuộc họp ngày mai bắt đầu lúc mấy giờ?", "11:00", "10:00", "9:00", "12:00"),
            q("READING", "Nội dung tin nhắn trên diễn ra ở đâu?", "Phòng họp A (会議室A)", "Phòng họp B", "Văn phòng", "Căng tin"),
            q("READING", "Đoạn nhật ký: '日曜日は 友達と 新宿へ 行きました。映画を見てから、おいしいラーメンを 食べました。とても 楽しかったです。' - Tác giả đã làm gì sau khi xem phim?", "Đi ăn mì ramen ngon", "Đi uống cà phê", "Về nhà ngủ", "Đi mua sắm quần áo"),
            q("READING", "Lời mở đầu chuẩn mực trong một email công việc/trao đổi là gì?", "[Tên người nhận] 様 / さん、いつも お世話になっております。", "こんにちは、元気？", "さようなら。", "初めまして、バイバイ。"),
            q("READING", "Lời kết thúc lịch sự trong email trước khi ký tên:", "どうぞ よろしく お願いいたします。", "ごちそうさまでした。", "おやすみなさい。", "いただきます。"),
            q("READING", "Đọc email xin nghỉ ốm: '熱が 38度ありますから、今日 会社を 休みます。' - Lý do nhân viên xin nghỉ là gì?", "Bị sốt cao 38 độ", "Bị đau răng", "Nhà có đám cưới", "Đi du lịch"),
            q("READING", "Đọc tin nhắn hẹn: '駅の 改札口の前で 6時に 会いましょう。' - Địa điểm hẹn gặp là ở đâu?", "Trước cửa soát vé nhà ga (改札口の前)", "Bên trong tàu", "Trên sân ga", "Trước siêu thị"),
            q("READING", "Đoạn văn: '私の家族は ４人です。父と 母と 兄と 私です。犬も １匹 います。' - Gia đình có mấy người?", "4 người (và 1 con chó)", "3 người", "5 người", "2 người"),
            q("READING", "Người anh trai trong đoạn văn trên được gọi bằng từ xưng hô nào?", "兄 (あに / ani)", "弟", "姉", "妹"),
            q("READING", "Đoạn văn: '日本へ 来てから、半年が 経ちました。最初は 日本語が 分かりませんでしたが、今は 少し 話せます。' - Người viết đã ở Nhật được bao lâu?", "Nửa năm (6 tháng - 半年)", "1 năm", "3 tháng", "2 năm"),
            q("READING", "Khả năng tiếng Nhật hiện tại của người viết đoạn trên ra sao?", "Hiện tại đã có thể nói được một chút", "Hoàn toàn không nói được", "Nói rất trôi chảy như người bản xứ", "Đã quên hết tiếng Nhật"),
            q("READING", "Tin nhắn nhờ vả: 'すみませんが、この書類を コピーしてくれませんか。' - Người nhắn đang nhờ việc gì?", "Nhờ photo tài liệu này", "Nhờ viết tài liệu", "Nhờ vứt tài liệu", "Nhờ dịch tài liệu"),
            q("READING", "Từ '書類' (shorui) trong đoạn văn trên có nghĩa là gì?", "Tài liệu / Giấy tờ văn bản", "Cuốn sách", "Tờ báo", "Bưu thiếp"),
            q("READING", "Tin nhắn phản hồi: '了解しました (Ryoukai shimashita)' mang ý nghĩa gì trong môi trường công sở?", "Tôi đã hiểu rõ và tiếp nhận thông tin rồi", "Tôi từ chối", "Tôi không hiểu", "Tôi bận rồi"),
            q("READING", "Từ 'へんじ' (henji) trong cụm 'お返事をお待ちしております' có nghĩa là gì?", "Lời hồi âm / Câu trả lời", "Món quà", "Tiền bạc", "Lời xin lỗi"),
        ]
    ))

    # 49. Nghe hiểu N5: Phản xạ đàm thoại & Tình huống đời sống
    lessons.append((
        "n5-listening-conversations",
        "Nghe Hiểu: Tình Huống Konbini, Ga Tàu & Phản Xạ Đời Sống",
        "Luyện kỹ năng phán đoán hội thoại: nhân viên thu ngân hỏi túi bóng, hỏi đường, mua vé tàu điện.",
        [
            q("LISTENING", "Nhân viên Konbini hỏi: '袋は ご利用ですか？' (Fukuro wa goriyou desu ka?) - Bạn không cần túi nilon thì đáp:", "いいえ、大丈夫です / 結構です (Iie, daijoubu desu)", "はい、だめです", "いいえ、いりです", "はい、どうぞ"),
            q("LISTENING", "Nhân viên Konbini hỏi: 'お弁当 温めますか？' (Obentou atatamemasu ka?) - Nghĩa là họ muốn hỏi bạn điều gì?", "Có muốn hâm nóng hộp cơm bento lại không?", "Có muốn mua thêm cơm không?", "Cơm này có ngon không?", "Cơm này hết hạn chưa?"),
            q("LISTENING", "Khách hàng muốn hâm nóng cơm bento sẽ trả lời:", "はい、お願いします (Vâng, làm ơn hâm giúp)", "いいえ、お願いします", "はい、結構です", "いいえ、あたためます"),
            q("LISTENING", "Nhân viên thanh toán: 'ポイントカードは お持ちですか？' có nghĩa là gì?", "Quý khách có mang theo thẻ tích điểm không?", "Quý khách có tiền mặt không?", "Quý khách có thẻ visa không?", "Quý khách có đổi thẻ không?"),
            q("LISTENING", "Tại quầy vé tàu: '東京まで 大人 ２枚 お願いします' - Khách muốn mua bao nhiêu vé và đi đâu?", "2 vé người lớn đi Tokyo", "1 vé người lớn đi Tokyo", "2 vé trẻ em đi Tokyo", "2 vé người lớn đi Osaka"),
            q("LISTENING", "Nhân viên nhà ga thông báo: 'まもなく ２番線に 電車が まいります。白線の内側へ お下がりください' - Hành khách cần làm gì?", "Lùi lại phía sau vạch màu trắng vì tàu sắp vào", "Lên tàu ngay lập tức", "Chạy qua đường ray", "Ngồi xuống ghế đợi"),
            q("LISTENING", "Hỏi đường người đi đường: 'すみません、交番は どこですか？' - 'Kouban' là địa điểm nào?", "Đồn cảnh sát / Bốt cảnh sát khu phố", "Ngân hàng", "Bệnh viện", "Bưu điện"),
            q("LISTENING", "Người qua đường hướng dẫn: 'あの信号を 右へ 曲がってください' - Bạn phải làm gì ở cột đèn tín hiệu đó?", "Rẽ phải ở cột đèn tín hiệu", "Rẽ trái", "Đi thẳng", "Dừng lại"),
            q("LISTENING", "Khi bạn lỡ giẫm vào chân người khác trên tàu điện, câu phản xạ tức thì là:", "すみません！ / 失礼しました！", "ありがとうございます！", "どういたしまして！", "さようなら！"),
            q("LISTENING", "Được ai đó khen ngợi về trang phục: 'その服、とても 似合っていますね！' - Bạn đáp:", "ありがとうございます！嬉しいです。", "いいえ、だめです。", "そうですね、似合いますよ。", "ごめんなさい。"),
            q("LISTENING", "Khi chuẩn bị ra về trước mọi người ở công ty: 'お先に 失礼します' - Đồng nghiệp ở lại sẽ đáp:", "お疲れ様でした (Otsukaresama deshita)", "いってらっしゃい", "おかえりなさい", "こんにちは"),
            q("LISTENING", "Nhận được cuộc gọi nhầm số: 'いいえ、番号が 違いますよ' có nghĩa là gì?", "Không phải đâu, bạn nhầm số điện thoại rồi", "Xin mời nói tiếp", "Tôi đang bận", "Hãy gọi lại sau"),
            q("LISTENING", "Gọi món tại nhà hàng: 'すみません、お水を もう一杯 ください' - Khách yêu cầu thêm gì?", "Cho tôi thêm 1 cốc nước lọc nữa", "Cho tôi thêm 1 bát cơm", "Tính tiền giúp", "Cho tôi xem thực đơn"),
            q("LISTENING", "Khi muốn thanh toán tiền tại quán ăn: 'お会計 お願いします' hoặc:", "お勘定 (おかんじょう) お願いします", "いただきます", "ごちそうさまでした", "いらっしゃいませ"),
            q("LISTENING", "Khi tạm biệt bạn bè sau buổi đi chơi vui vẻ: 'また 来週！ / じゃあ、またね！' có nghĩa là:", "Hẹn gặp lại vào tuần sau nhé / Tạm biệt nhé!", "Chúc ngủ ngon", "Xin lỗi nhé", "Cảm ơn bạn nhé"),
        ]
    ))

    # 50. Đề Thi Thử Toàn Diện JLPT N5 Mock Test
    lessons.append((
        "n5-jlpt-mock-test-comprehensive",
        "Đề Thi Thử Toàn Diện JLPT N5 Mock Test (Moji, Goi, Bunpou & Dokkai)",
        "Bộ câu hỏi chuẩn định dạng kỳ thi năng lực tiếng Nhật JLPT N5 kiểm tra tổng lực kiến thức.",
        [
            q("JLPT_MOCK", "Chọn cách đọc đúng của chữ Hán trong câu: 'きのう [友達] に 会いました。'", "ともだち (tomodachi)", "ゆうだち", "ともたち", "ゆうたち"),
            q("JLPT_MOCK", "Chọn chữ Hán đúng cho từ gạch chân: '[あめ] が ふっています。'", "雨", "天", "雪", "雲"),
            q("JLPT_MOCK", "Chọn từ thích hợp điền vào chỗ trống: 'あした テストが ありますから、今夜は [ ? ] 勉強します。'", "一生懸命 (いっしょうけんめい - chăm chỉ hết sức)", "ぜんぜん", "あまり", "そろそろ"),
            q("JLPT_MOCK", "Chọn trợ từ thích hợp: '私は 毎朝 パン [ ? ] コーヒーを 飲みます。'", "を食べ、 / を食べて、", "を食べて", "を食べます", "を飲む"),
            q("JLPT_MOCK", "Điền trợ từ: '父は 会社 [ ? ] 勤めています (tsutomete imasu)。'", "に (ni - làm việc cống hiến cho công ty)", "で", "を", "へ"),
            q("JLPT_MOCK", "Chọn dạng chia đúng: '図書館では 静かに [ ? ] ください。'", "して (shite - 静かにしてください)", "な", "くて", "く"),
            q("JLPT_MOCK", "Chọn câu đồng nghĩa: '田中さんは 英語を 上手に 話すことが できます。'", "田中さんは 英語が 上手です。", "田中さんは 英語が 下手です。", "田中さんは 英語を 話しません。", "田中さんは 英語が 好きではありません。"),
            q("JLPT_MOCK", "Sắp xếp theo thứ tự đúng: 'きのう 私が [ ★ ] 本は とても 面白かったです。' - (1: 買った 2: 本屋で 3: のは 4: 図書館で)", "本屋で 買った (2 -> 1)", "買った 本屋で", "図書館 買った", "買った のは"),
            q("JLPT_MOCK", "Chọn từ đúng: 'この シャツは [ ? ] すぎますから、着られません。'", "大き (ooki - 大きすぎます: quá to)", "大きい", "大きくて", "大きかった"),
            q("JLPT_MOCK", "Chọn trợ từ đúng: '私は １週間に １回 [ ? ] プールで 泳ぎます。'", "だけ (dake - chỉ 1 lần)", "しか", "でも", "ほど"),
            q("JLPT_MOCK", "Chọn dạng đúng: '田中さんは まだ [ ? ]。'", "来ていません (kite imasen - vẫn chưa đến)", "来ませんでした", "来ます", "来ないでした"),
            q("JLPT_MOCK", "Đọc câu: 'エレベーターが 故障ですから、[かいだん] を 使ってください。' - Chữ Hán của 'かいだん' là:", "階段 (cầu thang bộ)", "怪談", "会談", "改談"),
            q("JLPT_MOCK", "Từ trái nghĩa với '便利' (べんり - tiện lợi) là:", "不便 (ふべん - bất tiện)", "親切", "元気", "有名"),
            q("JLPT_MOCK", "Chọn câu trả lời đúng cho: 'コーヒー、もう一杯 いかがですか？' - Nếu không muốn uống thêm:", "いいえ、もう 結構です (Iie, mou kekkou desu)。", "はい、結構です。", "いいえ、いただきます。", "はい、いりません。"),
            q("JLPT_MOCK", "Mục tiêu đạt được cấp chứng chỉ JLPT N5 chứng nhận điều gì?", "Khả năng hiểu và sử dụng tiếng Nhật căn bản (bảng chữ cái Kana, ~100 Kanji, ~800 từ vựng và ngữ pháp sơ cấp cơ bản)", "Giao tiếp thành thạo công sở", "Đọc báo kinh tế chuyên ngành", "Dịch cabin hội nghị quốc tế"),
        ]
    ))

    return lessons
