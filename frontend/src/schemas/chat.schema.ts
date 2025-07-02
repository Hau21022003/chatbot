import { createBaseResp, createPaginationRes } from "@/schemas/common.schema";
import { z } from "zod";

// Chat Session
// find chat session
const ChatSessionSchema = z.object({
  id: z.string(),
  sessionName: z.string(),
  lastActivity: z.string().datetime(),
});
export const ChatSessionRes = createPaginationRes(ChatSessionSchema);
export type ChatSessionResType = z.TypeOf<typeof ChatSessionRes>;

// create chat session
export const CreateChatSessionBody = z
  .object({ sessionName: z.string() })
  .strict();
export type CreateChatSessionBodyType = z.TypeOf<typeof CreateChatSessionBody>;

export const CreateChatSessionRes = createBaseResp(ChatSessionSchema);
export type CreateChatSessionResType = z.TypeOf<typeof CreateChatSessionRes>;

export const RenameChatSessionBody = CreateChatSessionBody;
export type RenameChatSessionBodyType = z.TypeOf<typeof RenameChatSessionBody>;
// Chat
export enum SenderType {
  USER = "user",
  BOT = "bot",
}

export enum ReactionType {
  LIKE = "like",
  DISLIKE = "dislike",
  NONE = "none",
}

const ChatItemSchema = z.object({
  id: z.string(),
  message: z.string(),
  sender: z.nativeEnum(SenderType),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  reaction: z.nativeEnum(ReactionType),
  metadata: z
    .object({
      images: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
    })
    .optional(),
});

const ChatSchema = z.array(ChatItemSchema);
export const ChatRes = createBaseResp(ChatSchema);
export type ChatResType = z.TypeOf<typeof ChatRes>;

export const CreateChatRes = ChatRes;
export type CreateChatResType = z.TypeOf<typeof CreateChatRes>;

export const ReactMessageBody = z
  .object({
    reaction: z.nativeEnum(ReactionType),
  })
  .strict();
export type ReactMessageBodyType = z.TypeOf<typeof ReactMessageBody>;
