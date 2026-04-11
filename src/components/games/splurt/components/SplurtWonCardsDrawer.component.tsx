import { Box, Button, Drawer, Typography } from "@mui/material";

import {
  ISplurtCard,
  ISplurtPlayerNames,
  ISplurtWonPiles,
  TSplurtPile,
} from "../types/splurt.types";

interface ISplurtWonCardsDrawerProps {
  open: boolean;
  onClose: () => void;
  wonPiles: ISplurtWonPiles;
  playerNames: ISplurtPlayerNames;
  setAsideCards: ISplurtWonPiles["playerOne"];
  activePile: TSplurtPile | null;
}

const SplurtWonCardsDrawer = ({
  open,
  onClose,
  wonPiles,
  playerNames,
  setAsideCards,
  activePile,
}: ISplurtWonCardsDrawerProps) => {
  const pileTitle =
    activePile === "playerTwo"
      ? playerNames.playerTwo
      : activePile === "setAside"
        ? "Set Aside"
        : playerNames.playerOne;
  const pileCards: ISplurtCard[] =
    activePile === "playerTwo"
      ? wonPiles.playerTwo
      : activePile === "setAside"
        ? setAsideCards
        : wonPiles.playerOne;
  const pileDescription =
    activePile === "setAside"
      ? pileCards.length === 1
        ? "1 card set aside"
        : `${pileCards.length} cards set aside`
      : pileCards.length === 1
        ? "1 card claimed"
        : `${pileCards.length} cards claimed`;
  const pileBackground =
    activePile === "playerTwo"
      ? "#fde7f7"
      : activePile === "setAside"
        ? "#f2eef6"
        : "#fff1dd";

  return (
    <Drawer
      anchor="right"
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
          {pileTitle}
        </Typography>

        <Typography variant="body1" sx={{ mb: 0 }}>
          {pileDescription}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flex: 1,
            overflowY: "auto",
            paddingRight: 1,
          }}
        >
          {pileCards.length ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
                borderRadius: "24px",
                padding: 2,
                background: pileBackground,
                border: "1px solid rgba(58, 19, 77, 0.12)",
              }}
            >
              {pileCards.map((card, index) => (
                <Box
                  key={card.id}
                  sx={{
                    borderRadius: "20px",
                    padding: 2,
                    background: "#ffffff",
                    border: "1px solid rgba(58, 19, 77, 0.14)",
                    boxShadow: "0 12px 26px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ letterSpacing: "0.15em", mb: 0 }}
                  >
                    Card {pileCards.length - index}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {card.category}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 0 }}>
                    {card.rule}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                borderRadius: "20px",
                padding: 3,
                background: "#ffffff",
                border: "1px solid rgba(58, 19, 77, 0.12)",
              }}
            >
              <Typography variant="body1" sx={{ mb: 0 }}>
                {activePile === "setAside"
                  ? "No cards have been set aside yet."
                  : "No cards have been claimed yet."}
              </Typography>
            </Box>
          )}
        </Box>

        <Button variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default SplurtWonCardsDrawer;
