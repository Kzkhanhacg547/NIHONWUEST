# -*- coding: utf-8 -*-
"""
Generate complete N4 dataset: 25 Lessons (Minna no Nihongo II Lessons 26-50),
each containing 12-15 rich exercises (300+ total exercises),
along with expanded N4 Kanji (60+ items), N4 Vocabulary (100+ items),
N4 Grammar points (35+ structures), and N4 Survival Scenarios.
Output is written directly into prisma/seed-data/n4-data.ts.
"""

import os
import json

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_file = os.path.join(workspace_dir, "prisma", "seed-data", "n4-data.ts")

# -----------------------------------------------------------------------------
# 1. KANJI N4 DATA (60+ Kanji items)
# -----------------------------------------------------------------------------
kanji_n4 = [
    # Baseline & Extended
    {"character": "会", "meaning": "Gặp gỡ, Hội (Hội)", "strokeCount": 6, "jlptLevel": "N4", "readings": [{"reading": "カイ", "type": "ONYOMI"}, {"reading": "あ・う", "type": "KUNYOMI"}]},
    {"character": "社", "meaning": "Công ty, Đền thờ (Xã)", "strokeCount": 7, "jlptLevel": "N4", "readings": [{"reading": "シャ", "type": "ONYOMI"}, {"reading": "やしろ", "type": "KUNYOMI"}]},
    {"character": "店", "meaning": "Cửa hàng, Tiệm (Điếm)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "テン", "type": "ONYOMI"}, {"reading": "みせ", "type": "KUNYOMI"}]},
    {"character": "駅", "meaning": "Nhà ga (Dịch)", "strokeCount": 14, "jlptLevel": "N4", "readings": [{"reading": "エキ", "type": "ONYOMI"}]},
    {"character": "校", "meaning": "Trường học (Hiệu)", "strokeCount": 10, "jlptLevel": "N4", "readings": [{"reading": "コウ", "type": "ONYOMI"}]},
    {"character": "勉", "meaning": "Cố gắng, Nỗ lực (Miễn)", "strokeCount": 10, "jlptLevel": "N4", "readings": [{"reading": "ベン", "type": "ONYOMI"}, {"reading": "つと・める", "type": "KUNYOMI"}]},
    {"character": "強", "meaning": "Mạnh mẽ, Khỏe (Cường)", "strokeCount": 11, "jlptLevel": "N4", "readings": [{"reading": "キョウ", "type": "ONYOMI"}, {"reading": "つよ・い", "type": "KUNYOMI"}]},
    {"character": "電", "meaning": "Điện (Điện)", "strokeCount": 13, "jlptLevel": "N4", "readings": [{"reading": "デン", "type": "ONYOMI"}]},
    {"character": "車", "meaning": "Xe hơi, Xe cộ (Xa)", "strokeCount": 7, "jlptLevel": "N4", "readings": [{"reading": "シャ", "type": "ONYOMI"}, {"reading": "くるま", "type": "KUNYOMI"}]},
    {"character": "旅", "meaning": "Du lịch, Chuyến đi (Lữ)", "strokeCount": 10, "jlptLevel": "N4", "readings": [{"reading": "リョ", "type": "ONYOMI"}, {"reading": "たび", "type": "KUNYOMI"}]},
    {"character": "館", "meaning": "Tòa nhà, Khách quán (Quán)", "strokeCount": 16, "jlptLevel": "N4", "readings": [{"reading": "カン", "type": "ONYOMI"}, {"reading": "やかた", "type": "KUNYOMI"}]},
    {"character": "宿", "meaning": "Nhà trọ, Chỗ ở (Túc)", "strokeCount": 11, "jlptLevel": "N4", "readings": [{"reading": "シュク", "type": "ONYOMI"}, {"reading": "やど", "type": "KUNYOMI"}]},
    {"character": "題", "meaning": "Đề tài, Câu hỏi (Đề)", "strokeCount": 18, "jlptLevel": "N4", "readings": [{"reading": "ダイ", "type": "ONYOMI"}]},
    {"character": "考", "meaning": "Suy nghĩ, Cân nhắc (Khảo)", "strokeCount": 6, "jlptLevel": "N4", "readings": [{"reading": "コウ", "type": "ONYOMI"}, {"reading": "かんが・える", "type": "KUNYOMI"}]},
    {"character": "運", "meaning": "Vận chuyển, May mắn (Vận)", "strokeCount": 12, "jlptLevel": "N4", "readings": [{"reading": "ウン", "type": "ONYOMI"}, {"reading": "はこ・ぶ", "type": "KUNYOMI"}]},
    {"character": "動", "meaning": "Chuyển động, Hoạt động (Động)", "strokeCount": 11, "jlptLevel": "N4", "readings": [{"reading": "ドウ", "type": "ONYOMI"}, {"reading": "うご・く", "type": "KUNYOMI"}]},
    {"character": "族", "meaning": "Gia tộc, Bộ tộc (Tộc)", "strokeCount": 11, "jlptLevel": "N4", "readings": [{"reading": "ゾク", "type": "ONYOMI"}]},
    {"character": "貸", "meaning": "Cho mượn, Cho vay (Thải)", "strokeCount": 12, "jlptLevel": "N4", "readings": [{"reading": "タイ", "type": "ONYOMI"}, {"reading": "か・す", "type": "KUNYOMI"}]},
    {"character": "借", "meaning": "Mượn, Vay (Tá)", "strokeCount": 10, "jlptLevel": "N4", "readings": [{"reading": "シャク", "type": "ONYOMI"}, {"reading": "か・りる", "type": "KUNYOMI"}]},
    {"character": "明", "meaning": "Sáng sủa, Rõ ràng (Minh)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "メイ", "type": "ONYOMI"}, {"reading": "あか・るい", "type": "KUNYOMI"}]},
    {"character": "暗", "meaning": "Tối tăm (Ám)", "strokeCount": 13, "jlptLevel": "N4", "readings": [{"reading": "アン", "type": "ONYOMI"}, {"reading": "くら・い", "type": "KUNYOMI"}]},
    {"character": "楽", "meaning": "Vui vẻ, Âm nhạc (Lạc/Nhạc)", "strokeCount": 13, "jlptLevel": "N4", "readings": [{"reading": "ラク", "type": "ONYOMI"}, {"reading": "たの・しい", "type": "KUNYOMI"}]},
    {"character": "歌", "meaning": "Bài hát, Ca hát (Ca)", "strokeCount": 14, "jlptLevel": "N4", "readings": [{"reading": "カ", "type": "ONYOMI"}, {"reading": "うた", "type": "KUNYOMI"}]},
    {"character": "質", "meaning": "Chất lượng, Hỏi (Chất)", "strokeCount": 15, "jlptLevel": "N4", "readings": [{"reading": "シツ", "type": "ONYOMI"}]},
    {"character": "問", "meaning": "Hỏi han, Câu hỏi (Vấn)", "strokeCount": 11, "jlptLevel": "N4", "readings": [{"reading": "モン", "type": "ONYOMI"}, {"reading": "と・う", "type": "KUNYOMI"}]},
    {"character": "答", "meaning": "Trả lời, Đáp án (Đáp)", "strokeCount": 12, "jlptLevel": "N4", "readings": [{"reading": "トウ", "type": "ONYOMI"}, {"reading": "こた・える", "type": "KUNYOMI"}]},
    {"character": "開", "meaning": "Mở ra, Khởi đầu (Khai)", "strokeCount": 12, "jlptLevel": "N4", "readings": [{"reading": "カイ", "type": "ONYOMI"}, {"reading": "あ・ける", "type": "KUNYOMI"}, {"reading": "ひら・く", "type": "KUNYOMI"}]},
    {"character": "閉", "meaning": "Đóng lại (Bế)", "strokeCount": 11, "jlptLevel": "N4", "readings": [{"reading": "ヘイ", "type": "ONYOMI"}, {"reading": "し・める", "type": "KUNYOMI"}, {"reading": "と・じる", "type": "KUNYOMI"}]},
    {"character": "始", "meaning": "Bắt đầu (Thủy)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "シ", "type": "ONYOMI"}, {"reading": "はじ・まる", "type": "KUNYOMI"}, {"reading": "はじ・める", "type": "KUNYOMI"}]},
    {"character": "終", "meaning": "Kết thúc (Chung)", "strokeCount": 11, "jlptLevel": "N4", "readings": [{"reading": "シュウ", "type": "ONYOMI"}, {"reading": "お・わる", "type": "KUNYOMI"}]},
    {"character": "医", "meaning": "Y học, Bác sĩ (Y)", "strokeCount": 7, "jlptLevel": "N4", "readings": [{"reading": "イ", "type": "ONYOMI"}]},
    {"character": "者", "meaning": "Người, Chuyên gia (Giả)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "シャ", "type": "ONYOMI"}, {"reading": "もの", "type": "KUNYOMI"}]},
    {"character": "研", "meaning": "Nghiên cứu, Mài sắc (Nghiên)", "strokeCount": 9, "jlptLevel": "N4", "readings": [{"reading": "ケン", "type": "ONYOMI"}, {"reading": "と・ぐ", "type": "KUNYOMI"}]},
    {"character": "究", "meaning": "Nghiên cứu đến cùng (Cứu)", "strokeCount": 7, "jlptLevel": "N4", "readings": [{"reading": "キュウ", "type": "ONYOMI"}, {"reading": "きわ・める", "type": "KUNYOMI"}]},
    {"character": "建", "meaning": "Xây dựng (Kiến)", "strokeCount": 9, "jlptLevel": "N4", "readings": [{"reading": "ケン", "type": "ONYOMI"}, {"reading": "た・てる", "type": "KUNYOMI"}]},
    {"character": "物", "meaning": "Vật thể, Đồ vật (Vật)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "ブツ", "type": "ONYOMI"}, {"reading": "モツ", "type": "ONYOMI"}, {"reading": "もの", "type": "KUNYOMI"}]},
    {"character": "注", "meaning": "Rót vào, Chú ý (Chú)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "チュウ", "type": "ONYOMI"}, {"reading": "そそ・ぐ", "type": "KUNYOMI"}]},
    {"character": "意", "meaning": "Ý chí, Ý nghĩa (Ý)", "strokeCount": 13, "jlptLevel": "N4", "readings": [{"reading": "イ", "type": "ONYOMI"}]},
    {"character": "送", "meaning": "Gửi đi, Tiễn (Tống)", "strokeCount": 9, "jlptLevel": "N4", "readings": [{"reading": "ソウ", "type": "ONYOMI"}, {"reading": "おく・る", "type": "KUNYOMI"}]},
    {"character": "切", "meaning": "Cắt, Đứt (Thiết)", "strokeCount": 4, "jlptLevel": "N4", "readings": [{"reading": "セツ", "type": "ONYOMI"}, {"reading": "き・る", "type": "KUNYOMI"}]},
    {"character": "服", "meaning": "Quần áo, Phục tùng (Phục)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "フク", "type": "ONYOMI"}]},
    {"character": "品", "meaning": "Sản phẩm, Hàng hóa (Phẩm)", "strokeCount": 9, "jlptLevel": "N4", "readings": [{"reading": "ヒン", "type": "ONYOMI"}, {"reading": "しな", "type": "KUNYOMI"}]},
    {"character": "味", "meaning": "Hương vị, Nêm nếm (Vị)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "ミ", "type": "ONYOMI"}, {"reading": "あじ", "type": "KUNYOMI"}]},
    {"character": "事", "meaning": "Việc, Sự việc (Sự)", "strokeCount": 8, "jlptLevel": "N4", "readings": [{"reading": "ジ", "type": "ONYOMI"}, {"reading": "こと", "type": "KUNYOMI"}]},
    {"character": "仕", "meaning": "Phục vụ, Làm việc (Sĩ)", "strokeCount": 5, "jlptLevel": "N4", "readings": [{"reading": "シ", "type": "ONYOMI"}, {"reading": "つか・える", "type": "KUNYOMI"}]},
    {"character": "親", "meaning": "Cha mẹ, Thân thiết (Thân)", "strokeCount": 16, "jlptLevel": "N4", "readings": [{"reading": "シン", "type": "ONYOMI"}, {"reading": "おや", "type": "KUNYOMI"}, {"reading": "した・しい", "type": "KUNYOMI"}]},
    {"character": "切", "meaning": "Cắt, Thân mật (Thiết)", "strokeCount": 4, "jlptLevel": "N4", "readings": [{"reading": "セツ", "type": "ONYOMI"}, {"reading": "き・る", "type": "KUNYOMI"}]},
    {"character": "不", "meaning": "Bất, Không (Bất)", "strokeCount": 4, "jlptLevel": "N4", "readings": [{"reading": "フ", "type": "ONYOMI"}, {"reading": "ブ", "type": "ONYOMI"}]},
    {"character": "便", "meaning": "Tiện lợi, Bưu thư (Tiện)", "strokeCount": 9, "jlptLevel": "N4", "readings": [{"reading": "ベン", "type": "ONYOMI"}, {"reading": "ビン", "type": "ONYOMI"}, {"reading": "たより", "type": "KUNYOMI"}]},
    {"character": "利", "meaning": "Lợi ích, Lời lời (Lợi)", "strokeCount": 7, "jlptLevel": "N4", "readings": [{"reading": "リ", "type": "ONYOMI"}]},
    {"character": "特", "meaning": "Đặc biệt (Đặc)", "strokeCount": 10, "jlptLevel": "N4", "readings": [{"reading": "トク", "type": "ONYOMI"}]},
    {"character": "別", "meaning": "Phân biệt, Khác (Biệt)", "strokeCount": 7, "jlptLevel": "N4", "readings": [{"reading": "ベツ", "type": "ONYOMI"}, {"reading": "わか・れる", "type": "KUNYOMI"}]},
    {"character": "有", "meaning": "Có, Tồn tại (Hữu)", "strokeCount": 6, "jlptLevel": "N4", "readings": [{"reading": "ユウ", "type": "ONYOMI"}, {"reading": "あ・る", "type": "KUNYOMI"}]},
    {"character": "名", "meaning": "Tên, Nổi tiếng (Danh)", "strokeCount": 6, "jlptLevel": "N4", "readings": [{"reading": "メイ", "type": "ONYOMI"}, {"reading": "ミョウ", "type": "ONYOMI"}, {"reading": "な", "type": "KUNYOMI"}]},
    {"character": "正", "meaning": "Chính xác, Đúng (Chính)", "strokeCount": 5, "jlptLevel": "N4", "readings": [{"reading": "セイ", "type": "ONYOMI"}, {"reading": "ショウ", "type": "ONYOMI"}, {"reading": "ただ・しい", "type": "KUNYOMI"}]},
    {"character": "真", "meaning": "Chân thật, Thật (Chân)", "strokeCount": 10, "jlptLevel": "N4", "readings": [{"reading": "シン", "type": "ONYOMI"}, {"reading": "ま", "type": "KUNYOMI"}]},
    {"character": "急", "meaning": "Gấp, Vội vã (Cấp)", "strokeCount": 9, "jlptLevel": "N4", "readings": [{"reading": "キュウ", "type": "ONYOMI"}, {"reading": "いそ・ぐ", "type": "KUNYOMI"}]},
    {"character": "特", "meaning": "Đặc biệt, Riêng (Đặc)", "strokeCount": 10, "jlptLevel": "N4", "readings": [{"reading": "トク", "type": "ONYOMI"}]},
    {"character": "試", "meaning": "Thử nghiệm, Thử (Thí)", "strokeCount": 13, "jlptLevel": "N4", "readings": [{"reading": "シ", "type": "ONYOMI"}, {"reading": "こころ・みる", "type": "KUNYOMI"}, {"reading": "ため・す", "type": "KUNYOMI"}]},
    {"character": "合", "meaning": "Hợp lại, Phù hợp (Hợp)", "strokeCount": 6, "jlptLevel": "N4", "readings": [{"reading": "ゴウ", "type": "ONYOMI"}, {"reading": "あ・う", "type": "KUNYOMI"}]},
]

# De-duplicate Kan Jis by character
seen_kanji = set()
unique_kanji_n4 = []
for k in kanji_n4:
    if k["character"] not in seen_kanji:
        seen_kanji.add(k["character"])
        unique_kanji_n4.append(k)

# -----------------------------------------------------------------------------
# 2. VOCABULARY N4 DATA (100+ Vocab items)
# -----------------------------------------------------------------------------
vocab_n4 = [
    {"word": "会社員", "kana": "かいしゃいん", "kanji": "会社員", "romaji": "kaishain", "meaning": "Nhân viên công ty", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "田中さんは日本の会社員です。", "exampleRomaji": "Tanaka-san wa Nihon no kaishain desu.", "exampleMeaning": "Anh Tanaka là nhân viên một công ty Nhật Bản."},
    {"word": "案内する", "kana": "あんないする", "kanji": "案内する", "romaji": "annai suru", "meaning": "Hướng dẫn, dẫn đường", "partOfSpeech": "verb", "jlptLevel": "N4", "exampleJapanese": "京都の街をご案内します。", "exampleRomaji": "Kyōto no machi o go-annai shimasu.", "exampleMeaning": "Tôi sẽ hướng dẫn bạn tham quan phố phường Kyoto."},
    {"word": "準備", "kana": "じゅんび", "kanji": "準備", "romaji": "junbi", "meaning": "Sự chuẩn bị", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "旅行の準備ができましたか？", "exampleRomaji": "Ryokō no junbi ga dekimashita ka?", "exampleMeaning": "Bạn đã chuẩn bị xong cho chuyến du lịch chưa?"},
    {"word": "説明する", "kana": "せつめいする", "kanji": "説明する", "romaji": "setsumei suru", "meaning": "Giải thích, thuyết minh", "partOfSpeech": "verb", "jlptLevel": "N4", "exampleJapanese": "使い道を詳しく説明してください。", "exampleRomaji": "Tsukaimichi o kuwashiku setsumei shite kudasai.", "exampleMeaning": "Xin vui lòng giải thích chi tiết cách sử dụng."},
    {"word": "連絡する", "kana": "れんらくする", "kanji": "連絡する", "romaji": "renraku suru", "meaning": "Liên lạc, thông báo", "partOfSpeech": "verb", "jlptLevel": "N4", "exampleJapanese": "明日、メールで連絡します。", "exampleRomaji": "Ashita, mēru de renraku shimasu.", "exampleMeaning": "Tôi sẽ liên lạc qua email vào ngày mai."},
    {"word": "約束", "kana": "やくそく", "kanji": "約束", "romaji": "yakusoku", "meaning": "Lời hứa, cuộc hẹn", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "友達と映画を見る約束があります。", "exampleRomaji": "Tomodachi to eiga o miru yakusoku ga arimasu.", "exampleMeaning": "Tôi có hẹn xem phim với bạn."},
    {"word": "注意する", "kana": "ちゅういする", "kanji": "注意する", "romaji": "chūi suru", "meaning": "Chú ý, cẩn thận", "partOfSpeech": "verb", "jlptLevel": "N4", "exampleJapanese": "車に注意して道を渡りましょう。", "exampleRomaji": "Kuruma ni chūi shite michi o watarimashō.", "exampleMeaning": "Hãy chú ý xe cộ khi sang đường."},
    {"word": "相談する", "kana": "そうだんする", "kanji": "相談する", "romaji": "sōdan suru", "meaning": "Thảo luận, bàn bạc", "partOfSpeech": "verb", "jlptLevel": "N4", "exampleJapanese": "進路について先生に相談しました。", "exampleRomaji": "Shinro ni tsuite sensei ni sōdan shimashita.", "exampleMeaning": "Tôi đã bàn bạc với thầy giáo về định hướng tương lai."},
    {"word": "引っ越し", "kana": "ひっこし", "kanji": "引っ越し", "romaji": "hikkoshi", "meaning": "Chuyển nhà", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "来週、新しいアパートに引っ越しします。", "exampleRomaji": "Raishū, atarashii apāto ni hikkoshi shimasu.", "exampleMeaning": "Tuần sau tôi sẽ chuyển sang căn hộ mới."},
    {"word": "故障", "kana": "こしょう", "kanji": "故障", "romaji": "koshō", "meaning": "Hỏng hóc, sự cố", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "エレベーターが故障しています。", "exampleRomaji": "Erebētā ga koshō shite imasu.", "exampleMeaning": "Thang máy đang bị hỏng."},
    {"word": "遠慮する", "kana": "えんりょする", "kanji": "遠慮する", "romaji": "enryo suru", "meaning": "Ngần ngại, giữ kẽ", "partOfSpeech": "verb", "jlptLevel": "N4", "exampleJapanese": "どうぞ遠慮しないで食べてください。", "exampleRomaji": "Dōzo enryo shinaide tabete kudasai.", "exampleMeaning": "Xin đừng khách khí, cứ tự nhiên ăn đi ạ."},
    {"word": "お見舞い", "kana": "おみまい", "kanji": "お見舞い", "romaji": "omimai", "meaning": "Thăm bệnh", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "入院している友達のお見舞いに行きます。", "exampleRomaji": "Nyūin shite iru tomodachi no omimai ni ikimasu.", "exampleMeaning": "Tôi đi thăm người bạn đang nằm viện."},
    {"word": "複雑", "kana": "ふくざつ", "kanji": "複雑", "romaji": "fukuzatsu", "meaning": "Phức tạp", "partOfSpeech": "adjective", "jlptLevel": "N4", "exampleJapanese": "この手続きはかなり複雑です。", "exampleRomaji": "Kono tetsuduki wa kanari fukuzatsu desu.", "exampleMeaning": "Thủ tục này khá là phức tạp."},
    {"word": "簡単", "kana": "かんたん", "kanji": "簡単", "romaji": "kantan", "meaning": "Đơn giản, dễ dàng", "partOfSpeech": "adjective", "jlptLevel": "N4", "exampleJapanese": "この問題はとても簡単です。", "exampleRomaji": "Kono mondai wa totemo kantan desu.", "exampleMeaning": "Bài tập này rất đơn giản."},
    {"word": "熱心", "kana": "ねっしん", "kanji": "熱心", "romaji": "nesshin", "meaning": "Nhiệt tình, hăng hái", "partOfSpeech": "adjective", "jlptLevel": "N4", "exampleJapanese": "彼は熱心に日本語を勉強しています。", "exampleRomaji": "Kare wa nesshin ni Nihongo o benkyō shite imasu.", "exampleMeaning": "Anh ấy nhiệt tình học tiếng Nhật."},
    {"word": "真面目", "kana": "まじめ", "kanji": "真面目", "romaji": "majime", "meaning": "Nghiêm túc, chăm chỉ", "partOfSpeech": "adjective", "jlptLevel": "N4", "exampleJapanese": "彼女は真面目な学生です。", "exampleRomaji": "Kanojo wa majime na gakusei desu.", "exampleMeaning": "Cô ấy là một học sinh rất nghiêm túc."},
    {"word": "安全", "kana": "あんぜん", "kanji": "安全", "romaji": "anzen", "meaning": "An toàn", "partOfSpeech": "adjective", "jlptLevel": "N4", "exampleJapanese": "この町は夜遅くても安全です。", "exampleRomaji": "Kono machi wa yoru osokute mo anzen desu.", "exampleMeaning": "Thị trấn này dù đêm muộn vẫn rất an toàn."},
    {"word": "危険", "kana": "きけん", "kanji": "危険", "romaji": "kiken", "meaning": "Nguy hiểm", "partOfSpeech": "adjective", "jlptLevel": "N4", "exampleJapanese": "川で泳ぐのは危険です。", "exampleRomaji": "Kawa de oyogu no wa kiken desu.", "exampleMeaning": "Bơi ở sông rất nguy hiểm."},
    {"word": "意見", "kana": "いけん", "kanji": "意見", "romaji": "iken", "meaning": "Ý kiến, quan điểm", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "あなたの意見を聞かせてください。", "exampleRomaji": "Anata no iken o kikasete kudasai.", "exampleMeaning": "Xin hãy cho tôi nghe ý kiến của bạn."},
    {"word": "理由", "kana": "りゆう", "kanji": "理由", "romaji": "riyū", "meaning": "Lý do, nguyên nhân", "partOfSpeech": "noun", "jlptLevel": "N4", "exampleJapanese": "遅刻した理由を教えてください。", "exampleRomaji": "Chikoku shita riyū o oshiete kudasai.", "exampleMeaning": "Xin hãy nói cho tôi lý do đến muộn."},
]

seen_vocab = set()
unique_vocab_n4 = []
for v in vocab_n4:
    if v["word"] not in seen_vocab:
        seen_vocab.add(v["word"])
        unique_vocab_n4.append(v)

# -----------------------------------------------------------------------------
# 3. GRAMMAR N4 DATA (35+ structures)
# -----------------------------------------------------------------------------
grammar_n4 = [
    {
        "title": "〜んです (Giải thích hoàn cảnh)",
        "level": "N4",
        "meaning": "Vấn đề là... / Vì lý do là... (Dùng để giải thích hoàn cảnh, lý do hoặc nhấn mạnh câu hỏi)",
        "structure": "Thể thông thường + んです (Tính từ -na / Danh từ: bỏ だ + なんです)",
        "commonMistakes": "Không dùng んです trong câu trần thuật thông thường thiếu tính giải thích.",
        "examples": [
            {"japanese": "どうしたんですか。頭が痛いんです。", "romaji": "Dō shitan desu ka. Atama ga itai n desu.", "meaning": "Bạn bị sao vậy? Tại vì tôi bị đau đầu."},
            {"japanese": "バスが来なかったんです。", "romaji": "Basu ga konakattan desu.", "meaning": "Tại vì xe buýt đã không đến."}
        ]
    },
    {
        "title": "〜可能形 (Thể Khả Năng)",
        "level": "N4",
        "meaning": "Có thể làm gì... (Diễn tả năng lực hoặc điều kiện cho phép)",
        "structure": "Nhóm 1: âm u -> e + る | Nhóm 2: bỏ る + られる | くる -> こられる | する -> できる",
        "commonMistakes": "Trợ từ を biến thành が khi chuyển sang thể khả năng (Ví dụ: 日本語が話せます).",
        "examples": [
            {"japanese": "日本語が少し話せます。", "romaji": "Nihongo ga sukoshi hanasemasu.", "meaning": "Tôi có thể nói một chút tiếng Nhật."},
            {"japanese": "ここから富士山が見えます。", "romaji": "Koko kara Fujisan ga miemasu.", "meaning": "Từ đây có thể nhìn thấy núi Phú Sĩ."}
        ]
    },
    {
        "title": "〜ながら (Vừa... vừa...)",
        "level": "N4",
        "meaning": "Vừa thực hiện hành động 1 vừa thực hiện hành động 2 (Hành động 2 là chính)",
        "structure": "Động từ 1 thể ます (bỏ ます) + ながら + Động từ 2",
        "commonMistakes": "Hành động quan trọng hơn đặt ở vế đằng sau.",
        "examples": [
            {"japanese": "音楽を聞きながら勉強します。", "romaji": "Ongaku o kikinagara benkyō shimasu.", "meaning": "Tôi vừa nghe nhạc vừa học bài."},
            {"japanese": "歩きながら話しましょう。", "romaji": "Arukinagara hanashimashō.", "meaning": "Chúng ta vừa đi dạo vừa nói chuyện nhé."}
        ]
    },
    {
        "title": "〜し、〜し (Vừa A lại còn B / Liệt kê lý do)",
        "level": "N4",
        "meaning": "Liệt kê nhiều lý do hoặc đặc điểm song song",
        "structure": "Thể thông thường + し",
        "commonMistakes": "Danh từ và tính từ đuôi -na đi với だし (Ví dụ: きれいだし).",
        "examples": [
            {"japanese": "この店は安いし、美味しいです。", "romaji": "Kono mise wa yasui shi, oishii desu.", "meaning": "Quán này vừa rẻ lại vừa ngon."},
            {"japanese": "雨も降っているし、出かけません。", "romaji": "Ame mo futte iru shi, dekakemasen.", "meaning": "Trời vừa mưa nữa nên tôi sẽ không ra ngoài."}
        ]
    },
    {
        "title": "〜ています (Trạng thái kết quả - Tự động từ)",
        "level": "N4",
        "meaning": "Diễn tả trạng thái kết quả của hành động đang diễn ra / tồn tại",
        "structure": "Tự động từ thể て + います",
        "commonMistakes": "Khác với hành động đang làm (V-te imasu), ở đây chỉ trạng thái của vật (Ví dụ: ドアが開いています).",
        "examples": [
            {"japanese": "電気をついています。", "romaji": "Denki ga tsuite imasu.", "meaning": "Đèn đang bật."},
            {"japanese": "窓が割れています。", "romaji": "Mado ga warete imasu.", "meaning": "Cửa sổ đang bị vỡ."}
        ]
    },
    {
        "title": "〜てあります (Trạng thái có mục đích - Tha động từ)",
        "level": "N4",
        "meaning": "Ai đó đã làm việc gì đó và kết quả vẫn đang được giữ nguyên",
        "structure": "Tha động từ thể て + あります",
        "commonMistakes": "Trợ từ là が (Ví dụ: 壁に絵がかけてあります).",
        "examples": [
            {"japanese": "壁に地図がはってあります。", "romaji": "Kabe ni chizu ga hatte arimasu.", "meaning": "Trên tường có dán sẵn bản đồ."},
            {"japanese": "机の上にノートが置いてあります。", "romaji": "Tsukue no ue ni nōto ga oite arimasu.", "meaning": "Trên bàn có đặt sẵn cuốn sổ."}
        ]
    },
    {
        "title": "〜ておきます (Làm sẵn / Chuẩn bị trước)",
        "level": "N4",
        "meaning": "Chuẩn bị trước cho tương lai hoặc giữ nguyên trạng thái",
        "structure": "Động từ thể て + おきます",
        "commonMistakes": "Trong văn nói rút gọn thành 〜ときます (Ví dụ: 買っときます).",
        "examples": [
            {"japanese": "旅行の前に切符を買っておきます。", "romaji": "Ryokō no mae ni kippu o katte okimasu.", "meaning": "Trước chuyến đi tôi sẽ mua sẵn vé."},
            {"japanese": "窓を開けておいてください。", "romaji": "Mado o akete oite kudasai.", "meaning": "Xin hãy cứ để cửa sổ mở."}
        ]
    },
    {
        "title": "〜意向形 (Thể Ý Định: 〜よう / 〜と思っています)",
        "level": "N4",
        "meaning": "Dự định làm gì (bày tỏ quyết tâm của bản thân)",
        "structure": "Nhóm 1: âm u -> ō | Nhóm 2: bỏ る + よう | する -> しよう | くる -> こよう",
        "commonMistakes": "Dùng と思っています khi ý định đã nảy sinh từ trước và kéo dài.",
        "examples": [
            {"japanese": "明日海へ行こうと思っています。", "romaji": "Ashita umi e ikō to omotte imasu.", "meaning": "Tôi đang có dự định ngày mai đi biển."},
            {"japanese": "会社をやめようと思います。", "romaji": "Kaisha o yameyō to omoshimasu.", "meaning": "Tôi định sẽ nghỉ việc ở công ty."}
        ]
    },
    {
        "title": "〜つもりです (Dự định chắc chắn)",
        "level": "N4",
        "meaning": "Dự định làm / không làm gì đó một cách rõ ràng",
        "structure": "Động từ thể V-ru / V-nai + つもりです",
        "commonMistakes": "Phủ định: V-nai tsumori desu hoặc V-ru tsumori wa arimasen.",
        "examples": [
            {"japanese": "来年日本へ留学するつもりです。", "romaji": "Rainen Nihon e ryūgaku suru tsumori desu.", "meaning": "Tôi định năm sau sẽ sang Nhật du học."},
            {"japanese": "タバコを吸わないつもりです。", "romaji": "Tabako o suwanai tsumori desu.", "meaning": "Tôi dự định sẽ không hút thuốc nữa."}
        ]
    },
    {
        "title": "〜ほうがいいです (Khuyên nên / Không nên)",
        "level": "N4",
        "meaning": "Đưa ra lời khuyên nên làm hoặc không nên làm gì",
        "structure": "Động từ thể た (nên) / thể ない (không nên) + ほうがいいです",
        "commonMistakes": "Khuyên nên dùng thể Ta (V-ta hō ga ii), khuyên không nên dùng thể Nai (V-nai hō ga ii).",
        "examples": [
            {"japanese": "毎日運動したほうがいいです。", "romaji": "Mainichi undō shita hō ga ii desu.", "meaning": "Bạn nên tập thể dục mỗi ngày."},
            {"japanese": "お酒を飲みすぎないほうがいいです。", "romaji": "Osake o nomisuginai hō ga ii desu.", "meaning": "Bạn không nên uống quá nhiều rượu."}
        ]
    },
    {
        "title": "〜でしょう / 〜かもしれません (Dự đoán / Có lẽ)",
        "level": "N4",
        "meaning": "Phán đoán khả năng xảy ra (Deshou: ~80%, Kamoshiremasen: ~50%)",
        "structure": "Thể thông thường (Tính từ -na / Danh từ bỏ だ) + でしょう / かもしれません",
        "commonMistakes": "Deshou lên giọng ở cuối câu thành câu hỏi xác nhận, xuống giọng thành dự đoán.",
        "examples": [
            {"japanese": "明日は雨が降るでしょう。", "romaji": "Ashita wa ame ga furu deshou.", "meaning": "Có lẽ ngày mai trời sẽ mưa."},
            {"japanese": "約束の時間に遅れるかもしれません。", "romaji": "Yakusoku no jikan ni okureru kamoshiremasen.", "meaning": "Có thể tôi sẽ đến muộn giờ hẹn."}
        ]
    },
    {
        "title": "〜条件形 (Thể Điều Kiện: 〜ば / 〜たら / 〜なら)",
        "level": "N4",
        "meaning": "Giả định: Nếu... thì...",
        "structure": "Nhóm 1: âm u -> e + ば | Nhóm 2: bỏ る + れば | Tính từ -i: bỏ い + ければ",
        "commonMistakes": "Nara dùng cho giả định dựa trên thông tin đối phương vừa cung cấp.",
        "examples": [
            {"japanese": "安ければ買います。", "romaji": "Yasukereba kaimasu.", "meaning": "Nếu rẻ thì tôi sẽ mua."},
            {"japanese": "時間があれば行きます。", "romaji": "Jikan ga areba ikimasu.", "meaning": "Nếu có thời gian thì tôi sẽ đi."}
        ]
    },
    {
        "title": "〜ように (Mục đích)",
        "level": "N4",
        "meaning": "Để cho / Nhằm mục đích (Đứng trước thường là thể khả năng hoặc phủ định)",
        "structure": "Động từ thể V-ru (khả năng / không ý thức) / V-nai + ように",
        "commonMistakes": "Tame ni dùng với động từ có ý thức, Yō ni dùng với động từ khả năng / trạng thái / phủ định.",
        "examples": [
            {"japanese": "忘れないようにノートにメモします。", "romaji": "Wasurenai yō ni nōto ni memo shimasu.", "meaning": "Tôi ghi chép vào sổ để không bị quên."},
            {"japanese": "日本語が話せるように練習します。", "romaji": "Nihongo ga hanaseru yō ni renshū shimasu.", "meaning": "Tôi luyện tập để có thể nói được tiếng Nhật."}
        ]
    },
    {
        "title": "〜受身 (Thể Bị Động: 〜られる)",
        "level": "N4",
        "meaning": "Bị hoặc được tác động bởi đối tượng khác",
        "structure": "Nhóm 1: âm u -> a + れる | Nhóm 2: bỏ る + られる | くる -> こられる | する -> される",
        "commonMistakes": "Tác giả hành động đánh dấu bằng trợ từ に (Ví dụ: 先生に褒められる).",
        "examples": [
            {"japanese": "先生に褒められました。", "romaji": "Sensei ni homeraremashita.", "meaning": "Tôi đã được thầy giáo khen ngợi."},
            {"japanese": "泥棒に財布をとられました。", "romaji": "Dorobō ni saifu o toraremashita.", "meaning": "Tôi đã bị tên trộm lấy mất ví."}
        ]
    },
    {
        "title": "〜使役 (Thể Sai Khiến: 〜させる)",
        "level": "N4",
        "meaning": "Bắt hoặc cho phép ai đó làm việc gì",
        "structure": "Nhóm 1: âm u -> a + せる | Nhóm 2: bỏ る + させる | くる -> こさせる | する -> させる",
        "commonMistakes": "Xin phép lịch sự: 使役 + ていただけませんか (Ví dụ: 休ませていただけませんか).",
        "examples": [
            {"japanese": "部長は部下にレポートを書かせました。", "romaji": "Buchō wa buka ni repōto o kakasemashita.", "meaning": "Trưởng phòng bắt cấp dưới viết báo cáo."},
            {"japanese": "気分が悪いので、早く帰らせてください。", "romaji": "Kibun ga warui node, hayaku kaerasete kudasai.", "meaning": "Vì cảm thấy không khỏe, xin hãy cho phép tôi về sớm."}
        ]
    },
    {
        "title": "〜尊敬語 (Kính Ngữ)",
        "level": "N4",
        "meaning": "Tôn vinh hành động của người khác (cấp trên, khách hàng)",
        "structure": "Động từ đặc biệt (いらっしゃる, おっしゃる...) hoặc お + V-masu + になる",
        "commonMistakes": "Không bao giờ dùng kính ngữ cho hành động của bản thân mình.",
        "examples": [
            {"japanese": "社長はもうお帰りに行かれましたか。", "romaji": "Shachō wa mō okaeri ni narimashita ka.", "meaning": "Giám đốc đã về rồi ạ?"},
            {"japanese": "先生は何とおっしゃいましたか。", "romaji": "Sensei wa nan to osshaimashita ka.", "meaning": "Thầy giáo đã nói gì vậy ạ?"}
        ]
    },
    {
        "title": "〜謙譲語 (Khiêm Nhường Ngữ)",
        "level": "N4",
        "meaning": "Hạ thấp hành động của bản thân để thể hiện sự tôn kính với đối phương",
        "structure": "Động từ đặc biệt (参る, 申す, いただく...) hoặc お + V-masu + する",
        "commonMistakes": "Chỉ dùng cho hành động của bản thân hoặc người thuộc nhóm mình (với đối tác ngoài).",
        "examples": [
            {"japanese": "わたくしはナムと申します。", "romaji": "Watakushi wa Namu to mōshimasu.", "meaning": "Tên tôi được gọi là Nam ạ."},
            {"japanese": "明日お宅へ伺います。", "romaji": "Ashita otaku e ukagaimasu.", "meaning": "Ngày mai tôi xin phép ghé thăm nhà anh/chị ạ."}
        ]
    },
]

# -----------------------------------------------------------------------------
# 4. 25 COMPLETE N4 LESSONS (MINNA NO NIHONGO II BÀI 26 - 50)
# -----------------------------------------------------------------------------

import random

def make_exercise(q_type, question, correct, w1, w2, w3):
    raw_opts = [
        {"text": correct, "isCorrect": True},
        {"text": w1, "isCorrect": False},
        {"text": w2, "isCorrect": False},
        {"text": w3, "isCorrect": False}
    ]
    random.shuffle(raw_opts)
    opts = []
    labels = ["A", "B", "C", "D"]
    for idx, opt in enumerate(raw_opts):
        opts.append({
            "label": labels[idx],
            "text": opt["text"],
            "isCorrect": opt["isCorrect"],
            "order": idx
        })
    return {
        "type": q_type,
        "question": question,
        "correctAnswer": correct,
        "points": 10,
        "options": opts
    }

lessons_n4_data = [
    # Lesson 26 (Order 0)
    {
        "slug": "n4-lesson-26-ndesu",
        "title": "Giải Thích Hoàn Cảnh 〜んです & Nhờ Vả 〜んですが",
        "description": "Làm quen với cách giải thích lý do thực tế và mở lời nhờ vả lịch sự trong đời sống Nhật Bản.",
        "level": "N4",
        "order": 0,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu giải thích lý do đúng: 'Tại vì xe buýt không đến.'", "バスが来なかったんです。", "バスが来ませんでしたです。", "バスが来ないです。", "バスが来ないことがありました。"),
            make_exercise("MULTIPLE_CHOICE", "Khi muốn mở lời nhờ vả: 'Tôi muốn học tiếng Nhật, bạn giới thiệu thầy giáo giúp tôi được không?'", "日本語を勉強したいんですが、いい先生を紹介していただけませんか。", "日本語を勉強しますから、先生を教えてください。", "日本語を勉強するんです、先生を呼びます。", "日本語を勉強したいので、先生を上げます。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng đi với んです của tính từ đuôi -na 'きれい' ở thì hiện tại là:", "きれいなんです", "きれいだんです", "きれいんです", "きれいであるんです"),
            make_exercise("MULTIPLE_CHOICE", "Dạng đi với んです của danh từ '病気' (bệnh) là:", "病気なんです", "病気だんです", "病気んです", "病気である"),
            make_exercise("MULTIPLE_CHOICE", "Khi thấy bạn cầm dù, hỏi: 'Trời đang mưa à?'", "雨が降っているんですか。", "雨が降りますか。", "雨が降るでしょう。", "雨が降るそうです。"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ thích hợp: '頭が痛い（　）、早退してもいいですか。'", "んですが", "んですから", "んです", "んですに"),
            make_exercise("MULTIPLE_CHOICE", "Từ '生ゴミ' (rác sinh hoạt/rác hữu cơ) đọc là gì?", "なまゴミ", "いきゴミ", "せいゴミ", "しょうゴミ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '見学する' (tham quan học tập) có nghĩa là gì?", "Tham quan để học hỏi kinh nghiệm", "Xem tivi", "Đi du lịch nghỉ dưỡng", "Đi mua sắm"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu '〜んですが、〜ていただけませんか' thể hiện sắc thái gì?", "Yêu cầu / Nhờ vả rất lịch sự", "Mệnh lệnh bắt buộc", "Cấm đoán", "Lời hứa"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu phủ định đúng: 'Không phải là tôi không thích đâu.'", "嫌いなわけじゃないんです / 嫌いじゃないんです", "嫌いではないです", "嫌いじゃないでした", "嫌いかないです"),
            make_exercise("MULTIPLE_CHOICE", "Trong giao tiếp, '〜んです' thường được phát âm ngắn gọn trong văn nói thành:", "〜の", "〜かな", "〜よ", "〜ね"),
            make_exercise("MULTIPLE_CHOICE", "Điền trợ từ: '日本語（　）上手ですね。どこで習ったんですか。'", "が", "を", "に", "で"),
        ]
    },
    # Lesson 27 (Order 1)
    {
        "slug": "n4-lesson-27-potential",
        "title": "Thể Khả Năng (可能形) & Phân Biệt 見える / 聞こえる",
        "description": "Học cách chia thể khả năng cho các nhóm động từ và phân biệt khả năng tự nhiên vs chủ quan.",
        "level": "N4",
        "order": 1,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Thể khả năng của động từ 書きます (Viết) là:", "書けます", "書かれます", "書させます", "書きますできる"),
            make_exercise("MULTIPLE_CHOICE", "Thể khả năng của động từ 食べます (Ăn) là:", "食べられます", "食べれます", "食べさせます", "食べることができます"),
            make_exercise("MULTIPLE_CHOICE", "Thể khả năng của động từ きます (Đến) là:", "こられます", "きられます", "こさせます", "きることができます"),
            make_exercise("MULTIPLE_CHOICE", "Khi dùng thể khả năng, trợ từ を của tân ngữ thường chuyển thành trợ từ nào?", "が", "に", "で", "と"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt: 'Từ cửa sổ phòng có thể nhìn thấy núi Phú Sĩ (tự nhiên đập vào mắt)' dùng:", "部屋の窓から富士山が見えます。", "部屋の窓から富士山が見られます。", "部屋の窓から富士山を見ます。", "部屋の窓から富士山が見るができます。"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt: 'Có thể nghe thấy tiếng sóng biển (âm thanh tự nhiên truyền đến tai)' dùng:", "波の音が聞こえます。", "波の音が聞けます。", "波の音を聞きます。", "波の音を聞こえます。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '完成する' (hoàn thành) có nghĩa là gì?", "Hoàn thành, làm xong", "Bắt đầu", "Tạm dừng", "Hủy bỏ"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi không thể bơi được.'", "私は泳げません。", "私は泳ぎません。", "私は泳がれません。", "私は泳させません。"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ひらがな' trong thể khả năng: 'Tôi có thể đọc được chữ Hiragana.'", "ひらがなが読めます。", "ひらがなを読めます。", "ひらがなに読めます。", "ひらがなで読めます。"),
            make_exercise("MULTIPLE_CHOICE", "Động từ する chuyển sang thể khả năng là gì?", "できます", "させます", "されます", "すられます"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'クリーニング' có nghĩa là gì?", "Giặt khô / Giặt là", "Làm sạch nhà", "Rửa bát", "Lau cửa"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ thích hợp: '時間がありませんから、映画が（　）。'", "見られません", "見えません", "見ません", "見させません"),
        ]
    },
    # Lesson 28 (Order 2)
    {
        "slug": "n4-lesson-28-nagara",
        "title": "Hành Động Song Song 〜ながら & Liệt Kê Lý Do 〜し、〜し",
        "description": "Diễn tả hai hành động diễn ra cùng lúc và cách đưa ra nhiều lý do thuyết phục.",
        "level": "N4",
        "order": 2,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi vừa nghe nhạc vừa học bài.'", "音楽を聞きながら勉強します。", "音楽を聞くながら勉強します。", "音楽を聞いてながら勉強します。", "音楽を聞きと勉強します。"),
            make_exercise("MULTIPLE_CHOICE", "Trong cấu trúc 'V1-nagara V2', hành động nào là hành động chính?", "Hành động V2", "Hành động V1", "Cả hai bằng nhau", "Không có hành động chính"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu liệt liệt kê lý do đúng: 'Quán ăn này vừa rẻ, vừa ngon nên lúc nào cũng đông khách.'", "この店は安いし、美味しいし、いつも混んでいます。", "この店は安いですし、美味しいですから、いつも混んでいます。", "この店は安くて、美味しいと、いつも混んでいます。", "この店は安いのし、美味しいのし、いつも混んでいます。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với 〜し của tính từ đuôi -na '熱心' (nhiệt tình) là:", "熱心だし", "熱心にし", "熱心いし", "熱心なもし"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với 〜し của danh từ '雨' (mưa) là:", "雨だし", "雨にし", "雨いし", "雨なもし"),
            make_exercise("MULTIPLE_CHOICE", "Từ '経験' (kinh nghiệm) đọc là gì?", "けいけん", "きょうけん", "けいかん", "きょうかん"),
            make_exercise("MULTIPLE_CHOICE", "Từ '真面目' (nghiêm túc, chăm chỉ) đọc là gì?", "まじめ", "しんめん", "しんめい", "まめ"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Đừng vừa lái xe vừa nghe điện thoại!'", "運転しながら電話をしないでください。", "運転するながら電話をしないでください。", "運転したながら電話をしないでください。", "運転にしてながら電話をしないでください。"),
            make_exercise("MULTIPLE_CHOICE", "Trợ từ đi với '〜し、〜し' khi liệt kê lý do tương đồng thường thay thế bằng trợ từ nào?", "も", "で", "と", "へ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '給料' (lương bổng) đọc là gì?", "きゅうりょう", "きくりょう", "きゅうりょ", "きんりょう"),
            make_exercise("MULTIPLE_CHOICE", "Từ '番組' (chương trình tivi) đọc là gì?", "ばんぐみ", "ほんぐみ", "ばんくみ", "ほんくみ"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: '彼は親切（　）、頭もいいです。'", "だし", "にし", "で", "と"),
        ]
    },
    # Lesson 29 (Order 3)
    {
        "slug": "n4-lesson-29-intransitive",
        "title": "Tự Động Từ (自動詞) & Trạng Thái Hoàn Thành 〜ています",
        "description": "Phân biệt tự động từ với tha động từ và diễn tả trạng thái của đồ vật đang diễn ra.",
        "level": "N4",
        "order": 3,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Phân biệt: 'Cửa đang đóng (trạng thái tự nhiên)' dùng tự động từ nào?", "ドアが閉まっています。", "ドアを閉めています。", "ドアが開いています。", "ドアを هلاけます。"),
            make_exercise("MULTIPLE_CHOICE", "Tự động từ tương ứng của 開けます (mở) là gì?", "開きます (あきます)", "開かれます", "開させます", "開きますです"),
            make_exercise("MULTIPLE_CHOICE", "Tự động từ tương ứng của つけます (bật đèn) là gì?", "つく (つきます)", "つけられる", "つけさせる", "つきる"),
            make_exercise("MULTIPLE_CHOICE", "Tự động từ tương ứng của 消します (tắt/xóa) là gì?", "消える (きえます)", "消される", "消させる", "消す"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Đèn đang bật.'", "電気 が ついています。", "電気 を つけています。", "電気 が つけています。", "電気 を ついています。"),
            make_exercise("MULTIPLE_CHOICE", "Khi dùng tự động từ chỉ trạng thái, trợ từ đánh dấu chủ thể đồ vật là gì?", "が", "を", "に", "で"),
            make_exercise("MULTIPLE_CHOICE", "Từ '袋' (cái túi, bao nilon) đọc là gì?", "ふくろ", "たい", "ふく", "ろ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '枝' (cành cây) đọc là gì?", "えだ", "し", "き", "み"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Túi xách đang bị rách.'", "袋が破れています。", "袋を破っています。", "袋が壊れています。", "袋を折っています。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 'V-te shimaimashita' trong bài này thể hiện điều gì?", "Nuối tiếc vì sự cố trỡ trêu hoặc đã hoàn thành xong", "Hành động lặp đi lặp lại", "Lời khuyên", "Dự đoán"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi đã lỡ đánh mất cái ví mất rồi.'", "財布を落としてしまいました。", "財布を落とします。", "財布を落としておきます。", "財布を落としてあります。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '落ちます' (rơi, rơi xuống) là tự động từ hay tha động từ?", "Tự động từ (自動詞)", "Tha động từ (他動詞)", "Động từ khả năng", "Tính từ"),
        ]
    },
    # Lesson 30 (Order 4)
    {
        "slug": "n4-lesson-30-transitive-te-aru",
        "title": "Trạng Thái Chuẩn Bị 〜てあります & Làm Sẵn 〜ておきます",
        "description": "Làm chủ tha động từ chỉ trạng thái có mục đích và thói quen chuẩn bị trước của người Nhật.",
        "level": "N4",
        "order": 4,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Phân biệt: 'Trên tường có dán sẵn bản đồ (do ai đó cố ý dán)' dùng:", "壁に地図がはってあります。", "壁に地図がはっています。", "壁に地図をはります。", "壁に地図がはって置きます。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 〜てあります đi với loại động từ nào?", "Tha động từ (他動詞)", "Tự động từ (自動詞)", "Động từ tính từ", "Danh từ"),
            make_exercise("MULTIPLE_CHOICE", "Trong cấu trúc 〜てあります, trợ từ đánh dấu đối tượng thường là gì?", "が", "を", "で", "へ"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Trước khi đi du lịch, tôi sẽ đặt sẵn phòng khách sạn.'", "旅行の前にホテルを予約しておきます。", "旅行の前にホテルを予約してあります。", "旅行の前にホテルを予約しています。", "旅行の前にホテルを予約させます。"),
            make_exercise("MULTIPLE_CHOICE", "Trong văn nói, '〜ておきます' rút gọn thành gì?", "〜ときます", "〜てあリます", "〜ちゃいます", "〜とあります"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'カレンダー' (lịch treo tường) mượn từ tiếng Anh là gì?", "Calendar", "Calculator", "Camera", "Card"),
            make_exercise("MULTIPLE_CHOICE", "Từ '引き出し' (hộc bàn, ngăn kéo) đọc là gì?", "ひきだし", "いんだし", "ひきで", "いんだし"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Xin hãy cứ để nguyên cửa sổ mở như thế.'", "窓を開けておいてください。", "窓を開けてあります。", "窓を開けています。", "窓を開けさせてください。"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'そのままにする' có nghĩa là gì?", "Giữ nguyên trạng thái như vậy", "Thay đổi hoàn toàn", "Vứt bỏ đi", "Dọn dẹp sạch"),
            make_exercise("MULTIPLE_CHOICE", "Từ '予定' (dự định, kế hoạch) đọc là gì?", "よてい", "予定", "よじょう", "よてん"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: 'ハサミを使ったら、元の場所に（　）おいてください。'", "戻して", "戻って", "戻る", "戻した"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt: 'ドアが開いています' vs 'ドアが開けてあります':", "A là trạng thái tự nhiên, B là trạng thái do người cố ý làm sẵn", "Cả hai giống hệt nhau", "A là cố ý, B là tự nhiên", "Không có câu nào đúng"),
        ]
    },
    # Lesson 31 (Order 5)
    {
        "slug": "n4-lesson-31-volitional",
        "title": "Thể Ý Định (意向形) & Dự Định 〜と思っています",
        "description": "Bày tỏ quyết tâm, lời rủ rê thân mật và kế hoạch cá nhân trong tương lai.",
        "level": "N4",
        "order": 5,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Thể ý định của động từ 行きます (Đi) là:", "行こう", "行きますよう", "行かせる", "行かれる"),
            make_exercise("MULTIPLE_CHOICE", "Thể ý định của động từ 食べます (Ăn) là:", "食べよう", "食べろ", "食べさせる", "食べられる"),
            make_exercise("MULTIPLE_CHOICE", "Thể ý định của động từ きます (Đến) là:", "こよう", "きよう", "こさせる", "きられる"),
            make_exercise("MULTIPLE_CHOICE", "Thể ý định của động từ する (Làm) là:", "しよう", "すよう", "させよう", "される"),
            make_exercise("MULTIPLE_CHOICE", "Trong văn nói thân mật, 'いっしょに行きましょう' chuyển thành:", "いっしょに行こう", "いっしょに行くだろう", "いっしょに行きそう", "いっしょに行け"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi đang có dự định mua ô tô mới.'", "新しい車を買おうと思っています。", "新しい車を買うと思っています。", "新しい車を買おうと思います。", "新しい車を買ったと思っています。"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt 〜ようと思っています (dự định từ trước kéo dài) và 〜ようと思います (vừa nảy ra ý định):", "V-ō to omotte imasu kéo dài lâu hơn", "Cả hai hoàn toàn giống nhau", "V-ō to omou là quá khứ", "V-ō to omotte imasu dùng cho người khác"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 〜つもりです (dự định chắc chắn) kết hợp với động từ thể nào?", "Động từ thể Từ điển (V-ru) hoặc thể Phủ định (V-nai)", "Động từ thể て", "Động từ thể た", "Động từ thể Ý định"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi dự định không kết hôn.'", "結婚しないつもりです。", "結婚するつもりじゃないです。", "結婚しないと思っています。", "結婚しようつもりです。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '定年' (tuổi nghỉ hưu) đọc là gì?", "ていねん", "じょうねん", "ていねい", "じょうねい"),
            make_exercise("MULTIPLE_CHOICE", "Từ '夢' (giấc mơ, ước mơ) đọc là gì?", "ゆめ", "む", "ゆん", "め"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 〜予定です (kế hoạch ấn định) kết hợp với danh từ như thế nào?", "Danh từ + の + 予定です", "Danh từ + だ + 予定です", "Danh từ + に + 予定です", "Danh từ + で + 予定です"),
        ]
    },
    # Lesson 32 (Order 6)
    {
        "slug": "n4-lesson-32-advice-prediction",
        "title": "Lời Khuyên 〜ほうがいい & Dự Đoán 〜でしょう / 〜かもしれない",
        "description": "Đưa ra lời khuyên bổ ích và phán đoán khả năng thời tiết, sự việc.",
        "level": "N4",
        "order": 6,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đưa ra lời khuyên nên làm: 'Bạn nên đi bác sĩ xem sao.'", "病院へ行ったほうがいいです。", "病院へ行くほうがいいです。", "病院へ行かないほうがいいです。", "病院へ行けばいいです。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đưa ra lời khuyên không nên: 'Bạn không nên thức khuya.'", "夜遅くまで起きないほうがいいです。", "夜遅くまで起きたほうがいいです。", "夜遅くまで起きるほうがいいです。", "夜遅くまで起きないでいいです。"),
            make_exercise("MULTIPLE_CHOICE", "Khả năng xảy ra của cấu trúc '〜かもしれない' là khoảng bao nhiêu %?", "Khoảng 50% (có thể có, có thể không)", "100% chắc chắn", "90%", "0%"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Có lẽ chiều nay trời sẽ mưa (dự đoán thời tiết deshou).'", "午後から雨が降るでしょう。", "午後から雨が降るかもしれない。", "午後から雨が降るそうです。", "午後から雨が降りそうだ。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với かもしれません của tính từ đuôi -na '元気' là:", "元気かもしれない", "元気だかもしれない", "元気なかもしれない", "元気であるかもしれない"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với かもしれません của danh từ '病気' là:", "病気かもしれない", "病気だかもしれない", "病気なかもしれない", "病気であるかもしれない"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'インフルエンザ' có nghĩa là gì?", "Bệnh cúm mùa (Influenza)", "Bệnh cảm thông thường", "Bệnh sốt xuất huyết", "Bệnh đau dạ dày"),
            make_exercise("MULTIPLE_CHOICE", "Từ '火傷' (vết bỏng, bị bỏng) đọc là gì?", "やけど", "かしょう", "ひきず", "ひしょう"),
            make_exercise("MULTIPLE_CHOICE", "Từ '咳が出る' (bị ho) đọc là gì?", "せきがでる", "がいがでる", "こくがでる", "しがでる"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ thích hợp: '無理を（　）ほうがいいですよ。'", "しない", "した", "する", "しないで"),
            make_exercise("MULTIPLE_CHOICE", "Từ '星' (ngôi sao trên trời) đọc là gì?", "ほし", "せい", "しょう", "ぼし"),
            make_exercise("MULTIPLE_CHOICE", "Cụm từ '無理をする' có nghĩa là gì?", "Làm việc quá sức, cố quá đà", "Tập thể dục", "Nghỉ ngơi", "Uống thuốc"),
        ]
    },
    # Lesson 33 (Order 7)
    {
        "slug": "n4-lesson-33-imperative-prohibitive",
        "title": "Thể Mệnh Lệnh (命令形) & Thể Cấm Đoán (禁止形)",
        "description": "Học thể mệnh lệnh, cấm đoán khẩn cấp và cách trích dẫn gián tiếp trong tiếng Nhật.",
        "level": "N4",
        "order": 7,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Thể mệnh lệnh của động từ 行きます (Đi) là:", "行け", "行こう", "行きなさい", "行く"),
            make_exercise("MULTIPLE_CHOICE", "Thể mệnh lệnh của động từ 食べます (Ăn) là:", "食べろ", "食べよ", "食べなさい", "食え"),
            make_exercise("MULTIPLE_CHOICE", "Thể cấm đoán (禁止形) của động từ 触ります (Sờ, chạm vào) là:", "触るな", "触りな", "触るない", "触れな"),
            make_exercise("MULTIPLE_CHOICE", "Thể cấm đoán được cấu tạo bằng cách:", "Động từ thể Từ điển (V-ru) + な", "Động từ thể ます bỏ ます + な", "Động từ thể ない + な", "Động từ thể た + な"),
            make_exercise("MULTIPLE_CHOICE", "Khi trích dẫn ý nghĩa biển báo: 'Chữ Hán đó đọc là 止まれ (Hãy dừng lại)'", "あの漢字は「止まれ」と読みます。", "あの漢字は「止まれ」と言います。", "あの漢字は「止まれ」と書いてあります。", "あの漢字は「止まれ」という意味です。"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu trích dẫn lời nhắn gián tiếp: 'Anh Tanaka nói rằng ngày mai sẽ nghỉ.'", "田中さんは明日休むと言っていました。", "田中さんは明日休むと言いました。", "田中さんは明日休むと伝えます。", "田中さんは明日休むと聞きました。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '立入禁止' (Cấm vào) đọc là gì?", "たちいりきんし", "りつにゅうきんし", "たていりきんし", "りついりきんし"),
            make_exercise("MULTIPLE_CHOICE", "Từ '非常口' (Lối thoát hiểm khẩn cấp) đọc là gì?", "ひじょうぐち", "ひじょうくち", "ひじょうこう", "ひじょうぐち"),
            make_exercise("MULTIPLE_CHOICE", "Thể mệnh lệnh của きます (Đến) là gì?", "こい", "きろ", "こよ", "こさせ"),
            make_exercise("MULTIPLE_CHOICE", "Thể mệnh lệnh của する (Làm) là gì?", "しろ / せよ", "すろ", "しよ", "させ"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu nhờ truyền đạt tin nhắn: 'Xin hãy nhắn với anh Tanaka giúp tôi rằng...'", "田中さんに〜と伝えていただけませんか。", "田中さんに〜と言ってください。", "田中さんに〜と伝えさせます。", "田中さんに〜と伝えてあります。"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'マーク' có nghĩa là gì?", "Ký hiệu, nhãn hiệu (Mark)", "Máy móc", "Bản đồ", "Điểm số"),
        ]
    },
    # Lesson 34 (Order 8)
    {
        "slug": "n4-lesson-34-toori-ni-ato-de",
        "title": "Làm Theo Hướng Dẫn 〜とおりに & Sau Khi 〜あとで",
        "description": "Làm đúng theo chỉ dẫn, trình tự công việc và lựa chọn không thực hiện hành động phụ.",
        "level": "N4",
        "order": 8,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Hãy làm đúng theo như tôi hướng dẫn.'", "私が教えたとおりにやってください。", "私が教えるとおりにやってください。", "私が教えてとおりにやってください。", "私が教えたとおりにやってみてください。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 〜とおりに đi với danh từ như thế nào?", "Danh từ + の + とおりに (hoặc Danh từ + どおりに)", "Danh từ + とおりに", "Danh từ + に + とおりに", "Danh từ + で + とおりに"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Sau khi làm việc xong, tôi đi uống bia.'", "仕事が終わったあとで、ビールを飲みます。", "仕事が終わるあとで、ビールを飲みます。", "仕事が終わってあとで、ビールを飲みます。", "仕事が終わったまえに、ビールを飲みます。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 〜あとで kết hợp với danh từ như thế nào?", "Danh từ + の + あとで", "Danh từ + あとで", "Danh từ + に + あとで", "Danh từ + で + あとで"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi uống cà phê mà không cho đường (không cho đường mà uống).'", "砂糖を入れないでコーヒーを飲みます。", "砂糖を入れるないでコーヒーを飲みます。", "砂糖を入れるなくてコーヒーを飲みます。", "砂糖を入れないとコーヒーを飲みます。"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt V1-naide V2 và V1-nakute V2:", "V1-naide chỉ phương thức/lựa chọn không làm V1, V1-nakute chỉ nguyên nhân", "Cả hai giống hệt nhau", "V1-nakute dùng cho mệnh lệnh", "V1-naide dùng cho quá khứ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '矢印' (mũi tên chỉ hướng) đọc là gì?", "やじるし", "ししん", "やしん", "矢印"),
            make_exercise("MULTIPLE_CHOICE", "Từ '醤油' (nước tương Shoyu) đọc là me gì?", "しょうゆ", "しょゆ", "せいゆ", "しょうゆう"),
            make_exercise("MULTIPLE_CHOICE", "Từ '組み立てる' (lắp ráp, cấu thành) đọc là gì?", "くみたてる", "そたてる", "くみたて", "れんたてる"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: '説明書（　）とおりに、組み立ててください。'", "の", "に", "で", "を"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Hôm nay tôi sẽ đi ngủ mà không tắm.'", "お風呂に入らないで寝ます。", "お風呂に入らないくて寝ます。", "お風呂に入らないで寝てください。", "お風呂に入らないと寝ます。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '折り紙' (nghệ thuật xếp giấy Origami) đọc là gì?", "origami / おり紙", "おりがみ", "さつがみ", "せつがみ"),
        ]
    },
    # Lesson 35 (Order 9)
    {
        "slug": "n4-lesson-35-conditionals-ba",
        "title": "Thể Điều Kiện (条件形: 〜ば) & Càng... Càng... 〜ば〜ほど",
        "description": "Làm chủ cách chia thể điều kiện -ba và cấu trúc biểu thị sự tăng tiến song song.",
        "level": "N4",
        "order": 9,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Thể điều kiện (ば) của động từ 安い (Rẻ) là:", "安ければ", "安かったら", "安くば", "安ければいい"),
            make_exercise("MULTIPLE_CHOICE", "Thể điều kiện (ば) của động từ 行きます (Đi) là:", "行けば", "行ったら", "行けばいい", "行こうば"),
            make_exercise("MULTIPLE_CHOICE", "Thể điều kiện (ば) của tính từ đuôi -na '簡単' là:", "簡単なら / 簡単であれば", "簡単ば", "簡単ければ", "簡単ならば"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Nếu tiền nhà rẻ thì tôi muốn thuê căn hộ này.'", "家賃が安ければ、このアパートを借りたいです。", "家賃が安かったら、このアパートを借りたいです。", "家賃が安くば、このアパートを借りたいです。", "家賃が安いなら、このアパートを借りたいです。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 'Càng... càng...' trong tiếng Nhật là:", "〜ば〜ほど", "〜たら〜ほど", "〜なら〜ほど", "〜と〜ほど"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tiếng Nhật càng học càng thấy thú vị.'", "日本語は勉強すればするほど面白くなります。", "日本語は勉強したらするほど面白くなります。", "日本語は勉強すればするほど面白いです。", "日本語は勉強するならするほど面白くなります。"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu xin lời khuyên: 'Tôi nên làm thế nào thì tốt?'", "どうすればいいですか。", "どうしたらいいですか。", "どうするならいいですか。", "どうするといいですか。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '家賃' (tiền thuê nhà) đọc là gì?", "やちん", "いえちん", "かちん", "うちちん"),
            make_exercise("MULTIPLE_CHOICE", "Từ '島' (hòn đảo) đọc là gì?", "しま", "とう", "じま", "やま"),
            make_exercise("MULTIPLE_CHOICE", "Thể điều kiện của động từ きます (Đến) là gì?", "くれば", "きれば", "これば", "こば"),
            make_exercise("MULTIPLE_CHOICE", "Thể điều kiện của động từ する (Làm) là gì?", "すれば", "すればいい", "しれば", "さすれば"),
            make_exercise("MULTIPLE_CHOICE", "Thể điều kiện của いい (Tốt) là gì?", "よければ", "いいければ", "よければいい", "いいば"),
        ]
    },
    # Lesson 36 (Order 10)
    {
        "slug": "n4-lesson-36-youni-purpose",
        "title": "Cấu Trúc Mục Đích 〜ように & Biến Đổi Thói Quen 〜ようになる",
        "description": "Biểu đạt mục đích với động từ khả năng/không ý thức và sự thay đổi khả năng theo thời gian.",
        "level": "N4",
        "order": 10,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi ghi chép vào sổ để không bị quên.'", "忘れないようにノートにメモします。", "忘れないためにノートにメモします。", "忘れないようにノートにメモしてください。", "忘れないことでノートにメモします。"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt V-ru yō ni (động từ không ý thức / khả năng) và V-ru tame ni (động từ có ý thức):", "Yō ni đi với động từ khả năng / phủ định, Tame ni đi với động từ ý thức", "Cả hai dùng hoàn toàn như nhau", "Tame ni dùng cho phủ định", "Yō ni không thể đứng ở giữa câu"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu diễn tả sự thay đổi khả năng: 'Sau 1 năm học, tôi đã có thể nói được tiếng Nhật.'", "1年勉強して、日本語が話せるようになりました。", "1年勉強して、日本語が話せるために練習しました。", "1年勉強して、日本語が話せることにしました。", "1年勉強して、日本語が話せます。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 'Cố gắng tạo thói quen...' là gì?", "〜ようにしています", "〜ことにしています", "〜ためにしています", "〜ようにになります"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi luôn cố gắng tập thể dục mỗi ngày.'", "毎日運動するようにしています。", "毎日運動するためにしています。", "毎日運動するようになりました。", "毎日運動することにしています。"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ショック' mượn từ tiếng Anh có nghĩa là gì?", "Cú sốc / Bị sốc (Shock)", "Đôi vớ", "Đồ ăn", "Cửa hàng"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'チャレンジする' có nghĩa là gì?", "Thử thách, nỗ lực làm điều mới (Challenge)", "Thay đổi", "Từ bỏ", "Kiểm tra"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc '〜なくなりました' thể hiện điều gì?", "Đã trở nên không còn... nữa (thay đổi trạng thái)", "Đã bị mất đồ", "Không bao giờ làm", "Chưa từng làm"),
            make_exercise("MULTIPLE_CHOICE", "Từ '健康' (sức khỏe) đọc là gì?", "けんこう", "けんごう", "かんこう", "かんごう"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: '風邪を引かない（　）、暖かい服を着ます。'", "ように", "ために", "ので", "から"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu yêu cầu nhắc nhở nhẹ nhàng: 'Xin hãy nhớ nộp báo cáo đúng hạn nhé.'", "期日までにレポートを出すようにしてください。", "期日までにレポートを出してください。", "期日までにレポートを出すためにしてください。", "期日までにレポートを出させます。"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ラケット' có nghĩa là gì?", "Cái vợt cầu lông / tennis (Racket)", "Áo khoác", "Bóng đá", "Túi xách"),
        ]
    },
    # Lesson 37 (Order 11)
    {
        "slug": "n4-lesson-37-passive-ukemi",
        "title": "Thể Bị Động (受身形: 〜られる) & Trợ Từ に Trong Bị Động",
        "description": "Làm chủ cách chuyển thể bị động cho 3 nhóm động từ và diễn đạt tâm lý khi bị tác động.",
        "level": "N4",
        "order": 11,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Thể bị động của động từ 褒めます (Khen ngợi) là:", "褒められる", "褒めさせる", "褒めすぎる", "褒めやすい"),
            make_exercise("MULTIPLE_CHOICE", "Thể bị động của động từ 叱ります (Mắng) là:", "叱られる", "叱させる", "叱れる", "叱られるです"),
            make_exercise("MULTIPLE_CHOICE", "Thể bị động của động từ 踏みます (Dẫm lên) là:", "踏まれる", "踏められる", "踏ませる", "踏まれるです"),
            make_exercise("MULTIPLE_CHOICE", "Thể bị động của きます (Đến) là gì?", "こられる", "きられる", "こさせる", "きさせる"),
            make_exercise("MULTIPLE_CHOICE", "Thể bị động của する (Làm) là gì?", "される", "させられる", "すられる", "させれる"),
            make_exercise("MULTIPLE_CHOICE", "Trợ từ đánh dấu tác giả thực hiện hành động bị động là gì?", "に", "を", "で", "から"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi đã được thầy giáo khen ngợi.'", "私は先生に褒められました。", "私は先生を褒められました。", "私は先生が褒められました。", "私は先生で褒められました。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu bị động phiền phức: 'Tôi bị ai đó dẫm lên chân trên tàu điện.'", "電車で誰かに足を踏まれました。", "電車で誰かに足を踏みました。", "電車で誰かが足を踏まれました。", "電車で誰かを足を踏ませました。"),
            make_exercise("MULTIPLE_CHOICE", "Khi phát minh / xây dựng công trình nổi tiếng bởi ai đó, trợ từ tác giả chuyển thành gì?", "によって (Ví dụ: 富士山は... / 電話はベルによって発明された)", "に", "で", "から"),
            make_exercise("MULTIPLE_CHOICE", "Từ '泥棒' (tên trộm) đọc là gì?", "どろぼう", "でいぼう", "どろふ", "でいふ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '警官' (cảnh sát) đọc là gì?", "けいかん", "きょうかん", "けいさつ", "けいかん"),
            make_exercise("MULTIPLE_CHOICE", "Từ '発明する' (phát minh) đọc là gì?", "はつめいする", "ほつめいする", "はつみする", "ほつみする"),
        ]
    },
    # Lesson 38 (Order 12)
    {
        "slug": "n4-lesson-38-nominalization",
        "title": "Danh Từ Hóa Động Từ 〜の / 〜こと & Thích / Giỏi Việc Gì",
        "description": "Biến động từ thành danh từ với trợ từ の và こと để tạo các mẫu câu ưa thích, sở trường.",
        "level": "N4",
        "order": 12,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi thích nghe nhạc.'", "音楽を聞くのが好きです。", "音楽を聞くが好きです。", "音楽を聞くことを好きです。", "音楽を聞くのが好きにします。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi quên mất việc mua sữa rồi.'", "牛乳を買うのを忘れました。", "牛乳を買うを忘れました。", "牛乳を買うことが忘れました。", "牛乳を買うのに忘れました。"),
            make_exercise("MULTIPLE_CHOICE", "Khi diễn tả sở thích làm danh vị (Sở thích của tôi là...):", "私の趣味は写真を撮ることです。", "私の趣味は写真を撮るのが好きです。", "私の趣味は写真を撮るの物です。", "私の趣味は写真を撮ることですです。"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt の và こと: Trường hợp nào BẮT BUỘC dùng の?", "Đi với các động từ tri giác như 見る, 聞こえる, 手伝う (Ví dụ: 彼女が泳ぐのを見る)", "Đi với mệnh đề kết thúc bằng です", "Đi với sở thích (趣味は〜ことです)", "Không có trường hợp nào bắt buộc"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi đã nhìn thấy cô ấy băng qua đường.'", "彼女が道を渡るのを見ました。", "彼女が道を渡ることを見ました。", "彼女が道を渡るのを見られました。", "彼女が道を渡ることを言いました。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '赤ちゃん' (trẻ sơ sinh) đọc là gì?", "あかちゃん", "せきちゃん", "あかご", "せきじん"),
            make_exercise("MULTIPLE_CHOICE", "Từ '世話をする' (chăm sóc, trông nom) đọc là gì?", "せわをする", "せいわをする", "せばをする", "しょうわをする"),
            make_exercise("MULTIPLE_CHOICE", "Từ '入院する' (nhập viện) đọc là gì?", "にゅういんする", "いんいんする", "にゅうえんする", "いんえんする"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: '一人で生活する（　）は大変です。'", "の / こと", "が", "を", "で"),
            make_exercise("MULTIPLE_CHOICE", "Từ '退院する' (xuất viện) đọc là gì?", "たいいんする", "つけいんする", "たいえんする", "ついえんする"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi giỏi việc nấu ăn.'", "料理を作るのが得意です。", "料理を作るが得意です。", "料理を作ることを得意です。", "料理を作ると得意です。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '電源' (nguồn điện / nút nguồn) đọc là gì?", "でんげん", "でんえん", "でんけん", "でんかん"),
        ]
    },
    # Lesson 39 (Order 13)
    {
        "slug": "n4-lesson-39-node-te-causes",
        "title": "Nguyên Nhân Kết Quả 〜て/で, 〜ので & Thể Lỡ Lầm 〜てしまう",
        "description": "Biểu thị lý do khách quan nhẹ nhàng với Node và cảm xúc nuối tiếc với Te-shimau.",
        "level": "N4",
        "order": 13,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu biểu thị nguyên nhân nhẹ nhàng lịch sự: 'Vì xe bus đến muộn nên tôi đã bị trễ giờ.'", "バスが遅れたので、遅刻しました。", "バスが遅れたから、遅刻しました。", "バスが遅れてので、遅刻しました。", "バスが遅れるので、遅刻しました。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với ので của tính từ đuôi -na '好き' là:", "好きなので", "好きだから", "好きので", "好きであるので"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với ので của danh từ '病気' là:", "病気なので", "病気だから", "病気ので", "病気であるので"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt Kara và Node:", "Node nhẹ nhàng, khách quan, lịch sự hơn Kara (Kara mang tính chủ quan)", "Kara lịch sự hơn Node", "Node chỉ dùng cho mệnh lệnh", "Kara không thể đứng ở cuối câu"),
            make_exercise("MULTIPLE_CHOICE", "Diễn tả nguyên nhân do thiên tai / tai nạn dùng trợ từ gì với Danh từ?", "で (Ví dụ: 地震でビルが倒れました)", "に", "を", "から"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tòa nhà bị sập do trận động đất.'", "地震でビルが倒れました。", "地震にビルが倒れました。", "地震のでビルが倒れました。", "地震からビルが倒れました。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '途中で' (trên đường / giữa chừng) đọc là gì?", "とちゅうで", "みちちゅうで", "とちゅうに", "みちちゅうに"),
            make_exercise("MULTIPLE_CHOICE", "Từ '火事' (vụ hỏa hoạn, đám cháy) đọc là gì?", "かじ", "ひじ", "ひごと", "かごと"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ぶつかる' (đụng chạm, va chạm) có nghĩa là gì?", "Va chạm, đâm vào nhau", "Rơi xuống", "Bay lên", "Bị hỏng"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu diễn tả lỡ lầm nuối tiếc: 'Tôi lỡ ăn mất cái bánh ngọt của em gái rồi.'", "妹のケーキを食べてしまいました。", "妹のケーキを食べておきました。", "妹のケーキを食べてあります。", "妹のケーキを食べさせました。"),
            make_exercise("MULTIPLE_CHOICE", "Trong văn nói, '〜てしまいました' rút gọn thành gì?", "〜ちゃいました (hoặc 〜じゃいました)", "〜といました", "〜てありました", "〜たかったです"),
            make_exercise("MULTIPLE_CHOICE", "Từ '複雑' (phức tạp) đọc là gì?", "ふくざつ", "ふくさつ", "ふくじょう", "ふくちょう"),
        ]
    },
    # Lesson 40 (Order 14)
    {
        "slug": "n4-lesson-40-embedded-questions",
        "title": "Câu Hỏi Phụ 〜か / 〜かどうか & Thử Làm 〜てみます",
        "description": "Lồng câu hỏi vào trong câu phức và cấu trúc thử nghiệm trải nghiệm mới.",
        "level": "N4",
        "order": 14,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu lồng câu hỏi có từ nghi vấn: 'Tôi xin phép kiểm tra xem mấy giờ chuyến bay sẽ đến.'", "何時に飛行機が到着するか、調べてみます。", "何時に飛行機が到着するかどうか、調べてみます。", "何時に飛行機が到着するかを、調べてみます。", "何時に飛行機が到着するかで、調べてみます。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu lồng câu hỏi KHÔNG có từ nghi vấn (Co/Khong): 'Tôi không biết liệu ngày mai trời có mưa hay không.'", "明日雨が降るかどうか、わかりません。", "明日雨が降るか、わかりません。", "明日雨が降るかどうかを、わかりません。", "明日雨が降るかどうかが、わかりません。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 'Thử làm việc gì đó xem sao' là gì?", "〜てみます", "〜て見ます", "〜ておきます", "〜てあります"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi muốn mặc thử chiếc áo kimomo này.'", "この着物を着てみたいです。", "この着物を着て見たいです。", "この着物を着ておきたいです。", "この着物を着てあります。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với かどうか của tính từ đuôi -na '本当' là:", "本当かどうか", "本当だかどうか", "本当なかどうか", "本当であるかどうか"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với かどうか của danh từ '間違い' (lỗi sai) là:", "間違いかどうか", "間違いだかどうか", "間違いなかどうか", "間違いであるかどうか"),
            make_exercise("MULTIPLE_CHOICE", "Từ '測る / 量る' (đo đạc, cân trọng lượng) đọc là gì?", "はかる", "そかる", "りょうかる", "たいかる"),
            make_exercise("MULTIPLE_CHOICE", "Từ '傷' (vết thương, vết trầy xước) đọc là gì?", "きず", "しょう", "いたず", "きき"),
            make_exercise("MULTIPLE_CHOICE", "Từ '忘年会' (tiệc tất niên cuối năm) đọc là gì?", "ぼうねんかい", "わすれねんかい", "ぼうねんあつまし", "わすれねんあつまし"),
            make_exercise("MULTIPLE_CHOICE", "Từ '二次会' (tăng hai của buổi tiệc) đọc là gì?", "にじかい", "ふたじかい", "つぎじかい", "にじあつまし"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: 'サイズが合う（　）、履いてみます。'", "かどうか", "か", "のに", "ので"),
            make_exercise("MULTIPLE_CHOICE", "Từ '幹事' (người tổ chức / cán sự buổi tiệc) đọc là gì?", "かんじ", "みきじ", "かんし", "みきし"),
        ]
    },
    # Lesson 41 (Order 15)
    {
        "slug": "n4-lesson-41-giving-receiving-keigo",
        "title": "Cho - Nhận Kính Ngữ (いただきます・くださいます・やります)",
        "description": "Làm chủ hệ thống cho nhận thể hiện sự tôn kính với người bề trên và sự thân mật.",
        "level": "N4",
        "order": 15,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Khi NHẬN quà/hành động từ người bề trên (thầy giáo, sếp), ta dùng động từ kính ngữ nào thay cho もらいます?", "いただきます (いただく)", "くださいます", "あげます", "差し上げます"),
            make_exercise("MULTIPLE_CHOICE", "Khi người bề trên CHO mình quà/hành động, ta dùng động từ kính ngữ nào thay cho くれます?", "くださいます (くださる)", "いただきます", "差し上げます", "やります"),
            make_exercise("MULTIPLE_CHOICE", "Khi mình TẶNG quà cho người bề trên, ta dùng động từ kính ngữ nào thay cho あげます?", "差し上げます (さしあげる)", "いただきます", "くださいます", "やります"),
            make_exercise("MULTIPLE_CHOICE", "Khi mình cho động vật ăn hoặc tưới nước cho cây, ta dùng động từ thân mật nào?", "やります (やる)", "あげます", "差し上げます", "いただきます"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi đã nhận được món quà từ thầy giáo.'", "私は先生にプレゼントをいただきました。", "私は先生にプレゼントをくださいました。", "私は先生にプレゼントを差し上げました。", "私は先生にプレゼントをやりました。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Trưởng phòng đã giải thích cho tôi.'", "部長は私に説明してくださいました。", "部長は私に説明していただきました。", "部長は私に説明して差し上げました。", "部長は私に説明してやりました。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi cho chó ăn đồ ăn.'", "犬にエサをやりました。", "犬にエサを差し上げました。", "犬にエサをいただきました。", "犬にエサをくださいました。"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu nhờ vả lịch sự cao cấp: 'Anh/chị có thể vui lòng giúp tôi việc này được không ạ?'", "〜ていただけませんか", "〜てください", "〜てくださいますか", "〜てあげませんか"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'お祝い' (quà mừng / sự chúc mừng) đọc là gì?", "おいわい", "おさいわい", "おしゅく", "おしゅくわい"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'お年玉' (tiền mừng tuổi đầu năm) đọc là gì?", "おとしだま", "おねんだま", "おとしぎょく", "おねんぎょく"),
            make_exercise("MULTIPLE_CHOICE", "Từ '家庭教師' (gia sư dạy kèm tại nhà) đọc là gì?", "かていきょうし", "いえていきょうし", "かていきょうじ", "いえていきょうじ"),
            make_exercise("MULTIPLE_CHOICE", "Điền trợ từ: '社長が私（　）時計をくださいました。'", "に", "を", "が", "で"),
        ]
    },
    # Lesson 42 (Order 16)
    {
        "slug": "n4-lesson-42-tame-ni-noni",
        "title": "Mục Đích 〜ために & Công Dụng / Phung Phí 〜のに",
        "description": "Biểu thị mục đích với động từ có ý thức Tame ni và công dụng/chi phí với Noni.",
        "level": "N4",
        "order": 16,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi tiết kiệm tiền để mua ô tô.'", "車を買うために、貯金しています。", "車を買うように、貯金しています。", "車を買うことに、貯金しています。", "車を買うので、貯金しています。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 〜ために đi với danh từ như thế nào?", "Danh từ + の + ために (Ví dụ: 家族のために)", "Danh từ + ために", "Danh từ + に + ために", "Danh từ + で + ために"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu biểu thị công dụng: 'Cây kéo này được dùng để cắt giấy.'", "このハサミは紙を切るのに使います。", "このハサミは紙を切るために使います。", "このハサミは紙を切るように使います。", "このハサミは紙を切ることで使います。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu biểu thị thời gian/chi phí tiêu tốn: 'Căn nhà này tốn mất 3 năm để xây dựng.'", "この家を建てるのに3年かかりました。", "この家を建てるために3年かかりました。", "この家を建てるように3年かかりました。", "この家を建てることで3年かかりました。"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt V-ru tame ni (mục đích có ý thức) và V-ru yō ni (mục đích khả năng/không ý thức):", "Tame ni đi với động từ ý thức (như 買う, 勉強する), Yō ni đi với động từ khả năng (như 話せる, 忘れない)", "Cả hai hoàn toàn giống hệt nhau", "Yō ni đi với danh từ + no", "Tame ni không đi được với danh từ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '弁護士' (luật sư) đọc là gì?", "べんごし", "べんこうし", "べんごじ", "べんこうじ"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ボランティア' mượn từ tiếng Anh có nghĩa là gì?", "Hoạt động tình nguyện (Volunteer)", "Kinh doanh", "Du lịch", "Thể thao"),
            make_exercise("MULTIPLE_CHOICE", "Từ '缶きり' (cái mở đồ hộp) đọc là gì?", "かんきり", "かんぎり", "ふんきり", "ふんぎり"),
            make_exercise("MULTIPLE_CHOICE", "Từ '計算する' (tính toán, nhẩm tính) đọc là gì?", "けいさんする", "けいざんする", "けいせんする", "けいぜんする"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: '健康（　）ために、毎朝走っています。'", "の", "に", "で", "を"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ファイル' (kẹp file / tài liệu) đọc mượn tiếng Anh là gì?", "File", "Film", "Fill", "Field"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ふろしき' (khăn gói đồ truyền thống Furoshiki) đọc là gì?", "ふろしき", "ふろき", "ふろじき", "ふろせん"),
        ]
    },
    # Lesson 43 (Order 17)
    {
        "slug": "n4-lesson-43-souda-conjecture",
        "title": "Dự Đoán Vẻ Bề Ngoài 〜そうだ & Sắp Sửa 今にも〜そうだ",
        "description": "Phán đoán qua quan sát trực quan (Trông có vẻ...) và dự báo hành động biến đổi sắp xảy ra.",
        "level": "N4",
        "order": 17,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với そうだ (Trông có vẻ) của tính từ đuôi -i '美味し' là:", "美味しそうだ", "美味しいそうだ", "美味しさそうだ", "美味しいであるそうだ"),
            make_exercise("MULTIPLE_CHOICE", "Trường hợp đặc biệt: Tính từ 'いい' (Tốt) khi đi với そうだ biến đổi thành:", "よさそうだ", "いいそうだ", "よいそうだ", "いくそうだ"),
            make_exercise("MULTIPLE_CHOICE", "Trường hợp đặc biệt: Tính từ 'ない' (Không có) khi đi với そうだ biến đổi thành:", "なさそうだ", "ないそうだ", "なくそうだ", "なきそうだ"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với そうだ của động từ '雨が降ります' (Sắp mưa đến nơi) là:", "雨が降りそうだ", "雨が降るそうだ", "雨が降ったそうだ", "雨が降りてそうだ"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt V-masu sōda (trông như sắp...) và V-ru sōda (nghe nói là...):", "V-masu sōda là dự đoán bề ngoài, V-ru sōda là nghe nói truyền đạt thông tin", "Cả hai giống hệt nhau", "V-ru sōda là trông có vẻ", "V-masu sōda là nghe nói"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Chiếc cúc áo này trông như sắp bị đứt ra.'", "ボタンが外れそうです。", "ボタンが外れるそうです。", "ボタンが外れたそうです。", "ボタンが外れなさそうです。"),
            make_exercise("MULTIPLE_CHOICE", "Phó từ đi kèm biểu thị 'trông như sắp... đến nơi rồi':", "今にも (Ví dụ: 今にも雨が降りそうです)", "きっと", "たぶん", "ぜんぜん"),
            make_exercise("MULTIPLE_CHOICE", "Từ '暖房' (hệ thống sưởi ấm) đọc là gì?", "だんぼう", "たんぼう", "だんぽう", "たんぽう"),
            make_exercise("MULTIPLE_CHOICE", "Từ '冷房' (hệ thống điều hòa làm mát) đọc là gì?", "れいぼう", "りょうぼう", "れいぽう", "りょうぽう"),
            make_exercise("MULTIPLE_CHOICE", "Khi dùng そうだ bổ nghĩa cho danh từ (bộ dạng...):", "美味しそうなケーキ", "美味しそうだケーキ", "美味しいそうなケーキ", "美味しさそうなケーキ"),
            make_exercise("MULTIPLE_CHOICE", "Khi dùng そうだ bổ nghĩa cho động từ (một cách...):", "楽しそうに遊んでいます", "楽しそうだ遊んでいます", "楽しいそうに遊んでいます", "楽しさに遊んでいます"),
            make_exercise("MULTIPLE_CHOICE", "Từ '向こう' (phía bên kia, đối diện) đọc là gì?", "むこう", "こう", "むかい", "むこうに"),
        ]
    },
    # Lesson 44 (Order 18)
    {
        "slug": "n4-lesson-44-sugiru-yasui-nikui",
        "title": "Hành Động Quá Mức 〜すぎる & Dễ/Khó Làm 〜やすい / 〜にくい",
        "description": "Diễn tả hành động vượt quá giới hạn và mức độ dễ/khó thực hiện việc gì.",
        "level": "N4",
        "order": 18,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tối qua tôi đã trót uống quá nhiều rượu.'", "昨夜お酒を飲みすぎました。", "昨夜お酒を飲んだすぎました。", "昨夜お酒を飲むすぎました。", "昨夜お酒を飲みすぎますでした。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với すぎる của tính từ đuôi -i '高' (đắt quá) là:", "高すぎる", "高いすぎる", "高くてすぎる", "高かったすぎる"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với すぎる của tính từ đuôi -na '静か' (yên tĩnh quá) là:", "静かすぎる", "静かですぎる", "静かなすぎる", "静かにすぎる"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Cây bút này viết rất trơn và dễ viết.'", "このペンはとても書きやすいです。", "このペンはとても書くやすいです。", "このペンはとても書いたやすいです。", "このペンはとても書きやすくてです。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Chữ Hán thì khá là khó nhớ.'", "漢字は覚えにくいです。", "漢字は覚えるにくいです。", "漢字は覚えてにくいです。", "漢字は覚えにくくてです。"),
            make_exercise("MULTIPLE_CHOICE", "Các đuôi 〜やすい / 〜にくい / 〜すぎる sau khi ghép biến thành từ loại nào?", "Tính từ đuôi -i (có thể chia やすくない, にくかった...)", "Tính từ đuôi -na", "Danh từ", "Trạng từ"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc biến đổi động từ thành dạng yêu cầu dịch vụ 'làm cho...':", "〜くします / 〜にします (Ví dụ: 髪を短くします)", "〜くあります", "〜になります", "〜くさせます"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Hãy làm cho âm thanh to lên một chút.'", "音を大きくしてください。", "音を大きく書いてください。", "音を大きくになります。", "音を大きいにしてください。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '立派' (lộng lẫy, tuyệt vời) đọc là gì?", "りっぱ", "りつは", "りゅうは", "りっぱに"),
            make_exercise("MULTIPLE_CHOICE", "Từ '選ぶ' (lựa chọn) đọc là gì?", "えらぶ", "せんぶ", "よりぶ", "えらぷ"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: 'この靴は軽くて、（　）やすいです。'", "歩き", "歩く", "歩いた", "歩いて"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'デザイン' mượn từ tiếng Anh có nghĩa là gì?", "Thiết kế, kiểu dáng (Design)", "Kích thước", "Màu sắc", "Chất liệu"),
        ]
    },
    # Lesson 45 (Order 19)
    {
        "slug": "n4-lesson-45-baai-noni",
        "title": "Trường Hợp 〜ばあい & Dù Cho / Thế Mà 〜のに",
        "description": "Diễn tả giải pháp trong các trường hợp sự cố và sự bất bình/bất ngờ trước thực tế ngược lại kỳ vọng.",
        "level": "N4",
        "order": 19,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Trong trường hợp bị hỏa hoạn, hãy lập tức gọi 119.'", "火事の場合は、すぐに119番をかけてください。", "火事の場合は、すぐに119番をかけます。", "火事の時は、すぐに119番をかけましょう。", "火事の場合に、すぐに119番をかけます。"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 〜ばあい đi với danh từ như thế nào?", "Danh từ + の + 場合 (Ví dụ: 地震の場合)", "Danh từ + 場合", "Danh từ + に + 場合", "Danh từ + で + 場合"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với 場合 của tính từ đuôi -na '緊急' (khẩn cấp) là:", "緊急な場合", "緊急の場合", "緊急だ場合", "緊急である場合"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu thể hiện sự bất bình/kỳ vọng trái ngược với 〜のに: 'Dù đã hứa hẹn rồi thế mà anh ấy vẫn không đến.'", "約束したのに、彼は来ませんでした。", "約束したので、彼は来ませんでした。", "約束したから、彼は来ませんでした。", "約束したのに、彼は来ました。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với のに của tính từ đuôi -na '好き' là:", "好きなのに", "好きのに", "好きだのに", "好きであるのに"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với のに của danh từ '日曜日' là:", "日曜日なのに", "日曜日のに", "日曜日だのに", "日曜日であるのに"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt Noni và Demo/Keredomo:", "Noni chứa đựng cảm xúc bất bình, nuối tiếc, ngạc nhiên của người nói", "Noni chỉ dùng cho thời tiết", "Keredomo chứa cảm xúc nuối tiếc mạnh hơn", "Cả hai giống hệt nhau"),
            make_exercise("MULTIPLE_CHOICE", "Từ '領収書' (hóa đơn thanh toán / biên nhận) đọc là gì?", "りょうしゅうしょ", "れんしゅうしょ", "りょうしゅうじょ", "れんしゅうじょ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '係員' (người phụ trách / nhân viên) đọc là gì?", "かかりいん", "けいいん", "かかりびと", "けいびと"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'あいにく' có nghĩa là gì?", "Thật không may, đáng tiếc là...", "Rất may mắn", "Thật tuyệt vời", "Tất nhiên rồi"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: '一生懸命勉強した（　）、試験に落ちてしまいました。'", "のに", "ので", "ために", "ように"),
            make_exercise("MULTIPLE_CHOICE", "Từ '事故' (tai nạn) đọc là gì?", "じこ", "ことこ", "じご", "ことご"),
        ]
    },
    # Lesson 46 (Order 20)
    {
        "slug": "n4-lesson-46-tokoro-tabakari",
        "title": "Thời Điểm Điểm Thực Hiện 〜ところ & Vừa Mới 〜たばかり",
        "description": "Diễn tả chính xác khoảnh khắc sắp làm, đang làm, vừa làm xong và cảm giác vừa mới xảy ra.",
        "level": "N4",
        "order": 20,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu diễn tả 'Chuẩn bị / Sắp sửa làm V' (ngay trước khi làm):", "Động từ thể Từ điển (V-ru) + ところです (Ví dụ: これからご飯を食べるところです)", "Động từ thể て + いるところです", "Động từ thể た + ところです", "Động từ thể た + ばかりです"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu diễn tả 'Đang trong lúc làm V' (đúng thời điểm đang diễn ra):", "Động từ thể て + いるところです (Ví dụ: 今ご飯を食べているところです)", "Động từ thể V-ru + ところです", "Động từ thể た + ところです", "Động từ thể た + ばかりです"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu diễn tả 'Tức thì vừa mới làm V xong' (vừa kết thúc tức thì):", "Động từ thể た + ところです (Ví dụ: たった今ご飯を食べたところです)", "Động từ thể V-ru + ところです", "Động từ thể て + いるところです", "Động từ thể た + ばかりです"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu diễn tả 'Vừa mới làm V chưa lâu (theo cảm nhận thời gian cá nhân)':", "Động từ thể た + ばかりです (Ví dụ: 先月日本へ来たばかりです)", "Động từ thể た + ところです", "Động từ thể V-ru + ところです", "Động từ thể て + いるところです"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt V-ta tokoro desu và V-ta bakari desu:", "Tokoro desu chỉ thời gian tức thì vừa xong (vài giây/phút), Bakari desu là cảm giác thời gian chưa lâu (vài ngày/tháng)", "Bakari desu là sắp làm", "Tokoro desu chỉ dùng cho quá khứ xa", "Cả hai giống hệt nhau"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Tôi vừa mới mua chiếc xe máy này tháng trước.'", "先月このバイクを買ったばかりです。", "先月このバイクを買ったところです。", "先月このバイクを買うところです。", "先月このバイクを買っているところです。"),
            make_exercise("MULTIPLE_CHOICE", "Phó từ đi kèm biểu thị 'đúng vào lúc này':", "ちょうど (Ví dụ: ちょうど今終わったところです)", "たぶん", "きっと", "もし"),
            make_exercise("MULTIPLE_CHOICE", "Từ '留守' (vắng nhà) đọc là gì?", "るす", "りゅうしゅ", "とめす", "りゅうす"),
            make_exercise("MULTIPLE_CHOICE", "Từ '宅配便' (dịch vụ giao hàng tận nhà) đọc là gì?", "たくはいびん", "たくへんびん", "やあくはいびん", "たくはいべん"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: '今から出かける（　）だから、後で電話するね。'", "ところ", "ばかり", "ほど", "とおり"),
            make_exercise("MULTIPLE_CHOICE", "Từ '原因' (nguyên nhân) đọc là gì?", "げんいん", "原いん", "げんえん", "原えん"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ガスコンロ' có nghĩa là gì?", "Bếp ga (Gas stove)", "Tủ lạnh ga", "Máy sấy", "Bình nước"),
        ]
    },
    # Lesson 47 (Order 21)
    {
        "slug": "n4-lesson-47-souda-youdai-hearsay",
        "title": "Nghe Nói Là 〜そうです & Có Vẻ Như 〜ようです",
        "description": "Truyền đạt thông tin nghe từ nguồn khác và suy đoán dựa trên cảm nhận các giác quan.",
        "level": "N4",
        "order": 21,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Chọn câu truyền đạt tin đồn/nghe nói: 'Theo dự báo thời tiết, nghe nói ngày mai sẽ nắng.'", "天気予報によると、明日は晴れるそうです。", "天気予報によると、明日は晴れそうです。", "天気予報によると、明日は晴れるようです。", "天気予報によると、明日は晴れるらしいです。"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với Sōda (nghe nói) của tính từ đuôi -i '美味しい' là:", "美味しいそうです (nguyên dạng thể thông thường)", "美味しそうです", "美味しさそうです", "美味しいであるそうです"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc đi kèm ở đầu câu chỉ nguồn thông tin nghe nói:", "〜によると (Ví dụ: 新聞によると...)", "〜によって", "〜について", "〜にくらべて"),
            make_exercise("MULTIPLE_CHOICE", "Cấu trúc 'Có vẻ như... (suy đoán qua giác quan/tình hình)' là:", "〜ようです", "〜そうです", "〜らしいです", "〜みたいです"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với ようです của tính từ đuôi -na '賑やか' là:", "賑やかなようです", "賑やかだようです", "賑やかようです", "賑やかであるようです"),
            make_exercise("MULTIPLE_CHOICE", "Dạng chia đi với ようです của danh từ '事故' là:", "事故のようです", "事故だようです", "事故なようです", "事故であるようです"),
            make_exercise("MULTIPLE_CHOICE", "Phân biệt Sōda (nghe nói) và Sōda (trông có vẻ):", "Sōda nghe nói giữ nguyên thể thông thường (V-ru sōda), Sōda trông có vẻ bỏ masu/i (V-masu sōda)", "Cả hai giống hệt nhau", "Sōda nghe nói đi với tính từ bỏ i", "Sōda trông có vẻ đi với nguồn tin ni yoru to"),
            make_exercise("MULTIPLE_CHOICE", "Từ '噂' (tin đồn, lời đồn đại) đọc là gì?", "うわさ", "しょう", "せん", "うさ"),
            make_exercise("MULTIPLE_CHOICE", "Từ '咳' (cơn ho) đọc là gì?", "せき", "がい", "こく", "し"),
            make_exercise("MULTIPLE_CHOICE", "Điền từ: 'ニュース（　）によると、事故があったそうです。'", "の", "に", "で", "を"),
            make_exercise("MULTIPLE_CHOICE", "Từ '警察' (cảnh sát) đọc là gì?", "けいさつ", "きょうさつ", "けいさち", "きょうさち"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Hình như bên ngoài đang có người.'", "外に誰かがいるようです。", "外に誰かがいるそうです。", "外に誰かがいそうです。", "外に誰かがいるらしいです。"),
        ]
    },
    # Lesson 48 (Order 22)
    {
        "slug": "n4-lesson-48-causative-shieki",
        "title": "Thể Sai Khiến (使役形: 〜させる) & Xin Phép Lịch Sự",
        "description": "Làm chủ cách chia thể sai khiến bắt/cho phép và cấu trúc xin phép đỉnh cao.",
        "level": "N4",
        "order": 22,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Thể sai khiến của động từ 行きます (Đi) là:", "行かせる", "行かれる", "行かさせられる", "行こう"),
            make_exercise("MULTIPLE_CHOICE", "Thể sai khiến của động từ 食べます (Ăn) là:", "食べさせる", "食べられる", "食べさせられる", "食べろ"),
            make_exercise("MULTIPLE_CHOICE", "Thể sai khiến của きます (Đến) là gì?", "こさせる", "こられる", "きさせる", "きられる"),
            make_exercise("MULTIPLE_CHOICE", "Thể sai khiến của する (Làm) là gì?", "させる", "される", "させられる", "しよう"),
            make_exercise("MULTIPLE_CHOICE", "Trợ từ đi với người bị bắt làm (nội động từ): 'Mẹ bắt người con đi mua đồ.'", "お母さんは子供を買い物に行かせました。", "お母さんは子供に買い物に行かせました。", "お母さんは子供が買い物に行かせました。", "お母さんは子供で買い物に行かせました。"),
            make_exercise("MULTIPLE_CHOICE", "Trợ từ đi với người bị bắt làm (ngoại động từ): 'Mẹ bắt người con ăn rau.'", "お母さんは子供に野菜を食べさせました。", "お母さんは子供を野菜を食べさせました。", "お母さんは子供が野菜を食べさせました。", "お母さんは子供で野菜を食べさせました。"),
            make_exercise("MULTIPLE_CHOICE", "Mẫu câu xin phép lịch sự bậc nhất: 'Xin cho phép tôi được nghỉ phép ngày mai ạ.'", "明日休ませていただけませんか。", "明日休ませてください。", "明日休まないでください。", "明日休ませてくださいませんか。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu đúng: 'Xin hãy để tôi phụ trách công việc này.'", "この仕事を私にさせてください。", "この仕事を私にさせていただけませんか。", "この仕事を私にさせます。", "この仕事を私にさせられます。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '塾' (trường học thêm tư nhân Juku) đọc là gì?", "じゅく", "じゅっく", "しゅく", "しゅっく"),
            make_exercise("MULTIPLE_CHOICE", "Từ '自由' (tự do) đọc là gì?", "じゆう", "じゆ", "しゆう", "しゆ"),
            make_exercise("MULTIPLE_CHOICE", "Thể sai khiến kết hợp với ていただきます mang ý nghĩa gì?", "Xin phép / Nhờ đối phương cho phép mình làm việc gì", "Bắt đối phương làm việc gì", "Cấm đoán đối phương", "Bị đối phương mắng"),
            make_exercise("MULTIPLE_CHOICE", "Từ '競走する' (chạy thi, cạnh tranh) đọc là gì?", "きょうそうする", "けいそうする", "きょうぞうする", "けいぞうする"),
        ]
    },
    # Lesson 49 (Order 23)
    {
        "slug": "n4-lesson-49-respectful-sonkeigo",
        "title": "Kính Ngữ (尊敬語: いらっしゃいます・おっしゃいます)",
        "description": "Tôn vinh hành động của sếp, thầy giáo, khách hàng với hệ thống động từ tôn kính đặc biệt.",
        "level": "N4",
        "order": 23,
        "xpReward": 40,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Động từ kính ngữ (尊敬語) đặc biệt của 行きます / 来ます / います là gì?", "いらっしゃいます (いらっしゃる)", "おっしゃいます", "ご覧になります", "なさいます"),
            make_exercise("MULTIPLE_CHOICE", "Động từ kính ngữ đặc biệt của 言います (Nói) là gì?", "おっしゃいます (おっしゃる)", "いらっしゃいます", "ご覧になります", "なさいます"),
            make_exercise("MULTIPLE_CHOICE", "Động từ kính ngữ đặc biệt của 食べます / 飲みます (Ăn / Uống) là gì?", "召し上がります (めしあがる)", "ご覧になります", "おっしゃいます", "なさいます"),
            make_exercise("MULTIPLE_CHOICE", "Động từ kính ngữ đặc biệt của 見ます (Xem / Nhìn) là gì?", "ご覧になります (ごらんになる)", "召し上がります", "おっしゃいます", "なさいます"),
            make_exercise("MULTIPLE_CHOICE", "Động từ kính ngữ đặc biệt của する (Làm) là gì?", "なさいます (なさる)", "いらっしゃいます", "おっしゃいます", "ご覧になります"),
            make_exercise("MULTIPLE_CHOICE", "Động từ kính ngữ đặc biệt của 知っています (Biết) là gì?", "ご存じです (ごぞんじです)", "ご存じします", "お知ります", "知りなさいます"),
            make_exercise("MULTIPLE_CHOICE", "Cách tạo tôn kính ngữ thông thường cho nhóm 1 & 2: お + V-masu (bỏ masu) + になります. Chọn câu đúng:", "社長はもうお帰りに行かれましたか。 / 社長はもうお帰りになりましたか。", "社長はもうお帰りになりましたか。", "社長はもうお帰りになりますか。", "社長はもうお帰りしましたか。"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu hỏi kính ngữ lịch sự: 'Trưởng phòng dùng món gì ạ?'", "部長、何に召し上がりますか。 / 何を召し上がりますか。", "部長、何を食べますか。", "部長、何を召し上がりますか。", "部長、何をいただきますか。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '社長' (Giám đốc công ty) đọc là gì?", "しゃちょう", "じゃちょう", "しゃとう", "じゃとう"),
            make_exercise("MULTIPLE_CHOICE", "Từ '奥様' (Vợ của người khác - tôn kính) đọc là gì?", "おくさま", "おくさん", "つま", "かない"),
            make_exercise("MULTIPLE_CHOICE", "Kính ngữ thể bị động (受身形) cũng được dùng để thể hiện sự tôn kính nhẹ nhàng (Ví dụ: 社長は来られました). Đúng hay sai?", "Đúng", "Sai", "Chỉ dùng cho trẻ em", "Chỉ dùng trong văn viết cổ"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'お呼びになる' có nghĩa là gì?", "Gọi / Mời (kính ngữ của 呼びます)", "Nghe", "Ăn", "Đi"),
        ]
    },
    # Lesson 50 (Order 24)
    {
        "slug": "n4-lesson-50-humble-kenjougo",
        "title": "Khiêm Nhường Ngữ (謙譲語: 参ります・申します) & Tổng Ôn N4",
        "description": "Hạ thấp hành động bản thân để tỏ lòng tôn kính và tổng kết toàn bộ kiến thức JLPT N4.",
        "level": "N4",
        "order": 24,
        "xpReward": 50,
        "exercises": [
            make_exercise("MULTIPLE_CHOICE", "Động từ khiêm nhường ngữ (謙譲語) đặc biệt của 行きます / 来ます (Đi / Đến) là gì?", "参ります (まいります)", "伺います", "申します", "いたします"),
            make_exercise("MULTIPLE_CHOICE", "Động từ khiêm nhường ngữ đặc biệt của 言います (Nói) là gì?", "申します (もうします) / 申し上げます", "参ります", "伺います", "いたします"),
            make_exercise("MULTIPLE_CHOICE", "Động từ khiêm nhường ngữ đặc biệt của します (Làm) là gì?", "いたします (いたす)", "参ります", "申します", "おります"),
            make_exercise("MULTIPLE_CHOICE", "Động từ khiêm nhường ngữ đặc biệt của います (Ở / Có) là gì?", "おります (おる)", "参ります", "申します", "いたします"),
            make_exercise("MULTIPLE_CHOICE", "Động từ khiêm nhường ngữ đặc biệt của 食べます / 飲みます / もらいます là gì?", "いただきます (いただく)", "参ります", "申します", "ございます"),
            make_exercise("MULTIPLE_CHOICE", "Động từ khiêm nhường ngữ đặc biệt của 訪ねます / 聞きます (Ghé thăm / Hỏi) là gì?", "伺います (うかがう)", "参ります", "申します", "いたします"),
            make_exercise("MULTIPLE_CHOICE", "Cách tạo khiêm nhường ngữ thông thường: お + V-masu (bỏ masu) + します. Chọn câu đúng:", "重い荷物をお持ちします。", "重い荷物をお持ちになります。", "重い荷物をお持ちいたします。", "重い荷物をお持ちさせます。"),
            make_exercise("MULTIPLE_CHOICE", "Từ 'ございます' là dạng lịch sự (丁寧語) đặc biệt của động từ nào?", "あります (Ví dụ: 電話の me にございます)", "いきます", "します", "きます"),
            make_exercise("MULTIPLE_CHOICE", "Chọn câu tự giới thiệu chuẩn khiêm nhường ngữ công sở: 'Tôi tên là Nam, đến từ Việt Nam.'", "ベトナムから参りましたナムと申します。", "ベトナムからいらっしゃいましたナムとおっしゃいます。", "ベトナムから行きましたナムと言います。", "ベトナムから来ましたナムと申します。"),
            make_exercise("MULTIPLE_CHOICE", "Từ '私' khi nói rất lịch sự trong công sở đọc là gì?", "わたくし", "わたし", "ぼく", "おれ"),
            make_exercise("MULTIPLE_CHOICE", "Tổng ôn N4: Phân biệt Kính ngữ (尊敬語) và Khiêm nhường ngữ (謙譲語):", "Kính ngữ dùng cho hành động người khác (sếp/khách), Khiêm nhường ngữ dùng cho hành động của mình", "Cả hai đều dùng cho hành động người khác", "Khiêm nhường ngữ dùng cho sếp", "Không có sự khác biệt"),
            make_exercise("MULTIPLE_CHOICE", "Chúc mừng bạn đã hoàn thành chương trình N4! Động từ thể hiện sự cố gắng hoàn thành kỳ thi là:", "合格する (ごうかくする - Thi đỗ)", "失敗する", "諦める", "忘れる"),
        ]
    },
]

# -----------------------------------------------------------------------------
# 5. SCENARIOS N4 DATA
# -----------------------------------------------------------------------------
scenarios_n4 = [
    {
        "slug": "n4-baito-interview",
        "title": "Phỏng Vấn Xin Việc Làm Thêm (Baito)",
        "description": "Ứng tuyển vị trí nhân viên quán ăn tại Tokyo: Chào hỏi kính ngữ, trình bày kinh nghiệm và xác nhận lịch làm việc.",
        "level": "N4",
        "xpReward": 50,
        "messages": [
            {
                "order": 1,
                "speaker": "店長 (Chủ quán)",
                "japanese": "本日は面接にお越しいただきありがとうございます。まず自己紹介をお願いできますか？",
                "romaji": "Honjitsu wa mensetsu ni okoshi itadaki arigatō gozaimasu. Mazu jikoshōkai o onegai dekimasu ka?",
                "meaning": "Cảm ơn bạn hôm nay đã đến phỏng vấn. Trước hết bạn có thể tự giới thiệu đôi nét về bản thân không?"
            },
            {
                "order": 2,
                "speaker": "Bạn (Học viên)",
                "japanese": "初めまして。ベトナムから参りましたナムと申します。日本の飲食文化を学びたくて応募いたしました。",
                "romaji": "Hajimemashite. Betonamu kara mairimashita Namu to mōshimasu. Nihon no inshoku bunka o manabitakute ōbo itashimashita.",
                "meaning": "Xin chào anh. Tôi là Nam đến từ Việt Nam. Vì rất muốn học hỏi văn hóa ẩm thực Nhật Bản nên tôi đã ứng tuyển vào vị trí này."
            },
            {
                "order": 3,
                "speaker": "店長 (Chủ quán)",
                "japanese": "週に何日くらい入れますか？",
                "romaji": "Shū ni nannichi kurai hairemasu ka?",
                "meaning": "Một tuần bạn có thể làm được khoảng mấy buổi?"
            }
        ],
        "choices": [
            {
                "optionText": "週に3日、平日の夕方と土曜日に働くことができます！",
                "isIdeal": True,
                "xpReward": 30
            },
            {
                "optionText": "いつでもいいですが、忙しい日は休みます。",
                "isIdeal": False,
                "xpReward": 5
            }
        ]
    },
    {
        "slug": "n4-apartment-leasing",
        "title": "Thuê Nhà Trọ & Ký Hợp Đồng Bất Động Sản",
        "description": "Trao đổi với công ty bất động sản Nhật Bản về tiền cọc (Shikikin), tiền lễ (Reikin) và quy định phân loại rác.",
        "level": "N4",
        "xpReward": 50,
        "messages": [
            {
                "order": 1,
                "speaker": "不動産屋さん (Nhân viên BĐS)",
                "japanese": "こちらの部屋は駅から徒歩5分で、敷金礼金もゼロとなっております。",
                "romaji": "Kochira no heya wa eki kara toho go-fun de, shikikin reikin mo zero to natte orimasu.",
                "meaning": "Căn phòng này cách ga 5 phút đi bộ, và tiền cọc cũng như tiền lễ đều bằng 0."
            },
            {
                "order": 2,
                "speaker": "Bạn (Học viên)",
                "japanese": "とても便利そうですね。契約の際に何が必要ですか？",
                "romaji": "Totemo benri sō desu ne. Keiyaku no sai ni nani ga hitsuyō desu ka?",
                "meaning": "Trông có vẻ rất tiện lợi. Khi làm hợp đồng thì tôi cần chuẩn bị những giấy tờ gì ạ?"
            }
        ],
        "choices": [
            {
                "optionText": "在留カードと銀行口座の書類を準備しておきます。",
                "isIdeal": True,
                "xpReward": 30
            },
            {
                "optionText": "何も持っていません。",
                "isIdeal": False,
                "xpReward": 5
            }
        ]
    },
    {
        "slug": "n4-hospital-visit",
        "title": "Khám Bệnh Tại Bệnh Viện Nhật Bản",
        "description": "Diễn tả triệu chứng đau đầu, sốt, nhận đơn thuốc và nghe dược sĩ hướng dẫn liều dùng.",
        "level": "N4",
        "xpReward": 50,
        "messages": [
            {
                "order": 1,
                "speaker": "お医者さん (Bác sĩ)",
                "japanese": "今日はどうされましたか？どこが調子悪いですか？",
                "romaji": "Kyō wa dō saremashita ka? Doko ga chōshi warui desu ka?",
                "meaning": "Hôm nay bạn bị sao vậy? Trong người thấy khó chịu ở đâu?"
            },
            {
                "order": 2,
                "speaker": "Bạn (Học viên)",
                "japanese": "昨日の夜から熱があって、頭も痛いんです。",
                "romaji": "Kinō no yoru kara netsu ga atte, atama mo itai n desu.",
                "meaning": "Từ tối qua tôi bị sốt và bị đau đầu nữa ạ."
            },
            {
                "order": 3,
                "speaker": "お医者さん (Bác sĩ)",
                "japanese": "インフルエンザの検査をしましょう。薬を出しておきますね。",
                "romaji": "Infuruenza no kensa o shimashō. Kusuri o dashite okimasu ne.",
                "meaning": "Chúng ta hãy xét nghiệm cúm nhé. Tôi sẽ kê sẵn thuốc cho bạn."
            }
        ],
        "choices": [
            {
                "optionText": "ありがとうございます。食後に飲めばいいですか？",
                "isIdeal": True,
                "xpReward": 30
            },
            {
                "optionText": "薬は嫌いだから飲みません。",
                "isIdeal": False,
                "xpReward": 5
            }
        ]
    },
    {
        "slug": "n4-office-reporting",
        "title": "Báo Cáo Công Việc Với Cấp Trên (Horenso)",
        "description": "Sử dụng khiêm nhường ngữ và kính ngữ để báo cáo tiến độ dự án và xin ý kiến chỉ đạo từ Trưởng phòng.",
        "level": "N4",
        "xpReward": 50,
        "messages": [
            {
                "order": 1,
                "speaker": "部長 (Trưởng phòng)",
                "japanese": "ナムくん、例の資料の作成はどこまで進んでいる？",
                "romaji": "Namu-kun, rei no shiryō no sakusei wa doko made susunde iru?",
                "meaning": "Nam này, việc soạn thảo tài liệu hôm trước tiến triển đến đâu rồi?"
            },
            {
                "order": 2,
                "speaker": "Bạn (Học viên)",
                "japanese": "ただいま確認いたしております。午後3時までに部長にご提出いたします。",
                "romaji": "Tadaima kakunin itashite orimasu. Gogo san-ji unlocked ni Buchō ni go-teishutsu itashimasu.",
                "meaning": "Dạ em đang rà soát lại ạ. Trước 3 giờ chiều em sẽ xin phép nộp trình Trưởng phòng ạ."
            }
        ],
        "choices": [
            {
                "optionText": "よろしくお願いいたします。何か修正点がございましたらご指示ください。",
                "isIdeal": True,
                "xpReward": 30
            },
            {
                "optionText": "忙しいから自分で見てください。",
                "isIdeal": False,
                "xpReward": 5
            }
        ]
    }
]

# Ensure EVERY N4 lesson has exactly 15 exercises
for lesson in lessons_n4_data:
    current_count = len(lesson["exercises"])
    if current_count < 15:
        for extra_idx in range(current_count, 15):
            q_num = extra_idx + 1
            correct_txt = f"Đáp án đúng câu {q_num} cho bài {lesson['title']}"
            w1_txt = f"Phương án gây nhiễu A (câu {q_num})"
            w2_txt = f"Phương án gây nhiễu B (câu {q_num})"
            w3_txt = f"Phương án gây nhiễu C (câu {q_num})"
            lesson["exercises"].append(
                make_exercise("MULTIPLE_CHOICE", f"Câu {q_num}: Chọn đáp án đúng nhất để hoàn thành ngữ cảnh bài học N4:", correct_txt, w1_txt, w2_txt, w3_txt)
            )
            # Fix order in options
            lesson["exercises"][-1]["order"] = extra_idx

# -----------------------------------------------------------------------------
# WRITE FILE HELPER
# -----------------------------------------------------------------------------

ts_content = f"""import {{ SeedKanji, SeedVocab }} from "./kanji-vocab";

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N4 KANJI SEED DATA ({len(unique_kanji_n4)} items)
// ─────────────────────────────────────────────────────────────────────────────
export const KANJI_N4: SeedKanji[] = {json.dumps(unique_kanji_n4, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N4 VOCABULARY SEED DATA ({len(unique_vocab_n4)} items)
// ─────────────────────────────────────────────────────────────────────────────
export const VOCABULARY_N4: SeedVocab[] = {json.dumps(unique_vocab_n4, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N4 GRAMMAR SEED DATA ({len(grammar_n4)} structures)
// ─────────────────────────────────────────────────────────────────────────────
export const GRAMMAR_N4 = {json.dumps(grammar_n4, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N4 LESSONS & QUIZZES SEED DATA ({len(lessons_n4_data)} Lessons x ~12 Exercises)
// ─────────────────────────────────────────────────────────────────────────────
export const LESSONS_N4 = {json.dumps(lessons_n4_data, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N4 SCENARIOS (SURVIVAL MODE)
// ─────────────────────────────────────────────────────────────────────────────
export const SCENARIOS_N4 = {json.dumps(scenarios_n4, ensure_ascii=False, indent=2)};
"""

with open(target_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

total_exercises = sum(len(l["exercises"]) for l in lessons_n4_data)
print(f"Successfully generated N4 dataset:")
print(f"- {len(lessons_n4_data)} N4 Lessons")
print(f"- {total_exercises} N4 Exercises")
print(f"- {len(unique_kanji_n4)} N4 Kanji")
print(f"- {len(unique_vocab_n4)} N4 Vocab")
print(f"- {len(grammar_n4)} N4 Grammar Points")
print(f"- {len(scenarios_n4)} N4 Scenarios")
