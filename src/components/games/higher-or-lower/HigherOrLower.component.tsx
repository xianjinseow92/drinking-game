import { useState, useEffect } from "react";

// Layout
import PageLayout from "layout/PageLayout.component";

// Common UI Components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// CustomComponents
import CardImage from "components/CardImage.component";
import BeatLoader from "react-spinners/BeatLoader";

// Typography
import Typography from "@mui/material/Typography";

// Types
import { IDeck } from "types/types";

// Helpers
import { getRandomElementFromArray } from "helpers/helpers";

// Styles
import theme from "styles/theme";

const HigherOrLowerGameBoard = (props: any) => {
  // Style-related
  const marginBottom = "15px";

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

  const reshuffleDeck = () => {
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
      {isFetchingCard && deck.remaining !== 0 && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <BeatLoader size={20} color={theme.palette.secondary.main} margin={5} />
          <Typography variant="h5">
            {getRandomElementFromArray(randomFetchingMessages)}
          </Typography>
        </Box>
      )}
      {/* Show nothing first if there are no cards in the deck */}
      {deck.cards[0] === undefined ? (
        // Placeholder to show nothing first
        <div></div>
      ) : (
        <CardImage
          cardStyles={{ marginBottom: marginBottom }}
          src={deck.cards[0].image}
          alt={deck.cards[0].value}
          component="img"
          sx={{ margin: "auto", height: "100%", width: "100%" }}
        />
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
        sx={{ marginBottom: marginBottom }}
      >
        {deck.remaining === 52 ? "Begin Game" : "Draw Card"}
      </Button>
      <Typography variant="h5">Cards remaining: {deck.remaining}</Typography>
      {deck?.cards[0] !== undefined && (
        <Button
          variant="contained"
          color="secondary"
          onClick={reshuffleDeck}
          sx={{ marginTop: "3rem" }}
        >
          Reshuffle Deck
        </Button>
      )}
    </PageLayout>
  );
};

export default HigherOrLowerGameBoard;
