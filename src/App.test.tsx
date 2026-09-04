import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";

test("renders the main game page and routes into Splurt", async () => {
  render(
    <MemoryRouter initialEntries={["/drinking-game"]}>
      <App />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/welcome to ze best drinking game of yo life/i)
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /splurt/i }));

  expect(
    await screen.findByRole("heading", { level: 2, name: /^splurt$/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /draw from splurt deck/i })
  ).toBeInTheDocument();
});

test("routes into We're Not Really Strangers from the main page", async () => {
  render(
    <MemoryRouter initialEntries={["/drinking-game"]}>
      <App />
    </MemoryRouter>
  );

  fireEvent.click(
    await screen.findByRole("button", { name: /we're not really strangers/i })
  );

  expect(
    await screen.findByRole("heading", { name: /we're not really strangers/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /start level 1: perception/i })
  ).toBeInTheDocument();
});
