import { useState } from "react";

import { Box, Button, Drawer, Typography } from "@mui/material";

import {
  IWnrsHistoryEntry,
  TWnrsPlayer,
  TWnrsPlayerNames,
} from "../types/wnrs.types";

interface IWnrsHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: IWnrsHistoryEntry[];
  playerNames: TWnrsPlayerNames;
}

export const countSips = (
  history: IWnrsHistoryEntry[]
): Record<TWnrsPlayer, number> => {
  return history.reduce(
    (totals, entry) => {
      if (entry.outcome === "skipped") {
        totals[entry.answerer] += 1;
      }
      return totals;
    },
    { playerOne: 0, playerTwo: 0 } as Record<TWnrsPlayer, number>
  );
};

const WnrsHistoryDrawer = ({
  open,
  onClose,
  history,
  playerNames,
}: IWnrsHistoryDrawerProps) => {
  const [showSkippedOnly, setShowSkippedOnly] = useState(false);
  const sips = countSips(history);
  const skippedCount = history.filter((entry) => entry.outcome === "skipped").length;
  const newestFirst = [...history]
    .reverse()
    .filter((entry) => !showSkippedOnly || entry.outcome === "skipped");

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
          width: { xs: "100vw", sm: 380, md: 440 },
          height: "100%",
          padding: { xs: 2.5, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography variant="h3" sx={{ mb: 0, fontSize: { xs: "2rem", md: "3rem" } }}>
          History
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {(["playerOne", "playerTwo"] as TWnrsPlayer[]).map((player) => (
            <Box
              key={player}
              sx={{
                borderRadius: "16px",
                padding: 1.5,
                background: player === "playerOne" ? "#fff1dd" : "#fde7f7",
                border: "1px solid rgba(58, 19, 77, 0.12)",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 0, fontWeight: 700, lineHeight: 1.2 }}
              >
                {playerNames[player]}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 0, opacity: 0.85 }}
                aria-label={`${playerNames[player]} sips`}
              >
                {sips[player] === 1 ? "1 sip" : `${sips[player]} sips`}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant={showSkippedOnly ? "text" : "contained"}
            color="secondary"
            aria-pressed={!showSkippedOnly}
            onClick={() => setShowSkippedOnly(false)}
            sx={{ borderRadius: "999px", flex: 1, color: showSkippedOnly ? "#3a134d" : undefined }}
          >
            All ({history.length})
          </Button>
          <Button
            size="small"
            variant={showSkippedOnly ? "contained" : "text"}
            color="secondary"
            aria-pressed={showSkippedOnly}
            onClick={() => setShowSkippedOnly(true)}
            sx={{ borderRadius: "999px", flex: 1, color: showSkippedOnly ? undefined : "#3a134d" }}
          >
            Skipped ({skippedCount})
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
            overflowY: "auto",
            paddingRight: 0.5,
          }}
        >
          {newestFirst.length ? (
            newestFirst.map((entry) => (
              <Box
                key={entry.id}
                data-testid="history-entry"
                sx={{
                  borderRadius: "18px",
                  padding: 1.75,
                  background: "#ffffff",
                  border: "1px solid rgba(58, 19, 77, 0.14)",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ mb: 0, letterSpacing: "0.14em", textAlign: "left", lineHeight: 1.6 }}
                >
                  L{entry.level} · {entry.card.kind === "wildcard" ? "Wildcard" : "Card"} ·{" "}
                  {playerNames[entry.asker]} drew
                </Typography>
                <Typography
                  variant="body1"
                  data-testid="history-card-text"
                  sx={{ mb: 0.75, fontWeight: 600, lineHeight: 1.3, textAlign: "left" }}
                >
                  {entry.card.text}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0,
                    textAlign: "left",
                    color: entry.outcome === "skipped" ? "#b0004f" : "#3a134d",
                    fontWeight: entry.outcome === "skipped" ? 700 : 400,
                  }}
                >
                  {entry.outcome === "skipped"
                    ? `${playerNames[entry.answerer]} skipped · sip`
                    : `${playerNames[entry.answerer]} answered`}
                  {entry.dugDeeper ? " · dug deeper" : ""}
                </Typography>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                borderRadius: "18px",
                padding: 2.5,
                background: "#ffffff",
                border: "1px solid rgba(58, 19, 77, 0.12)",
              }}
            >
              <Typography variant="body1" sx={{ mb: 0 }}>
                {showSkippedOnly ? "No skips yet. Brave." : "Nothing yet. Draw a card."}
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

export default WnrsHistoryDrawer;
