"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useChargingData from "@/hooks/useChargingData";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDateToLocaleString, formatDateToLocaleTime } from "@/lib/dateFormatters";
import { DateTime } from "luxon";

function BatteryChart({ cutoffTime }: { cutoffTime?: DateTime }) {
  const { data, isLoading, isError } = useChargingData();

  return isLoading ? (
    <div className="px-6">
      <LoadingSkeleton />
    </div>
  ) : isError ? (
    <div className="px-6">
      <ErrorAlert />
    </div>
  ) : (
    <div className="pr-6">
      <ChargingLevelsChart data={data ?? []} cutoffTime={cutoffTime} />
    </div>
  );
}

function ChargingLevelsChart({
  data,
  cutoffTime,
}: {
  data: { date: string; chargingLevel: number }[];
  cutoffTime?: DateTime;
}) {
  const chartConfig = {
    chargingLevel: {
      label: "Charging Level (%):\u00A0",
      color: "hsl(220, 98%, 61%)",
    },
  };

  const filteredData = cutoffTime
    ? data?.filter((entry) => {
        const entryTime = DateTime.fromISO(entry.date);
        return entryTime >= cutoffTime;
      })
    : [...data];

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-1 md:aspect-[3/1] md:max-h-[400px]">
      <LineChart data={filteredData} accessibilityLayer aria-label="Battery Charging Levels">
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickMargin={10}
          axisLine={false}
          tickLine={false}
          minTickGap={10}
          tickFormatter={(tick) => formatDateToLocaleTime(tick, navigator.language)}
        />
        <YAxis domain={[0, 100]} tickMargin={10} axisLine={false} tickLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent labelFormatter={(label) => formatDateToLocaleString(label, navigator.language)} />
          }
        />
        <Line
          strokeWidth={2}
          dot={{ fill: chartConfig.chargingLevel.color }}
          activeDot={{ r: 6 }}
          type="monotone"
          dataKey="chargingLevel"
          stroke={chartConfig.chargingLevel.color}
        />
      </LineChart>
    </ChartContainer>
  );
}

function LoadingSkeleton() {
  return (
    <div role="status" aria-live="polite" className="w-full h-80 flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

function ErrorAlert() {
  return (
    <Alert variant="destructive" className="h-80 w-full flex flex-col items-center justify-center gap-5">
      <div className="flex gap-4 items-center">
        <AlertCircle aria-hidden="true" />
        <AlertTitle className="font-bold text-lg">Error</AlertTitle>
      </div>
      <AlertDescription>Please check your internet connection or try again later.</AlertDescription>
    </Alert>
  );
}

export default BatteryChart;
