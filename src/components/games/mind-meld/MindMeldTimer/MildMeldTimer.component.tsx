import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Howl } from "howler";

// UI-Components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Sound
import ohMaGod from "assets/audio/ohmyGODD.mp3";

/**
 * * A countdown timer that counts down from 3 to 0 after button is clicked each time.
 * Contains countdown logic
 ** Passes data back up to controller
 ** contains 2 control variables
 *** isWordSpitStage
 * Contains button that changes based on what stage of countdown
 * Countdown logic:
 * timerStarted is tagged to handling isWordSpitStage, diabling of button and text content of button
 */
const MindMeldTimer = (props: any) => {
  const { handleIsWordSpitStage, countdownSeconds = 3 } = props;
  const [seconds, setSeconds] = useState(countdownSeconds); // for updating displayed seconds and when to stop timer
  const [timerStarted, setTimerStarted] = useState(false); // control for starting and stopping the timer
  const sound = new Howl({
    src: [ohMaGod]
  });

  // countdown timer logic
  useEffect(() => {
    let timer: any = null;

    // Countdown when timer has started
    if (timerStarted) {
      timer = setInterval(() => {
        setSeconds((prevSeconds: any) => prevSeconds - 1);
      }, 1000);
    }

    // Stops timer from counting down again when it resets from 0 to countdownSeconds
    if (!timerStarted) {
      clearInterval(timer);
    }

    // clear interval set outside instead of inside the interval.
    // obviously you don't set clearInterval inside the interval itself
    if (seconds <= 0) {
      clearInterval(timer);
      // sets a timer reset (variable to stop timer from running again when hits 3)
      // because when seconds is set to countdownSeconds with useState
      // useEffect code runs again and sets another interval, therefore starting our countdown again
      // so we quickly clear the timer (interval) when the code runs again
      // to prevent countdown when
      sound.play();
      setTimerStarted(false); // stop timer
      setSeconds(countdownSeconds); // set
    }

    return () => clearInterval(timer); // to clear interval when component unmounts
  }, [seconds, countdownSeconds, timerStarted]);

  // Begins timer
  const startTimer = () => {
    setTimerStarted(true);
  };

  // Logic for passing data back up to controller to control display
  if (timerStarted) {
    handleIsWordSpitStage(false);
  } else {
    handleIsWordSpitStage(true);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5">
        Countdown to Dranks:{" "}
        <Typography variant="h4" sx={{ marginBottom: 0 }}>
          <b>{seconds}</b>
        </Typography>
      </Typography>
      <Button
        onClick={startTimer}
        variant="contained"
        color="secondary"
        disabled={timerStarted}
      >
        {timerStarted
          ? "Get those creative juices flowin!!"
          : "START ZE COUNTDOWN!"}
      </Button>
    </Box>
  );
};

export default MindMeldTimer;
