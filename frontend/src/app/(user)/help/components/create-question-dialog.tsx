"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Bold, ImageIcon, Italic, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";

export default function CreateQuestionDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [titleValue, setTitleValue] = useState("");
  const dragCounter = useRef(0);
  const [content, setContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;

    if (dragCounter.current <= 0) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      if (imageFile.size > 2 * 1024 * 1024) {
        toast.error("Lỗi", {
          duration: 3000,
          description: "Image size exceeds 2MB. Please select a smaller image.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          editor?.chain().focus().setImage({ src: base64 }).run();
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    // content: "<p>Bắt đầu nhập nội dung...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      const file = imageFiles[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Lỗi", {
          duration: 3000,
          description: "Image size exceeds 2MB. Please select a smaller image.",
        });
        return;
      }
      // const reader = new FileReader();
      // reader.onload = () => {
      //   const base64 = reader.result as string;
      //   editor?.chain().focus().setImage({ src: base64 }).run();
      // };
      // reader.readAsDataURL(file);
      
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[700px] h-[80vh] flex flex-col overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <p className="font-medium text-xl">Create new question</p>
        <div>
          <p className="font-medium">Add a title</p>
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Type something..."
            className="border p-2 rounded-md mr-2 mt-2 w-full"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <p className="font-medium">Add a description</p>
          <div className="mt-2 flex items-center gap-2 p-1 border border-gray-300 rounded-t-lg bg-gray-50 text-gray-600">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive("bold") ? "bg-blue-200" : ""
              }`}
            >
              <Bold size={16} />
            </button>

            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive("italic") ? "bg-blue-200" : ""
              }`}
            >
              <Italic size={16} />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded hover:bg-gray-200"
            >
              <ImageIcon size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded hover:bg-gray-200"
              >
                <Smile size={16} />
              </button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute top-[-140px] left-10 z-10 mt-1"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex-1 border border-gray-300 rounded-b-lg relative overflow-y-auto ${
              isDragging ? "border-blue-400 bg-blue-50" : ""
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-75 flex items-center justify-center z-10 rounded-b-lg">
                <div className="text-blue-600 font-medium">Thả ảnh vào đây</div>
              </div>
            )}

            {editor?.isEmpty && (
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                Type something...
              </div>
            )}

            <EditorContent
              editor={editor}
              onClick={() => editor?.commands.focus()}
              className="h-full max-h-full px-4 py-2 prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:outline-none
                     [&_p]:my-2
                     [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded
                     [&_strong]:font-bold
                     [&_em]:italic"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium leading-none"
          >
            <span className="text-gray-500">Cancel</span>
            <span className="sr-only">Cancel</span>
          </button>
          <button
            // onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium leading-none"
          >
            Submit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
