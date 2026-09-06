import { Box, Button, Typography } from "@mui/material";

import {
  IWnrsLevelMeta,
  TWnrsPlayer,
  TWnrsPlayerNames,
} from "../types/wnrs.types";

interface IWnrsLevelSummaryProps {
  levelMeta: IWnrsLevelMeta;
  answered: number;
  sips: Record<TWnrsPlayer, number>;
  playerNames: TWnrsPlayerNames;
  isLastLevel: boolean;
  onContinue: () => void;
  onOpenHistory: () => void;
  onBackToLevels: () => void;
}

const WnrsLevelSummary = ({
  levelMeta,
  answered,
  sips,
  playerNames,
  isLastLevel,
  onContinue,
  onOpenHistory,
  onBackToLevels,
}: IWnrsLevelSummaryProps) => {
  const totalSips = sips.playerOne + sips.playerTwo;
  const sipLine =
    totalSips === 0
      ? "No skips. Not a single sip owed."
      : `${playerNames.playerOne}: ${sips.playerOne} · ${playerNames.playerTwo}: ${sips.playerTwo} sips owed.`;

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
        {sipLine}
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
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button
            variant="text"
            aria-label="Open history"
            onClick={onOpenHistory}
            sx={{ borderRadius: "999px", color: "#3a134d" }}
          >
            History
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
    </Box>
  );
};

export default WnrsLevelSummary;
