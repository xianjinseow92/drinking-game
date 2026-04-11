import { Box, Button, CircularProgress, Typography } from "@mui/material";

interface ISplurtDeckProps {
  remainingCards: number;
  onDrawCard: () => void;
  isDrawing: boolean;
  canDrawCard: boolean;
  onResetGame: () => void;
}

const SplurtDeck = ({
  remainingCards,
  onDrawCard,
  isDrawing,
  canDrawCard,
  onResetGame,
}: ISplurtDeckProps) => {
  const shouldShowReset = remainingCards === 0;

  return (
    <Box
      sx={{
        position: { xs: "relative", md: "absolute" },
        top: { md: 16 },
        left: { md: 16 },
        transform: { md: "none" },
        zIndex: 2,
        width: { xs: "100%", md: "auto" },
        display: "flex",
        justifyContent: { xs: "center", md: "flex-start" },
        marginBottom: { xs: 1, md: 0 },
      }}
    >
      <Box
        sx={{
          width: { xs: 196, sm: 116, md: 132 },
          height: { xs: 68, sm: 150, md: 168 },
          position: "relative",
          cursor: shouldShowReset ? "default" : "pointer",
        }}
      >
        {[10, 5, 0].map((offset) => (
          <Box
            key={offset}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              border: "2px solid rgba(255,255,255,0.45)",
              transform: {
                xs: `translate(${offset * 0.7}px, 0px)`,
                sm: `translate(${offset}px, ${offset * 0.7}px)`,
              },
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
              boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
            }}
          />
        ))}

        <Button
          variant="contained"
          color="secondary"
          aria-label={shouldShowReset ? "Reshuffle Splurt deck" : "Draw from Splurt deck"}
          onClick={shouldShowReset ? onResetGame : onDrawCard}
          disabled={isDrawing || (!canDrawCard && !shouldShowReset)}
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            display: "flex",
            flexDirection: { xs: "row", sm: "column" },
            justifyContent: "center",
            gap: { xs: 0.9, sm: 1 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
            textTransform: "none",
            fontWeight: 700,
            letterSpacing: "0.04em",
            paddingX: { xs: 1.5, sm: 0 },
          }}
        >
          {isDrawing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 0, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                SPLURT
              </Typography>
              <Typography variant="body2" sx={{ mb: 0, fontSize: { xs: "0.78rem", sm: "0.875rem" } }}>
                {shouldShowReset ? "Reshuffle deck" : "Draw card"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0, fontSize: { xs: "0.78rem", sm: "0.875rem" } }}>
                {remainingCards} left
              </Typography>
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SplurtDeck;
