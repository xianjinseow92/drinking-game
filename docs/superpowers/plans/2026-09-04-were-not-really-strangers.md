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
- [ ] **Task 6 — Verify.** `npm test -- --watchAll=false`, `npx tsc --noEmit`,
      `npm run build`; smoke the route in a headless browser.
