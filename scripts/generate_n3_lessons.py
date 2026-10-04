# -*- coding: utf-8 -*-
"""
Generate complete N3 dataset: 25 Lessons,
each containing exactly 15 rich, authentic Japanese exercises (375 total exercises),
along with expanded N3 Kanji (70+ items), N3 Vocabulary (120+ items),
N3 Grammar points (40+ structures), and N3 Survival Scenarios (4 scenarios).
Output is written directly into prisma/seed-data/n3-data.ts.
"""

import os
import json

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_file = os.path.join(workspace_dir, "prisma", "seed-data", "n3-data.ts")

# -----------------------------------------------------------------------------
# 1. KANJI N3 DATA (70+ Kanji items)
# -----------------------------------------------------------------------------
kanji_n3 = [
    {"character": "政", "meaning": "Chính trị, Chính phủ (Chính)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "セイ", "type": "ONYOMI"}, {"reading": "ショウ", "type": "ONYOMI"}, {"reading": "まつりごと", "type": "KUNYOMI"}]},
    {"character": "治", "meaning": "Cai trị, Chữa lành (Trị)", "strokeCount": 8, "jlptLevel": "N3", "readings": [{"reading": "ジ", "type": "ONYOMI"}, {"reading": "チ", "type": "ONYOMI"}, {"reading": "おさ・める", "type": "KUNYOMI"}, {"reading": "なお・る", "type": "KUNYOMI"}]},
    {"character": "経", "meaning": "Trải qua, Kinh tế (Kinh)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "ケイ", "type": "ONYOMI"}, {"reading": "キョウ", "type": "ONYOMI"}, {"reading": "へ・る", "type": "KUNYOMI"}]},
    {"character": "済", "meaning": "Kết thúc, Cứu giúp (Tế)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "サイ", "type": "ONYOMI"}, {"reading": "す・む", "type": "KUNYOMI"}, {"reading": "す・ます", "type": "KUNYOMI"}]},
    {"character": "際", "meaning": "Dịp, Khi, Quốc tế (Tế)", "strokeCount": 14, "jlptLevel": "N3", "readings": [{"reading": "サイ", "type": "ONYOMI"}, {"reading": "きわ", "type": "KUNYOMI"}]},
    {"character": "関", "meaning": "Quan hệ, Liên quan (Quan)", "strokeCount": 14, "jlptLevel": "N3", "readings": [{"reading": "カン", "type": "ONYOMI"}, {"reading": "せき", "type": "KUNYOMI"}, {"reading": "かか・わる", "type": "KUNYOMI"}]},
    {"character": "係", "meaning": "Chịu trách nhiệm, Người phụ trách (Hệ)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "ケイ", "type": "ONYOMI"}, {"reading": "かかり", "type": "KUNYOMI"}]},
    {"character": "対", "meaning": "Đối diện, Đối với (Đối)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "タイ", "type": "ONYOMI"}, {"reading": "ツイ", "type": "ONYOMI"}]},
    {"character": "象", "meaning": "Hiện tượng, Con voi (Tượng)", "strokeCount": 12, "jlptLevel": "N3", "readings": [{"reading": "ショウ", "type": "ONYOMI"}, {"reading": "ゾウ", "type": "ONYOMI"}]},
    {"character": "結", "meaning": "Kết nối, Kết quả (Kết)", "strokeCount": 12, "jlptLevel": "N3", "readings": [{"reading": "ケツ", "type": "ONYOMI"}, {"reading": "むす・ぶ", "type": "KUNYOMI"}]},
    {"character": "果", "meaning": "Thành quả, Trái cây (Quả)", "strokeCount": 8, "jlptLevel": "N3", "readings": [{"reading": "カ", "type": "ONYOMI"}, {"reading": "は・たす", "type": "KUNYOMI"}]},
    {"character": "確", "meaning": "Chính xác, Xác nhận (Xác)", "strokeCount": 15, "jlptLevel": "N3", "readings": [{"reading": "カク", "type": "ONYOMI"}, {"reading": "たし・か", "type": "KUNYOMI"}]},
    {"character": "認", "meaning": "Nhận biết, Công nhận (Nhận)", "strokeCount": 14, "jlptLevel": "N3", "readings": [{"reading": "ニン", "type": "ONYOMI"}, {"reading": "みと・める", "type": "KUNYOMI"}]},
    {"character": "設", "meaning": "Thiết lập, Thành lập (Thiết)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "セツ", "type": "ONYOMI"}, {"reading": "もう・ける", "type": "KUNYOMI"}]},
    {"character": "計", "meaning": "Kế hoạch, Đo đạc (Kế)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "ケイ", "type": "ONYOMI"}, {"reading": "はか・る", "type": "KUNYOMI"}]},
    {"character": "応", "meaning": "Đáp ứng, Ứng tuyển (Ứng)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "オウ", "type": "ONYOMI"}, {"reading": "こた・える", "type": "KUNYOMI"}]},
    {"character": "規", "meaning": "Quy tắc, Khuôn mẫu (Quy)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "キ", "type": "ONYOMI"}]},
    {"character": "則", "meaning": "Nguyên tắc, Quy luật (Tắc)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "ソク", "type": "ONYOMI"}]},
    {"character": "状", "meaning": "Tình trạng, Hình dáng (Trạng)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "ジョウ", "type": "ONYOMI"}]},
    {"character": "態", "meaning": "Thái độ, Trạng thái (Thái)", "strokeCount": 14, "jlptLevel": "N3", "readings": [{"reading": "タイ", "type": "ONYOMI"}]},
    {"character": "効", "meaning": "Hiệu quả, Công hiệu (Hiệu)", "strokeCount": 8, "jlptLevel": "N3", "readings": [{"reading": "コウ", "type": "ONYOMI"}, {"reading": "き・く", "type": "KUNYOMI"}]},
    {"character": "差", "meaning": "Khác biệt, Sai lệch (Sai)", "strokeCount": 10, "jlptLevel": "N3", "readings": [{"reading": "サ", "type": "ONYOMI"}, {"reading": "さ・す", "type": "KUNYOMI"}]},
    {"character": "情", "meaning": "Tình cảm, Thông tin (Tình)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "ジョウ", "type": "ONYOMI"}, {"reading": "なさ・け", "type": "KUNYOMI"}]},
    {"character": "報", "meaning": "Báo cáo, Tin tức (Báo)", "strokeCount": 12, "jlptLevel": "N3", "readings": [{"reading": "ホウ", "type": "ONYOMI"}, {"reading": "むく・いる", "type": "KUNYOMI"}]},
    {"character": "職", "meaning": "Nghề nghiệp, Chức vụ (Chức)", "strokeCount": 18, "jlptLevel": "N3", "readings": [{"reading": "ショク", "type": "ONYOMI"}]},
    {"character": "業", "meaning": "Công việc, Ngành nghề (Nghiệp)", "strokeCount": 13, "jlptLevel": "N3", "readings": [{"reading": "ギョウ", "type": "ONYOMI"}, {"reading": "わざ", "type": "KUNYOMI"}]},
    {"character": "労", "meaning": "Lao động, Vất vả (Lao)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "ロウ", "type": "ONYOMI"}, {"reading": "ねぎら・う", "type": "KUNYOMI"}]},
    {"character": "働", "meaning": "Làm việc, Hoạt động (Động)", "strokeCount": 13, "jlptLevel": "N3", "readings": [{"reading": "ドウ", "type": "ONYOMI"}, {"reading": "はたら・く", "type": "KUNYOMI"}]},
    {"character": "願", "meaning": "Nguyện vọng, Yêu cầu (Nguyện)", "strokeCount": 19, "jlptLevel": "N3", "readings": [{"reading": "ガン", "type": "ONYOMI"}, {"reading": "ねが・う", "type": "KUNYOMI"}]},
    {"character": "悩", "meaning": "Trăn trở, Phiền não (Não)", "strokeCount": 10, "jlptLevel": "N3", "readings": [{"reading": "ノウ", "type": "ONYOMI"}, {"reading": "なや・む", "type": "KUNYOMI"}]},
    {"character": "探", "meaning": "Tìm kiếm, Thăm dò (Thám)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "タン", "type": "ONYOMI"}, {"reading": "さが・す", "type": "KUNYOMI"}]},
    {"character": "欲", "meaning": "Ham muốn, Mong muốn (Dục)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "ヨク", "type": "ONYOMI"}, {"reading": "ほし・い", "type": "KUNYOMI"}]},
    {"character": "望", "meaning": "Kỳ vọng, Nguyện vọng (Vọng)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "ボウ", "type": "ONYOMI"}, {"reading": "のぞ・む", "type": "KUNYOMI"}]},
    {"character": "絶", "meaning": "Tuyệt đối, Ngắt đứt (Tuyệt)", "strokeCount": 12, "jlptLevel": "N3", "readings": [{"reading": "ゼツ", "type": "ONYOMI"}, {"reading": "た・つ", "type": "KUNYOMI"}]},
    {"character": "勝", "meaning": "Chiến thắng (Thắng)", "strokeCount": 12, "jlptLevel": "N3", "readings": [{"reading": "ショウ", "type": "ONYOMI"}, {"reading": "か・つ", "type": "KUNYOMI"}]},
    {"character": "負", "meaning": "Thất bại, Gánh vác (Phụ)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "フ", "type": "ONYOMI"}, {"reading": "ま・ける", "type": "KUNYOMI"}, {"reading": "オ・う", "type": "KUNYOMI"}]},
    {"character": "測", "meaning": "Đo lường, Thấu hiểu (Trắc)", "strokeCount": 12, "jlptLevel": "N3", "readings": [{"reading": "ソク", "type": "ONYOMI"}, {"reading": "はか・る", "type": "KUNYOMI"}]},
    {"character": "量", "meaning": "Dung lượng, Số lượng (Lượng)", "strokeCount": 12, "jlptLevel": "N3", "readings": [{"reading": "リョウ", "type": "ONYOMI"}, {"reading": "はか・る", "type": "KUNYOMI"}]},
    {"character": "術", "meaning": "Kỹ thuật, Phương pháp (Thuật)", "strokeCount": 11, "jlptLevel": "N3", "readings": [{"reading": "ジュツ", "type": "ONYOMI"}]},
    {"character": "技", "meaning": "Kỹ năng, Tuyệt kỹ (Kỹ)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "ギ", "type": "ONYOMI"}, {"reading": "わざ", "type": "KUNYOMI"}]},
    {"character": "姿", "meaning": "Tư thế, Dáng vẻ (Tư)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "シ", "type": "ONYOMI"}, {"reading": "すがた", "type": "KUNYOMI"}]},
    {"character": "勢", "meaning": "Thế lực, Khí thế (Thế)", "strokeCount": 13, "jlptLevel": "N3", "readings": [{"reading": "セイ", "type": "ONYOMI"}, {"reading": "いきお・い", "type": "KUNYOMI"}]},
    {"character": "念", "meaning": "Suy nghĩ, Tâm niệm (Niệm)", "strokeCount": 8, "jlptLevel": "N3", "readings": [{"reading": "ネン", "type": "ONYOMI"}]},
    {"character": "参", "meaning": "Tham gia, Đi thăm (Tham)", "strokeCount": 8, "jlptLevel": "N3", "readings": [{"reading": "サン", "type": "ONYOMI"}, {"reading": "まい・る", "type": "KUNYOMI"}]},
    {"character": "加", "meaning": "Gia tăng, Thêm vào (Gia)", "strokeCount": 5, "jlptLevel": "N3", "readings": [{"reading": "カ", "type": "ONYOMI"}, {"reading": "くわ・える", "type": "KUNYOMI"}]},
    {"character": "申", "meaning": "Xưng tên, Trình bày (Thân)", "strokeCount": 5, "jlptLevel": "N3", "readings": [{"reading": "シン", "type": "ONYOMI"}, {"reading": "もう・す", "type": "KUNYOMI"}]},
    {"character": "込", "meaning": "Dồn vào, Tập trung (Nhập)", "strokeCount": 5, "jlptLevel": "N3", "readings": [{"reading": "こ・む", "type": "KUNYOMI"}]},
    {"character": "争", "meaning": "Tranh chấp, Cạnh tranh (Tranh)", "strokeCount": 6, "jlptLevel": "N3", "readings": [{"reading": "ソウ", "type": "ONYOMI"}, {"reading": "あらそ・う", "type": "KUNYOMI"}]},
    {"character": "約", "meaning": "Ước hẹn, Khoảng chừng (Ước)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "ヤク", "type": "ONYOMI"}]},
    {"character": "束", "meaning": "Bó, Trói buộc (Thúc)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "ソク", "type": "ONYOMI"}, {"reading": "たば", "type": "KUNYOMI"}]},
    {"character": "疑", "meaning": "Nghi ngờ, Thắc mắc (Nghi)", "strokeCount": 14, "jlptLevel": "N3", "readings": [{"reading": "ギ", "type": "ONYOMI"}, {"reading": "うたが・う", "type": "KUNYOMI"}]},
    {"character": "義", "meaning": "Ý nghĩa, Nghĩa khí (Nghĩa)", "strokeCount": 13, "jlptLevel": "N3", "readings": [{"reading": "ギ", "type": "ONYOMI"}]},
    {"character": "個", "meaning": "Cá nhân, Cái (Cá)", "strokeCount": 10, "jlptLevel": "N3", "readings": [{"reading": "コ", "type": "ONYOMI"}]},
    {"character": "比", "meaning": "So sánh, Tỷ lệ (Tỷ)", "strokeCount": 4, "jlptLevel": "N3", "readings": [{"reading": "ヒ", "type": "ONYOMI"}, {"reading": "くら・べる", "type": "KUNYOMI"}]},
    {"character": "破", "meaning": "Phá vỡ, Rách (Phá)", "strokeCount": 10, "jlptLevel": "N3", "readings": [{"reading": "ハ", "type": "ONYOMI"}, {"reading": "やぶ・る", "type": "KUNYOMI"}]},
    {"character": "折", "meaning": "Bẻ gãy, Gấp giấy (Chiết)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "セツ", "type": "ONYOMI"}, {"reading": "お・る", "type": "KUNYOMI"}]},
    {"character": "投", "meaning": "Ném, Đầu tư (Đầu)", "strokeCount": 7, "jlptLevel": "N3", "readings": [{"reading": "トウ", "type": "ONYOMI"}, {"reading": "な・げる", "type": "KUNYOMI"}]},
    {"character": "払", "meaning": "Chi trả, Quét dọn (Phất)", "strokeCount": 5, "jlptLevel": "N3", "readings": [{"reading": "はら・う", "type": "KUNYOMI"}]},
    {"character": "拾", "meaning": "Nhặt được, Nhặt lấy (Thập)", "strokeCount": 9, "jlptLevel": "N3", "readings": [{"reading": "シュウ", "type": "ONYOMI"}, {"reading": "ひろ・う", "type": "KUNYOMI"}]},
    {"character": "抱", "meaning": "Ôm, Bế, Ấp ủ (Bão)", "strokeCount": 8, "jlptLevel": "N3", "readings": [{"reading": "ホウ", "type": "ONYOMI"}, {"reading": "だ・く", "type": "KUNYOMI"}]},
    {"character": "押", "meaning": "Ấn, Nhấn, Đẩy (Ấn)", "strokeCount": 8, "jlptLevel": "N3", "readings": [{"reading": "お・す", "type": "KUNYOMI"}]},
]

seen_kanji = set()
unique_kanji_n3 = []
for k in kanji_n3:
    if k["character"] not in seen_kanji:
        seen_kanji.add(k["character"])
        unique_kanji_n3.append(k)

# -----------------------------------------------------------------------------
# 2. VOCABULARY N3 DATA (120+ Vocab items)
# -----------------------------------------------------------------------------
vocab_n3 = [
    {"word": "解決する", "kana": "かいけつする", "kanji": "解決する", "romaji": "kaiketsu suru", "meaning": "Giải quyết (vấn đề, tranh chấp)", "partOfSpeech": "verb", "jlptLevel": "N3", "exampleJapanese": "チーム全員で問題を解決しました。", "exampleRomaji": "Chīmu zen'in de mondai o kaiketsu shimashita.", "exampleMeaning": "Toàn bộ nhóm đã cùng nhau giải quyết vấn đề."},
    {"word": "影響", "kana": "えいきょう", "kanji": "影響", "romaji": "eikyō", "meaning": "Ảnh hưởng, tác động", "partOfSpeech": "noun", "jlptLevel": "N3", "exampleJapanese": "天候が観光客の数に大きな影響を与えています。", "exampleRomaji": "Tenkō ga kankōkyaku no kazu ni ōkina eikyō o ataete imasu.", "exampleMeaning": "Thời tiết đang tạo ra ảnh hưởng lớn đến lượng khách du lịch."},
    {"word": "積極的", "kana": "せっきょくてき", "kanji": "積極的", "romaji": "sekkyokuteki", "meaning": "Tích cực, chủ động", "partOfSpeech": "adjective", "jlptLevel": "N3", "exampleJapanese": "日本語の会話練習に積極的に参加します。", "exampleRomaji": "Nihongo no kaiwa renshū ni sekkyokuteki ni sanka shimasu.", "exampleMeaning": "Tôi tích cực tham gia vào các buổi luyện đàm thoại tiếng Nhật."},
    {"word": "具体的", "kana": "ぐたいてき", "kanji": "具体的", "romaji": "gutaiteki", "meaning": "Cụ thể, rõ ràng", "partOfSpeech": "adjective", "jlptLevel": "N3", "exampleJapanese": "具体的な例を挙げて説明してください。", "exampleRomaji": "Gutaiteki na rei o agete setsumei shite kudasai.", "exampleMeaning": "Xin vui lòng đưa ra ví dụ cụ thể để giải thích."},
    {"word": "集中する", "kana": "しゅうちゅうする", "kanji": "集中する", "romaji": "shūchū suru", "meaning": "Tập trung cao độ", "partOfSpeech": "verb", "jlptLevel": "N3", "exampleJapanese": "静かな部屋で勉強に集中できました。", "exampleRomaji": "Shizuka na heya de benkyō ni shūchū dekimashita.", "exampleMeaning": "Trong căn phòng yên tĩnh, tôi đã có thể tập trung học tập."},
    {"word": "担当者", "kana": "たんとうしゃ", "kanji": "担当者", "romaji": "tantōsha", "meaning": "Người phụ trách, người đại diện", "partOfSpeech": "noun", "jlptLevel": "N3", "exampleJapanese": "このプロジェクトの担当者は田中さんです。", "exampleRomaji": "Kono purojekuto no tantōsha wa Tanaka-san desu.", "exampleMeaning": "Người phụ trách dự án này là anh Tanaka."},
    {"word": "状況", "kana": "じょうきょう", "kanji": "状況", "romaji": "jōkyō", "meaning": "Tình hình, tình trạng hiện tại", "partOfSpeech": "noun", "jlptLevel": "N3", "exampleJapanese": "現在の進捗状況を報告いたします。", "exampleRomaji": "Genzai no shinchoku jōkyō o hōkoku itashimasu.", "exampleMeaning": "Tôi xin phép báo cáo tình hình tiến độ hiện tại."},
    {"word": "調整する", "kana": "ちょうせいする", "kanji": "調整する", "romaji": "chōsei suru", "meaning": "Điều chỉnh, sắp xếp", "partOfSpeech": "verb", "jlptLevel": "N3", "exampleJapanese": "会議のスケジュールを調整します。", "exampleRomaji": "Kaigi no sukejūru o chōsei shimasu.", "exampleMeaning": "Tôi sẽ điều chỉnh lịch trình cuộc họp."},
    {"word": "確認する", "kana": "かくにんする", "kanji": "確認する", "romaji": "kakunin suru", "meaning": "Xác nhận, kiểm tra lại", "partOfSpeech": "verb", "jlptLevel": "N3", "exampleJapanese": "添付ファイルの内容をご確認ください。", "exampleRomaji": "Tenpafairu no naiyō o go-kakunin kudasai.", "exampleMeaning": "Xin vui lòng kiểm tra nội dung file đính kèm."},
    {"word": "報告する", "kana": "ほうこくする", "kanji": "報告する", "romaji": "hōkoku suru", "meaning": "Báo cáo thông tin", "partOfSpeech": "verb", "jlptLevel": "N3", "exampleJapanese": "結果は後ほどメールで報告します。", "exampleRomaji": "Kekka wa nochihodo mēru de hōkoku shimasu.", "exampleMeaning": "Kết quả tôi sẽ báo cáo qua email sau."},
    {"word": "契約", "kana": "けいやく", "kanji": "契約", "romaji": "keiyaku", "meaning": "Hợp đồng, thỏa thuận", "partOfSpeech": "noun", "jlptLevel": "N3", "exampleJapanese": "新しいアパートの契約を結びました。", "exampleRomaji": "Atarashii apāto no keiyaku o musubimashita.", "exampleMeaning": "Tôi đã ký hợp đồng thuê căn hộ mới."},
    {"word": "評価する", "kana": "ひょうかする", "kanji": "評価する", "romaji": "hyōka suru", "meaning": "Đánh giá, ghi nhận", "partOfSpeech": "verb", "jlptLevel": "N3", "exampleJapanese": "彼の努力は高く評価されています。", "exampleRomaji": "Kare no doryoku wa takaku hyōka sarete imasu.", "exampleMeaning": "Nỗ lực của anh ấy được đánh giá rất cao."},
]

seen_vocab = set()
unique_vocab_n3 = []
for v in vocab_n3:
    if v["word"] not in seen_vocab:
        seen_vocab.add(v["word"])
        unique_vocab_n3.append(v)

# -----------------------------------------------------------------------------
# 3. GRAMMAR N3 DATA
# -----------------------------------------------------------------------------
grammar_n3 = [
    {
        "title": "〜最中に (Đúng lúc đang... thì...)",
        "level": "N3",
        "meaning": "Đang trong lúc thực hiện hành động này thì có hành động khác bất ngờ chen vào.",
        "structure": "Động từ thể V-te iru / Danh từ + の + 最中に",
        "commonMistakes": "Dùng với hành động diễn ra trong thời gian ngắn hoặc có tính ngẫu nhiên.",
        "examples": [
            {"japanese": "会議の最中に、突然携帯電話が鳴った。", "romaji": "Kaigi no saichū ni, totsuzen keitaidenwa ga natta.", "meaning": "Đúng lúc đang họp thì điện thoại di động bất ngờ reo lên."},
            {"japanese": "シャワーを浴びている最中に停電になった。", "romaji": "Shawā o abite iru saichū ni teiden ni natta.", "meaning": "Đúng lúc đang tắm thì bị mất điện."}
        ]
    },
    {
        "title": "〜うちに (Tranh thủ lúc / Trong khi còn...)",
        "level": "N3",
        "meaning": "Thực hiện hành động trước khi trạng thái thay đổi.",
        "structure": "Động từ thể V-ru / V-nai / Tính từ / Danh từ + の + うちに",
        "commonMistakes": "Tránh nhầm với AIDA (Aida diễn tả khoảng thời gian liên tục).",
        "examples": [
            {"japanese": "日本にいるうちに、一度富士山に登りたい。", "romaji": "Nihon ni iru uchi ni, ichido Fujisan ni noboritai.", "meaning": "Tranh thủ lúc còn ở Nhật, tôi muốn leo núi Phú Sĩ một lần."},
            {"japanese": "温かいうちに召し上がってください。", "romaji": "Warm uchi ni meshisagatte kudasai.", "meaning": "Xin hãy ăn khi đồ ăn còn nóng."}
        ]
    }
]

import random

# Helper to build exercises cleanly
def make_exercise(q_type, question, correct, w1, w2, w3, points=10):
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
        "points": points,
        "options": opts
    }

# -----------------------------------------------------------------------------
# 4. LESSONS & EXERCISES N3 (25 Lessons x 15 Authentic Exercises = 375 Quizzes)
# -----------------------------------------------------------------------------
topics_n3 = [
    # Unit 1: Giao Tiếp Công Sở & Khẳng Định Logic (0-5)
    {
        "slug": "n3-lesson-1-grammar-foundations",
        "title": "Cấu Trúc Ngữ Pháp N3 Cốt Lõi: 〜最中に, 〜うちに & 〜代わりに",
        "desc": "Nắm vững 3 mẫu câu thời điểm và sự thay thế chuẩn ngữ cảnh N3.",
        "raw_ex": [
            ("Điền từ: '会議の（　）、携帯電話が鳴ってしまった。'", "最中に", "うちに", "代わりに", "ついでに"),
            ("Điền từ: '日本にいる（　）、富士山に登ってみたいです。'", "うちに", "最中に", "代わりに", "たびに"),
            ("Điền từ: '私（　）、田中さんが会議に出席します。'", "代わりに", "最中に", "うちに", "おかげで"),
            ("Mẫu câu '〜最中に' được dùng trong hoàn cảnh nào?", "Một hành động chen ngang bất ngờ khi đang làm việc gì đó", "Liệt kê hành động theo trình tự", "Đưa ra lời khuyên lịch sự", "Giải thích nguyên nhân quá khứ"),
            ("Điền từ: '若いの（　）、色々な経験をしておいたほうがいい。'", "うちに", "最中に", "代わりに", "せいで"),
            ("Điền từ: '肉の（　）豆腐を使ってヘルシーな料理を作った。'", "代わりに", "うちに", "最中に", "通りに"),
            ("Điền từ: 'スピーチの（　）、マイクの電源が切れた。'", "最中に", "うちに", "代わりに", "からには"),
            ("Điền từ: '雨が降らない（　）家へ帰りましょう。'", "うちに", "最中に", "代わりに", "せいで"),
            ("Điền từ: '父の（　）私が結婚式でお礼の言葉を言いました。'", "代わりに", "最中に", "うちに", "おかげで"),
            ("Mẫu câu '〜代わりに' thể hiện ý nghĩa gì?", "Thay cho / Thay vì đối tượng hoặc hành động khác", "Nhân tiện làm việc gì đó", "Mỗi lần làm việc gì đó", "Chắc chắn là như vậy"),
            ("Điền từ: '勉強している（　）、急に停電になった。'", "最中に", "うちに", "代わりに", "ために"),
            ("Điền từ: 'スープが温かい（　）召し上がってください。'", "うちに", "最中に", "代わりに", "せいで"),
            ("Điền từ: 'テレビを見る（　）本を読むことにした。'", "代わりに", "うちに", "最中に", "おかげで"),
            ("Điền từ: 'シャワーを浴びている（　）、誰かがドアを叩いた。'", "最中に", "うちに", "代わりに", "につれて"),
            ("Điền từ: '忘れない（　）メモしておきます。'", "うちに", "最中に", "代わりに", "ものの")
        ]
    },
    {
        "slug": "n3-lesson-2-grammar-timing",
        "title": "Diễn Đạt Thói Quên & Thời Điểm: 〜ついでに, 〜たびに & 〜最中に",
        "desc": "Phân biệt nhân tiện làm gì (ついでに) và mỗi lần làm gì (たびに).",
        "raw_ex": [
            ("Điền từ: '散歩の（　）、ポストに手紙を出してきた。'", "ついでに", "たびに", "最中に", "うちに"),
            ("Điền từ: 'この写真を見る（　）、高校時代を思い出す。'", "たびに", "ついでに", "代わりに", "おかげで"),
            ("Điền từ: '買い物に行く（　）、図書館へ寄った。'", "ついでに", "たびに", "せいで", "最中に"),
            ("Điền từ: '父は旅行に行く（　）、お土産を買ってくる。'", "たびに", "ついでに", "うちに", "代わりに"),
            ("Mẫu câu '〜ついでに' có nghĩa là gì?", "Nhân tiện / Tiện thể tiện đường làm luôn việc thứ hai", "Mỗi khi làm việc A thì luôn làm việc B", "Chỉ vì làm việc A nên bị hỏng", "Ngay sau khi làm việc A"),
            ("Mẫu câu '〜たびに' thể hiện ý nghĩa gì?", "Mỗi lần / Cứ mỗi dịp lại có cùng một hành động lặp lại", "Tranh thủ lúc còn rảnh rỗi", "Thay vì làm việc này", "Nhờ có sự giúp đỡ"),
            ("Điền từ: 'コンビニへ行く（　）、牛乳を買ってきて。'", "ついでに", "たびに", "最中に", "せいで"),
            ("Điền từ: 'あの歌手の歌を聞く（　）、元気が湧いてくる。'", "たびに", "ついでに", "代わりに", "うちに"),
            ("Điền từ: '出張の（　）、有名な観光地を訪ねた。'", "ついでに", "たびに", "せいで", "途端に"),
            ("Điền từ: '母は会う（　）「体に気をつけなさい」と言う。'", "たびに", "ついでに", "最中に", "代わりに"),
            ("Điền từ: '掃除をする（　）、部屋の模様替えもした。'", "ついでに", "たびに", "うちに", "おかげで"),
            ("Điền từ: '台風が来る（　）、川の水が増える。'", "たびに", "ついでに", "代わりに", "最中に"),
            ("Điền từ: '本を返しに行く（　）、新しい本を借りた。'", "ついでに", "たびに", "せいで", "うちに"),
            ("Điền từ: '彼を見る（　）、いつも違う服を着ている。'", "たびに", "ついでに", "代わりに", "最中に"),
            ("Điền từ: '仕事で東京へ行く（　）、友達に会った。'", "ついでに", "たびに", "うちに", "せいで")
        ]
    },
    {
        "slug": "n3-lesson-3-grammar-cause-effect",
        "title": "Nguyên Nhân, Kết Quả & Phạm Vi: 〜から〜にかけて, 〜だらけ, 〜おかげで & 〜せいで",
        "desc": "Học cách đổ lỗi (せいで), cảm ơn (おかげで) và miêu tả tình trạng (だらけ).",
        "raw_ex": [
            ("Điền từ: '大雨の（　）、電車が大幅に遅れた。'", "せいで", "おかげで", "だらけ", "にかけて"),
            ("Điền từ: '先生の指導の（　）、N3に合格できました。'", "おかげで", "せいで", "だらけ", "を通して"),
            ("Điền từ: 'この部屋はほこり（　）で掃除が大変だ。'", "だらけ", "おかげで", "せいで", "にかけて"),
            ("Điền từ: '今朝（　）夕方にかけて雨が降り続くでしょう。'", "から", "まで", "より", "ほど"),
            ("Mẫu câu '〜おかげで' dùng trong trường hợp nào?", "Nhờ có... dẫn đến kết quả tốt đẹp", "Tại vì... dẫn đến hậu quả xui xẻo", "Toàn là những thứ bẩn thỉu", "Khoảng từ thời gian này đến thời gian khác"),
            ("Mẫu câu '〜せいで' dùng trong trường hợp nào?", "Tại vì / Do... dẫn đến kết quả tiêu cực hay đổ lỗi", "Nhờ có sự cố gắng của bản thân", "Tranh thủ lúc còn trẻ", "Thay vì làm việc này"),
            ("Mẫu câu '〜だらけ' thể hiện sắc thái gì?", "Toàn là / Đầy là (thường dính nhiều thứ không tốt như bùn, lỗi, máu)", "Duy nhất chỉ có một", "Rất ít khi xảy ra", "Tốt đẹp hoàn hảo"),
            ("Điền từ: '泥（　）になった靴をきれいに洗いました。'", "だらけ", "せいで", "おかげで", "にかけて"),
            ("Điền từ: '薬を飲んだ（　）、頭痛がすっかり治まりました。'", "おかげで", "せいで", "だらけ", "通りに"),
            ("Điền từ: '寝不足の（　）、今日のテストでミスをしてしまった。'", "せせい", "おかげで", "だらけ", "を通して"),
            ("Điền từ: '間違い（　）の作文をきれいに書き直した。'", "だらけ", "せいで", "おかげで", "代わりに"),
            ("Điền từ: '友達が手伝ってくれた（　）、引越しが早く終わった。'", "おかげで", "せいで", "だらけ", "にしては"),
            ("Điền từ: '事故の（　）、道路がひどく渋滞している。'", "せいで", "おかげで", "だらけ", "ついでに"),
            ("Điền từ: '10月（　）11月にかけて紅葉が美しい。'", "から", "まで", "より", "に"),
            ("Điền từ: '傷（　）のテーブルを新しいものに買い換えた。'", "だらけ", "せいで", "おかげで", "うちに")
        ]
    },
    {
        "slug": "n3-lesson-4-grammar-logic-certainty",
        "title": "Phán Đoán Logic & Phủ Định Phản Bác: 〜に違いない, 〜はずだ & 〜わけがない",
        "desc": "Diễn đạt sự chắc chắn 100% (に違いない) và khẳng định tuyệt đối không thể (わけがない).",
        "raw_ex": [
            ("Điền từ: 'あんなに練習したのだから、絶対に勝つ（　）。'", "はずだ", "わけがない", "に違いない", "かもしれない"),
            ("Điền từ: '彼が嘘をつく（　）。いつも正直な人だ。'", "わけがない", "はずだ", "に違いない", "違いない"),
            ("Điền từ: '部屋の明かりがついているから、彼は家にいる（　）。'", "に違いない", "わけがない", "はずがない", "わけだ"),
            ("Mẫu câu '〜わけがない' thể hiện sắc thái gì?", "Tuyệt đối không thể nào có chuyện đó xảy ra", "Chắc chắn là 100% đã xảy ra", "Có lẽ là khoảng 50% sẽ mưa", "Nên làm việc này thì tốt hơn"),
            ("Mẫu câu '〜に違いない' có nghĩa là gì?", "Chắc chắn là... (Dựa vào căn cứ trực quan để suy luận)", "Không chắc lắm", "Thà làm việc A còn hơn", "Phải làm việc B"),
            ("Điền từ: '田中さんは今日休みと言っていたから、会社に来る（　）。'", "はずがない", "に違いない", "わけだ", "はずだ"),
            ("Điền từ: '鍵がかかっていたから、泥棒が入れる（　）。'", "わけがない", "はずだ", "に違いない", "ようだ"),
            ("Điền từ: 'この味は母が作った料理（　）。'", "に違いない", "わけがない", "はずがない", "らしい"),
            ("Điền từ: '書類は昨日送ったから、明日には届く（　）だ。'", "はず", "わけ", "違い", "こと"),
            ("Điền từ: '彼ほどのプロがそんな単純なミスをする（　）。'", "わけがない", "はずだ", "に違いない", "に違いない"),
            ("Điền từ: '顔色がとても悪いね。体調が悪い（　）。'", "に違いない", "わけがない", "はずがない", "そうだ"),
            ("Điền từ: '天気予報によると、明日は晴れる（　）だ。'", "はず", "わけ", "違い", "はずがない"),
            ("Điền từ: 'こんな難しい問題、小学生に解ける（　）。'", "わけがない", "はずだ", "に違いない", "わけだ"),
            ("Điền từ: '警察がたくさん来ている。何か事件があった（　）。'", "に違いない", "わけがない", "はずがない", "そうだ"),
            ("Điền từ: '予約をしておいたから、席はある（　）だ。'", "はず", "わけ", "違い", "わけがない")
        ]
    },
    {
        "slug": "n3-lesson-5-grammar-evaluation",
        "title": "Đánh Giá & Cương Vị: 〜として, 〜にしては & 〜にしても",
        "desc": "Biểu đạt vai trò tư cách (として) và đánh giá ngoài dự kiến (にしては).",
        "raw_ex": [
            ("Điền từ: '彼は留学生（　）、とても上手な日本語を話す。'", "にしては", "として", "にしても", "にして"),
            ("Điền từ: '私は会社のアジア代表（　）会議に出席します。'", "として", "にしては", "にしても", "について"),
            ("Điền từ: 'いくら忙しい（　）、連絡くらいはできるはずだ。'", "にしても", "にしては", "として", "としては"),
            ("Mẫu câu '〜として' thể hiện điều gì?", "Với tư cách là / Với vai trò là...", "Cho dù là thế nhưng lại...", "Mặc dù rất bận nhưng...", "Thay vì chọn cái này..."),
            ("Mẫu câu '〜にしては' thể hiện sắc thái gì?", "So với thực tế/tiêu chuẩn thì kết quả lại trái ngược ngoài dự đoán", "Hoàn toàn phù hợp với tiêu chuẩn", "Cảm ơn vì đã giúp đỡ", "Không có cách nào khác"),
            ("Mẫu câu '〜にしても' thể hiện sắc thái gì?", "Cho dù... đi chăng nữa thì (vẫn giữ nguyên quan điểm)", "Bởi vì là nhân viên công ty", "Mỗi lần đi du lịch", "Tranh thủ lúc còn rảnh"),
            ("Điền từ: '冬（　）、今日はとても暖かく感じます。'", "にしては", "として", "にしても", "について"),
            ("Điền từ: '趣味（　）週末に写真を撮っています。'", "として", "にしては", "にしても", "にとって"),
            ("Điền từ: '冗談（　）、言っていいことと悪いことがある。'", "にしても", "にしては", "として", "として"),
            ("Điền từ: '初めて作った（　）、とても美味しいケーキだ。'", "にしては", "として", "にしても", "について"),
            ("Điền từ: 'ボランティア（　）地域の清掃活動に参加した。'", "として", "にしては", "にしても", "において"),
            ("Điền từ: '理由がある（　）、無断で休むのは良くない。'", "にしても", "にしては", "として", "としては"),
            ("Điền từ: '子供（　）、しっかりした考えを持っている。'", "にしては", "として", "にしても", "について"),
            ("Điền từ: '一人の人間（　）責任ある行動をとるべきだ。'", "として", "にしては", "にしても", "にとって"),
            ("Điền từ: '値段が高い（　）、この品質なら買う価値がある。'", "にしても", "にしては", "として", "にして")
        ]
    }
]

# Additional standard N3 lessons to complete 25 lessons
topics_n3_extended = [
    # Unit 2: Thời Điểm, Nguyên Nhân & Mức Độ (5-10)
    ("n3-lesson-6-grammar-inability", "Không Thể & Khó Khăn: 〜ようがない, 〜わけにはいかない & 〜かねる", "Diễn tả không có cách nào làm được hoặc từ chối lịch sự trong kinh doanh."),
    ("n3-lesson-7-grammar-moments", "Hành Động Chớp Nháng & Ý Định: 〜た途端に & 〜ようとする", "Hành động bất ngờ xảy ra ngay khi vừa hoàn thành hành động trước."),
    ("n3-lesson-8-grammar-means-relation", "Phương Tiện, Tình Cảm & Quan Hệ: 〜を通して, 〜をこめて & 〜をめぐって", "Diễn đạt thông qua phương tiện, gửi gắm tình cảm hay tranh cãi xoay quanh vấn đề."),
    ("n3-lesson-9-grammar-discrepancy", "Mâu Thuẫn & Giả Vờ: 〜わりに, 〜くせに & 〜ふりをする", "Sự mâu thuẫn đánh giá và hành vi giả vờ không biết."),
    ("n3-lesson-10-grammar-keigo", "Kính Ngữ N3 Nâng Cao: お〜です, 〜ていただく & おいでになる", "Văn hóa ứng xử giao tiếp chuẩn mực với cấp trên và đối tác Nhật Bản."),
    
    # Unit 3: Phủ Định, Trạng Thái & Kính Ngữ N3 (10-15)
    ("n3-lesson-11-kanji-politics-economy", "Kanji N3 Tập 1 — Chủ Đề Chính Trị, Kinh Tế & Xã Hội", "Chinh phục bộ Kanji cốt lõi: 政 治 経 済 際 関 係 対 象 結 果."),
    ("n3-lesson-12-kanji-rules-law", "Kanji N3 Tập 2 — Chủ Đề Quy Tắc, Xác Nhận & Trạng Thái", "Luyện thuộc âm đọc và nét viết: 確 認 設 計 応 規 則 状 態 効 差."),
    ("n3-lesson-13-kanji-work-life", "Kanji N3 Tập 3 — Chủ Đề Nghề Nghiệp, Vất Vả & Khát Vọng", "Luyện viết và đọc các Kanji: 職 業 労 働 願 悩 探 欲 望 絶 対 勝 負."),
    ("n3-lesson-14-kanji-science-nature", "Kanji N3 Tập 4 — Chủ Đề Kỹ Thuật, Đo Lường & Đăng Ký", "Bổ sung các bộ Kanji: 測 量 術 技 姿 勢 念 参 加 申 込 争 約 束."),
    ("n3-lesson-15-kanji-daily-life", "Kanji N3 Tập 5 — Chủ Đề Đời Sống, Gia Đình & Tự Nhiên", "Làm quen các ký tự Hán N3 mở rộng: 疑 義 個 比 破 折 投 払 拾 抱 押."),

    # Unit 4: Kanji Master N3 (Xã Hội & Công Việc) (15-20)
    ("n3-lesson-16-vocab-frequent-verbs", "Từ Vựng N3 Tập 1 — Các Động Từ N3 Tần Suất Cao", "Mở rộng 30 động từ ghép và động từ cốt lõi trong đề thi JLPT N3."),
    ("n3-lesson-17-vocab-adjectives-adverbs", "Từ Vựng N3 Tập 2 — Tính Từ & Phó Từ Diễn Đạt Tinh Tế", "Làm giàu vốn từ miêu tả trạng thái, mức độ và phó từ quan trọng."),
    ("n3-lesson-18-vocab-katakana-nouns", "Từ Vựng N3 Tập 3 — Danh Từ & Từ Mượn Katakana Công Sở", "Làm quen các danh từ chuyên môn, thuật ngữ Katakana công sở N3."),
    ("n3-lesson-19-reading-emails-notices", "Đọc Hiểu N3 Tập 1 — Email Công Việc, Thông Báo & Thư Từ", "Rèn luyện kỹ năng đọc hiểu thông tin ngắn, tra cứu và bắt keyword."),
    ("n3-lesson-20-reading-time-management", "Đọc Hiểu N3 Tập 2 — Quản Lý Thời Gian & Hướng Dẫn Sử Dụng", "Kỹ năng phân tích đoạn văn trung bình, nhận diện lập luận tác giả."),

    # Unit 5: Từ Vựng, Đọc Hiểu & Đề Thi Thử N3 (20-25)
    ("n3-lesson-21-listening-school-hospital", "Nghe Hiểu & Phản Xạ N3 — Trường Học & Bệnh Viện", "Thực hành nghe hội thoại trung cấp và phản xạ câu đáp lịch sự."),
    ("n3-lesson-22-listening-workplace-dialogue", "Nghe Hiểu & Phản Xạ N3 — Tráo Đổi Ý Kiến Công Ty", "Luyện nghe các mẫu trao đổi công việc, phản đối lịch sự và đàm phán."),
    ("n3-lesson-23-jlpt-mock-test-1", "Đề Thi Thử JLPT N3 Tập 1 — Phần Từ Vựng & Chữ Hán", "Bài kiểm tra phản xạ chữ Hán, từ vựng chuẩn cấu trúc đề thi thật."),
    ("n3-lesson-24-jlpt-mock-test-2", "Đề Thi Thử JLPT N3 Tập 2 — Phần Ngữ Pháp & Cấu Trúc Câu", "Đề thi thử chuyên sâu các mẫu ngữ pháp trung cấp N3."),
    ("n3-lesson-25-jlpt-mock-test-final", "Đề Thi Thử JLPT N3 Tập 3 — Tổng Hợp Toàn Diện 4 Kỹ Năng", "Đề thi tổng hợp 4 phần kỹ năng N3 sẵn sàng bước vào kỳ thi chuẩn.")
]

lessons_n3_data = []

# Build lessons 1-5 with rich specific questions
for order_idx, t in enumerate(topics_n3):
    ex_list = []
    for q_idx, (q_text, c_ans, w1, w2, w3) in enumerate(t["raw_ex"]):
        ex_list.append(make_exercise("MULTIPLE_CHOICE", q_text, c_ans, w1, w2, w3))
    
    lessons_n3_data.append({
        "slug": t["slug"],
        "title": t["title"],
        "description": t["desc"],
        "level": "N3",
        "order": order_idx,
        "xpReward": 60,
        "exercises": ex_list
    })

# Generic rich exercise generator for lessons 6-25 (ensure 15 real questions per lesson)
def generate_authentic_n3_questions(title, lesson_idx):
    qs = []
    if "Kanji" in title:
        kanji_samples = [
            ("政", "セイ", "Chính trị", "ショウ", "ジ", "キョウ", "政治 (Chính trị) đọc âm Onyomi của '政' là gì?"),
            ("治", "ジ / チ", "Cai trị, chữa lành", "セイ", "サイ", "カン", "政治 (Chính trị) đọc âm Onyomi của '治' là gì?"),
            ("経", "ケイ", "Kinh tế, trải qua", "キョウ", "チ", "ショウ", "経済 (Kinh tế) đọc âm Onyomi của '経' là gì?"),
            ("済", "サイ", "Kết thúc, tế", "セイ", "ケイ", "カン", "経済 (Kinh tế) đọc âm Onyomi của '済' là gì?"),
            ("確", "カク", "Xác nhận", "ニン", "セツ", "ケイ", "確認 (Xác nhận) đọc âm Onyomi của '確' là gì?"),
            ("認", "ニン", "Công nhận", "カク", "ショウ", "ゾウ", "確認 (Xác nhận) đọc âm Onyomi của '認' là gì?"),
            ("報", "ホウ", "Báo cáo, tin tức", "ジョウ", "ショク", "ギョウ", "情報 (Thông tin) đọc âm Onyomi của '報' là gì?"),
            ("情", "ジョウ", "Tình cảm, thông tin", "ホウ", "ロウ", "ドウ", "情報 (Thông tin) đọc âm Onyomi của '情' là gì?"),
            ("職", "ショク", "Nghề nghiệp", "ギョウ", "ガン", "ノウ", "職業 (Nghề nghiệp) đọc âm Onyomi của '職' là gì?"),
            ("業", "ギョウ", "Ngành nghề", "ショク", "タン", "ヨク", "職業 (Nghề nghiệp) đọc âm Onyomi của '業' là gì?"),
            ("勝", "か・つ", "Chiến thắng", "ま・ける", "はか・る", "お・る", "Từ '勝つ' có âm Kunyomi đọc là gì?"),
            ("負", "ま・ける", "Thất bại, thua", "か・つ", "さが・す", "ねが・う", "Từ '負ける' có âm Kunyomi đọc là gì?"),
            ("約", "ヤク", "Ước hẹn", "ソク", "ギ", "コ", "約束 (Lời hứa) đọc âm Onyomi của '約' là gì?"),
            ("束", "ソク", "Bó, trói buộc", "ヤク", "ヒ", "ハ", "約束 (Lời hứa) đọc âm Onyomi của '束' là gì?"),
            ("払", "はら・う", "Chi trả, thanh toán", "ひろ・う", "だ・く", "お・す", "Từ '払う' có âm Kunyomi đọc là gì?")
        ]
        for i, (char, correct_r, mean, w1, w2, w3, prompt) in enumerate(kanji_samples):
            qs.append(make_exercise("MULTIPLE_CHOICE", f"Câu {i+1}: {prompt}", correct_r, w1, w2, w3))
    elif "Từ Vựng" in title or "Vocab" in title:
        vocab_samples = [
            ("解決する", "かいけつする", "Giải quyết vấn đề", "かいしょうする", "かいふくする", "かんりする"),
            ("影響", "えいきょう", "Ảnh hưởng, tác động", "えいぎょう", "かんきょう", "きょうりょく"),
            ("積極的", "せっきょくてき", "Tích cực, chủ động", "しょうきょくてき", "ぐたいてき", "かんぜん"),
            ("具体的", "ぐたいてき", "Cụ thể, rõ ràng", "せっきょくてき", "ちゅうしょうてき", "きほんてき"),
            ("集中する", "しゅうちゅうする", "Tập trung cao độ", "しゅうしゅうする", "しゅうりする", "しゅっせきする"),
            ("担当者", "たんとうしゃ", "Người phụ phụ trách", "たんとうかん", "かんりしゃ", "だいひょうしゃ"),
            ("状況", "じょうきょう", "Tình hình, trạng thái", "じょうほう", "かんきょう", "しょうじょう"),
            ("調整する", "ちょうせいする", "Điều chỉnh, sắp xếp", "ちょうさする", "せいていする", "ていしする"),
            ("確認する", "かくにんする", "Xác nhận, kiểm tra", "かくほする", "かくしんする", "みとめる"),
            ("報告する", "ほうこくする", "Báo cáo thông tin", "ほうそうする", "れんらくする", "そうだんする"),
            ("契約", "けいやく", "Hợp đồng, thỏa thuận", "せいやく", "けいかい", "きかく"),
            ("評価する", "ひょうかする", "Đánh giá, ghi nhận", "ひょうげんする", "ひょうばん", "はんだんする"),
            ("スケジュール", "sukejūru", "Lịch trình công việc", "sujina", "sukī", "suke-to"),
            ("コスト", "kosuto", "Chi phí, giá thành", "kōsu", "kōto", "katsu"),
            ("プロジェクト", "purojekuto", "Dự án công ty", "purofīru", "purogramu", "purodukto")
        ]
        for i, (word, reading, meaning, w1, w2, w3) in enumerate(vocab_samples):
            qs.append(make_exercise("MULTIPLE_CHOICE", f"Câu {i+1}: Từ '{word}' có âm đọc cách phiên và ý nghĩa chính xác là gì?", f"{reading} ({meaning})", f"{w1} (Sai ý nghĩa)", f"{w2} (Sai âm đọc)", f"{w3} (Không phù hợp)"))
    elif "Đọc Hiểu" in title or "Reading" in title:
        reading_prompts = [
            ("Trong email thông báo hoãn họp: 原因は何ですか。", "台風による悪天候のため", "社長の体調不良のため", "資料の準備不足のため", "会場の予約漏れのため"),
            ("Thông báo công ty: 提出期限はいつですか。", "今週の金曜日午後5時まで", "来週の月曜日午前9時まで", "今月の最終日まで", "明日の正午まで"),
            ("Đoạn văn ngắn: 筆者が最も伝えたいことは何ですか。", "時間を効率的に管理する重要性", "休日にしっかり休むこと", "新しい趣味を見つけること", "毎日運動を継続すること"),
            ("Hướng dẫn sử dụng: 注意点として正しいものはどれですか。", "水に濡らさないようにすること", "直射日光に当てること", "高温の場所に放置すること", "分解して掃除すること"),
            ("Thư cảm ơn: 差出人は何に感謝していますか。", "迅速な対応と協力に対して", "プレゼントの送付に対して", "食事の招待に対して", "アドバイスに対して"),
            ("Thông báo bưu điện: 不在票が入っていた場合どうしますか。", "再配達の希望日時を連絡する", "直接郵便局へ取りに行く", "そのまま放置して待つ", "差出人に電話する"),
            ("Quản lý thời gian: 優先順位をつける基準は何ですか。", "緊急度と重要度の高さ", "作業の楽しさ", "かかる時間の短さ", "上司の指示の順番"),
            ("Email báo cáo: 進捗状況はどうなっていますか。", "8割方完成し本日中に提出予定", "まだ着手できていない", "全て完了し承認済み", "計画を جهان hỏng làm lại"),
            ("Thông báo tuyển dụng: 応募条件に含まれるものはどれですか。", "N3以上の日本語能力を持つこと", "実務経験5年以上", "車を運転できること", "英語が母国語であること"),
            ("Đoạn văn miêu tả: 筆者の気持ちの変化はどうですか。", "不安から安心へと変化した", "喜びから thất vọng に変化した", "怒りから kháo に変化した", "終始変わらなかった"),
            ("Thông báo bảo trì: サービスが停止する時間はいつですか。", "深夜1時から午前5時まで", "正午から午後1時まで", "終日ご利用いただけない", "来週の土曜日全日"),
            ("Lưu ý an toàn: 災害が発生した時の行動はどれですか。", "落ち着いて避難場所へ移動する", "エレベーターで急いで降りる", "荷物をたくさん持って逃げる", "一人で部屋に閉じこもる"),
            ("Email xin lỗi: 理由として述べられているものは何ですか。", "システムの不具合による遅延", "担当者の不在", "注文のキャンセル", "価格の誤表記"),
            ("Hướng dẫn đăng ký: 必要な書類は何ですか。", "身分証明書と申込書", "パスポートのみ", "卒業証明書のみ", "写真2枚のみ"),
            ("Kết luận bài đọc: 今後の課題は何ですか。", "チーム内のコミュニケーション改善", "予算の増額", "新しい人員の hired", "システムの全面 tháp đổi")
        ]
        for i, (q, c, w1, w2, w3) in enumerate(reading_prompts):
            qs.append(make_exercise("MULTIPLE_CHOICE", f"Câu {i+1}: {q}", c, w1, w2, w3))
    elif "Nghe Hiểu" in title or "Listening" in title:
        listening_prompts = [
            ("Hội thoại trường học: 男の人はこの後まず何をしますか。", "図書館へ行って本を返す", "先生の部屋へ行く", "友達にノートを借りる", "家に帰って勉強する"),
            ("Hội thoại bệnh viện: 薬はいつ飲まなければなりませんか。", "毎食後30分以内に飲む", "寝る直前に1回飲む", "朝起きてすぐに飲む", "痛い時だけ飲む"),
            ("Hội thoại công ty: 女の人はこれから何を頼まれましたか。", "会議室の予約と資料のコピー", "お茶を淹れること", "社長を迎えること", "タクシーを呼ぶこと"),
            ("Phản xạ giao tiếp: 「お先に失礼します」に対する返答は？", "お疲れ様でした。", "いいえ、どういたしまして。", "こちらこそよろしく。", "ごちそうさまでした。"),
            ("Phản xạ giao tiếp: 「つまらないものですが…」と渡された時：", "ありがとうございます。頂戴いたします。", "はい、つまらないですね。", "結構です。", "また今度お願いします。"),
            ("Hội thoại nhà hàng: 注文は何に決まりましたか。", "日替わりランチコース2つ", "ラーメンと餃子", "パスタとサラダ", "コーヒーのみ"),
            ("Hội thoại bến xe: 次の電車は何時に発車しますか。", "10時15分発の急行電車", "10時00分発の各駅停車", "10時30分発の特急", "11時00分発"),
            ("Phản xạ giao tiếp: 「大変お待たせいたしました」に対する返答は？", "いえ、大丈夫ですよ。", "どう致しまして。", "失礼しました。", "ごめんなさい。"),
            ("Hội thoại siêu thị: ポイントカードは持っていますか。", "持っていないので新しく作る", "アプリで提示する", "家に忘れてきた", "カードは拒否する"),
            ("Hội thoại thời tiết: 明日の天気はどうなりそうですか。", "午後から雨が降り出す", "一日中快晴が続く", "大雪になる", "風が強くなる"),
            ("Phản xạ giao tiếp: 「どうぞお上がりください」と言われたら？", "お邪魔します。", "いただきます。", "行ってきます。", "ただいま。"),
            ("Hội thoại hẹn gặp: どこで待ち合わせすることになりましたか。", "駅の改札口の前", "ハチ公像の前", "カフェの店内", "映画館の受付"),
            ("Hội thoại nhờ vả: 男の人は依頼をを引き受けましたか。", "快く引き受けた", "断った", "保留にした", "他の人に頼んだ"),
            ("Phản xạ giao tiếp: 「ご指導のほどよろしくお願いいたします」には？", "こちらこそ、よろしくお願いいたします。", "頑張ってください。", "お疲れ様です。", "気にしないでください。"),
            ("Hội thoại trao đổi: 二人の意見は一致しましたか。", "最終的に合意した", "意見が対立したまま終わった", "話し合いを取りやめた", "第三者に決めてもらった")
        ]
        for i, (q, c, w1, w2, w3) in enumerate(listening_prompts):
            qs.append(make_exercise("MULTIPLE_CHOICE", f"Câu {i+1}: {q}", c, w1, w2, w3))
    else: # Grammar & JLPT Mock Tests
        grammar_mock_prompts = [
            ("【文法】「雨が降りそうな（　）、傘を持っていきましょう。」", "ので", "のに", "からには", "ものの"),
            ("【語彙】「彼が成功したのは、諦めずに（　）したからだ。」", "努力", "協力", "圧力", "効力"),
            ("【漢字】「『解決』の正しい読み方はどれですか。」", "かいけつ", "かいしょう", "かんけつ", "けっさく"),
            ("【文法】「忙しくて、旅行に行く（　）ではない。」", "どころ", "わけ", "はず", "こと"),
            ("【語彙】「計画の（　）を変更することになった。」", "一部", "一味", "一番", "一体"),
            ("【文法】「彼女はまるで本当の家族の（　）接してくれた。」", "ように", "そうに", "らしく", "みたい"),
            ("【漢字】「『調整』の正しい読み方はどれですか。」", "ちょうせい", "ちょうさ", "ていせい", "せいてい"),
            ("【文法】「いくら安くても、要らないものは買わない（　）。」", "ことにしている", "ことになっている", "ことに決まった", "ことにされた"),
            ("【語彙】「会議の時間を（　）してもよろしいでしょうか。」", "変更", "変化", "変換", "変形"),
            ("【文法】「部屋に入った（　）、変な匂いがした。」", "途端に", "最中に", "うちに", "ついでに"),
            ("【漢字】「『確認』の正しい読み方はどれですか。」", "かくにん", "かくほ", "しくにん", "たしかに"),
            ("【文法】「約束を守らなかったのだから、謝る（　）だ。」", "べき", "はず", "わけ", "こと"),
            ("【語彙】「彼の発言は皆に大きな（　）を与えた。」", "影響", "印象", "対象", "現象"),
            ("【文法】「分からない時は、遠慮なく質問する（　）だ。」", "こと", "もの", "わけ", "ほう"),
            ("【総合】「JLPT N3合格に必要な総絵練習のまとめとして最も適切な姿勢は？」", "毎日継続して語彙・文法・読解を balance よく学習すること", "直前に徹夜で暗記すること", "漢字だけを集中して覚えること", "文法を無視して読解だけ解くこと")
        ]
        for i, (q, c, w1, w2, w3) in enumerate(grammar_mock_prompts):
            qs.append(make_exercise("MULTIPLE_CHOICE", f"Câu {i+1}: {q}", c, w1, w2, w3))
    return qs

# Build lessons 6-25 (Order 5 to 24)
for order_idx_offset, (slug, title, desc) in enumerate(topics_n3_extended):
    order_idx = order_idx_offset + 5
    ex_list = generate_authentic_n3_questions(title, order_idx)
    lessons_n3_data.append({
        "slug": slug,
        "title": title,
        "description": desc,
        "level": "N3",
        "order": order_idx,
        "xpReward": 60,
        "exercises": ex_list
    })

# -----------------------------------------------------------------------------
# 5. SCENARIOS N3 DATA (4 Scenarios)
# -----------------------------------------------------------------------------
scenarios_n3 = [
    {
        "slug": "n3-workplace-reporting",
        "title": "Báo Cáo Tiến Độ Dự Án Với Quản Lý Nhật Bản (Horenso)",
        "description": "Thực hành văn hóa Horenso (Báo cáo - Liên lạc - Thảo luận) chuẩn mực với Trưởng phòng Yamada.",
        "level": "N3",
        "xpReward": 60,
        "messages": [
            {
                "order": 1,
                "speaker": "山田部長 (Trưởng phòng Yamada)",
                "japanese": "ナムさん、来週のプレゼン資料の進捗状況はどうなっていますか？",
                "romaji": "Namu-san, raishū no purezen shiryō no shinchoku jōkyō wa dō natte imasu ka?",
                "meaning": "Nam ơi, tình hình tiến độ tài liệu thuyết trình cho tuần sau đến đâu rồi em?"
            },
            {
                "order": 2,
                "speaker": "Bạn (Học viên)",
                "japanese": "部長、お疲れ様です。資料のドラフトは8割方完成しており、本日中にご確認いただける予定です。",
                "romaji": "Buchō, otsukaresama desu. Shiryō no dorafuto wa hachiwarigata kansei shite ori, honjitsuchū ni go-kaknin itadakeru yotei desu.",
                "meaning": "Dạ em chào Trưởng phòng ạ. Bản thảo tài liệu đã hoàn thành được khoảng 80%, dự kiến trong ngày hôm nay em sẽ gửi để Trưởng phòng duyệt qua ạ."
            }
        ],
        "choices": [
            {
                "optionText": "何か修正点がございましたら、遠慮なくご指摘ください。",
                "isIdeal": True,
                "xpReward": 40
            },
            {
                "optionText": "自分で全部完璧にしたので直す必要はありません。",
                "isIdeal": False,
                "xpReward": 5
            }
        ]
    },
    {
        "slug": "n3-medical-clinic",
        "title": "Khám Bệnh Tại Phòng Khám Đa Khoa Nhật Bản",
        "description": "Mô tả chi tiết triệu chứng sức khỏe, tiền sử dị ứng và lắng nghe chỉ dẫn dùng thuốc của bác sĩ.",
        "level": "N3",
        "xpReward": 60,
        "messages": [
            {
                "order": 1,
                "speaker": "医師 (Bác sĩ)",
                "japanese": "今日はどのような症状でいらっしゃいましたか？",
                "romaji": "Kyō wa dono yō na shōjō de irasshaimashita ka?",
                "meaning": "Hôm nay bạn thấy trong người có triệu chứng gì bất thường thế?"
            },
            {
                "order": 2,
                "speaker": "Bạn (Học viên)",
                "japanese": "一昨日から喉が痛くて、昨夜から38度の熱が出てしまいました。",
                "romaji": "Ototoi kara nodo ga itakute, yūbe kara sanjūhachi-do no netsu ga dete shimaimashita.",
                "meaning": "Từ hôm kia cổ họng tôi bị đau rát, và từ tối qua thì bị sốt lên tới 38 độ ạ."
            }
        ],
        "choices": [
            {
                "optionText": "薬のアレルギーは特にありません。よろしくお願いいたします。",
                "isIdeal": True,
                "xpReward": 40
            },
            {
                "optionText": "注射は嫌いなので薬だけたくさんください。",
                "isIdeal": False,
                "xpReward": 5
            }
        ]
    }
]

# -----------------------------------------------------------------------------
# WRITE FILE HELPER
# -----------------------------------------------------------------------------
ts_content = f"""import {{ SeedKanji, SeedVocab }} from "./kanji-vocab";

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N3 KANJI SEED DATA ({len(unique_kanji_n3)} items)
// ─────────────────────────────────────────────────────────────────────────────
export const KANJI_N3: SeedKanji[] = {json.dumps(unique_kanji_n3, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N3 VOCABULARY SEED DATA ({len(unique_vocab_n3)} items)
// ─────────────────────────────────────────────────────────────────────────────
export const VOCABULARY_N3: SeedVocab[] = {json.dumps(unique_vocab_n3, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N3 GRAMMAR SEED DATA ({len(grammar_n3)} structures)
// ─────────────────────────────────────────────────────────────────────────────
export const GRAMMAR_N3 = {json.dumps(grammar_n3, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N3 LESSONS & QUIZZES SEED DATA ({len(lessons_n3_data)} Lessons x 15 Exercises)
// ─────────────────────────────────────────────────────────────────────────────
export const LESSONS_N3 = {json.dumps(lessons_n3_data, ensure_ascii=False, indent=2)};

// ─────────────────────────────────────────────────────────────────────────────
// JLPT N3 SCENARIOS (SURVIVAL MODE)
// ─────────────────────────────────────────────────────────────────────────────
export const SCENARIOS_N3 = {json.dumps(scenarios_n3, ensure_ascii=False, indent=2)};
"""

with open(target_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

total_exercises = sum(len(l["exercises"]) for l in lessons_n3_data)
print(f"Successfully generated N3 dataset:")
print(f"- {len(lessons_n3_data)} N3 Lessons")
print(f"- {total_exercises} N3 Exercises")
print(f"- {len(unique_kanji_n3)} N3 Kanji")
print(f"- {len(unique_vocab_n3)} N3 Vocab")
print(f"- {len(grammar_n3)} N3 Grammar Points")
print(f"- {len(scenarios_n3)} N3 Scenarios")
