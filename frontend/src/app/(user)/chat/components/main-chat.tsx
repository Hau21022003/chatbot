/* eslint-disable @next/next/no-img-element */
"use client";

import ChatInput from "@/app/(user)/chat/components/main-chat/chat-input";
import ChatMessage from "@/app/(user)/chat/components/main-chat/chat-message";
import ResponseMessage from "@/app/(user)/chat/components/main-chat/response-message";
import { Search } from "lucide-react";
import React from "react";

const test_message =
  "Đây là code:\n\n```tsx\nconst GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {\n\treturn (\n\t\t<div>\n\t\t\t<h2>{item.name}</h2>\n\t\t\t<p>Price: {item.price}</p>\n\t\t\t<p>Quantity: {item.quantity}</p>\n\t\t</div>\n\t);\n}";
export default function MainChat() {
  return (
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
              className="bg-transparent outline-none text-gray-500 placeholder-gray-400 w-full"
            />
          </div>
        </div>
      </div>

      <div style={{scrollbarGutter: 'stable both-edges'}} className="flex-1 overflow-y-auto px-4 space-y-4 flex justify-center ">
        <div className="max-w-3xl w-full">
          <ChatMessage
            content="Thêm"
            images={[
              "https://images.pexels.com/photos/36762/scarlet-honeyeater-bird-red-feathers.jpg",
            ]}
          />
          {/* <ResponseMessage message={test_message} /> */}
        </div>
      </div>

      <div className="p-4 pt-0 flex justify-center">
        <ChatInput />
      </div>
      
    </div>
  );
}
