import { createBaseResp } from "@/schemas/common.schema";
import z from "zod";

export const AccountSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
  email: z.string(),
  role: z.enum(["admin", "user"]),
  userType: z.enum(["free", "enterprise"]),
});
export const AccountRes = createBaseResp(AccountSchema);
export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
