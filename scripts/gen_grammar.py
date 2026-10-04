# -*- coding: utf-8 -*-
import os
import json

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_file = os.path.join(workspace_dir, "prisma", "seed-data", "grammar.ts")

grammar_data = [
    # Bài 1
    {
        "title": "〜です (desu)",
        "level": "N5",
        "meaning": "Là... / Đây là... — Trợ động từ kính ngữ kết thúc câu khẳng định",
        "structure": "[Danh từ / Tính từ -i] + です",
        "commonMistakes": "Không dùng です sau động từ dạng ます. Đừng nói「食べますです」— chỉ nói「食べます」。",
        "examples": [
            {"japanese": "私は学生です。", "romaji": "Watashi wa gakusei desu.", "meaning": "Tôi là học sinh/sinh viên."},
            {"japanese": "これは日本のカメラです。", "romaji": "Kore wa nihon no kamera desu.", "meaning": "Đây là máy ảnh của Nhật Bản."},
            {"japanese": "富士山は高いです。", "romaji": "Fujisan wa takai desu.", "meaning": "Núi Phú Sĩ thì cao."}
        ]
    },
    {
        "title": "〜ではありません / じゃありません",
        "level": "N5",
        "meaning": "Không phải là... — Dạng phủ định lịch sự của です",
        "structure": "[Danh từ] + ではありません / じゃありません",
        "commonMistakes": "じゃありません hay dùng trong giao tiếp hội thoại hàng ngày, ではありません hay dùng trong văn viết hoặc tình huống trang trọng.",
        "examples": [
            {"japanese": "私は医者ではありません。", "romaji": "Watashi wa isha dewa arimasen.", "meaning": "Tôi không phải là bác sĩ."},
            {"japanese": "明日は日曜日じゃありません。", "romaji": "Ashita wa nichiyoubi ja arimasen.", "meaning": "Ngày mai không phải là Chủ nhật."}
        ]
    },
    {
        "title": "〜は (wa) — Trợ từ chủ đề",
        "level": "N5",
        "meaning": "Đánh dấu chủ đề câu nói (Về... thì / Còn... thì)",
        "structure": "[Chủ đề] + は + [Vị ngữ]",
        "commonMistakes": "Phát âm là /wa/ dù viết bằng chữ cái 'は' (ha).",
        "examples": [
            {"japanese": "田中さんは日本人です。", "romaji": "Tanaka-san wa nihonjin desu.", "meaning": "Anh Tanaka là người Nhật."},
            {"japanese": "私の趣味は読書です。", "romaji": "Watashi no shumi wa dokusho desu.", "meaning": "Sở thích của tôi là đọc sách."}
        ]
    },
    {
        "title": "〜も (mo) — Trợ từ 'Cũng'",
        "level": "N5",
        "meaning": "Biểu thị sự đồng nhất hoặc thêm vào (Cũng là...)",
        "structure": "[Danh từ] + も + [Vị ngữ]",
        "commonMistakes": "Khi dùng も thì thay thế luôn cho trợ từ は và を, không ghép thành 'はも' hay 'をも'.",
        "examples": [
            {"japanese": "私もベトナム人です。", "romaji": "Watashi mo betonamujin desu.", "meaning": "Tôi cũng là người Việt Nam."},
            {"japanese": "マイクさんも学生です。", "romaji": "Maiku-san mo gakusei desu.", "meaning": "Mike cũng là học sinh."}
        ]
    },
    {
        "title": "〜の (no) — Trợ từ sở hữu & liên kết",
        "level": "N5",
        "meaning": "Của / Thuộc về — Nối hai danh từ N1 の N2 (N2 của N1 / N2 thuộc N1)",
        "structure": "[Danh từ 1] + の + [Danh từ 2]",
        "commonMistakes": "Trong tiếng Nhật, danh từ lớn/chủ sở hữu đứng trước, danh từ nhỏ/vật thuộc quyền đứng sau.",
        "examples": [
            {"japanese": "これは私の本です。", "romaji": "Kore wa watashi no hon desu.", "meaning": "Đây là cuốn sách của tôi."},
            {"japanese": "東京大学の学生です。", "romaji": "Toukyou daigaku no gakusei desu.", "meaning": "Là sinh viên của Đại học Tokyo."}
        ]
    },

    # Bài 2
    {
        "title": "これ / それ / あれ (kore / sore / are)",
        "level": "N5",
        "meaning": "Đại từ chỉ định đồ vật: Cái này (gần người nói), cái đó (gần người nghe), cái kia (xa cả hai)",
        "structure": "[これ / それ / あれ] + は + [Danh từ] + です",
        "commonMistakes": "これ/それ/あれ đứng độc lập làm đại từ. Không viết「これ本」— phải là「この本」.",
        "examples": [
            {"japanese": "これは何ですか？", "romaji": "Kore wa nan desu ka?", "meaning": "Cái này là cái gì vậy?"},
            {"japanese": "それは辞書です。", "romaji": "Sore wa jisho desu.", "meaning": "Đó là cuốn từ điển."},
            {"japanese": "あれは私の傘です。", "romaji": "Are wa watashi no kasa desu.", "meaning": "Cái kia là chiếc ô của tôi."}
        ]
    },
    {
        "title": "この / その / あの + N",
        "level": "N5",
        "meaning": "Bổ nghĩa cho danh từ: Cái N này / Cái N đó / Cái N kia",
        "structure": "[この / その / あの] + [Danh từ] + は ...",
        "commonMistakes": "Bắt buộc phải có danh từ theo ngay sau (この + N).",
        "examples": [
            {"japanese": "この時計はいくらですか？", "romaji": "Kono tokei wa ikura desu ka?", "meaning": "Chiếc đồng hồ này giá bao nhiêu tiền?"},
            {"japanese": "あの人は誰ですか？", "romaji": "Ano hito wa dare desu ka?", "meaning": "Người kia là ai vậy?"}
        ]
    },

    # Bài 3
    {
        "title": "ここ / そこ / あそこ / どこ",
        "level": "N5",
        "meaning": "Đại từ chỉ địa điểm: Chỗ này, chỗ đó, chỗ đằng kia, ở đâu",
        "structure": "[ここ / そこ / あそこ / どこ] + は + [Danh từ địa điểm] + です",
        "commonMistakes": "Lịch sự hơn dùng こちら, そちら, あちら, どちら.",
        "examples": [
            {"japanese": "ここは教室です。", "romaji": "Koko wa kyoushitsu desu.", "meaning": "Đây là phòng học."},
            {"japanese": "お手洗いはどこですか？", "romaji": "Otearai wa doko desu ka?", "meaning": "Nhà vệ sinh ở đâu ạ?"}
        ]
    },

    # Bài 4
    {
        "title": "〜時〜分 / 〜から〜まで (Thời gian)",
        "level": "N5",
        "meaning": "... giờ ... phút / Từ ... đến ...",
        "structure": "[Thời gian] + から + [Thời gian] + まで",
        "commonMistakes": "Chú ý phát âm giờ đặc biệt: 4 giờ (よじ), 9 giờ (くじ), 7 giờ (しちじ). Phút: 1분 (いっぷん), 3분 (さんぷん), 6분 (ろっぷん), 8분 (はっぷん), 10분 (じゅっぷん).",
        "examples": [
            {"japanese": "今、午前10時30分です。", "romaji": "Ima, gozen juu-ji sanjuppun desu.", "meaning": "Bây giờ là 10 giờ 30 phút sáng."},
            {"japanese": "銀行は9時から3時までです。", "romaji": "Ginkou wa 9-ji kara 3-ji made desu.", "meaning": "Ngân hàng mở cửa từ 9 giờ đến 3 giờ."}
        ]
    },
    {
        "title": "Động từ các thì: 〜ます / 〜ません / 〜ました / 〜ませんでした",
        "level": "N5",
        "meaning": "Khẳng định, phủ định, quá khứ khẳng định, quá khứ phủ định dạng lịch sự",
        "structure": "[V-ます] -> ません / ました / ませんでした",
        "commonMistakes": "Động từ đuôi ます luôn ở cuối câu vị ngữ.",
        "examples": [
            {"japanese": "毎朝6時に起きます。", "romaji": "Maiasa 6-ji ni okimasu.", "meaning": "Mỗi sáng tôi thức dậy lúc 6 giờ."},
            {"japanese": "昨日は勉強しませんでした。", "romaji": "Kinou wa benkyou shimasen deshita.", "meaning": "Hôm qua tôi đã không học bài."}
        ]
    },

    # Bài 5
    {
        "title": "〜へ 行きます / 来ます / 帰ります (へ - Phương hướng)",
        "level": "N5",
        "meaning": "Đi / Đến / Về đâu đó — Trợ từ へ đánh dấu hướng di chuyển",
        "structure": "[Địa điểm] + へ (hoặc に) + [行きます / 来ます / 帰ります]",
        "commonMistakes": "Chữ へ phát âm là /e/ khi làm trợ từ chỉ phương hướng.",
        "examples": [
            {"japanese": "来週、日本へ行きます。", "romaji": "Raishuu, Nihon e ikimasu.", "meaning": "Tuần sau tôi sẽ đi Nhật Bản."},
            {"japanese": "一緒にうちへ帰りましょう。", "romaji": "Issho ni uchi e kaerimashou.", "meaning": "Cùng nhau về nhà nhé."}
        ]
    },
    {
        "title": "〜で (Phương tiện giao thông / Công cụ)",
        "level": "N5",
        "meaning": "Bằng (phương tiện, công cụ, ngôn ngữ)",
        "structure": "[Phương tiện / Dụng cụ] + で + [Động từ]",
        "commonMistakes": "Đi bộ thì dùng「歩いて (aruite)」, không thêm で:「歩いて行きます」.",
        "examples": [
            {"japanese": "新幹線で京都へ行きます。", "romaji": "Shinkansen de Kyouto e ikimasu.", "meaning": "Tôi đi đến Kyoto bằng tàu Shinkansen."},
            {"japanese": "箸でご飯を食べます。", "romaji": "Hashi de gohan o tabemasu.", "meaning": "Tôi ăn cơm bằng đũa."}
        ]
    },

    # Bài 6
    {
        "title": "〜を (wo) — Trợ từ tân ngữ trực tiếp",
        "level": "N5",
        "meaning": "Tác động hành động lên đối tượng (Ăn cái gì, uống cái gì, đọc cái gì)",
        "structure": "[Tân ngữ] + を + [Động từ tha động từ]",
        "commonMistakes": "Phát âm là /o/. Không dùng を với động từ di chuyển hoặc trạng thái tồn tại.",
        "examples": [
            {"japanese": "パンと卵を食べます。", "romaji": "Pan to tamago o tabemasu.", "meaning": "Tôi ăn bánh mì và trứng."},
            {"japanese": "日本語のニュースを読みます。", "romaji": "Nihongo no nyuusu o yomimasu.", "meaning": "Tôi đọc tin tức tiếng Nhật."}
        ]
    },
    {
        "title": "〜で (Địa điểm diễn ra hành động)",
        "level": "N5",
        "meaning": "Ở, tại nơi chốn thực hiện hành động",
        "structure": "[Địa điểm] + で + [Hành động]",
        "commonMistakes": "Khác với に (nơi tồn tại arimasu/imasu), で dùng khi có hoạt động diễn ra.",
        "examples": [
            {"japanese": "図書館で本を読みます。", "romaji": "Toshokan de hon o yomimasu.", "meaning": "Tôi đọc sách ở thư viện."},
            {"japanese": "駅の前で友達を待ちます。", "romaji": "Eki no mae de tomodachi o machimasu.", "meaning": "Tôi đợi bạn ở trước cửa ga."}
        ]
    },
    {
        "title": "〜ませんか / 〜ましょう (Rủ rê & Đề nghị)",
        "level": "N5",
        "meaning": "Cùng làm gì với tôi nhé? / Cùng làm thôi nào!",
        "structure": "[V-bỏ ます] + ませんか (lời mời lịch sự) / ましょう (lời kêu gọi cùng làm)",
        "commonMistakes": "ませんか thể hiện sự tôn trọng, hỏi ý kiến đối phương. ましょう có tính chủ động kêu gọi.",
        "examples": [
            {"japanese": "一緒にお茶を飲みませんか？", "romaji": "Issho ni ocha o nomimasen ka?", "meaning": "Cùng đi uống trà với tôi không?"},
            {"japanese": "ええ、飲みましょう！", "romaji": "Ee, nomimashou!", "meaning": "Vâng, cùng uống thôi nào!"}
        ]
    },

    # Bài 7
    {
        "title": "〜を あげます / もらいます (Tặng / Nhận)",
        "level": "N5",
        "meaning": "Tặng quà cho ai (〜にあげます) / Nhận quà từ ai (〜にもらいます/からもらいます)",
        "structure": "[Người nhận] + に + [Đồ vật] + を + あげます / [Người cho] + に/から + [Đồ vật] + を + もらいます",
        "commonMistakes": "Không dùng あげます khi người nhận là chính mình (tôi).",
        "examples": [
            {"japanese": "母に花をあげました。", "romaji": "Haha ni hana o agemashita.", "meaning": "Tôi đã tặng hoa cho mẹ."},
            {"japanese": "友達にプレゼントをもらいました。", "romaji": "Tomodachi ni purezento o moraimashita.", "meaning": "Tôi đã nhận được món quà từ bạn bè."}
        ]
    },
    {
        "title": "もう 〜ました / まだ 〜ていません",
        "level": "N5",
        "meaning": "Đã làm gì rồi / Chưa làm gì",
        "structure": "もう + [V-ました] / まだです (chưa làm)",
        "commonMistakes": "Trả lời 'Chưa làm' không dùng「いいえ、しませんでした」(tôi đã không làm), mà dùng「いいえ、まだです」(chưa).",
        "examples": [
            {"japanese": "もう昼ご飯を食べましたか？", "romaji": "Mou hirugohan o tabemashita ka?", "meaning": "Bạn đã ăn trưa chưa?"},
            {"japanese": "いいえ、まだです。これから食べます。", "romaji": "Iie, mada desu. Korekara tabemasu.", "meaning": "Chưa, tôi chuẩn bị ăn đây."}
        ]
    },

    # Bài 8
    {
        "title": "Tính từ đuôi い (i-Adjective)",
        "level": "N5",
        "meaning": "Tính từ có tận cùng là chữ い (Lớn, nhỏ, ngon, đắt, nóng, lạnh...)",
        "structure": "Khẳng định: 〜いです / Phủ định: 〜くないです / Quá khứ: 〜かったです / QK phủ định: 〜くなかったです",
        "commonMistakes": "Riêng từ「いい」(tốt) chia biến thể theo「よい」: よくない, よかった, よくなかった.",
        "examples": [
            {"japanese": "昨日は寒くなかったです。", "romaji": "Kinou wa samukunakatta desu.", "meaning": "Hôm qua trời đã không lạnh."},
            {"japanese": "この寿司はとても美味しいです。", "romaji": "Kono sushi wa totemo oishii desu.", "meaning": "Món sushi này rất ngon."}
        ]
    },
    {
        "title": "Tính từ đuôi な (na-Adjective)",
        "level": "N5",
        "meaning": "Tính từ miêu tả trạng thái (Yên tĩnh, đẹp, thân thiện, nổi tiếng, rảnh rỗi...)",
        "structure": "Đứng trước danh từ: [Tính từ] + な + N / Cuối câu: [Tính từ] + です / じゃありません",
        "commonMistakes": "Khi đứng cuối câu thì bỏ な (静かです). Khi bổ nghĩa danh từ thì thêm な (静かな町). Chú ý 綺麗 (kirei) và 有名 (yuumei) tận cùng âm i nhưng là tính từ đuôi な!",
        "examples": [
            {"japanese": "京都は静かで綺麗な町です。", "romaji": "Kyouto wa shizuka de kirei na machi desu.", "meaning": "Kyoto là một thành phố yên bình và xinh đẹp."},
            {"japanese": "この通りはあまり有名じゃありません。", "romaji": "Kono toori wa amari yuumei ja arimasen.", "meaning": "Con phố này không nổi tiếng lắm."}
        ]
    },

    # Bài 9
    {
        "title": "〜が好き / 嫌い / 上手 / 下手 (suki / kirai / jouzu / heta)",
        "level": "N5",
        "meaning": "Thích / Ghét / Giỏi / Kém cái gì — Trợ từ が đi trước",
        "structure": "[Danh từ] + が + [好き / 嫌い / 上手 / 下手] + です",
        "commonMistakes": "Dùng trợ từ が, KHÔNG dùng trợ từ を với các tính từ chỉ năng lực và cảm xúc này.",
        "examples": [
            {"japanese": "私は日本のアニメが好きです。", "romaji": "Watashi wa nihon no anime ga suki desu.", "meaning": "Tôi rất thích Anime Nhật Bản."},
            {"japanese": "田中さんは歌がとても上手です。", "romaji": "Tanaka-san wa uta ga totemo jouzu desu.", "meaning": "Anh Tanaka hát rất giỏi."}
        ]
    },
    {
        "title": "〜があります / います (arimasu / imasu — Có / Tồn tại)",
        "level": "N5",
        "meaning": "Biểu thị sự sở hữu hoặc sự có mặt (Vật vô tri: あります / Người, động vật: います)",
        "structure": "[Địa điểm] + に + [Chủ thể] + が + [あります / います]",
        "commonMistakes": "Đồ vật, cây cối, sự việc dùng あります. Người, động vật cử động dùng います.",
        "examples": [
            {"japanese": "机の上に本があります。", "romaji": "Tsukue no ue ni hon ga arimasu.", "meaning": "Trên bàn có cuốn sách."},
            {"japanese": "庭に可愛い犬がいます。", "romaji": "Niwa ni kawaii inu ga imasu.", "meaning": "Trong sân có một chú chó đáng yêu."}
        ]
    },

    # Bài 11
    {
        "title": "Số đếm & Lượng từ (Counters in N5)",
        "level": "N5",
        "meaning": "Đếm đồ vật chung (〜つ), người (〜人), vật dài (〜本), tờ mỏng (〜枚), động vật nhỏ (〜匹)",
        "structure": "[Danh từ] + を + [Lượng từ] + [Động từ]",
        "commonMistakes": "Lượng từ thường đặt trực tiếp trước động từ, không cần trợ từ ở giữa:「りんごを 3つ 買いました」.",
        "examples": [
            {"japanese": "りんごを3つ買いました。", "romaji": "Ringo o mittsu kaimashita.", "meaning": "Tôi đã mua 3 quả táo."},
            {"japanese": "ビールを2本ください。", "romaji": "Biiru o nihon kudasai.", "meaning": "Cho tôi xin 2 chai bia ạ."}
        ]
    },

    # Bài 12
    {
        "title": "〜より 〜のほうが 〜 (So sánh)",
        "level": "N5",
        "meaning": "So với A thì B hơn...",
        "structure": "[A] + より + [B] + のほうが + [Tính từ] + です",
        "commonMistakes": "Nhớ rằng bên có「のほうが」luôn là bên chiếm ưu thế hơn trong câu so sánh.",
        "examples": [
            {"japanese": "電車はバスより速いです。", "romaji": "Densha wa basu yori hayai desu.", "meaning": "Tàu điện chạy nhanh hơn xe buýt."},
            {"japanese": "夏より冬のほうが好きです。", "romaji": "Natsu yori fuyu no hou ga suki desu.", "meaning": "So với mùa hè thì tôi thích mùa đông hơn."}
        ]
    },

    # Bài 13
    {
        "title": "〜たい / 〜がほしい (Muốn làm gì / Muốn có cái gì)",
        "level": "N5",
        "meaning": "Bày tỏ ước muốn của bản thân (Muốn làm V: V-たい / Muốn có vật: N が ほしい)",
        "structure": "[V-bỏ ます] + たいです / [Danh từ] + が + ほしいです",
        "commonMistakes": "Chỉ dùng trực tiếp cho mong muốn của ngôi thứ nhất (tôi). Muốn hỏi người khác dùng「〜たいですか」.",
        "examples": [
            {"japanese": "日本へ旅行に行きたいです。", "romaji": "Nihon e ryokou ni ikitai desu.", "meaning": "Tôi muốn đi du lịch Nhật Bản."},
            {"japanese": "新しいパソコンがほしいです。", "romaji": "Atarashii pasokon ga hoshii desu.", "meaning": "Tôi muốn có một chiếc máy tính mới."}
        ]
    },
    {
        "title": "〜へ 〜に 行きます / 来ます (Mục đích di chuyển)",
        "level": "N5",
        "meaning": "Đi / Đến đâu để làm mục đích gì",
        "structure": "[Địa điểm] + へ + [V-bỏ ます / Danh từ] + に + 行きます",
        "commonMistakes": "Động từ biểu thị mục đích phải bỏ ます rồi gắn に.",
        "examples": [
            {"japanese": "デパートへ買い物に行きます。", "romaji": "Depaato e kaimono ni ikimasu.", "meaning": "Tôi đi đến trung tâm thương mại để mua sắm."},
            {"japanese": "スーパーへ牛乳を買いに行きました。", "romaji": "Suupaa e gyuunyuu o kai ni ikimashita.", "meaning": "Tôi đã đi siêu thị để mua sữa."}
        ]
    },

    # Bài 14
    {
        "title": "Thể Te (〜て形 - Te-form) & 〜てください",
        "level": "N5",
        "meaning": "Biến thể nền tảng quan trọng nhất trong tiếng Nhật sơ cấp & Mẫu câu yêu cầu, xin hãy...",
        "structure": "[V-て] + ください (Xin hãy làm gì đó)",
        "commonMistakes": "Quy tắc chia nhóm I: い/ち/り -> って, み/び/に -> んで, き -> いて, ぎ -> いで, し -> して. Nhóm II: bỏ ます thêm て. Nhóm III: して / きて.",
        "examples": [
            {"japanese": "ここに名前を書いてください。", "romaji": "Koko ni namae o kaite kudasai.", "meaning": "Xin hãy viết họ tên của bạn vào đây."},
            {"japanese": "ゆっくり話してください。", "romaji": "Yukkuri hanashite kudasai.", "meaning": "Xin vui lòng nói chậm lại một chút ạ."}
        ]
    },
    {
        "title": "〜ています (Đang diễn ra / Trạng thái kết quả)",
        "level": "N5",
        "meaning": "Đang thực hiện hành động (tiếp diễn) hoặc đang duy trì trạng thái (kết hôn, sống ở, biết)",
        "structure": "[V-て] + います",
        "commonMistakes": "Các động từ trạng thái như 結婚しています (đã kết hôn), 住んでいます (đang sinh sống tại), 知っています (biết) luôn dùng 〜ています.",
        "examples": [
            {"japanese": "今、日本語を勉強しています。", "romaji": "Ima, nihongo o benkyou shite imasu.", "meaning": "Bây giờ tôi đang học tiếng Nhật."},
            {"japanese": "ハノイに住んでいます。", "romaji": "Hanoi ni sunde imasu.", "meaning": "Tôi đang sinh sống tại Hà Nội."}
        ]
    },

    # Bài 15
    {
        "title": "〜てもいいです / 〜てはいけません (Cho phép & Cấm đoán)",
        "level": "N5",
        "meaning": "Được phép làm gì... / Không được phép làm gì (Cấm)",
        "structure": "[V-て] + もいいです (Được phép) / [V-て] + はいけません (Cấm)",
        "commonMistakes": "Khi xin phép làm gì:「〜てもいいですか？」. Nếu từ chối nhẹ nhàng:「すみません、ちょっと...」.",
        "examples": [
            {"japanese": "写真を撮ってもいいですか？", "romaji": "Shashin o totte mo ii desu ka?", "meaning": "Tôi có thể chụp ảnh ở đây được không?"},
            {"japanese": "ここでタバコを吸ってはいけません。", "romaji": "Koko de tabako o sutte wa ikemasen.", "meaning": "Không được hút thuốc ở khu vực này."}
        ]
    },

    # Bài 16
    {
        "title": "〜てから (Sau khi làm A thì làm B)",
        "level": "N5",
        "meaning": "Sau khi hoàn thành hành động 1 thì mới làm hành động 2",
        "structure": "[V1-て] + から、[V2]",
        "commonMistakes": "Hành động 1 kết thúc dứt điểm rồi mới tới hành động 2.",
        "examples": [
            {"japanese": "手を洗ってから、ご飯を食べます。", "romaji": "Te o aratte kara, gohan o tabemasu.", "meaning": "Sau khi rửa tay sạch sẽ, tôi mới ăn cơm."},
            {"japanese": "大学を卒業してから、日本で働きます。", "romaji": "Daigaku o sotsugyou shite kara, Nihon de hatarakimasu.", "meaning": "Sau khi tốt nghiệp đại học, tôi sẽ làm việc tại Nhật."}
        ]
    },

    # Bài 17
    {
        "title": "Thể Nai (〜ない形 - Nai-form) & 〜ないでください",
        "level": "N5",
        "meaning": "Dạng phủ định ngắn & Mẫu câu 'Xin đừng làm gì'",
        "structure": "[V-ない] + でください",
        "commonMistakes": "Nhóm I: đổi âm i sang hàng a rồi thêm ない (書く -> 書かない). Nhóm II: bỏ ます thêm ない (食べる -> 食べない). Nhóm III: しない / こない.",
        "examples": [
            {"japanese": "ここで写真を撮らないでください。", "romaji": "Koko de shashin o toranaide kudasai.", "meaning": "Xin vui lòng không chụp ảnh ở đây."},
            {"japanese": "パスポートを忘れないでください。", "romaji": "Pasupooto o wasurenaide kudasai.", "meaning": "Xin đừng bỏ quên hộ chiếu nhé."}
        ]
    },
    {
        "title": "〜なければなりません (Phải làm gì)",
        "level": "N5",
        "meaning": "Bắt buộc phải làm một việc gì đó (nghĩa vụ)",
        "structure": "[V-bỏ い của ない] + ければなりません",
        "commonMistakes": "Dạng rút gọn trong khẩu ngữ thường gặp là 〜なきゃ.",
        "examples": [
            {"japanese": "毎日薬を飲まなければなりません。", "romaji": "Mainichi kusuri o nomanakereba narimasen.", "meaning": "Mỗi ngày tôi đều phải uống thuốc."},
            {"japanese": "明日テストがあるから、勉強しなければなりません。", "romaji": "Ashita tesuto ga aru kara, benkyou shinakereba narimasen.", "meaning": "Vì mai có bài kiểm tra nên tôi phải học bài."}
        ]
    },

    # Bài 18
    {
        "title": "Thể Từ Điển (辞書形) & 〜ことができます (Khả năng)",
        "level": "N5",
        "meaning": "Có thể làm được điều gì đó (năng lực / điều kiện)",
        "structure": "[V-thể từ điển] + ことが できます",
        "commonMistakes": "Nhóm I: tận cùng hàng u (iku, nomu). Nhóm II: tận cùng eru/iru (taberu, miru). Nhóm III: suru, kuru.",
        "examples": [
            {"japanese": "私は漢字を50個書くことができます。", "romaji": "Watashi wa kanji o 50-ko kaku koto ga dekimasu.", "meaning": "Tôi có thể viết được 50 chữ Hán Kanji."},
            {"japanese": "このホテルで日本円を両替することができます。", "romaji": "Kono hoteru de nihon'en o ryougae suru koto ga dekimasu.", "meaning": "Tại khách sạn này có thể đổi tiền Yên Nhật được."}
        ]
    },
    {
        "title": "〜まえに (Trước khi làm gì...)",
        "level": "N5",
        "meaning": "Trước khi làm hành động A thì làm B",
        "structure": "[V-thể từ điển] + まえに / [Danh từ] + のまえに",
        "commonMistakes": "Luôn dùng thể từ điển trước まえに, dù câu nói ở thì quá khứ.",
        "examples": [
            {"japanese": "寝るまえに、日記を書きます。", "romaji": "Neru mae ni, nikki o kakimasu.", "meaning": "Trước khi đi ngủ, tôi viết nhật ký."},
            {"japanese": "食事のまえに、手を洗います。", "romaji": "Shokuji no mae ni, te o araimasu.", "meaning": "Trước bữa ăn, tôi rửa tay."}
        ]
    },

    # Bài 19
    {
        "title": "Thể Ta (〜た形 - Ta-form) & 〜たことがあります (Kinh nghiệm)",
        "level": "N5",
        "meaning": "Đã từng có trải nghiệm làm việc gì trong quá khứ",
        "structure": "[V-た] + ことが あります",
        "commonMistakes": "Chia thể Ta giống hệt thể Te (thay て bằng た, で bằng だ).",
        "examples": [
            {"japanese": "富士山に登ったことがあります。", "romaji": "Fujisan ni nobotta koto ga arimasu.", "meaning": "Tôi đã từng leo núi Phú Sĩ."},
            {"japanese": "日本の納豆を食べたことがありますか？", "romaji": "Nihon no nattou o tabeta koto ga arimasu ka?", "meaning": "Bạn đã từng ăn món Natto của Nhật chưa?"}
        ]
    },
    {
        "title": "〜たり 〜たり します (Liệt kê hành động tiêu biểu)",
        "level": "N5",
        "meaning": "Lúc thì làm A, lúc thì làm B...",
        "structure": "[V1-た] + り、[V2-た] + り + します",
        "commonMistakes": "Phải kết thúc bằng động từ します (hoặc しました cho quá khứ).",
        "examples": [
            {"japanese": "休みの日は本を読んだり、音楽を聞いたりします。", "romaji": "Yasumi no hi wa hon o yondari, ongaku o kiitari shimasu.", "meaning": "Ngày nghỉ tôi thường đọc sách, nghe nhạc,..."},
            {"japanese": "昨日は買い物をしたり、映画を見たりしました。", "romaji": "Kinou wa kaimono o shitari, eiga o mitari shimashita.", "meaning": "Hôm qua tôi đã đi mua sắm và xem phim."}
        ]
    },

    # Bài 20 & 21
    {
        "title": "Thể Thông Thường (普通形 - Futsuukei)",
        "level": "N5",
        "meaning": "Dạng câu thân mật dùng với bạn bè, người thân và làm mệnh đề phụ",
        "structure": "Động từ: V-る, V-ない, V-た, V-なかった / Tính từ: 寒い, 寒くない / Danh từ: だ, じゃない",
        "commonMistakes": "Không dùng thể lịch sự (ます/です) bên trong các mệnh đề phụ như と思います, とき, から.",
        "examples": [
            {"japanese": "明日雨が降ると思う。", "romaji": "Ashita ame ga furu to omou.", "meaning": "Mình nghĩ ngày mai trời sẽ mưa."},
            {"japanese": "日本のアニメは面白いよ！", "romaji": "Nihon no anime wa omoshiroi yo!", "meaning": "Anime Nhật Bản thú vị lắm đấy!"}
        ]
    },
    {
        "title": "〜と思います (Ý kiến & Suy nghĩ)",
        "level": "N5",
        "meaning": "Tôi nghĩ rằng... (Bày tỏ phán đoán hoặc quan điểm cá nhân)",
        "structure": "[Thể thông thường (普通形)] + と 思います",
        "commonMistakes": "Trước と luôn là thể thông thường (Futsuukei). Danh từ và Tính từ đuôi な phải thêm だ:「有名だと思います」.",
        "examples": [
            {"japanese": "日本の物価は高いと思います。", "romaji": "Nihon no bukka wa takai to omoimasu.", "meaning": "Tôi nghĩ rằng vật giá ở Nhật Bản đắt đỏ."},
            {"japanese": "明日はいい天気になると思います。", "romaji": "Ashita wa ii tenki ni naru to omoimasu.", "meaning": "Tôi nghĩ ngày mai thời tiết sẽ trở nên đẹp."}
        ]
    }
]

out_content = f"""// Grammar N5 Seed Data — Full coverage of Minna No Nihongo I (Bài 1 - 25)
export const grammarData = {json.dumps(grammar_data, ensure_ascii=False, indent=2)};
"""

with open(target_file, "w", encoding="utf-8") as f:
    f.write(out_content)

print(f"Generated grammar.ts with {len(grammar_data)} core grammar points")
