import { AccountSchema } from "@/schemas/account.schema";
import { createBaseResp, createPaginationRes } from "@/schemas/common.schema";
import { z } from "zod";

const CommentSchema = z.object({
  id: z.number(),
  content: z.string(),
  images: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
  author: AccountSchema.optional(),
  questionId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  likeCount: z.number(),
  dislikeCount: z.number(),
  isLikedByCurrentUser: z.boolean(),
  isDislikedByCurrentUser: z.boolean(),
});
export const CommentRes = createBaseResp(CommentSchema);
export type CommentResType = z.infer<typeof CommentRes>;

const QuestionSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  authorId: z.string().uuid(),
  author: AccountSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  comments: z.array(CommentSchema).optional(),
  commentCount: z.number(),
  pinned: z.boolean(),
});
export const QuestionRes = createBaseResp(QuestionSchema);
export type QuestionResType = z.infer<typeof QuestionRes>;

export const CreateQuestionBody = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});
export type CreateQuestionBodyType = z.infer<typeof CreateQuestionBody>;

export const UpdateQuestionBody = CreateQuestionBody
export type UpdateQuestionBodyType = z.infer<typeof UpdateQuestionBody>;

export const CreateQuestionRes = createBaseResp(QuestionSchema);
export type CreateQuestionResType = z.infer<typeof CreateQuestionRes>;

export const findAllQuestionsBody = z.object({
  pageNumber: z.number().int().min(1).default(1).optional(),
  pageSize: z.number().int().min(10).default(10).optional(),
  searchQuery: z.string().optional(),
  // isMostRecent: z.boolean().default(true).optional(),
  sortBy: z
    .enum(["most recent", "most useful"])
    .default("most recent")
    .optional(),
  type: z
    .enum(["all", "my post", "pinned", "others"])
    .default("all")
    .optional(),
});
export type FindAllQuestionsBodyType = z.infer<typeof findAllQuestionsBody>;

export const FindAllQuestionsRes = createPaginationRes(QuestionSchema);
export type FindAllQuestionsResType = z.infer<typeof FindAllQuestionsRes>;

export const UploadImageRes = createBaseResp(
  z.object({ imageUrl: z.string().url() })
);
export type UploadImageResType = z.infer<typeof UploadImageRes>;

export const ReactCommentBody = z.object({
  type: z.enum(["like", "dislike", "none"]),
});
export type ReactCommentBodyType = z.infer<typeof ReactCommentBody>;

export const CreateCommentRes = CommentRes;
export type CreateCommentResType = z.infer<typeof CreateCommentRes>;
