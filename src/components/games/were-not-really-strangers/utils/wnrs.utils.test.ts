import { IWnrsCard } from "../types/wnrs.types";
import { buildLevelDeck, shuffleCards } from "./wnrs.utils";

const makePrompts = (count: number): IWnrsCard[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `p-${index + 1}`,
    kind: "prompt",
    level: 1,
    text: `Prompt ${index + 1}`,
  }));

const makeWildcards = (count: number): IWnrsCard[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `w-${index + 1}`,
    kind: "wildcard",
    level: null,
    text: `Wildcard ${index + 1}`,
  }));

// A tiny deterministic generator so shuffles are reproducible in tests.
const makeSeededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

describe("shuffleCards", () => {
  test("returns a new array with the same cards", () => {
    const prompts = makePrompts(10);
    const shuffled = shuffleCards(prompts, makeSeededRandom(7));

    expect(shuffled).not.toBe(prompts);
    expect(shuffled).toHaveLength(prompts.length);
    expect(shuffled.map((card) => card.id).sort()).toEqual(
      prompts.map((card) => card.id).sort()
    );
  });

  test("is deterministic for the same random source", () => {
    const prompts = makePrompts(12);

    expect(shuffleCards(prompts, makeSeededRandom(3))).toEqual(
      shuffleCards(prompts, makeSeededRandom(3))
    );
  });
});

describe("buildLevelDeck", () => {
  test("contains every prompt plus the requested number of distinct wildcards", () => {
    const prompts = makePrompts(15);
    const wildcards = makeWildcards(8);

    for (let seed = 1; seed <= 25; seed += 1) {
      const deck = buildLevelDeck(prompts, wildcards, 2, makeSeededRandom(seed));
      const promptIds = deck
        .filter((card) => card.kind === "prompt")
        .map((card) => card.id)
        .sort();
      const wildcardIds = deck
        .filter((card) => card.kind === "wildcard")
        .map((card) => card.id);

      expect(deck).toHaveLength(17);
      expect(promptIds).toEqual(prompts.map((card) => card.id).sort());
      expect(wildcardIds).toHaveLength(2);
      expect(new Set(wildcardIds).size).toBe(2);
    }
  });

  test("never places a wildcard first or last", () => {
    const prompts = makePrompts(6);
    const wildcards = makeWildcards(8);

    for (let seed = 1; seed <= 200; seed += 1) {
      const deck = buildLevelDeck(prompts, wildcards, 3, makeSeededRandom(seed));

      expect(deck[0].kind).toBe("prompt");
      expect(deck[deck.length - 1].kind).toBe("prompt");
    }
  });

  test("caps wildcards at the number available", () => {
    const deck = buildLevelDeck(makePrompts(5), makeWildcards(1), 4, makeSeededRandom(9));

    expect(deck.filter((card) => card.kind === "wildcard")).toHaveLength(1);
  });

  test("appends wildcards when there are too few prompts to interleave", () => {
    const deck = buildLevelDeck(makePrompts(1), makeWildcards(2), 2, makeSeededRandom(4));

    expect(deck.map((card) => card.kind)).toEqual(["prompt", "wildcard", "wildcard"]);
  });

  test("does not mutate its inputs", () => {
    const prompts = makePrompts(5);
    const wildcards = makeWildcards(3);
    const promptsSnapshot = [...prompts];
    const wildcardsSnapshot = [...wildcards];

    buildLevelDeck(prompts, wildcards, 2, makeSeededRandom(11));

    expect(prompts).toEqual(promptsSnapshot);
    expect(wildcards).toEqual(wildcardsSnapshot);
  });
});
