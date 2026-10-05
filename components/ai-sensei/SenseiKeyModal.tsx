"use client";

import { useEffect, useState } from "react";
import { Button, Modal } from "@/components/ui";

interface Props {
  isOpen: boolean;
  apiKey: string;
  model: string;
  onClose: () => void;
  onSave: (key: string, model: string) => void;
  onClear: () => void;
}

const MODELS = [
  { value: "gemini-3.6-flash", label: "⚡ Gemini 3.6 Flash (Chính thức từ Google - Khuyên dùng)" },
  { value: "gemini-3.6-flash-preview", label: "🧪 Gemini 3.6 Flash Preview" },
  { value: "gemini-3.8-flash", label: "🚀 Gemini 3.8 Flash (Tốc độ cao)" },
  { value: "gemini-3.6-pro", label: "🌟 Gemini 3.6 Pro (Chuyên sâu cao cấp)" },
];

/**
 * Nháp key/model nằm ở đây, không ở SenseiKaiwaClient: gõ vào ô không làm cả
 * trang render lại (Modal đặt lại focus mỗi khi onClose đổi identity).
 */
export function SenseiKeyModal({ isOpen, apiKey, model, onClose, onSave, onClear }: Props) {
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const [modelDraft, setModelDraft] = useState(model);

  useEffect(() => {
    if (isOpen) {
      setKeyDraft(apiKey);
      setModelDraft(model);
    }
  }, [isOpen, apiKey, model]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔑 Cấu hình Google Gemini AI Key" maxWidth="md">
      <div className="ais-modal">
        <p className="ais-modal-lead">
          Nhập Google Gemini API Key để mở khóa toàn bộ trí thông minh đàm thoại tiếng Nhật (Gemini 1.5 Flash), nói
          chuyện tự do mọi chủ đề. Khóa được lưu trực tiếp trên trình duyệt của bạn.
        </p>

        <div className="ais-field">
          <label htmlFor="ais-key-input">
            <span>API Key (hỗ trợ nhiều key &amp; đa nền tảng)</span>
            <em>Tự động đảo key khi hết hạn ngạch</em>
          </label>
          <textarea
            id="ais-key-input"
            rows={3}
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            placeholder="Dán 1 hoặc nhiều Gemini Key (AIzaSy...), Groq Key (gsk_...), OpenRouter Key (sk-or-)... Mỗi key 1 dòng hoặc cách nhau bằng dấu phẩy"
            spellCheck={false}
            autoComplete="off"
          />
          <p className="ais-field-note">
            <strong>Mẹo:</strong> tạo 2–3 Gemini key từ các tài khoản Google khác nhau và dán vào đây để hệ thống tự
            luân phiên, không lo bị nghẽn.
          </p>
        </div>

        <div className="ais-field">
          <label htmlFor="ais-model-select">
            <span>Chọn mô hình AI (Gemini 3 / Groq)</span>
            <em>Tự động chuyển model nếu 503</em>
          </label>
          <select id="ais-model-select" value={modelDraft} onChange={(e) => setModelDraft(e.target.value)}>
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ais-modal-tip">
          <p>Nơi lấy API Key miễn phí:</p>
          <ul>
            <li>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                Google AI Studio (Gemini 3.6 Flash miễn phí) ↗
              </a>
            </li>
            <li>
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
                Groq Cloud (gsk_... 14,400 lượt/ngày, cực nhanh) ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="ais-modal-actions">
          {apiKey ? (
            <button type="button" className="ais-link-danger" onClick={onClear}>
              Xóa key đã lưu
            </button>
          ) : (
            <span className="ais-modal-empty">Chưa cài đặt</span>
          )}
          <div className="ais-modal-buttons">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Đóng
            </Button>
            <Button type="button" variant="brand" size="sm" onClick={() => onSave(keyDraft, modelDraft)}>
              Lưu key
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
