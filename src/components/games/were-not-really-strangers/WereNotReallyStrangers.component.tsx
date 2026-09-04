import { useEffect, useMemo, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import PageLayout from "layout/PageLayout.component";

import WnrsActiveCard from "./components/WnrsActiveCard.component";
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
  TWnrsLastAction,
  TWnrsLevel,
  TWnrsPhase,
} from "./types/wnrs.types";
import { buildLevelDeck } from "./utils/wnrs.utils";

const LAST_LEVEL: TWnrsLevel = 3;

const getLevelMeta = (level: TWnrsLevel) =>
  wnrsLevels.find((meta) => meta.level === level) ?? wnrsLevels[0];

const WereNotReallyStrangers = () => {
  const [phase, setPhase] = useState<TWnrsPhase>("select");
  const [level, setLevel] = useState<TWnrsLevel>(1);
  const [deck, setDeck] = useState<IWnrsCard[]>([]);
  const [index, setIndex] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [lastAction, setLastAction] = useState<TWnrsLastAction>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const levelMeta = getLevelMeta(level);
  const activeCard: IWnrsCard | null =
    phase === "playing"
      ? deck[index] ?? null
      : phase === "final"
        ? wnrsFinalCard
        : null;

  // Fade each new card in. The key is the card id so re-renders of the
  // same card don't restart the animation.
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
    setSkipped(0);
    setLastAction(null);
    setPhase("playing");
  };

  const advance = (action: Exclude<TWnrsLastAction, null>) => {
    if (phase !== "playing" || !activeCard) {
      return;
    }

    if (action === "skipped") {
      setSkipped((current) => current + 1);
    }
    setLastAction(action);

    if (index + 1 >= deck.length) {
      setPhase("levelComplete");
      return;
    }

    setIndex(index + 1);
  };

  const handleContinue = () => {
    if (level >= LAST_LEVEL) {
      setPhase("final");
      return;
    }

    startLevel((level + 1) as TWnrsLevel);
  };

  const backToLevels = () => {
    setPhase("select");
    setDeck([]);
    setIndex(0);
    setSkipped(0);
    setLastAction(null);
  };

  const statusMessage = useMemo(() => {
    if (phase === "final") {
      return "Take your time with this one. There's no skipping the last card.";
    }

    if (phase !== "playing" || !activeCard) {
      return "";
    }

    if (activeCard.kind === "wildcard") {
      return "Wildcard. Do what it says, no questions asked.";
    }

    if (lastAction === "skipped") {
      return "Skipped. Take a sip, then read this one out loud.";
    }

    if (lastAction === "answered") {
      return "Nice. Next one, read it out loud.";
    }

    return "Read it out loud. Everyone answers.";
  }, [activeCard, lastAction, phase]);

  const eyebrow =
    activeCard?.kind === "wildcard"
      ? "Wildcard"
      : activeCard?.kind === "final"
        ? "Final card"
        : `Level ${level} · ${levelMeta.name}`;

  return (
    <>
      <PageLayout
        sx={{ paddingTop: { xs: 2, md: 3 }, paddingBottom: { xs: 2, md: 3 } }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: { xs: "88vh", md: "84vh" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.5, md: 2 },
            paddingTop: { xs: 5.5, md: 0 },
            paddingBottom: { xs: 2, md: 8 },
          }}
        >
          {phase === "select" && (
            <WnrsLevelSelect
              levels={wnrsLevels}
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
                  paddingX: { xs: 1, md: 0 },
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ mb: 0, textAlign: "left" }}
                >
                  {phase === "final"
                    ? "The final card"
                    : `Level ${level} · ${levelMeta.name}`}
                </Typography>
                {phase === "playing" && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 0, whiteSpace: "nowrap" }}
                    aria-label="Card progress"
                  >
                    {index + 1} of {deck.length}
                  </Typography>
                )}
              </Box>

              <WnrsActiveCard
                key={activeCard.id}
                card={activeCard}
                eyebrow={eyebrow}
                isVisible={isCardVisible}
              />

              <Box
                aria-live="polite"
                sx={{ maxWidth: 560, paddingX: { xs: 1, md: 0 } }}
              >
                <Typography variant="body1" sx={{ mb: 0 }}>
                  {statusMessage}
                </Typography>
              </Box>

              {phase === "playing" ? (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 560,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: { xs: 1, md: 1.25 },
                    paddingX: { xs: 1, md: 0 },
                  }}
                >
                  <Button
                    variant="outlined"
                    aria-label="Skip this card and take a sip"
                    onClick={() => advance("skipped")}
                    sx={{
                      minHeight: { xs: 56, md: 52 },
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
                    aria-label="Next card"
                    onClick={() => advance("answered")}
                    sx={{ minHeight: { xs: 56, md: 52 }, borderRadius: "999px" }}
                  >
                    Next
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  aria-label="Play again"
                  onClick={backToLevels}
                  sx={{
                    minHeight: { xs: 56, md: 52 },
                    borderRadius: "999px",
                    minWidth: 200,
                  }}
                >
                  Play again
                </Button>
              )}

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="text"
                  aria-label="Open rules"
                  onClick={() => setIsRulesOpen(true)}
                  sx={{ color: "#fff7fb", borderRadius: "999px" }}
                >
                  Rules
                </Button>
                {phase === "playing" && (
                  <Button
                    variant="text"
                    aria-label="Back to level select"
                    onClick={backToLevels}
                    sx={{ color: "#fff7fb", borderRadius: "999px" }}
                  >
                    Back to levels
                  </Button>
                )}
              </Box>
            </>
          )}

          {phase === "levelComplete" && (
            <WnrsLevelSummary
              levelMeta={levelMeta}
              answered={deck.length - skipped}
              skipped={skipped}
              isLastLevel={level >= LAST_LEVEL}
              onContinue={handleContinue}
              onBackToLevels={backToLevels}
            />
          )}
        </Box>
      </PageLayout>

      <WnrsRulesDrawer open={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </>
  );
};

export default WereNotReallyStrangers;
