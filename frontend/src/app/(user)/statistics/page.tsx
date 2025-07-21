"use client";
import { statisticApiRequest } from "@/api-requests/statistic";
import { MessagesTable } from "@/app/(user)/statistics/components/messages-table";
import PointsChart from "@/app/(user)/statistics/components/points-chart";
import UsedPointsChart from "@/app/(user)/statistics/components/used-points-chart";
import { useAppContext } from "@/app/app-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserHeader from "@/components/user-header";
import { handleErrorApi } from "@/lib/error";
import { StatisticResType } from "@/schemas/statistic.schema";
import { Star, Upload } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";

export const StatisticContext = createContext<{
  statisticData: StatisticResType["data"] | undefined;
  setStatisticData: React.Dispatch<
    React.SetStateAction<StatisticResType["data"] | undefined>
  >;
}>({ statisticData: undefined, setStatisticData: () => {} });
export const useStatisticContext = () => useContext(StatisticContext);

export default function StatisticsPage() {
  const { user } = useAppContext();
  const [selectedValue, setSelectedValue] = useState("week");
  const [statisticData, setStatisticData] = useState<
    StatisticResType["data"] | undefined
  >(undefined);
  const [dateRange, setDateRange] = useState<7 | 30>(7);
  const loadStatisticData = async () => {
    try {
      const result = await statisticApiRequest.statistic({
        dateRange: dateRange,
      });
      setStatisticData(result.payload.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorApi(err);
    }
  };
  useEffect(() => {
    loadStatisticData();
  }, [dateRange]);

  useEffect(() => {
    let newRange: 7 | 30 = 7;
    if (selectedValue == "month") {
      newRange = 30;
    }
    setDateRange(newRange);
  }, [selectedValue]);

  return (
    <div className="flex flex-col h-full">
      <UserHeader user={user} />
      <div className="px-8 py-6 space-y-4 bg-[#f9fbfc] flex-1 overflow-y-auto">
        <div className="flex items-stretch justify-between gap-4">
          <div className="flex flex-col gap-2 justify-center">
            <p className="font-extrabold text-xl tracking-wide">Statistics</p>
            <p>This is data statistics for the last 7 days</p>
          </div>
          <div className="flex items-stretch gap-4">
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger className="w-[130px] font-medium text-[17px] bg-white px-4 h-full py-[30px] [&>svg]:w-6 [&>svg]:h-6">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <button className="flex items-center justify-center gap-2 text-white w-[130px] h-full rounded-lg bg-orange-500">
              <Upload className="w-6 h-6" />
              <p className="font-medium leading-none">Export</p>
            </button>
          </div>
        </div>

        <StatisticContext.Provider value={{ statisticData, setStatisticData }}>
          <div className="flex items-stretch gap-4">
            <div className=" rounded-2xl bg-white p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-orange-500" />
                <p className="leading-none font-medium text-gray-600">Points</p>
              </div>
              <PointsChart />
            </div>
            <div className="flex-1">
              <UsedPointsChart />
            </div>
          </div>
        </StatisticContext.Provider>
        <div className="rounded-2xl bg-white p-5 max-w-full">
          <MessagesTable />
        </div>
      </div>
    </div>
  );
}
