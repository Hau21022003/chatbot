import z from "zod";

export const BaseRes = z
  .object({
    message: z.string(),
    status: z.string(),
    meta: z.object({
      timestamp: z.string().datetime(),
      path: z.string(),
    }),
  });

export type BaseResType = z.TypeOf<typeof BaseRes>;

export const createBaseResp = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseRes.extend({
    data: dataSchema,
  });

export const PaginationBody = z
  .object({
    pageNumber: z.number().int().min(1).default(1).optional(),
    pageSize: z.number().int().min(10).default(10).optional(),
  })
  .strict();

export type PaginationBodyType = z.TypeOf<typeof PaginationBody>;

export const createPaginationRes = <T extends z.ZodTypeAny>(itemSchema: T) =>
  BaseRes.extend({
    data: z.object({
      items: z.array(itemSchema),
      pageMeta: z.object({
        total: z.number(),
        pageNumber: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
        hasPrevPage: z.boolean(),
      }),
    }),
  });
