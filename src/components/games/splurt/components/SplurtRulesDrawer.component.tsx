import { Box, Button, Drawer, Typography } from "@mui/material";

interface ISplurtRulesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SplurtRulesDrawer = ({ open, onClose }: ISplurtRulesDrawerProps) => {
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
        }}
      >
        <Typography variant="h3" sx={{ mb: 0 }}>
          How To Play
        </Typography>

        <Box
          sx={{
            borderRadius: "20px",
            padding: 2.5,
            background: "#ffffff",
            border: "1px solid rgba(58, 19, 77, 0.12)",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Typography variant="body1" sx={{ mb: 0 }}>
            Draw a card from the deck.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Flip it to see both the category and the word rule.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Both players race to say a word that fits both sides.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            The player who gets it first taps their win button.
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Most cards at the end wins.
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: "20px",
            padding: 2.5,
            background: "#ffffff",
            border: "1px solid rgba(58, 19, 77, 0.12)",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h5" sx={{ mb: 0 }}>
            Card Examples
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Category: A musical instrument
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Rule: Starting with T
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Rule: Ending with E
          </Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>
            Rule: 3 syllables
          </Typography>
        </Box>

        <Button variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default SplurtRulesDrawer;
