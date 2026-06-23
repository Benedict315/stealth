/**
 * Basic grammar cleaner service.
 * Handles capitalization, basic punctuation, and common typo fixes.
 */

const COMMON_TYPOS: Record<string, string> = {
  "teh": "the",
  "recieve": "receive",
  "recieved": "received",
  "adress": "address",
  "seperate": "separate",
  "occured": "occurred",
  "definitly": "definitely",
  "untill": "until",
  "wich": "which",
};

export interface GrammarCleanResult {
  original: string;
  cleaned: string;
  changesCount: number;
}

/**
 * Cleans the input text for grammar and common typos.
 */
export function cleanGrammar(text: string): GrammarCleanResult {
  if (!text) {
    return { original: "", cleaned: "", changesCount: 0 };
  }

  let cleaned = text;
  let changesCount = 0;

  // Normalize whitespace
  const normalized = cleaned.replace(/\s+/g, " ").trim();
  if (normalized !== cleaned) {
    cleaned = normalized;
    changesCount++;
  }

  // Fix common typos while preserving surrounding non-alphanumeric characters
  const words = cleaned.split(" ");
  const fixedWords = words.map((word) => {
    // Extract the core word and surrounding symbols
    const match = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
    if (!match) return word;

    const prefix = match[1];
    const core = match[2];
    const suffix = match[3];

    const lowerCore = core.toLowerCase();
    if (COMMON_TYPOS[lowerCore]) {
      changesCount++;
      let replacement = COMMON_TYPOS[lowerCore];

      // Preserve capitalization
      if (core[0] === core[0].toUpperCase()) {
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }

      return prefix + replacement + suffix;
    }
    return word;
  });
  cleaned = fixedWords.join(" ");

  // Fix capitalization and punctuation at sentence level
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const fixedSentences = sentences.map((sentence) => {
    let s = sentence.trim();
    if (!s) return s;

    // Capitalize first letter of the sentence
    const firstLetterMatch = s.match(/[a-zA-Z]/);
    if (firstLetterMatch && firstLetterMatch.index !== undefined) {
      const idx = firstLetterMatch.index;
      if (s[idx] !== s[idx].toUpperCase()) {
        s = s.slice(0, idx) + s[idx].toUpperCase() + s.slice(idx + 1);
        changesCount++;
      }
    }

    // Add period if no punctuation at the end of the sentence
    if (!/[.!?]$/.test(s)) {
      s = s + ".";
      changesCount++;
    }

    return s;
  });

  cleaned = fixedSentences.join(" ");

  return {
    original: text,
    cleaned,
    changesCount,
  };
}
