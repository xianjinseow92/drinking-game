// Route-related
import { useHistory } from "react-router";
import { allGameRoutes } from "routes";

// Layout
import PageLayout from "layout/PageLayout.component";

// UI Components
import Button from "@mui/material/Button";

// Constants / Helpers
import { cleanKebabString, removeAllSlashes } from "helpers/helpers";

// Typography
import { Typography } from "@mui/material";

/**
 * Component serves as a Welcome Page & Control Panel to allow users to choose the game they want to play.
 * Upon selection of game, user should be re-directed to Selected Game via Route Navigation
 * @param props
 * @returns React.FC Component
 */

const GameSelectPage = (props: any) => {
  // styles
  const marginBottom = "10px";

  // hooks
  const history = useHistory();

  // functions
  const goToGame = (gamePath: string) => {
    history.push(gamePath);
  };

  return (
    // Game Grid
    <PageLayout>
      <Typography
        variant="h1"
        sx={{ textAlign: "center", marginBottom: "20px" }}
      >
        <b>Welcome to ze best drinking game of yo LIFE!</b>
      </Typography>

      {/* All Buttons to Games */}
      {allGameRoutes.map((gameRoute) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={goToGame.bind(this, gameRoute.name)}
          sx={{marginBottom: marginBottom}}
        >
          {removeAllSlashes(cleanKebabString(gameRoute.name))}
        </Button>
      ))}
    </PageLayout>
  );
};

export default GameSelectPage;
