import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

const nav = () => screen.getByRole("navigation", { name: "Dashboard sections" });

describe("navigation", () => {
  it("opens on the overview with every section in the navigation", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "GitHub Copilot partner enablement" })).toBeInTheDocument();
    expect(within(nav()).getAllByRole("link").map((l) => l.textContent)).toEqual([
      "01Overview",
      "02Revenue Calculator",
      "03Adoption Dashboard",
      "0430/60/90 Roadmap",
    ]);
    expect(within(nav()).getByRole("link", { name: /Overview/ })).toHaveAttribute("aria-current", "page");
  });

  it("switches sections, updates the hash and moves focus to the new heading", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(within(nav()).getByRole("link", { name: /Revenue Calculator/ }));
    const heading = screen.getByRole("heading", { level: 1, name: "Illustrative revenue calculator" });
    expect(heading).toHaveFocus();
    expect(window.location.hash).toBe("#calculator");
    expect(within(nav()).getByRole("link", { name: /Revenue Calculator/ })).toHaveAttribute("aria-current", "page");
  });

  it("opens the section named in the URL hash and follows hash changes", async () => {
    window.location.hash = "#roadmap";
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "Customer enablement roadmap" })).toBeInTheDocument();
    window.location.hash = "#adoption";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(await screen.findByRole("heading", { level: 1, name: /Copilot adoption: Contoso Ltd/ })).toBeInTheDocument();
  });

  it("falls back to the overview for an unknown hash", () => {
    window.location.hash = "#nope";
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "GitHub Copilot partner enablement" })).toBeInTheDocument();
  });

  it("labels demonstration data and states it is not an official product", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("note")).toHaveTextContent(/Not an official GitHub, Microsoft or Arrow product/);
    expect(screen.getAllByText(/Demonstration data|Fictional customers/).length).toBeGreaterThan(0);
    await user.click(within(nav()).getByRole("link", { name: /Adoption Dashboard/ }));
    expect(screen.getAllByText(/not real Copilot metrics|Example data/i).length).toBeGreaterThan(0);
  });

  it("overview cards navigate to their sections", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /30\/60\/90 Roadmap/ }));
    expect(screen.getByRole("heading", { level: 1, name: "Customer enablement roadmap" })).toBeInTheDocument();
  });
});
