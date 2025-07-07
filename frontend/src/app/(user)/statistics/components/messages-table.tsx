import { statisticApiRequest } from "@/api-requests/statistic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleErrorApi } from "@/lib/error";
import { extractMonth } from "@/lib/utils";
import { FindAllChatResType } from "@/schemas/statistic.schema";
import {
  BotMessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

export function MessagesTable() {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [messageList, setMessageList] = useState<
    FindAllChatResType["data"]["items"]
  >([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [pageMeta, setPageMeta] = useState<
    FindAllChatResType["data"]["pageMeta"]
  >({
    hasNextPage: false,
    hasPrevPage: false,
    pageNumber: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const loadChat = async () => {
    try {
      const result = await statisticApiRequest.findAllChats({
        search: searchValue,
        pageNumber: pagination.pageIndex,
      });
      setMessageList(result.payload.data.items);
      setPageMeta(result.payload.data.pageMeta);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi(error);
    }
  };

  const handleSearchUpdate = () => {
    setSearchValue(inputValue);
    setPagination({ pageIndex: 1, pageSize: 10 });
  };

  useEffect(() => {
    loadChat();
  }, [pagination, searchValue]);

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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSearchUpdate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchUpdate();
              }
            }}
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
              <TableHead className="text-gray-400 p-2 pl-4">Tab</TableHead>
              <TableHead className="text-gray-400 p-2">Time</TableHead>
              <TableHead className="text-gray-400 p-2">Input</TableHead>
              <TableHead className="text-gray-400 p-2">Output</TableHead>
              <TableHead className="text-gray-400 text-right p-2 pr-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messageList.map((message) => (
              <TableRow key={message.ids[0]}>
                <TableCell className="max-w-[50px] truncate py-4 pl-4">
                  {message.sessionName}
                </TableCell>
                <TableCell className="truncate py-4">
                  {extractMonth(new Date(message.createdAt))},{" "}
                  {new Date(message.createdAt).getDate()},{" "}
                  {new Date(message.createdAt).getFullYear()}{" "}
                  {new Date(message.createdAt).getHours()}
                  {":"}
                  {new Date(message.createdAt).getMinutes()}
                </TableCell>
                <TableCell className="max-w-[200px] truncate py-4">
                  {message.input}
                </TableCell>
                <TableCell className="max-w-[200px] truncate py-4">
                  {message.output}
                </TableCell>
                <TableCell className="py-4 pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 bg-red-400 hover:bg-red-500 rounded-sm cursor-pointer">
                      <Trash2 className="w-5 h-5 text-white" strokeWidth={2} />
                    </button>
                    <a
                      href={`/chat/${message.sessionId}?messageId=${message.ids[0]}`}
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
