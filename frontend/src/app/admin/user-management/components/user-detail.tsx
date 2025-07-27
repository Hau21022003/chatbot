"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AccountType } from "@/schemas/account.schema";
import React, { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateColor, getInitials, getTextColor } from "@/lib/avatar.utils";
import {
  Check,
  ChevronDown,
  CircleX,
  Clock,
  FileText,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentResType } from "@/schemas/payment.schema";
import { handleErrorApi } from "@/lib/error";
import { userManagementApiRequest } from "@/api-requests/users-management";
import { extractMonth } from "@/lib/utils";

export default function UserDetail({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: AccountType;
}) {
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<
    "pending" | "completed" | "failed" | "all"
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceList, setInvoiceList] = useState<PaymentResType["data"]>([]);
  const loadInvoices = async (userId: string) => {
    if (userId === "") {
      setInvoiceList([]);
      return;
    }
    try {
      const response = await userManagementApiRequest.findPayments(userId);
      setInvoiceList(response.payload.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  useEffect(() => {
    if (!isOpen) {
      setInvoiceStatusFilter(undefined);
      setSearchQuery("");
    } else {
      loadInvoices(user?.id || "");
    }
  }, [isOpen, user]);
  const filteredList = useMemo(() => {
    return invoiceList.filter((item, index) => {
      if (invoiceStatusFilter && invoiceStatusFilter !== "all")
        return item.status === invoiceStatusFilter;
      if (searchQuery == "") return true;
      return index.toString() === searchQuery;
    });
  }, [searchQuery, invoiceList, invoiceStatusFilter]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] sm:max-h-[80vh] flex flex-col">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <Avatar
              className={`${
                user?.avatar
                  ? ""
                  : generateColor(`${user?.firstName} ${user?.lastName}`)
              } flex items-center justify-center w-30 h-30 rounded-full overflow-hidden`}
            >
              <AvatarImage
                className="object-cover w-full h-full"
                src={user?.avatar || ""}
                alt="@shadcn"
              />
              <AvatarFallback
                className={`text-4xl ${getTextColor(
                  `${user?.firstName} ${user?.lastName}`
                )}`}
              >
                {getInitials(`${user?.firstName} ${user?.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="font-medium text-xl">{`${user?.firstName} ${user?.lastName}`}</p>
              <p className="text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>
          <div className=" mt-4 border border-gray-300"></div>
          <div className="mt-4 flex flex-wrap gap-2 items-stretch">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border-2 border-gray-200 px-4 p-2">
              <Search className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Start typing..."
                className="bg-transparent outline-none text-black placeholder-gray-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer p-1.5 px-2.5 flex items-center gap-2 text-gray-400 border-2 border-gray-200 rounded-xl">
                  <p
                    className={`${
                      !invoiceStatusFilter ? "text-gray-500" : "text-black"
                    } leading-none capitalize`}
                  >
                    {invoiceStatusFilter ?? "Any statuses"}
                  </p>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setInvoiceStatusFilter("all")}
                  >
                    All
                    {invoiceStatusFilter == "all" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setInvoiceStatusFilter("completed")}
                  >
                    Completed
                    {invoiceStatusFilter == "completed" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setInvoiceStatusFilter("pending")}
                  >
                    Pending
                    {invoiceStatusFilter == "pending" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setInvoiceStatusFilter("failed")}
                  >
                    Failed
                    {invoiceStatusFilter == "failed" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 py-2 px-4 flex items-end gap-2 rounded-lg bg-gray-300">
              <p className="text-xl font-medium">{invoiceList.length}</p>
              <p>Invoices total</p>
            </div>
            <div className="flex-1 py-2 px-4 flex items-end gap-2 rounded-lg bg-green-100">
              <p className="text-xl font-medium text-green-700">
                $
                {invoiceList.reduce((sum, item) => {
                  if (item.status !== "completed") return sum;
                  return sum + item.amount / 1000;
                }, 0)}
              </p>
              <p>Pais invoices</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Table className="text-gray-500">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-gray-600 p-2 pl-4">
                  Invoice
                </TableHead>
                <TableHead className="text-gray-600 p-2">Status</TableHead>
                <TableHead className="text-gray-600 p-2 pr-4">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {filteredList.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[100px] truncate py-2 pl-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <div>
                        <p className="text-black text-base">Invoice #{index}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(item.createdAt).getDate()}{" "}
                          {extractMonth(new Date(item.createdAt))}{" "}
                          {new Date(item.createdAt).getFullYear()}
                          {", "}
                          {new Date(item.createdAt).getHours()}
                          {":"}
                          {new Date(item.createdAt).getMinutes()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate py-2">
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
                  <TableCell className="max-w-[100px] truncate py-2 pr-4 text-base">
                    {Math.round(item.amount / 1000)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
