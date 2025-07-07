"use client";

import { BadgeDollarSign, BellRing, UserRoundPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      <div className="py-4 px-8 border-b border-gray-300">
        <p className="text-4xl font-bold">Settings</p>
      </div>
      <div className="flex-1 flex overflow-y-auto">
        <nav className="w-52 flex flex-col px-4 py-4 gap-2 border-r border-gray-300">
          <Link
            href={
              !pathname.includes("settings/profile") ? "/settings/profile" : "#"
            }
            className={`flex items-center gap-2 p-2 rounded-sm ${
              pathname.includes("settings/profile")
                ? "text-black bg-gray-100"
                : "text-gray-400 border-white cursor-pointer hover:bg-gray-50"
            }`}
          >
            <UserRoundPen className="w-5 h-5" />
            <p className="leading-none">Profile</p>
          </Link>
          <Link
            href={
              !pathname.includes("settings/notification") ? "/settings/notification" : "#"
            }
            className={`flex items-center gap-2 p-2 rounded-sm ${
              pathname.includes("settings/notification")
                ? "text-black bg-gray-100"
                : "text-gray-400 border-white cursor-pointer hover:bg-gray-50"
            }`}
          >
            <BellRing className="w-5 h-5" />
            <p className="leading-none">Notification</p>
          </Link>
          <Link
            href={
              !pathname.includes("settings/pricing") ? "/settings/pricing" : "#"
            }
            className={`flex items-center gap-2 p-2 rounded-sm ${
              pathname.includes("settings/pricing")
                ? "text-black bg-gray-100"
                : "text-gray-400 border-white cursor-pointer hover:bg-gray-50"
            }`}
          >
            <BadgeDollarSign className="w-5 h-5" />
            <p className="leading-none">Pricing</p>
          </Link>
        </nav>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
