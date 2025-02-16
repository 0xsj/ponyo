export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: number;
}

export interface QueryFilters {
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    nextCursor: string;
    hasMore: boolean;
  };
}
