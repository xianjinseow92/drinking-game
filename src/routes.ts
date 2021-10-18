import { lazy } from "react";

// Types
import { IPath } from "types/types";
// Constants
import { gameNames } from "constants/constants";

// Games / Components
const GameSelectPage = lazy(() => import("components/GameSelectPage"));
// All Routes
const routes: IPath[] = [
  { name: "/drinking-game", component: GameSelectPage },
];

export default routes;
