"use client";

import chatApiRequest from "@/api-requests/chat";
import { Checkbox } from "@/components/ui/checkbox";
import { handleErrorApi } from "@/lib/error";
import { ChatSessionResType } from "@/schemas/chat.schema";
import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HistoryItem = ({
  id,
  title,
  description,
  active = false,
  isChecked,
  onToggle,
}: {
  id: string;
  title: string;
  description: string;
  active?: boolean;
  isChecked: boolean;
  onToggle: (id: string, checked: boolean) => void;
}) => {
  return (
    <div
      className={`flex gap-4 p-2 hover:bg-gray-50 rounded-xl cursor-pointer ${
        active ? "shadow-lg border-2 border-b-gray-50" : ""
      }`}
    >
      <Checkbox
        id={id}
        checked={isChecked}
        onCheckedChange={(checked) => onToggle(id, Boolean(checked))}
        className="data-[state=checked]:bg-gray-700 w-5 h-5 border-2"
      />
      <div className="flex-1 space-x-4">
        <h3 className="font-medium text-lg leading-none">{title}</h3>
        <p className="text-sm text-gray-500 mt-3">{description}</p>
      </div>
    </div>
  );
};

export default function History() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionList, setChatSessionList] = useState<
    ChatSessionResType["data"]["items"]
  >([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  async function loadChatSession() {
    if (!hasNextPage) return;
    try {
      const result = await chatApiRequest.findAllChatSession({
        pageNumber,
        pageSize: 10,
      });
      const { hasNextPage } = result.payload.data.pageMeta;
      setChatSessionList((prev) => [...prev, ...result.payload.data.items]);
      setHasNextPage(hasNextPage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadChatSession();
  }, [pageNumber]);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el || !hasNextPage || isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollHeight - scrollTop - clientHeight < 100) {
        setPageNumber((prev) => prev + 1);
        setIsLoading(true);
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage]);

  function handleToggle(id: string, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  }

  const clearSelected = async () => {
    try {
      await chatApiRequest.removeChatSession(selectedIds);
      setChatSessionList((prev) =>
        prev.filter((session) => !selectedIds.includes(session.id))
      );
      setSelectedIds([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorApi(err);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-gray-50 border-l-2 border-gray-200"
      style={{
        boxShadow: "inset 8px 0 14px -8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="h-16 px-5 flex items-center justify-between gap-2 border-b-2 border-gray-200">
        <span className="font-medium text-xl tracking-wide">History</span>
        <span className="text-sm px-3 py-1 font-medium text-gray-500 bg-gray-100 rounded-2xl">
          2:30 PM
        </span>
      </div>
      {/* <div className="border-t-2 border-gray-200"></div> */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <nav ref={containerRef} className="space-y-4 py-5 px-3 overflow-y-auto">
          {chatSessionList.map((item) => (
            <HistoryItem
              id={item.id}
              key={item.id}
              title={item.sessionName}
              description={item.lastActivity}
              isChecked={selectedIds.includes(item.id)}
              onToggle={handleToggle}
            />
          ))}
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded-md" />
              ))}
            </div>
          )}
        </nav>

        <div className="py-5 px-3 flex justify-center items-center">
          {selectedIds.length > 0 && (
            <button
              onClick={clearSelected}
              className="cursor-pointer p-2 w-full font-medium text-gray-500 flex items-center gap-2 justify-center rounded-lg bg-white shadow-lg border-2 border-b-gray-100"
            >
              <Trash className="w-5 h-5" />
              <span className="leading-none">
                Clear History ({selectedIds.length})
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
