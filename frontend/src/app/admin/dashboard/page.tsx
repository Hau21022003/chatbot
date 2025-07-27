"use client";
import OrderTable from "@/app/admin/dashboard/components/order-table";
import OrderChart from "@/app/admin/dashboard/components/order-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import React, { useState } from "react";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [year, setYear] = useState(currentYear.toString());

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center">
      <div className="px-8 py-8 max-w-6xl w-full">
        <div className="flex items-center gap-6 justify-between">
          <p className="text-2xl font-medium leading-none">Dashboard</p>
          <Select value={year} onValueChange={setYear}>
            {/* <Select> */}
            <SelectTrigger className="font-medium flex items-center bg-white px-4 py-[6px] [&>svg]:w-5 [&>svg]:h-5">
              <Calendar className="text-muted-foreground leading-none" />
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4">
          <OrderChart year={year} />
        </div>
        <div className="mt-2">
          <OrderTable />
        </div>
      </div>
    </div>
  );
}
