import { Box, Button, Typography } from "@mui/material";

import { IWnrsLevelMeta } from "../types/wnrs.types";

interface IWnrsLevelSummaryProps {
  levelMeta: IWnrsLevelMeta;
  answered: number;
  skipped: number;
  isLastLevel: boolean;
  onContinue: () => void;
  onBackToLevels: () => void;
}

const WnrsLevelSummary = ({
  levelMeta,
  answered,
  skipped,
  isLastLevel,
  onContinue,
  onBackToLevels,
}: IWnrsLevelSummaryProps) => {
  const skipLine =
    skipped === 0
      ? "No skips. Not a single sip owed."
      : skipped === 1
        ? "1 card skipped. That's one sip owed."
        : `${skipped} cards skipped. That's ${skipped} sips owed.`;

  return (
    <Box
      sx={{
        width: { xs: "min(92vw, 340px)", sm: 400, md: 460 },
        borderRadius: "28px",
        padding: { xs: 3, md: 4 },
        background: "#fff7fb",
        color: "#3a134d",
        boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        textAlign: "center",
      }}
    >
      <Typography variant="overline" sx={{ mb: 0, letterSpacing: "0.2em" }}>
        Level {levelMeta.level} complete
      </Typography>
      <Typography variant="h3" sx={{ mb: 0, fontWeight: 800 }}>
        {levelMeta.name}
      </Typography>
      <Typography variant="body1" sx={{ mb: 0 }}>
        {answered === 1 ? "1 card answered." : `${answered} cards answered.`}
      </Typography>
      <Typography variant="body1" sx={{ mb: 0 }}>
        {skipLine}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          marginTop: 1,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={onContinue}
          sx={{ borderRadius: "999px", minHeight: 52 }}
        >
          {isLastLevel
            ? "Reveal the final card"
            : `Continue to level ${levelMeta.level + 1}`}
        </Button>
        <Button
          variant="text"
          onClick={onBackToLevels}
          sx={{ borderRadius: "999px", color: "#3a134d" }}
        >
          Back to levels
        </Button>
      </Box>
    </Box>
  );
};

export default WnrsLevelSummary;
