import { Bell, Search } from "lucide-react";
import React from "react";

export default function UserHeader({ nameUser }: { nameUser?: string }) {
  const generateColor = (text?: string) => {
    if (!text) return "bg-gray-500";

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-fuchsia-500",
      "bg-rose-500",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  // Hàm lấy initials từ văn bản
  const getInitials = (text?: string) => {
    if (!text) return "";

    const words = text.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-4 w-96">
        <Search className="w-6 h-6 text-black" strokeWidth={2.5} />
        <input
          type="text"
          placeholder="Search anything here"
          className="flex-1 bg-transparent outline-none text-black placeholder-gray-600"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          title="Notification"
          className="cursor-pointer hover:text-gray-600"
        >
          <Bell className="w-6 h-6" />
        </button>
        <div className="h-9 border-r-2 border-gray-200"></div>
        <div className="flex items-center gap-2">
          <div
            className={`cursor-pointer text-white font-bold w-9 h-9 rounded-full flex items-center justify-center ${generateColor(
              nameUser
            )}`}
          >
            <div className="leading-none">
              {getInitials(nameUser)}
            </div>
          </div>
          <p className="leading-none font-medium">{nameUser}</p>
        </div>
      </div>
    </div>
  );
}
