export interface SeedKanji {
  character: string;
  meaning: string;
  strokeCount: number;
  jlptLevel: string;
  readings: Array<{ reading: string; type: "ONYOMI" | "KUNYOMI" }>;
}

export interface SeedVocab {
  word: string;
  kana: string;
  kanji: string | null;
  romaji: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: string;
  exampleJapanese: string;
  exampleRomaji: string;
  exampleMeaning: string;
  tags?: string;
}

export const KANJI_N5: SeedKanji[] = [
  {
    "character": "一",
    "meaning": "Một (Nhất)",
    "strokeCount": 1,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "イチ",
        "type": "ONYOMI"
      },
      {
        "reading": "ひと・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "二",
    "meaning": "Hai (Nhị)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ニ",
        "type": "ONYOMI"
      },
      {
        "reading": "ふた・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "三",
    "meaning": "Ba (Tam)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "サン",
        "type": "ONYOMI"
      },
      {
        "reading": "みっ・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "四",
    "meaning": "Bốn (Tứ)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シ",
        "type": "ONYOMI"
      },
      {
        "reading": "よん",
        "type": "KUNYOMI"
      },
      {
        "reading": "よっ・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "五",
    "meaning": "Năm (Ngũ)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゴ",
        "type": "ONYOMI"
      },
      {
        "reading": "いつ・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "六",
    "meaning": "Sáu (Lục)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ロク",
        "type": "ONYOMI"
      },
      {
        "reading": "むっ・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "七",
    "meaning": "Bảy (Thất)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シチ",
        "type": "ONYOMI"
      },
      {
        "reading": "なな・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "八",
    "meaning": "Tám (Bát)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ハチ",
        "type": "ONYOMI"
      },
      {
        "reading": "やっ・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "九",
    "meaning": "Chín (Cửu)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キュウ",
        "type": "ONYOMI"
      },
      {
        "reading": "ここの・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "十",
    "meaning": "Mười (Thập)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジュウ",
        "type": "ONYOMI"
      },
      {
        "reading": "とお",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "百",
    "meaning": "Trăm (Bách)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ヒャク",
        "type": "ONYOMI"
      },
      {
        "reading": "もも",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "千",
    "meaning": "Nghìn (Thiên)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セン",
        "type": "ONYOMI"
      },
      {
        "reading": "ち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "万",
    "meaning": "Mười nghìn (Vạn)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "マン",
        "type": "ONYOMI"
      },
      {
        "reading": "バン",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "円",
    "meaning": "Đồng Yên, Tròn (Viên)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "エン",
        "type": "ONYOMI"
      },
      {
        "reading": "まる・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "半",
    "meaning": "Nửa, Rưỡi (Bán)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ハン",
        "type": "ONYOMI"
      },
      {
        "reading": "なか・ば",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "日",
    "meaning": "Mặt trời, Ngày (Nhật)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ニチ",
        "type": "ONYOMI"
      },
      {
        "reading": "ジツ",
        "type": "ONYOMI"
      },
      {
        "reading": "ひ",
        "type": "KUNYOMI"
      },
      {
        "reading": "び",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "月",
    "meaning": "Mặt trăng, Tháng (Nguyệt)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゲツ",
        "type": "ONYOMI"
      },
      {
        "reading": "ガツ",
        "type": "ONYOMI"
      },
      {
        "reading": "つき",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "火",
    "meaning": "Lửa (Hỏa)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カ",
        "type": "ONYOMI"
      },
      {
        "reading": "ひ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "水",
    "meaning": "Nước (Thủy)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "スイ",
        "type": "ONYOMI"
      },
      {
        "reading": "みず",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "木",
    "meaning": "Cây gỗ (Mộc)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "モク",
        "type": "ONYOMI"
      },
      {
        "reading": "き",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "金",
    "meaning": "Vàng, Tiền (Kim)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キン",
        "type": "ONYOMI"
      },
      {
        "reading": "かね",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "土",
    "meaning": "Đất (Thổ)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ド",
        "type": "ONYOMI"
      },
      {
        "reading": "つち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "年",
    "meaning": "Năm (Niên)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ネン",
        "type": "ONYOMI"
      },
      {
        "reading": "とし",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "時",
    "meaning": "Giờ, Thời gian (Thời)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジ",
        "type": "ONYOMI"
      },
      {
        "reading": "とき",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "分",
    "meaning": "Phút, Phần, Hiểu (Phân)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "フン",
        "type": "ONYOMI"
      },
      {
        "reading": "わ・かる",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "今",
    "meaning": "Bây giờ, Hiện tại (Kim)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コン",
        "type": "ONYOMI"
      },
      {
        "reading": "いま",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "先",
    "meaning": "Trước, Tiên tiến (Tiên)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セン",
        "type": "ONYOMI"
      },
      {
        "reading": "さき",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "毎",
    "meaning": "Mỗi (Mỗi)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "マイ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "何",
    "meaning": "Cái gì, Mấy (Hà)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カ",
        "type": "ONYOMI"
      },
      {
        "reading": "なに",
        "type": "KUNYOMI"
      },
      {
        "reading": "なん",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "朝",
    "meaning": "Buổi sáng (Triều)",
    "strokeCount": 12,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "チョウ",
        "type": "ONYOMI"
      },
      {
        "reading": "あさ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "昼",
    "meaning": "Buổi trưa (Trú)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "チュウ",
        "type": "ONYOMI"
      },
      {
        "reading": "ひる",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "夜",
    "meaning": "Buổi tối, Ban đêm (Dạ)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ヤ",
        "type": "ONYOMI"
      },
      {
        "reading": "よる",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "夕",
    "meaning": "Chiều tà (Tịch)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セキ",
        "type": "ONYOMI"
      },
      {
        "reading": "ゆう",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "週",
    "meaning": "Tuần lễ (Chu)",
    "strokeCount": 11,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シュウ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "間",
    "meaning": "Khoảng giữa, Thời gian (Gian)",
    "strokeCount": 12,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カン",
        "type": "ONYOMI"
      },
      {
        "reading": "あいだ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "午",
    "meaning": "Ngọ, Trưa (Ngọ)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゴ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "人",
    "meaning": "Người (Nhân)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジン",
        "type": "ONYOMI"
      },
      {
        "reading": "ニン",
        "type": "ONYOMI"
      },
      {
        "reading": "ひと",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "男",
    "meaning": "Nam, Con trai (Nam)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ダン",
        "type": "ONYOMI"
      },
      {
        "reading": "おとこ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "女",
    "meaning": "Nữ, Con gái (Nữ)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジョ",
        "type": "ONYOMI"
      },
      {
        "reading": "おんな",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "子",
    "meaning": "Đứa trẻ (Tử)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シ",
        "type": "ONYOMI"
      },
      {
        "reading": "こ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "友",
    "meaning": "Bạn bè (Hữu)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ユウ",
        "type": "ONYOMI"
      },
      {
        "reading": "とも",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "父",
    "meaning": "Bố, Cha (Phụ)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "フ",
        "type": "ONYOMI"
      },
      {
        "reading": "ちち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "母",
    "meaning": "Mẹ (Mẫu)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ボ",
        "type": "ONYOMI"
      },
      {
        "reading": "はは",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "兄",
    "meaning": "Anh trai (Huynh)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ケイ",
        "type": "ONYOMI"
      },
      {
        "reading": "あに",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "弟",
    "meaning": "Em trai (Đệ)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ダイ",
        "type": "ONYOMI"
      },
      {
        "reading": "おとうと",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "姉",
    "meaning": "Chị gái (Tỷ)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シ",
        "type": "ONYOMI"
      },
      {
        "reading": "あね",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "妹",
    "meaning": "Em gái (Muội)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "マイ",
        "type": "ONYOMI"
      },
      {
        "reading": "いもうと",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "私",
    "meaning": "Tôi (Tư)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シ",
        "type": "ONYOMI"
      },
      {
        "reading": "わたし",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "家",
    "meaning": "Nhà, Gia đình (Gia)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カ",
        "type": "ONYOMI"
      },
      {
        "reading": "いえ",
        "type": "KUNYOMI"
      },
      {
        "reading": "うち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "族",
    "meaning": "Gia tộc, Bộ tộc (Tộc)",
    "strokeCount": 11,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゾク",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "口",
    "meaning": "Miệng, Cổng (Khẩu)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コウ",
        "type": "ONYOMI"
      },
      {
        "reading": "くち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "目",
    "meaning": "Mắt (Mục)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "モク",
        "type": "ONYOMI"
      },
      {
        "reading": "め",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "手",
    "meaning": "Tay (Thủ)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シュ",
        "type": "ONYOMI"
      },
      {
        "reading": "て",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "足",
    "meaning": "Chân (Túc)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ソク",
        "type": "ONYOMI"
      },
      {
        "reading": "あし",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "耳",
    "meaning": "Tai (Nhĩ)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジ",
        "type": "ONYOMI"
      },
      {
        "reading": "みみ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "力",
    "meaning": "Sức lực (Lực)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "リョク",
        "type": "ONYOMI"
      },
      {
        "reading": "ちから",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "上",
    "meaning": "Ở trên (Thượng)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジョウ",
        "type": "ONYOMI"
      },
      {
        "reading": "うえ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "下",
    "meaning": "Ở dưới (Hạ)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カ",
        "type": "ONYOMI"
      },
      {
        "reading": "した",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "中",
    "meaning": "Ở giữa, Trong (Trung)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "チュウ",
        "type": "ONYOMI"
      },
      {
        "reading": "なか",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "外",
    "meaning": "Bên ngoài (Ngoại)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ガイ",
        "type": "ONYOMI"
      },
      {
        "reading": "そと",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "左",
    "meaning": "Bên trái (Tả)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "サ",
        "type": "ONYOMI"
      },
      {
        "reading": "ひだり",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "右",
    "meaning": "Bên phải (Hữu)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ウ",
        "type": "ONYOMI"
      },
      {
        "reading": "みぎ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "前",
    "meaning": "Phía trước (Tiền)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゼン",
        "type": "ONYOMI"
      },
      {
        "reading": "まえ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "後",
    "meaning": "Phía sau (Hậu)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゴ",
        "type": "ONYOMI"
      },
      {
        "reading": "あと",
        "type": "KUNYOMI"
      },
      {
        "reading": "うし・ろ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "東",
    "meaning": "Phía Đông (Đông)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "トウ",
        "type": "ONYOMI"
      },
      {
        "reading": "ひがし",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "西",
    "meaning": "Phía Tây (Tây)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セイ",
        "type": "ONYOMI"
      },
      {
        "reading": "にし",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "南",
    "meaning": "Phía Nam (Nam)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ナン",
        "type": "ONYOMI"
      },
      {
        "reading": "みなみ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "北",
    "meaning": "Phía Bắc (Bắc)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ホク",
        "type": "ONYOMI"
      },
      {
        "reading": "きた",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "国",
    "meaning": "Đất nước, Quốc gia (Quốc)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コク",
        "type": "ONYOMI"
      },
      {
        "reading": "くに",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "町",
    "meaning": "Khu phố, Thị trấn (Đinh)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "チョウ",
        "type": "ONYOMI"
      },
      {
        "reading": "まち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "村",
    "meaning": "Làng thôn (Thôn)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ソン",
        "type": "ONYOMI"
      },
      {
        "reading": "むら",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "市",
    "meaning": "Thành phố (Thị)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シ",
        "type": "ONYOMI"
      },
      {
        "reading": "いち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "京",
    "meaning": "Kinh đô (Kinh)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キョウ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "校",
    "meaning": "Trường học (Hiệu)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コウ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "店",
    "meaning": "Cửa hàng, Tiệm (Điếm)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "テン",
        "type": "ONYOMI"
      },
      {
        "reading": "みせ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "駅",
    "meaning": "Nhà ga (Dịch)",
    "strokeCount": 14,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "エキ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "社",
    "meaning": "Công ty, Đền thần (Xã)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シャ",
        "type": "ONYOMI"
      },
      {
        "reading": "やしろ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "員",
    "meaning": "Thành viên, Nhân viên (Viên)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "イン",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "院",
    "meaning": "Bệnh viện, Viện (Viện)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "イン",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "室",
    "meaning": "Căn phòng (Thất)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シツ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "会",
    "meaning": "Gặp gỡ, Hội (Hội)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カイ",
        "type": "ONYOMI"
      },
      {
        "reading": "あ・う",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "学",
    "meaning": "Học tập (Học)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ガク",
        "type": "ONYOMI"
      },
      {
        "reading": "まな・ぶ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "生",
    "meaning": "Sinh viên, Sinh ra (Sinh)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セイ",
        "type": "ONYOMI"
      },
      {
        "reading": "い・きる",
        "type": "KUNYOMI"
      },
      {
        "reading": "う・まれる",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "本",
    "meaning": "Sách, Bản (Bản)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ホン",
        "type": "ONYOMI"
      },
      {
        "reading": "もと",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "文",
    "meaning": "Câu văn, Văn học (Văn)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ブン",
        "type": "ONYOMI"
      },
      {
        "reading": "ふみ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "字",
    "meaning": "Chữ cái (Tự)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "語",
    "meaning": "Ngôn ngữ, Tiếng (Ngữ)",
    "strokeCount": 14,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゴ",
        "type": "ONYOMI"
      },
      {
        "reading": "かた・る",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "山",
    "meaning": "Núi (Sơn)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "サン",
        "type": "ONYOMI"
      },
      {
        "reading": "やま",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "川",
    "meaning": "Sông (Xuyên)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セン",
        "type": "ONYOMI"
      },
      {
        "reading": "かわ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "田",
    "meaning": "Ruộng lúa (Điền)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "デン",
        "type": "ONYOMI"
      },
      {
        "reading": "た",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "天",
    "meaning": "Trời, Thiên nhiên (Thiên)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "テン",
        "type": "ONYOMI"
      },
      {
        "reading": "あめ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "気",
    "meaning": "Khí chất, Tâm trạng (Khí)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キ",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "雨",
    "meaning": "Mưa (Vũ)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ウ",
        "type": "ONYOMI"
      },
      {
        "reading": "あめ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "空",
    "meaning": "Bầu trời (Không)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "クウ",
        "type": "ONYOMI"
      },
      {
        "reading": "そら",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "花",
    "meaning": "Hoa (Hoa)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カ",
        "type": "ONYOMI"
      },
      {
        "reading": "はな",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "海",
    "meaning": "Biển (Hải)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "カイ",
        "type": "ONYOMI"
      },
      {
        "reading": "うみ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "車",
    "meaning": "Xe cộ, Ô tô (Xa)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シャ",
        "type": "ONYOMI"
      },
      {
        "reading": "くるま",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "電",
    "meaning": "Điện (Điện)",
    "strokeCount": 13,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "デン",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "道",
    "meaning": "Con đường (Đạo)",
    "strokeCount": 12,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ドウ",
        "type": "ONYOMI"
      },
      {
        "reading": "みち",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "犬",
    "meaning": "Con chó (Khuyển)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ケン",
        "type": "ONYOMI"
      },
      {
        "reading": "いぬ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "魚",
    "meaning": "Con cá (Ngư)",
    "strokeCount": 11,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ギョ",
        "type": "ONYOMI"
      },
      {
        "reading": "さかな",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "鳥",
    "meaning": "Con chim (Điểu)",
    "strokeCount": 11,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "チョウ",
        "type": "ONYOMI"
      },
      {
        "reading": "とり",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "行",
    "meaning": "Đi (Hành)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コウ",
        "type": "ONYOMI"
      },
      {
        "reading": "い・く",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "来",
    "meaning": "Đến (Lai)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ライ",
        "type": "ONYOMI"
      },
      {
        "reading": "く・る",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "帰",
    "meaning": "Trở về (Quy)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キ",
        "type": "ONYOMI"
      },
      {
        "reading": "かえ・る",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "食",
    "meaning": "Ăn (Thực)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ショク",
        "type": "ONYOMI"
      },
      {
        "reading": "た・べる",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "飲",
    "meaning": "Uống (Ẩm)",
    "strokeCount": 12,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "イン",
        "type": "ONYOMI"
      },
      {
        "reading": "の・む",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "見",
    "meaning": "Nhìn, Xem (Kiến)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ケン",
        "type": "ONYOMI"
      },
      {
        "reading": "み・る",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "聞",
    "meaning": "Nghe, Hỏi (Văn)",
    "strokeCount": 14,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ブン",
        "type": "ONYOMI"
      },
      {
        "reading": "き・く",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "読",
    "meaning": "Đọc sách (Độc)",
    "strokeCount": 14,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ドク",
        "type": "ONYOMI"
      },
      {
        "reading": "よ・む",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "書",
    "meaning": "Viết, Sách (Thư)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ショ",
        "type": "ONYOMI"
      },
      {
        "reading": "か・く",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "話",
    "meaning": "Nói chuyện (Thoại)",
    "strokeCount": 13,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ワ",
        "type": "ONYOMI"
      },
      {
        "reading": "はな・す",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "買",
    "meaning": "Mua sắm (Mãi)",
    "strokeCount": 12,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "バイ",
        "type": "ONYOMI"
      },
      {
        "reading": "か・う",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "休",
    "meaning": "Nghỉ ngơi (Hưu)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キュウ",
        "type": "ONYOMI"
      },
      {
        "reading": "やす・む",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "言",
    "meaning": "Nói (Ngôn)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ゲン",
        "type": "ONYOMI"
      },
      {
        "reading": "い・う",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "立",
    "meaning": "Đứng (Lập)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "リツ",
        "type": "ONYOMI"
      },
      {
        "reading": "た・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "入",
    "meaning": "Vào (Nhập)",
    "strokeCount": 2,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ニュウ",
        "type": "ONYOMI"
      },
      {
        "reading": "はい・る",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "出",
    "meaning": "Ra ngoài (Xuất)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シュツ",
        "type": "ONYOMI"
      },
      {
        "reading": "で・る",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "待",
    "meaning": "Chờ đợi (Đãi)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "タイ",
        "type": "ONYOMI"
      },
      {
        "reading": "ま・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "持",
    "meaning": "Cầm, Mang (Trì)",
    "strokeCount": 9,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ジ",
        "type": "ONYOMI"
      },
      {
        "reading": "も・つ",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "使",
    "meaning": "Sử dụng (Sử)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シ",
        "type": "ONYOMI"
      },
      {
        "reading": "つか・う",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "作",
    "meaning": "Chế tạo, Làm (Tác)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "サク",
        "type": "ONYOMI"
      },
      {
        "reading": "つく・る",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "教",
    "meaning": "Dạy học (Giáo)",
    "strokeCount": 11,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キョウ",
        "type": "ONYOMI"
      },
      {
        "reading": "おし・える",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "勉",
    "meaning": "Cố gắng (Miễn)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ベン",
        "type": "ONYOMI"
      }
    ]
  },
  {
    "character": "強",
    "meaning": "Mạnh mẽ (Cường)",
    "strokeCount": 11,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キョウ",
        "type": "ONYOMI"
      },
      {
        "reading": "つよ・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "大",
    "meaning": "To lớn (Đại)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ダイ",
        "type": "ONYOMI"
      },
      {
        "reading": "おお・きい",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "小",
    "meaning": "Nhỏ bé (Tiểu)",
    "strokeCount": 3,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ショウ",
        "type": "ONYOMI"
      },
      {
        "reading": "ちい・さい",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "高",
    "meaning": "Cao, Đắt (Cao)",
    "strokeCount": 10,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コウ",
        "type": "ONYOMI"
      },
      {
        "reading": "たか・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "安",
    "meaning": "Rẻ, Bình an (An)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "アン",
        "type": "ONYOMI"
      },
      {
        "reading": "やす・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "新",
    "meaning": "Mới mẻ (Tân)",
    "strokeCount": 13,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "シン",
        "type": "ONYOMI"
      },
      {
        "reading": "あたら・しい",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "古",
    "meaning": "Cũ kỹ (Cổ)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コ",
        "type": "ONYOMI"
      },
      {
        "reading": "ふる・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "長",
    "meaning": "Dài (Trường)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "チョウ",
        "type": "ONYOMI"
      },
      {
        "reading": "なが・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "多",
    "meaning": "Nhiều (Đa)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "タ",
        "type": "ONYOMI"
      },
      {
        "reading": "おお・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "少",
    "meaning": "Ít (Thiểu)",
    "strokeCount": 4,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ショウ",
        "type": "ONYOMI"
      },
      {
        "reading": "すく・ない",
        "type": "KUNYOMI"
      },
      {
        "reading": "すこ・し",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "白",
    "meaning": "Màu trắng (Bạch)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ハク",
        "type": "ONYOMI"
      },
      {
        "reading": "しろ・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "黒",
    "meaning": "Màu đen (Hắc)",
    "strokeCount": 11,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コク",
        "type": "ONYOMI"
      },
      {
        "reading": "くろ・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "赤",
    "meaning": "Màu đỏ (Xích)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セキ",
        "type": "ONYOMI"
      },
      {
        "reading": "あか・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "青",
    "meaning": "Màu xanh (Thanh)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "セイ",
        "type": "ONYOMI"
      },
      {
        "reading": "あお・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "早",
    "meaning": "Sớm, Nhanh (Tảo)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "ソウ",
        "type": "ONYOMI"
      },
      {
        "reading": "はや・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "明",
    "meaning": "Sáng sủa (Minh)",
    "strokeCount": 8,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "メイ",
        "type": "ONYOMI"
      },
      {
        "reading": "あか・るい",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "広",
    "meaning": "Rộng rãi (Quảng)",
    "strokeCount": 5,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コウ",
        "type": "ONYOMI"
      },
      {
        "reading": "ひろ・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "近",
    "meaning": "Gần gũi (Cận)",
    "strokeCount": 7,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "キン",
        "type": "ONYOMI"
      },
      {
        "reading": "ちか・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "遠",
    "meaning": "Xa xôi (Viễn)",
    "strokeCount": 13,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "エン",
        "type": "ONYOMI"
      },
      {
        "reading": "とお・い",
        "type": "KUNYOMI"
      }
    ]
  },
  {
    "character": "好",
    "meaning": "Thích (Hảo)",
    "strokeCount": 6,
    "jlptLevel": "N5",
    "readings": [
      {
        "reading": "コウ",
        "type": "ONYOMI"
      },
      {
        "reading": "す・き",
        "type": "KUNYOMI"
      }
    ]
  }
];

export const VOCABULARY_N5: SeedVocab[] = [
  {
    "word": "おはようございます",
    "kana": "おはようございます",
    "kanji": null,
    "romaji": "ohayou gozaimasu",
    "meaning": "Chào buổi sáng (lịch sự)",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "先生、おはようございます。",
    "exampleRomaji": "Sensei, ohayou gozaimasu.",
    "exampleMeaning": "Em chào thầy/cô buổi sáng ạ."
  },
  {
    "word": "こんにちは",
    "kana": "こんにちは",
    "kanji": null,
    "romaji": "konnichiwa",
    "meaning": "Xin chào (ban ngày)",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "みなさん、こんにちは！",
    "exampleRomaji": "Minasan, konnichiwa!",
    "exampleMeaning": "Xin chào mọi người!"
  },
  {
    "word": "こんばんは",
    "kana": "こんばんは",
    "kanji": null,
    "romaji": "konbanwa",
    "meaning": "Chào buổi tối",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "こんばんは、今夜は寒いですね。",
    "exampleRomaji": "Konbanwa, konya wa samui desu ne.",
    "exampleMeaning": "Chào buổi tối, đêm nay trời lạnh nhỉ."
  },
  {
    "word": "おやすみなさい",
    "kana": "おやすみなさい",
    "kanji": null,
    "romaji": "oyasuminasai",
    "meaning": "Chúc ngủ ngon",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "もう寝ます。おやすみなさい。",
    "exampleRomaji": "Mou nemasu. Oyasuminasai.",
    "exampleMeaning": "Tôi đi ngủ đây. Chúc ngủ ngon."
  },
  {
    "word": "ありがとう",
    "kana": "ありがとう",
    "kanji": null,
    "romaji": "arigatou",
    "meaning": "Cảm ơn bạn",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "手伝ってくれてありがとう。",
    "exampleRomaji": "Tetsudatte kurete arigatou.",
    "exampleMeaning": "Cảm ơn bạn vì đã giúp đỡ tôi."
  },
  {
    "word": "どういたしまして",
    "kana": "どういたしまして",
    "kanji": null,
    "romaji": "douitashimashite",
    "meaning": "Không có chi / Đừng khách sáo",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "いいえ、どういたしまして。",
    "exampleRomaji": "Iie, douitashimashite.",
    "exampleMeaning": "Dạ không có chi đâu ạ."
  },
  {
    "word": "すみません",
    "kana": "すみません",
    "kanji": null,
    "romaji": "sumimasen",
    "meaning": "Xin lỗi / Cho tôi hỏi...",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "すみません、駅はどこですか？",
    "exampleRomaji": "Sumimasen, eki wa doko desu ka?",
    "exampleMeaning": "Xin lỗi cho tôi hỏi ga ở đâu ạ?"
  },
  {
    "word": "ごめんなさい",
    "kana": "ごめんなさい",
    "kanji": null,
    "romaji": "gomennasai",
    "meaning": "Xin lỗi (thân mật)",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "遅れてごめんなさい。",
    "exampleRomaji": "Okurete gomennasai.",
    "exampleMeaning": "Mình xin lỗi vì đến muộn."
  },
  {
    "word": "はじめまして",
    "kana": "はじめまして",
    "kanji": null,
    "romaji": "hajimemashite",
    "meaning": "Rất vui được gặp bạn lần đầu",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "初めまして、ナムと申します。",
    "exampleRomaji": "Hajimemashite, Namu to moushimasu.",
    "exampleMeaning": "Rất hân hạnh được gặp, tôi tên là Nam."
  },
  {
    "word": "どうぞよろしく",
    "kana": "どうぞよろしく",
    "kanji": null,
    "romaji": "douzo yoroshiku",
    "meaning": "Rất mong được giúp đỡ",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "これからどうぞよろしくお願いします。",
    "exampleRomaji": "Korekara douzo yoroshiku onegai shimasu.",
    "exampleMeaning": "Từ nay rất mong nhận được sự giúp đỡ của bạn."
  },
  {
    "word": "さようなら",
    "kana": "さようなら",
    "kanji": null,
    "romaji": "sayounara",
    "meaning": "Tạm biệt",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "先生、さようなら。",
    "exampleRomaji": "Sensei, sayounara.",
    "exampleMeaning": "Em chào tạm biệt thầy ạ."
  },
  {
    "word": "じゃあ、また",
    "kana": "じゃあ、また",
    "kanji": null,
    "romaji": "jaa, mata",
    "meaning": "Hẹn gặp lại nhé",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "また明日会いましょう。じゃあ、また！",
    "exampleRomaji": "Mata ashita aimashou. Jaa, mata!",
    "exampleMeaning": "Mai gặp lại nhé. Hẹn gặp lại!"
  },
  {
    "word": "いただきます",
    "kana": "いただきます",
    "kanji": null,
    "romaji": "itadakimasu",
    "meaning": "Mời dùng bữa (nói trước khi ăn)",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "美味しそう！いただきます。",
    "exampleRomaji": "Oishisou! Itadakimasu.",
    "exampleMeaning": "Trông ngon quá! Mời cả nhà cùng ăn ạ."
  },
  {
    "word": "ごちそうさまでした",
    "kana": "ごちそうさまでした",
    "kanji": null,
    "romaji": "gochisousama deshita",
    "meaning": "Cảm ơn vì bữa ăn ngon (nói sau khi ăn)",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "ごちそうさまでした、とても美味しかったです。",
    "exampleRomaji": "Gochisousama deshita, totemo oishikatta desu.",
    "exampleMeaning": "Cảm ơn vì bữa ăn, đồ ăn rất ngon ạ."
  },
  {
    "word": "私",
    "kana": "わたし",
    "kanji": "私",
    "romaji": "watashi",
    "meaning": "Tôi, bản thân tôi",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "私はベトナム人です。",
    "exampleRomaji": "Watashi wa Betonamujin desu.",
    "exampleMeaning": "Tôi là người Việt Nam."
  },
  {
    "word": "あなた",
    "kana": "あなた",
    "kanji": null,
    "romaji": "anata",
    "meaning": "Bạn, anh, chị",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "あなたのお名前は何ですか？",
    "exampleRomaji": "Anata no onamae wa nan desu ka?",
    "exampleMeaning": "Tên của bạn là gì vậy?"
  },
  {
    "word": "あの人",
    "kana": "あのひと",
    "kanji": "あの人",
    "romaji": "ano hito",
    "meaning": "Người kia",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "あの人は誰ですか？",
    "exampleRomaji": "Ano hito wa dare desu ka?",
    "exampleMeaning": "Người kia là ai thế?"
  },
  {
    "word": "先生",
    "kana": "せんせい",
    "kanji": "先生",
    "romaji": "sensei",
    "meaning": "Thầy cô giáo, bác sĩ",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "田中先生はとても優しいです。",
    "exampleRomaji": "Tanaka sensei wa totemo yasashii desu.",
    "exampleMeaning": "Thầy Tanaka rất hiền hậu."
  },
  {
    "word": "学生",
    "kana": "がくせい",
    "kanji": "学生",
    "romaji": "gakusei",
    "meaning": "Học sinh, sinh viên",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "私は大学の学生です。",
    "exampleRomaji": "Watashi wa daigaku no gakusei desu.",
    "exampleMeaning": "Tôi là sinh viên đại học."
  },
  {
    "word": "会社員",
    "kana": "かいしゃいん",
    "kanji": "会社員",
    "romaji": "kaishain",
    "meaning": "Nhân viên công ty",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "父は会社員です。",
    "exampleRomaji": "Chichi wa kaishain desu.",
    "exampleMeaning": "Bố tôi là nhân viên công ty."
  },
  {
    "word": "医者",
    "kana": "いしゃ",
    "kanji": "医者",
    "romaji": "isha",
    "meaning": "Bác sĩ",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "将来、医者になりたいです。",
    "exampleRomaji": "Shourai, isha ni naritai desu.",
    "exampleMeaning": "Tương lai tôi muốn trở thành bác sĩ."
  },
  {
    "word": "友達",
    "kana": "ともだち",
    "kanji": "友達",
    "romaji": "tomodachi",
    "meaning": "Bạn bè",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "友達と一緒に映画を見ました。",
    "exampleRomaji": "Tomodachi to issho ni eiga o mimashita.",
    "exampleMeaning": "Tôi đã xem phim cùng với bạn bè."
  },
  {
    "word": "家族",
    "kana": "かぞく",
    "kanji": "家族",
    "romaji": "kazoku",
    "meaning": "Gia đình",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "家族は4人います。",
    "exampleRomaji": "Kazoku wa yonin imasu.",
    "exampleMeaning": "Gia đình tôi có 4 người."
  },
  {
    "word": "父",
    "kana": "ちち",
    "kanji": "父",
    "romaji": "chichi",
    "meaning": "Bố (của mình)",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "父は毎朝早く起きます。",
    "exampleRomaji": "Chichi wa maiasa hayaku okimasu.",
    "exampleMeaning": "Bố tôi mỗi sáng đều dậy sớm."
  },
  {
    "word": "母",
    "kana": "はは",
    "kanji": "母",
    "romaji": "haha",
    "meaning": "Mẹ (của mình)",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "母の料理はとても美味しいです。",
    "exampleRomaji": "Haha no ryouri wa totemo oishii desu.",
    "exampleMeaning": "Món ăn mẹ nấu rất ngon."
  },
  {
    "word": "お父さん",
    "kana": "おとうさん",
    "kanji": "お父さん",
    "romaji": "otousan",
    "meaning": "Bố (người khác / xưng hô)",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "お父さんはお元気ですか？",
    "exampleRomaji": "Otousan wa ogenki desu ka?",
    "exampleMeaning": "Bác trai vẫn khỏe chứ ạ?"
  },
  {
    "word": "お母さん",
    "kana": "おかあさん",
    "kanji": "お母さん",
    "romaji": "okaasan",
    "meaning": "Mẹ (người khác / xưng hô)",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "お母さんに花をあげました。",
    "exampleRomaji": "Okaasan ni hana o agemashita.",
    "exampleMeaning": "Tôi đã tặng hoa cho mẹ."
  },
  {
    "word": "兄",
    "kana": "あに",
    "kanji": "兄",
    "romaji": "ani",
    "meaning": "Anh trai (của mình)",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "兄は東京に住んでいます。",
    "exampleRomaji": "Ani wa Toukyou ni sunde imasu.",
    "exampleMeaning": "Anh trai tôi đang sống ở Tokyo."
  },
  {
    "word": "姉",
    "kana": "あね",
    "kanji": "姉",
    "romaji": "ane",
    "meaning": "Chị gái (của mình)",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "姉は英語を教えています。",
    "exampleRomaji": "Ane wa eigo o oshiete imasu.",
    "exampleMeaning": "Chị gái tôi đang dạy tiếng Anh."
  },
  {
    "word": "弟",
    "kana": "おとうと",
    "kanji": "弟",
    "romaji": "otouto",
    "meaning": "Em trai",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "弟と一緒にゲームをします。",
    "exampleRomaji": "Otouto to issho ni geemu o shimasu.",
    "exampleMeaning": "Tôi chơi game cùng em trai."
  },
  {
    "word": "妹",
    "kana": "いもうと",
    "kanji": "妹",
    "romaji": "imouto",
    "meaning": "Em gái",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "妹は高校生です。",
    "exampleRomaji": "Imouto wa koukousei desu.",
    "exampleMeaning": "Em gái tôi là học sinh cấp 3."
  },
  {
    "word": "これ",
    "kana": "これ",
    "kanji": null,
    "romaji": "kore",
    "meaning": "Cái này (gần người nói)",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "これは私の本です。",
    "exampleRomaji": "Kore wa watashi no hon desu.",
    "exampleMeaning": "Đây là cuốn sách của tôi."
  },
  {
    "word": "それ",
    "kana": "それ",
    "kanji": null,
    "romaji": "sore",
    "meaning": "Cái đó (gần người nghe)",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "それは何ですか？",
    "exampleRomaji": "Sore wa nan desu ka?",
    "exampleMeaning": "Cái đó là cái gì vậy?"
  },
  {
    "word": "あれ",
    "kana": "あれ",
    "kanji": null,
    "romaji": "are",
    "meaning": "Cái kia (xa cả hai)",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "あれはスカイツリーです。",
    "exampleRomaji": "Are wa Sukaitsurii desu.",
    "exampleMeaning": "Cái kia là tháp Tokyo Skytree."
  },
  {
    "word": "どれ",
    "kana": "どれ",
    "kanji": null,
    "romaji": "dore",
    "meaning": "Cái nào?",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "あなたの傘はどれですか？",
    "exampleRomaji": "Anata no kasa wa dore desu ka?",
    "exampleMeaning": "Cái ô của bạn là cái nào?"
  },
  {
    "word": "本",
    "kana": "ほん",
    "kanji": "本",
    "romaji": "hon",
    "meaning": "Cuốn sách",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "図書館で本を借りました。",
    "exampleRomaji": "Toshokan de hon o karimashita.",
    "exampleMeaning": "Tôi đã mượn sách ở thư viện."
  },
  {
    "word": "辞書",
    "kana": "じしょ",
    "kanji": "辞書",
    "romaji": "jisho",
    "meaning": "Từ điển",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "電子辞書を使います。",
    "exampleRomaji": "Denshi jisho o tsukaimasu.",
    "exampleMeaning": "Tôi dùng từ điển điện tử."
  },
  {
    "word": "傘",
    "kana": "かさ",
    "kanji": "傘",
    "romaji": "kasa",
    "meaning": "Cái dù, cái ô",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "雨が降っているから傘を持って行きます。",
    "exampleRomaji": "Ame ga futte iru kara kasa o motte ikimasu.",
    "exampleMeaning": "Vì trời đang mưa nên tôi mang ô theo."
  },
  {
    "word": "時計",
    "kana": "とけい",
    "kanji": "時計",
    "romaji": "tokei",
    "meaning": "Đồng hồ",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "新しい時計を買いました。",
    "exampleRomaji": "Atarashii tokei o kaimashita.",
    "exampleMeaning": "Tôi đã mua một chiếc đồng hồ mới."
  },
  {
    "word": "財布",
    "kana": "さいふ",
    "kanji": "財布",
    "romaji": "saifu",
    "meaning": "Cái ví tiền",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "財布にお金がありません。",
    "exampleRomaji": "Saifu ni okane ga arimasen.",
    "exampleMeaning": "Trong ví không còn tiền."
  },
  {
    "word": "電話",
    "kana": "でんわ",
    "kanji": "電話",
    "romaji": "denwa",
    "meaning": "Điện thoại",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "友達に電話をかけます。",
    "exampleRomaji": "Tomodachi ni denwa o kakemasu.",
    "exampleMeaning": "Tôi gọi điện thoại cho bạn bè."
  },
  {
    "word": "今",
    "kana": "いま",
    "kanji": "今",
    "romaji": "ima",
    "meaning": "Bây giờ",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "今、何時何分ですか？",
    "exampleRomaji": "Ima, nanji nanpun desu ka?",
    "exampleMeaning": "Bây giờ là mấy giờ mấy phút rồi ạ?"
  },
  {
    "word": "今日",
    "kana": "きょう",
    "kanji": "今日",
    "romaji": "kyou",
    "meaning": "Hôm nay",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "今日は天気がいいです。",
    "exampleRomaji": "Kyou wa tenki ga ii desu.",
    "exampleMeaning": "Hôm nay thời tiết đẹp."
  },
  {
    "word": "明日",
    "kana": "あした",
    "kanji": "明日",
    "romaji": "ashita",
    "meaning": "Ngày mai",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "明日は休みです。",
    "exampleRomaji": "Ashita wa yasumi desu.",
    "exampleMeaning": "Ngày mai là ngày nghỉ."
  },
  {
    "word": "昨日",
    "kana": "きのう",
    "kanji": "昨日",
    "romaji": "kinou",
    "meaning": "Hôm qua",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "昨日は一日中勉強しました。",
    "exampleRomaji": "Kinou wa ichinichijuu benkyou shimashita.",
    "exampleMeaning": "Hôm qua tôi đã học cả ngày."
  },
  {
    "word": "毎日",
    "kana": "まいにち",
    "kanji": "毎日",
    "romaji": "mainichi",
    "meaning": "Mỗi ngày, hàng ngày",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "毎日日本語を勉強します。",
    "exampleRomaji": "Mainichi nihongo o benkyou shimasu.",
    "exampleMeaning": "Mỗi ngày tôi đều học tiếng Nhật."
  },
  {
    "word": "朝",
    "kana": "あさ",
    "kanji": "朝",
    "romaji": "asa",
    "meaning": "Buổi sáng",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "朝ご飯を食べました。",
    "exampleRomaji": "Asagohan o tabemashita.",
    "exampleMeaning": "Tôi đã ăn bữa sáng."
  },
  {
    "word": "昼",
    "kana": "ひる",
    "kanji": "昼",
    "romaji": "hiru",
    "meaning": "Buổi trưa",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "お昼休みは12時からです。",
    "exampleRomaji": "Ohiruyasumi wa 12-ji kara desu.",
    "exampleMeaning": "Giờ nghỉ trưa bắt đầu từ 12 giờ."
  },
  {
    "word": "夜",
    "kana": "よる",
    "kanji": "夜",
    "romaji": "yoru",
    "meaning": "Buổi tối, ban đêm",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "夜11時に寝ます。",
    "exampleRomaji": "Yoru 11-ji ni nemasu.",
    "exampleMeaning": "Tôi đi ngủ lúc 11 giờ đêm."
  },
  {
    "word": "月曜日",
    "kana": "げつようび",
    "kanji": "月曜日",
    "romaji": "getsuyoubi",
    "meaning": "Thứ hai",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "月曜日にテストがあります。",
    "exampleRomaji": "Getsuyoubi ni tesuto ga arimasu.",
    "exampleMeaning": "Thứ hai có bài kiểm tra."
  },
  {
    "word": "日曜日",
    "kana": "にちようび",
    "kanji": "日曜日",
    "romaji": "nichiyoubi",
    "meaning": "Chủ nhật",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "日曜日にデパートへ行きます。",
    "exampleRomaji": "Nichiyoubi ni depaato e ikimasu.",
    "exampleMeaning": "Chủ nhật tôi đi trung tâm thương mại."
  },
  {
    "word": "ここ",
    "kana": "ここ",
    "kanji": null,
    "romaji": "koko",
    "meaning": "Ở đây, chỗ này",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "ここは教室です。",
    "exampleRomaji": "Koko wa kyoushitsu desu.",
    "exampleMeaning": "Đây là phòng học."
  },
  {
    "word": "そこ",
    "kana": "そこ",
    "kanji": null,
    "romaji": "soko",
    "meaning": "Ở đó, chỗ đó",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "そこに座ってください。",
    "exampleRomaji": "Soko ni suwatte kudasai.",
    "exampleMeaning": "Xin hãy ngồi vào chỗ đó."
  },
  {
    "word": "あそこ",
    "kana": "あそこ",
    "kanji": null,
    "romaji": "asoko",
    "meaning": "Ở đằng kia",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "あそこにコンビニがあります。",
    "exampleRomaji": "Asoko ni konbini ga arimasu.",
    "exampleMeaning": "Ở đằng kia có cửa hàng tiện lợi."
  },
  {
    "word": "どこ",
    "kana": "どこ",
    "kanji": null,
    "romaji": "doko",
    "meaning": "Ở đâu, chỗ nào?",
    "partOfSpeech": "pronoun",
    "jlptLevel": "N5",
    "exampleJapanese": "お手洗いはどこですか？",
    "exampleRomaji": "Otearai wa doko desu ka?",
    "exampleMeaning": "Nhà vệ sinh ở đâu vậy ạ?"
  },
  {
    "word": "学校",
    "kana": "がっこう",
    "kanji": "学校",
    "romaji": "gakkou",
    "meaning": "Trường học",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "自転車で学校へ行きます。",
    "exampleRomaji": "Jitensha de gakkou e ikimasu.",
    "exampleMeaning": "Tôi đi đến trường bằng xe đạp."
  },
  {
    "word": "駅",
    "kana": "えき",
    "kanji": "駅",
    "romaji": "eki",
    "meaning": "Nhà ga xe điện",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "駅の前で待ち合わせしましょう。",
    "exampleRomaji": "Eki no mae de machiawase shimashou.",
    "exampleMeaning": "Chúng ta hãy hẹn gặp nhau trước cửa ga nhé."
  },
  {
    "word": "病院",
    "kana": "びょういん",
    "kanji": "病院",
    "romaji": "byouin",
    "meaning": "Bệnh viện",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "熱があるから病院へ行きます。",
    "exampleRomaji": "Netsu ga aru kara byouin e ikimasu.",
    "exampleMeaning": "Vì bị sốt nên tôi đi bệnh viện."
  },
  {
    "word": "銀行",
    "kana": "ぎんこう",
    "kanji": "銀行",
    "romaji": "ginkou",
    "meaning": "Ngân hàng",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "銀行でお金を下ろします。",
    "exampleRomaji": "Ginkou de okane o oroshimasu.",
    "exampleMeaning": "Tôi rút tiền ở ngân hàng."
  },
  {
    "word": "部屋",
    "kana": "へや",
    "kanji": "部屋",
    "romaji": "heya",
    "meaning": "Căn phòng",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "私の部屋は2階にあります。",
    "exampleRomaji": "Watashi no heya wa 2-kai ni arimasu.",
    "exampleMeaning": "Phòng của tôi ở tầng 2."
  },
  {
    "word": "ご飯",
    "kana": "ごはん",
    "kanji": "ご飯",
    "romaji": "gohan",
    "meaning": "Cơm, bữa ăn",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "一緒にご飯を食べませんか？",
    "exampleRomaji": "Issho ni gohan o tabemasen ka?",
    "exampleMeaning": "Cùng đi ăn cơm với tôi không?"
  },
  {
    "word": "水",
    "kana": "みず",
    "kanji": "水",
    "romaji": "mizu",
    "meaning": "Nước uống",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "お水を一杯ください。",
    "exampleRomaji": "Omizu o ippai kudasai.",
    "exampleMeaning": "Cho tôi xin một ly nước ạ."
  },
  {
    "word": "お茶",
    "kana": "おちゃ",
    "kanji": "お茶",
    "romaji": "ocha",
    "meaning": "Trà xanh, trà",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "温かいお茶を飲みます。",
    "exampleRomaji": "Atatakai ocha o nomimasu.",
    "exampleMeaning": "Tôi uống trà nóng."
  },
  {
    "word": "魚",
    "kana": "さかな",
    "kanji": "魚",
    "romaji": "sakana",
    "meaning": "Con cá",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "日本の魚料理は美味しいです。",
    "exampleRomaji": "Nihon no sakana ryouri wa oishii desu.",
    "exampleMeaning": "Món cá của Nhật Bản rất ngon."
  },
  {
    "word": "肉",
    "kana": "にく",
    "kanji": "肉",
    "romaji": "niku",
    "meaning": "Thịt",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "牛肉と豚肉のどちらが好きですか？",
    "exampleRomaji": "Gyuuniku to butaniku no dochira ga suki desu ka?",
    "exampleMeaning": "Bạn thích thịt bò hay thịt heo hơn?"
  },
  {
    "word": "野菜",
    "kana": "やさい",
    "kanji": "野菜",
    "romaji": "yasai",
    "meaning": "Rau củ",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "毎日新鮮な野菜を食べます。",
    "exampleRomaji": "Mainichi shinsen na yasai o tabemasu.",
    "exampleMeaning": "Mỗi ngày tôi đều ăn rau củ tươi."
  },
  {
    "word": "果物",
    "kana": "くだもの",
    "kanji": "果物",
    "romaji": "kudamono",
    "meaning": "Trái cây, hoa quả",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "りんごやみかんなどの果物が好きです。",
    "exampleRomaji": "Ringo ya mikan nado no kudamono ga suki desu.",
    "exampleMeaning": "Tôi thích các loại hoa quả như táo và quýt."
  },
  {
    "word": "行く",
    "kana": "いく",
    "kanji": "行く",
    "romaji": "iku",
    "meaning": "Đi",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "日本へ行きたいです。",
    "exampleRomaji": "Nihon e ikitai desu.",
    "exampleMeaning": "Tôi muốn đi Nhật Bản."
  },
  {
    "word": "来る",
    "kana": "くる",
    "kanji": "来る",
    "romaji": "kuru",
    "meaning": "Đến, tới",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "友達が家へ来ます。",
    "exampleRomaji": "Tomodachi ga ie e kimasu.",
    "exampleMeaning": "Bạn bè đến chơi nhà tôi."
  },
  {
    "word": "帰る",
    "kana": "かえる",
    "kanji": "帰る",
    "romaji": "kaeru",
    "meaning": "Trở về, về nhà",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "6時にうちへ帰ります。",
    "exampleRomaji": "6-ji ni uchi e kaerimasu.",
    "exampleMeaning": "Tôi về nhà lúc 6 giờ."
  },
  {
    "word": "食べる",
    "kana": "たべる",
    "kanji": "食べる",
    "romaji": "taberu",
    "meaning": "Ăn",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "ラーメンを食べました。",
    "exampleRomaji": "Raamen o tabemashita.",
    "exampleMeaning": "Tôi đã ăn mì Ramen."
  },
  {
    "word": "飲む",
    "kana": "のむ",
    "kanji": "飲む",
    "romaji": "nomu",
    "meaning": "Uống",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "毎朝コーヒーを飲みます。",
    "exampleRomaji": "Maiasa koohii o nomimasu.",
    "exampleMeaning": "Mỗi sáng tôi đều uống cà phê."
  },
  {
    "word": "見る",
    "kana": "みる",
    "kanji": "見る",
    "romaji": "miru",
    "meaning": "Xem, nhìn",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "アニメを見ます。",
    "exampleRomaji": "Anime o mimasu.",
    "exampleMeaning": "Tôi xem Anime."
  },
  {
    "word": "聞く",
    "kana": "きく",
    "kanji": "聞く",
    "romaji": "kiku",
    "meaning": "Nghe, hỏi",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "音楽を聞きながら勉強します。",
    "exampleRomaji": "Ongaku o kikinagara benkyou shimasu.",
    "exampleMeaning": "Tôi vừa nghe nhạc vừa học bài."
  },
  {
    "word": "読む",
    "kana": "よむ",
    "kanji": "読む",
    "romaji": "yomu",
    "meaning": "Đọc",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "日本の新聞を読みます。",
    "exampleRomaji": "Nihon no shinbun o yomimasu.",
    "exampleMeaning": "Tôi đọc báo Nhật Bản."
  },
  {
    "word": "書く",
    "kana": "かく",
    "kanji": "書く",
    "romaji": "kaku",
    "meaning": "Viết",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "漢字を書く練習をします。",
    "exampleRomaji": "Kanji o kaku renshuu o shimasu.",
    "exampleMeaning": "Tôi luyện tập viết chữ Hán Kanji."
  },
  {
    "word": "話す",
    "kana": "はなす",
    "kanji": "話す",
    "romaji": "hanasu",
    "meaning": "Nói chuyện",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "日本語で話しましょう！",
    "exampleRomaji": "Nihongo de hanashimashou!",
    "exampleMeaning": "Chúng ta hãy cùng nói bằng tiếng Nhật nhé!"
  },
  {
    "word": "買う",
    "kana": "かう",
    "kanji": "買う",
    "romaji": "kau",
    "meaning": "Mua",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "新しい服を買いました。",
    "exampleRomaji": "Atarashii fuku o kaimashita.",
    "exampleMeaning": "Tôi đã mua quần áo mới."
  },
  {
    "word": "会う",
    "kana": "あう",
    "kanji": "会う",
    "romaji": "au",
    "meaning": "Gặp mặt",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "駅で友達に会いました。",
    "exampleRomaji": "Eki de tomodachi ni aimashita.",
    "exampleMeaning": "Tôi đã gặp bạn ở nhà ga."
  },
  {
    "word": "休む",
    "kana": "やすむ",
    "kanji": "休む",
    "romaji": "yasumu",
    "meaning": "Nghỉ ngơi, vắng mặt",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "少し休みましょう。",
    "exampleRomaji": "Sukoshi yasumimashou.",
    "exampleMeaning": "Chúng ta nghỉ ngơi một chút nhé."
  },
  {
    "word": "待つ",
    "kana": "まつ",
    "kanji": "待つ",
    "romaji": "matsu",
    "meaning": "Chờ đợi",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "ちょっと待ってください。",
    "exampleRomaji": "Chotto matte kudasai.",
    "exampleMeaning": "Xin hãy đợi một chút ạ."
  },
  {
    "word": "教える",
    "kana": "おしえる",
    "kanji": "教える",
    "romaji": "oshieru",
    "meaning": "Dạy học, chỉ bảo",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "先生が日本語を教えてくれます。",
    "exampleRomaji": "Sensei ga nihongo o oshiete kuremasu.",
    "exampleMeaning": "Thầy giáo dạy tiếng Nhật cho chúng tôi."
  },
  {
    "word": "分かる",
    "kana": "わかる",
    "kanji": "分かる",
    "romaji": "wakaru",
    "meaning": "Hiểu, nắm rõ",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "質問の意味が分かりました。",
    "exampleRomaji": "Shitsumon no imi ga wakarimashita.",
    "exampleMeaning": "Tôi đã hiểu ý nghĩa của câu hỏi rồi."
  },
  {
    "word": "起きる",
    "kana": "おきる",
    "kanji": "起きる",
    "romaji": "okiru",
    "meaning": "Thức dậy",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "毎朝6時に起きます。",
    "exampleRomaji": "Maiasa 6-ji ni okimasu.",
    "exampleMeaning": "Mỗi sáng tôi thức dậy lúc 6 giờ."
  },
  {
    "word": "寝る",
    "kana": "ねる",
    "kanji": "寝る",
    "romaji": "neru",
    "meaning": "Đi ngủ",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "昨夜は12時に寝ました。",
    "exampleRomaji": "Sakuya wa 12-ji ni nemashita.",
    "exampleMeaning": "Đêm qua tôi đi ngủ lúc 12 giờ."
  },
  {
    "word": "大きい",
    "kana": "おおきい",
    "kanji": "大きい",
    "romaji": "ookii",
    "meaning": "To lớn",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "東京はとても大きい町です。",
    "exampleRomaji": "Toukyou wa totemo ookii machi desu.",
    "exampleMeaning": "Tokyo là một thành phố rất to lớn."
  },
  {
    "word": "小さい",
    "kana": "ちいさい",
    "kanji": "小さい",
    "romaji": "chiisai",
    "meaning": "Nhỏ bé",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "この猫は小さいです。",
    "exampleRomaji": "Kono neko wa chiisai desu.",
    "exampleMeaning": "Chú mèo này nhỏ bé thật."
  },
  {
    "word": "高い",
    "kana": "たかい",
    "kanji": "高い",
    "romaji": "takai",
    "meaning": "Cao, đắt tiền",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "富士山は高い山です。",
    "exampleRomaji": "Fujisan wa takai yama desu.",
    "exampleMeaning": "Núi Phú Sĩ là ngọn núi cao."
  },
  {
    "word": "安い",
    "kana": "やすい",
    "kanji": "安い",
    "romaji": "yasui",
    "meaning": "Rẻ",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "この店の商品は安いです。",
    "exampleRomaji": "Kono mise no shouhin wa yasui desu.",
    "exampleMeaning": "Hàng hóa ở cửa hàng này giá rẻ."
  },
  {
    "word": "新しい",
    "kana": "あたらしい",
    "kanji": "新しい",
    "romaji": "atarashii",
    "meaning": "Mới",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "新しい車を買いました。",
    "exampleRomaji": "Atarashii kuruma o kaimashita.",
    "exampleMeaning": "Tôi đã mua một chiếc xe ô tô mới."
  },
  {
    "word": "古い",
    "kana": "ふるい",
    "kanji": "古い",
    "romaji": "furui",
    "meaning": "Cũ",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "このお寺はとても古いです。",
    "exampleRomaji": "Kono otera wa totemo furui desu.",
    "exampleMeaning": "Ngôi chùa này rất cổ kính."
  },
  {
    "word": "いい",
    "kana": "いい",
    "kanji": null,
    "romaji": "ii",
    "meaning": "Tốt, đẹp, hay",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "それはいいアイデアですね！",
    "exampleRomaji": "Sore wa ii aidea desu ne!",
    "exampleMeaning": "Đó quả là một ý tưởng hay!"
  },
  {
    "word": "暑い",
    "kana": "あつい",
    "kanji": "暑い",
    "romaji": "atsui",
    "meaning": "Nóng (thời tiết)",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "日本の夏はとても暑いです。",
    "exampleRomaji": "Nihon no natsu wa totemo atsui desu.",
    "exampleMeaning": "Mùa hè ở Nhật rất nóng."
  },
  {
    "word": "寒い",
    "kana": "さむい",
    "kanji": "寒い",
    "romaji": "samui",
    "meaning": "Lạnh (thời tiết)",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "冬はとても寒いですね。",
    "exampleRomaji": "Fuyu wa totemo samui desu ne.",
    "exampleMeaning": "Mùa đông trời lạnh thật đấy."
  },
  {
    "word": "美味しい",
    "kana": "おいしい",
    "kanji": "美味しい",
    "romaji": "oishii",
    "meaning": "Ngon miệng",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "この寿司は本当に美味しい！",
    "exampleRomaji": "Kono sushi wa hontou ni oishii!",
    "exampleMeaning": "Món sushi này thực sự rất ngon!"
  },
  {
    "word": "楽しい",
    "kana": "たのしい",
    "kanji": "楽しい",
    "romaji": "tanoshii",
    "meaning": "Vui vẻ",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "日本語の授業は楽しいです。",
    "exampleRomaji": "Nihongo no jugyou wa tanoshii desu.",
    "exampleMeaning": "Giờ học tiếng Nhật rất vui."
  },
  {
    "word": "忙しい",
    "kana": "いそがしい",
    "kanji": "忙しい",
    "romaji": "isogashii",
    "meaning": "Bận rộn",
    "partOfSpeech": "adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "今週はとても忙しいです。",
    "exampleRomaji": "Konshuu wa totemo isogashii desu.",
    "exampleMeaning": "Tuần này tôi bận rộn lắm."
  },
  {
    "word": "静か",
    "kana": "しずか",
    "kanji": "静か",
    "romaji": "shizuka",
    "meaning": "Yên tĩnh",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "図書館はとても静かです。",
    "exampleRomaji": "Toshokan wa totemo shizuka desu.",
    "exampleMeaning": "Thư viện rất yên tĩnh."
  },
  {
    "word": "綺麗",
    "kana": "きれい",
    "kanji": "綺麗",
    "romaji": "kirei",
    "meaning": "Đẹp, sạch sẽ",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "桜の花がとても綺麗です。",
    "exampleRomaji": "Sakura no hana ga totemo kirei desu.",
    "exampleMeaning": "Hoa anh đào đẹp tuyệt vời."
  },
  {
    "word": "親切",
    "kana": "しんせつ",
    "kanji": "親切",
    "romaji": "shinsetsu",
    "meaning": "Thân thiện, tốt bụng",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "先生はとても親切です。",
    "exampleRomaji": "Sensei wa totemo shinsetsu desu.",
    "exampleMeaning": "Thầy cô rất tốt bụng và tận tình."
  },
  {
    "word": "有名",
    "kana": "ゆうめい",
    "kanji": "有名",
    "romaji": "yuumei",
    "meaning": "Nổi tiếng",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "ここは有名なお寺です。",
    "exampleRomaji": "Koko wa yuumei na otera desu.",
    "exampleMeaning": "Đây là ngôi chùa nổi tiếng."
  },
  {
    "word": "好き",
    "kana": "すき",
    "kanji": "好き",
    "romaji": "suki",
    "meaning": "Thích",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "日本のアニメが好きです。",
    "exampleRomaji": "Nihon no anime ga suki desu.",
    "exampleMeaning": "Tôi thích Anime Nhật Bản."
  },
  {
    "word": "上手",
    "kana": "じょうず",
    "kanji": "上手",
    "romaji": "jouzu",
    "meaning": "Giỏi, khéo léo",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "日本語がとても上手ですね！",
    "exampleRomaji": "Nihongo ga totemo jouzu desu ne!",
    "exampleMeaning": "Bạn nói tiếng Nhật giỏi quá!",
    "tags": "Tính từ"
  },
  {
    "word": "下手",
    "kana": "へた",
    "kanji": "下手",
    "romaji": "heta",
    "meaning": "Dở, kém, không giỏi",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "私は歌が下手です。",
    "exampleRomaji": "Watashi wa uta ga heta desu.",
    "exampleMeaning": "Tôi hát không hay.",
    "tags": "Tính từ"
  },
  {
    "word": "大嫌い",
    "kana": "だいきらい",
    "kanji": "大嫌い",
    "romaji": "daikirai",
    "meaning": "Rất ghét",
    "partOfSpeech": "na-adjective",
    "jlptLevel": "N5",
    "exampleJapanese": "虫が大嫌いです。",
    "exampleRomaji": "Mushi ga daikirai desu.",
    "exampleMeaning": "Tôi cực kỳ ghét côn trùng.",
    "tags": "Cảm xúc"
  },
  {
    "word": "車",
    "kana": "くるま",
    "kanji": "車",
    "romaji": "kuruma",
    "meaning": "Xe ô tô",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "父は新しい車を買いました。",
    "exampleRomaji": "Chichi wa atarashii kuruma o kaimashita.",
    "exampleMeaning": "Bố tôi đã mua xe ô tô mới.",
    "tags": "Giao thông"
  },
  {
    "word": "電車",
    "kana": "でんしゃ",
    "kanji": "電車",
    "romaji": "densha",
    "meaning": "Xe điện, tàu điện",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "電車で会社へ通っています。",
    "exampleRomaji": "Densha de kaisha e kayotte imasu.",
    "exampleMeaning": "Tôi đi làm bằng tàu điện.",
    "tags": "Giao thông"
  },
  {
    "word": "飛行機",
    "kana": "ひこうき",
    "kanji": "飛行機",
    "romaji": "hikouki",
    "meaning": "Máy bay",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "飛行機で日本へ行きました。",
    "exampleRomaji": "Hikouki de Nihon e ikimashita.",
    "exampleMeaning": "Tôi đã đi Nhật bằng máy bay.",
    "tags": "Giao thông"
  },
  {
    "word": "自転車",
    "kana": "じてんしゃ",
    "kanji": "自転車",
    "romaji": "jitensha",
    "meaning": "Xe đạp",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "毎朝自転車で学校へ行きます。",
    "exampleRomaji": "Maiasa jitensha de gakkou e ikimasu.",
    "exampleMeaning": "Mỗi sáng tôi đi học bằng xe đạp.",
    "tags": "Giao thông"
  },
  {
    "word": "タクシー",
    "kana": "たくしー",
    "kanji": null,
    "romaji": "takushii",
    "meaning": "Xe taxi",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "荷物が多いのでタクシーに乗りましょう。",
    "exampleRomaji": "Nimotsu ga oily de takushii ni norimashou.",
    "exampleMeaning": "Đồ đạc nhiều nên chúng ta hãy đi taxi nhé.",
    "tags": "Giao thông"
  },
  {
    "word": "バス",
    "kana": "ばす",
    "kanji": null,
    "romaji": "basu",
    "meaning": "Xe buýt",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "バス停でバスを待っています。",
    "exampleRomaji": "Basutei de basu o matte imasu.",
    "exampleMeaning": "Tôi đang đợi xe buýt ở trạm xe buýt.",
    "tags": "Giao thông"
  },
  {
    "word": "地下鉄",
    "kana": "ちかてつ",
    "kanji": "地下鉄",
    "romaji": "chikatetsu",
    "meaning": "Tàu điện ngầm",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "東京の地下鉄はとても便利です。",
    "exampleRomaji": "Toukyou no chikatetsu wa totemo benri desu.",
    "exampleMeaning": "Tàu điện ngầm ở Tokyo rất tiện lợi.",
    "tags": "Giao thông"
  },
  {
    "word": "新幹線",
    "kana": "しんかんせん",
    "kanji": "新幹線",
    "romaji": "shinkansen",
    "meaning": "Tàu siêu tốc Shinkansen",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "新幹線で京都へ行きます。",
    "exampleRomaji": "Shinkansen de Kyoto e ikimasu.",
    "exampleMeaning": "Tôi đi Kyoto bằng tàu siêu tốc Shinkansen.",
    "tags": "Giao thông"
  },
  {
    "word": "歩いて",
    "kana": "あるいて",
    "kanji": "歩いて",
    "romaji": "aruite",
    "meaning": "Đi bộ",
    "partOfSpeech": "expression",
    "jlptLevel": "N5",
    "exampleJapanese": "駅から家まで歩いて10分です。",
    "exampleRomaji": "Eki kara ie made aruite 10-pun desu.",
    "exampleMeaning": "Từ nhà ga về nhà đi bộ hết 10 phút.",
    "tags": "Giao thông"
  },
  {
    "word": "買う",
    "kana": "かう",
    "kanji": "買う",
    "romaji": "kau",
    "meaning": "Mua sắm",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "スーパーでパンを買いました。",
    "exampleRomaji": "Suupaa de pan o kaimashita.",
    "exampleMeaning": "Tôi đã mua bánh mì ở siêu thị.",
    "tags": "Động từ"
  },
  {
    "word": "売る",
    "kana": "うる",
    "kanji": "売る",
    "romaji": "uru",
    "meaning": "Bán",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "この店では野菜を売っています。",
    "exampleRomaji": "Kono mise de wa yasai o utte imasu.",
    "exampleMeaning": "Cửa hàng này có bán rau củ.",
    "tags": "Động từ"
  },
  {
    "word": "書く",
    "kana": "かく",
    "kanji": "書く",
    "romaji": "kaku",
    "meaning": "Viết, vẽ",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "ノートに名前を書きます。",
    "exampleRomaji": "Nooto ni namae o kakimasu.",
    "exampleMeaning": "Tôi viết tên vào vở.",
    "tags": "Động từ"
  },
  {
    "word": "送る",
    "kana": "おくる",
    "kanji": "送る",
    "romaji": "okuru",
    "meaning": "Gửi (thư, quà)",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "友達にメールを送りました。",
    "exampleRomaji": "Tomodachi ni meeru o okurimashita.",
    "exampleMeaning": "Tôi đã gửi email cho bạn.",
    "tags": "Động từ"
  },
  {
    "word": "切る",
    "kana": "きる",
    "kanji": "切る",
    "romaji": "kiru",
    "meaning": "Cắt, thái",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "ハサミで紙を切ります。",
    "exampleRomaji": "Hasami de kami o kirimasu.",
    "exampleMeaning": "Tôi dùng kéo để cắt giấy.",
    "tags": "Động từ"
  },
  {
    "word": "貸す",
    "kana": "かす",
    "kanji": "貸す",
    "romaji": "kasu",
    "meaning": "Cho mượn, cho vay",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "友達に傘を貸しました。",
    "exampleRomaji": "Tomodachi ni kasa o kashimashita.",
    "exampleMeaning": "Tôi cho bạn mượn cây ô.",
    "tags": "Động từ"
  },
  {
    "word": "借りる",
    "kana": "かりる",
    "kanji": "借りる",
    "romaji": "kariru",
    "meaning": "Mượn, vay",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "図書館で本を借りました。",
    "exampleRomaji": "Toshokan de hon o karimashita.",
    "exampleMeaning": "Tôi mượn sách ở thư viện.",
    "tags": "Động từ"
  },
  {
    "word": "習う",
    "kana": "ならう",
    "kanji": "習う",
    "romaji": "narau",
    "meaning": "Học (từ ai đó)",
    "partOfSpeech": "verb",
    "jlptLevel": "N5",
    "exampleJapanese": "先生に日本語を習っています。",
    "exampleRomaji": "Sensei ni nihongo o naratte imasu.",
    "exampleMeaning": "Tôi đang học tiếng Nhật từ thầy cô.",
    "tags": "Học tập"
  },
  {
    "word": "電話",
    "kana": "でんわ",
    "kanji": "電話",
    "romaji": "denwa",
    "meaning": "Cuộc gọi điện thoại",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "母に電話をかけます。",
    "exampleRomaji": "Haha ni denwa o kakemasu.",
    "exampleMeaning": "Tôi gọi điện thoại cho mẹ.",
    "tags": "Giao tiếp"
  },
  {
    "word": "手紙",
    "kana": "てがみ",
    "kanji": "手紙",
    "romaji": "tegami",
    "meaning": "Lá thư",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "家族に手紙を書きました。",
    "exampleRomaji": "Kazoku ni tegami o kakimashita.",
    "exampleMeaning": "Tôi đã viết thư cho gia đình.",
    "tags": "Giao tiếp"
  },
  {
    "word": "写真",
    "kana": "しゃしん",
    "kanji": "写真",
    "romaji": "shashin",
    "meaning": "Bức ảnh",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "旅行でたくさんの写真を撮りました。",
    "exampleRomaji": "Ryokou de takusan no shashin o torimashita.",
    "exampleMeaning": "Tôi đã chụp rất nhiều ảnh trong chuyến du lịch.",
    "tags": "Đời sống"
  },
  {
    "word": "部屋",
    "kana": "へや",
    "kanji": "部屋",
    "romaji": "heya",
    "meaning": "Căn phòng",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "部屋を綺麗に掃除します。",
    "exampleRomaji": "Heya o kirei ni souji shimasu.",
    "exampleMeaning": "Tôi dọn dẹp phòng sạch sẽ.",
    "tags": "Đời sống"
  },
  {
    "word": "庭",
    "kana": "にわ",
    "kanji": "庭",
    "romaji": "niwa",
    "meaning": "Khu vườn",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "庭に美しい花が咲いています。",
    "exampleRomaji": "Niwa ni utsukushii hana ga saite imasu.",
    "exampleMeaning": "Trong vườn hoa đẹp đang nở.",
    "tags": "Đời sống"
  },
  {
    "word": "家",
    "kana": "うち",
    "kanji": "家",
    "romaji": "uchi",
    "meaning": "Nhà của tôi",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "うちへ遊びに来てください。",
    "exampleRomaji": "Uchi e asobi ni kite kudasai.",
    "exampleMeaning": "Hãy ghé nhà tôi chơi nhé.",
    "tags": "Đời sống"
  },
  {
    "word": "会社",
    "kana": "かいしゃ",
    "kanji": "会社",
    "romaji": "kaisha",
    "meaning": "Công ty",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "8時半に会社に着きます。",
    "exampleRomaji": "8-jihan ni kaisha ni tsukimasu.",
    "exampleMeaning": "Tôi đến công ty lúc 8 giờ rưỡi.",
    "tags": "Công việc"
  },
  {
    "word": "食堂",
    "kana": "しょくどう",
    "kanji": "食堂",
    "romaji": "shokudou",
    "meaning": "Nhà ăn, căng tin",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "会社の食堂で昼ご飯を食べます。",
    "exampleRomaji": "Kaisha no shokudou de hirugohan o tabemasu.",
    "exampleMeaning": "Tôi ăn trưa ở căng tin công ty.",
    "tags": "Ăn uống"
  },
  {
    "word": "公園",
    "kana": "こうえん",
    "kanji": "公園",
    "romaji": "kouen",
    "meaning": "Công viên",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "日曜日に公園を散歩します。",
    "exampleRomaji": "Nichiyoubi ni kouen o sanpo shimasu.",
    "exampleMeaning": "Chủ nhật tôi đi dạo trong công viên.",
    "tags": "Địa điểm"
  },
  {
    "word": "デパート",
    "kana": "でぱーと",
    "kanji": null,
    "romaji": "depaato",
    "meaning": "Trung tâm thương mại",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "デパートでプレゼントを買いました。",
    "exampleRomaji": "Depaato de purezento o kaimashita.",
    "exampleMeaning": "Tôi đã mua quà ở trung tâm thương mại.",
    "tags": "Địa điểm"
  },
  {
    "word": "映画館",
    "kana": "えいがかん",
    "kanji": "映画館",
    "romaji": "eigakan",
    "meaning": "Rạp chiếu phim",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "映画館で新しい映画を見ました。",
    "exampleRomaji": "Eigakan de atarashii eiga o mimashita.",
    "exampleMeaning": "Tôi đã xem bộ phim mới ở rạp.",
    "tags": "Giải trí"
  },
  {
    "word": "春",
    "kana": "はる",
    "kanji": "春",
    "romaji": "haru",
    "meaning": "Mùa xuân",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "春になると桜が咲きます。",
    "exampleRomaji": "Haru ni naru to sakura ga sakimasu.",
    "exampleMeaning": "Sang xuân hoa anh đào nở.",
    "tags": "Thời tiết"
  },
  {
    "word": "夏",
    "kana": "なつ",
    "kanji": "夏",
    "romaji": "natsu",
    "meaning": "Mùa hè",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "夏休みに海へ行きます。",
    "exampleRomaji": "Natsuyasumi ni umi e ikimasu.",
    "exampleMeaning": "Nghỉ hè tôi đi biển.",
    "tags": "Thời tiết"
  },
  {
    "word": "秋",
    "kana": "あき",
    "kanji": "秋",
    "romaji": "aki",
    "meaning": "Mùa thu",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "秋は紅葉が美しいです。",
    "exampleRomaji": "Aki wa kouyou ga utsukushii desu.",
    "exampleMeaning": "Mùa thu lá đỏ rất đẹp.",
    "tags": "Thời tiết"
  },
  {
    "word": "冬",
    "kana": "ふゆ",
    "kanji": "冬",
    "romaji": "fuyu",
    "meaning": "Mùa đông",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "冬は雪が降ります。",
    "exampleRomaji": "Fuyu wa yuki ga furimasu.",
    "exampleMeaning": "Mùa đông tuyết rơi.",
    "tags": "Thời tiết"
  },
  {
    "word": "天気",
    "kana": "てんき",
    "kanji": "天気",
    "romaji": "tenki",
    "meaning": "Thời tiết",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "今日の天気は晴れです。",
    "exampleRomaji": "Kyou no tenki wa hare desu.",
    "exampleMeaning": "Thời tiết hôm nay nắng đẹp.",
    "tags": "Thời tiết"
  },
  {
    "word": "雨",
    "kana": "あめ",
    "kanji": "雨",
    "romaji": "ame",
    "meaning": "Cơn mưa",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "雨が降ってきたので傘をさします。",
    "exampleRomaji": "Ame ga futte kita node kasa o sashimasu.",
    "exampleMeaning": "Trời đổ mưa nên tôi che ô.",
    "tags": "Thời tiết"
  },
  {
    "word": "雪",
    "kana": "ゆき",
    "kanji": "雪",
    "romaji": "yuki",
    "meaning": "Tuyết",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "外は白くて綺麗な雪が降っています。",
    "exampleRomaji": "Soto wa shirokute kirei na yuki ga furutte imasu.",
    "exampleMeaning": "Bên ngoài tuyết trắng đẹp đang rơi.",
    "tags": "Thời tiết"
  },
  {
    "word": "風",
    "kana": "かぜ",
    "kanji": "風",
    "romaji": "kaze",
    "meaning": "Cơn gió",
    "partOfSpeech": "noun",
    "jlptLevel": "N5",
    "exampleJapanese": "今日は強い風が吹いています。",
    "exampleRomaji": "Kyou wa tsuyoi kaze ga fuite imasu.",
    "exampleMeaning": "Hôm nay gió thổi rất mạnh.",
    "tags": "Thời tiết"
  }
];
