"use client";

import History from "@/app/(user)/chat/[chatSessionId]/components/history";
import MainChat from "@/app/(user)/chat/[chatSessionId]/components/main-chat";
import { useParams } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

export const ChatContext = createContext<{
  chatSessionId?: string;
  setChatSessionId: (id?: string) => void;
}>({
  chatSessionId: undefined,
  setChatSessionId: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export default function ChatPage() {
  const params = useParams<{ chatSessionId: string | undefined }>();
  const rawSessionId = params.chatSessionId;
  const [chatSessionId, setChatSessionId] = useState<string | undefined>(
    rawSessionId !== "null" ? rawSessionId : undefined
  );

  return (
    <ChatContext.Provider value={{ chatSessionId, setChatSessionId }}>
      <div className="bg-[#24252d] h-full py-4 pr-4">
        <div className="flex h-full overflow-hidden rounded-3xl">
          <div className="flex-1">
            <MainChat />
          </div>
          <div className="w-72 bg-white">
            <History />
          </div>
        </div>
      </div>
    </ChatContext.Provider>
  );
}
