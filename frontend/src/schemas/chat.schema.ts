import { createPaginationRes } from "@/schemas/common.schema";
import { z } from "zod";

const ChatSessionSchema = z.object({
  id: z.string(),
  sessionName: z.string(),
  lastActivity: z.string().datetime(),
});
export const ChatSessionRes = createPaginationRes(ChatSessionSchema);
export type ChatSessionResType = z.TypeOf<typeof ChatSessionRes>;
