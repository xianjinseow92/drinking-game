import { useState } from "react";

import { Box, Button, Drawer, Typography } from "@mui/material";

import {
  IWnrsHistoryEntry,
  TWnrsPlayer,
  TWnrsPlayerNames,
} from "../types/wnrs.types";
import { playerColors } from "../utils/wnrs.players";
import WnrsPlayerTag from "./WnrsPlayerTag.component";

interface IWnrsHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: IWnrsHistoryEntry[];
  playerNames: TWnrsPlayerNames;
}

type TOutcomeFilter = "all" | "skipped";
type TPlayerFilter = "both" | TWnrsPlayer;

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

const filterChipStyles = (active: boolean, accent?: string) =>
  ({
    borderRadius: "999px",
    minHeight: 36,
    paddingX: 1.5,
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.82rem",
    color: "#3a134d",
    background: active ? accent ?? "#ff5c01" : "rgba(58, 19, 77, 0.06)",
    border: `1px solid ${active ? "transparent" : "rgba(58, 19, 77, 0.18)"}`,
    "&:hover": { background: active ? accent ?? "#ff5c01" : "rgba(58, 19, 77, 0.12)" },
    ...(active && !accent ? { color: "#fff7fb" } : {}),
  }) as const;

const WnrsHistoryDrawer = ({
  open,
  onClose,
  history,
  playerNames,
}: IWnrsHistoryDrawerProps) => {
  const [outcomeFilter, setOutcomeFilter] = useState<TOutcomeFilter>("all");
  const [playerFilter, setPlayerFilter] = useState<TPlayerFilter>("both");

  const sips = countSips(history);
  const skippedCount = history.filter((entry) => entry.outcome === "skipped").length;
  const visible = [...history]
    .reverse()
    .filter((entry) => outcomeFilter === "all" || entry.outcome === "skipped")
    .filter((entry) => playerFilter === "both" || entry.answerer === playerFilter);

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
          gap: 1.25,
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
                padding: 1.25,
                background: playerColors[player].soft,
                border: `2px solid ${playerColors[player].bg}`,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 0.25, fontWeight: 800, lineHeight: 1.2 }}
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
            <Typography variant="overline" sx={{ mb: 0, letterSpacing: "0.14em", minWidth: 84, textAlign: "left" }}>
              Answered by
            </Typography>
            <Button
              aria-label="Show cards answered by anyone"
              onClick={() => setPlayerFilter("both")}
              sx={filterChipStyles(playerFilter === "both")}
            >
              Both
            </Button>
            {(["playerOne", "playerTwo"] as TWnrsPlayer[]).map((player) => (
              <Button
                key={player}
                aria-label={`Show cards answered by ${playerNames[player]}`}
                onClick={() => setPlayerFilter(player)}
                sx={{
                  ...filterChipStyles(playerFilter === player, playerColors[player].bg),
                  maxWidth: 110,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {playerNames[player]}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
            <Typography variant="overline" sx={{ mb: 0, letterSpacing: "0.14em", minWidth: 84, textAlign: "left" }}>
              Show
            </Typography>
            <Button
              aria-label="Show all cards"
              onClick={() => setOutcomeFilter("all")}
              sx={filterChipStyles(outcomeFilter === "all")}
            >
              All ({history.length})
            </Button>
            <Button
              aria-label="Show skipped cards only"
              onClick={() => setOutcomeFilter("skipped")}
              sx={filterChipStyles(outcomeFilter === "skipped")}
            >
              Skipped ({skippedCount})
            </Button>
          </Box>
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
          {visible.length ? (
            visible.map((entry) => (
              <Box
                key={entry.id}
                data-testid="history-entry"
                sx={{
                  borderRadius: "18px",
                  padding: 1.75,
                  background: "#ffffff",
                  border: "1px solid rgba(58, 19, 77, 0.14)",
                  borderLeft: `6px solid ${playerColors[entry.answerer].bg}`,
                  boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ mb: 0.25, letterSpacing: "0.14em", textAlign: "left", lineHeight: 1.6, display: "block" }}
                >
                  L{entry.level} · {entry.card.kind === "wildcard" ? "Wildcard" : "Card"} ·{" "}
                  {playerNames[entry.asker]} drew
                </Typography>
                <Typography
                  variant="body1"
                  data-testid="history-card-text"
                  sx={{ mb: 0.9, fontWeight: 600, lineHeight: 1.3, textAlign: "left" }}
                >
                  {entry.card.text}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                  <WnrsPlayerTag player={entry.answerer} name={playerNames[entry.answerer]} size="sm" />
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
                {history.length ? "Nothing matches that filter." : "Nothing yet. Draw a card."}
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
