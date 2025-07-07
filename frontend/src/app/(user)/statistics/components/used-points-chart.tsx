"use client";
import { ChartNoAxesCombined } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useEffect, useState } from "react";
import { useStatisticContext } from "@/app/(user)/statistics/page";
import { extractDay } from "@/lib/utils";

const CustomDot = ({
  cx,
  cy,
  stroke = "1",
}: {
  cx?: number;
  cy?: number;
  stroke?: string;
}) => {
  return (
    <circle cx={cx} cy={cy} r={4} stroke={stroke} strokeWidth={2} fill="#fff" />
  );
};

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  desktop: {
    label: "Points",
    color: "#dd808d",
  },
  mobile: {
    label: "Count",
    color: "#4b80db",
  },
} satisfies ChartConfig;

type ChartType = {
  desktop: number;
  mobile: number;
  day: string;
};

export default function UsedPointsChart() {
  const { statisticData } = useStatisticContext();
  const [chartData, setChartData] = useState<ChartType[]>([]);
  useEffect(() => {
    // const days = [
    //   "Sunday",
    //   "Monday",
    //   "Tuesday",
    //   "Wednesday",
    //   "Thursday",
    //   "Friday",
    //   "Saturday",
    // ];
    const data =
      statisticData?.userUsages.map((item) => {
        const dayOfWeek = extractDay(new Date(item.date));
        return {
          day: dayOfWeek,
          desktop: item.totalPointsUsed,
          mobile: item.messageCount,
        } as ChartType;
      }) || [];

    setChartData(data);
  }, [statisticData]);
  return (
    <div className="h-full rounded-2xl bg-white p-5 space-y-8">
      <div className="flex items-center justify-between text-gray-600">
        <div className="flex gap-2 items-center">
          <ChartNoAxesCombined className="w-6 h-6" />
          <p className="font-medium leading-none">Report</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: chartConfig.desktop.color }}
            ></div>
            <p className="leading-none">Used points</p>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: chartConfig.mobile.color }}
            ></div>
            <p className="leading-none">Messages Count</p>
          </div>
        </div>
      </div>
      <div className="flex gap-12">
        <div className="space-y-2">
          <p className="text-gray-600">Avg Used Points</p>
          <p className="text-3xl font-extrabold">210</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Avg Messages Count</p>
          <p className="text-3xl font-extrabold">210</p>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-60 w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="mobile"
            type="linear"
            fill="url(#fillMobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId="a"
            strokeWidth={2}
            dot={<CustomDot stroke="var(--color-mobile)" />}
          />
          <Area
            dataKey="desktop"
            type="linear"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            strokeWidth={2}
            stroke="var(--color-desktop)"
            stackId="a"
            dot={<CustomDot stroke="var(--color-desktop)" />}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
