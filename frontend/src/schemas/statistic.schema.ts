import {
  createBaseResp,
  createPaginationBody,
  createPaginationRes,
} from "@/schemas/common.schema";
import { z } from "zod";

export const StatisticBody = z
  .object({
    dateRange: z.union([z.literal(7), z.literal(30)]),
  })
  .strict();
export type StatisticBodyType = z.TypeOf<typeof StatisticBody>;

export const StatisticSchema = z.object({
  dailyPoints: z.number(),
  remainingPoints: z.number(),
  userUsages: z.array(
    z.object({
      id: z.number(),
      date: z.string().pipe(z.coerce.date()),
      totalPointsUsed: z.number(),
      messageCount: z.number(),
    })
  ),
});
export const StatisticRes = createBaseResp(StatisticSchema);
export type StatisticResType = z.TypeOf<typeof StatisticRes>;

export const FindAllChatBody = createPaginationBody(
  z.object({ search: z.string().optional() })
);
export type FindAllChatBodyType = z.TypeOf<typeof FindAllChatBody>;

export const FindAllChatSchema = z.object({
  input: z.string(),
  output: z.string(),
  createdAt: z.string().pipe(z.coerce.date()),
  ids: z.array(z.string()),
  sessionName: z.string(),
  sessionId: z.string(),
});
export const FindAllChatRes = createPaginationRes(FindAllChatSchema);
export type FindAllChatResType = z.TypeOf<typeof FindAllChatRes>;
