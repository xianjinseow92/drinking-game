# We're Not Really Strangers — Implementation Plan

Spec: `docs/superpowers/specs/2026-09-04-were-not-really-strangers-design.md`

Each task is TDD-shaped: write/extend the test, watch it fail, implement,
watch it pass, commit.

- [x] **Task 1 — Types + data.** `types/wnrs.types.ts`, `data/wnrsCards.ts`
      (levels meta, ~15 original prompts per level, 8 wildcards, final card).
- [x] **Task 2 — Deck utils (pure).** `utils/wnrs.utils.ts` with
      `shuffleCards` and `buildLevelDeck`; `utils/wnrs.utils.test.ts`.
- [x] **Task 3 — Presentational components.** `WnrsActiveCard`,
      `WnrsLevelSelect`, `WnrsLevelSummary`, `WnrsRulesDrawer`.
- [x] **Task 4 — Main component + state machine.**
      `WereNotReallyStrangers.component.tsx` + component test covering the
      full flow (select → L1 → L2 → L3 → final → select).
- [x] **Task 5 — Wiring.** constants, routes (with `label`), `IPath.label`,
      GameSelectPage, README; extend `App.test.tsx`.
- [x] **Task 6 — Verify.** `npm test -- --watchAll=false`, `npx tsc --noEmit`,
      `npm run build`; smoke the route in a headless browser.

## v2 — dating flow (2026-09-06)

Owner review found the v1 rules wrong (everyone answered every card). Fixed
to the official one-asks-one-answers flow and tuned for dating on mobile.

- [x] Player names on level select; turn banner (asks → answers), roles swap per card.
- [x] Dig Deeper: one per player per level, optional, resets per level.
- [x] Next-level / final-card shortcut at any time (no 15-card minimum, by owner's call).
- [x] History log: who drew, who answered/skipped, dig-deeper flag; skipped-only filter; per-player sip tallies.
- [x] Level summary shows per-player sips. Final card asks both to write.
- [x] Rules drawer rewritten; mobile spacing tightened.
- [x] Routing: router rooted at PUBLIC_URL so deep links work on GitHub Pages.
- [x] Player identity colours + tags; twin Skip / Dig Deeper pills; icon tab-bar footer; opaque drawers.
- [x] History: Answered-by filter; tap an entry to enlarge the card in an overlay (tap outside to close).

## v3 — card focus mode (2026-09-09)

Owner asked for an immersive moment: the card itself should open full-size on
a darkened room so the pair can sit with the question while answering.

- [x] `WnrsCardOverlay` extracted and shared by the game screen and History,
      so both enlarge views stay identical.
- [x] The active card is the control: tap, Enter or Space opens it; the
      backdrop is near-solid and blurred so the chrome behind stops reading.
- [x] The focus face is a larger size variant, with the turn line carried into
      the overlay. Tap anywhere outside, or press Escape, to close.
- [x] Wildcard turn line reads "<player> does what it says." (the old copy left
      a floating space before the comma).
