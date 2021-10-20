// Route-related
import { useHistory } from "react-router";

// Layout
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

// UI Components
import Button from "@mui/material/Button";

// Constants / Helpers
import { cleanKebabString, removeAllSlashes } from "helpers/helpers";
import { gameNames } from "constants/constants";

// Typography
import { Typography } from "@mui/material";

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
    <Container component="section">
      <Box sx={{width: "100%", display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h3"
          sx={{ textAlign: "center", marginBottom: "20px" }}
        >
          Welcome to ze best drinking game of yo LIFE!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={goToHigherOrLowerGame}
        >
          {removeAllSlashes(cleanKebabString(gameNames.higherOrLower))}
        </Button>
      </Box>

      {/* <Grid container spacing={3}>
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
      </Grid> */}
    </Container>
  );
};

export default GameSelectPage;
