export interface PaginationMeta {
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResult<T> {
  items: T[];
  pageMeta: PaginationMeta;
}

export function createPaginationResult<T>(
  items: T[],
  meta: { total: number; pageNumber: number; pageSize: number },
): PaginationResult<T> {
  return {
    items,
    pageMeta: createPaginationMeta(meta.total, meta.pageNumber, meta.pageSize),
  };
}

export function createPaginationMeta(
  total: number,
  pageNumber: number,
  pageSize: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);

  return {
    total,
    pageNumber,
    pageSize,
    totalPages,
    hasNextPage: pageNumber < totalPages,
    hasPrevPage: pageNumber > 1,
  };
}
