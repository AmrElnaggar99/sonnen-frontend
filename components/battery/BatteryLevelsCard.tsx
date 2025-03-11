"use client";
import { useState } from "react";
import BatteryChart from "./BatteryChart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DateTime } from "luxon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function BatteryLevelsCard() {
  const userTimeZone = DateTime.local().zoneName;
  const [timeRange, setTimeRange] = useState("24h");
  const now = DateTime.fromISO("2024-09-03T06:01:02.835Z").setZone(userTimeZone); // TODO: Change this to DateTime.now().startOf("second") when the actual API is available
  const cutoffTime = now.minus({
    hours: timeRange === "6h" ? 6 : timeRange === "12h" ? 12 : 24,
  });

  return (
    <Card className="md:p-4">
      <CardHeader className="text-lg font-semibold text-center flex justify-between sm:flex-row items-center gap-4">
        <h2>Battery Charging History</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger aria-label="Filter by time range">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6h">Last 6 Hours</SelectItem>
            <SelectItem value="12h">Last 12 Hours</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <BatteryChart cutoffTime={cutoffTime} />
      </CardContent>
    </Card>
  );
}

export default BatteryLevelsCard;
