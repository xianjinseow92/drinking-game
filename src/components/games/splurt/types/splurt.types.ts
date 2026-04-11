export type TSplurtCardFace = "category" | "rule";
export type TSplurtPlayer = "playerOne" | "playerTwo";
export type TSplurtPile = TSplurtPlayer | "setAside";

export interface ISplurtCard {
  id: string;
  category: string;
  rule: string;
}

export interface ISplurtWonPiles {
  playerOne: ISplurtCard[];
  playerTwo: ISplurtCard[];
}

export interface ISplurtPlayerNames {
  playerOne: string;
  playerTwo: string;
}
