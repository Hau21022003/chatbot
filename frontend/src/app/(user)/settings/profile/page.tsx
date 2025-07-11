"use client";
import { profileApiRequest } from "@/api-requests/profile";
import { EditPasswordDialog } from "@/app/(user)/settings/profile/components/edit-password-dialog";
import { useAppContext } from "@/app/app-provider";
import { Switch } from "@/components/ui/switch";
import { generateColor, getInitials } from "@/lib/avatar.utils";
import { handleErrorApi } from "@/lib/error";
import {
  EditProfileBody,
  EditProfileBodyType,
} from "@/schemas/settings-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, setUser } = useAppContext();
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [updateProfile, setUpdateProfile] = useState<EditProfileBodyType>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (user) {
      setUpdateProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const formData = new FormData();
      formData.append("image", file);
      try {
        const result = await profileApiRequest.updateAvatar(formData);
        setUser(result.payload.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({
          error,
        });
      }
    }
  };

  const removeAvatar = async () => {
    try {
      const result = await profileApiRequest.removeAvatar();
      setUser(result.payload.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };

  const handleOpenEditPassword = () => {
    setIsEditPasswordOpen(true);
  };

  const handleCloseEditPassword = () => {
    setIsEditPasswordOpen(false);
  };

  const handleUpdateProfile = async () => {
    const result = EditProfileBody.safeParse(updateProfile);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;

      toast.error("Invalid input", {
        description: firstError,
      });
      return;
    }

    try {
      const userResult = await profileApiRequest.updateProfile(updateProfile);
      setUser(userResult.payload.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };

  return (
    <div className="px-8 py-4 h-full overflow-y-auto">
      <p className="font-medium text-2xl mt-4">My Profile</p>
      <div className="mt-3 bg-gray-300 border"></div>
      <div className="mt-4 space-y-6">
        <div className="flex gap-4">
          <Avatar
            className={`${
              user?.avatar
                ? ""
                : generateColor(`${user?.firstName} ${user?.lastName}`)
            } flex items-center justify-center w-32 h-32 rounded-full overflow-hidden`}
          >
            <AvatarImage
              className="object-cover w-full h-full"
              src={user?.avatar || ""}
              alt="@shadcn"
            />
            <AvatarFallback className="text-white text-4xl">
              {getInitials(`${user?.firstName} ${user?.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <div className="flex items-stretch gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center cursor-pointer gap-2 rounded-md px-4 py-3 bg-black text-white"
              >
                <Plus className="w-5 h-5" />
                <p className="leading-none">Change Image</p>
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={uploadAvatar}
                className="hidden"
              />
              <button
                onClick={removeAvatar}
                className="flex items-center cursor-pointer gap-2 rounded-md px-4 py-3 bg-gray-100"
              >
                <p className="leading-none">Remove Image</p>
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
              value={updateProfile.firstName}
              onChange={(e) =>
                setUpdateProfile((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              onBlur={handleUpdateProfile}
              type="text"
              placeholder="First Name"
              className="mt-1 p-2 px-3 border-2 rounded-sm w-full"
            />
          </div>
          <div className="flex-1">
            <p className="">Last Name</p>
            <input
              value={updateProfile.lastName}
              onChange={(e) =>
                setUpdateProfile((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              onBlur={handleUpdateProfile}
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
              value={user?.email || ""}
              type="email"
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
              value=".........."
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
