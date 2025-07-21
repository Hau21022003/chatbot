import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateColor, getInitials } from "@/lib/avatar.utils";
import { AccountType } from "@/schemas/account.schema";
import { Bell, Search } from "lucide-react";
import React from "react";
export default function UserHeader({ user }: { user?: AccountType | null }) {
  const nameUser = `${user?.firstName || ""} ${user?.lastName || ""}`;
  const userType = user?.userType === "enterprise" ? "pro" : "free";
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
          <Avatar
            className={`${
              user?.avatar ? "" : generateColor(`${user?.avatar}`)
            } flex items-center justify-center w-10 h-10 rounded-full overflow-hidden`}
          >
            <AvatarImage
              className="object-cover w-full h-full"
              src={user?.avatar || ""}
              alt="@shadcn"
            />
            <AvatarFallback className="text-white text-lg">
              {getInitials(`${nameUser || ""}`)}
            </AvatarFallback>
          </Avatar>
          <p className="leading-none font-medium">{nameUser}</p>
          <p className="leading-none font-medium text-gray-300">{userType}</p>
        </div>
      </div>
    </div>
  );
}
