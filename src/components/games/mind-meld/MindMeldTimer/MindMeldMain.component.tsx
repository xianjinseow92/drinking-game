// Custom Components
import MindMeldTimer from "./MildMeldTimer.component";
import MildMeldDisplay from "./MindMeldDisplay";

import { useState } from "react";
/**
 * Controller that passes data from timer to display.
 * Purpose of this component is to Set a timer for users to...
 * First shout a new word together
 * Second, shout a word that joins both words
    * Control variable that decides "is wordSpit / isNotWordSpit (aka similar-word)" stage
    * There should be...
        * A countdown timer that counts down from 3 to 0 after button is clicked each time.
            * Contains countdown logic
            * Contains button that changes based on what stage of countdown logic
            * if isCountingDown === disabled
            * Changes content based on whether user is at 2 person word-spit stage or 2 person similar-word stage
            * Countdown logic:
                * isCountingDown: inbetween 3 - 0 seconds
        * A display above the countdown timer that changes depending on whether they are on the 2 person word-spit stage or 2 person similar-word stage
            * 2 person word-spit stage: "Get ready to shout the first thing that comes to your mind..."
            * 2 person comon-word stage: A display that randomizes, "C'mon, get your similarities pumpin!!" / "WHAT THE COMMON THANG" / "CHANNEL YOUR INNER COMPATIBILITIES"
 * @param props
 * @returns React.FC
 */
const MindMeldMain = (props: any) => {
  const [isWordSpitStage, setIsWordSpitStage] = useState(true); // set to true because we always start the game with word-spit stage

  const handleIsWordSpitStage = (isWordSpitStage: boolean) => {
    setIsWordSpitStage(isWordSpitStage);
  }

  return <>
    <MildMeldDisplay isWordSpitStage={isWordSpitStage}/>
    <MindMeldTimer handleIsWordSpitStage={handleIsWordSpitStage}/>
  </>;
};

export default MindMeldMain;