// Typography
import { Typography } from "@mui/material";

// UI-Components
import Button from "@mui/material/Button";

// Custom-Components
import MindMeldMain from "./MindMeldTimer/MindMeldMain.component";

const BeginMindMeld = (props: any) => {
  const { onClick, countdownSeconds, setCountdownSeconds } = props;
  return (
    <>
      <MindMeldMain countdownSeconds={countdownSeconds} setCountdownSeconds={setCountdownSeconds}/>
      <Button
        variant="contained"
        color="secondary"
        onClick={onClick}
        sx={{ position: "fixed", top: "10px", right: "10px" }}
      >
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: 0, fontSize: "0.8rem" }}
        >
          ... If you ever need the rules again
        </Typography>
      </Button>
    </>
  );
};

export default BeginMindMeld;
