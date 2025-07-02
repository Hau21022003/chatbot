import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BotMessageSquare, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card Credit ",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];
const ITEMS_PER_PAGE = 5;

export function MessagesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2 text-gray-600">
        <div className="flex items-start gap-2">
          <BotMessageSquare className="w-6 h-6" />
          <p className="font-medium">Messages</p>
        </div>
        <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg px-4 py-2 w-64">
          <Search className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-black placeholder-gray-500"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table className="rounded-t-lg overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-400 p-2">Tab</TableHead>
              <TableHead className="text-gray-400 p-2">Time</TableHead>
              <TableHead className="text-gray-400 p-2">Input</TableHead>
              <TableHead className="text-gray-400 p-2">Output</TableHead>
              <TableHead className="text-gray-400 text-right p-2">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="max-w-[200px] truncate py-4">
                  {invoice.paymentStatus}
                </TableCell>
                <TableCell className="max-w-[200px] truncate py-4">
                  {invoice.paymentMethod}
                </TableCell>
                <TableCell className="max-w-[200px] truncate py-4">
                  {invoice.paymentMethod}
                </TableCell>
                <TableCell className="max-w-[200px] truncate py-4">
                  {invoice.paymentMethod}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 bg-red-400 hover:bg-red-500 rounded-sm cursor-pointer">
                      <Trash2 className="w-5 h-5 text-white" strokeWidth={2} />
                    </button>
                    <a
                      href="#"
                      className="p-1 bg-blue-400 hover:bg-blue-500 rounded-sm cursor-pointer"
                    >
                      <Eye className="w-5 h-5 text-white" strokeWidth={2} />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center gap-2">
        <p className="mr-6">Page 1 of 7</p>
        <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-sm">
          <ChevronsLeft className="w-5 h-5"/>
        </button>
        <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-sm">
          <ChevronLeft className="w-5 h-5"/>
        </button>
        <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-sm">
          <ChevronRight className="w-5 h-5"/>
        </button>
        <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-sm">
          <ChevronsRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
}
