import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RevenueCalculator } from "./RevenueCalculator";

const stat = (label: string) => screen.getByText(label).nextElementSibling?.textContent;

describe("RevenueCalculator", () => {
  it("shows the default illustrative estimate and its formulas", () => {
    render(<RevenueCalculator />);
    expect(stat("Estimated adopted licences")).toBe("300");
    expect(stat("Illustrative monthly customer spend")).toBe("$5,700");
    expect(stat("Illustrative annual customer spend")).toBe("$68,400");
    expect(stat("Illustrative annual partner gross margin")).toBe("$6,840");
    expect(screen.getByText(/Annual partner gross margin = annual customer spend × partner margin %/)).toBeInTheDocument();
    expect(screen.getByText(/nothing here is an official GitHub, Microsoft or Arrow price/)).toBeInTheDocument();
  });

  it("recalculates as assumptions change", async () => {
    const user = userEvent.setup();
    render(<RevenueCalculator />);
    const devs = screen.getByLabelText("Eligible developers");
    await user.clear(devs);
    await user.type(devs, "1000");
    expect(stat("Estimated adopted licences")).toBe("600");
    const cost = screen.getByLabelText("Assumed monthly licence cost per user");
    await user.clear(cost);
    await user.type(cost, "39");
    expect(stat("Illustrative annual customer spend")).toBe("$280,800");
  });

  it("shows a clear error and no estimate for invalid input", async () => {
    const user = userEvent.setup();
    render(<RevenueCalculator />);
    const adoption = screen.getByLabelText("Expected adoption");
    await user.clear(adoption);
    await user.type(adoption, "150");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a value from 0 to 100.");
    expect(adoption).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("Estimated adopted licences")).not.toBeInTheDocument();
    expect(screen.getByText("Fix the highlighted assumptions to see the estimate.")).toBeInTheDocument();
    await user.clear(adoption);
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a number.");
  });

  it("resets to the example values and changes display currency", async () => {
    const user = userEvent.setup();
    render(<RevenueCalculator />);
    const devs = screen.getByLabelText("Eligible developers");
    await user.clear(devs);
    await user.type(devs, "7");
    await user.click(screen.getByRole("button", { name: "Reset to example values" }));
    expect(devs).toHaveValue(500);
    await user.selectOptions(screen.getByLabelText("Currency (display only)"), "EUR");
    expect(stat("Illustrative annual customer spend")).toBe("€68,400");
  });
});
