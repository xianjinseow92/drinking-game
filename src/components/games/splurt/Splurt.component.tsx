import React from "react";

import { Box, Button, Typography } from "@mui/material";

import LoadingSpinner from "components/spinners/Spinner.component";
import PageLayout from "layout/PageLayout.component";

import { splurtCards } from "./data/splurtCards";
import SplurtActiveCard from "./components/SplurtActiveCard.component";
import SplurtDeck from "./components/SplurtDeck.component";
import SplurtNameDrawer from "./components/SplurtNameDrawer.component";
import SplurtRulesDrawer from "./components/SplurtRulesDrawer.component";
import SplurtWonCardsDrawer from "./components/SplurtWonCardsDrawer.component";
import {
  ISplurtCard,
  ISplurtPlayerNames,
  ISplurtWonPiles,
  TSplurtCardFace,
  TSplurtPile,
  TSplurtPlayer,
} from "./types/splurt.types";
import { shuffleSplurtCards } from "./utils/splurt.utils";

const { useEffect, useMemo, useState } = React as any;

const defaultPlayerNames: ISplurtPlayerNames = {
  playerOne: "Player 1",
  playerTwo: "Player 2",
};

const Splurt = () => {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(
    null as TSplurtPlayer | null,
  );
  const [activePile, setActivePile] = useState(null as TSplurtPile | null);
  const [isWonCardsOpen, setIsWonCardsOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [activeFace, setActiveFace] = useState("category" as TSplurtCardFace);
  const [activeCard, setActiveCard] = useState(null as ISplurtCard | null);
  const [remainingCards, setRemainingCards] = useState([] as ISplurtCard[]);
  const [playerNames, setPlayerNames] = useState(
    defaultPlayerNames as ISplurtPlayerNames,
  );
  const [wonPiles, setWonPiles] = useState({
    playerOne: [],
    playerTwo: [],
  } as ISplurtWonPiles);
  const [setAsideCards, setSetAsideCards] = useState([] as ISplurtCard[]);

  useEffect(() => {
    const setupTimer = window.setTimeout(() => {
      setRemainingCards(shuffleSplurtCards(splurtCards));
      setIsBootstrapping(false);
    }, 450);

    return () => {
      window.clearTimeout(setupTimer);
    };
  }, []);

  const canDrawCard = !isDrawing && !activeCard && remainingCards.length > 0;

  const statusMessage = useMemo(() => {
    if (isDrawing) {
      return "Shuffling up a spicy one...";
    }

    if (activeCard) {
      return activeFace === "category"
        ? `${playerNames.playerOne} and ${playerNames.playerTwo}, peek the prompt — tap for the twist.`
        : `${playerNames.playerOne} and ${playerNames.playerTwo}, the twist is out — blurt away.`;
    }

    if (!remainingCards.length) {
      if (setAsideCards.length) {
        return `${playerNames.playerOne} and ${playerNames.playerTwo}, check the piles and the set-aside chaos.`;
      }

      if (wonPiles.playerOne.length === wonPiles.playerTwo.length) {
        return `${playerNames.playerOne} and ${playerNames.playerTwo} finish in a glorious tie.`;
      }

      return wonPiles.playerOne.length > wonPiles.playerTwo.length
        ? `${playerNames.playerOne} takes the crown!`
        : `${playerNames.playerTwo} takes the crown!`;
    }

    return `${playerNames.playerOne}, ${playerNames.playerTwo} — draw a card and let the chaos begin.`;
  }, [
    activeCard,
    activeFace,
    isDrawing,
    playerNames.playerOne,
    playerNames.playerTwo,
    remainingCards.length,
    setAsideCards.length,
    wonPiles.playerOne.length,
    wonPiles.playerTwo.length,
  ]);

  const handleDrawCard = () => {
    if (!canDrawCard) {
      return;
    }

    const nextCard = remainingCards[0];
    const nextRemainingCards = remainingCards.slice(1);

    setIsDrawing(true);
    setIsCardVisible(false);

    window.setTimeout(() => {
      setRemainingCards(nextRemainingCards);
      setActiveCard(nextCard);
      setActiveFace("category");
      setIsDrawing(false);

      window.setTimeout(() => {
        setIsCardVisible(true);
      }, 20);
    }, 350);
  };

  const handleFlipCard = () => {
    if (!activeCard || isDrawing) {
      return;
    }

    setActiveFace((currentFace: TSplurtCardFace) =>
      currentFace === "category" ? "rule" : "category",
    );
  };

  const handleClaimCard = (player: TSplurtPlayer) => {
    if (!activeCard) {
      return;
    }

    setWonPiles((currentWonPiles: ISplurtWonPiles) => ({
      ...currentWonPiles,
      [player]: [activeCard, ...currentWonPiles[player]],
    }));
    setActiveCard(null);
    setActiveFace("category");
    setIsCardVisible(false);
  };

  const handleSetAsideCard = () => {
    if (!activeCard) {
      return;
    }

    setSetAsideCards((currentSetAsideCards: ISplurtCard[]) => [
      activeCard,
      ...currentSetAsideCards,
    ]);
    setActiveCard(null);
    setActiveFace("category");
    setIsCardVisible(false);
  };

  const handleResetGame = () => {
    setIsBootstrapping(true);
    setIsDrawing(false);
    setIsCardVisible(false);
    setActiveCard(null);
    setActiveFace("category");
    setWonPiles({
      playerOne: [],
      playerTwo: [],
    });
    setSetAsideCards([]);

    window.setTimeout(() => {
      setRemainingCards(shuffleSplurtCards(splurtCards));
      setIsBootstrapping(false);
    }, 300);
  };

  const handlePlayerNameChange = (player: TSplurtPlayer, value: string) => {
    setPlayerNames((currentPlayerNames: ISplurtPlayerNames) => ({
      ...currentPlayerNames,
      [player]: value,
    }));
  };

  if (isBootstrapping) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageLayout
        sx={{ paddingTop: { xs: 2, md: 3 }, paddingBottom: { xs: 2, md: 3 } }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: { xs: "88vh", md: "84vh" },
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.25, md: 2 },
            paddingTop: { xs: 5.5, md: 0 },
            paddingBottom: { xs: 2, md: 11 },
          }}
        >
          <SplurtDeck
            remainingCards={remainingCards.length}
            onDrawCard={handleDrawCard}
            isDrawing={isDrawing}
            canDrawCard={canDrawCard}
            onResetGame={handleResetGame}
          />

          <Box
            sx={{
              width: "100%",
              maxWidth: 760,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 0.9, md: 1.25 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Typography
                  variant="h2"
                  sx={{ mb: 0, textAlign: { xs: "center", md: "left" } }}
                >
                  Splurt
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "nowrap",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsRulesOpen(true)}
                  sx={{
                    borderRadius: "999px",
                    minWidth: 92,
                    flex: { xs: 1, md: "unset" },
                  }}
                >
                  Rules
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleResetGame}
                  sx={{
                    borderRadius: "999px",
                    minWidth: 96,
                    flex: { xs: 1, md: "unset" },
                  }}
                >
                  Restart
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: { xs: 0.8, md: 1.25 },
                alignItems: "stretch",
              }}
            >
              <Box
                role="button"
                tabIndex={0}
                aria-label={`Open ${playerNames.playerOne} cards`}
                sx={{
                  borderRadius: { xs: "16px", md: "18px" },
                  padding: { xs: 0.55, md: 1.4 },
                  background: "#fff1dd",
                  border: "2px solid rgba(255, 154, 0, 0.45)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: { xs: 78, md: 104 },
                  boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setActivePile("playerOne");
                  setIsWonCardsOpen(true);
                }}
                onKeyDown={(event: any) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setActivePile("playerOne");
                    setIsWonCardsOpen(true);
                  }
                }}
              >
                <Button
                  aria-label={`Edit ${playerNames.playerOne} name`}
                  onClick={(event: any) => {
                    event.stopPropagation();
                    setEditingPlayer("playerOne");
                  }}
                  sx={{
                    minWidth: 0,
                    padding: 0,
                    textTransform: "none",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: "#3a134d",
                    fontSize: { xs: "0.68rem", md: "0.95rem" },
                  }}
                >
                  {playerNames.playerOne}
                </Button>
                <Typography
                  variant="h5"
                  sx={{ mb: 0, fontSize: { xs: "1.35rem", md: "1.9rem" } }}
                >
                  {wonPiles.playerOne.length}
                </Typography>
              </Box>

              <Box
                role="button"
                tabIndex={0}
                aria-label="Open set aside cards"
                sx={{
                  borderRadius: { xs: "16px", md: "18px" },
                  padding: { xs: 0.55, md: 1.4 },
                  background: "#f2eef6",
                  border: "2px solid rgba(58, 19, 77, 0.22)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: { xs: 78, md: 104 },
                  boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setActivePile("setAside");
                  setIsWonCardsOpen(true);
                }}
                onKeyDown={(event: any) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setActivePile("setAside");
                    setIsWonCardsOpen(true);
                  }
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: { xs: "0.12em", md: "0.18em" },
                    mb: 0,
                    fontSize: { xs: "0.56rem", md: "0.75rem" },
                  }}
                >
                  Set Aside
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 0, fontSize: { xs: "1.35rem", md: "1.9rem" } }}
                >
                  {setAsideCards.length}
                </Typography>
              </Box>

              <Box
                role="button"
                tabIndex={0}
                aria-label={`Open ${playerNames.playerTwo} cards`}
                sx={{
                  borderRadius: { xs: "16px", md: "18px" },
                  padding: { xs: 0.55, md: 1.4 },
                  background: "#fde7f7",
                  border: "2px solid rgba(198, 50, 172, 0.32)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: { xs: 78, md: 104 },
                  boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setActivePile("playerTwo");
                  setIsWonCardsOpen(true);
                }}
                onKeyDown={(event: any) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setActivePile("playerTwo");
                    setIsWonCardsOpen(true);
                  }
                }}
              >
                <Button
                  aria-label={`Edit ${playerNames.playerTwo} name`}
                  onClick={(event: any) => {
                    event.stopPropagation();
                    setEditingPlayer("playerTwo");
                  }}
                  sx={{
                    minWidth: 0,
                    padding: 0,
                    textTransform: "none",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: "#3a134d",
                    fontSize: { xs: "0.68rem", md: "0.95rem" },
                  }}
                >
                  {playerNames.playerTwo}
                </Button>
                <Typography
                  variant="h5"
                  sx={{ mb: 0, fontSize: { xs: "1.35rem", md: "1.9rem" } }}
                >
                  {wonPiles.playerTwo.length}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              minHeight: { xs: 252, md: 470 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: { xs: 2.25, md: 1.5 },
            }}
          >
            {activeCard ? (
              <SplurtActiveCard
                card={activeCard}
                activeFace={activeFace}
                onFlipCard={handleFlipCard}
                isVisible={isCardVisible}
              />
            ) : (
              <Box
                sx={{
                  width: { xs: 216, sm: 320, md: 360 },
                  height: { xs: 252, sm: 430, md: 470 },
                  borderRadius: "28px",
                  border: "2px dashed rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 3,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontSize: { xs: "2rem", md: "2.125rem" } }}
                >
                  Ready to draw
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 0,
                    maxWidth: 220,
                    fontSize: { xs: "0.92rem", md: "1rem" },
                  }}
                >
                  Pull a card from the deck to reveal the next category.
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            aria-live="polite"
            sx={{
              maxWidth: 700,
              paddingX: { xs: 1, md: 0 },
              marginTop: { xs: 1.25, md: 1.5 },
            }}
          >
            <Typography variant="body1" sx={{ mb: 0 }}>
              {statusMessage}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: 760,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: { xs: 0.7, md: 1.25 },
              marginTop: "auto",
              position: { xs: "sticky", md: "absolute" },
              left: { md: 0 },
              right: { md: 0 },
              bottom: { xs: 0, md: 18 },
              padding: { xs: 1, md: 0 },
              background: {
                xs: "linear-gradient(180deg, rgba(223,0,121,0), rgba(223,0,121,0.92) 34%)",
                md: "transparent",
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              aria-label={`Award card to ${playerNames.playerOne}`}
              onClick={() => handleClaimCard("playerOne")}
              disabled={!activeCard}
              sx={{
                minHeight: { xs: 56, md: 52 },
                borderRadius: "999px",
                paddingX: { xs: 1, md: 3 },
                fontSize: { xs: "0.66rem", sm: "0.9rem" },
                lineHeight: 1.1,
                whiteSpace: "normal",
              }}
            >
              {playerNames.playerOne} Wins
            </Button>

            <Button
              variant="contained"
              color="secondary"
              aria-label="Set current card aside"
              onClick={handleSetAsideCard}
              disabled={!activeCard}
              sx={{
                minHeight: { xs: 56, md: 52 },
                borderRadius: "999px",
                paddingX: { xs: 1, md: 3 },
                fontSize: { xs: "0.66rem", sm: "0.9rem" },
                lineHeight: 1.1,
              }}
            >
              Set Aside
            </Button>

            <Button
              variant="contained"
              color="secondary"
              aria-label={`Award card to ${playerNames.playerTwo}`}
              onClick={() => handleClaimCard("playerTwo")}
              disabled={!activeCard}
              sx={{
                minHeight: { xs: 56, md: 52 },
                borderRadius: "999px",
                paddingX: { xs: 1, md: 3 },
                fontSize: { xs: "0.66rem", sm: "0.9rem" },
                lineHeight: 1.1,
                whiteSpace: "normal",
              }}
            >
              {playerNames.playerTwo} Wins
            </Button>
          </Box>
        </Box>
      </PageLayout>

      <SplurtNameDrawer
        open={Boolean(editingPlayer)}
        onClose={() => setEditingPlayer(null)}
        player={editingPlayer}
        currentName={
          editingPlayer === "playerTwo"
            ? playerNames.playerTwo
            : playerNames.playerOne
        }
        defaultName={
          editingPlayer === "playerTwo"
            ? defaultPlayerNames.playerTwo
            : defaultPlayerNames.playerOne
        }
        onSave={(value: string) => {
          if (!editingPlayer) {
            return;
          }

          handlePlayerNameChange(editingPlayer, value);
        }}
      />

      <SplurtRulesDrawer
        open={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <SplurtWonCardsDrawer
        open={isWonCardsOpen}
        onClose={() => {
          setIsWonCardsOpen(false);
          setActivePile(null);
        }}
        activePile={activePile}
        playerNames={playerNames}
        setAsideCards={setAsideCards}
        wonPiles={wonPiles}
      />
    </>
  );
};

export default Splurt;
