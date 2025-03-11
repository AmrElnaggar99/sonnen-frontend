import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BatteryLevelsCard from "@/components/battery/BatteryLevelsCard";
import { DateTime } from "luxon";
import "@testing-library/jest-dom";

jest.mock("@/components/battery/BatteryChart", () => ({
  __esModule: true,
  default: jest.fn(({ cutoffTime }) => <div data-testid="battery-chart">{cutoffTime.toISO()}</div>),
}));

describe("BatteryLevelsCard", () => {
  it("renders correctly and has 24 hours filter by default", () => {
    render(<BatteryLevelsCard />);

    expect(screen.getByText("Battery Charging History")).toBeInTheDocument();
    expect(screen.getByText("Last 24 Hours")).toBeInTheDocument();
  });

  it("updates cutoffTime when selecting different time ranges", () => {
    render(<BatteryLevelsCard />);

    const now = DateTime.fromISO("2024-09-03T06:01:02.835Z").setZone(DateTime.local().zoneName); // TODO: Change this to DateTime.now().startOf("second") when the actual API is available

    // Default is 24h
    expect(screen.getByTestId("battery-chart")).toHaveTextContent(now.minus({ hours: 24 }).toISO() as string);

    // Select 6h
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Last 6 Hours"));
    expect(screen.getByTestId("battery-chart")).toHaveTextContent(now.minus({ hours: 6 }).toISO() as string);

    // Select 12h
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Last 12 Hours"));
    expect(screen.getByTestId("battery-chart")).toHaveTextContent(now.minus({ hours: 12 }).toISO() as string);
  });
});
