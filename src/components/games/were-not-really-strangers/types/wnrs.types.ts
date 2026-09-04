export type TWnrsLevel = 1 | 2 | 3;
export type TWnrsCardKind = "prompt" | "wildcard" | "final";
export type TWnrsPhase = "select" | "playing" | "levelComplete" | "final";
export type TWnrsLastAction = "answered" | "skipped" | null;

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
