"use client";
import { MessagesTable } from "@/app/(user)/statistics/components/messages-table";
// import MessagesTable from "@/app/(user)/statistics/components/messages-table";
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
import { Star, Upload } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } ;
import React, { useState } from "react";

export default function StatisticsPage() {
  const { user } = useAppContext();
  const [selectedValue, setSelectedValue] = useState("week");

  return (
    <div className="flex flex-col h-full">
      <UserHeader nameUser={user?.name} />
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
        <div className="rounded-2xl bg-white p-5 max-w-full">
          <MessagesTable />
        </div>
      </div>
    </div>
  );
}
