"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui";
import { kanaToRomaji } from "@/lib/romajiConverter";
import type { SenseiMessageData } from "./types";

/**
 * Giá trị hiển thị theo từng tin nhắn: mặc định theo công tắc chung ở hồ sơ
 * Sensei, người học có thể bật/tắt riêng cho một tin. Khi công tắc chung đổi,
 * ghi đè riêng được xoá để hai nơi không lệch nhau.
 */
function useLayer(globalOn: boolean) {
  const [local, setLocal] = useState<boolean | null>(null);
  useEffect(() => {
    setLocal(null);
  }, [globalOn]);
  const value = local ?? globalOn;
  return [value, () => setLocal(!value)] as const;
}

interface Props {
  msg: SenseiMessageData;
  showFurigana: boolean;
  showRomaji: boolean;
  showTranslations: boolean;
  onSpeak: (text: string) => void;
}

export const SenseiMessage = memo(function SenseiMessage({
  msg,
  showFurigana,
  showRomaji,
  showTranslations,
  onSpeak,
}: Props) {
  const isUser = msg.role === "user";
  const [furiOn, toggleFuri] = useLayer(showFurigana);
  const [romajiOn, toggleRomaji] = useLayer(showRomaji);
  const [viOn, toggleVi] = useLayer(showTranslations);

  const romaji = useMemo(
    () => (romajiOn ? kanaToRomaji(msg.furigana || msg.content) : ""),
    [romajiOn, msg.furigana, msg.content]
  );

  return (
    <div className={`ais-msg ${isUser ? "is-user" : "is-sensei"}`}>
      {!isUser && (
        <span className="ais-msg-avatar font-jp" aria-hidden>
          葵
        </span>
      )}

      <div className="ais-bubble">
        {!isUser && <span className="sr-only">Aoi Sensei: </span>}
        {furiOn && msg.furigana && <p className="ais-furi font-jp">{msg.furigana}</p>}

        <p className="ais-ja font-jp">{msg.content}</p>

        {romajiOn && romaji && <p className="ais-romaji">{romaji}</p>}

        {viOn && msg.meaning && <p className="ais-vi">{msg.meaning}</p>}

        {!isUser && (
          <div className="ais-actions" role="group" aria-label="Công cụ cho tin nhắn này">
            <button
              type="button"
              className="ais-act"
              onClick={() => onSpeak(msg.content)}
              title="Nghe lại"
              aria-label="Nghe lại câu của Sensei"
            >
              <Icon name="speaker" className="h-4 w-4" />
              <span className="ais-act-label">Nghe lại</span>
            </button>

            <span className="ais-act-sep" aria-hidden />

            {msg.furigana && (
              <button type="button" className="ais-act" aria-pressed={furiOn} onClick={toggleFuri} title="Furigana">
                <span className="ais-act-glyph font-jp">あ</span>
                <span className="ais-act-label">Furigana</span>
              </button>
            )}
            <button type="button" className="ais-act" aria-pressed={romajiOn} onClick={toggleRomaji} title="Romaji">
              <span className="ais-act-glyph">Aa</span>
              <span className="ais-act-label">Romaji</span>
            </button>
            {msg.meaning && (
              <button type="button" className="ais-act" aria-pressed={viOn} onClick={toggleVi} title="Dịch nghĩa">
                <span className="ais-act-glyph">VI</span>
                <span className="ais-act-label">Dịch</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
