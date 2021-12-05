// UI-Components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

// Icons
import AlarmIcon from "@mui/icons-material/Alarm";

// Custom Components
import Drawer from "@mui/material/Drawer";

// Typography
import { Typography } from "@mui/material";
import React from "react";

const TimerChangeButtons = (props: any) => {
  const { timerStarted, setCountdownSeconds } = props;
  const countdownSecondsOptions = [3, 4, 5];
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  const toggleDrawer =
    (open: any) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setDrawerIsOpen(open);
    };

  const setCountdownSecs = (e: any) => {
    const buttonNumber = +e.target.outerText;
    setCountdownSeconds(+buttonNumber); // set seconds for countdown timer to use
    setDrawerIsOpen(false); // close drawer after option selected
  };

  const countdownTimersInterface = () => {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          backgroundColor: "transparent",
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: 0 }}>
          Select Difficulty
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {countdownSecondsOptions.map((second) => {
            return (
              <Button
                onClick={setCountdownSecs}
                variant="contained"
                color="secondary"
                disabled={timerStarted}
                key={second}
                size="small"
              >
                {second}
              </Button>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        position: "absolute",
        right: "5px",
        bottom: "0px",
        zIndex: 1000,
      }}
    >
      <IconButton
        color="secondary"
        onClick={toggleDrawer(true)}
        disabled={timerStarted}
        size="large"
      >
        <AlarmIcon fontSize="large" />
      </IconButton>
      <Drawer
        anchor={"bottom"}
        open={drawerIsOpen}
        onClose={toggleDrawer(false)}
      >
        {countdownTimersInterface()}
      </Drawer>
    </Box>
  );
};

export default TimerChangeButtons;
