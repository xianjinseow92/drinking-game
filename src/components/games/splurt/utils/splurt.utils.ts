import { ISplurtCard } from "../types/splurt.types";

export const shuffleSplurtCards = (cards: ISplurtCard[]): ISplurtCard[] => {
  const shuffledCards = [...cards];

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentCard = shuffledCards[index];

    shuffledCards[index] = shuffledCards[randomIndex];
    shuffledCards[randomIndex] = currentCard;
  }

  return shuffledCards;
};

export const buildSplurtCards = (
  categories: string[],
  rules: string[],
  totalCards: number
): ISplurtCard[] => {
  return Array.from({ length: totalCards }, (_, index) => {
    return {
      id: `splurt-card-${index + 1}`,
      category: categories[index % categories.length],
      rule: rules[(index * 7 + 3) % rules.length],
    };
  });
};
