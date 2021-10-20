export interface ICard {
  image: string;
  value: string;
  suit: string;
  code: string;
}

export interface IDeck {
  success: boolean;
  shuffled: boolean;
  cards: ICard[];
  deck_id: string;
  remaining: number;
}

export interface IPath {
  name: string;
  component: React.FC;
}
