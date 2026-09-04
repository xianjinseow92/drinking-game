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
      PaperProps={{
        sx: {
          backgroundColor: "#fff7fb",
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
            Pick a level. Take turns reading the card out loud and answering.
            Everyone answers every card.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Honesty is the whole game. Short answers are fine. Silence is fine.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>Skip a card, take a sip.</b> That's the only drinking rule.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Wildcards are instructions, not questions. Do what the card says.
          </Typography>
        </Box>

        <Box sx={panelStyles}>
          <Typography variant="h5" sx={{ mb: 0 }}>
            The Levels
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>1 · Perception</b> — what you assume about each other.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>2 · Connection</b> — the stories underneath.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            <b>3 · Reflection</b> — what tonight changed.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            After level 3, there's one final card. Don't skip that one.
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
