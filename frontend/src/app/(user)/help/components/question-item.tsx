import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageCircle } from "lucide-react";
import React from "react";

export default function QuestionItem() {
  return (
    <div className="rounded-xl bg-white py-4 px-6">
      <div className="flex justify-between gap-2">
        <p className="max-w-[500px] text-xl font-medium truncate">itle Title Title </p>
        <p className="font-medium text-gray-400 shrink-0">11h50 AM</p>
      </div>
      <p className="mt-3 text-gray-500">Desc</p>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>Name</p>
        </div>
        {/* Comment Views */}
        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1">
            <Eye />
            <p className="leading-none">1</p>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle />
            <p className="leading-none">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
