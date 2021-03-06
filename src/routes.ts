import { lazy } from "react";

// Types
import { IPath } from "types/types";

// Constants
import { gameNames } from "constants/constants";

// Helpers
import { getOnlyGameRoutes } from "helpers/helpers";

// Games / Components
const GameSelectPage = lazy(() => import("components/GameSelectPage"));
const HigherOrLowerGameBoard = lazy(
  () => import("components/games/higher-or-lower/HigherOrLower.component")
);
const MindMeld = lazy(() => import("components/games/mind-meld/MindMeld.component"));

// All Routes
export const mainPage = "/drinking-game";
const routes: IPath[] = [
  { name: mainPage, component: GameSelectPage },
  { name: gameNames.higherOrLower, component: HigherOrLowerGameBoard },
  { name: gameNames.mindMeld, component: MindMeld },

];

const nonGameRoutes = [mainPage];

export const allGameRoutes = getOnlyGameRoutes(routes, nonGameRoutes);

export default routes;
