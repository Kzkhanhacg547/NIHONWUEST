import { describe, expect, it } from "vitest";
import { guessVoiceGender, voiceGenderLabel } from "@/lib/voiceGender";

describe("voiceGender detection", () => {
  it("correctly identifies male Japanese voices across operating systems", () => {
    // Windows / Edge voices
    expect(guessVoiceGender("Microsoft Ichiro - Japanese (Japan)")).toBe("male");
    expect(guessVoiceGender("Microsoft Keita Online (Natural) - Japanese (Japan)")).toBe("male");
    expect(guessVoiceGender("Microsoft Daichi Online (Natural) - Japanese (Japan)")).toBe("male");
    expect(guessVoiceGender("Microsoft Naoki Online (Natural) - Japanese (Japan)")).toBe("male");
    expect(guessVoiceGender("Microsoft Kenji")).toBe("male");
    expect(guessVoiceGender("Microsoft Taro")).toBe("male");
    expect(guessVoiceGender("Microsoft Takumi (Natural)")).toBe("male");

    // macOS / iOS voices
    expect(guessVoiceGender("Otoya")).toBe("male");
    expect(guessVoiceGender("Hattori")).toBe("male");
    expect(guessVoiceGender("Siri Voice 1 (Japanese)")).toBe("male");

    // Cloud / Android / Generic voices
    expect(guessVoiceGender("ja-jp-standard-c")).toBe("male");
    expect(guessVoiceGender("ja-jp-standard-d")).toBe("male");
    expect(guessVoiceGender("ja-jp-wavenet-c")).toBe("male");
    expect(guessVoiceGender("ja-jp-neural2-c")).toBe("male");
    expect(guessVoiceGender("Japanese Male Speaker")).toBe("male");
    expect(guessVoiceGender("Giọng nam Nhật Bản")).toBe("male");
  });

  it("correctly identifies female Japanese voices without false-matching 'ren'", () => {
    // Character Ren vs O-Ren
    expect(guessVoiceGender("Ren Sensei")).toBe("unknown");
    expect(guessVoiceGender("O-Ren")).toBe("female");
    expect(guessVoiceGender("Oren")).toBe("female");

    // Windows / Edge voices
    expect(guessVoiceGender("Microsoft Ayumi - Japanese (Japan)")).toBe("female");
    expect(guessVoiceGender("Microsoft Haruka - Japanese (Japan)")).toBe("female");
    expect(guessVoiceGender("Microsoft Sayaka - Japanese (Japan)")).toBe("female");
    expect(guessVoiceGender("Microsoft Nanami Online (Natural) - Japanese (Japan)")).toBe("female");
    expect(guessVoiceGender("Microsoft Shiori Online (Natural) - Japanese (Japan)")).toBe("female");

    // macOS / iOS / Chrome
    expect(guessVoiceGender("Kyoko")).toBe("female");
    expect(guessVoiceGender("Google 日本語")).toBe("female");
    expect(guessVoiceGender("Siri Voice 2 (Japanese)")).toBe("female");
    expect(guessVoiceGender("ja-jp-standard-a")).toBe("female");
    expect(guessVoiceGender("ja-jp-wavenet-b")).toBe("female");
  });

  it("provides user-friendly Vietnamese labels", () => {
    expect(voiceGenderLabel("female")).toBe("nữ");
    expect(voiceGenderLabel("male")).toBe("nam");
    expect(voiceGenderLabel("unknown")).toBe("chưa rõ");
  });
});
