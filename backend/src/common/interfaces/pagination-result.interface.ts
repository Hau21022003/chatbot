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
  meta: PaginationMeta;
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
