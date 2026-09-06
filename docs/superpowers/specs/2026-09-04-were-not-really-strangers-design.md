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

## 4. Game flow (dating-optimised, v2)

Two players. **One draws and reads the card aloud; the other answers.** Roles
swap after every card. The app tracks whose turn it is.

```
Level select (names)  ──▶  Level 1 ──▶ Level 2 ──▶ Level 3 ──▶ Final card ──▶ Level select
                             ▲  "Next level" is available at any time; no minimum card count.
```

1. **Level select.** Two name fields (default "Player 1" / "Player 2") and
   three big level cards. A **Rules** button opens the rules drawer.
2. **Playing a level.** Header shows the level name and `N of M`. A **turn
   banner** shows `Asks: <asker> → Answers: <answerer>`. The deck is a
   shuffled copy of the level's prompts with wildcards spliced into interior
   positions. Buttons:
   - **Answered** — logs the card, swaps roles, advances.
   - **Skip (sip!)** — the answerer sips; logged as a skip; swaps roles; advances.
   - **Dig deeper** — the asker's one use per level. Optional, never forced.
     Marks the card as dug deeper and shows a prompt; does not advance.
   - **Level N+1 →** / **Final card** — jump up whenever both feel ready.
   - **History** — opens the history drawer.
   Wildcards: the answerer does what it says; roles still swap after.
3. **Level complete** (deck exhausted). Summary with cards answered and per-
   player sips, plus **Continue** / **History** / **Back to levels**.
4. **Final card.** Both players write a note, swap, open after goodbye.
   **Play again** returns to level select and clears history.

### Official rules honoured
- One asks, one answers, alternate (official).
- Dig Deeper once per player per level (official; here optional).
- Wildcards interleaved; the answerer completes them (official).
- Final card: both write a note, open after parting (official).
- **Deliberate deviations:** no 15-card minimum per level (owner's call: let a
  date escalate quickly); "skip a card, take a sip" house rule.

## 5. Data model

```ts
export type TWnrsLevel = 1 | 2 | 3;
export type TWnrsCardKind = "prompt" | "wildcard" | "final";
export type TWnrsPlayer = "playerOne" | "playerTwo";
export type TWnrsOutcome = "answered" | "skipped";

export interface IWnrsCard { id: string; kind: TWnrsCardKind; level: TWnrsLevel | null; text: string; }
export interface IWnrsLevelMeta { level: TWnrsLevel; name: string; tagline: string; }
export interface IWnrsHistoryEntry {
  id: string; level: TWnrsLevel; card: IWnrsCard;
  asker: TWnrsPlayer; answerer: TWnrsPlayer;
  outcome: TWnrsOutcome; dugDeeper: boolean;
}
```

## 6. Deck building (pure, tested)

Unchanged: `shuffleCards` (Fisher–Yates) and `buildLevelDeck` (wildcards
never first/last, injectable random).

## 7. State machine

```
phase: "select" | "playing" | "levelComplete" | "final"
level, deck, index
asker: TWnrsPlayer            // answerer = the other player
digDeeperUsed: { playerOne, playerTwo }   // reset per level
digDeeperActive: boolean      // until the next advance
history: IWnrsHistoryEntry[]  // whole session; cleared on back-to-levels / play again
names: { playerOne, playerTwo }
```

## 8. UI / components

- `WereNotReallyStrangers.component.tsx` — state + phases.
- `components/WnrsLevelSelect` — names + level cards + Rules.
- `components/WnrsActiveCard` — card face (prompt / wildcard / final).
- `components/WnrsHistoryDrawer` — right drawer: per-player sip tallies,
  All / Skipped-only filter, every card with who drew, who answered or
  skipped, and whether Dig Deeper was used. Exports `countSips`.
- `components/WnrsLevelSummary` — end-of-level panel with per-player sips.
- `components/WnrsRulesDrawer` — left drawer.

Mobile-first: 390px wide is the design target; all primary buttons ≥ 44px
tall, turn banner is a single compact row.

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
- `WereNotReallyStrangers.component.test.tsx` — level select with name
  fields and rules; asker/answerer alternate with custom names; history
  records who drew / answered / skipped with the skipped-only filter; Dig
  Deeper is optional, once per player per level, resets on a new level;
  next-level shortcut at any time and level 3 → final card → play again;
  exhausting a level shows per-player sips; back-to-levels abandons.
- `App.test.tsx` — add a routing assertion for the new menu button.
