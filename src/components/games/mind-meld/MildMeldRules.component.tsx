// Typography
import { Typography } from "@mui/material";

// Components
import Button from "@mui/material/Button";

const MildMeldRules = (props: any) => {
  const { onStart, countdownSeconds } = props;
  return (
    <>
      <Typography variant="h1">
        <b>RULES</b>
      </Typography>

      <Typography variant="subtitle1">
        Players have to look at each other, count to {countdownSeconds}, then
        say a word.
      </Typography>

      <Typography variant="subtitle1">
        The premise of the game is to then say a word that <b>coincides</b> with
        the words that you guys have just mentioned.
      </Typography>

      <Typography variant="subtitle1">
        For example, someone says <b>“ball”</b> and the other player says{" "}
        <b>“dog”</b>, a resulting common word could be <b>“Fetch”</b>!
      </Typography>

      <Typography variant="subtitle1">
        Each time the announced word doesn’t match, the players have to{" "}
        <b>take a drink.</b>
      </Typography>

      <Typography variant="subtitle1">Pretty simple, aye?</Typography>

      <Button variant="contained" color="secondary" onClick={onStart}>
        Let's begin shall we?
      </Button>
    </>
  );
};

export default MildMeldRules;
