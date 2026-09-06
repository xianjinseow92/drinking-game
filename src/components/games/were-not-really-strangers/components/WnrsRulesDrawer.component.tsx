import { Box, Button, Drawer, Typography } from "@mui/material";

interface IWnrsRulesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const panelStyles = {
  borderRadius: "20px",
  padding: 2.5,
  background: "#ffffff",
  border: "1px solid rgba(58, 19, 77, 0.12)",
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
} as const;

const WnrsRulesDrawer = ({ open, onClose }: IWnrsRulesDrawerProps) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      // The app theme makes drawer paper 30% translucent; override at the
      // same specificity so this drawer is solid and readable.
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "#fff7fb",
          backgroundImage: "none",
          color: "#3a134d",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: "100vw", sm: 360, md: 420 },
          height: "100%",
          padding: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="h3" sx={{ mb: 0 }}>
          How To Play
        </Typography>

        <Box sx={panelStyles}>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Sit across from each other. Phones down, except this one.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>One of you draws and reads the card out loud. The other answers.</b>{" "}
            Then you swap. The app tracks whose turn it is.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Honesty is the whole game. Short answers are fine. Silence is fine.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>Skip a card, take a sip.</b> The person who was meant to answer drinks.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>Dig Deeper.</b> Once per level, the asker can push the answer one
            layer further. Use it when the answer felt safe. Never required.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>Wildcards</b> are instructions, not questions. The answerer does what it says.
          </Typography>
        </Box>

        <Box sx={panelStyles}>
          <Typography variant="h5" sx={{ mb: 0 }}>
            The Levels
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>1 · Perception</b> — first impressions and what you assume about each other.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>2 · Connection</b> — the stories underneath.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>3 · Reflection</b> — look back on the game you just played.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Move up a level whenever you both feel ready. There's no minimum. After
            level 3 there's one final card, and you both write a note.
          </Typography>
        </Box>

        <Button variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default WnrsRulesDrawer;
