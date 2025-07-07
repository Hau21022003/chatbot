"use client";
import { EditPasswordDialog } from "@/app/(user)/settings/profile/components/edit-password-dialog";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function ProfilePage() {
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const handleOpenEditPassword = () => {
    setIsEditPasswordOpen(true);
  };

  const handleCloseEditPassword = () => {
    setIsEditPasswordOpen(false);
  };
  
  return (
    <div className="px-8 py-4 h-full overflow-y-auto">
      <p className="font-medium text-2xl mt-4">My Profile</p>
      <div className="mt-3 bg-gray-300 border"></div>
      <div className="mt-4 space-y-6">
        <div className="flex gap-4">
          <Avatar className="flex items-center justify-center w-32 h-32 rounded-full overflow-hidden">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <div className="flex items-stretch gap-4">
              <button className="flex items-center cursor-pointer gap-2 rounded-md px-4 py-3 bg-black text-white">
                <Plus className="w-5 h-5" />
                <p className="leading-none">Change Image</p>
              </button>
              <button className="flex items-center cursor-pointer gap-2 rounded-md px-4 py-3 bg-gray-100">
                <p className="leading-none">Change Image</p>
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              We support PNGs, JPEGs and GIFs under 2MB
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="">First Name</p>
            <input
              type="text"
              placeholder="First Name"
              className="mt-1 p-2 px-3 border-2 rounded-sm w-full"
            />
          </div>
          <div className="flex-1">
            <p className="">Last Name</p>
            <input
              type="text"
              placeholder="Last Name"
              className="mt-1 p-2 px-3 border-2 rounded-sm w-full"
            />
          </div>
        </div>
      </div>
      <p className="font-medium text-2xl mt-8">Account Security</p>
      <div className="mt-3 bg-gray-300 border"></div>
      <div className="mt-4 space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="">Email</p>
            <input
              type="text"
              placeholder="Email"
              className="mt-1 p-2 px-3 border-2 rounded-sm w-full bg-gray-100 text-gray-400"
            />
          </div>
          <div className="flex-1 flex flex-col items-end justify-end">
            <button className="cursor-pointer p-3 px-4 rounded-sm bg-gray-200 leading-none">
              Change email
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="">Password</p>
            <input
              type="password"
              placeholder="Password"
              className="mt-1 p-2 px-3 border-2 rounded-sm w-full bg-gray-100 text-gray-400"
            />
          </div>
          <div className="flex-1 flex flex-col items-end justify-end">
            <button
              onClick={handleOpenEditPassword}
              className="cursor-pointer p-3 px-4 rounded-sm bg-gray-200 leading-none"
            >
              Change password
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="">2-Steps Verifications</p>
            <p className="mt-1 text-gray-400 text-sm">
              Add an additional layer of security to your account during login
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-start items-end">
            <Switch className="scale-125" />
          </div>
        </div>
      </div>
      <p className="font-medium text-2xl mt-8">Support Access</p>
      <div className="mt-3 bg-gray-300 border"></div>
      <div className="mt-4 mb-4 space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="">Log out of all devices</p>
            <p className="mt-1 text-gray-400 text-sm">
              Log out of all other active sessions on other devices besides this
              one
            </p>
          </div>
          <div className="flex-1 flex flex-col items-end justify-end">
            <button className="cursor-pointer p-3 px-4 rounded-sm bg-gray-200 leading-none">
              Log out
            </button>
          </div>
        </div>
      </div>
      <EditPasswordDialog
        isOpen={isEditPasswordOpen}
        onClose={handleCloseEditPassword}
      />
    </div>
  );
}
