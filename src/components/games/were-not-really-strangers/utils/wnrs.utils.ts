import { IWnrsCard } from "../types/wnrs.types";

export type TRandom = () => number;

export const shuffleCards = (
  cards: IWnrsCard[],
  random: TRandom = Math.random
): IWnrsCard[] => {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    const current = shuffled[index];

    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = current;
  }

  return shuffled;
};

/**
 * Builds a playable deck for one level: the level's prompts in random order
 * with `wildcardCount` distinct wildcards spliced into interior positions,
 * so a level never opens or closes on a wildcard. Falls back to appending
 * wildcards when there are too few prompts to have an interior.
 */
export const buildLevelDeck = (
  prompts: IWnrsCard[],
  wildcards: IWnrsCard[],
  wildcardCount: number,
  random: TRandom = Math.random
): IWnrsCard[] => {
  const deck = shuffleCards(prompts, random);
  const chosenWildcards = shuffleCards(wildcards, random).slice(
    0,
    Math.max(0, Math.min(wildcardCount, wildcards.length))
  );

  chosenWildcards.forEach((wildcard) => {
    if (deck.length < 2) {
      deck.push(wildcard);
      return;
    }

    // Interior positions are 1 .. deck.length - 1 (inclusive), which keeps
    // index 0 and the final index as prompts.
    const insertAt = 1 + Math.floor(random() * (deck.length - 1));
    deck.splice(insertAt, 0, wildcard);
  });

  return deck;
};
