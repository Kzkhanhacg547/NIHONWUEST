"use client";

import type { RefObject } from "react";
import { MicIcon, SendIcon, StopIcon } from "./SenseiIcons";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onToggleMic: () => void;
  isListening: boolean;
  loading: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null> | React.RefObject<HTMLInputElement> | any;
}

export function SenseiChatInput({ value, onChange, onSend, onToggleMic, isListening, loading, inputRef }: Props) {
  return (
    <div className="ais-composer">
      <div className="ais-composer-hint" aria-live="polite">
        {isListening ? (
          <span className="ais-hint-live">
            <span className="ais-wave" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            Đang nghe… nhấn mic để dừng
          </span>
        ) : (
          <span className="ais-hint-keys">
            <kbd>Enter</kbd> để gửi
          </span>
        )}
      </div>

      <div className="ais-composer-box">
        <button
          type="button"
          className={`ais-mic${isListening ? " is-on" : ""}`}
          onClick={onToggleMic}
          aria-pressed={isListening}
          aria-label={isListening ? "Dừng thu âm" : "Nói tiếng Nhật bằng micro"}
          title={isListening ? "Đang thu âm… Nhấn để dừng" : "Nhấn để nói tiếng Nhật (Micro)"}
        >
          {isListening ? <StopIcon /> : <MicIcon />}
        </button>

        <input
          ref={inputRef}
          type="text"
          className="ais-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            // Không gửi khi đang chọn chữ bằng bộ gõ tiếng Nhật (Enter dùng để xác nhận chữ).
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={isListening ? "Đang lắng nghe giọng nói tiếng Nhật…" : "Nhập câu tiếng Nhật hoặc bấm mic để nói…"}
          aria-label="Câu trả lời của bạn"
          enterKeyHint="send"
          autoComplete="off"
        />

        <button type="button" className="ais-send" onClick={onSend} disabled={!value.trim() || loading}>
          <span className="ais-send-label">Gửi</span>
          <SendIcon width={18} height={18} />
        </button>
      </div>
    </div>
  );
}
