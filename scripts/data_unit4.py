# -*- coding: utf-8 -*-
"""
UNIT 4: THỂ NAI, TỪ ĐIỂN, THỂ TA, THỂ THƯỜNG & ĐỊNH NGỮ (10 Lessons, 15 Questions each = 150 Questions)
Minna Bài 17 - 25
"""

def get_unit4_lessons(q):
    lessons = []

    # 31. Minna Bài 17: Thể Nai & Xin đừng làm gì
    lessons.append((
        "minna-lesson-17-nai-form-prohibition",
        "Thể Nai (ない形) & Yêu Cầu Đừng Làm Gì (〜ないでください)",
        "Quy tắc biến đổi thể Nai cho 3 nhóm động từ và mẫu câu lịch sự khuyên ngăn, xin đừng làm gì.",
        [
            q("GRAMMAR", "Động từ Nhóm 1 chuyển sang thể Nai bằng quy tắc nào?", "Chuyển âm hàng [i] trước ます sang hàng [a] rồi thêm ない", "Bỏ ます thêm ない", "Chuyển sang hàng [u] thêm ない", "Chuyển sang hàng [o] thêm ない"),
            q("GRAMMAR", "Đặc biệt: Động từ Nhóm 1 kết thúc bằng âm [い] (như かいます) sang thể Nai là gì?", "かわない (đổi い thành わ rồi thêm ない)", "かあない", "かいらない", "かない"),
            q("GRAMMAR", "Chia thể Nai của động từ 'かきます' (viết):", "かかない (kakanai)", "かきない", "かくない", "かきてない"),
            q("GRAMMAR", "Chia thể Nai của động từ 'はなします' (nói):", "はなさない (hanasanai)", "はなしない", "はなすない", "はなしない"),
            q("GRAMMAR", "Động từ Nhóm 2 chia sang thể Nai bằng cách nào?", "Bỏ ます thêm ない (VD: たべます -> たべない)", "Chuyển sang hàng a", "Thêm らない", "Thêm わない"),
            q("GRAMMAR", "Chia thể Nai của động từ 'みます' (xem - Nhóm 2):", "みない (minai)", "まない", "みらない", "みてない"),
            q("GRAMMAR", "Động từ Nhóm 3: Thể Nai của 'きます' (đến) và 'します' (làm) là:", "こない (konai) và しない (shinai)", "きない và しない", "くない và しない", "こない và さない"),
            q("GRAMMAR", "Mẫu câu khuyên ai đó đừng làm gì một cách lịch sự:", "Động từ thể Nai + でください", "Động từ thể Nai + てください", "Động từ thể Masu + でください", "Động từ thể Te + でください"),
            q("GRAMMAR", "Dịch câu: 'Xin đừng quên hộ chiếu':", "パスポートを 忘れないでください。", "パスポートを 忘れてください。", "パスポートを 忘れなくてください。", "パスポートを 忘れないてください。"),
            q("GRAMMAR", "Dịch câu: 'Xin đừng chụp ảnh ở đây':", "ここで 写真を 撮らないでください。", "ここで 写真を 撮ってはいけません。", "ここで 写真を 撮らなくてください。", "ここで 写真を 撮りませんください。"),
            q("VOCABULARY", "Từ 'わすれます' (wasuremasu) có nghĩa là gì?", "Quên mất / Bỏ quên", "Nhớ ra", "Tìm kiếm", "Đánh mất"),
            q("VOCABULARY", "Từ 'なくします' (nakushimasu) có nghĩa là gì?", "Làm mất / Đánh rơi mất", "Nhặt được", "Giữ gìn", "Mua mới"),
            q("VOCABULARY", "Từ 'しんぱいします' (shinpaishimasu) có nghĩa là gì?", "Lo lắng / Bất an", "Vui vẻ", "Tức giận", "Bình thản"),
            q("VOCABULARY", "Từ 'たいせつ' (taisetsu) có nghĩa là gì?", "Quan trọng / Quý giá", "Bình thường", "Rẻ tiền", "Nguy hiểm"),
            q("VOCABULARY", "Từ 'あぶない' (abunai) có nghĩa là gì?", "Nguy hiểm!", "An toàn", "Tiện lợi", "Vui tươi"),
        ]
    ))

    # 32. Minna Bài 17-2: Nghĩa vụ & Không cần thiết
    lessons.append((
        "minna-lesson-17-obligation-permission",
        "Bắt Buộc Phải Làm (〜なければなりません) & Không Cần (〜なくてもいい)",
        "Diễn đạt nghĩa vụ trách nhiệm bắt buộc phải thực hiện và trường hợp thoải mái không cần làm.",
        [
            q("GRAMMAR", "Mẫu câu diễn đạt nghĩa vụ bắt buộc: 'Phải làm gì...':", "V(nai) bỏ い + ければなりません", "V(nai) + てはいけません", "V(te) + なければなりません", "V(masu) + ければなりません"),
            q("GRAMMAR", "Dịch câu: 'Hàng ngày tôi phải uống thuốc':", "毎日 薬を 飲まなければなりません。", "毎日 薬を 飲まないでください。", "毎日 薬を 飲んでもいいです。", "毎日 薬を 飲むべきです。"),
            q("GRAMMAR", "Dịch câu: 'Tôi phải nộp báo cáo trước ngày mai':", "明日までに レポートを 出さなければなりません。", "明日から レポートを 出さなければなりません。", "明日で レポートを 出さなければなりません。", "明日へ レポートを 出さなければなりません。"),
            q("GRAMMAR", "Trợ từ 'までに' trong hạn định nộp tài liệu có ý nghĩa là gì?", "Trước / Chậm nhất là vào thời điểm đó (Dead-line)", "Bắt đầu từ", "Suốt từ", "Đến tận"),
            q("GRAMMAR", "Mẫu câu: 'Không cần làm gì cũng được / Không phải làm':", "V(nai) bỏ い + くてもいいです", "V(nai) + てはいけません", "V(te) + もいいです", "V(nai) + でいいです"),
            q("GRAMMAR", "Dịch câu: 'Ngày mai là Chủ Nhật nên không cần phải dậy sớm':", "明日は 日曜日ですから、早く 起きなくてもいいです。", "明日は 日曜日ですから、早く 起きてはいけません。", "明日は 日曜日ですから、早く 起きないでください。", "明日は 日曜日ですから、早く 起きなければなりません。"),
            q("VOCABULARY", "Cụm từ 'くすりを のみます' (kusuri wo nomimasu) có nghĩa là gì?", "Uống thuốc", "Mua thuốc", "Bỏ thuốc", "Bôi thuốc"),
            q("VOCABULARY", "Từ 'ほけんしょう' (hokenshou) mang đi bệnh viện là giấy tờ gì?", "Thẻ bảo hiểm y tế", "Hộ chiếu", "Bằng lái xe", "Thẻ ngân hàng"),
            q("VOCABULARY", "Từ 'ねつ' (netsu) trong y tế có nghĩa là gì?", "Cơn sốt / Nhiệt độ cơ thể cao", "Cơn đau", "Cảm cúm", "Ho"),
            q("VOCABULARY", "Từ 'かぜ' (kaze) trong cụm 'かぜを ひきます' là bệnh gì?", "Cảm mạo / Cảm cúm", "Đau bụng", "Đau răng", "Gãy chân"),
            q("VOCABULARY", "Từ 'おふろに はいります' (ofuro ni hairimasu) có nghĩa là gì?", "Tắm bồn tắm nước nóng kiểu Nhật", "Rửa mặt", "Tắm mưa", "Bơi lội"),
            q("VOCABULARY", "Từ 'うわぎ' (uwagi) có nghĩa là gì?", "Áo khoác ngoài", "Áo lót", "Quần dài", "Đôi tất"),
            q("VOCABULARY", "Từ 'したぎ' (shitagi) có nghĩa là gì?", "Quần áo lót bên trong", "Áo khoác", "Khăn quàng", "Găng tay"),
            q("EXPRESSION", "Lời chúc sức khỏe dành cho người đang ốm: 'Mong bạn sớm bình phục, hãy giữ gìn nhé':", "お大事に (Odaiji ni)", "お疲れ様でした", "おめでとうございます", "ごちそうさまでした"),
            q("GRAMMAR", "Khi đưa tân ngữ lên làm chủ đề để nhấn mạnh (VD: Về chiếc thẻ bảo hiểm thì...):", "Dùng trợ từ は thay cho を (保険証は、持っていかなければなりません)", "Giữ nguyên trợ từ を", "Dùng trợ từ が", "Dùng trợ từ で"),
        ]
    ))

    # 33. Minna Bài 18: Thể Từ Điển & Khả năng
    lessons.append((
        "minna-lesson-18-dictionary-form-ability",
        "Thể Từ Điển (辞書形) & Mẫu Câu Khả Năng (〜ことができる)",
        "Dạng thức nguyên mẫu chuẩn từ điển của động từ và cách biểu đạt năng lực, khả năng có thể làm gì.",
        [
            q("GRAMMAR", "Thể từ điển (辞書形 - Jishokei) của động từ Nhóm 1 có đặc điểm gì?", "Chuyển các âm hàng [i] trước ます sang hàng [u] tương ứng", "Bỏ ます thêm る", "Chuyển sang hàng [a]", "Chuyển sang hàng [e]"),
            q("GRAMMAR", "Thể từ điển của 'かきます' (viết - Nhóm 1) là gì?", "かく (kaku)", "かきる", "かくる", "かか"),
            q("GRAMMAR", "Thể từ điển của 'のみます' (uống - Nhóm 1) là gì?", "のむ (nomu)", "のみる", "のまる", "のめる"),
            q("GRAMMAR", "Động từ Nhóm 2 chuyển sang thể từ điển bằng cách nào?", "Bỏ ます thêm る (VD: たべます -> たべる)", "Chuyển sang hàng [u]", "Bỏ ます thêm す", "Không đổi"),
            q("GRAMMAR", "Thể từ điển của động từ Nhóm 3 'きます' (đến) và 'します' (làm) là:", "くる (kuru) và する (suru)", "きる và しる", "こる và する", "くらす và すらす"),
            q("GRAMMAR", "Mẫu câu biểu đạt khả năng: 'Có thể làm được việc gì':", "V(thể từ điển) + ことが できます", "V(thể te) + ことが できます", "V(thể masu) + ことが できます", "V(thể nai) + ことが できます"),
            q("GRAMMAR", "Dịch câu: 'Tôi có thể nói được tiếng Nhật':", "私は 日本語を 話すことが できます。", "私は 日本語を 話して できます。", "私は 日本語を 話しますことが できます。", "私は 日本語を 話すで できます。"),
            q("GRAMMAR", "Nếu đi trực tiếp với Danh từ chỉ khả năng, cấu trúc là:", "[Danh từ] が できます (VD: ピアノが できます)", "[Danh từ] を できます", "[Danh từ] で できます", "[Danh từ] に できます"),
            q("GRAMMAR", "Dịch câu: 'Ở đây có thể thanh toán bằng thẻ tín dụng không?':", "ここで クレジットカードで 払うことが できますか？", "ここで クレジットカードを 払いますことが できますか？", "ここで クレジットカードに 払って できますか？", "ここで クレジットカードから 払うことが いいですか？"),
            q("VOCABULARY", "Động từ 'およぎます' (oyogimasu) có nghĩa là gì?", "Bơi lội", "Chạy bộ", "Leo núi", "Trượt tuyết"),
            q("VOCABULARY", "Động từ 'うたいます' (utaimasu) có nghĩa là gì?", "Hát ca", "Khiêu vũ", "Đàn piano", "Vẽ tranh"),
            q("VOCABULARY", "Động từ 'あつめます' (atsumemasu) có nghĩa là gì?", "Sưu tầm / Gom nhặt / Tập hợp", "Vứt bỏ", "Bán đi", "Làm mất"),
            q("VOCABULARY", "Động từ 'すてます' (sutemasu) có nghĩa là gì?", "Vứt rác / Bỏ đi", "Nhặt lên", "Giữ lại", "Mua"),
            q("VOCABULARY", "Động từ 'かえます' (kaemasu) trong trao đổi ngoại tệ có nghĩa là gì?", "Đổi (tiền) / Thay đổi", "Mua tiền", "Rút tiền", "Vay tiền"),
            q("VOCABULARY", "Động từ 'うんてんします' (untenshimasu) có nghĩa là gì?", "Lái xe cơ giới", "Đi bộ", "Đi nhờ", "Sửa xe"),
        ]
    ))

    # 34. Minna Bài 18-2: Sở thích & Trước khi làm gì
    lessons.append((
        "minna-lesson-18-hobbies-and-mae-ni",
        "Định Danh Hành Động (こと) & Trước Khi Làm Gì (〜まえに)",
        "Cách biến động từ thành cụm danh từ để giới thiệu sở thích và xác lập trình tự thời gian với [前に].",
        [
            q("GRAMMAR", "Để biến một động từ thành một danh từ (danh từ hóa), ta thêm từ gì sau thể từ điển?", "こと (koto) - việc làm gì", "もの", "ところ", "とき"),
            q("GRAMMAR", "Mẫu câu giới thiệu sở thích: 'Sở thích của tôi là...':", "私の趣味は [V thể từ điển + こと] です。", "私の趣味は [V ます] です。", "私の趣味は [V て] です。", "私の趣味は [V た] です。"),
            q("GRAMMAR", "Dịch câu: 'Sở thích của tôi là nghe nhạc':", "私の趣味は 音楽を 聴くことです。", "私の趣味は 音楽を 聴きますです。", "私の趣味は 音楽を 聴いてことです。", "私の趣味は 音楽を 聴くのです。"),
            q("GRAMMAR", "Cấu trúc: 'Trước khi làm hành động V':", "V(thể từ điển) + 前に (mae ni)", "V(thể ta) + 前に", "V(thể te) + 前に", "V(thể nai) + 前に"),
            q("GRAMMAR", "Dịch câu: 'Trước khi ăn cơm, tôi rửa tay':", "ごはんを 食べる前に、手を 洗います。", "ごはんを 食べた前に、手を 洗います。", "ごはんを 食べて前に、手を 洗います。", "ごはんを 食べます前に、手を 洗います。"),
            q("GRAMMAR", "Nếu đi kèm Danh từ, cấu trúc [Trước khi...] là gì?", "Danh từ + の + 前に (VD: 会議の前に)", "Danh từ + 前に", "Danh từ + で + 前に", "Danh từ + に + 前に"),
            q("GRAMMAR", "Nếu đi kèm Lượng từ thời gian (VD: 3 năm trước), ta có dùng 'の' không?", "Không dùng の (３年前に)", "Bắt buộc dùng の", "Dùng から", "Dùng まで"),
            q("VOCABULARY", "Động từ 'あらいます' (araimasu) có nghĩa là gì?", "Rửa (tay, mặt, bát đĩa)", "Lau chùi", "Quét dọn", "Vứt"),
            q("VOCABULARY", "Động từ 'いのります' (inorimasu) có nghĩa là gì?", "Cầu nguyện / Cầu chúc", "Hát", "Khóc", "Cười"),
            q("VOCABULARY", "Từ 'りょう' (ryou) dành cho sinh viên, công nhân là nơi nào?", "Ký túc xá", "Khách sạn", "Nhà riêng", "Chung cư cao cấp"),
            q("VOCABULARY", "Từ 'げんきん' (genkin) có nghĩa là loại tiền nào?", "Tiền mặt", "Thẻ tín dụng", "Chuyển khoản", "Tiền xu cổ"),
            q("VOCABULARY", "Từ 'ピアノ' (piano) đi với động từ nào để tạo thành 'chơi piano'?", "弾きます (ひきます / hikimasu)", "吹きます", "叩きます", "します"),
            q("VOCABULARY", "Từ 'ギター' (gitaa) có nghĩa là nhạc cụ gì?", "Đàn ghi ta", "Đàn piano", "Kèn trumpet", "Trống"),
            q("VOCABULARY", "Từ 'どうぶつ' (doubutsu) có nghĩa là gì?", "Động vật / Con vật", "Thực vật", "Côn trùng", "Con người"),
            q("VOCABULARY", "Từ 'なかなか' (nakanaka) đi kèm đuôi phủ định có ý nghĩa là:", "Mãi mà không... / Khó lòng mà...", "Rất dễ dàng", "Ngay lập tức", "Luôn luôn"),
        ]
    ))

    # 35. Minna Bài 19: Thể Ta & Kinh nghiệm từng trải
    lessons.append((
        "minna-lesson-19-ta-form-experience",
        "Thể Ta (た形) & Kinh Nghiệm Từng Trải (〜たことがある)",
        "Quy tắc chuyển đổi thể Ta (quá khứ thông thường) và mẫu câu chia sẻ trải nghiệm trong đời.",
        [
            q("GRAMMAR", "Quy tắc chuyển đổi từ thể Masu sang Thể Ta (た形) giống hệt với thể nào?", "Thể Te (て形) - chỉ cần thay [te/de] thành [ta/da]", "Thể Nai", "Thể Từ điển", "Thể Khả năng"),
            q("GRAMMAR", "Chia thể Ta của động từ 'たべます' (ăn):", "たべた (tabeta)", "たべった", "たべいだ", "たべました"),
            q("GRAMMAR", "Chia thể Ta của động từ 'いきます' (đi - ngoại lệ):", "いった (itta)", "いいた", "いきった", "いんだ"),
            q("GRAMMAR", "Chia thể Ta của động từ 'のみます' (uống):", "のんだ (nonda)", "のみた", "のった", "のいだ"),
            q("GRAMMAR", "Chia thể Ta của động từ 'かきます' (viết):", "かいた (kaita)", "かった", "かんだ", "かした"),
            q("GRAMMAR", "Mẫu câu nói về kinh nghiệm từng trải: 'Đã từng làm việc gì đó trong quá khứ':", "V(thể Ta) + ことが あります", "V(thể Te) + ことが あります", "V(thể Từ điển) + ことが あります", "V(thể Nai) + ことが あります"),
            q("GRAMMAR", "Dịch câu: 'Tôi đã từng leo núi Phú Sĩ':", "富士山に 登ったことが あります。", "富士山に 登ることが あります。", "富士山に 登ってことが あります。", "富士山を 登りましたことが あります。"),
            q("GRAMMAR", "Phủ định của mẫu câu kinh nghiệm: 'Tôi chưa từng làm... bao giờ':", "V(thể Ta) + ことが ありません / 一度もありません", "V(thể Ta) + ことが なかったです", "V(thể Nai) + ことが ありません", "V(thể Masen)"),
            q("GRAMMAR", "Dịch câu: 'Tôi chưa từng ăn sushi lần nào cả':", "一度も すしを 食べたことが ありません。", "一度 すしを 食べることが あります。", "一度も すしを 食べないことが あります。", "一度 すしを 食べましたことが ありません。"),
            q("VOCABULARY", "Động từ 'のぼります' (noborimasu) đi với núi (〜に のぼります) là gì?", "Leo lên / Trèo lên (núi)", "Xuống núi", "Ngắm núi", "Vẽ núi"),
            q("VOCABULARY", "Động từ 'とまります' (tomarimasu) đi với khách sạn (ホテルに〜) là gì?", "Nghỉ trọ lại / Trú lại qua đêm", "Dừng xe lại", "Xây khách sạn", "Đặt phòng"),
            q("VOCABULARY", "Động từ 'そうじします' (soujishimasu) có nghĩa là gì?", "Dọn dẹp / Quét dọn vệ sinh", "Nấu ăn", "Giặt đồ", "Đi dạo"),
            q("VOCABULARY", "Động từ 'せんたくします' (sentakushimasu) có nghĩa là gì?", "Giặt giũ quần áo", "Phơi đồ", "Gấp chăn", "Mua sắm"),
            q("VOCABULARY", "Từ 'おんせん' (onsen) là nét văn hóa nổi tiếng nào của Nhật?", "Suối nước khoáng nóng tự nhiên", "Bãi biển nhân tạo", "Hồ nước ngọt", "Công viên nước"),
            q("VOCABULARY", "Từ 'いちども' (ichidomo) đi với đuôi phủ định có nghĩa là:", "Một lần cũng chưa / Chưa từng bao giờ", "Một lần duy nhất", "Nhiều lần", "Thỉnh thoảng"),
        ]
    ))

    # 36. Minna Bài 19-2: Liệt kê hành động & Biến đổi trạng thái
    lessons.append((
        "minna-lesson-19-tari-tari-change",
        "Liệt Kê Hành Động Tiêu Biểu (〜たり〜たり) & Biến Đổi (〜になる)",
        "Liệt kê các hành động không theo thứ tự cố định và cách diễn đạt sự thay đổi của thời tiết, tính chất.",
        [
            q("GRAMMAR", "Mẫu câu liệt kê vài hành động tiêu biểu đại diện: 'Nào là làm V1, nào là làm V2...':", "V1(thể Ta)り、V2(thể Ta)り します", "V1(thể Te)、V2(thể Te) します", "V1 と V2 します", "V1(thể Nai)り、V2(thể Nai)り します"),
            q("GRAMMAR", "Khác biệt giữa Vて、Vて và Vたり、Vたり:", "Vて là chuỗi theo thứ tự thời gian; Vたり là liệt kê ngẫu nhiên đại diện trong số nhiều việc", "Cả hai hoàn toàn giống nhau", "Vたり chỉ dùng cho quá khứ", "Vて chỉ dùng cho tương lai"),
            q("GRAMMAR", "Dịch câu: 'Ngày nghỉ tôi thường đọc sách, nghe nhạc':", "休みの日は 本を 読んだり、音楽を 聴いたりします。", "休みの日は 本を 読んで、音楽を 聴きます。", "休みの日は 本を 読むこと、音楽を 聴くことです。", "休みの日は 本を 読んだと 音楽を 聴いたです。"),
            q("GRAMMAR", "Cấu trúc biến đổi trạng thái với Tính từ đuôi い: 'Trở nên...':", "Bỏ い + くなります (VD: さむい -> さむくなります)", "Thêm になります", "Thêm くなりますで", "Bỏ い thêm さになります"),
            q("GRAMMAR", "Dịch câu: 'Trời sắp trở nên lạnh rồi':", "寒くなります (samuku narimasu)。", "寒いになります。", "寒いで成ります。", "寒さになります。"),
            q("GRAMMAR", "Cấu trúc biến đổi trạng thái với Tính từ đuôi な và Danh từ:", "Bỏ な / Danh từ + に なります (VD: 元気になります / 医者になります)", "Thêm くなります", "Thêm で なります", "Thêm を なります"),
            q("GRAMMAR", "Dịch câu: 'Anh Yamada đã trở thành bác sĩ':", "山田さんは 医者に なりました。", "山田さんは 医者を なりました。", "山田さんは 医者く なりました。", "山田さんは 医者で なりました。"),
            q("VOCABULARY", "Từ 'ちょうし' (choushi) trong '体の調子' có nghĩa là gì?", "Tình trạng sức khỏe / Phong độ máy móc", "Cân nặng", "Chiều cao", "Tuổi tác"),
            q("VOCABULARY", "Từ 'ダイエット' (daietto) có nghĩa là gì?", "Chế độ ăn kiêng giảm cân (Diet)", "Tập thể hình", "Uống vitamin", "Chạy marathon"),
            q("VOCABULARY", "Từ 'だんだん' (dandan) diễn tả mức độ thay đổi như thế nào?", "Dần dần / Từng chút một", "Ngay lập tức", "Đột ngột", "Hoàn toàn"),
            q("VOCABULARY", "Từ 'おかげさまで' (okagesama de) mang ý nghĩa cảm tạ gì?", "Nhờ ơn trời / Nhờ bạn quan tâm giúp đỡ", "Xin lỗi bạn", "Chúc mừng bạn", "Tạm biệt bạn"),
            q("EXPRESSION", "Câu nâng ly khi bắt đầu bữa tiệc: 'Cạn ly / Chúc mừng!':", "乾杯！ (Kanpai!)", "いただきます！", "ごちそうさま！", "いらっしゃい！"),
            q("VOCABULARY", "Từ 'むり' (muri) trong '無理を しないでください' có nghĩa là gì?", "Quá sức / Vô lý / Cố gượng ép", "Lười biếng", "Nhanh chóng", "Vui vẻ"),
            q("VOCABULARY", "Từ 'ねむい' (nemui) có nghĩa là trạng thái nào?", "Buồn ngủ", "Đói bụng", "Mệt mỏi", "Khát nước"),
            q("VOCABULARY", "Từ 'つよい' (tsuyoi) có nghĩa là gì?", "Mạnh mẽ", "Yếu ớt", "Cao lớn", "Thấp bé"),
        ]
    ))

    # 37. Minna Bài 20: Thể Thông Thường
    lessons.append((
        "minna-lesson-20-plain-form",
        "Thể Thông Thường (普通形 - Futsuukei) & Đàm Thoại Thân Mật",
        "Chuyển đổi linh hoạt giữa thể Lịch sự (丁寧形) và thể Thông thường khi nói chuyện với bạn bè, người thân.",
        [
            q("GRAMMAR", "Thể thông thường (普通形) được dùng trong hoàn cảnh giao tiếp nào?", "Nói chuyện với bạn thân, gia đình, người dưới, hoặc viết nhật ký, bài luận", "Nói chuyện với sếp", "Phỏng vấn xin việc", "Giao tiếp với khách hàng"),
            q("GRAMMAR", "Dạng thông thường hiện tại khẳng định của động từ (VD: 食べます):", "Thể từ điển (食べる - taberu)", "Thể Ta", "Thể Nai", "Giữ nguyên ます"),
            q("GRAMMAR", "Dạng thông thường hiện tại phủ định của động từ (VD: 食べません):", "Thể Nai (食べない - tabenai)", "食べるない", "食べなかった", "食べた"),
            q("GRAMMAR", "Dạng thông thường quá khứ khẳng định của động từ (VD: 食べました):", "Thể Ta (食べた - tabeta)", "食べる", "食べない", "食べなかった"),
            q("GRAMMAR", "Dạng thông thường quá khứ phủ định của động từ (VD: 食べませんでした):", "V(nai) bỏ い + かった (食べなかった - tabenakatta)", "食べないでした", "食べたじゃない", "食べるなかった"),
            q("GRAMMAR", "Dạng thông thường của 'です' (khẳng định hiện tại của Danh từ/Tính từ đuôi な) là gì?", "だ (da)", "だった", "ではない", "で"),
            q("GRAMMAR", "Trong đàm thoại thân mật hàng ngày, trợ từ nghi vấn 'か' ở cuối câu thường được thay thế bằng gì?", "Lên giọng ở cuối câu (VD: 食べる？)", "Thêm chữ ね", "Thêm chữ よ", "Không đổi"),
            q("GRAMMAR", "Thể thông thường của '行きますか？' khi hỏi bạn bè thân mật là:", "行く？ (Iku?) - lên giọng", "行くか？", "行った？", "行かない？"),
            q("GRAMMAR", "Thể thông thường của 'はい' (Vâng) và 'いいえ' (Không) giữa bạn bè là:", "うん (ừ) và ううん (không)", "はい và いいえ", "ええ và いや", "そう và ちがう"),
            q("GRAMMAR", "Thể thông thường của 'きれいじゃありません' là gì?", "きれいじゃない (kirei janai)", "きれいではないです", "きれいじゃなかった", "きれいだない"),
            q("VOCABULARY", "Từ 'いりません' (không cần) sang thể thông thường là gì?", "いらない (iranai)", "いるない", "いらかった", "いりない"),
            q("VOCABULARY", "Động từ 'しらべます' (shirabemasu) có nghĩa là gì?", "Tra cứu / Điều tra / Tìm hiểu", "Sửa chữa", "Báo cáo", "Nói"),
            q("VOCABULARY", "Động từ 'なおします' (naoshimasu) có nghĩa là gì?", "Sửa chữa (hỏng hóc, lỗi sai)", "Phá vỡ", "Thay thế", "Lắp ráp"),
            q("VOCABULARY", "Từ 'こんど' (kondo) có nghĩa là dịp nào?", "Lần này / Lần tới / Sắp tới", "Lần trước", "Hôm qua", "Năm ngoái"),
            q("EXPRESSION", "Cách nói thân mật rủ rê bạn bè: 'Cùng đi nhé?':", "一緒に行かない？ / 行こう！", "一緒に行きますか？", "一緒に行きましょう！", "一緒に行ってください！"),
        ]
    ))

    # 38. Minna Bài 21: Bày tỏ ý kiến cá nhân & Tường thuật
    lessons.append((
        "minna-lesson-21-opinions-and-quotes",
        "Bày Tỏ Ý Kiến Cá Nhân (〜と思う) & Tường Thuật Lời Nói (〜と言った)",
        "Cách nêu nhận định [Tôi nghĩ rằng...] và dẫn lại phát ngôn của người khác một cách chính xác.",
        [
            q("GRAMMAR", "Trước cấu trúc bày tỏ ý kiến '[Tôi nghĩ rằng...] 〜と思います', ta phải dùng thể gì?", "Thể thông thường (普通形 - Futsuukei)", "Thể lịch sự ます", "Thể mệnh lệnh", "Thể Te"),
            q("GRAMMAR", "Dịch câu: 'Tôi nghĩ rằng ngày mai trời sẽ mưa':", "明日 雨が 降ると 思います。", "明日 雨が 降りますと 思います。", "明日 雨が 降ってと 思います。", "明日 雨が 降ると 考ます。"),
            q("GRAMMAR", "Khi bày tỏ sự đồng tình ý kiến: 'Tôi cũng nghĩ như vậy':", "私[も] そう 思います。", "私は そう 思わないです。", "私は そう 言いました。", "私も そう しました。"),
            q("GRAMMAR", "Mẫu câu tường thuật LỜI NÓI GIÁN TIẾP: '[Ai đó] đã nói rằng...':", "[Mệnh đề thể thông thường] + と 言いました", "[Mệnh đề thể masu] + と 言いました", "[Mệnh đề] + を 言いました", "[Mệnh đề] + に 言いました"),
            q("GRAMMAR", "Dịch câu: 'Anh Tanaka đã nói rằng tuần sau anh ấy bận':", "田中さんは 来週 忙しいと 言いました。", "田中さんは 来週 忙しいですと 言いました。", "田中さんは 来週 忙しくてと 言いました。", "田中さんは 来週 忙しいを 言いました。"),
            q("GRAMMAR", "Tường thuật LỜI NÓI TRỰC TIẾP (trích dẫn nguyên văn trong ngoặc kép):", "田中さんは「...」と 言いました。", "田中さんは「...」を 話しました。", "田中さんは「...」に 伝えました。", "田中さんは「...」で 言いました。"),
            q("GRAMMAR", "Câu hỏi xin ý kiến người khác: 'Bạn nghĩ thế nào về nước Nhật?':", "日本について どう 思いますか？", "日本を どう 思いますか？", "日本に なにを 思いますか？", "日本で どう 思いますか？"),
            q("GRAMMAR", "Cụm '〜について' (ni tsuite) có nghĩa là gì?", "Về vấn đề gì / Về đối tượng nào", "Đối với", "Bởi vì", "Trước khi"),
            q("VOCABULARY", "Động từ 'おもいます' (omoimasu) có nghĩa là gì?", "Nghĩ rằng / Cảm thấy là", "Nói", "Nghe", "Tin"),
            q("VOCABULARY", "Động từ 'いいます' (iimasu) có nghĩa là gì?", "Nói", "Hát", "Đọc", "Viết"),
            q("VOCABULARY", "Động từ 'かちます' (kachimasu) trong thi đấu thể thao là gì?", "Chiến thắng", "Thua cuộc", "Hòa nhau", "Bỏ cuộc"),
            q("VOCABULARY", "Động từ 'まけます' (makemasu) trong thi đấu thể thao là gì?", "Thua cuộc / Thất bại", "Chiến thắng", "Dẫn đầu", "Bị loại"),
            q("VOCABULARY", "Động từ 'やくにたちます' (yaku ni tachimasu) có nghĩa là gì?", "Có ích / Hữu dụng / Giúp ích được", "Vô dụng", "Làm phiền", "Gây khó khăn"),
            q("VOCABULARY", "Từ 'ほんとうに' (hontou ni) có nghĩa là gì?", "Thật sự / Quả thực là", "Có lẽ", "Hoàn toàn", "Không chắc"),
            q("VOCABULARY", "Từ 'たぶん' (tabun) biểu thị mức độ phỏng đoán như thế nào?", "Có lẽ / Có thể là (khoảng 70-80% chắc chắn)", "Chắc chắn 100%", "Không đời nào", "Tuyệt đối"),
        ]
    ))

    # 39. Minna Bài 22: Mệnh đề Bổ ngữ cho Danh từ (Định ngữ)
    lessons.append((
        "minna-lesson-22-noun-modification",
        "Mệnh Đề Bổ Ngữ Cho Danh Từ (Định Ngữ Trong Tiếng Nhật)",
        "Nắm chắc trật tự ngược trong tiếng Nhật: Mệnh đề bổ nghĩa LUÔN ĐỨNG TRƯỚC danh từ được bổ nghĩa.",
        [
            q("GRAMMAR", "Trong tiếng Nhật, mệnh đề bổ nghĩa đứng ở vị trí nào so với danh từ được bổ nghĩa?", "Luôn luôn đứng NGAY PHÍA TRƯỚC danh từ", "Đứng sau danh từ", "Đứng cuối câu", "Đứng đầu câu tách biệt"),
            q("GRAMMAR", "Động từ trong mệnh đề bổ nghĩa cho danh từ bắt buộc phải chia ở thể gì?", "Thể thông thường (普通形 - Futsuukei)", "Thể Masu", "Thể Te", "Thể Mệnh lệnh"),
            q("GRAMMAR", "Dịch cụm từ: 'Người đang đọc sách đằng kia':", "あそこで 本を 読んでいる人", "本を 読んでいます人", "人 あそこで 本を 読む", "あそこで 人は 本を 読みます"),
            q("GRAMMAR", "Dịch cụm từ: 'Chiếc bánh mà mẹ tôi đã làm':", "母が 作ったケーキ", "母は 作ったケーキ", "母を 作ったケーキ", "母で 作ったケーキ"),
            q("GRAMMAR", "LƯU Ý: Chủ ngữ bên trong MỆNH ĐỀ BỔ NGHĨA đi với trợ từ gì?", "Trợ từ が (ga) - không dùng は", "Trợ từ は", "Trợ từ を", "Trợ từ に"),
            q("GRAMMAR", "Dịch cụm từ: 'Bức tranh mà anh Miller đã vẽ':", "ミラーさんが 描いた絵", "ミラーさんは 描いた絵", "ミラーさんを 描いた絵", "ミラーさんで 描いた絵"),
            q("GRAMMAR", "Dịch câu: 'Đây là bức ảnh tôi đã chụp ở Kyoto':", "これは 京都で 撮った写真です。", "これは 京都で 撮りました写真です。", "これは 写真を 京都で 撮ったです。", "これは 京都の写真が 撮ったです。"),
            q("GRAMMAR", "Dịch câu: 'Tôi không có thời gian để xem tivi':", "テレビを 見る時間が ありません。", "テレビを 見ます時間が ありません。", "テレビを 見て時間が ありません。", "テレビを 見るのない時間です。"),
            q("GRAMMAR", "Dịch câu: 'Tôi có cuộc hẹn đi xem phim với bạn':", "友達と 映画を 見る約束が あります。", "友達と 映画を 見ます約束が あります。", "友達と 映画を 見て約束が あります。", "友達の 映画を 見る約束です。"),
            q("VOCABULARY", "Từ 'やくそく' (yakusoku) có nghĩa là gì?", "Cuộc hẹn / Lời hứa hẹn", "Bản hợp đồng", "Quy định", "Kế hoạch tương lai"),
            q("VOCABULARY", "Từ 'じかん' (jikan) trong '時間が ありません' là gì?", "Thời gian", "Tiền bạc", "Sức khỏe", "Cơ hội"),
            q("VOCABULARY", "Từ 'ようじ' (youji) có nghĩa là gì?", "Bận việc riêng / Công chuyện bận", "Đi du lịch", "Học tập", "Nghỉ ngơi"),
            q("VOCABULARY", "Động từ 'わたします' (watashimasu) có nghĩa là gì?", "Trao cho / Chuyển giao tận tay", "Cầm lấy", "Vứt đi", "Đánh rơi"),
            q("VOCABULARY", "Từ 'アパート' (apaato) có nghĩa là loại nhà ở nào?", "Căn hộ chung cư nhỏ / Phòng trọ", "Biệt thự", "Khách sạn", "Ký túc xá"),
            q("VOCABULARY", "Từ 'きもの' (kimono) là trang phục truyền thống của nước nào?", "Nhật Bản", "Hàn Quốc", "Việt Nam", "Trung Quốc"),
        ]
    ))

    # 40. Minna Bài 23 - 25: Khi nào, Điều kiện & Giả định
    lessons.append((
        "minna-lesson-23-25-conditionals",
        "Khi (〜とき), Điều Kiện Tự Nhiên (〜と) & Giả Định (〜たら・〜ても)",
        "Tổng hợp các dạng câu phức: Thời điểm diễn ra hành động, quy luật tất yếu và điều kiện giả định.",
        [
            q("GRAMMAR", "Cấu trúc: 'Khi làm hành động A thì B':", "[Thể thông thường] + とき (toki)", "[Thể Masu] + とき", "[Thể Te] + とき", "[Thể Mệnh lệnh] + とき"),
            q("GRAMMAR", "Phân biệt Vるとき và Vたとき: 'Trước khi qua đường thì nhìn trái nhìn phải':", "道を 渡るとき、左右を 見ます (Vるとき: việc qua đường chưa hoàn thành)", "道を 渡ったとき", "道を 渡りとき", "道を 渡ってとき"),
            q("GRAMMAR", "Dịch câu: 'Khi còn là trẻ con, tôi rất hay bơi ở sông':", "子どものとき、川で よく 泳ぎました。", "子どものに、川で よく 泳ぎました。", "子どもなとき、川で よく 泳ぎました。", "子どもだったときで、川で 泳ぎました。"),
            q("GRAMMAR", "Cấu trúc điều kiện hệ quả tự nhiên / chỉ đường: 'Hễ làm A thì tất yếu B xảy ra':", "V(thể từ điển) + と (VD: このボタンを 押すと、水が 出ます)", "V(thể Te) + と", "V(thể Ta) + と", "V(thể Nai) + と"),
            q("GRAMMAR", "Dịch câu chỉ đường: 'Rẽ phải ở ngã tư kia thì sẽ thấy ngân hàng ở bên trái':", "あの交差点を 右へ 曲がると、左に 銀行が あります。", "あの交差点を 右へ 曲がったら、銀行が あります。", "あの交差点を 右へ 曲がると、銀行へ 行ってください。", "あの交差点を 右へ 曲がれば、銀行を 見ます。"),
            q("GRAMMAR", "Cấu trúc giả định điều kiện 'NẾU... THÌ...':", "V(thể Ta) + ら (VD: 雨が 降ったら、行きません)", "V(thể Te) + ら", "V(thể Nai) + たら", "V(thể Masu) + たら"),
            q("GRAMMAR", "Dịch câu: 'Nếu ngày mai trời đẹp thì tôi sẽ đi dạo':", "明日 いい天気だったら、散歩します。", "明日 いい天気なら、散歩します。", "明日 いい天気と、散歩します。", "明日 いい天気でしたら、散歩します。"),
            q("GRAMMAR", "Cấu trúc: 'Cho dù / Dẫu có... thì vẫn...':", "V(thể Te) + も / Tính từ đuôi い bỏ い + くても", "V(thể Ta) + も", "V(thể Nai) + も", "V(thể Từ điển) + も"),
            q("GRAMMAR", "Dịch câu: 'Cho dù trời có mưa thì tôi vẫn đi đá bóng':", "雨が 降っても、サッカーを します。", "雨が 降ったら、サッカーを します。", "雨が 降ると、サッカーを します。", "雨が 降るでも、サッカーを します。"),
            q("VOCABULARY", "Từ 'こうさてん' (kousaten) có nghĩa là gì?", "Ngã tư đường giao nhau", "Cầu vượt", "Đường hầm", "Vỉa hè"),
            q("VOCABULARY", "Từ 'しんごう' (shingou) giao thông có nghĩa là gì?", "Đèn tín hiệu giao thông", "Biển báo tốc độ", "Vạch kẻ đường", "Trạm xăng"),
            q("VOCABULARY", "Động từ 'まがります' (magarimasu) đi với hướng rẽ là gì?", "Rẽ / Quẹo (trái, phải)", "Đi thẳng", "Quay đầu", "Dừng lại"),
            q("VOCABULARY", "Động từ 'わたります' (watarimasu) đi với cây cầu, con đường là gì?", "Băng qua / Vượt qua (cầu, đường)", "Đi dọc theo", "Đứng lại", "Nhìn ngắm"),
            q("VOCABULARY", "Từ 'まっすぐ' (massugu) trong chỉ đường có nghĩa là gì?", "Đi thẳng tắp", "Rẽ trái", "Rẽ phải", "Vòng tròn"),
            q("EXPRESSION", "Lời chào chúc mừng đám cưới hoặc đỗ đạt: 'Xin chúc mừng!':", "おめでとうございます！", "お大事に！", "お疲れ様でした！", "ご苦労様でした！"),
        ]
    ))

    return lessons
