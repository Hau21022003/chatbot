/* eslint-disable @next/next/no-img-element */
"use client";
import { showImage } from "@/components/image-viewer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isMostRecent, setIsMostRecent] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const testImages = [
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
    "https://github.com/shadcn.png",
  ];
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
          <p className="font-medium text-xl">title</p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi
            provident ipsum ad? Voluptatem tenetur, at quos nam aspernatur
            repudiandae nisi velit quam cupiditate nulla ad aut sed, laudantium
            eveniet facere.
          </p>
          <div className="border-b border-gray-200"></div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p className="text-xl font-medium">Comments</p>
              <div className="flex items-center justify-center py-[2px] px-3 rounded-lg text-sm bg-orange-500 text-white leading-none">
                12
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
            <li>
              <div className="space-y-2">
                <div className="flex gap-3 items-center">
                  <Avatar className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex items-end gap-3">
                    <p className="text-lg font-medium leading-none">Name</p>
                    <p className="leading-none text-gray-500">58 minute ago</p>
                  </div>
                </div>
                <div className="pl-13">
                  <div className="w-3/5 flex flex-wrap gap-2 mb-2">
                    {testImages.map((image, index) => (
                      <img
                        key={`${index}`}
                        src={image}
                        alt="Image"
                        onClick={() => {
                          showImage(image);
                        }}
                        className="w-30 h-30 object-cover rounded-xl border cursor-pointer"
                      />
                    ))}
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Molestiae, consequuntur soluta repellendus odit illum
                    quibusdam minima quos nam exercitationem dignissimos quasi
                    sint itaque deleniti optio debitis omnis? Voluptate, maxime
                    molestias?
                  </p>
                  <div className="flex gap-4 text-gray-600 mt-3">
                    <div className="flex items-end gap-2">
                      <ThumbsUp className="w-5 h-5" />
                      <p className="leading-none">21</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <ThumbsDown className="w-5 h-5" />
                      <p className="leading-none">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
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
                    bottom: "30px"
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                  />
                </div>
              )}
            </div>
            <button className="p-2 rounded-lg font-medium bg-orange-500 text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
