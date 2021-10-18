import { lazy } from "react";

// Types
import { IPath } from "types/types";
// Constants
import { gameNames } from "constants/constants";

// Games / Components
const GameSelectPage = lazy(() => import("components/GameSelectPage"));
// All Routes
export const mainPage = "/drinking-game";
const routes: IPath[] = [
  { name: mainPage, component: GameSelectPage },
];

export default routes;
