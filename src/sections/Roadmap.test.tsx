import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Roadmap } from "./Roadmap";

describe("Roadmap", () => {
  it("shows three phases with five activities each", () => {
    render(<Roadmap />);
    for (const title of ["Discover and Prepare", "Pilot and Enable", "Evaluate and Expand"]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
    expect(screen.getAllByRole("checkbox")).toHaveLength(15);
    expect(screen.getByText((_, el) => el?.tagName === "P" && el.textContent === "0 of 15 activities complete")).toBeInTheDocument();
  });

  it("expands and collapses an activity's guidance", async () => {
    const user = userEvent.setup();
    render(<Roadmap />);
    const toggle = screen.getByRole("button", { name: /Agree on success criteria/ });
    const detail = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(detail).not.toBeVisible();
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(detail).toBeVisible();
    await user.click(toggle);
    expect(detail).not.toBeVisible();
  });

  it("tracks completion per phase and overall, and resets", async () => {
    const user = userEvent.setup();
    render(<Roadmap />);
    const overall = screen.getByRole("progressbar", { name: "Overall roadmap progress" });
    const phase = screen.getByRole("progressbar", { name: "Discover and Prepare progress" });
    const checks = within(phase.closest("section")!).getAllByRole("checkbox");
    for (const box of checks) await user.click(box);
    expect(phase).toHaveAttribute("aria-valuenow", "100");
    expect(overall).toHaveAttribute("aria-valuenow", "33");
    expect(screen.getByText(/Complete ✓/)).toBeInTheDocument();
    await user.click(checks[0]);
    expect(phase).toHaveAttribute("aria-valuenow", "80");
    await user.click(screen.getByRole("button", { name: "Reset progress" }));
    expect(overall).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("button", { name: "Reset progress" })).toBeDisabled();
  });

  it("is keyboard operable", async () => {
    const user = userEvent.setup();
    render(<Roadmap />);
    const box = screen.getByRole("checkbox", { name: 'Mark "Launch a controlled pilot" complete' });
    box.focus();
    await user.keyboard(" ");
    expect(box).toBeChecked();
    const toggle = screen.getByRole("button", { name: /Launch a controlled pilot/ });
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("expands and collapses everything", async () => {
    const user = userEvent.setup();
    render(<Roadmap />);
    await user.click(screen.getByRole("button", { name: "Expand all" }));
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(15);
    await user.click(screen.getByRole("button", { name: "Collapse all" }));
    expect(screen.queryAllByRole("button", { expanded: true })).toHaveLength(0);
  });
});
