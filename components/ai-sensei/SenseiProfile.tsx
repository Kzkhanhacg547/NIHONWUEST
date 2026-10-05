"use client";

import { Icon } from "@/components/ui";
import type { AvatarState } from "@/components/SenseiAvatar";
import { SenseiCharacter } from "./SenseiCharacter";
import type { SenseiMood } from "./types";

const MOODS: Record<SenseiMood, { label: string; ja: string; vi: string }> = {
  idle: {
    label: "Sẵn sàng trò chuyện",
    ja: "今日は何を話しましょうか？",
    vi: "Hôm nay chúng ta nói về chủ đề gì nhỉ?",
  },
  listening: {
    label: "Đang lắng nghe…",
    ja: "どうぞ、聞いていますよ。",
    vi: "Mời bạn nói, Sensei đang nghe đây.",
  },
  thinking: {
    label: "Đang soạn câu trả lời…",
    ja: "ええと、少し考えますね。",
    vi: "Ừm, để Sensei nghĩ một chút nhé.",
  },
  speaking: {
    label: "Đang nói…",
    ja: "ゆっくり聞いてくださいね。",
    vi: "Bạn hãy nghe thật kỹ nhé.",
  },
  happy: {
    label: "Sensei đã trả lời",
    ja: "いいですね！その調子です！",
    vi: "Tốt lắm! Cứ thế phát huy nhé.",
  },
};

interface ToggleProps {
  showFurigana: boolean;
  showRomaji: boolean;
  showTranslations: boolean;
  autoVoice: boolean;
  onToggleFurigana: () => void;
  onToggleRomaji: () => void;
  onToggleTranslations: () => void;
  onToggleAutoVoice: () => void;
}

interface Props extends ToggleProps {
  mood: SenseiMood;
  avatarState: AvatarState;
  isSpeaking: boolean;
  isListening: boolean;
}

export function SenseiProfile({
  mood,
  avatarState,
  isSpeaking,
  isListening,
  showFurigana,
  showRomaji,
  showTranslations,
  autoVoice,
  onToggleFurigana,
  onToggleRomaji,
  onToggleTranslations,
  onToggleAutoVoice,
}: Props) {
  const m = MOODS[mood];

  const toggles = [
    { key: "furi", glyph: "あ", label: "Furigana", on: showFurigana, onClick: onToggleFurigana, jp: true },
    { key: "romaji", glyph: "Aa", label: "Romaji", on: showRomaji, onClick: onToggleRomaji },
    { key: "vi", glyph: "VI", label: "Dịch nghĩa", on: showTranslations, onClick: onToggleTranslations },
    {
      key: "voice",
      glyph: <Icon name="speaker" className="h-4 w-4" />,
      label: autoVoice ? "Tự đọc" : "Tắt đọc",
      on: autoVoice,
      onClick: onToggleAutoVoice,
    },
  ];

  return (
    <aside className="ais-profile" aria-label="Hồ sơ Aoi Sensei">
      <div className="ais-profile-stage">
        <SenseiCharacter state={avatarState} isSpeaking={isSpeaking} isListening={isListening} />
      </div>

      <div className="ais-speech" data-mood={mood}>
        <p className="ais-speech-ja font-jp">「{m.ja}」</p>
        <p className="ais-speech-vi">{m.vi}</p>
      </div>

      <div className="ais-identity">
        <p className="ais-status" data-mood={mood} role="status">
          <span className="ais-status-dot" aria-hidden />
          {m.label}
        </p>
        <h2 className="ais-name">
          葵先生 <span>(Aoi Sensei)</span>
        </h2>
        <p className="ais-role">Gia sư đàm thoại tiếng Nhật · học qua hội thoại thực tế</p>
        <div className="ais-chips">
          <span className="ais-chip ais-chip--red">JLPT N3</span>
          <span className="ais-chip">Kaiwa Practice</span>
        </div>
      </div>

      <div className="ais-toggles" role="group" aria-label="Tuỳ chọn hiển thị">
        {toggles.map((t) => (
          <button
            key={t.key}
            type="button"
            className="ais-toggle"
            aria-pressed={t.on}
            onClick={t.onClick}
            title={t.key === "voice" ? "Tự động phát giọng nói khi Sensei trả lời" : `Bật/tắt ${t.label}`}
          >
            <span className={`ais-toggle-glyph${t.jp ? " font-jp" : ""}`}>{t.glyph}</span>
            <span className="ais-toggle-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="ais-skills">
        <p className="ais-skills-title">Trọng tâm buổi luyện</p>
        <div className="ais-chips">
          <span className="ais-chip">Phản xạ</span>
          <span className="ais-chip">Phát âm</span>
          <span className="ais-chip">Ngữ pháp</span>
          <span className="ais-chip">Từ vựng</span>
        </div>
      </div>
    </aside>
  );
}
