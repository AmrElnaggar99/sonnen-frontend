import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DateTime } from "luxon";
import "@testing-library/jest-dom";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithProviders = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>);

// Mock shadcn chart components
jest.mock("@/components/ui/chart", () => ({
  __esModule: true,
  ChartContainer: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="MockChartContainer" {...props}>
      {children}
    </div>
  ),
  ChartTooltip: () => <div data-testid="MockChartTooltip" />,
  ChartTooltipContent: () => <div data-testid="MockChartTooltipContent" />,
}));

jest.mock("recharts", () => {
  const ActualRecharts = jest.requireActual("recharts"); // Keep other components unchanged
  return {
    __esModule: true,
    ...ActualRecharts, // Spread the actual module to prevent missing exports
    LineChart: ({ data }: { data: any[] }) => (
      <div data-testid="MockLineChart">
        {data.map((entry) => (
          <div key={entry.date}>{entry.chargingLevel}</div>
        ))}
      </div>
    ),
  };
});

const mockUseChargingData = (mockData: any) => {
  jest.doMock("@/hooks/useChargingData", () => ({
    __esModule: true,
    default: () => mockData,
  }));
};

describe("BatteryChart Component", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("renders loading skeleton when fetching data", async () => {
    mockUseChargingData({ data: [], isLoading: true, isError: false });
    const { default: BatteryChart } = await import("@/components/battery/BatteryChart");
    renderWithProviders(<BatteryChart />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the chart when data is available", async () => {
    mockUseChargingData({
      data: [
        { date: "2024-09-02T07:00:12.072Z", chargingLevel: 42 },
        { date: "2024-09-02T08:00:02.836Z", chargingLevel: 50 },
      ],
      isLoading: false,
      isError: false,
    });
    const { default: BatteryChart } = await import("@/components/battery/BatteryChart");
    renderWithProviders(<BatteryChart />);

    await waitFor(() => {
      expect(screen.getByTestId("MockChartContainer")).toBeInTheDocument();
    });
  });

  it("renders error message if data fetching fails", async () => {
    mockUseChargingData({ data: [], isLoading: false, isError: true });
    const { default: BatteryChart } = await import("@/components/battery/BatteryChart");
    renderWithProviders(<BatteryChart />);
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  it("filters data correctly based on cutoffTime", async () => {
    const mockData = [
      { date: "2024-09-03T02:00:00.000Z", chargingLevel: 20 },
      { date: "2024-09-03T04:00:00.000Z", chargingLevel: 40 },
      { date: "2024-09-03T06:00:00.000Z", chargingLevel: 60 },
    ];

    const cutoffTime = DateTime.fromISO("2024-09-03T04:00:00.000Z");
    mockUseChargingData({
      data: mockData,
      isLoading: false,
      isError: false,
    });
    const { default: BatteryChart } = await import("@/components/battery/BatteryChart");
    renderWithProviders(<BatteryChart cutoffTime={cutoffTime} />);

    expect(screen.queryByText("20")).not.toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });
  it("renders all data if no cutoffTime is provided", async () => {
    const mockData = [
      { date: "2024-09-03T02:00:00.000Z", chargingLevel: 20 },
      { date: "2024-09-03T04:00:00.000Z", chargingLevel: 40 },
      { date: "2024-09-03T06:00:00.000Z", chargingLevel: 60 },
    ];

    mockUseChargingData({
      data: mockData,
      isLoading: false,
      isError: false,
    });
    const { default: BatteryChart } = await import("@/components/battery/BatteryChart");
    renderWithProviders(<BatteryChart />);

    // Ensure all data is displayed when no cutoffTime is set
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });
});
