export type TWnrsLevel = 1 | 2 | 3;
export type TWnrsCardKind = "prompt" | "wildcard" | "final";
export type TWnrsPhase = "select" | "playing" | "levelComplete" | "final";
export type TWnrsLastAction = "answered" | "skipped" | null;
export type TWnrsPlayer = "playerOne" | "playerTwo";

export interface IWnrsCard {
  id: string;
  kind: TWnrsCardKind;
  level: TWnrsLevel | null;
  text: string;
}

export interface IWnrsLevelMeta {
  level: TWnrsLevel;
  name: string;
  tagline: string;
}

export type TWnrsPromptsByLevel = Record<TWnrsLevel, IWnrsCard[]>;
export type TWnrsPlayerNames = Record<TWnrsPlayer, string>;
export type TWnrsPlayerFlags = Record<TWnrsPlayer, boolean>;

export type TWnrsOutcome = "answered" | "skipped";

export interface IWnrsHistoryEntry {
  id: string;
  level: TWnrsLevel;
  card: IWnrsCard;
  asker: TWnrsPlayer;
  answerer: TWnrsPlayer;
  outcome: TWnrsOutcome;
  dugDeeper: boolean;
}
