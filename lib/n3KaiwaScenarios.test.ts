import { describe, it, expect } from "vitest";
import { N3_KAIWA_SCENARIOS } from "./n3KaiwaScenarios";

describe("N3 Kaiwa Scenarios", () => {
  it("has 5 well-defined conversational scenarios", () => {
    expect(N3_KAIWA_SCENARIOS.length).toBeGreaterThanOrEqual(5);

    N3_KAIWA_SCENARIOS.forEach((sc) => {
      expect(sc.id).toBeTruthy();
      expect(sc.title).toBeTruthy();
      expect(sc.initialMessage).toBeTruthy();
      expect(sc.systemPrompt).toBeTruthy();
      expect(sc.suggestedReplies.length).toBeGreaterThanOrEqual(2);
      expect(sc.keyGrammar.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("contains Business Horenso and Casual Friends scenarios", () => {
    const business = N3_KAIWA_SCENARIOS.find((s) => s.id === "business_horenso");
    const casual = N3_KAIWA_SCENARIOS.find((s) => s.id === "casual_friends");

    expect(business).toBeDefined();
    expect(casual).toBeDefined();
    expect(business?.badge).toContain("Business");
    expect(casual?.badge).toContain("Thể Ngắn");
  });
});
