"use client";

import chatApiRequest from "@/api-requests/chat";
import ChatInput from "@/app/(user)/chat/[chatSessionId]/components/main-chat/chat-input";
import ChatMessage from "@/app/(user)/chat/[chatSessionId]/components/main-chat/chat-message";
import ResponseMessage from "@/app/(user)/chat/[chatSessionId]/components/main-chat/response-message";
import { useChatContext } from "@/app/(user)/chat/[chatSessionId]/page";
import { handleErrorApi } from "@/lib/error";
import { ChatResType, SenderType } from "@/schemas/chat.schema";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const MainChatContext = createContext<{
  chatList: ChatResType["data"];
  setChatList: React.Dispatch<React.SetStateAction<ChatResType["data"]>>;
  isSending: boolean;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  chatList: [],
  setChatList: () => {},
  isSending: false,
  setIsSending: () => {},
});

export const useMainChatContext = () => useContext(MainChatContext);

export default function MainChat() {
  const { chatSessionId } = useChatContext();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [chatList, setChatList] = useState<ChatResType["data"]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const messageId = searchParams.get("messageId");
  const hasScrolledToMessage = useRef(false);

  const loadChats = async () => {
    try {
      if (chatSessionId) {
        const result = await chatApiRequest.findChats(chatSessionId);
        setChatList(result.payload.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorApi(err);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (!hasScrolledToMessage.current && messageId && chatList.length > 0) {
      const el = messageRefs.current[messageId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        hasScrolledToMessage.current = true;
      }
    }
  }, [chatList, messageId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isSending]);

  useEffect(() => {
    if (chatList.length > 0 && !messageId) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [chatList]);

  return (
    <MainChatContext.Provider
      value={{ chatList, setChatList, isSending, setIsSending }}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b-2 border-gray-200">
          <span className="font-medium text-xl tracking-wide">AI Chat</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-64">
              <Search className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-black placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        <div
          style={{ scrollbarGutter: "stable both-edges" }}
          className="flex-1 overflow-y-auto px-4 space-y-4 flex justify-center "
        >
          <div className="max-w-3xl w-full">
            {chatList?.map((chat) => {
              return (
                <div
                  key={chat.id}
                  ref={(el) => {
                    if (el) messageRefs.current[chat.id] = el;
                  }}
                >
                  {chat.sender === SenderType.USER ? (
                    <ChatMessage
                      content={chat.message}
                      images={chat.metadata?.images}
                    />
                  ) : (
                    <ResponseMessage
                      message={chat.message}
                      id={chat.id}
                      reaction={chat.reaction}
                    />
                  )}
                </div>
              );
            })}
            {isSending && (
              <div className="px-4 py-4 inline-flex items-center space-x-1 bg-gray-50 rounded-lg">
                <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0s]"></div>
                <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
            <div ref={bottomRef} className="py-2" />
          </div>
        </div>

        <div className="p-4 pt-0 flex justify-center">
          <ChatInput />
        </div>
      </div>
    </MainChatContext.Provider>
  );
}
