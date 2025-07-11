"use client";
import CreateQuestionDialog from "@/app/(user)/help/components/create-question-dialog";
import QuestionDetailDialog from "@/app/(user)/help/components/question-detail-dialog";
import QuestionItem from "@/app/(user)/help/components/question-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsRight, Funnel, Pen, Search } from "lucide-react";
import React, { useState } from "react";

export default function HelpPage() {
  const [isQuestionDetailOpen, setIsQuestionDetailOpen] = useState(false);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  // Thêm ID question
  const handleOpenQuestionDetail = () => {
    setIsQuestionDetailOpen(true);
  };

  const handleCloseQuestionDetail = () => {
    setIsQuestionDetailOpen(false);
  };

  const handleOpenCreateQuestion = () => {
    setIsCreateQuestionOpen(true);
  };

  const handleCloseCreateQuestion = () => {
    setIsCreateQuestionOpen(false);
  };
  return (
    <div className="bg-gray-100 h-full overflow-y-auto p-8 px-12 flex gap-20">
      <div className="w-96 flex flex-col">
        <p className="text-3xl font-medium">Search for a question</p>
        <p className="text-gray-400 mt-2">
          Type your question or search keyword
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 bg-white rounded-lg px-4 py-2 w-full">
          <input
            type="text"
            placeholder="Start typing..."
            className="bg-transparent outline-none text-black placeholder-gray-500"
          />
          <Search className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
        </div>
        <button className="text-orange-500 flex items-center justify-between gap-2 w-full p-2 px-4 rounded-md bg-orange-50 mt-20">
          <p className="font-semibold">Getting started</p>
          <ChevronsRight className="w-5 h-5" />
        </button>
        <ul
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="mt-4 flex-1 space-y-1 text-gray-500 overflow-y-auto"
        >
          <li className="font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200">
            Account with card
          </li>
          <li className="font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200">
            Account with card
          </li>
        </ul>

        <div className="p-4 rounded-md bg-orange-400 text-white space-y-2">
          <p className="font-medium text-lg">Do you still need our help?</p>
          <p>Send your request via email</p>
          <a
            href={"#"}
            className="inline-block py-3 px-8 bg-white text-black font-medium rounded-md"
          >
            Contact Us
          </a>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-stretch justify-between">
          <button
            onClick={handleOpenCreateQuestion}
            className="p-1 pr-3 flex items-center gap-2 cursor-pointer text-orange-500 bg-white rounded-sm"
          >
            <div className="p-2 rounded-sm bg-orange-50">
              <Pen className="w-4 h-4" />
            </div>
            <p className="leading-none font-medium">NEW QUESTION</p>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer p-2 px-4 flex items-center gap-2 text-gray-400 bg-white rounded-sm">
                <Funnel className="w-4 h-4" />
                <p className="leading-none">SORT BY:</p>
                <p className="text-orange-500 leading-none font-semibold">
                  ABC
                </p>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Name
                  <DropdownMenuShortcut>
                    <Check />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>Rate</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ul className="space-y-4 mt-6">
          <li
            className="cursor-pointer"
            onClick={() => {
              handleOpenQuestionDetail();
            }}
          >
            <QuestionItem />
          </li>
          <li>
            <QuestionItem />
          </li>
        </ul>
      </div>
      <QuestionDetailDialog
        isOpen={isQuestionDetailOpen}
        onClose={handleCloseQuestionDetail}
      />
      <CreateQuestionDialog
        isOpen={isCreateQuestionOpen}
        onClose={handleCloseCreateQuestion}
      />
    </div>
  );
}
