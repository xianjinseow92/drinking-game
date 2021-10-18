// Route-related
import { useHistory } from "react-router";

// Layout
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// UI Components
import Button from "@mui/material/Button";

// Constants / Helpers
import { cleanKebabString, removeAllSlashes } from "helpers/helpers";
import { gameNames } from "constants/constants";

/**
 * Component serves as a Welcome Page & Control Panel to allow users to choose the game they want to play.
 * Upon selection of game, user should be re-directed to Selected Game via Route Navigation
 * @param props
 * @returns React.FC Component
 */
const GameSelectPage = (props: any) => {
  const history = useHistory();

  const goToHigherOrLowerGame = () => {
    history.push(gameNames.higherOrLower);
  };

  return (
    // Game Grid
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box sx={{ bgcolor: "#cfe8fc", color: "black" }}>xs=12, md=6</Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ bgcolor: "#cfe8fc", color: "black" }}>xs=12, md=6</Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          color="primary"
          onClick={goToHigherOrLowerGame}
        >
          {removeAllSlashes(cleanKebabString(gameNames.higherOrLower))}
        </Button>
      </Grid>
    </Grid>
  );
};

export default GameSelectPage;
