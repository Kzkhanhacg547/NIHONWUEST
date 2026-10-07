# -*- coding: utf-8 -*-
"""
Enrich GRAMMAR_N4 and GRAMMAR_N3 in prisma/seed-data/
"""

import os
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

GRAMMAR_N3_FULL = [
    {
        "title": "〜に関して / 〜に関する (ni kanshite)",
        "level": "N3",
        "meaning": "Về... / Liên quan đến... — Dùng trong văn viết hoặc tình huống trang trọng",
        "structure": "[Danh từ] + に関して / [Danh từ] + に関する + [Danh từ]",
        "commonMistakes": "Trang trọng hơn 〜について. Đứng trước danh từ phải dùng 〜に関する.",
        "examples": [
            {"japanese": "環境問題に関して、論文を書きました。", "romaji": "Kankyou mondai ni kanshite, ronbun o kakimashita.", "meaning": "Tôi đã viết một luận văn liên quan đến vấn đề môi trường."},
            {"japanese": "この事件に関する情報をお持ちの方はご連絡ください。", "romaji": "Kono jiken ni kansuru jouhou o omochi no kata wa gorenraku kudasai.", "meaning": "Ai có thông tin liên quan đến vụ án này xin vui lòng liên hệ."}
        ]
    },
    {
        "title": "〜に対して / 〜に対する (ni taishite)",
        "level": "N3",
        "meaning": "Đối với... / Ngược lại với... — Biểu thị thái độ đối ứng hoặc so sánh tương phản",
        "structure": "[Danh từ] + に対して / [Danh từ] + に対する + [Danh từ]",
        "commonMistakes": "Phân biệt với 〜にとって (đứng trên lập trường đánh giá). Đối với người/đối tượng tiếp nhận hành vi dùng 〜に対して.",
        "examples": [
            {"japanese": "お客様に対して、丁寧な言葉を使いましょう。", "romaji": "Okyakusama ni taishite, teinei na kotoba o tsukaimashou.", "meaning": "Đối với khách hàng, hãy sử dụng lời lẽ lịch sự."},
            {"japanese": "兄が活発なのに対して、弟はおとなしいです。", "romaji": "Ani ga kappatsu na no ni taishite, otouto wa otonashii desu.", "meaning": "Trái ngược với anh trai rất năng động, em trai lại rất trầm tính."}
        ]
    },
    {
        "title": "〜にとって (ni totte)",
        "level": "N3",
        "meaning": "Đối với... / Đứng trên lập trường của... — Đưa ra quan điểm, đánh giá",
        "structure": "[Danh từ (chỉ người/tổ chức)] + にとって",
        "commonMistakes": "Vế sau là câu đánh giá (quan trọng, khó khăn, có ích...), không đi với hành động trực tiếp.",
        "examples": [
            {"japanese": "現代人にとって、スマートフォンは必需品です。", "romaji": "Gendaijin ni totte, sumaatofon wa hitsujuuhin desu.", "meaning": "Đối với người hiện đại, điện thoại thông minh là vật dụng thiết yếu."},
            {"japanese": "私にとって家族は一番大切な存在です。", "romaji": "Watashi ni totte kazoku wa ichiban taisetsu na sonzai desu.", "meaning": "Đối với tôi, gia đình là sự tồn tại quan trọng nhất."}
        ]
    },
    {
        "title": "〜わけにはいかない (wake ni wa ikanai)",
        "level": "N3",
        "meaning": "Không thể... (vì đạo đức, lương tâm, trách nhiệm xã hội)",
        "structure": "[Động từ thể từ điển / thể ない] + わけにはいかない",
        "commonMistakes": "Không dùng cho việc bất khả thi về mặt thể chất/năng lực (khác với thể khả năng).",
        "examples": [
            {"japanese": "明日は大事な会議があるから、休むわけにはいかない。", "romaji": "Ashita wa daiji na kaigi ga aru kara, yasumu wake ni wa ikanai.", "meaning": "Ngày mai có cuộc họp quan trọng nên tôi không thể nghỉ được."},
            {"japanese": "大切な約束だから、行かないわけにはいかない。", "romaji": "Taisetsu na yakusoku da kara, ikanai wake ni wa ikanai.", "meaning": "Vì là lời hứa quan trọng nên tôi không thể không đi (buộc phải đi)."}
        ]
    },
    {
        "title": "〜わけがない (wake ga nai)",
        "level": "N3",
        "meaning": "Tuyệt đối không thể nào... / Làm sao có chuyện...",
        "structure": "[Thể thông thường (Na な / N の)] + わけがない",
        "commonMistakes": "Biểu thị sự phủ định mạnh mẽ dựa trên lý do logic xác đáng.",
        "examples": [
            {"japanese": "あんなに真面目な彼が嘘をつくわけがない。", "romaji": "Anna ni majime na kare ga uso o tsuku wake ga nai.", "meaning": "Người nghiêm túc như anh ấy tuyệt đối không thể nào nói dối."},
            {"japanese": "こんな難しい問題、小学生にできるわけがない。", "romaji": "Konna muzukashii mondai, shougakusei ni dekiru wake ga nai.", "meaning": "Đề khó thế này thì học sinh tiểu học làm sao mà làm được."}
        ]
    },
    {
        "title": "〜わけではない (wake dewa nai)",
        "level": "N3",
        "meaning": "Không hẳn là... / Không nhất thiết là...",
        "structure": "[Thể thông thường (Na な / N の/な)] + わけではない",
        "commonMistakes": "Phủ định một phần, dùng khi không muốn khẳng định 100%.",
        "examples": [
            {"japanese": "日本語が嫌いなわけではないが、漢字が苦手だ。", "romaji": "Nihongo ga kirai na wake dewa nai ga, kanji ga nigate da.", "meaning": "Không hẳn là tôi ghét tiếng Nhật, mà là tôi kém chữ Hán."},
            {"japanese": "高い料理が必ずしも美味しいわけではない。", "romaji": "Takai ryouri ga kanarazushimo oishii wake dewa nai.", "meaning": "Món ăn đắt tiền không nhất thiết lúc nào cũng ngon."}
        ]
    },
    {
        "title": "〜に違いない (ni chigainai)",
        "level": "N3",
        "meaning": "Chắc chắn là... / Không thể sai được — Phán đoán chắc nịch của người nói",
        "structure": "[Thể thông thường (Na / N không だ)] + に違いない",
        "commonMistakes": "Biểu thị niềm tin mang tính trực giác hoặc suy đoán cá nhân rất cao.",
        "examples": [
            {"japanese": "電気がついているから、部屋に誰かいるに違いない。", "romaji": "Denki ga tsuite iru kara, heya ni dareka iru ni chigainai.", "meaning": "Đèn đang bật nên chắc chắn có ai đó trong phòng."},
            {"japanese": "これだけの努力をしたのだから、合格するに違いない。", "romaji": "Koredake no doryoku o shita no da kara, goukaku suru ni chigainai.", "meaning": "Đã nỗ lực đến mức này thì chắc chắn sẽ đỗ thôi."}
        ]
    },
    {
        "title": "〜はずだ (hazu da)",
        "level": "N3",
        "meaning": "Chắc chắn là... (dựa trên căn cứ, logic, lịch trình)",
        "structure": "[Thể thông thường (Na な / N の)] + はずだ",
        "commonMistakes": "Dựa trên chứng cứ khách quan, khác với に違いない vốn mang tính trực giác chủ quan hơn.",
        "examples": [
            {"japanese": "彼は日本に5年も住んでいたから、日本語が上手なはずだ。", "romaji": "Kare wa Nihon ni go-nen mo sunde ita kara, Nihongo ga jouzu na hazu da.", "meaning": "Anh ấy đã sống ở Nhật tận 5 năm nên chắc chắn tiếng Nhật rất giỏi."},
            {"japanese": "約束の時間だから、もうすぐ到着するはずです。", "romaji": "Yakusoku no jikan da kara, mousugu touchaku suru hazu desu.", "meaning": "Đến giờ hẹn rồi nên chắc chắn sẽ đến nơi ngay thôi."}
        ]
    },
    {
        "title": "〜たとたん（に） (ta totan ni)",
        "level": "N3",
        "meaning": "Vừa mới... thì ngay lập tức...",
        "structure": "[Động từ thể た] + とたん（に）",
        "commonMistakes": "Vế sau là hành động bất ngờ ngoài dự kiến, không đi với câu mệnh lệnh hay ý chí.",
        "examples": [
            {"japanese": "窓を開けたとたん、冷たい風が入ってきた。", "romaji": "Mado o aketa totan, tsumetai kaze ga haitte kita.", "meaning": "Vừa mới mở cửa sổ ra thì ngay lập tức cơn gió lạnh ùa vào."},
            {"japanese": "疲れていたので、ベッドに入ったとたんに眠ってしまった。", "romaji": "Tsukarete ita node, beddo ni haitta totan ni nemutte shimatta.", "meaning": "Vì quá mệt nên vừa đặt lưng xuống giường là tôi ngủ thiếp đi."}
        ]
    },
    {
        "title": "〜うちに (uchi ni)",
        "level": "N3",
        "meaning": "Trong lúc... / Nhân lúc còn... (trước khi trạng thái thay đổi)",
        "structure": "[V-dict / V-nai / V-teiru / I-adj / Na-adj な / N の] + うちに",
        "commonMistakes": "Làm gì đó trước khi cơ hội trôi qua (nhân lúc còn nóng, nhân lúc còn trẻ...).",
        "examples": [
            {"japanese": "温かいうちに、どうぞ召し上がってください。", "romaji": "Atatakai uchi ni, douzo meshiagatte kudasai.", "meaning": "Nhân lúc món ăn còn ấm nóng, xin mời bạn dùng ngay."},
            {"japanese": "日本にいるうちに、富士山に登ってみたい。", "romaji": "Nihon ni iru uchi ni, Fujisan ni nobotte mitai.", "meaning": "Trong lúc còn ở Nhật, tôi muốn thử leo núi Phú Sĩ."}
        ]
    },
    {
        "title": "〜わりに（は） (wari ni wa)",
        "level": "N3",
        "meaning": "So với... thì... (bất ngờ, kết quả không tương xứng với mức độ chuẩn)",
        "structure": "[Thể thông thường (Na な / N の)] + わりに（は）",
        "commonMistakes": "Dùng để diễn tả sự ngạc nhiên vì thực tế lệch so với định mức chung.",
        "examples": [
            {"japanese": "この店は値段が安いのわりに、とても美味しい。", "romaji": "Kono mise wa nedan ga yasui no wari ni, totemo oishii.", "meaning": "Quán này so với giá thành rẻ thì ăn rất ngon."},
            {"japanese": "彼はあまり勉強しなかったわりには、いい点数を取った。", "romaji": "Kare wa amari benkyou shinakatta wari ni wa, ii tensuu o totta.", "meaning": "So với việc ít học bài thì anh ấy đã đạt điểm khá tốt."}
        ]
    },
    {
        "title": "〜くせに (kuse ni)",
        "level": "N3",
        "meaning": "Thế mà lại... / Mặc dù... (mang hàm ý trách móc, khinh miệt, mỉa mai)",
        "structure": "[Thể thông thường (Na な / N の)] + くせに",
        "commonMistakes": "Chỉ dùng để phê phán người khác, không dùng cho bản thân mình.",
        "examples": [
            {"japanese": "自分では何もしないくせに、文句ばかり言う。", "romaji": "Jibun dewa nani mo shinai kuse ni, monku bakari iu.", "meaning": "Bản thân chẳng làm gì thế mà suốt ngày chỉ biết cằn nhằn."},
            {"japanese": "知っているくせに、教えてくれない。", "romaji": "Shitte iru kuse ni, oshiete kurenai.", "meaning": "Rõ ràng là biết thế mà lại không thèm chỉ cho tôi."}
        ]
    },
    {
        "title": "〜おそれがある (osore ga aru)",
        "level": "N3",
        "meaning": "E rằng... / Có nguy cơ... (xảy ra sự việc xấu)",
        "structure": "[V-dict / V-nai / N の] + おそれがある",
        "commonMistakes": "Dùng trong bản tin thời sự, dự báo thời tiết hoặc cảnh báo rủi ro.",
        "examples": [
            {"japanese": "大雨の影響で、土砂崩れが起きるおそれがあります。", "romaji": "Ooame no eikyou de, doshakuzure ga okiru osore ga arimasu.", "meaning": "Do ảnh hưởng của mưa lớn, có nguy cơ xảy ra sạt lở đất."},
            {"japanese": "このまま放置すると、病気が悪化するおそれがある。", "romaji": "Kono mama houchi suru to, byouki ga akka suru osore ga aru.", "meaning": "Nếu cứ để mặc thế này e rằng bệnh tình sẽ trầm trọng hơn."}
        ]
    },
    {
        "title": "〜をはじめ（として） (o hajime to shite)",
        "level": "N3",
        "meaning": "Trước tiên phải kể đến... / Tiêu biểu là...",
        "structure": "[Danh từ] + をはじめ / をはじめとする + [Danh từ]",
        "commonMistakes": "Đưa ra ví dụ tiêu biểu nhất trong một tập hợp.",
        "examples": [
            {"japanese": "日本には富士山をはじめ、美しい自然がたくさんある。", "romaji": "Nihon ni wa Fujisan o hajime, utsukushii shizen ga takusan aru.", "meaning": "Ở Nhật Bản có rất nhiều cảnh sắc thiên nhiên tươi đẹp, tiêu biểu nhất là núi Phú Sĩ."},
            {"japanese": "校長先生をはじめ、先生方に心から感謝いたします。", "romaji": "Kouchou-sensei o hajime, senseigata ni kokoro kara kansha itashimasu.", "meaning": "Tôi xin chân thành cảm ơn các thầy cô giáo, trước hết là thầy hiệu trưởng."}
        ]
    },
    {
        "title": "〜にともなって / 〜とともに (ni tomonatte)",
        "level": "N3",
        "meaning": "Cùng với... thì... cũng biến đổi theo",
        "structure": "[Động từ thể từ điển / Danh từ] + にともなって",
        "commonMistakes": "Vế trước biến đổi kéo theo vế sau biến đổi theo.",
        "examples": [
            {"japanese": "人口の増加にともなって、ゴミ問題も深刻化している。", "romaji": "Jinkou no zouka ni tomonatte, gomi mondai mo shinkokuka shite iru.", "meaning": "Cùng với sự gia tăng dân số, vấn đề rác thải cũng ngày càng nghiêm trọng."},
            {"japanese": "経済の発展とともに、人々の生活様式も変わった。", "romaji": "Keizai no hatten to tomo ni, hitobito no seikatsu youshiki mo kawatta.", "meaning": "Cùng với sự phát triển kinh tế, phong cách sống của người dân cũng thay đổi."}
        ]
    },
    {
        "title": "〜たびに (tabi ni)",
        "level": "N3",
        "meaning": "Cứ mỗi lần... lại...",
        "structure": "[V-dict / N の] + たびに",
        "commonMistakes": "Mỗi khi sự việc A xảy ra thì sự việc B luôn luôn lặp lại.",
        "examples": [
            {"japanese": "この曲を聴くたびに、学生時代を思い出す。", "romaji": "Kono kyoku o kiku tabi ni, gakusei jidai o omoidasu.", "meaning": "Cứ mỗi lần nghe khúc nhạc này tôi lại nhớ về thời học sinh."},
            {"japanese": "旅行のたびに、たくさんのお土産を買ってしまいます。", "romaji": "Ryokou no tabi ni, takusan no omiyage o katte shimaimasu.", "meaning": "Cứ mỗi lần đi du lịch tôi lại mua cả đống quà lưu niệm."}
        ]
    },
    {
        "title": "〜っぱなし (ppanashi)",
        "level": "N3",
        "meaning": "Cứ để nguyên như thế (không làm hành động tiếp theo cần thiết)",
        "structure": "[V-masu bỏ ます] + っぱなし",
        "commonMistakes": "Thường mang hàm ý tiêu cực, phê phán việc bất cẩn (để cửa mở, để nước chảy...).",
        "examples": [
            {"japanese": "テレビをつけっぱなしで寝てしまった。", "romaji": "Terebi o tsukeppanashi de nette shimatta.", "meaning": "Tôi đã ngủ quên mà cứ để ti vi bật nguyên như thế."},
            {"japanese": "ドアを開けっぱなしにしないでください。", "romaji": "Doa o akeppanashi ni shinaide kudasai.", "meaning": "Xin đừng để cửa mở toang như thế."}
        ]
    },
    {
        "title": "〜っぽい (ppoi)",
        "level": "N3",
        "meaning": "Có vẻ... / Mang cảm giác... / Hay...",
        "structure": "[V-masu bỏ ます / N / I-adj bỏ い] + っぽい",
        "commonMistakes": "Hay đi với màu sắc (trắng trắng), tính cách (dễ giận: 怒りっぽい), hoặc tính chất (trẻ con: 子供っぽい).",
        "examples": [
            {"japanese": "彼は大人なのに、話し方が子供っぽい。", "romaji": "Kare wa otona na no ni, hanashikata ga kodomoppoi.", "meaning": "Anh ấy là người lớn rồi mà cách nói chuyện cứ trẻ con thế nào ấy."},
            {"japanese": "最近、忘れっぽくなって困っている。", "romaji": "Saikin, wasureppoku natte komatte iru.", "meaning": "Dạo này tôi hay quên quá, thật là phiền toái."}
        ]
    },
    {
        "title": "〜気味 (gimi)",
        "level": "N3",
        "meaning": "Hơi có cảm giác... / Hơi có triệu chứng...",
        "structure": "[V-masu bỏ ます / N] + 気味",
        "commonMistakes": "Chỉ dùng cho trạng thái tâm lý hoặc thể trạng tiêu cực tạm thời (hơi sốt: 風邪気味, hơi mệt: 疲れ気味).",
        "examples": [
            {"japanese": "今日は風邪気味なので、早めに帰宅します。", "romaji": "Kyou wa kaze gimi na node, hayame ni kitaku shimasu.", "meaning": "Hôm nay tôi hơi có triệu chứng cảm cúm nên sẽ về nhà sớm."},
            {"japanese": "最近仕事が忙しくて、少し疲れ気味です。", "romaji": "Saikin shigoto ga isogashikute, sukoshi tsukare gimi desu.", "meaning": "Dạo này công việc bận rộn nên tôi hơi có vẻ mệt mỏi."}
        ]
    },
    {
        "title": "〜切る / 〜切れない (kiru / kirenai)",
        "level": "N3",
        "meaning": "Làm hết sạch hoàn toàn / Không thể làm xuể",
        "structure": "[V-masu bỏ ます] + 切る / 切れない",
        "commonMistakes": "Biểu thị hành động đạt đến giới hạn tận cùng hoặc hết sạch không còn sót lại.",
        "examples": [
            {"japanese": "長い小説をやっと読み切りました。", "romaji": "Nagai shousetsu o yatto yomikirimashita.", "meaning": "Cuối cùng tôi cũng đọc hết sạch cuốn tiểu thuyết dài."},
            {"japanese": "料理が多すぎて、全部は食べ切れません。", "romaji": "Ryouri ga oosugite, zenbu wa tabekiremasen.", "meaning": "Thức ăn nhiều quá, tôi không thể ăn hết xuể được."}
        ]
    },
    {
        "title": "〜かねる (kaneru)",
        "level": "N3",
        "meaning": "Khó lòng mà... / Không thể... (từ chối lịch sự trong kinh doanh)",
        "structure": "[V-masu bỏ ます] + かねる",
        "commonMistakes": "Dùng trong văn phong dịch vụ/kinh doanh để từ chối khéo.",
        "examples": [
            {"japanese": "そのご要望には応じかねます。", "romaji": "Sono goyoubou ni wa oujikanemasu.", "meaning": "Yêu cầu đó của quý khách chúng tôi khó lòng có thể đáp ứng được."},
            {"japanese": "個人情報はお教えいたしかねます。", "romaji": "Kojin jouhou wa ooshie itashikanemasu.", "meaning": "Thông tin cá nhân chúng tôi không thể cung cấp được ạ."}
        ]
    },
    {
        "title": "〜かねない (kanenai)",
        "level": "N3",
        "meaning": "Có nguy cơ... / Có khả năng sẽ dẫn đến (kết quả xấu)",
        "structure": "[V-masu bỏ ます] + かねない",
        "commonMistakes": "Cảnh báo một hậu quả tiêu cực có thể xảy ra nếu tiếp tục duy trì trạng thái.",
        "examples": [
            {"japanese": "スピードを出しすぎると、事故を起こしかねない。", "romaji": "Supiido o dashisugiru to, jiko o okoshikanenai.", "meaning": "Nếu đi quá nhanh thì rất có nguy cơ gây tai nạn đấy."},
            {"japanese": "無理を続けると、病気になりかねませんよ。", "romaji": "Muri o tsuzukeru to, byouki ni narikanemasen yo.", "meaning": "Nếu cứ làm việc quá sức liên tục thì rất có thể sẽ phát bệnh đấy."}
        ]
    },
    {
        "title": "〜どころではない (dokoro dewa nai)",
        "level": "N3",
        "meaning": "Không phải là lúc để... / Không còn tâm trí đâu mà...",
        "structure": "[V-dict / N] + どころではない",
        "commonMistakes": "Hoàn cảnh cấp bách/bận rộn đến mức không thể làm việc khác được.",
        "examples": [
            {"japanese": "試験の前日だから、遊んでいるどころではない。", "romaji": "Shiken no zenjitsu da kara, asonde iru dokoro dewa nai.", "meaning": "Hôm nay là ngày trước hôm thi rồi, không phải lúc để rong chơi đâu."},
            {"japanese": "風邪で高熱が出て、食事どころではなかった。", "romaji": "Kaze de kounetsu ga dete, shokuji dokoro dewa nakatta.", "meaning": "Bị cảm sốt cao nên tôi chẳng còn tâm trí đâu mà ăn uống nữa."}
        ]
    },
    {
        "title": "〜一方だ (ippou da)",
        "level": "N3",
        "meaning": "Ngày càng... / Càng lúc càng... (theo một chiều hướng liên tục)",
        "structure": "[Động từ thể từ điển] + 一方だ",
        "commonMistakes": "Thường đi kèm với các động từ biến đổi như 増える, 減る, 悪化する...",
        "examples": [
            {"japanese": "不景気で、失業率は増える一方だ。", "romaji": "Fukeiki de, hitsugyouritsu wa fueru ippou da.", "meaning": "Do kinh tế suy thoái, tỷ lệ thất nghiệp càng lúc càng tăng."},
            {"japanese": "スマートフォンの利用者は増加する一方です。", "romaji": "Sumaatofon no riyousha wa zouka suru ippou desu.", "meaning": "Số lượng người dùng điện thoại thông minh ngày một tăng lên."}
        ]
    },
    {
        "title": "〜によって / 〜による (ni yotte)",
        "level": "N3",
        "meaning": "Do / Bởi / Bằng cách / Tùy theo...",
        "structure": "[Danh từ] + によって / による + [Danh từ]",
        "commonMistakes": "Có 4 nghĩa chính: tác giả câu bị động, nguyên nhân, phương tiện cách thức, và sự khác biệt tùy theo đối tượng.",
        "examples": [
            {"japanese": "台風によって、多くの家が被害を受けた。", "romaji": "Taifuu ni yotte, ooku no ie ga higai o uketa.", "meaning": "Do cơn bão nên nhiều ngôi nhà đã bị thiệt hại."},
            {"japanese": "人によって考え方が違います。", "romaji": "Hito ni yotte kangaekata ga chigaimasu.", "meaning": "Tùy từng người mà cách suy nghĩ sẽ khác nhau."}
        ]
    },
    {
        "title": "〜を通じて / 〜を通して (o tsuujite)",
        "level": "N3",
        "meaning": "Thông qua / Suốt cả...",
        "structure": "[Danh từ] + を通じて / を通して",
        "commonMistakes": "Dùng cho trung gian phương tiện (thông qua bạn bè) hoặc thời gian (suốt cả năm).",
        "examples": [
            {"japanese": "ボランティア活動を通じて、たくさんの友人ができた。", "romaji": "Borantia katsudou o tsuujite, takusan no yuujin ga dekita.", "meaning": "Thông qua các hoạt động tình nguyện, tôi đã có thêm rất nhiều bạn bè."},
            {"japanese": "この地方は、一年を通じて温暖な気候です。", "romaji": "Kono chihou wa, ichinen o tsuujite ondan na kikou desu.", "meaning": "Vùng này suốt cả năm khí hậu đều ôn hòa ấm áp."}
        ]
    },
    {
        "title": "〜ざるを得ない (zaru o enai)",
        "level": "N3",
        "meaning": "Đành phải... / Buộc phải... (dù trong lòng không muốn)",
        "structure": "[V-nai bỏ ない] + ざるを得ない (する -> せざるを得ない)",
        "commonMistakes": "Hành động bất đắc dĩ do tình thế bắt buộc.",
        "examples": [
            {"japanese": "証拠が揃っているので、認めざるを得ない。", "romaji": "Shouko ga sorotte iru node, mitomezaru o enai.", "meaning": "Bằng chứng đã đầy đủ nên tôi đành phải thừa nhận."},
            {"japanese": "体調不良のため、旅行は中止せざるを得なかった。", "romaji": "Taichou furyou no tame, ryokou wa chuushi sezaru o enakatta.", "meaning": "Do sức khỏe không tốt nên tôi đành phải hủy chuyến du lịch."}
        ]
    }
]

def update_n3_grammar():
    filepath = "prisma/seed-data/n3-data.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    ts_json = json.dumps(GRAMMAR_N3_FULL, ensure_ascii=False, indent=2)
    # Replace GRAMMAR_N3 definition
    new_def = f"export const GRAMMAR_N3: SeedGrammar[] = {ts_json};"
    
    # Regex replace
    pattern = r"export const GRAMMAR_N3\s*(?::\s*SeedGrammar\[\])?\s*=\s*\[.*?\];"
    new_content = re.sub(pattern, new_def, content, flags=re.DOTALL)
    if new_content == content:
        print("WARNING: Regex match failed! Content was not modified.")
    else:
        print("SUCCESS: Regex match succeeded!")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated GRAMMAR_N3 in {filepath} with {len(GRAMMAR_N3_FULL)} grammar points.")

if __name__ == "__main__":
    update_n3_grammar()
