"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { subDays, subMonths, isAfter } from "date-fns";

import { Registry } from "@/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActivityGraphProps = {
  registries: Registry[];
};

type TimePeriod = "week" | "month" | "year";

const chartConfig = {
  count: {
    label: "Activity",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ActivityGraph({ registries }: ActivityGraphProps) {
  const [timePeriod, setTimePeriod] = React.useState<TimePeriod>("month");

  const chartData = React.useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timePeriod) {
      case "week":
        startDate = subDays(now, 7);
        break;
      case "month":
        startDate = subDays(now, 30);
        break;
      case "year":
        startDate = subMonths(now, 12);
        break;
    }

    // Calculate activity count for each registry within the time period
    const registryActivity = registries.map((registry, index) => {
      let count = 0;
      if (registry.latestItems) {
        registry.latestItems.forEach((item) => {
          const date = new Date(item.pubDate);
          if (isAfter(date, startDate)) {
            count++;
          }
        });
      }
      return {
        label: registry.name,
        count,
        fill: `var(--chart-${(index % 5) + 1})`,
      };
    });

    // Filter out registries with no activity and sort by count (descending)
    return registryActivity
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [registries, timePeriod]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-end gap-2 mb-4">
        <div className="flex items-center rounded-lg border bg-muted/40 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimePeriod("month")}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-medium hover:bg-background hover:text-foreground",
              timePeriod === "month" && "bg-background shadow-sm"
            )}
          >
            Month
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimePeriod("week")}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-medium hover:bg-background hover:text-foreground",
              timePeriod === "week" && "bg-background shadow-sm"
            )}
          >
            Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimePeriod("year")}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-medium hover:bg-background hover:text-foreground",
              timePeriod === "year" && "bg-background shadow-sm"
            )}
          >
            Year
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(300, chartData.length * 50) }}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                left: 24,
                right: 12,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" dataKey="count" hide />
              <YAxis
                dataKey="label"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="count"
                    labelFormatter={(value) => value}
                  />
                }
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No activity found for this period
          </div>
        )}
      </div>
    </div>
  );
}
