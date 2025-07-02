"use client";

import chatApiRequest from "@/api-requests/chat";
import { Checkbox } from "@/components/ui/checkbox";
import { handleErrorApi } from "@/lib/error";
import { ChatSessionResType } from "@/schemas/chat.schema";
import { Pen, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/app/(user)/chat/[chatSessionId]/page";

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
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const renameChatSession = async () => {
    setIsEditing(false);
    try {
      await chatApiRequest.renameChatSession(id, { sessionName: editTitle });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setEditTitle(title);
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      onClick={() => {
        if (!active) {
          router.push(`/chat/${id}`);
          router.refresh();
        }
      }}
      className={`group flex gap-4 px-3 py-3 hover:bg-gray-50 rounded-xl ${
        active ? "shadow-lg border-1" : "cursor-pointer"
      }`}
    >
      <Checkbox
        id={id}
        checked={isChecked}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(checked) => onToggle(id, Boolean(checked))}
        className="data-[state=checked]:bg-gray-700 w-5 h-5 border-2 border-gray-400 cursor-pointer hover:bg-gray-200"
      />
      {/* <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg leading-none">{title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100"
            title="Đổi tên"
          >
            <Pen className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">{description}</p>
      </div> */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={renameChatSession}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                renameChatSession();
              }
            }}
            style={{ lineHeight: "inherit" }}
            className="font-medium leading-none text-lg w-full outline-none border-none focus:ring-0 focus:outline-none bg-transparent p-0 m-0"
          />
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium leading-none text-lg truncate flex-1 min-w-0">
              {editTitle}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100"
              title="Rename"
            >
              <Pen className="w-5 h-5" />
            </button>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-3 truncate">{description}</p>
      </div>
    </div>
  );
};

export default function History() {
  const { chatSessionId } = useChatContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionList, setChatSessionList] = useState<
    ChatSessionResType["data"]["items"]
  >([]);
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const loadChatSession = async () => {
    if (!hasNextPage || isLoading) return;

    setIsLoading(true);
    try {
      const result = await chatApiRequest.findAllChatSession({
        pageNumber,
        pageSize: 10,
      });
      const { hasNextPage: nextPageExists } = result.payload.data.pageMeta;

      setChatSessionList((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = result.payload.data.items.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...newItems];
      });
      setTotal(result.payload.data.pageMeta.total);

      setHasNextPage(nextPageExists);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({
        error,
      });
      setPageNumber((prev) => prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatSession();
  }, [pageNumber]);

  useEffect(() => {
    if (chatSessionId) {
      window.history.replaceState(null, "", `/chat/${chatSessionId}`);
    }
  }, [chatSessionId]);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el || !hasNextPage || isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollHeight - scrollTop - clientHeight < 100) {
        if (!isLoading) {
          setPageNumber((prev) => prev + 1);
        }
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
          {`${chatSessionList.length} / ${total}`}
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
              active={chatSessionId === item.id}
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
