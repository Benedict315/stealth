# Team Calendar Extraction — Specs

## Purpose

Extract structured calendar events (meetings, deadlines, interviews, calls,
webinars, social events) from email bodies using pattern-matching heuristics.

## Scope

- **Release tier:** V2 (later release)
- **Audience:** Team
- **Folder ownership:** `tools/v2/team/team-calendar-extraction/`

This is a self-contained tooling workspace. Do not wire this tool into the
main app, routing, inbox architecture, wallet core, Stellar core, or design
system unless a future integration issue explicitly allows it.

## Recommended internal structure

```
team-calendar-extraction/
├── services/   # Pure extraction logic (implemented)
├── hooks/      # React hook adapter (implemented)
├── fixtures/   # Local test data (implemented)
├── tests/      # Unit tests (implemented)
└── docs/       # API reference and review notes (implemented)
```

## Required issue categories

| Category                  | Status                                                                   |
| ------------------------- | ------------------------------------------------------------------------ |
| Architecture              | Addressed — pure-function service, pluggable hook interface              |
| Feature                   | Addressed — extraction, scoring, dedup, grouping, formatting, validation |
| UI and accessibility      | Deferred — separate UI issue                                             |
| Security and performance  | Addressed — no network calls, no secrets, no live data                   |
| Testing and documentation | Addressed — 60+ unit tests, full API docs                                |

## Event types supported

- `meeting` — standup, sync, check-in, session
- `deadline` — due date, submission, cutoff
- `reminder` — follow-up, ping
- `interview` — screening, panel, debrief
- `call` — Zoom, Google Meet, Teams, phone call
- `social` — lunch, dinner, party, team outing
- `webinar` — workshop, seminar, training, demo
- `unknown` — unclassified (low confidence)

## Confidence scoring factors

| Signal                           | Weight |
| -------------------------------- | ------ |
| Known event type                 | +0.30  |
| Attendees present                | +0.25  |
| Location detected                | +0.20  |
| Timezone detected                | +0.15  |
| Long source snippet (≥ 40 chars) | +0.10  |

## Contributor boundary

All work stays inside `tools/v2/team/team-calendar-extraction/`.
Pull requests modifying files outside this folder are rejected unless
a future integration issue grants expanded scope.
