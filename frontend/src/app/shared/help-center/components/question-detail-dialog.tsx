/* eslint-disable @next/next/no-img-element */
"use client";
import { helpCenterApiRequest } from "@/api-requests/help-center";
import { showImage } from "@/components/image-viewer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { generateColor, getInitials } from "@/lib/avatar.utils";
import { handleErrorApi } from "@/lib/error";
import { timeAgo } from "@/lib/utils";
import { QuestionResType } from "@/schemas/help-center.shema";
import EmojiPicker from "emoji-picker-react";
import {
  ArrowDownUp,
  ArrowUpDown,
  ImagePlus,
  Send,
  Smile,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function QuestionDetailDialog({
  isOpen,
  onClose,
  questionId,
}: {
  isOpen: boolean;
  onClose: () => void;
  questionId?: number;
}) {
  const [isMostRecent, setIsMostRecent] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);

  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [questionDetail, setQuestionDetail] =
    useState<QuestionResType["data"]>();

  const loadQuestionDetail = async () => {
    console.log("questionId", questionId);
    if (!questionId) return;
    try {
      const result = await helpCenterApiRequest.findOneQuestion(questionId);
      setQuestionDetail(result.payload.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi(error);
    }
  };

  useEffect(() => {
    loadQuestionDetail();
  }, [questionId]);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      const imagesLength = imageFiles.length + images.length;
      if (imagesLength > 3) {
        toast.error("Lỗi", {
          duration: 3000,
          description: "You can only select up to 3 images",
        });
      } else {
        setImages((prev) => [...prev, ...imageFiles]);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const reactComment = async (
    commentId: number,
    type: "like" | "dislike" | "none"
  ) => {
    try {
      const result = await helpCenterApiRequest.reactComment(commentId, {
        type: type,
      });
      const newComment = result.payload.data;
      setQuestionDetail((prev) => {
        return prev
          ? {
              ...prev,
              comments: prev.comments?.map((comment) =>
                comment.id === commentId ? newComment : comment
              ),
            }
          : undefined;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const createComment = async () => {
    if (!message.trim()) {
      toast.error("Error", {
        description: "Message cannot be empty",
        duration: 3000,
      });
      return;
    }
    const formData = new FormData();
    formData.append("content", message);
    formData.append("questionId", questionDetail?.id.toString() || "");
    images.forEach((img) => {
      formData.append("images", img);
    });
    try {
      const result = await helpCenterApiRequest.createComment(formData);
      setQuestionDetail((prev) => {
        return prev
          ? {
              ...prev,
              comments: [result.payload.data, ...(prev.comments || [])],
            }
          : undefined;
      });
      setMessage("");
      setImages([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <div
          className="flex-1 overflow-y-auto space-y-4 px-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <p className="font-medium text-xl">{questionDetail?.title}</p>
          {/* <p>{questionDetail?.content}</p> */}
          <div
            className="prose prose-sm max-w-none
                         [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2
                         [&_strong]:font-bold [&_em]:italic
                         [&_p]:my-2"
            dangerouslySetInnerHTML={{ __html: questionDetail?.content || "" }}
          />
          <div className="border-b border-gray-200"></div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p className="text-xl font-medium">Comments</p>
              <div className="flex items-center justify-center py-[2px] px-3 rounded-lg text-sm bg-orange-500 text-white leading-none">
                {questionDetail?.comments?.length || 0}
              </div>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsMostRecent(!isMostRecent);
              }}
            >
              <p>Most recent</p>
              {isMostRecent ? (
                <ArrowUpDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ArrowDownUp className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
          <ul className="mt-6 space-y-6">
            {questionDetail?.comments?.map((comment, index) => (
              <li key={`comment_${index}`}>
                <div className="space-y-2">
                  <div className="flex gap-3 items-center">
                    <Avatar
                      className={`${
                        comment.author?.avatar
                          ? ""
                          : generateColor(
                              `${comment.author?.firstName} ${comment.author?.lastName}`
                            )
                      } flex items-center justify-center w-10 h-10 rounded-full overflow-hidden`}
                    >
                      <AvatarImage
                        className="object-cover w-full h-full"
                        src={comment.author?.avatar || ""}
                        alt="@shadcn"
                      />
                      <AvatarFallback className="text-white text-lg">
                        {getInitials(
                          `${comment.author?.firstName} ${comment.author?.lastName}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-medium leading-none">{`${comment.author?.firstName} ${comment.author?.lastName}`}</p>
                      <p className="leading-none text-gray-500">
                        {timeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="pl-13">
                    <div className="w-3/5 flex flex-wrap gap-2 mb-2">
                      {comment.images?.map((image, index) => (
                        <img
                          key={`image_${index}`}
                          src={image}
                          alt="Image"
                          onClick={() => {
                            showImage(image);
                          }}
                          className="w-30 h-30 object-cover rounded-xl border cursor-pointer"
                        />
                      ))}
                    </div>
                    <p>{comment.content}</p>
                    <div className="flex gap-4 text-gray-600 mt-3">
                      <div
                        className={`flex items-end gap-2 ${
                          comment.isLikedByCurrentUser ? "text-orange-500" : ""
                        }`}
                      >
                        <ThumbsUp
                          onClick={() => {
                            reactComment(
                              comment.id,
                              comment.isLikedByCurrentUser ? "none" : "like"
                            );
                          }}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <p className="leading-none">{comment.likeCount}</p>
                      </div>
                      <div
                        className={`flex items-end gap-2 ${
                          comment.isDislikedByCurrentUser
                            ? "text-orange-500"
                            : ""
                        }`}
                      >
                        <ThumbsDown
                          onClick={() => {
                            reactComment(
                              comment.id,
                              comment.isDislikedByCurrentUser
                                ? "none"
                                : "dislike"
                            );
                          }}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <p className="leading-none">{comment.dislikeCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 bg-gray-100 rounded-2xl p-4 mx-2">
          {images.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    className="w-20 h-20 object-cover rounded-xl border"
                  />
                  <button
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="cursor-pointer absolute top-1 right-1 bg-black/60 hover:bg-black/70 text-white p-1 rounded-full hover:bg-opacity-80"
                    title="Remove"
                  >
                    <X className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
              ))}{" "}
            </div>
          )}
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none overflow-auto max-h-[100px] min-h-[30px] focus:outline-none leading-5"
            rows={1}
            placeholder="How can I help you today?"
          />
          <div className="flex items-end justify-between relative">
            <div className="flex items-end gap-4 text-gray-400">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
                title="Upload image"
              >
                <ImagePlus className="w-6 h-6" />
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                className="cursor-pointer"
                title="Emoji"
                onClick={() => setShowPicker((prev) => !prev)}
              >
                <Smile className="w-6 h-6" />
              </button>
              {showPicker && (
                <div
                  ref={emojiPickerRef}
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                    bottom: "30px",
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                  />
                </div>
              )}
            </div>
            <button
              onClick={createComment}
              className="cursor-pointer p-2 rounded-lg font-medium bg-orange-500 text-white"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
