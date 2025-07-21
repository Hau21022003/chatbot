import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateColor, getInitials } from "@/lib/avatar.utils";
import { timeAgo } from "@/lib/utils";
import { QuestionResType } from "@/schemas/help-center.shema";
import { Eye, MessageCircle } from "lucide-react";
import React from "react";

export default function QuestionItem({
  question,
  isMyPost,
  handleOpenEditDialog,
}: {
  question: QuestionResType["data"];
  isMyPost: boolean;
  handleOpenEditDialog: (question: QuestionResType["data"]) => void;
}) {
  return (
    <div className="rounded-xl bg-white py-4 px-6">
      <div className="flex justify-between gap-2">
        <p className="max-w-[500px] text-xl font-medium truncate">
          {question.title}
        </p>
        <div className="shrink-0 flex gap-4 text-gray-400">
          <p className="font-medium">{timeAgo(question.createdAt)}</p>
        </div>
      </div>
      {/* <div className="mt-3 text-gray-500">{question.content}</div> */}
      <div className="mt-3 text-gray-500">
        <div
          className="prose prose-sm max-w-none
                         [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2
                         [&_strong]:font-bold [&_em]:italic
                         [&_p]:my-2"
          dangerouslySetInnerHTML={{
            __html: question.content.replace(/<img[^>]*>/g, ""),
          }}
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            className={`${
              question.author?.avatar
                ? ""
                : generateColor(
                    `${question.author?.firstName} ${question.author?.lastName}`
                  )
            } flex items-center justify-center w-10 h-10 rounded-full overflow-hidden`}
          >
            <AvatarImage
              className="object-cover w-full h-full"
              src={question.author?.avatar || ""}
              alt="@shadcn"
            />
            <AvatarFallback className="text-white text-lg">
              {getInitials(
                `${question.author?.firstName} ${question.author?.lastName}`
              )}
            </AvatarFallback>
          </Avatar>

          <p>{`${question.author?.firstName} ${question.author?.lastName}`}</p>
          {isMyPost && (
            <p
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEditDialog(question);
              }}
              className="bg-gray-200 rounded-lg p-1 px-2"
            >
              Edit
            </p>
          )}
          {isMyPost && (
            <div className="py-1 px-2 bg-green-100 rounded-lg text-green-800">
              My post
            </div>
          )}
          {question.pinned && (
            <div className="py-1 px-2 bg-blue-100 rounded-lg text-blue-800">
              Pinned
            </div>
          )}
        </div>
        {/* Comment Views */}
        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1">
            <Eye />
            <p className="leading-none">{question.commentCount}</p>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle />
            <p className="leading-none">{question.commentCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
