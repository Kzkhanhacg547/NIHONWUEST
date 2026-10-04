import os
import re

N4_VOCAB_ADDITIONS = [
    # Verbs N4
    {
        "word": "受ける", "kana": "うける", "kanji": "受ける", "romaji": "ukeru",
        "meaning": "Dự thi, tiếp nhận", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "来月JLPT N4の試験を受けます。", "exampleRomaji": "Raigetsu JLPT N4 no shiken o ukemasu.",
        "exampleMeaning": "Tháng sau tôi sẽ dự thi kỳ thi JLPT N4.", "tags": "Học tập,Động từ"
    },
    {
        "word": "祈る", "kana": "いのる", "kanji": "祈る", "romaji": "inoru",
        "meaning": "Cầu nguyện, chúc phúc", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "合格を心から祈っています。", "exampleRomaji": "Gōkaku o kokoro kara inotte imasu.",
        "exampleMeaning": "Tôi chân thành cầu chúc cho bạn đỗ kỳ thi.", "tags": "Cảm xúc,Động từ"
    },
    {
        "word": "迎える", "kana": "むかえる", "kanji": "迎える", "romaji": "mukaeru",
        "meaning": "Đón tiếp, nghênh đón", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "空港まで友達を迎えに行きます。", "exampleRomaji": "Kūkō made tomodachi o mukae ni ikimasu.",
        "exampleMeaning": "Tôi ra sân bay để đón bạn.", "tags": "Giao tiếp,Động từ"
    },
    {
        "word": "払う", "kana": "はらう", "kanji": "払う", "romaji": "harau",
        "meaning": "Thanh toán, trả tiền", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "クレジットカードで払ってもいいですか？", "exampleRomaji": "Kreditto kādo de haratte mo ii desu ka?",
        "exampleMeaning": "Tôi trả bằng thẻ tín dụng có được không?", "tags": "Ăn uống,Động từ"
    },
    {
        "word": "断る", "kana": "ことわる", "kanji": "断る", "romaji": "kotowaru",
        "meaning": "Từ chối", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "丁寧にお誘いを断りました。", "exampleRomaji": "Teinei ni osasoi o kotowarimashita.",
        "exampleMeaning": "Tôi đã lịch sự từ chối lời mời.", "tags": "Giao tiếp,Động từ"
    },
    {
        "word": "探す", "kana": "さがす", "kanji": "探す", "romaji": "sagasu",
        "meaning": "Tìm kiếm", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "落とした鍵を探しています。", "exampleRomaji": "Otoshita kagi o sagashite imasu.",
        "exampleMeaning": "Tôi đang tìm chiếc chìa khóa bị đánh rơi.", "tags": "Đời sống,Động từ"
    },
    {
        "word": "渡す", "kana": "わたす", "kanji": "渡す", "romaji": "watasu",
        "meaning": "Trao, đưa cho", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "先生に宿題を渡しました。", "exampleRomaji": "Sensei ni shukudai o watashimashita.",
        "exampleMeaning": "Tôi đã đưa bài tập về nhà cho thầy giáo.", "tags": "Giao tiếp,Động từ"
    },
    {
        "word": "直す", "kana": "なおす", "kanji": "直す", "romaji": "naosu",
        "meaning": "Sửa chữa, điều chỉnh", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "壊れた時計を自分で直しました。", "exampleRomaji": "Kowareta tokei o jibun de naoshimashita.",
        "exampleMeaning": "Tôi đã tự mình sửa chiếc đồng hồ bị hỏng.", "tags": "Công việc,Động từ"
    },
    {
        "word": "連れる", "kana": "つれる", "kanji": "連れる", "romaji": "tsureru",
        "meaning": "Dẫn theo, dẫn đi", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "子供を公園に連れて行きます。", "exampleRomaji": "Kodomo o kōen ni tsurete ikimasu.",
        "exampleMeaning": "Tôi dẫn con ra công viên chơi.", "tags": "Gia đình,Động từ"
    },
    {
        "word": "頼む", "kana": "たのむ", "kanji": "頼む", "romaji": "tanomu",
        "meaning": "Nhờ vả, yêu cầu", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "友達に写真を撮ってくれるよう頼みました。", "exampleRomaji": "Tomodachi ni shashin o totte kureru yō tanomimashita.",
        "exampleMeaning": "Tôi đã nhờ bạn chụp giúp một tấm ảnh.", "tags": "Giao tiếp,Động từ"
    },
    {
        "word": "増える", "kana": "ふえる", "kanji": "増える", "romaji": "fueru",
        "meaning": "Tăng lên, gia tăng", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "ベトナムを訪れる外国人観光客が増えています。", "exampleRomaji": "Betonamu o访reru gaikokujin kankōkyaku ga fuete imasu.",
        "exampleMeaning": "Lượng du khách nước ngoài đến Việt Nam đang gia tăng.", "tags": "Giao thông,Động từ"
    },
    {
        "word": "減る", "kana": "へる", "kanji": "減る", "romaji": "heru",
        "meaning": "Giảm đi, suy giảm", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "お腹が減って力が出ません。", "exampleRomaji": "Onaka ga hette chikara ga demasen.",
        "exampleMeaning": "Bụng tôi đói (giảm năng lượng) không còn sức nữa.", "tags": "Đời sống,Động từ"
    },
    {
        "word": "忘れる", "kana": "わすれる", "kanji": "忘れる", "romaji": "wasureru",
        "meaning": "Quên", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "家に傘を忘れてきてしまいました。", "exampleRomaji": "Ie ni kasa o wasurete kite shimaimashita.",
        "exampleMeaning": "Tôi lỡ quên chiếc ô ở nhà mất rồi.", "tags": "Đời sống,Động từ"
    },
    {
        "word": "考える", "kana": "かんがえる", "kanji": "考える", "romaji": "kangaeru",
        "meaning": "Suy nghĩ, tư duy", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "将来の進路についてよく考えています。", "exampleRomaji": "Shōrai no shinro ni tsuite yoku kangarete imasu.",
        "exampleMeaning": "Tôi đang suy nghĩ kỹ về hướng đi tương lai.", "tags": "Học tập,Động từ"
    },
    {
        "word": "引っ越す", "kana": "ひっこす", "kanji": "引っ越す", "romaji": "hikkosu",
        "meaning": "Chuyển nhà", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "来週新しいアパートに引っ越します。", "exampleRomaji": "Raishū atarashii apāto ni hikkoshimasu.",
        "exampleMeaning": "Tuần sau tôi sẽ chuyển sang một căn hộ mới.", "tags": "Gia đình,Động từ"
    },
    {
        "word": "通う", "kana": "かよう", "kanji": "通う", "romaji": "kayou",
        "meaning": "Đi lại thường xuyên (đi học/đi làm)", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "毎日電車で大学に通っています。", "exampleRomaji": "Mainichi densha de daigaku ni kayotte imasu.",
        "exampleMeaning": "Hàng ngày tôi đi học đại học bằng tàu điện.", "tags": "Giao thông,Động từ"
    },
    {
        "word": "運ぶ", "kana": "はこぶ", "kanji": "運ぶ", "romaji": "hakobu",
        "meaning": "Vận chuyển, bê vác", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "重い荷物を二階へ運びました。", "exampleRomaji": "Omoi nimotsu o nikai e hakobimashita.",
        "exampleMeaning": "Tôi đã bê hành lý nặng lên tầng hai.", "tags": "Công việc,Động từ"
    },
    {
        "word": "集める", "kana": "あつめる", "kanji": "集める", "romaji": "atsumeru",
        "meaning": "Thu thập, sưu tầm", "partOfSpeech": "verb", "jlptLevel": "N4",
        "exampleJapanese": "趣味で切手を集めています。", "exampleRomaji": "Shumi de kitte o atsumete imasu.",
        "exampleMeaning": "Tôi sưu tầm tem như một sở thích.", "tags": "Đời sống,Động từ"
    },

    # Nouns N4
    {
        "word": "予習", "kana": "よしゅう", "kanji": "予習", "romaji": "yoshuu",
        "meaning": "Sự soạn bài, chuẩn bị bài trước", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "授業の前に必ず予習をします。", "exampleRomaji": "Jugyō no mae ni kanarazu yoshū o shimasu.",
        "exampleMeaning": "Tôi luôn luôn soạn bài trước giờ học.", "tags": "Học tập"
    },
    {
        "word": "復習", "kana": "ふくしゅう", "kanji": "復習", "romaji": "fukushuu",
        "meaning": "Sự ôn tập bài cũ", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "習った文法を毎日復習することが大切です。", "exampleRomaji": "Naratta bunpō o mainichi fukushū suru koto ga taisetsu desu.",
        "exampleMeaning": "Việc ôn tập ngữ pháp đã học mỗi ngày là rất quan trọng.", "tags": "Học tập"
    },
    {
        "word": "専門", "kana": "せんもん", "kanji": "専門", "romaji": "senmon",
        "meaning": "Chuyên ngành, chuyên môn", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "私の大学での専門はIT技術です。", "exampleRomaji": "Watashi no daigaku de no senmon wa IT gijutsu desu.",
        "exampleMeaning": "Chuyên ngành của tôi ở đại học là công nghệ thông tin.", "tags": "Học tập"
    },
    {
        "word": "理由", "kana": "りゆう", "kanji": "理由", "romaji": "riyuu",
        "meaning": "Lý do, nguyên nhân", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "遅刻した理由を先生に説明しました。", "exampleRomaji": "Chikoku shita riyū o sensei ni setsumei shimashita.",
        "exampleMeaning": "Tôi đã giải thích lý do đi muộn với thầy giáo.", "tags": "Học tập"
    },
    {
        "word": "予定", "kana": "よてい", "kanji": "予定", "romaji": "yotei",
        "meaning": "Dự định, kế hoạch", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "明日の午後は打ち合わせの予定があります。", "exampleRomaji": "Ashita no gogo wa uchiawase no yotei ga arimasu.",
        "exampleMeaning": "Chiều mai tôi có kế hoạch cuộc họp trao đổi.", "tags": "Công việc"
    },
    {
        "word": "経験", "kana": "けいけん", "kanji": "経験", "romaji": "keiken",
        "meaning": "Kinh nghiệm", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "日本での生活はとても良い経験になりました。", "exampleRomaji": "Nihon de no seikatsu wa totemo yoi keiken ni narimashita.",
        "exampleMeaning": "Cuộc sống ở Nhật Bản đã trở thành một trải nghiệm kinh nghiệm tuyệt vời.", "tags": "Công việc"
    },
    {
        "word": "事故", "kana": "じこ", "kanji": "事故", "romaji": "jiko",
        "meaning": "Tai nạn, sự cố", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "交通事故に遭わないように気をつけましょう。", "exampleRomaji": "Kōtsū jiko ni awanai yō ni ki o tsukemashō.",
        "exampleMeaning": "Chúng ta hãy chú ý để không gặp tai nạn giao thông.", "tags": "Giao thông"
    },
    {
        "word": "地震", "kana": "じしん", "kanji": "地震", "romaji": "jishin",
        "meaning": "Trận động đất", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "昨夜小さな地震がありました。", "exampleRomaji": "Sakuya chiisana jishin ga arimashita.",
        "exampleMeaning": "Đêm qua đã có một trận động đất nhỏ.", "tags": "Thời tiết"
    },
    {
        "word": "台風", "kana": "たいふう", "kanji": "台風", "romaji": "taifu",
        "meaning": "Cơn bão", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "台風が近づいているので風が強いです。", "exampleRomaji": "Taifū ga chikazukite iru node kaze ga tsuyoi desu.",
        "exampleMeaning": "Cơn bão đang đến gần nên gió rất mạnh.", "tags": "Thời tiết"
    },
    {
        "word": "景色", "kana": "けしき", "kanji": "景色", "romaji": "keshiki",
        "meaning": "Phong cảnh, cảnh trí", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "山頂からの景色が素晴らしいです。", "exampleRomaji": "Sanchō kara no keshiki ga subarashii desu.",
        "exampleMeaning": "Phong cảnh từ đỉnh núi tuyệt đẹp.", "tags": "Thời tiết"
    },
    {
        "word": "お土産", "kana": "おみやげ", "kanji": "お土産", "romaji": "omiyage",
        "meaning": "Quà lưu niệm, quà du lịch", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "旅行で家族にお土産を買いました。", "exampleRomaji": "Ryokō de kazoku ni omiyage o kaimashita.",
        "exampleMeaning": "Chuyến du lịch tôi đã mua quà lưu niệm cho gia đình.", "tags": "Giao tiếp"
    },
    {
        "word": "習慣", "kana": "しゅうかん", "kanji": "習慣", "romaji": "shuukan",
        "meaning": "Tập quán, thói quen", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "早起きは体に良い習慣です。", "exampleRomaji": "Hayaoki wa karada ni yoi shūkan desu.",
        "exampleMeaning": "Dậy sớm là một thói quen tốt cho cơ thể.", "tags": "Đời sống"
    },
    {
        "word": "文法", "kana": "ぶんぽう", "kanji": "文法", "romaji": "bunpou",
        "meaning": "Ngữ pháp", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "N4の文法をしっかり覚えましょう。", "exampleRomaji": "N4 no bunpō o shikkari oboemashō.",
        "exampleMeaning": "Hãy ghi nhớ thật chắc ngữ pháp N4 nhé.", "tags": "Học tập"
    },
    {
        "word": "発音", "kana": "はつおん", "kanji": "発音", "romaji": "hatsuon",
        "meaning": "Phát âm", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "彼女の日本語の発音はとても綺麗です。", "exampleRomaji": "Kanojo no Nihongo no hatsuon wa totemo kirei desu.",
        "exampleMeaning": "Phát âm tiếng Nhật của cô ấy rất chuẩn và hay.", "tags": "Học tập"
    },
    {
        "word": "意味", "kana": "いみ", "kanji": "意味", "romaji": "imi",
        "meaning": "Ý nghĩa", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "辞書で単語の意味を調べます。", "exampleRomaji": "Jisho de tango no imi o shirabemasu.",
        "exampleMeaning": "Tôi tra nghĩa của từ vựng trong từ điển.", "tags": "Học tập"
    },
    {
        "word": "趣味", "kana": "しゅみ", "kanji": "趣味", "romaji": "shumi",
        "meaning": "Sở thích", "partOfSpeech": "noun", "jlptLevel": "N4",
        "exampleJapanese": "私の趣味は音楽を聴くことです。", "exampleRomaji": "Watashi no shumi wa ongaku o kiku koto desu.",
        "exampleMeaning": "Sở thích của tôi là nghe nhạc.", "tags": "Đời sống"
    },

    # Adjectives N4
    {
        "word": "珍しい", "kana": "めずらしい", "kanji": "珍しい", "romaji": "mezurashii",
        "meaning": "Hiếm có, độc lạ", "partOfSpeech": "adjective", "jlptLevel": "N4",
        "exampleJapanese": "珍しい果物を食べました。", "exampleRomaji": "Mezurashii kudamono o tabemashita.",
        "exampleMeaning": "Tôi đã ăn một loại trái cây rất hiếm.", "tags": "Tính từ"
    },
    {
        "word": "素晴らしい", "kana": "すばらしい", "kanji": "素晴らしい", "romaji": "subarashii",
        "meaning": "Tuyệt vời, xuất sắc", "partOfSpeech": "adjective", "jlptLevel": "N4",
        "exampleJapanese": "素晴らしい演奏に拍手が送られました。", "exampleRomaji": "Subarashii ensō ni hakushu ga okoraremashita.",
        "exampleMeaning": "Màn trình diễn tuyệt vời đã nhận được tràng pháo tay.", "tags": "Cảm xúc,Tính từ"
    },
    {
        "word": "恥ずかしい", "kana": "はずかしい", "kanji": "恥ずかしい", "romaji": "hazukashii",
        "meaning": "E ngại, xấu hổ, ngượng ngùng", "partOfSpeech": "adjective", "jlptLevel": "N4",
        "exampleJapanese": "人前で間違えて恥ずかしかったです。", "exampleRomaji": "Hitomae de machigaete hazukashikatta desu.",
        "exampleMeaning": "Bị sai trước mặt mọi người tôi thấy rất xấu hổ.", "tags": "Cảm xúc,Tính từ"
    },
    {
        "word": "悲しい", "kana": "かなしい", "kanji": "悲しい", "romaji": "kanashii",
        "meaning": "Buồn bã, đau thương", "partOfSpeech": "adjective", "jlptLevel": "N4",
        "exampleJapanese": "悲しい映画を見て泣いてしまいました。", "exampleRomaji": "Kanashii eiga o mite naite shimaimashita.",
        "exampleMeaning": "Xem bộ phim buồn tôi đã lỡ khóc.", "tags": "Cảm xúc,Tính từ"
    },
    {
        "word": "厳しい", "kana": "きびしい", "kanji": "厳しい", "romaji": "kibishii",
        "meaning": "Nghiêm khắc, khắt khe", "partOfSpeech": "adjective", "jlptLevel": "N4",
        "exampleJapanese": "うちの先生は練習に厳しいです。", "exampleRomaji": "Uchi no sensei wa renshū ni kibishii desu.",
        "exampleMeaning": "Thầy giáo chúng tôi rất nghiêm khắc trong việc luyện tập.", "tags": "Công việc,Tính từ"
    },
    {
        "word": "熱心", "kana": "ねっしん", "kanji": "熱心", "romaji": "nesshin",
        "meaning": "Nhiệt tình, hăng hái", "partOfSpeech": "adjective", "jlptLevel": "N4",
        "exampleJapanese": "彼らは熱心に日本語を勉強しています。", "exampleRomaji": "Karera wa nesshin ni Nihongo o benkyō shite imasu.",
        "exampleMeaning": "Họ đang nhiệt tình học tiếng Nhật.", "tags": "Công việc,Tính từ"
    },
    {
        "word": "丁寧", "kana": "ていねい", "kanji": "丁寧", "romaji": "teinei",
        "meaning": "Lịch sự, tỉ mỉ, cẩn thận", "partOfSpeech": "adjective", "jlptLevel": "N4",
        "exampleJapanese": "丁寧な言葉遣いを心がけましょう。", "exampleRomaji": "Teinei na kotobazukai o kokorogakemashō.",
        "exampleMeaning": "Chúng ta hãy chú ý dùng cách nói lịch sự.", "tags": "Giao tiếp,Tính từ"
    },

    # Adverbs N4
    {
        "word": "かなり", "kana": "かなり", "kanji": "かなり", "romaji": "kanari",
        "meaning": "Kha khá, tương đối", "partOfSpeech": "adverb", "jlptLevel": "N4",
        "exampleJapanese": "今日の試験はかなり難しかったです。", "exampleRomaji": "Kyō no shiken wa kanari muzukashikatta desu.",
        "exampleMeaning": "Bài thi hôm nay tương đối khó.", "tags": "Giao tiếp"
    },
    {
        "word": "ずいぶん", "kana": "ずいぶん", "kanji": "ずいぶん", "romaji": "zuibun",
        "meaning": "Khá là, nhiều hơn tưởng tượng", "partOfSpeech": "adverb", "jlptLevel": "N4",
        "exampleJapanese": "しばらく見ないうちにずいぶん大きくなったね。", "exampleRomaji": "Shibaraku minai uchi ni zuibun ōkiku natta ne.",
        "exampleMeaning": "Mới một thời gian không gặp mà cháu đã lớn nhanh khá nhiều nhỉ.", "tags": "Giao tiếp"
    },
    {
        "word": "そろそろ", "kana": "そろそろ", "kanji": "そろそろ", "romaji": "sorosoro",
        "meaning": "Chuẩn bị, sắp sửa (đến lúc)", "partOfSpeech": "adverb", "jlptLevel": "N4",
        "exampleJapanese": "そろそろ失礼の時間です。", "exampleRomaji": "Sorosoro shitsurei no jikan desu.",
        "exampleMeaning": "Đã sắp đến lúc tôi xin phép phải xin ngắt lời/về rồi.", "tags": "Giao tiếp"
    },
    {
        "word": "やっと", "kana": "やっと", "kanji": "やっと", "romaji": "yatto",
        "meaning": "Cuối cùng thì cũng...", "partOfSpeech": "adverb", "jlptLevel": "N4",
        "exampleJapanese": "長い勉強を経てやっと合格しました！", "exampleRomaji": "Nagai benkyō o hete yatto gōkaku shimashita!",
        "exampleMeaning": "Trải qua thời gian dài học tập cuối cùng tôi cũng đỗ rồi!", "tags": "Học tập"
    },
    {
        "word": "はっきり", "kana": "はっきり", "kanji": "はっきり", "romaji": "hakkiri",
        "meaning": "Rõ ràng, rành rọt", "partOfSpeech": "adverb", "jlptLevel": "N4",
        "exampleJapanese": "自分の意見をはっきり言いましょう。", "exampleRomaji": "Jibun no iken o hakkiri iimashō.",
        "exampleMeaning": "Hãy nói rõ ràng ý kiến của bản thân.", "tags": "Giao tiếp"
    }
]

N3_VOCAB_ADDITIONS = [
    # Verbs N3
    {
        "word": "延期する", "kana": "えんきする", "kanji": "延期する", "romaji": "enki suru",
        "meaning": "Hoãn lại, gia hạn thời gian", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "雨のためスポーツ大会は来週に延期されました。", "exampleRomaji": "Ame no tame supōtsu taikai wa raishū ni enki saremashita.",
        "exampleMeaning": "Vì trời mưa nên đại hội thể thao đã bị hoãn sang tuần sau.", "tags": "Công việc,Động từ"
    },
    {
        "word": "期待する", "kana": "きたいする", "kanji": "期待する", "romaji": "kitai suru",
        "meaning": "Kỳ vọng, mong đợi", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "新商品のヒットを大きく期待しています。", "exampleRomaji": "Shinshōhin no hitto o ōkiku kitai shite imasu.",
        "exampleMeaning": "Chúng tôi kỳ vọng lớn vào sự bùng nổ thành công của sản phẩm mới.", "tags": "Cảm xúc,Động từ"
    },
    {
        "word": "応援する", "kana": "おうえんする", "kanji": "応援する", "romaji": "ouen suru",
        "meaning": "Cổ vũ, hỗ trợ, tiếp sức", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "地元チームを全力で応援します。", "exampleRomaji": "Jimoto chīmu o zenryoku de ōen shimasu.",
        "exampleMeaning": "Tôi cổ vũ hết mình cho đội bóng quê nhà.", "tags": "Giao tiếp,Động từ"
    },
    {
        "word": "尊敬する", "kana": "そんけいする", "kanji": "尊敬する", "romaji": "sonkei suru",
        "meaning": "Tôn trọng, kính trọng", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "彼のリサーチへの熱心さを深く尊敬しています。", "exampleRomaji": "Kare no risāchi e no nesshinsa o fukaku sonkei shite imasu.",
        "exampleMeaning": "Tôi rất kính trọng sự hăng hái nghiên cứu của anh ấy.", "tags": "Giao tiếp,Động từ"
    },
    {
        "word": "批判する", "kana": "ひはんする", "kanji": "批判する", "romaji": "hihan suru",
        "meaning": "Phê bình, chỉ trích", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "他人の意見を無闇に批判してはいけません。", "exampleRomaji": "Tanin no iken o muyami ni hihan shite wa ikemasen.",
        "exampleMeaning": "Không được chỉ trích ý kiến của người khác một cách bừa bãi.", "tags": "Công việc,Động từ"
    },
    {
        "word": "克服する", "kana": "こくふくする", "kanji": "克服する", "romaji": "kokufuku suru",
        "meaning": "Khắc phục, vượt qua (khó khăn)", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "弱点を克服して試験に合格した。", "exampleRomaji": "Jakuten o kokufuku shite shiken ni gōkaku shita.",
        "exampleMeaning": "Tôi đã khắc phục điểm yếu và thi đỗ.", "tags": "Học tập,Động từ"
    },
    {
        "word": "調整する", "kana": "ちょうせいする", "kanji": "調整する", "romaji": "chousei suru",
        "meaning": "Điều chỉnh, sắp xếp cho phù hợp", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "会議のスケジュールを全員の都合に合わせて調整する。", "exampleRomaji": "Kaigi no sukejūru o zen'in no tsugō ni awasete chōsei suru.",
        "exampleMeaning": "Điều chỉnh lịch họp phù hợp với thời gian của tất cả mọi người.", "tags": "Công việc,Động từ"
    },
    {
        "word": "提案する", "kana": "ていあんする", "kanji": "提案する", "romaji": "teian suru",
        "meaning": "Đề xuất, gợi ý kế hoạch", "partOfSpeech": "verb", "jlptLevel": "N3",
        "exampleJapanese": "新しいマーケティング案を上司に提案しました。", "exampleRomaji": "Atarashii māketingu an o jōshi ni teian shimashita.",
        "exampleMeaning": "Tôi đã đề xuất phương án marketing mới lên cấp trên.", "tags": "Công việc,Động từ"
    },

    # Nouns N3
    {
        "word": "結論", "kana": "けつろん", "kanji": "結論", "romaji": "ketsuron",
        "meaning": "Kết luận", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "議論を重ねて最終的な結論を出しました。", "exampleRomaji": "Giron o kasanete saishūteki na ketsuron o dashimashita.",
        "exampleMeaning": "Sau nhiều lần thảo luận chúng tôi đã đưa ra kết luận cuối cùng.", "tags": "Học tập"
    },
    {
        "word": "権利", "kana": "けんり", "kanji": "権利", "romaji": "kenri",
        "meaning": "Quyền lợi", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "すべての国民には発言の権利があります。", "exampleRomaji": "Subete no kokumin ni wa hatsugen no kenri ga arimasu.",
        "exampleMeaning": "Tất cả người dân đều có quyền tự do phát biểu.", "tags": "Công việc"
    },
    {
        "word": "義務", "kana": "ぎむ", "kanji": "義務", "romaji": "gimu",
        "meaning": "Nghĩa vụ", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "納税は国民の重要な義務の一つです。", "exampleRomaji": "Nōzei wa kokumin no jūyō na gimu no hitotsu desu.",
        "exampleMeaning": "Nộp thuế là một trong những nghĩa vụ quan trọng của công dân.", "tags": "Công việc"
    },
    {
        "word": "態度", "kana": "たいど", "kanji": "態度", "romaji": "taido",
        "meaning": "Thái độ, tác phong", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "仕事に対する真面目な態度が評価されました。", "exampleRomaji": "Shigoto ni taisuru majime na taido ga hyōka saremashita.",
        "exampleMeaning": "Thái độ nghiêm túc với công việc đã được đánh giá cao.", "tags": "Giao tiếp"
    },
    {
        "word": "目的", "kana": "もくてき", "kanji": "目的", "romaji": "mokuteki",
        "meaning": "Mục đích", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "日本へ留学する目的を明確にしましょう。", "exampleRomaji": "Nihon e ryūgaku suru mokuteki o meikaku ni shimashō.",
        "exampleMeaning": "Hãy làm rõ mục đích du học Nhật Bản của bạn.", "tags": "Học tập"
    },
    {
        "word": "結果", "kana": "けっか", "kanji": "結果", "romaji": "kekka",
        "meaning": "Kết quả", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "努力した結果、大きな成果が得られました。", "exampleRomaji": "Doryoku shita kekka, ōkina seika ga eraremashita.",
        "exampleMeaning": "Nhờ kết quả của sự nỗ lực, gặt hái được thành quả lớn.", "tags": "Học tập"
    },
    {
        "word": "環境", "kana": "かんきょう", "kanji": "環境", "romaji": "kankyou",
        "meaning": "Môi trường", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "地球の自然環境を守るための活動に参加する。", "exampleRomaji": "Chikyū no shizen kankyō o mamoru tame no katsudō ni sanka suru.",
        "exampleMeaning": "Tham gia vào các hoạt động bảo vệ môi trường tự nhiên của Trái Đất.", "tags": "Đời sống"
    },
    {
        "word": "責任", "kana": "せきにん", "kanji": "責任", "romaji": "sekinin",
        "meaning": "Trách nhiệm", "partOfSpeech": "noun", "jlptLevel": "N3",
        "exampleJapanese": "自分の行動には自分で責任を持たなければならない。", "exampleRomaji": "Jibun no kōdō ni wa jibun de sekinin o motanake reba nara nai.",
        "exampleMeaning": "Bản thân phải chịu trách nhiệm về hành động của mình.", "tags": "Công việc"
    },

    # Adjectives & Adverbs N3
    {
        "word": "慎重", "kana": "しんちょう", "kanji": "慎重", "romaji": "shinchou",
        "meaning": "Thận trọng, cẩn mật", "partOfSpeech": "adjective", "jlptLevel": "N3",
        "exampleJapanese": "重要な決定は慎重に行うべきだ。", "exampleRomaji": "Jūyō na kettei wa shinchō ni okonau beki da.",
        "exampleMeaning": "Các quyết định quan trọng nên được đưa ra một cách thận trọng.", "tags": "Tính từ,Giao tiếp"
    },
    {
        "word": "曖昧", "kana": "あいまい", "kanji": "曖昧", "romaji": "aimai",
        "meaning": "Mơ hồ, mập mờ, không rõ ràng", "partOfSpeech": "adjective", "jlptLevel": "N3",
        "exampleJapanese": "曖昧な返事ではなく、 YES か NO で答えてください。", "exampleRomaji": "Aimai na henji dewa naku, YES ka NO de kotaete kudasai.",
        "exampleMeaning": "Xin đừng trả lời mập mờ, hãy trả lời YES hay NO.", "tags": "Tính từ,Giao tiếp"
    },
    {
        "word": "深刻", "kana": "しんこく", "kanji": "深刻", "romaji": "shinkoku",
        "meaning": "Nghiêm trọng, trầm trọng", "partOfSpeech": "adjective", "jlptLevel": "N3",
        "exampleJapanese": "少子化は非常に深刻な社会問題です。", "exampleRomaji": "Shōshika wa hijō ni shinkoku na shakai mondai desu.",
        "exampleMeaning": "Tỷ lệ sinh giảm là một vấn đề xã hội vô cùng nghiêm trọng.", "tags": "Tính từ"
    },
    {
        "word": "恐らく", "kana": "おそらく", "kanji": "恐らく", "romaji": "osoraku",
        "meaning": "E rằng, có lẽ", "partOfSpeech": "adverb", "jlptLevel": "N3",
        "exampleJapanese": "恐らく明日は大雨になるでしょう。", "exampleRomaji": "Osoraku ashita wa ōame ni naru deshō.",
        "exampleMeaning": "E rằng ngày mai có lẽ sẽ có mưa to.", "tags": "Giao tiếp"
    },
    {
        "word": "事前に", "kana": "じぜんに", "kanji": "事前に", "romaji": "jizen ni",
        "meaning": "Trước, từ trước (chuẩn bị trước)", "partOfSpeech": "adverb", "jlptLevel": "N3",
        "exampleJapanese": "訪問する際は事前に連絡を入れてください。", "exampleRomaji": "Hōmon suru sai wa jizen ni renraku o irete kudasai.",
        "exampleMeaning": "Khi đến thăm xin vui lòng liên lạc trước.", "tags": "Công việc"
    }
]

def append_to_file(filepath, new_items, target_export_name):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found!")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = f"export const {target_export_name}: SeedVocab\\[\\] = \\["
    match = re.search(pattern, content)
    if not match:
        print(f"Could not find {target_export_name} in {filepath}")
        return

    # Convert python dict list to typescript objects
    ts_entries = []
    for item in new_items:
        tags_line = f',\n    "tags": "{item.get("tags", "")}"' if "tags" in item else ""
        ts = f"""  {{
    "word": "{item['word']}",
    "kana": "{item['kana']}",
    "kanji": "{item['kanji']}",
    "romaji": "{item['romaji']}",
    "meaning": "{item['meaning']}",
    "partOfSpeech": "{item['partOfSpeech']}",
    "jlptLevel": "{item['jlptLevel']}",
    "exampleJapanese": "{item['exampleJapanese']}",
    "exampleRomaji": "{item['exampleRomaji']}",
    "exampleMeaning": "{item['exampleMeaning']}"{tags_line}
  }}"""
        ts_entries.append(ts)

    insertion_text = "\n" + ",\n".join(ts_entries) + ",\n"

    # Insert right after the `export const VOCABULARY_N4: SeedVocab[] = [`
    pos = match.end()
    new_content = content[:pos] + insertion_text + content[pos:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Successfully appended {len(new_items)} new items to {target_export_name} in {filepath}")

if __name__ == "__main__":
    n4_path = os.path.abspath("prisma/seed-data/n4-data.ts")
    n3_path = os.path.abspath("prisma/seed-data/n3-data.ts")

    append_to_file(n4_path, N4_VOCAB_ADDITIONS, "VOCABULARY_N4")
    append_to_file(n3_path, N3_VOCAB_ADDITIONS, "VOCABULARY_N3")
