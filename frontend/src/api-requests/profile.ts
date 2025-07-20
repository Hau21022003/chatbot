import http from "@/lib/http";
import { AccountResType } from "@/schemas/account.schema";
import { BaseResType } from "@/schemas/common.schema";
import {
  EditPasswordBodyType,
  EditProfileBodyType,
  EditProfileResType,
  RemoveAvatarResType,
  UpdateAvatarResType,
} from "@/schemas/settings-profile";

export const profileApiRequest = {
  getProfile: () => http.get<AccountResType>("/users/profile"),
  updateProfile: (body: EditProfileBodyType) =>
    http.put<EditProfileResType>("/users/update-profile", body),
  updatePassword: (body: EditPasswordBodyType) =>
    http.put<BaseResType>("/users/update-password", body),
  updateAvatar: (formData: FormData) =>
    http.put<UpdateAvatarResType>("/users/update-avatar", formData),
  removeAvatar: () => http.get<RemoveAvatarResType>("/users/remove-avatar"),
};
