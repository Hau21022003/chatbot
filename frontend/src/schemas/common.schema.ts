import z from "zod";

export const BaseRes = z.object({
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
export const createPaginationBody = <T extends z.ZodRawShape>(
  itemSchema: z.ZodObject<T>
) => PaginationBody.merge(itemSchema);

export const PageMetaRes = z.object({
  total: z.number().default(0),
  pageNumber: z.number().default(1),
  pageSize: z.number().default(10),
  totalPages: z.number().default(0),
  hasNextPage: z.boolean().default(false),
  hasPrevPage: z.boolean().default(false),
});
export type PageMetaResType = z.TypeOf<typeof PageMetaRes>;

export const createPaginationRes = <T extends z.ZodTypeAny>(itemSchema: T) =>
  BaseRes.extend({
    data: z.object({
      items: z.array(itemSchema),
      pageMeta: PageMetaRes,
    }),
  });

export const defaultPageMeta: PageMetaResType = PageMetaRes.parse({});

// export const defaultPageMeta = {
//   total: 0,
//   pageNumber: 1,
//   pageSize: 10,
//   totalPages: 0,
//   hasNextPage: false,
//   hasPrevPage: false,
// };
