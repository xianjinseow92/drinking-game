# We're Not Really Strangers — Design

**Date:** 2026-09-04
**Status:** Implemented
**Owner:** xianjinseow92
**Route:** `/were-not-really-strangers`

---

## 1. Summary

A fourth game for Xj's Drinking Game: a browser version of the *We're Not
Really Strangers*-style question card game. Two (or more) people sit together,
draw prompt cards across three escalating levels — **Perception**,
**Connection**, **Reflection** — and answer honestly. Wildcards break the
rhythm with a dare or an instruction, and a single **final card** closes the
session.

Because this is a drinking-game collection, the one house rule layered on
top is simple: **skip a question, take a sip.** Everything else is optional
warmth.

## 2. Goals / non-goals

**Goals**

- A calm, mobile-first card flow that matches the existing app's look (MUI,
  pink/orange theme, rounded pill buttons, drawers for rules).
- Fully offline: prompts ship in the bundle as data, no network calls.
- Zero-config: open the route, pick a level, start drawing.
- Reuse the patterns Splurt established (feature folder, `*.component.tsx`,
  `types/`, `data/`, `utils/`, `components/`, a Rules drawer, a jest test).

**Non-goals**

- No multiplayer sync, no persistence between sessions.
- No player names or scoring — the game has no winner.
- No sound effects (the game is meant to feel quiet).

## 3. Content note

The real *We're Not Really Strangers* deck text is copyrighted. All prompts
in this implementation are **original** writing in the spirit of the format
(the three-level structure is a common game convention, not the copied
text). The route and title use the game's name because that is how the
owner asked for it and how players will look for it.

## 4. Game flow

```
Level select  ──▶  Level 1 (Perception)  ──▶  Level 2 (Connection)
                     │                            │
                     ▼                            ▼
                Level 3 (Reflection)  ──▶  Final card  ──▶  Level select
```

1. **Level select.** Three big cards (1 · Perception, 2 · Connection,
   3 · Reflection) with a one-line description each. Tapping one starts
   that level. A **Rules** button opens the rules drawer.
2. **Playing a level.** Header shows the level name and `N of M`. The deck
   is a shuffled copy of the level's prompts with a few **wildcards**
   spliced in at random positions (never first, never last). The active
   card fills the screen; below it sit two pill buttons:
   - **Next** — advance to the next card.
   - **Skip (sip!)** — advance, but the status line reminds the answerer
     to drink. Skipped cards are counted and shown in the summary.
3. **Level complete.** When the deck runs out the game shows a short
   level summary (cards answered, skips) with **Continue to Level N+1**
   or, after Level 3, **Reveal final card**. A secondary **Back to levels**
   button is always available.
4. **Final card.** A single closing prompt on a distinct face. Buttons:
   **Play again** (returns to level select).

The floating "Back to all games" button provided by `App.tsx` remains
available on every screen.

## 5. Data model

```ts
export type TWnrsLevel = 1 | 2 | 3;
export type TWnrsCardKind = "prompt" | "wildcard" | "final";

export interface IWnrsCard {
  id: string;            // e.g. "wnrs-l1-04", "wnrs-wild-02", "wnrs-final"
  kind: TWnrsCardKind;
  level: TWnrsLevel | null; // null for wildcards & final
  text: string;
}

export interface IWnrsLevelMeta {
  level: TWnrsLevel;
  name: string;          // "Perception" | "Connection" | "Reflection"
  tagline: string;       // one-line description on the level select card
}
```

`data/wnrsCards.ts` exports `wnrsLevels`, `wnrsPromptsByLevel`,
`wnrsWildcards`, `wnrsFinalCard`. Roughly 15 prompts per level and 8
wildcards.

## 6. Deck building (pure, tested)

`utils/wnrs.utils.ts`:

- `shuffleCards(cards)` — Fisher–Yates, returns a new array.
- `buildLevelDeck(prompts, wildcards, wildcardCount, random?)` — shuffles
  prompts, picks `wildcardCount` distinct wildcards, and inserts them at
  random interior positions (index ≥ 1 and < length) so a level never
  opens or closes on a wildcard. Accepts an injectable `random` function so
  tests are deterministic. If there are fewer than 2 prompts, wildcards are
  appended rather than interleaved.

## 7. State machine (in the main component)

```
phase: "select" | "playing" | "levelComplete" | "final"
level: TWnrsLevel | null
deck: IWnrsCard[]
index: number
skipped: number
lastAction: "answered" | "skipped" | null   // drives the status line
```

Transitions: `select → playing` (choose level), `playing → playing`
(next/skip while cards remain), `playing → levelComplete` (last card
consumed), `levelComplete → playing` (next level), `levelComplete → final`
(after level 3), `final → select`, and `* → select` via Back to levels.

## 8. UI / components

Feature folder `src/components/games/were-not-really-strangers/`:

- `WereNotReallyStrangers.component.tsx` — owns state; renders the phase.
- `components/WnrsLevelSelect.component.tsx` — level cards + Rules.
- `components/WnrsActiveCard.component.tsx` — the card face. Prompt cards
  are cream with dark plum text; wildcards are plum with cream text and a
  "WILDCARD" eyebrow; the final card is orange-tinted with a "FINAL CARD"
  eyebrow. Fades/slides in when the card changes (CSS transition, same
  approach as Splurt).
- `components/WnrsRulesDrawer.component.tsx` — left drawer, same styling
  as Splurt's rules drawer.
- `components/WnrsLevelSummary.component.tsx` — end-of-level panel.

Accessibility: every interactive element has an `aria-label`; the status
line is `aria-live="polite"`; the card face has `role="article"` and a
heading for the level.

## 9. Wiring

- `constants/constants.ts`: add `wereNotReallyStrangers: "/were-not-really-strangers"`.
- `routes.ts`: lazy import + route entry with a display `label`
  ("We're Not Really Strangers") so the menu button shows the apostrophe.
- `types/types.ts`: `IPath` gains optional `label`.
- `GameSelectPage.tsx`: prefer `route.label` over the kebab-derived name.
- `README.md`: add the game to the list.

## 10. Testing

- `utils/wnrs.utils.test.ts` — deck length, wildcard count, wildcards
  never first/last, all prompts present, determinism with injected random.
- `WereNotReallyStrangers.component.test.tsx` — level select renders;
  choosing Level 1 shows a card and `1 of N`; Next advances; Skip
  increments the skip note; exhausting the deck shows the summary;
  continuing through Level 3 reaches the final card; Play again returns to
  level select.
- `App.test.tsx` — add a routing assertion for the new menu button.
