# -*- coding: utf-8 -*-
"""
Enrich GRAMMAR_N4 in prisma/seed-data/n4-data.ts
"""

import os
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

GRAMMAR_N4_FULL = [
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
        "commonMistakes": "Hai hành động phải do cùng một chủ thể thực hiện.",
        "examples": [
            {"japanese": "音楽を聞きながら勉強します。", "romaji": "Ongaku o kikinagara benkyou shimasu.", "meaning": "Tôi vừa nghe nhạc vừa học bài."},
            {"japanese": "歩きながら話しましょう。", "romaji": "Arukinagara hanashimashou.", "meaning": "Chúng ta hãy vừa đi dạo vừa nói chuyện nhé."}
        ]
    },
    {
        "title": "〜し、〜し (Liệt kê lý do)",
        "level": "N4",
        "meaning": "Vừa... lại vừa... / Vì... và vì...",
        "structure": "[Thể thông thường] + し、[Thể thông thường] + し",
        "commonMistakes": "Thường dùng để đưa ra nhiều lý do dẫn đến một kết luận.",
        "examples": [
            {"japanese": "この店は安いし、美味しいです。", "romaji": "Kono mise wa yasui shi, oishii desu.", "meaning": "Quán này vừa rẻ lại vừa ngon."},
            {"japanese": "雨も降っているし、お腹もすいたし、帰りましょう。", "romaji": "Ame mo futte iru shi, onaka mo suita shi, kaerimashou.", "meaning": "Trời vừa mưa lại vừa đói bụng, chúng ta về thôi."}
        ]
    },
    {
        "title": "〜ています (Trạng thái kết quả - Tự động từ)",
        "level": "N4",
        "meaning": "Đang trong trạng thái... (kết quả của tự động từ)",
        "structure": "[Tự động từ thể て] + います",
        "commonMistakes": "Dùng が chỉ đối tượng mang trạng thái (Ví dụ: 窓が開いています).",
        "examples": [
            {"japanese": "電気 lunatic ついています。", "romaji": "Denki ga tsuite imasu.", "meaning": "Đèn đang bật."},
            {"japanese": "電車のドアが開いています。", "romaji": "Densha no doa ga akite imasu.", "meaning": "Cửa tàu điện đang mở."}
        ]
    },
    {
        "title": "〜てあります (Trạng thái duy trì có mục đích)",
        "level": "N4",
        "meaning": "Đã được... sẵn (Tha động từ + てあります)",
        "structure": "[Tha động từ thể て] + あります",
        "commonMistakes": "Nhấn mạnh có người cố ý thực hiện hành động để chuẩn bị.",
        "examples": [
            {"japanese": "壁にカレンダーが貼ってあります。", "romaji": "Kabe ni karendaa ga hatte arimasu.", "meaning": "Lịch đã được treo sẵn trên tường."},
            {"japanese": "ホテルの部屋はもう予約してあります。", "romaji": "Hoteru no heya wa mou yoyaku shite arimasu.", "meaning": "Phòng khách sạn đã được đặt sẵn rồi."}
        ]
    },
    {
        "title": "〜ておきます (Làm sẵn / Chuẩn bị trước)",
        "level": "N4",
        "meaning": "Làm trước / Giữ nguyên trạng thái để chuẩn bị cho lần sau",
        "structure": "[Động từ thể て] + おきます",
        "commonMistakes": "Trong hội thoại ngắn gọn thường nói tắt là 〜ときます (V-tokimasu).",
        "examples": [
            {"japanese": "旅行の前にチケットを買っておきます。", "romaji": "Ryokou no mae ni chiketto o katte okimasu.", "meaning": "Trước chuyến đi tôi sẽ mua vé trước."},
            {"japanese": "窓を開けておいてください。", "romaji": "Mado o akete oite kudasai.", "meaning": "Hãy cứ để cửa sổ mở nhé."}
        ]
    },
    {
        "title": "〜意向形 (Thể Ý Định) & 〜と思っています",
        "level": "N4",
        "meaning": "Dự định làm gì... (Dự định đã ấp ủ từ trước)",
        "structure": "Nhóm 1: âm u -> ou | Nhóm 2: bỏ る + よう | する -> よう | くる -> こよう + と思っています",
        "commonMistakes": "〜と思う chỉ ý định tức thì, còn 〜と思っています chỉ ý định đã suy nghĩ từ trước.",
        "examples": [
            {"japanese": "週末は海へ行こうと思っています。", "romaji": "Shuumatsu wa umi e ikou to omotte imasu.", "meaning": "Tôi đang có dự định đi biển vào cuối tuần."},
            {"japanese": "将来、自分の công ty を作ろうと思っています。", "romaji": "Shourai, jibun no kaisha o tsukurou to omotte imasu.", "meaning": "Trong tương lai tôi dự định mở công ty riêng."}
        ]
    },
    {
        "title": "〜ほうがいい (Lời khuyên)",
        "level": "N4",
        "meaning": "Nên... / Không nên...",
        "structure": "Khuyên làm: [V-ta] + ほうがいい | Khuyên không làm: [V-nai] + ほうがいい",
        "commonMistakes": "Khuyên nên làm phải dùng thể Quá khứ V-た + ほうがいい (không dùng V-ru).",
        "examples": [
            {"japanese": "薬を飲んだほうがいいですよ。", "romaji": "Kusuri o nonda hou ga ii desu yo.", "meaning": "Bạn nên uống thuốc đi thì hơn."},
            {"japanese": "夜遅く一人で歩かないほうがいいです。", "romaji": "Yoru osoku hitori de arukanai hou ga ii desu.", "meaning": "Không nên đi bộ một mình lúc đêm muộn."}
        ]
    },
    {
        "title": "〜でしょう / 〜かもしれない (Dự đoán)",
        "level": "N4",
        "meaning": "Có lẽ... (70-80%) / Có thể... (50%)",
        "structure": "[Thể thông thường bỏ だ] + でしょう / かもしれない",
        "commonMistakes": "かもしれない biểu thị khả năng thấp hơn でしょう.",
        "examples": [
            {"japanese": "明日は雨が降るでしょう。", "romaji": "Ashita wa ame ga kuru deshou.", "meaning": "Có lẽ ngày mai trời sẽ mưa."},
            {"japanese": "彼はお腹が痛いのかもしれません。", "romaji": "Kare wa onaka ga itai no kamo shiremasen.", "meaning": "Có thể là anh ấy bị đau bụng."}
        ]
    },
    {
        "title": "〜命令形 & 禁止形 (Thể Mệnh Lệnh & Cấm Đoán)",
        "level": "N4",
        "meaning": "Hãy...! / Cấm không được...!",
        "structure": "Mệnh lệnh: Nhóm 1 u->e | Cấm đoán: [V-ru] + な",
        "commonMistakes": "Mang sắc thái rất mạnh, nam giới dùng trong khẩn cấp hoặc cổ vũ thể thao.",
        "examples": [
            {"japanese": "早く走れ！", "romaji": "Hayaku hashire!", "meaning": "Chạy nhanh lên!"},
            {"japanese": "ここに入るな！", "romaji": "Koko ni hairu na!", "meaning": "Cấm vào đây!"}
        ]
    },
    {
        "title": "〜とおりに (Làm theo đúng như...)",
        "level": "N4",
        "meaning": "Theo đúng như / Làm đúng theo...",
        "structure": "[V-ru / V-ta] + とおりに | [N] + のとおりに / どおりに",
        "commonMistakes": "N đi trực tiếp biến âm thành どおりに.",
        "examples": [
            {"japanese": "私が言ったとおりにやってみてください。", "romaji": "Watashi ga ittaとおりに yatte mite kudasai.", "meaning": "Hãy làm thử đúng như những gì tôi đã nói."},
            {"japanese": " meijisho どおりに組み立てます。", "romaji": "Setsumeisho doori ni kumetatemasu.", "meaning": "Lắp ráp đúng theo sách hướng dẫn."}
        ]
    },
    {
        "title": "〜あとで (Sau khi...)",
        "level": "N4",
        "meaning": "Sau khi làm A thì làm B",
        "structure": "[V-ta] + あとで | [N] + のあとで",
        "commonMistakes": "Động từ luôn ở thể quá khứ V-た (khác với てから).",
        "examples": [
            {"japanese": "仕事が終わったあとで、飲みに行きましょう。", "romaji": "Shigoto ga owatta ato de, nomi ni ikimashou.", "meaning": "Sau khi công việc kết thúc, chúng ta đi uống nước nhé."},
            {"japanese": "食事のあとで薬を飲みます。", "romaji": "Shokuji no ato de kusuri o nomimasu.", "meaning": "Tôi uống thuốc sau bữa ăn."}
        ]
    },
    {
        "title": "〜ば (Thể điều kiện)",
        "level": "N4",
        "meaning": "Nếu... thì...",
        "structure": "Nhóm 1 u->eba | Nhóm 2 -> rareba | Tính từ -i -> kereba | Tính từ -na/N -> nara",
        "commonMistakes": "Dùng cho giả định điều kiện cần để vế sau xảy ra.",
        "examples": [
            {"japanese": "安ければ買います。", "romaji": "Yasukereba kaimasu.", "meaning": "Nếu rẻ thì tôi sẽ mua."},
            {"japanese": "時間があれば行きたいです。", "romaji": "Jikan ga areba ikitai desu.", "meaning": "Nếu có thời gian tôi muốn đi."}
        ]
    },
    {
        "title": "〜ように (Mục đích) & 〜ようになる",
        "level": "N4",
        "meaning": "Để có thể... / Trở nên có thể...",
        "structure": "[V-khả năng / V-nai] + ように | [V-khả năng] + ようになる",
        "commonMistakes": "Vế trước ように dùng động từ không thể hiện ý chí (khả năng, triệt tiêu).",
        "examples": [
            {"japanese": "日本語が話せるように毎日練習しています。", "romaji": "Nihongo ga hanaseru you ni mainichi renshuu shite imasu.", "meaning": "Tôi luyện tập hàng ngày để có thể nói tiếng Nhật."},
            {"japanese": "最近、漢字が読めるようになりました。", "romaji": "Saikin, kanji ga yomeru you ni narimashita.", "meaning": "Dạo này tôi đã trở nên đọc được chữ Hán."}
        ]
    },
    {
        "title": "〜受身形 (Thể Bị Động)",
        "level": "N4",
        "meaning": "Bị / Được... (Bị động trực tiếp hoặc bị động quấy rầy)",
        "structure": "Nhóm 1 a+reru | Nhóm 2 rareru | kuru -> korareru | suru -> sareru",
        "commonMistakes": "Tác nhân gây hành động đi với trợ từ に.",
        "examples": [
            {"japanese": "先生にほめられました。", "romaji": "Sensei ni homeramashita.", "meaning": "Tôi đã được thầy giáo khen."},
            {"japanese": "雨に降られて濡れてしまいました。", "romaji": "Ame ni furarete nurete shimaimashita.", "meaning": "Tôi bị mắc mưa nên đã bị ướt mất rồi."}
        ]
    },
    {
        "title": "Danh từ hóa 〜の / 〜こと",
        "level": "N4",
        "meaning": "Việc... (Chuyển động từ thành danh từ)",
        "structure": "[V-ru] + の / こと",
        "commonMistakes": "Dùng の với cảm giác trực tiếp (thấy/nghe). Dùng こと với sở thích, khả năng.",
        "examples": [
            {"japanese": "私の趣味は写真を撮ることです。", "romaji": "Watashi no shumi wa shashin o toru koto desu.", "meaning": "Sở thích của tôi là chụp ảnh."},
            {"japanese": "彼が走っているのを見ました。", "romaji": "Kare ga hashitte iru no o mimashita.", "meaning": "Tôi đã nhìn thấy anh ấy đang chạy."}
        ]
    },
    {
        "title": "〜ので (Nguyên nhân khách quan)",
        "level": "N4",
        "meaning": "Bởi vì... (Lý do khách quan, lịch sự hơn から)",
        "structure": "[Thể thông thường] + ので (Na / N + なので)",
        "commonMistakes": "Không dùng câu mệnh lệnh hay rủ rê ở vế sau ので.",
        "examples": [
            {"japanese": "気分が悪いので、 sớm 帰ってもいいですか。", "romaji": "Kibun ga warui node, hayaku kaette mo ii desu ka.", "meaning": "Vì trong người không khỏe nên tôi xin phép về sớm được không ạ?"},
            {"japanese": "雨が降っているので、傘を持っていきます。", "romaji": "Ame ga furitte iru node, kasa o motte ikimasu.", "meaning": "Vì trời đang mưa nên tôi sẽ mang theo ô."}
        ]
    },
    {
        "title": "〜てしまう (Lỡ làm / Phối hợp hoàn thành)",
        "level": "N4",
        "meaning": "Lỡ... (tiếc nuối) / Đã hoàn thành xong...",
        "structure": "[V-te] + しまう",
        "commonMistakes": "Trong nói chuyện hay rút gọn thành 〜ちゃう / 〜じゃう.",
        "examples": [
            {"japanese": "宿題を忘れてしまいました。", "romaji": "Shukudai o wasurete shimaimashita.", "meaning": "Tôi lỡ quên mất bài tập về nhà rồi."},
            {"japanese": "この本はもう全部読んでしまいました。", "romaji": "Kono hon wa mou zenbu yonde shimaimashita.", "meaning": "Cuốn sách này tôi đã đọc xong toàn bộ rồi."}
        ]
    },
    {
        "title": "〜か / 〜かどうか (Câu hỏi lồng ghép)",
        "level": "N4",
        "meaning": "...hay không / Có... hay không",
        "structure": "Có từ hỏi: [V-thông thường] + か | Không từ hỏi: [V-thông thường] + かどうか",
        "commonMistakes": "Vế câu chứa か/かどうか đóng vai trò là một danh từ trong câu lớn.",
        "examples": [
            {"japanese": "彼が来るかどうか分かりません。", "romaji": "Kare ga kuru ka dou ka wakarimasen.", "meaning": "Tôi không biết liệu anh ấy có đến hay không."},
            {"japanese": "何時に入るか教えてください。", "romaji": "Nanji ni hairu ka oshiete kudasai.", "meaning": "Xin hãy chỉ cho tôi biết mấy giờ thì vào."}
        ]
    },
    {
        "title": "〜てみます (Thử làm gì)",
        "level": "N4",
        "meaning": "Làm thử xem sao...",
        "structure": "[V-te] + みます",
        "commonMistakes": "Diễn tả hành động mang tính trải nghiệm thử.",
        "examples": [
            {"japanese": "新しい服を着てみます。", "romaji": "Atarashii fuku o kite mimasu.", "meaning": "Tôi mặc thử bộ quần áo mới."},
            {"japanese": "日本料理を作ってみました。", "romaji": "Nihon ryouri o tsukutte mimashita.", "meaning": "Tôi đã nấu thử món ăn Nhật Bản."}
        ]
    },
    {
        "title": "〜ていただきます / くださいます (Cho - Nhận kính ngữ)",
        "level": "N4",
        "meaning": "Được ai đó làm cho... / Ai đó làm cho tôi...",
        "structure": "[Ai đó に] + [V-te] + いただきます | [Ai đó が] + [V-te] + くださいます",
        "commonMistakes": "Là dạng kính ngữ của てもらいます và てくれます.",
        "examples": [
            {"japanese": "先生に漢字を教えていただきました。", "romaji": "Sensei ni kanji o oshiete itadakamashita.", "meaning": "Tôi được thầy giáo dạy chữ Hán cho."},
            {"japanese": "部長が駅まで送ってくださいました。", "romaji": "Buchou ga eki made okutte kudasaimashita.", "meaning": "Trưởng phòng đã đưa tôi đến ga."}
        ]
    },
    {
        "title": "〜ために (Mục đích / Lý do)",
        "level": "N4",
        "meaning": "Để... (Mục đích ý chí) / Vì... (Nguyên nhân)",
        "structure": "[V-ru] + ために | [N] + のために",
        "commonMistakes": "Khác ように ở chỗ ために thể hiện ý chí quyết tâm cao của chủ thể.",
        "examples": [
            {"japanese": "家を買うために貯金しています。", "romaji": "Ie o kau tame ni chokin shite imasu.", "meaning": "Tôi tiết kiệm tiền để mua nhà."},
            {"japanese": "家族のために一生懸命働きます。", "romaji": "Kazoku no tame ni issho kensei hatarakimasu.", "meaning": "Tôi làm việc hết sức vì gia đình."}
        ]
    },
    {
        "title": "〜のに (Công dụng / Đánh giá)",
        "level": "N4",
        "meaning": "Dùng vào việc... / Đối với việc...",
        "structure": "[V-ru] + のに (使います / 便利です / 時間がかかります)",
        "commonMistakes": "Chỉ mục đích sử dụng công cụ hoặc thời gian/tiền bạc.",
        "examples": [
            {"japanese": "このハサミは紙を切るのに使います。", "romaji": "Kono hasami wa kami o kiru no ni tsukaimasu.", "meaning": "Cái kéo này dùng để cắt giấy."},
            {"japanese": "この辞書は勉強するのに便利です。", "romaji": "Kono jisho wa benkyou suru no ni benri desu.", "meaning": "Cuốn từ điển này rất tiện cho việc học."}
        ]
    },
    {
        "title": "〜そうだ (Trông có vẻ)",
        "level": "N4",
        "meaning": "Trông có vẻ... (Nhìn trực quan dự đoán)",
        "structure": "Tính từ -i bỏ い / Tính từ -na bỏ な + そうだ (Good: いい -> よさそうだ)",
        "commonMistakes": "Tránh nhầm với 〜そうです (nghe nói - giữ nguyên thể thông thường).",
        "examples": [
            {"japanese": "このケーキは美味しそうです。", "romaji": "Kono keeki wa oishisou desu.", "meaning": "Bánh này trông có vẻ ngon đấy."},
            {"japanese": "今にも雨が降りそうです。", "romaji": "Ima ni mo ame ga furisou desu.", "meaning": "Trời sắp sửa mưa đến nơi rồi."}
        ]
    },
    {
        "title": "〜すぎる (Quá mức)",
        "level": "N4",
        "meaning": "Quá... (Vượt quá giới hạn phù hợp)",
        "structure": "[V-masu bỏ masu] / [Adj-i bỏ i] / [Adj-na] + すぎる",
        "commonMistakes": "Thường mang nghĩa tiêu cực (quá nhiều, quá cay, quá đắt).",
        "examples": [
            {"japanese": "昨日お酒を飲みすぎました。", "romaji": "Kinou osake o nomisugimashita.", "meaning": "Hôm qua tôi đã uống quá nhiều rượu."},
            {"japanese": "この問題は難しすぎます。", "romaji": "Kono mondai wa muzukashisugimasu.", "meaning": "Câu hỏi này quá khó."}
        ]
    },
    {
        "title": "〜やすい / 〜にくい (Dễ / Khó làm)",
        "level": "N4",
        "meaning": "Dễ làm... / Khó làm...",
        "structure": "[V-masu bỏ masu] + やすい / にくい",
        "commonMistakes": "Biến thành tính từ đuôi い sau khi kết hợp.",
        "examples": [
            {"japanese": "このペンは書きやすいです。", "romaji": "Kono pen wa kakiyasui desu.", "meaning": "Cây bút này rất dễ viết."},
            {"japanese": "彼の話は分かりにくいです。", "romaji": "Kare no hanashi wa wakarinikui desu.", "meaning": "Lời nói của anh ấy rất khó hiểu."}
        ]
    },
    {
        "title": "〜ばあい (Trường hợp...)",
        "level": "N4",
        "meaning": "Trong trường hợp...",
        "structure": "[Thể thông thường] + 場合 (Na + な / N + の)",
        "commonMistakes": "Dùng trong thông báo, hướng dẫn giả định tình huống xảy ra.",
        "examples": [
            {"japanese": "火事の場合は、エレベーターを使わないでください。", "romaji": "Kaji no baai wa, erebeetaa o tsukawanai de kudasai.", "meaning": "Trong trường hợp có hỏa hoạn, xin đừng sử dụng thang máy."},
            {"japanese": "間に合わない場合は連絡してください。", "romaji": "Ma ni awanai baai wa renraku shite kudasai.", "meaning": "Trong trường hợp không kịp giờ thì hãy liên lạc nhé."}
        ]
    },
    {
        "title": "〜のに (Thế mà / Bất mãn)",
        "level": "N4",
        "meaning": "Mặc dù... thế mà... (Bất ngờ, thất vọng)",
        "structure": "[Thể thông thường] + のに (Na / N + なのに)",
        "commonMistakes": "Vế 2 thể hiện sự trái ngược hoàn toàn với kỳ vọng ở vế 1.",
        "examples": [
            {"japanese": "一生懸命勉強したのに、試験に落ちてしまいました。", "romaji": "Isshoukenmei benkyou shita no ni, shiken ni ochite shimaimashita.", "meaning": "Mặc dù đã học hành chăm chỉ thế mà lại bị trượt kỳ thi."},
            {"japanese": "約束したのに、彼は来なかった。", "romaji": "Yakusoku shita no ni, kare wa konakatta.", "meaning": "Đã hứa rồi thế mà anh ấy không đến."}
        ]
    },
    {
        "title": "〜ところ (Thời điểm thực hiện)",
        "level": "N4",
        "meaning": "Sắp làm / Đang làm / Vừa làm xong",
        "structure": "Sắp làm: [V-ru] ところ | Đang làm: [V-te iru] ところ | Vừa xong: [V-ta] ところ",
        "commonMistakes": "Chỉ thời điểm chính xác tính theo từng giây/phút.",
        "examples": [
            {"japanese": "今からご飯を食べるところです。", "romaji": "Ima kara gohan o taberu tokoro desu.", "meaning": "Bây giờ tôi chuẩn bị ăn cơm đây."},
            {"japanese": "たった今帰ってきたところです。", "romaji": "Tatta ima kaette kita tokoro desu.", "meaning": "Tôi vừa mới về đến nơi xong."}
        ]
    }
]

def update_n4_grammar():
    filepath = "prisma/seed-data/n4-data.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    ts_json = json.dumps(GRAMMAR_N4_FULL, ensure_ascii=False, indent=2)
    new_def = f"export const GRAMMAR_N4: SeedGrammar[] = {ts_json};"
    
    pattern = r"export const GRAMMAR_N4\s*(?::\s*SeedGrammar\[\])?\s*=\s*\[.*?\];"
    new_content = re.sub(pattern, new_def, content, flags=re.DOTALL)
    
    if new_content == content:
        print("WARNING: Regex match failed! Content was not modified.")
    else:
        print("SUCCESS: Regex match succeeded!")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated GRAMMAR_N4 in {filepath} with {len(GRAMMAR_N4_FULL)} grammar points.")

if __name__ == "__main__":
    update_n4_grammar()

