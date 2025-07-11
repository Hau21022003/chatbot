"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Bold, Italic, ImageIcon, Smile } from "lucide-react";

// Emoji picker component đơn giản
const EmojiPicker = ({ onEmojiSelect }) => {
  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "🤔"];

  return (
    <div className="flex gap-1 p-2 border rounded-lg bg-white shadow-lg">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emoji)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

const RichTextEditor = () => {
  const [content, setContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      if (imageFile.size > 2 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        editor.chain().focus().setImage({ src: base64 }).run();
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
    content: "<p>Bắt đầu nhập nội dung...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const addImageBase64 = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Kiểm tra kích thước file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert("Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 2MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const addEmoji = (emoji) => {
    editor.chain().focus().insertContent(emoji).run();
    setShowEmojiPicker(false);
  };

  const handleSave = async () => {
    // Lưu content với ảnh được nhúng bên trong
    const htmlContent = editor.getHTML();
    const jsonContent = editor.getJSON();

    console.log("HTML Content (có ảnh nhúng):", htmlContent);
    console.log("JSON Content:", jsonContent);

    // Ví dụ HTML sẽ có dạng:
    // <p>Đây là text <strong>in đậm</strong></p>
    // <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." alt="">
    // <p>Text tiếp theo 😊</p>

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: htmlContent, // Toàn bộ content bao gồm cả ảnh
          // Hoặc có thể lưu cả 2:
          htmlContent: htmlContent,
          jsonContent: JSON.stringify(jsonContent),
        }),
      });

      if (response.ok) {
        alert("Lưu thành công!");
        // Reset editor
        editor.commands.setContent("<p>Bắt đầu nhập nội dung...</p>");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6">Rich Text Editor</h2>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-blue-200" : ""
          }`}
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-blue-200" : ""
          }`}
        >
          <Italic size={16} />
        </button>

        <button
          onClick={addImageBase64}
          className="p-2 rounded hover:bg-gray-200"
        >
          <ImageIcon size={16} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded hover:bg-gray-200"
          >
            <Smile size={16} />
          </button>

          {showEmojiPicker && (
            <div className="absolute top-full left-0 z-10 mt-1">
              <EmojiPicker onEmojiSelect={addEmoji} />
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        className={`border border-gray-200 rounded-b-lg relative ${
          isDragging ? "border-blue-400 bg-blue-50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-75 flex items-center justify-center z-10 rounded-b-lg">
            <div className="text-blue-600 font-medium">Thả ảnh vào đây</div>
          </div>
        )}

        <EditorContent
          editor={editor}
          className="min-h-[300px] p-4 prose prose-sm max-w-none
                     focus:outline-none
                     [&_.ProseMirror]:focus:outline-none
                     [&_.ProseMirror]:border-none
                     [&_.ProseMirror]:outline-none
                     [&_p]:my-2
                     [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded
                     [&_strong]:font-bold
                     [&_em]:italic"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors font-medium"
        >
          Lưu bài viết
        </button>
      </div>

      {/* Demo hiển thị content đã lưu */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Preview nội dung đã lưu:</h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div
            className="prose prose-sm max-w-none
                       [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2
                       [&_strong]:font-bold [&_em]:italic
                       [&_p]:my-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      {/* Preview HTML */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">HTML Content (sẽ lưu vào DB):</h3>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default RichTextEditor;
