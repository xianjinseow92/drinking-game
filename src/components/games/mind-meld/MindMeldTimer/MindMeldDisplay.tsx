import Typography from "@mui/material/Typography";
import { getRandomElementFromArray } from "helpers/helpers";
/**
 * A display above the countdown timer that changes depending on whether they are on the 2 person word-spit stage or 2 person similar-word stage.
 * 2 person word-spit stage: "Get ready to shout the first thing that comes to your mind..."
 * 2 person comon-word stage: A display that randomizes, "C'mon, get your similarities pumpin!!" / "WHAT THE COMMON THANG" / "CHANNEL YOUR INNER COMPATIBILITIES"
 * 
 * Text to display controlled by passing data from parent MildMeldMain
 */
const MildMeldDisplay = ({ isWordSpitStage }: { isWordSpitStage: boolean }) => {
  const wordSpitStagePrompts = [
    "Cough up a random word!",
    "Mmm... what rhymes with orange...",
    "Just... say anything, really",
  ]; // prompts before timer begins
  const similarWordStagePrompts = [
    "C'mon, get your similarities pumpin!!",
    "WHAT THE COMMON THANG!!",
    "CHANNEL YOUR INNER COMPATIBILTIES",
    "ACTIVATE TELEPATHIC POWERS"
  ]; // prompts when timer is counting down
  return (
    <Typography variant="h1" style={{fontWeight: "bold"}}>
      {isWordSpitStage
        ? getRandomElementFromArray(wordSpitStagePrompts)
        : getRandomElementFromArray(similarWordStagePrompts)}
    </Typography>
  );
};

export default MildMeldDisplay;
