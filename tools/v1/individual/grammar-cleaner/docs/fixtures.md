# Test Fixtures

The Grammar Cleaner tool includes a set of fixtures to ensure consistent behavior across different text scenarios. These are located in `services/fixtures.ts`.

## Fixture Categories

- **Simple Case**: Lowercase text without ending punctuation.
    - *Input*: `this is a test`
    - *Expected*: `This is a test.`
- **Common Typos**: Words frequently misspelled.
    - *Input*: `i recieved teh package yesterday`
    - *Expected*: `I received the package yesterday.`
- **Multiple Sentences**: Handling sentence boundaries.
    - *Input*: `hello there. how are you today? it is sunny`
    - *Expected*: `Hello there. How are you today? It is sunny.`
- **Whitespace**: Cleaning up irregular spacing.
    - *Input*: `  Too much    space here   `
    - *Expected*: `Too much space here.`
- **Case Preservation**: Maintaining capitalization on corrected typos.
    - *Input*: `Teh adress is wrong`
    - *Expected*: `The address is wrong.`
