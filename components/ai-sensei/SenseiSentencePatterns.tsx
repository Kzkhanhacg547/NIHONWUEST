"use client";

import { Icon } from "@/components/ui";
import type { KaiwaScenario } from "@/lib/n3KaiwaScenarios";

/** "~に関して (Ni kanshite)" -> "に関して": bỏ dấu ~ đầu và phần romaji trong ngoặc. */
function toInsertText(pattern: string) {
  return pattern
    .replace(/^[~〜～]\s*/, "")
    .replace(/\s*[（(][^）)]*[）)]\s*$/, "")
    .trim();
}

interface Props {
  grammar: KaiwaScenario["keyGrammar"];
  onUse: (text: string) => void;
}

export function SenseiSentencePatterns({ grammar, onUse }: Props) {
  return (
    <section className="ais-patterns" aria-label="Mẫu câu N3 trọng tâm">
      <div className="ais-patterns-head">
        <span className="ais-patterns-ico" aria-hidden>
          <Icon name="bulb" className="h-4 w-4" />
        </span>
        <div>
          <h2 className="ais-patterns-title">Mẫu câu N3 trọng tâm</h2>
          <p className="ais-patterns-sub">Thử dùng trong câu trả lời của bạn</p>
        </div>
      </div>

      <ul className="ais-patterns-list">
        {grammar.map((g, idx) => (
          <li key={idx} className="ais-pattern">
            <div className="ais-pattern-text">
              <span className="ais-pattern-jp font-jp">{g.pattern}</span>
              <span className="ais-pattern-vi">{g.meaning}</span>
            </div>
            <button
              type="button"
              className="ais-pattern-use"
              onClick={() => onUse(toInsertText(g.pattern))}
              aria-label={`Dùng mẫu câu ${g.pattern}`}
              title="Dùng câu này"
            >
              <Icon name="plus" className="h-3.5 w-3.5" />
              <span>Dùng</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
