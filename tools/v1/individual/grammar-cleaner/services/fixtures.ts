export const GRAMMAR_FIXTURES = [
  {
    name: "simple_lower_no_period",
    input: "this is a test",
    expected: "This is a test.",
  },
  {
    name: "common_typos",
    input: "i recieved teh package yesterday",
    expected: "I received the package yesterday.",
  },
  {
    name: "multiple_sentences",
    input: "hello there. how are you today? it is sunny",
    expected: "Hello there. How are you today? It is sunny.",
  },
  {
    name: "extra_whitespace",
    input: "  Too much    space here   ",
    expected: "Too much space here.",
  },
  {
    name: "mixed_case_typo",
    input: "Teh adress is wrong",
    expected: "The address is wrong.",
  }
];
