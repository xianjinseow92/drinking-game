import { act, fireEvent, render, screen } from "@testing-library/react";

import Splurt from "./Splurt.component";

describe("Splurt", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("supports custom names, player claiming, and set-aside cards", () => {
    render(<Splurt />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByRole("button", { name: /edit player 1 name/i }));
    fireEvent.focus(screen.getByRole("textbox", { name: /edit player 1 name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit player 1 name/i }), {
      target: { value: "Alex" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    fireEvent.click(screen.getByRole("button", { name: /edit player 2 name/i }));
    fireEvent.focus(screen.getByRole("textbox", { name: /edit player 2 name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /edit player 2 name/i }), {
      target: { value: "Sam" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    fireEvent.click(screen.getByRole("button", { name: /draw from splurt deck/i }));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(
      screen.getByRole("button", { name: /flip current splurt card/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /award card to alex/i }));

    fireEvent.click(screen.getByRole("button", { name: /draw from splurt deck/i }));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByRole("button", { name: /set current card aside/i }));
    fireEvent.click(screen.getByRole("button", { name: /open alex cards/i }));

    expect(screen.getByText(/1 card claimed/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /^alex$/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    fireEvent.click(screen.getByRole("button", { name: /open set aside cards/i }));

    expect(screen.getByText(/1 card set aside/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /set aside/i })
    ).toBeInTheDocument();
  });
});
