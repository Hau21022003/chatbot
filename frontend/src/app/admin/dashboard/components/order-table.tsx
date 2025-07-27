"use client";
import { paymentApiRequest } from "@/api-requests/payment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateColor, getInitials, getTextColor } from "@/lib/avatar.utils";
import { handleErrorApi } from "@/lib/error";
import { extractMonth } from "@/lib/utils";
import { defaultPageMeta, PageMetaResType } from "@/schemas/common.schema";
import {
  FindAllPaymentBodyType,
  FindAllPaymentResType,
} from "@/schemas/payment.schema";
import {
  Calendar1,
  Check,
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  Clock,
  Globe,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export default function OrderTable() {
  const now = new Date();
  const lastMonthDate = new Date(now);
  lastMonthDate.setMonth(now.getMonth() - 1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: lastMonthDate,
    to: now,
  });
  const [invoiceList, setInvoiceList] = useState<
    FindAllPaymentResType["data"]["items"]
  >([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [pageMeta, setPageMeta] = useState<PageMetaResType>(defaultPageMeta);
  const loadInvoices = async () => {
    try {
      const body: FindAllPaymentBodyType = { pageNumber: pagination.pageIndex };
      if (dateRange?.from) body.from = dateRange.from;
      if (dateRange?.to) body.to = dateRange.to;
      const result = await paymentApiRequest.findAll(body);
      setInvoiceList(result.payload.data.items);
      setPageMeta(result.payload.data.pageMeta);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi(error);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [pagination, dateRange]);

  return (
    <div className="p-3 rounded-lg border-2 border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="p-1 rounded-sm bg-gray-100">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-medium leading-none">Orders Data</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="dates"
              className="w-56 justify-between font-normal"
            >
              <div className="flex gap-2 items-center">
                <Calendar1 className="w-5 h-5 text-gray-500" />
                {dateRange?.from && dateRange?.to
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  : "Select date"}
              </div>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              captionLayout="dropdown"
              onSelect={(range) => {
                setDateRange(range);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table className="rounded-t-lg overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-400 p-2 pl-4">Client</TableHead>
              <TableHead className="text-gray-400 p-2">Status</TableHead>
              <TableHead className="text-gray-400 p-2">Amount</TableHead>
              <TableHead className="text-gray-400 p-2 pr-4">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="truncate py-4 pl-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      className={`${
                        item?.user?.avatar
                          ? ""
                          : generateColor(
                              `${item?.user?.firstName} ${item?.user?.lastName}`
                            )
                      } flex items-center justify-center w-10 h-10 rounded-full overflow-hidden`}
                    >
                      <AvatarImage
                        className="object-cover w-full h-full"
                        src={item?.user?.avatar || ""}
                        alt="@shadcn"
                      />
                      <AvatarFallback
                        className={`text-lg ${getTextColor(
                          `${item?.user?.firstName} ${item?.user?.lastName}`
                        )}`}
                      >
                        {getInitials(
                          `${item?.user?.firstName} ${item?.user?.lastName}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{`${item?.user?.firstName} ${item?.user?.lastName}`}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate py-4">
                  {item.status === "completed" && (
                    <div className="w-fit flex items-center gap-1 p-2 px-3 rounded-lg text-sm bg-green-100 text-green-600">
                      <Check className="w-4 h-4" />
                      <p className="leading-none">Completed</p>
                    </div>
                  )}
                  {item.status === "pending" && (
                    <div className="w-fit flex items-center gap-1 p-2 px-3 rounded-lg text-sm bg-yellow-100 text-yellow-600">
                      <Clock className="w-4 h-4" />
                      <p className="leading-none">Pending</p>
                    </div>
                  )}
                  {item.status === "failed" && (
                    <div className="w-fit flex items-center gap-1 p-2 px-3 rounded-lg text-sm bg-red-100 text-red-600">
                      <CircleX className="w-4 h-4" />
                      <p className="leading-none">Failed</p>
                    </div>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px] truncate py-4">
                  {item.amount / 1000}
                </TableCell>
                <TableCell className="truncate py-4">
                  {extractMonth(new Date(item.createdAt))},{" "}
                  {new Date(item.createdAt).getDate()},{" "}
                  {new Date(item.createdAt).getFullYear()}{" "}
                  {new Date(item.createdAt).getHours()}
                  {":"}
                  {new Date(item.createdAt).getMinutes()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center gap-2">
        <p className="mr-6">
          Page {pagination.pageIndex} of {pageMeta.totalPages}
        </p>
        <button
          disabled={pagination.pageIndex === 1}
          onClick={() => setPagination({ pageIndex: 0, pageSize: 10 })}
          className={`p-2 border border-gray-300 rounded-sm ${
            pagination.pageIndex === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>
        <button
          disabled={pagination.pageIndex === 1}
          onClick={() =>
            setPagination({
              pageIndex: Math.max(1, pagination.pageIndex - 1),
              pageSize: 10,
            })
          }
          className={`p-2 border border-gray-300 rounded-sm ${
            pagination.pageIndex === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          disabled={pagination.pageIndex === pageMeta.totalPages}
          onClick={() =>
            setPagination({
              pageIndex: Math.min(
                pageMeta.totalPages,
                pagination.pageIndex + 1
              ),
              pageSize: 10,
            })
          }
          className={`p-2 border border-gray-300 rounded-sm ${
            pagination.pageIndex === pageMeta.totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          disabled={pagination.pageIndex === pageMeta.totalPages}
          onClick={() =>
            setPagination({ pageIndex: pageMeta.totalPages, pageSize: 10 })
          }
          className={`p-2 border border-gray-300 rounded-sm ${
            pagination.pageIndex === pageMeta.totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
