import { AccountSchema } from "@/schemas/account.schema";
import {
  createPaginationBody,
  createPaginationRes,
} from "@/schemas/common.schema";
import { z } from "zod";

export const FindAllUserSchema = z.object({
  userStatus: z.enum(["all", "active", "inactive"]).optional(),
  userType: z.enum(["enterprise", "free"]).optional(),
  searchQuery: z.string().optional(),
});

export const FindAllUserBody = createPaginationBody(FindAllUserSchema);
export type FindAllUserBodyType = z.TypeOf<typeof FindAllUserBody>;

export const FindAllUserRes = createPaginationRes(AccountSchema);
export type FindAllUserResType = z.TypeOf<typeof FindAllUserRes>;
