# Team Calendar Extraction

A self-contained V2 team tool that parses email bodies and extracts
structured calendar events — meetings, deadlines, interviews, calls, and more.

**Release tier:** V2 (later release)
**Audience:** Team
**Isolation boundary:** `tools/v2/team/team-calendar-extraction/`

---

## Table of contents

1. [Purpose](#1-purpose)
2. [Folder structure](#2-folder-structure)
3. [API surface](#3-api-surface)
4. [Inputs and outputs](#4-inputs-and-outputs)
5. [Loading and error states](#5-loading-and-error-states)
6. [Setup](#6-setup)
7. [Running tests](#7-running-tests)
8. [Fixtures](#8-fixtures)
9. [Known limitations](#9-known-limitations)
10. [Integration roadmap](#10-integration-roadmap)

---

## 1. Purpose

Support teams and project leads receive dozens of emails containing dates,
times, and event details. This tool automatically extracts those events into
structured objects that can be added to a shared team calendar.

Features:

- **Pattern-based extraction** — detects ISO dates, natural-language dates
  ("June 25"), relative dates ("tomorrow", "next Friday"), and time expressions.
- **Event classification** — meeting, deadline, interview, call, social,
  webinar, reminder, unknown.
- **Attendee detection** — extracts email addresses from the body.
- **Location detection** — room references, Zoom/Google Meet URLs, street addresses.
- **Timezone inference** — detects EST, UTC, BST, etc.
- **Confidence scoring** — each event gets a 0–1 score based on available signal.
- **Deduplication** — near-duplicate events (same type + >80% snippet overlap)
  are merged.

---

## 2. Folder structure

```
team-calendar-extraction/
├── services/
│   └── calendar-extraction.service.ts  # All pure extraction logic
├── hooks/
│   └── useCalendarExtraction.ts        # React hook (UI adapter)
├── fixtures/
│   └── emails.fixture.ts               # 8 email scenarios + 4 event fixtures
├── tests/
│   └── calendar-extraction.service.test.ts  # 60+ unit tests
├── docs/
│   └── API.md                          # Full API reference
├── vitest.config.ts                    # Tool-local test config
├── README.md                           ← you are here
└── specs.md                            # Issue categories
```

---

## 3. API surface

All public functions are exported from `services/calendar-extraction.service.ts`.

| Function             | Signature                                                       | Purpose                          |
| -------------------- | --------------------------------------------------------------- | -------------------------------- |
| `extractEvents`      | `(input: ExtractionInput) → ExtractionResult`                   | Main entry point                 |
| `scoreEvent`         | `(event: ExtractedEvent) → number`                              | Confidence scoring               |
| `deduplicateEvents`  | `(events: ExtractedEvent[]) → ExtractedEvent[]`                 | Remove near-duplicates           |
| `groupByDate`        | `(events: ExtractedEvent[]) → Record<string, ExtractedEvent[]>` | Group by date key                |
| `formatEventSummary` | `(event: ExtractedEvent) → string`                              | One-line summary                 |
| `validateEvent`      | `(event: ExtractedEvent) → EventValidationError[]`              | Field validation                 |
| `filterByConfidence` | `(events, minConfidence?) → ExtractedEvent[]`                   | Confidence filter                |
| `sortEvents`         | `(events, key, direction?) → ExtractedEvent[]`                  | Sort the list                    |
| `normalizeBody`      | `(raw: string) → string`                                        | HTML strip + whitespace collapse |

The React hook `useCalendarExtraction` (in `hooks/`) wraps these functions
with state, filtering, and sorting for future UI use.

---

## 4. Inputs and outputs

### `extractEvents` input

```ts
interface ExtractionInput {
  body: string; // required — plain text or light HTML
  subject?: string; // helps classify event type and infer title
  senderEmail?: string; // added to attendees list
  receivedAt?: string; // ISO-8601 — anchors relative dates ("tomorrow")
}
```

### `extractEvents` output

```ts
interface ExtractionResult {
  events: ExtractedEvent[]; // deduplicated, scored events
  rawMatchCount: number; // date patterns found before dedup
  processedAt: string; // ISO-8601 timestamp
}
```

### `ExtractedEvent` shape

```ts
interface ExtractedEvent {
  id: string; // unique per extraction run
  title: string; // from subject or inferred from snippet
  type: EventType; // meeting | deadline | interview | call | social | webinar | reminder | unknown
  startAt: string | null; // ISO-8601 UTC — null when only a date fragment found
  endAt: string | null;
  timezone: string | null; // e.g. "EST", "UTC", "America/New_York"
  location: string | null; // room name, URL, or street address
  description: string | null; // context window around the date match
  attendees: string[]; // email addresses found in the body
  recurrence: RecurrenceRule; // none | daily | weekly | monthly | yearly
  sourceSnippet: string; // raw text fragment that triggered extraction
  confidence: number; // 0–1
  extractedAt: string; // ISO-8601
}
```

---

## 5. Loading and error states

### Loading

`extractEvents` is **synchronous**. The React hook wraps it with an async shell:

```ts
const { isLoading, extract } = useCalendarExtraction();
// isLoading is true while the call is in flight
// (currently instant; async NLP can be swapped in without changing the interface)
```

### Error state

`extractEvents` **never throws** — it returns `{ events: [], rawMatchCount: 0 }` on bad input.

The hook captures thrown exceptions and exposes them as:

```ts
const { error } = useCalendarExtraction();
// error: string | null — human-readable message if extraction fails
```

### Empty state

When no date patterns are found in the body, `events` is `[]` and
`rawMatchCount` is `0`. UI should render an "no events found" empty state.

---

## 6. Setup

```bash
# From repo root — one-time
npm install

# Run this tool's tests only
npx vitest run tools/v2/team/team-calendar-extraction/tests
```

No environment variables, API keys, or network access required.

---

## 7. Running tests

```bash
# Isolated run
npx vitest run tools/v2/team/team-calendar-extraction/tests

# With coverage report
npx vitest run tools/v2/team/team-calendar-extraction/tests --coverage

# Watch mode
npx vitest tools/v2/team/team-calendar-extraction/tests
```

---

## 8. Fixtures

`fixtures/emails.fixture.ts` provides:

| Export                             | Type               | Description                                         |
| ---------------------------------- | ------------------ | --------------------------------------------------- |
| `FIXTURE_EMAILS.meetingInvite`     | `ExtractionInput`  | Clear meeting invite with room, timezone, attendees |
| `FIXTURE_EMAILS.deadlineEmail`     | `ExtractionInput`  | Deadline embedded in prose                          |
| `FIXTURE_EMAILS.interviewEmail`    | `ExtractionInput`  | Interview with Zoom URL                             |
| `FIXTURE_EMAILS.webinarEmail`      | `ExtractionInput`  | Two-session webinar with multiple dates             |
| `FIXTURE_EMAILS.socialEmail`       | `ExtractionInput`  | Lunch invite with street address                    |
| `FIXTURE_EMAILS.noDateEmail`       | `ExtractionInput`  | No dates — should return 0 events                   |
| `FIXTURE_EMAILS.emptyEmail`        | `ExtractionInput`  | Empty body — edge case                              |
| `FIXTURE_EMAILS.relativeDateEmail` | `ExtractionInput`  | "tomorrow at 4 PM"                                  |
| `FIXTURE_EVENT_FULL`               | `ExtractedEvent`   | Fully-populated event                               |
| `FIXTURE_EVENT_MINIMAL`            | `ExtractedEvent`   | All optional fields null                            |
| `FIXTURE_EVENT_DEADLINE`           | `ExtractedEvent`   | Deadline-type event                                 |
| `FIXTURE_EVENTS_MULTI`             | `ExtractedEvent[]` | 3 events across 2 dates                             |

---

## 9. Known limitations

| Limitation                            | Detail                                                                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `startAt` / `endAt` are always `null` | Date parsing is heuristic only — no full ISO resolution yet. A dedicated date-parser integration is planned as a follow-up. |
| Relative dates not anchored           | "tomorrow" is detected as a pattern but not resolved to an absolute date without `receivedAt`.                              |
| No NLP model                          | Extraction uses regex patterns. Complex event descriptions may be missed or mis-classified.                                 |
| No server-side storage                | Events are local to the extraction call. Persistence is a future integration concern.                                       |
| Hook not unit-tested                  | `useCalendarExtraction` wraps the fully-tested service layer. Hook tests require `@testing-library/react`.                  |
| Single language                       | Only English date/time patterns are supported in V2.                                                                        |

---

## 10. Integration roadmap

When a future integration issue is opened:

| Hook / function         | Integration point                                       |
| ----------------------- | ------------------------------------------------------- |
| `extractEvents(input)`  | Called in the mail reading pane when an email is opened |
| `useCalendarExtraction` | Mounted in an email detail sidebar panel                |
| `ExtractedEvent`        | Sent to a team calendar API endpoint                    |
| `filterByConfidence`    | Exposed as a UI slider to hide low-confidence events    |
