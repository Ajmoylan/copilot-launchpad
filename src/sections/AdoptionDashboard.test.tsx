import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdoptionDashboard } from "./AdoptionDashboard";

const stat = (label: string) => screen.getByText(label).nextElementSibling?.textContent;

describe("AdoptionDashboard", () => {
  it("shows the example programme's latest week and labels it as example data", () => {
    render(<AdoptionDashboard />);
    expect(stat("Eligible developers")).toBe("420");
    expect(stat("Pilot participants")).toBe("40");
    expect(stat("Adopted licences")).toBe("231");
    expect(stat("Adoption")).toBe("55%");
    expect(screen.getByText(/not real Copilot metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/doesn.t connect to GitHub or retrieve real usage data/)).toBeInTheDocument();
  });

  it("updates the metrics when another week is selected", () => {
    render(<AdoptionDashboard />);
    fireEvent.change(screen.getByLabelText(/Programme week/), { target: { value: "3" } });
    expect(stat("Adopted licences")).toBe("38");
    expect(stat("Adoption")).toBe("9%");
    expect(screen.getByText(/Target 40 \(-2\)/)).toBeInTheDocument();
  });
});
