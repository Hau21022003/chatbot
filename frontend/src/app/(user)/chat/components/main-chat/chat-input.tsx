"use client";
/* eslint-disable @next/next/no-img-element */
import {
  Check,
  Globe,
  Lightbulb,
  Mic,
  Paperclip,
  Send,
  Settings2,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";

const chat_tabs = [
  {
    type: "GEN_WEB_CODE",
    label: "Web code",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    type: "DEEP_THINKING",
    label: "Deep thinking",
    icon: <Lightbulb className="w-5 h-5" />,
  },
] as const;
type ChatTab = (typeof chat_tabs)[number];

export default function ChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [openTools, setOpenTools] = useState(false);
  const [choseToolTab, setChoseToolTab] = useState<ChatTab | null>(null);

  // Hàm xử lý sự kiện khi người dùng nhập vào textarea
  // Tự động điều chỉnh chiều cao của textarea dựa trên nội dung
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`; // tối đa khoảng 5 dòng
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      setImages((prev) => [...prev, ...imageFiles]);
    }
  };

  return (
    <div className="max-w-3xl w-full p-5 border border-gray-200 rounded-3xl shadow-lg bg-white">
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
        className="w-full resize-none overflow-auto max-h-[160px] min-h-[40px] focus:outline-none leading-5"
        rows={2}
        placeholder="How can I help you today?"
      />
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload a file"
            className="rounded-lg bg-gray-100 p-3 hover:bg-gray-200 transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {/* Select chat tools */}
          <div className="relative inline-block">
            <button
              onClick={() => setOpenTools(!openTools)}
              title="Tools"
              className="rounded-lg bg-gray-100 p-3 hover:bg-gray-200 transition-colors"
            >
              <Settings2 className="w-5 h-5 text-gray-500" />
            </button>
            {openTools && (
              <div className="absolute bottom-full mb-2 left-0 w-56 bg-white rounded-lg shadow-lg border z-50">
                {chat_tabs.map((tab) => (
                  <button
                    key={tab.type}
                    onClick={() => {
                      if (tab.type != choseToolTab?.type)
                        setChoseToolTab(tab);
                      else setChoseToolTab(null);
                      setOpenTools(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`flex items-center gap-2 ${
                          choseToolTab?.type == tab.type
                            ? "text-orange-500"
                            : ""
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      {choseToolTab?.type == tab.type && (
                        <Check className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {choseToolTab && (
            <div className="min-w-40 hover:bg-blue-50 p-2.5 rounded-2xl text-blue-500 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {choseToolTab?.icon}
                <span>{choseToolTab.label}</span>
              </div>
              <X className="w-5 h-5 cursor-pointer" onClick={() => {setChoseToolTab(null)}}/>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            title="Voice input"
            className="rounded-lg bg-gray-100 p-3 hover:bg-gray-200 transition-colors"
          >
            <Mic className="w-5 h-5 text-gray-500" />
          </button>
          <button className="rounded-lg bg-orange-500 p-3 hover:bg-orange-600 transition-colors">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
