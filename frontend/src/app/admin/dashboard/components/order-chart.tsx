"use client";
import {
  ChartColumn,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { handleErrorApi } from "@/lib/error";
import { paymentApiRequest } from "@/api-requests/payment";

// const chartData = [
//   { month: "January", income: 186 },
//   { month: "February", income: 305 },
//   { month: "March", income: 237 },
//   { month: "April", income: 73 },
//   { month: "May", income: 209 },
//   { month: "June", income: 214 },
// ];

const chartConfig = {
  income: {
    label: "Income",
    // color: "hsl(var(--chart-1))",
    color: "#8ec5ff",
  },
} satisfies ChartConfig;

export default function OrderChart({ year }: { year: string }) {
  const [chartData, setChartData] = useState<
    { month: string; income: number }[]
  >([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [growth, setGrowth] = useState<{
    growthStatus: "increase" | "decrease";
    growthRate: number;
  }>();
  const loadData = async () => {
    try {
      const rsp = await paymentApiRequest.statistic(year);
      const { total, monthlyTotals, growthRate, growthStatus } =
        rsp.payload.data;

      const data = monthlyTotals.map((item) => ({
        month: item.month,
        income: item.total,
      }));
      setTotalIncome(total);
      setChartData(data);
      setGrowth({ growthRate: growthRate, growthStatus: growthStatus });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  useEffect(() => {
    loadData();
  }, [year]);
  const isIncrease = false;
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="rounded-lg  border-2 border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-gray-100">
            <CircleDollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-medium mr-6">Total Received</p>
          <div
            className={`flex items-center gap-1 ${
              growth?.growthStatus === "increase"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {growth?.growthStatus === "increase" && (
              <TrendingUp className="w-4 h-4" />
            )}
            {!(growth?.growthStatus === "increase") && (
              <TrendingDown className="w-4 h-4" />
            )}
            <p className="leading-none text-sm font-bold">
              {(growth?.growthRate ?? 0).toFixed(1)}%
            </p>
          </div>
        </div>
        <p className="mt-4 font-semibold text-3xl">{totalIncome}</p>
        <p className="mt-1 text-gray-500">Since last year</p>
      </div>
      <div className="flex-1 p-3 border-2 border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-gray-100">
            <ChartColumn className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-medium">Income Analytics</p>
        </div>
        <ChartContainer
          config={chartConfig}
          className="mt-4 max-h-[300px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* <Bar dataKey="income" fill="var(--color-income)" radius={8} /> */}
            <Bar dataKey="income" fill={chartConfig.income.color} radius={8} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
