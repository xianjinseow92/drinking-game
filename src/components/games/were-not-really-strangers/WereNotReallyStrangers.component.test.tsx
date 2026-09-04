import { act, fireEvent, render, screen } from "@testing-library/react";

import WereNotReallyStrangers from "./WereNotReallyStrangers.component";
import { WNRS_WILDCARDS_PER_LEVEL, wnrsPromptsByLevel } from "./data/wnrsCards";

const deckSize = (level: 1 | 2 | 3) =>
  wnrsPromptsByLevel[level].length + WNRS_WILDCARDS_PER_LEVEL;

const clickNext = () =>
  fireEvent.click(screen.getByRole("button", { name: /^next card$/i }));

const clickSkip = () =>
  fireEvent.click(
    screen.getByRole("button", { name: /skip this card and take a sip/i })
  );

const progress = () => screen.getByLabelText(/card progress/i).textContent;

describe("WereNotReallyStrangers", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test("shows the level select with all three levels and the rules drawer", () => {
    render(<WereNotReallyStrangers />);

    expect(
      screen.getByRole("heading", { name: /we're not really strangers/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start level 1: perception/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start level 2: connection/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start level 3: reflection/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^rules$/i }));
    expect(screen.getByText(/how to play/i)).toBeInTheDocument();
    expect(screen.getByText(/skip a card, take a sip/i)).toBeInTheDocument();
  });

  test("plays through a level with next and skip, then shows the summary", () => {
    render(<WereNotReallyStrangers />);

    fireEvent.click(
      screen.getByRole("button", { name: /start level 1: perception/i })
    );

    const total = deckSize(1);
    expect(progress()).toBe(`1 of ${total}`);
    expect(
      screen.getByRole("heading", { level: 2, name: /level 1 · perception/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("article")).toBeInTheDocument();

    clickNext();
    expect(progress()).toBe(`2 of ${total}`);

    clickSkip();
    expect(progress()).toBe(`3 of ${total}`);

    // Burn through the rest of the deck.
    for (let card = 3; card <= total; card += 1) {
      clickNext();
    }

    expect(screen.getByText(/level 1 complete/i)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${total - 1} cards answered`, "i"))
    ).toBeInTheDocument();
    expect(screen.getByText(/1 card skipped/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue to level 2/i })
    ).toBeInTheDocument();
  });

  test("continues through all three levels to the final card and back to select", () => {
    render(<WereNotReallyStrangers />);

    fireEvent.click(
      screen.getByRole("button", { name: /start level 1: perception/i })
    );

    for (let card = 0; card < deckSize(1); card += 1) {
      clickNext();
    }
    fireEvent.click(screen.getByRole("button", { name: /continue to level 2/i }));
    expect(progress()).toBe(`1 of ${deckSize(2)}`);

    for (let card = 0; card < deckSize(2); card += 1) {
      clickNext();
    }
    fireEvent.click(screen.getByRole("button", { name: /continue to level 3/i }));
    expect(progress()).toBe(`1 of ${deckSize(3)}`);

    for (let card = 0; card < deckSize(3); card += 1) {
      clickNext();
    }
    expect(screen.getByText(/level 3 complete/i)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /reveal the final card/i })
    );

    expect(
      screen.getByRole("heading", { level: 2, name: /the final card/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("article", { name: /final card/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/card progress/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /play again/i }));
    expect(
      screen.getByRole("button", { name: /start level 1: perception/i })
    ).toBeInTheDocument();
  });

  test("back to levels abandons the current level", () => {
    render(<WereNotReallyStrangers />);

    fireEvent.click(
      screen.getByRole("button", { name: /start level 2: connection/i })
    );
    clickNext();
    fireEvent.click(screen.getByRole("button", { name: /back to level select/i }));

    expect(
      screen.getByRole("button", { name: /start level 2: connection/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
