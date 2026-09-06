import { act, fireEvent, render, screen, within } from "@testing-library/react";

import WereNotReallyStrangers from "./WereNotReallyStrangers.component";
import { WNRS_WILDCARDS_PER_LEVEL, wnrsPromptsByLevel } from "./data/wnrsCards";

const deckSize = (level: 1 | 2 | 3) =>
  wnrsPromptsByLevel[level].length + WNRS_WILDCARDS_PER_LEVEL;

const clickAnswered = () =>
  fireEvent.click(screen.getByRole("button", { name: /answered, next card/i }));

const clickSkip = () =>
  fireEvent.click(
    screen.getByRole("button", { name: /skip this card and take a sip/i })
  );

const progress = () => screen.getByLabelText(/card progress/i).textContent;
const turn = () => screen.getByLabelText(/^turn$/i).textContent ?? "";

const startLevelOne = () =>
  fireEvent.click(
    screen.getByRole("button", { name: /start level 1: perception/i })
  );

const isWildcard = () =>
  /wildcard card/i.test(screen.getByRole("article").getAttribute("aria-label") || "");

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

  test("shows level select with name fields, all three levels, and the rules", () => {
    render(<WereNotReallyStrangers />);

    expect(
      screen.getByRole("heading", { name: /we're not really strangers/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /player 1 name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /player 2 name/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start level 1: perception/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start level 2: connection/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start level 3: reflection/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^rules$/i }));
    expect(screen.getByText(/how to play/i)).toBeInTheDocument();
    expect(screen.getByText(/skip a card, take a sip/i)).toBeInTheDocument();
    expect(screen.getByText(/dig deeper\./i)).toBeInTheDocument();
  });

  test("alternates asker and answerer each card, using custom names", () => {
    render(<WereNotReallyStrangers />);

    fireEvent.change(screen.getByRole("textbox", { name: /player 1 name/i }), {
      target: { value: "Alex" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /player 2 name/i }), {
      target: { value: "Sam" },
    });
    startLevelOne();

    expect(progress()).toBe(`1 of ${deckSize(1)}`);
    expect(turn()).toMatch(/Alex asks · Sam answers/);

    clickAnswered();
    expect(turn()).toMatch(/Sam asks · Alex answers/);

    clickSkip();
    expect(turn()).toMatch(/Alex asks · Sam answers/);
    expect(progress()).toBe(`3 of ${deckSize(1)}`);
  });

  test("records who drew, who answered, and who skipped in the history", () => {
    render(<WereNotReallyStrangers />);
    startLevelOne();

    // Player 1 asks, Player 2 answers.
    clickAnswered();
    // Player 2 asks, Player 1 skips (sips).
    clickSkip();

    fireEvent.click(screen.getAllByRole("button", { name: /open history/i })[0]);

    const entries = screen.getAllByTestId("history-entry");
    expect(entries).toHaveLength(2);
    // Newest first: the skip by Player 1.
    expect(within(entries[0]).getByText(/player 2 drew/i)).toBeInTheDocument();
    expect(within(entries[0]).getByText(/player 1 skipped · sip/i)).toBeInTheDocument();
    expect(within(entries[1]).getByText(/player 1 drew/i)).toBeInTheDocument();
    expect(within(entries[1]).getByText(/player 2 answered/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/player 1 sips/i)).toHaveTextContent("1 sip");
    expect(screen.getByLabelText(/player 2 sips/i)).toHaveTextContent("0 sips");

    // The skipped-only filter shows just the skipped question, with its text.
    const skippedText =
      within(entries[0]).getByTestId("history-card-text").textContent ?? "";
    fireEvent.click(screen.getByRole("button", { name: /skipped \(1\)/i }));
    const skippedOnly = screen.getAllByTestId("history-entry");
    expect(skippedOnly).toHaveLength(1);
    expect(within(skippedOnly[0]).getByText(/player 1 skipped · sip/i)).toBeInTheDocument();
    expect(skippedText.length).toBeGreaterThan(0);
    expect(skippedOnly[0]).toHaveTextContent(skippedText);
  });

  test("dig deeper is optional, one per player per level, and resets on a new level", () => {
    render(<WereNotReallyStrangers />);
    startLevelOne();

    const askerName = () => (turn().match(/^(.*?) asks/) || [, ""])[1];
    const digDeeper = () => screen.getByRole("button", { name: /dig deeper/i });
    // Advance until the named player is asking on a prompt card (wildcards
    // swap roles too, so we can't rely on card parity).
    const advanceUntilAsking = (name: string) => {
      for (let guard = 0; guard < 12 && (isWildcard() || askerName() !== name); guard += 1) {
        clickAnswered();
      }
      expect(askerName()).toBe(name);
      expect(isWildcard()).toBe(false);
    };

    advanceUntilAsking("Player 1");
    expect(digDeeper()).toHaveTextContent(/1 left/i);
    expect(digDeeper()).toBeEnabled();
    fireEvent.click(digDeeper());
    expect(turn()).toMatch(/dig deeper, player 2/i);
    expect(digDeeper()).toBeDisabled();

    advanceUntilAsking("Player 2");
    expect(digDeeper()).toHaveTextContent(/1 left/i);
    expect(digDeeper()).toBeEnabled();

    advanceUntilAsking("Player 1");
    expect(digDeeper()).toHaveTextContent(/· used/i);
    expect(digDeeper()).toBeDisabled();

    // Jumping to the next level resets both.
    fireEvent.click(screen.getByRole("button", { name: /go to level 2/i }));
    expect(
      screen.getByRole("heading", { level: 2, name: /level 2 · connection/i })
    ).toBeInTheDocument();
    advanceUntilAsking("Player 1");
    expect(digDeeper()).toHaveTextContent(/1 left/i);
    expect(digDeeper()).toBeEnabled();
  });

  test("next-level shortcut is available at any time, and level 3 leads to the final card", () => {
    render(<WereNotReallyStrangers />);
    startLevelOne();

    fireEvent.click(screen.getByRole("button", { name: /go to level 2/i }));
    expect(progress()).toBe(`1 of ${deckSize(2)}`);

    fireEvent.click(screen.getByRole("button", { name: /go to level 3/i }));
    expect(progress()).toBe(`1 of ${deckSize(3)}`);

    fireEvent.click(screen.getByRole("button", { name: /go to the final card/i }));
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

  test("exhausting a level shows the summary with per-player sips", () => {
    render(<WereNotReallyStrangers />);
    startLevelOne();

    const total = deckSize(1);
    // Card 1: P1 asks, P2 answers. Card 2: P2 asks, P1 skips.
    clickAnswered();
    clickSkip();
    for (let card = 3; card <= total; card += 1) {
      clickAnswered();
    }

    expect(screen.getByText(/level 1 complete/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${total - 1} cards answered`, "i"))).toBeInTheDocument();
    expect(screen.getByText(/player 1: 1 · player 2: 0 sips owed/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to level 2/i })).toBeInTheDocument();
  });

  test("back to levels abandons the current level", () => {
    render(<WereNotReallyStrangers />);

    fireEvent.click(screen.getByRole("button", { name: /start level 2: connection/i }));
    clickAnswered();
    fireEvent.click(screen.getByRole("button", { name: /back to level select/i }));

    expect(screen.getByRole("button", { name: /start level 2: connection/i })).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
