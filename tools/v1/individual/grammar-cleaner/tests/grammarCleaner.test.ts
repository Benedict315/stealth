import { describe, it, expect } from "vitest";
import { cleanGrammar } from "../services/grammarCleaner";
import { GRAMMAR_FIXTURES } from "../services/fixtures";

describe("Grammar Cleaner Service", () => {
  it("should return empty results for empty input", () => {
    const result = cleanGrammar("");
    expect(result.cleaned).toBe("");
    expect(result.changesCount).toBe(0);
  });

  describe("Fixtures verification", () => {
    GRAMMAR_FIXTURES.forEach((fixture) => {
      it(`should correctly clean: ${fixture.name}`, () => {
        const result = cleanGrammar(fixture.input);
        expect(result.cleaned).toBe(fixture.expected);
      });
    });
  });

  it("should track changes count correctly", () => {
    const input = "this is teh test";
    const result = cleanGrammar(input);
    // 1 for capitalization, 1 for 'teh' -> 'the', 1 for adding '.'
    expect(result.changesCount).toBeGreaterThanOrEqual(3);
  });

  it("should handle punctuation and symbols around typos", () => {
    expect(cleanGrammar("(teh)").cleaned).toBe("(The).");
    expect(cleanGrammar("word teh, word").cleaned).toBe("Word the, word.");
    expect(cleanGrammar("is it teh?").cleaned).toBe("Is it the?");
  });

  it("should capitalize the first letter even if preceded by symbols", () => {
    expect(cleanGrammar("\"hello\"").cleaned).toBe("\"Hello\".");
  });
});
