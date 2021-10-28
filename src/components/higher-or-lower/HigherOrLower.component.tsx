import { useState, useEffect } from "react";

// Layout
import PageLayout from "layout/PageLayout.component";

// Common UI Components
import Button from "@mui/material/Button";

// Typography
import Typography from "@mui/material/Typography";

// Types
import { IDeck } from "types/types";

// Helpers
import { getRandomElementFromArray } from "helpers/helpers";

const HigherOrLowerGameBoard = (props: any) => {
  // Control Variables
  const [deck, setDeck] = useState<IDeck>({
    deck_id: "",
    remaining: 52,
    shuffled: false,
    success: false,
    cards: [],
  });
  const randomFetchingMessages = [
    "I be fetchinnn",
    "Drawin a CARDD",
    "Pls wait bruh",
  ];

  const [isFetchingCard, setIsFetchingCard] = useState(false);
  const numCardsToDraw: number = 1;

  useEffect(() => {
    // Load deck when Component loads (pull data);
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((res) => res.json())
      .then((data) => {
        setDeck({ ...data, cards: [] });
      });
  }, []);

  const drawCard = () => {
    /**
     * Well.. draws a card. LoL
     */
    setIsFetchingCard(true); // fetching card !! when fetched successfully set to false
    fetch(
      `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${numCardsToDraw}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDeck(data);
        setIsFetchingCard(false);
      });
  };

  const reshuffleDeck = (event: any) => {
    setIsFetchingCard(true); // fetching card !! when fetched successfully set to false
    fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`)
      .then((res) => res.json())
      .then((data) => {
        setDeck({ ...data, cards: [] });
        drawCard();
        setIsFetchingCard(false);
      });
  };

  return (
    <PageLayout sx={{}}>
      {/* Show nothing first if there are no cards in the deck */}
      {deck.cards[0] === undefined ? (
        // Placeholder to show nothing first
        <div></div>
      ) : (
        <img src={deck.cards[0].image} alt={deck.cards[0].value} />
      )}
      {/* Notify user that deck has finished */}
      {deck.remaining === 0 && deck.cards[0] === undefined && (
        <div>You have finished the pile !</div>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={drawCard}
        disabled={!deck.success}
        sx={{marginBottom: "10px"}}
      >
        {deck.remaining === 52 ? "Begin Game" : "Draw Card"}
      </Button>
      <Button variant="contained" color="secondary" onClick={reshuffleDeck}>
        Reshuffle Deck
      </Button>
      <Typography variant="subtitle1">
        Cards remaining: {deck.remaining}
      </Typography>
      {isFetchingCard && deck.remaining !== 0 && (
        <Typography variant="subtitle1">
          {getRandomElementFromArray(randomFetchingMessages)}
        </Typography>
      )}
    </PageLayout>
  );
};

export default HigherOrLowerGameBoard;
