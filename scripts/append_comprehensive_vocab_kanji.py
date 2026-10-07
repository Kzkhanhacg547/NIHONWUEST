# -*- coding: utf-8 -*-
"""
Enrich N4 and N3 Vocabulary and Kanji in prisma/seed-data/n4-data.ts and n3-data.ts
"""

import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

# N4 VOCABULARY ADDITIONS (~100 items)
N4_VOCAB_EXTRA = [
    # General & Everyday Life
    {"word": "案内する", "kana": "あんないする", "romaji": "annai suru", "meaning": "Hướng dẫn, dẫn đường", "jlptLevel": "N4", "category": "verb"},
    {"word": "安心する", "kana": "あんしんする", "romaji": "anshin suru", "meaning": "An tâm, yên tâm", "jlptLevel": "N4", "category": "verb"},
    {"word": "安全", "kana": "あんぜん", "romaji": "anzen", "meaning": "An toàn", "jlptLevel": "N4", "category": "adjective"},
    {"word": "危険", "kana": "きけん", "romaji": "kiken", "meaning": "Nguy hiểm", "jlptLevel": "N4", "category": "adjective"},
    {"word": "意見", "kana": "いけん", "romaji": "iken", "meaning": "Ý kiến", "jlptLevel": "N4", "category": "noun"},
    {"word": "石", "kana": "いし", "romaji": "ishi", "meaning": "Hòn đá", "jlptLevel": "N4", "category": "noun"},
    {"word": "急ぐ", "kana": "いそぐ", "romaji": "isogu", "meaning": "Vội vàng, gấp rút", "jlptLevel": "N4", "category": "verb"},
    {"word": "祈る", "kana": "いのる", "romaji": "inoru", "meaning": "Cầu nguyện", "jlptLevel": "N4", "category": "verb"},
    {"word": "指輪", "kana": "ゆびわ", "romaji": "yubiwa", "meaning": "Nhẫn (đeo tay)", "jlptLevel": "N4", "category": "noun"},
    {"word": "受付", "kana": "うけつけ", "romaji": "uketsuke", "meaning": "Quầy lễ tân", "jlptLevel": "N4", "category": "noun"},
    {"word": "動く", "kana": "うごく", "romaji": "ugoku", "meaning": "Chuyển động, cử động", "jlptLevel": "N4", "category": "verb"},
    {"word": "嘘", "kana": "うそ", "romaji": "uso", "meaning": "Lời nói dối", "jlptLevel": "N4", "category": "noun"},
    {"word": "売り場", "kana": "うりば", "romaji": "uriba", "meaning": "Quầy bán hàng", "jlptLevel": "N4", "category": "noun"},
    {"word": "運転手", "kana": "うんてんしゅ", "romaji": "untenshu", "meaning": "Tài xế, người lái xe", "jlptLevel": "N4", "category": "noun"},
    {"word": "連絡する", "kana": "れんらくする", "romaji": "renraku suru", "meaning": "Liên lạc", "jlptLevel": "N4", "category": "verb"},
    {"word": "相談する", "kana": "そうだんする", "romaji": "soudan suru", "meaning": "Thảo luận, bàn bạc", "jlptLevel": "N4", "category": "verb"},
    {"word": "遠慮する", "kana": "えんりょする", "romaji": "enryo suru", "meaning": "Ngại ngùng, khách khí", "jlptLevel": "N4", "category": "verb"},
    {"word": "お祝い", "kana": "おいわい", "romaji": "oiwai", "meaning": "Chúc mừng, quà mừng", "jlptLevel": "N4", "category": "noun"},
    {"word": "屋上", "kana": "おくじょう", "romaji": "okujou", "meaning": "Sân thượng", "jlptLevel": "N4", "category": "noun"},
    {"word": "贈り物", "kana": "おくりもの", "romaji": "okurimono", "meaning": "Quà tặng", "jlptLevel": "N4", "category": "noun"},
    {"word": "送る", "kana": "おくる", "romaji": "okuru", "meaning": "Gửi, tiễn", "jlptLevel": "N4", "category": "verb"},
    {"word": "遅れる", "kana": "おくれる", "romaji": "okureru", "meaning": "Trễ, muộn", "jlptLevel": "N4", "category": "verb"},
    {"word": "起こす", "kana": "おこす", "romaji": "okosu", "meaning": "Đánh thức", "jlptLevel": "N4", "category": "verb"},
    {"word": "行う", "kana": "おこなう", "romaji": "okonau", "meaning": "Tiến hành, thực hiện", "jlptLevel": "N4", "category": "verb"},
    {"word": "怒る", "kana": "おこる", "romaji": "okoru", "meaning": "Tức giận", "jlptLevel": "N4", "category": "verb"},
    {"word": "落ちる", "kana": "おちる", "romaji": "ochiru", "meaning": "Rơi, trượt", "jlptLevel": "N4", "category": "verb"},
    {"word": "落とす", "kana": "おとす", "romaji": "otosu", "meaning": "Làm rơi, đánh mất", "jlptLevel": "N4", "category": "verb"},
    {"word": "踊り", "kana": "おどり", "romaji": "odori", "meaning": "Điệu nhảy", "jlptLevel": "N4", "category": "noun"},
    {"word": "踊る", "kana": "おどる", "romaji": "odoru", "meaning": "Nhảy múa", "jlptLevel": "N4", "category": "verb"},
    {"word": "驚く", "kana": "おどろく", "romaji": "odoroku", "meaning": "Giật mình, ngạc nhiên", "jlptLevel": "N4", "category": "verb"},
    {"word": "お祭り", "kana": "おまつり", "romaji": "omatsuri", "meaning": "Lễ hội", "jlptLevel": "N4", "category": "noun"},
    {"word": "見舞い", "kana": "おみまい", "romaji": "omimai", "meaning": "Thăm người bệnh", "jlptLevel": "N4", "category": "noun"},
    {"word": "思い出す", "kana": "おもいだす", "romaji": "omoidasu", "meaning": "Nhớ lại, hồi tưởng", "jlptLevel": "N4", "category": "verb"},
    {"word": "表", "kana": "おもて", "romaji": "omote", "meaning": "Bề mặt, phía trước", "jlptLevel": "N4", "category": "noun"},
    {"word": "裏", "kana": "うら", "romaji": "ura", "meaning": "Mặt sau, phía sau", "jlptLevel": "N4", "category": "noun"},
    {"word": "泳ぎ方", "kana": "およぎかた", "romaji": "oyogikata", "meaning": "Cách bơi", "jlptLevel": "N4", "category": "noun"},
    {"word": "折る", "kana": "おる", "romaji": "oru", "meaning": "Bẻ, gấp", "jlptLevel": "N4", "category": "verb"},
    {"word": "折れる", "kana": "おれる", "romaji": "oreru", "meaning": "Bị gãy, gập", "jlptLevel": "N4", "category": "verb"},
    {"word": "海岸", "kana": "かいがん", "romaji": "kaigan", "meaning": "Bờ biển", "jlptLevel": "N4", "category": "noun"},
    {"word": "会議室", "kana": "かいぎしつ", "romaji": "kaigishitsu", "meaning": "Phòng họp", "jlptLevel": "N4", "category": "noun"},
    {"word": "会場", "kana": "かいじょう", "romaji": "kaijou", "meaning": "Hội trường, địa điểm", "jlptLevel": "N4", "category": "noun"},
    {"word": "買い物", "kana": "かいもの", "romaji": "kaimono", "meaning": "Mua sắm", "jlptLevel": "N4", "category": "noun"},
    {"word": "変える", "kana": "かえる", "romaji": "kaeru", "meaning": "Thay đổi, biến đổi", "jlptLevel": "N4", "category": "verb"},
    {"word": "科学", "kana": "かがく", "romaji": "kagaku", "meaning": "Khoa học", "jlptLevel": "N4", "category": "noun"},
    {"word": "鏡", "kana": "かがみ", "romaji": "kagami", "meaning": "Cái gương", "jlptLevel": "N4", "category": "noun"},
    {"word": "かける", "kana": "かける", "romaji": "kakeru", "meaning": "Đeo (kính), treo", "jlptLevel": "N4", "category": "verb"},
    {"word": "飾る", "kana": "かざる", "romaji": "kazaru", "meaning": "Trang trí", "jlptLevel": "N4", "category": "verb"},
    {"word": "火事", "kana": "かじ", "romaji": "kaji", "meaning": "Hỏa hoạn, đám cháy", "jlptLevel": "N4", "category": "noun"},
    {"word": "ガス", "kana": "がす", "romaji": "gasu", "meaning": "Khí gas", "jlptLevel": "N4", "category": "noun"},
    {"word": "片付ける", "kana": "かたづける", "romaji": "katadukeru", "meaning": "Dọn dẹp, sắp xếp", "jlptLevel": "N4", "category": "verb"},
    {"word": "勝つ", "kana": "かつ", "romaji": "katsu", "meaning": "Chiến thắng", "jlptLevel": "N4", "category": "verb"},
    {"word": "負ける", "kana": "まける", "romaji": "makeru", "meaning": "Thua cuộc", "jlptLevel": "N4", "category": "verb"},
    {"word": "家庭", "kana": "かてい", "romaji": "katei", "meaning": "Gia đình", "jlptLevel": "N4", "category": "noun"},
    {"word": "悲しい", "kana": "かなしい", "romaji": "kanashii", "meaning": "Buồn bã", "jlptLevel": "N4", "category": "adjective"},
    {"word": "必ず", "kana": "かならず", "romaji": "kanarazu", "meaning": "Nhất định, chắc chắn", "jlptLevel": "N4", "category": "adverb"},
    {"word": "看護師", "kana": "かんごし", "romaji": "kangoshi", "meaning": "Y tá", "jlptLevel": "N4", "category": "noun"},
    {"word": "関係", "kana": "かんけい", "romaji": "kankei", "meaning": "Mối quan hệ", "jlptLevel": "N4", "category": "noun"},
    {"word": "観光", "kana": "かんこう", "romaji": "kankou", "meaning": "Tham quan, du lịch", "jlptLevel": "N4", "category": "noun"},
    {"word": "感情", "kana": "かんじょう", "romaji": "kanjou", "meaning": "Cảm xúc", "jlptLevel": "N4", "category": "noun"},
    {"word": "機会", "kana": "きかい", "romaji": "kikai", "meaning": "Cơ hội", "jlptLevel": "N4", "category": "noun"},
    {"word": "機械", "kana": "きかい", "romaji": "kikai", "meaning": "Máy móc", "jlptLevel": "N4", "category": "noun"},
    {"word": "気候", "kana": "きこう", "romaji": "kikou", "meaning": "Khí hậu", "jlptLevel": "N4", "category": "noun"},
    {"word": "技術", "kana": "ぎじゅつ", "romaji": "gijutsu", "meaning": "Kỹ thuật, công nghệ", "jlptLevel": "N4", "category": "noun"},
    {"word": "季節", "kana": "きせつ", "romaji": "kisetsu", "meaning": "Mùa trong năm", "jlptLevel": "N4", "category": "noun"},
    {"word": "規則", "kana": "きそく", "romaji": "kisoku", "meaning": "Quy tắc, nội quy", "jlptLevel": "N4", "category": "noun"},
    {"word": "絹", "kana": "きぬ", "romaji": "kinu", "meaning": "Lụa, tơ lụa", "jlptLevel": "N4", "category": "noun"},
    {"word": "厳しい", "kana": "きびしい", "romaji": "kibishii", "meaning": "Nghiêm khắc, khắc nghiệt", "jlptLevel": "N4", "category": "adjective"},
    {"word": "気分", "kana": "きぶん", "romaji": "kibun", "meaning": "Tâm trạng, cảm giác", "jlptLevel": "N4", "category": "noun"},
    {"word": "決まる", "kana": "きまる", "romaji": "kimaru", "meaning": "Được quyết định", "jlptLevel": "N4", "category": "verb"},
    {"word": "決める", "kana": "きめる", "romaji": "kimeru", "meaning": "Quyết định", "jlptLevel": "N4", "category": "verb"},
    {"word": "気持ち", "kana": "きもち", "romaji": "kimochi", "meaning": "Cảm xúc, tấm lòng", "jlptLevel": "N4", "category": "noun"},
    {"word": "近所", "kana": "きんじょ", "romaji": "kinjo", "meaning": "Hàng xóm, vùng lân cận", "jlptLevel": "N4", "category": "noun"},
    {"word": "空気", "kana": "くうき", "romaji": "kuuki", "meaning": "Không khí", "jlptLevel": "N4", "category": "noun"},
    {"word": "空港", "kana": "くうこう", "romaji": "kuukou", "meaning": "Sân bay", "jlptLevel": "N4", "category": "noun"},
    {"word": "草", "kana": "くさ", "romaji": "kusa", "meaning": "Cỏ", "jlptLevel": "N4", "category": "noun"},
    {"word": "首", "kana": "くび", "romaji": "kubi", "meaning": "Cổ", "jlptLevel": "N4", "category": "noun"},
    {"word": "雲", "kana": "くも", "romaji": "kumo", "meaning": "Mây", "jlptLevel": "N4", "category": "noun"},
    {"word": "比べら", "kana": "くらべる", "romaji": "kuraberu", "meaning": "So sánh", "jlptLevel": "N4", "category": "verb"},
    {"word": "暮らす", "kana": "くらす", "romaji": "kurasu", "meaning": "Sinh sống", "jlptLevel": "N4", "category": "verb"},
    {"word": "毛", "kana": "け", "romaji": "ke", "meaning": "Lông, tóc", "jlptLevel": "N4", "category": "noun"},
    {"word": "計画", "kana": "けいかく", "romaji": "keikaku", "meaning": "Kế hoạch", "jlptLevel": "N4", "category": "noun"},
    {"word": "経験", "kana": "けいけん", "romaji": "keiken", "meaning": "Kinh nghiệm", "jlptLevel": "N4", "category": "noun"},
    {"word": "経済", "kana": "けいざい", "romaji": "keizai", "meaning": "Kinh tế", "jlptLevel": "N4", "category": "noun"},
    {"word": "警察", "kana": "けいさつ", "romaji": "keisatsu", "meaning": "Cảnh sát", "jlptLevel": "N4", "category": "noun"},
    {"word": "景色", "kana": "けしき", "romaji": "keshiki", "meaning": "Phong cảnh", "jlptLevel": "N4", "category": "noun"},
    {"word": "消しゴム", "kana": "けしごむ", "romaji": "keshigomu", "meaning": "Cục tẩy", "jlptLevel": "N4", "category": "noun"},
    {"word": "結果", "kana": "けっか", "romaji": "kekka", "meaning": "Kết quả", "jlptLevel": "N4", "category": "noun"},
    {"word": "欠席", "kana": "けっせき", "romaji": "kesseki", "meaning": "Vắng mặt", "jlptLevel": "N4", "category": "noun"},
    {"word": "決定", "kana": "けってい", "romaji": "kettei", "meaning": "Quyết định", "jlptLevel": "N4", "category": "noun"},
    {"word": "研究", "kana": "けんきゅう", "romaji": "kenkyuu", "meaning": "Nghiên cứu", "jlptLevel": "N4", "category": "noun"},
    {"word": "研究室", "kana": "けんきゅうしつ", "romaji": "kenkyuushitsu", "meaning": "Phòng nghiên cứu", "jlptLevel": "N4", "category": "noun"},
    {"word": "見学", "kana": "けんがく", "romaji": "kengaku", "meaning": "Tham quan học hỏi", "jlptLevel": "N4", "category": "noun"},
    {"word": "建てる", "kana": "たてる", "romaji": "tateru", "meaning": "Xây dựng", "jlptLevel": "N4", "category": "verb"},
    {"word": "健康", "kana": "けんこう", "romaji": "kenkou", "meaning": "Sức khỏe", "jlptLevel": "N4", "category": "noun"}
]

# N3 VOCABULARY ADDITIONS (~100 items)
N3_VOCAB_EXTRA = [
    {"word": "愛する", "kana": "あいする", "romaji": "aisuru", "meaning": "Yêu thương", "jlptLevel": "N3", "category": "verb"},
    {"word": "愛情", "kana": "あいじょう", "romaji": "aijou", "meaning": "Tình yêu thương", "jlptLevel": "N3", "category": "noun"},
    {"word": "合図", "kana": "あいず", "romaji": "aizu", "meaning": "Tín hiệu, dấu hiệu", "jlptLevel": "N3", "category": "noun"},
    {"word": "相手", "kana": "あいて", "romaji": "aite", "meaning": "Đối thủ, đối phương", "jlptLevel": "N3", "category": "noun"},
    {"word": "あいにく", "kana": "あいにく", "romaji": "ainiku", "meaning": "Thật không may", "jlptLevel": "N3", "category": "adverb"},
    {"word": "明かり", "kana": "あかり", "romaji": "akari", "meaning": "Ánh sáng, đèn", "jlptLevel": "N3", "category": "noun"},
    {"word": "空き地", "kana": "あきち", "romaji": "akichi", "meaning": "Khu đất trống", "jlptLevel": "N3", "category": "noun"},
    {"word": "明らか", "kana": "あきらか", "romaji": "akiraka", "meaning": "Rõ ràng, minh bạch", "jlptLevel": "N3", "category": "adjective"},
    {"word": "諦める", "kana": "あきらめる", "romaji": "akirameru", "meaning": "Từ bỏ, bỏ cuộc", "jlptLevel": "N3", "category": "verb"},
    {"word": "飽きる", "kana": "あきる", "romaji": "akiru", "meaning": "Chán ngấy", "jlptLevel": "N3", "category": "verb"},
    {"word": "握手", "kana": "あくしゅ", "romaji": "akushu", "meaning": "Bắt tay", "jlptLevel": "N3", "category": "noun"},
    {"word": "悪魔", "kana": "あくま", "romaji": "akuma", "meaning": "Ac quỷ", "jlptLevel": "N3", "category": "noun"},
    {"word": "明ける", "kana": "あける", "romaji": "akeru", "meaning": "Rạng sáng, kết thúc (mùa/năm)", "jlptLevel": "N3", "category": "verb"},
    {"word": "預ける", "kana": "あずける", "romaji": "azukeru", "meaning": "Gửi, ký gửi", "jlptLevel": "N3", "category": "verb"},
    {"word": "汗", "kana": "あせ", "romaji": "ase", "meaning": "Mồ hôi", "jlptLevel": "N3", "category": "noun"},
    {"word": "与える", "kana": "あたえる", "romaji": "ataeru", "meaning": "Ban cho, gây ra", "jlptLevel": "N3", "category": "verb"},
    {"word": "暖かい", "kana": "あたたかい", "romaji": "atatakai", "meaning": "Ấm áp", "jlptLevel": "N3", "category": "adjective"},
    {"word": "辺り", "kana": "あたり", "romaji": "atari", "meaning": "Vùng lân cận, quanh đây", "jlptLevel": "N3", "category": "noun"},
    {"word": "当たる", "kana": "あたる", "romaji": "ataru", "meaning": "Trúng (vé số), va chạm", "jlptLevel": "N3", "category": "verb"},
    {"word": "扱う", "kana": "あつかう", "romaji": "atsukau", "meaning": "Xử lý, thao tác", "jlptLevel": "N3", "category": "verb"},
    {"word": "集まり", "kana": "あつまり", "romaji": "atsumari", "meaning": "Cuộc tập hợp, buổi gặp mặt", "jlptLevel": "N3", "category": "noun"},
    {"word": "当てはまる", "kana": "あてはまる", "romaji": "atehamaru", "meaning": "Thích hợp, áp dụng", "jlptLevel": "N3", "category": "verb"},
    {"word": "跡", "kana": "あと", "romaji": "ato", "meaning": "Dấu vết, vết tích", "jlptLevel": "N3", "category": "noun"},
    {"word": "穴", "kana": "あな", "romaji": "ana", "meaning": "Cái lỗ, hang", "jlptLevel": "N3", "category": "noun"},
    {"word": "油", "kana": "あぶら", "romaji": "abura", "meaning": "Dầu ăn", "jlptLevel": "N3", "category": "noun"},
    {"word": "誤り", "kana": "あやまり", "romaji": "ayamari", "meaning": "Sai lầm, lỗi", "jlptLevel": "N3", "category": "noun"},
    {"word": "荒い", "kana": "あらい", "romaji": "arai", "meaning": "Thô giáp, dữ dội", "jlptLevel": "N3", "category": "adjective"},
    {"word": "嵐", "kana": "あらし", "romaji": "arashi", "meaning": "Cơn bão", "jlptLevel": "N3", "category": "noun"},
    {"word": "争う", "kana": "あらそう", "romaji": "arasou", "meaning": "Tranh chấp, tranh luận", "jlptLevel": "N3", "category": "verb"},
    {"word": "改めて", "kana": "あらためて", "romaji": "aratamete", "meaning": "Một lần nữa, lại", "jlptLevel": "N3", "category": "adverb"},
    {"word": "現れる", "kana": "あらわれる", "romaji": "arawareru", "meaning": "Xuất hiện, hiện ra", "jlptLevel": "N3", "category": "verb"},
    {"word": "表す", "kana": "あらわす", "romaji": "arawasu", "meaning": "Biểu thị, thể hiện", "jlptLevel": "N3", "category": "verb"},
    {"word": "有難い", "kana": "ありがたい", "romaji": "arigatashii", "meaning": "Biết ơn, may mắn", "jlptLevel": "N3", "category": "adjective"},
    {"word": "在る", "kana": "ある", "romaji": "aru", "meaning": "Tồn tại, có", "jlptLevel": "N3", "category": "verb"},
    {"word": "泡", "kana": "あわ", "romaji": "awa", "meaning": "Bọt, bong bóng", "jlptLevel": "N3", "category": "noun"},
    {"word": "合わせる", "kana": "あわせる", "romaji": "awaseru", "meaning": "Hợp lại, hòa vào", "jlptLevel": "N3", "category": "verb"},
    {"word": "慌てる", "kana": "あわてる", "romaji": "awateru", "meaning": "Vội vã, cuống cuồng", "jlptLevel": "N3", "category": "verb"},
    {"word": "哀れ", "kana": "あわれ", "romaji": "aware", "meaning": "Thương hại, đáng thương", "jlptLevel": "N3", "category": "adjective"},
    {"word": "案", "kana": "あん", "romaji": "an", "meaning": "Đề án, phương án", "jlptLevel": "N3", "category": "noun"},
    {"word": "暗記", "kana": "あんき", "romaji": "anki", "meaning": "Học thuộc lòng", "jlptLevel": "N3", "category": "noun"},
    {"word": "安定", "kana": "あんてい", "romaji": "antei", "meaning": "Ổn định", "jlptLevel": "N3", "category": "noun"},
    {"word": "案内", "kana": "あんない", "romaji": "annai", "meaning": "Hướng dẫn, dẫn đường", "jlptLevel": "N3", "category": "noun"},
    {"word": "胃", "kana": "い", "romaji": "i", "meaning": "Dạ dày", "jlptLevel": "N3", "category": "noun"},
    {"word": "委員", "kana": "いいん", "romaji": "iin", "meaning": "Ủy viên, thành viên ủy ban", "jlptLevel": "N3", "category": "noun"},
    {"word": "意外", "kana": "いがい", "romaji": "igai", "meaning": "Ngoài dự tính, ngạc nhiên", "jlptLevel": "N3", "category": "adjective"},
    {"word": "医学", "kana": "いがく", "romaji": "igaku", "meaning": "Y học", "jlptLevel": "N3", "category": "noun"},
    {"word": "呼吸", "kana": "いき", "romaji": "iki", "meaning": "Hơi thở", "jlptLevel": "N3", "category": "noun"},
    {"word": "行き違い", "kana": "いきちがい", "romaji": "ikichigai", "meaning": "Hiểu lầm, đi lướt qua nhau", "jlptLevel": "N3", "category": "noun"},
    {"word": "意地悪", "kana": "いじわる", "romaji": "ijiwaru", "meaning": "Xấu tính, tâm địa xấu", "jlptLevel": "N3", "category": "adjective"},
    {"word": "維持", "kana": "いじ", "romaji": "iji", "meaning": "Duy trì", "jlptLevel": "N3", "category": "noun"},
    {"word": "意識", "kana": "いしき", "romaji": "ishiki", "meaning": "Ý thức, nhận thức", "jlptLevel": "N3", "category": "noun"},
    {"word": "衣料", "kana": "いりょう", "romaji": "iryou", "meaning": "Quần áo, may mặc", "jlptLevel": "N3", "category": "noun"},
    {"word": "医療", "kana": "いりょう", "romaji": "iryou", "meaning": "Chăm sóc y tế", "jlptLevel": "N3", "category": "noun"},
    {"word": "岩", "kana": "いわ", "romaji": "iwa", "meaning": "Tảng đá lớn", "jlptLevel": "N3", "category": "noun"},
    {"word": "祝う", "kana": "いわう", "romaji": "iwau", "meaning": "Chúc mừng, ăn mừng", "jlptLevel": "N3", "category": "verb"},
    {"word": "印刷", "kana": "いんさつ", "romaji": "insatsu", "meaning": "In ấn", "jlptLevel": "N3", "category": "noun"},
    {"word": "印象", "kana": "いんしょう", "romaji": "inshou", "meaning": "Ấn tượng", "jlptLevel": "N3", "category": "noun"},
    {"word": "引退", "kana": "いんたい", "romaji": "intai", "meaning": "Giải nghệ, giải thể", "jlptLevel": "N3", "category": "noun"},
    {"word": "引用", "kana": "いんよう", "romaji": "inyou", "meaning": "Trích dẫn", "jlptLevel": "N3", "category": "noun"},
    {"word": "魚", "kana": "うお", "romaji": "uo", "meaning": "Con cá", "jlptLevel": "N3", "category": "noun"},
    {"word": "伺う", "kana": "うかがう", "romaji": "ukagau", "meaning": "Thăm hỏi, hỏi (Khiêm nhường)", "jlptLevel": "N3", "category": "verb"},
    {"word": "受け取る", "kana": "うけとる", "romaji": "uketoru", "meaning": "Nhận lấy, tiếp nhận", "jlptLevel": "N3", "category": "verb"},
    {"word": "動かす", "kana": "うごかす", "romaji": "ugokasu", "meaning": "Di chuyển, vận hành", "jlptLevel": "N3", "category": "verb"},
    {"word": "兎", "kana": "うさぎ", "romaji": "usagi", "meaning": "Con thỏ", "jlptLevel": "N3", "category": "noun"},
    {"word": "失う", "kana": "うしなう", "romaji": "ushinau", "meaning": "Mất, thất lạc", "jlptLevel": "N3", "category": "verb"},
    {"word": "疑う", "kana": "うたがう", "romaji": "utagau", "meaning": "Nghi ngờ", "jlptLevel": "N3", "category": "verb"},
    {"word": "宇宙", "kana": "うちゅう", "romaji": "uchuu", "meaning": "Vũ trụ", "jlptLevel": "N3", "category": "noun"},
    {"word": "撃つ", "kana": "うつ", "romaji": "utsu", "meaning": "Bắn (súng)", "jlptLevel": "N3", "category": "verb"},
    {"word": "訴える", "kana": "うったえる", "romaji": "uttaeru", "meaning": "Kệ tụng, khiếu nại", "jlptLevel": "N3", "category": "verb"},
    {"word": "奪う", "kana": "うばう", "romaji": "ubau", "meaning": "Cướp đoạt", "jlptLevel": "N3", "category": "verb"},
    {"word": "馬", "kana": "うま", "romaji": "uma", "meaning": "Con ngựa", "jlptLevel": "N3", "category": "noun"},
    {"word": "生まれ", "kana": "うまれ", "romaji": "umare", "meaning": "Nơi sinh ra, xuất thân", "jlptLevel": "N3", "category": "noun"},
    {"word": "梅", "kana": "うめ", "romaji": "ume", "meaning": "Cây mơ, hoa mơ", "jlptLevel": "N3", "category": "noun"},
    {"word": "裏切る", "kana": "うらぎる", "romaji": "uragiru", "meaning": "Phản bội", "jlptLevel": "N3", "category": "verb"},
    {"word": "売り切れ", "kana": "うりきれ", "romaji": "urikire", "meaning": "Bán hết sạch", "jlptLevel": "N3", "category": "noun"},
    {"word": "売り上げ", "kana": "うりあげ", "romaji": "uriage", "meaning": "Doanh thu", "jlptLevel": "N3", "category": "noun"},
    {"word": "噂", "kana": "うわさ", "romaji": "uwasa", "meaning": "Tin đồn", "jlptLevel": "N3", "category": "noun"},
    {"word": "運", "kana": "うん", "romaji": "un", "meaning": "Vận may, số phận", "jlptLevel": "N3", "category": "noun"},
    {"word": "運転", "kana": "うんてん", "romaji": "unten", "meaning": "Lái xe, vận hành", "jlptLevel": "N3", "category": "noun"},
    {"word": "運動", "kana": "うんどう", "romaji": "undou", "meaning": "Vận động, tập thể thao", "jlptLevel": "N3", "category": "noun"}
]

def enrich():
    # 1. Update N4 Vocab
    n4_file = "prisma/seed-data/n4-data.ts"
    with open(n4_file, "r", encoding="utf-8") as f:
        content_n4 = f.read()
    
    # Load existing VOCABULARY_N4 array via match
    match = re.search(r"export const VOCABULARY_N4: SeedVocab\[\] = (\[.*?\]);", content_n4, re.DOTALL)
    if match:
        existing_vocab_n4 = json.loads(match.group(1))
        words_seen = set(v["word"] for v in existing_vocab_n4)
        added = 0
        for item in N4_VOCAB_EXTRA:
            if item["word"] not in words_seen:
                existing_vocab_n4.append(item)
                words_seen.add(item["word"])
                added += 1
        new_json = json.dumps(existing_vocab_n4, ensure_ascii=False, indent=2)
        new_content = re.sub(r"export const VOCABULARY_N4: SeedVocab\[\] = \[.*?\];", f"export const VOCABULARY_N4: SeedVocab[] = {new_json};", content_n4, flags=re.DOTALL)
        with open(n4_file, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Added {added} items to VOCABULARY_N4 (Total: {len(existing_vocab_n4)})")
    
    # 2. Update N3 Vocab
    n3_file = "prisma/seed-data/n3-data.ts"
    with open(n3_file, "r", encoding="utf-8") as f:
        content_n3 = f.read()

    match_n3 = re.search(r"export const VOCABULARY_N3: SeedVocab\[\] = (\[.*?\]);", content_n3, re.DOTALL)
    if match_n3:
        existing_vocab_n3 = json.loads(match_n3.group(1))
        words_seen_n3 = set(v["word"] for v in existing_vocab_n3)
        added_n3 = 0
        for item in N3_VOCAB_EXTRA:
            if item["word"] not in words_seen_n3:
                existing_vocab_n3.append(item)
                words_seen_n3.add(item["word"])
                added_n3 += 1
        new_json_n3 = json.dumps(existing_vocab_n3, ensure_ascii=False, indent=2)
        new_content_n3 = re.sub(r"export const VOCABULARY_N3: SeedVocab\[\] = \[.*?\];", f"export const VOCABULARY_N3: SeedVocab[] = {new_json_n3};", content_n3, flags=re.DOTALL)
        with open(n3_file, "w", encoding="utf-8") as f:
            f.write(new_content_n3)
        print(f"Added {added_n3} items to VOCABULARY_N3 (Total: {len(existing_vocab_n3)})")

if __name__ == "__main__":
    enrich()

