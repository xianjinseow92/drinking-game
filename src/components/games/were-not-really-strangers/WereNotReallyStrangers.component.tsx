import { useEffect, useMemo, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import PageLayout from "layout/PageLayout.component";

import WnrsActiveCard from "./components/WnrsActiveCard.component";
import WnrsHistoryDrawer, {
  countSips,
} from "./components/WnrsHistoryDrawer.component";
import WnrsLevelSelect from "./components/WnrsLevelSelect.component";
import WnrsLevelSummary from "./components/WnrsLevelSummary.component";
import WnrsRulesDrawer from "./components/WnrsRulesDrawer.component";
import {
  WNRS_WILDCARDS_PER_LEVEL,
  wnrsFinalCard,
  wnrsLevels,
  wnrsPromptsByLevel,
  wnrsWildcards,
} from "./data/wnrsCards";
import {
  IWnrsCard,
  IWnrsHistoryEntry,
  TWnrsLastAction,
  TWnrsLevel,
  TWnrsOutcome,
  TWnrsPhase,
  TWnrsPlayer,
  TWnrsPlayerFlags,
  TWnrsPlayerNames,
} from "./types/wnrs.types";
import { buildLevelDeck } from "./utils/wnrs.utils";

const LAST_LEVEL: TWnrsLevel = 3;

export const defaultPlayerNames: TWnrsPlayerNames = {
  playerOne: "Player 1",
  playerTwo: "Player 2",
};

const noDigDeeperUsed: TWnrsPlayerFlags = { playerOne: false, playerTwo: false };

const otherPlayer = (player: TWnrsPlayer): TWnrsPlayer =>
  player === "playerOne" ? "playerTwo" : "playerOne";

const getLevelMeta = (level: TWnrsLevel) =>
  wnrsLevels.find((meta) => meta.level === level) ?? wnrsLevels[0];

const textButtonStyles = {
  color: "#fff7fb",
  borderRadius: "999px",
  minWidth: 0,
  paddingX: 1.25,
  fontSize: { xs: "0.78rem", md: "0.875rem" },
} as const;

const WereNotReallyStrangers = () => {
  const [phase, setPhase] = useState<TWnrsPhase>("select");
  const [level, setLevel] = useState<TWnrsLevel>(1);
  const [deck, setDeck] = useState<IWnrsCard[]>([]);
  const [index, setIndex] = useState(0);
  const [asker, setAsker] = useState<TWnrsPlayer>("playerOne");
  const [digDeeperUsed, setDigDeeperUsed] =
    useState<TWnrsPlayerFlags>(noDigDeeperUsed);
  const [digDeeperActive, setDigDeeperActive] = useState(false);
  const [history, setHistory] = useState<IWnrsHistoryEntry[]>([]);
  const [lastAction, setLastAction] = useState<TWnrsLastAction>(null);
  const [rawNames, setRawNames] = useState<TWnrsPlayerNames>(defaultPlayerNames);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const playerNames = useMemo<TWnrsPlayerNames>(
    () => ({
      playerOne: rawNames.playerOne.trim() || defaultPlayerNames.playerOne,
      playerTwo: rawNames.playerTwo.trim() || defaultPlayerNames.playerTwo,
    }),
    [rawNames.playerOne, rawNames.playerTwo]
  );
  const answerer = otherPlayer(asker);
  const levelMeta = getLevelMeta(level);
  const activeCard: IWnrsCard | null =
    phase === "playing"
      ? deck[index] ?? null
      : phase === "final"
        ? wnrsFinalCard
        : null;
  const levelHistory = history.filter((entry) => entry.level === level);
  const levelSips = countSips(levelHistory);

  // Fade each new card in. Keyed on the card id so re-renders of the same
  // card don't restart the animation.
  useEffect(() => {
    if (!activeCard) {
      setIsCardVisible(false);
      return undefined;
    }

    setIsCardVisible(false);
    const revealTimer = window.setTimeout(() => setIsCardVisible(true), 20);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [activeCard?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const startLevel = (nextLevel: TWnrsLevel) => {
    setLevel(nextLevel);
    setDeck(
      buildLevelDeck(
        wnrsPromptsByLevel[nextLevel],
        wnrsWildcards,
        WNRS_WILDCARDS_PER_LEVEL
      )
    );
    setIndex(0);
    setDigDeeperUsed(noDigDeeperUsed);
    setDigDeeperActive(false);
    setLastAction(null);
    setPhase("playing");
  };

  const advance = (outcome: TWnrsOutcome) => {
    if (phase !== "playing" || !activeCard) {
      return;
    }

    setHistory((current) => [
      ...current,
      {
        id: `${level}-${activeCard.id}-${current.length + 1}`,
        level,
        card: activeCard,
        asker,
        answerer,
        outcome,
        dugDeeper: digDeeperActive,
      },
    ]);
    setLastAction(outcome);
    setDigDeeperActive(false);
    setAsker(answerer);

    if (index + 1 >= deck.length) {
      setPhase("levelComplete");
      return;
    }

    setIndex(index + 1);
  };

  const handleDigDeeper = () => {
    if (phase !== "playing" || !activeCard || activeCard.kind === "wildcard") {
      return;
    }
    if (digDeeperUsed[asker] || digDeeperActive) {
      return;
    }

    setDigDeeperUsed((current) => ({ ...current, [asker]: true }));
    setDigDeeperActive(true);
  };

  const goToNextLevel = () => {
    if (level >= LAST_LEVEL) {
      setPhase("final");
      setDigDeeperActive(false);
      return;
    }

    startLevel((level + 1) as TWnrsLevel);
  };

  const backToLevels = () => {
    setPhase("select");
    setDeck([]);
    setIndex(0);
    setAsker("playerOne");
    setDigDeeperUsed(noDigDeeperUsed);
    setDigDeeperActive(false);
    setHistory([]);
    setLastAction(null);
  };

  const statusMessage = useMemo(() => {
    if (phase === "final") {
      return "Both of you write. Swap notes. Don't open them until you've said goodbye.";
    }

    if (phase !== "playing" || !activeCard) {
      return "";
    }

    const askerName = playerNames[asker];
    const answererName = playerNames[answerer];

    if (activeCard.kind === "wildcard") {
      return `Wildcard. ${answererName}, do what it says.`;
    }

    if (digDeeperActive) {
      return `Dig deeper, ${answererName}. One layer further.`;
    }

    if (lastAction === "skipped") {
      return `Sip for the skip. ${askerName} reads this one, ${answererName} answers.`;
    }

    return `${askerName} reads it out loud. ${answererName} answers.`;
  }, [activeCard, answerer, asker, digDeeperActive, lastAction, phase, playerNames]);

  const eyebrow =
    activeCard?.kind === "wildcard"
      ? "Wildcard"
      : activeCard?.kind === "final"
        ? "Final card"
        : `Level ${level} · ${levelMeta.name}`;

  const canDigDeeper =
    phase === "playing" &&
    activeCard?.kind === "prompt" &&
    !digDeeperUsed[asker] &&
    !digDeeperActive;

  return (
    <>
      <PageLayout
        sx={{
          paddingTop: { xs: 1.5, md: 3 },
          paddingBottom: { xs: 1.5, md: 3 },
          paddingX: { xs: 1.25, md: 3 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: { xs: "90vh", md: "84vh" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.1, md: 2 },
            paddingTop: { xs: 5.5, md: 0 },
            paddingBottom: { xs: 1, md: 8 },
          }}
        >
          {phase === "select" && (
            <WnrsLevelSelect
              levels={wnrsLevels}
              playerNames={rawNames}
              onPlayerNameChange={(player, value) =>
                setRawNames((current) => ({ ...current, [player]: value }))
              }
              onSelectLevel={startLevel}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          )}

          {(phase === "playing" || phase === "final") && activeCard && (
            <>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 560,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ mb: 0, textAlign: "left", fontSize: { xs: "1.05rem", md: "1.25rem" } }}
                >
                  {phase === "final"
                    ? "The final card"
                    : `Level ${level} · ${levelMeta.name}`}
                </Typography>
                {phase === "playing" && (
                  <Typography
                    variant="body2"
                    sx={{ mb: 0, whiteSpace: "nowrap" }}
                    aria-label="Card progress"
                  >
                    {index + 1} of {deck.length}
                  </Typography>
                )}
              </Box>

              {phase === "playing" && (
                <Box
                  aria-label="Turn"
                  sx={{
                    width: "100%",
                    maxWidth: 560,
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    gap: 0.75,
                    borderRadius: "16px",
                    padding: { xs: "8px 12px", md: "10px 16px" },
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.35)",
                  }}
                >
                  <Box sx={{ textAlign: "left", minWidth: 0 }}>
                    <Typography
                      variant="overline"
                      sx={{ mb: 0, lineHeight: 1.2, letterSpacing: "0.16em", opacity: 0.85, display: "block", textAlign: "left" }}
                    >
                      Asks
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 0, fontWeight: 800, textAlign: "left", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {playerNames[asker]}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ mb: 0, opacity: 0.7 }}>
                    →
                  </Typography>
                  <Box sx={{ textAlign: "right", minWidth: 0 }}>
                    <Typography
                      variant="overline"
                      sx={{ mb: 0, lineHeight: 1.2, letterSpacing: "0.16em", opacity: 0.85, display: "block", textAlign: "right" }}
                    >
                      Answers
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 0, fontWeight: 800, textAlign: "right", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {playerNames[answerer]}
                    </Typography>
                  </Box>
                </Box>
              )}

              <WnrsActiveCard
                key={activeCard.id}
                card={activeCard}
                eyebrow={eyebrow}
                isVisible={isCardVisible}
              />

              <Box aria-live="polite" sx={{ maxWidth: 560 }}>
                <Typography
                  variant="body1"
                  sx={{ mb: 0, fontSize: { xs: "0.92rem", md: "1rem" } }}
                >
                  {statusMessage}
                </Typography>
              </Box>

              {phase === "playing" ? (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 560,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 0.9, md: 1.25 },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: { xs: 0.9, md: 1.25 },
                    }}
                  >
                    <Button
                      variant="outlined"
                      aria-label="Skip this card and take a sip"
                      onClick={() => advance("skipped")}
                      sx={{
                        minHeight: { xs: 54, md: 52 },
                        borderRadius: "999px",
                        color: "#fff7fb",
                        borderColor: "rgba(255,255,255,0.7)",
                        "&:hover": {
                          borderColor: "#fff7fb",
                          background: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Skip (sip!)
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      aria-label="Answered, next card"
                      onClick={() => advance("answered")}
                      sx={{ minHeight: { xs: 54, md: 52 }, borderRadius: "999px" }}
                    >
                      Answered
                    </Button>
                  </Box>

                  <Button
                    variant="outlined"
                    aria-label={`Dig deeper, ${playerNames[asker]}'s one use this level`}
                    onClick={handleDigDeeper}
                    disabled={!canDigDeeper}
                    sx={{
                      minHeight: { xs: 44, md: 46 },
                      borderRadius: "999px",
                      color: "#fff7fb",
                      borderColor: "rgba(255,255,255,0.45)",
                      textTransform: "none",
                      fontSize: { xs: "0.82rem", md: "0.9rem" },
                      "&.Mui-disabled": {
                        color: "rgba(255,247,251,0.45)",
                        borderColor: "rgba(255,255,255,0.2)",
                      },
                      "&:hover": {
                        borderColor: "#fff7fb",
                        background: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    {digDeeperActive
                      ? "Digging deeper…"
                      : digDeeperUsed[asker]
                        ? `Dig deeper · ${playerNames[asker]} used it this level`
                        : `Dig deeper · ${playerNames[asker]} has 1 left`}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  aria-label="Play again"
                  onClick={backToLevels}
                  sx={{
                    minHeight: { xs: 54, md: 52 },
                    borderRadius: "999px",
                    minWidth: 200,
                  }}
                >
                  Play again
                </Button>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: { xs: 0.25, md: 1 },
                }}
              >
                <Button
                  variant="text"
                  aria-label="Open rules"
                  onClick={() => setIsRulesOpen(true)}
                  sx={textButtonStyles}
                >
                  Rules
                </Button>
                <Button
                  variant="text"
                  aria-label="Open history"
                  onClick={() => setIsHistoryOpen(true)}
                  sx={textButtonStyles}
                >
                  History
                </Button>
                {phase === "playing" && (
                  <>
                    <Button
                      variant="text"
                      aria-label={
                        level >= LAST_LEVEL ? "Go to the final card" : `Go to level ${level + 1}`
                      }
                      onClick={goToNextLevel}
                      sx={textButtonStyles}
                    >
                      {level >= LAST_LEVEL ? "Final card" : `Level ${level + 1} →`}
                    </Button>
                    <Button
                      variant="text"
                      aria-label="Back to level select"
                      onClick={backToLevels}
                      sx={textButtonStyles}
                    >
                      Levels
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}

          {phase === "levelComplete" && (
            <WnrsLevelSummary
              levelMeta={levelMeta}
              answered={levelHistory.filter((entry) => entry.outcome === "answered").length}
              sips={levelSips}
              playerNames={playerNames}
              isLastLevel={level >= LAST_LEVEL}
              onContinue={goToNextLevel}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onBackToLevels={backToLevels}
            />
          )}
        </Box>
      </PageLayout>

      <WnrsRulesDrawer open={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <WnrsHistoryDrawer
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        playerNames={playerNames}
      />
    </>
  );
};

export default WereNotReallyStrangers;
