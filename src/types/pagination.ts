/**
 * Generic pagination types for list responses.
 */

/**
 * Pagination metadata structure.
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Paginated response structure.
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

/**
 * Query parameters for paginated requests.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

/**
 * Default pagination values.
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/**
 * Parses and validates pagination query parameters.
 *
 * @param query - Raw query parameters from request
 * @returns Normalized pagination parameters
 *
 * @example
 * ```typescript
 * const { page, limit, offset, sortBy, order } = parsePaginationQuery(req.query);
 * ```
 */
export function parsePaginationQuery(query: Partial<PaginationQuery>): {
  page: number;
  limit: number;
  offset: number;
  sortBy: string | undefined;
  order: "asc" | "desc";
} {
  const page = Math.max(DEFAULT_PAGE, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const offset = (page - 1) * limit;
  const sortBy = query.sortBy;
  const order = query.order === "desc" ? "desc" : "asc";

  return { page, limit, offset, sortBy, order };
}

/**
 * Creates pagination metadata from query results.
 *
 * @param totalItems - Total number of items in the dataset
 * @param currentPage - Current page number
 * @param itemsPerPage - Number of items per page
 * @returns Pagination metadata object
 *
 * @example
 * ```typescript
 * const pagination = createPaginationMeta(97, 1, 20);
 * // { currentPage: 1, totalPages: 5, totalItems: 97, itemsPerPage: 20 }
 * ```
 */
export function createPaginationMeta(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationMeta {
  return {
    currentPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    totalItems,
    itemsPerPage,
  };
}

/**
 * Creates a complete paginated response.
 *
 * @param data - Array of items for the current page
 * @param totalItems - Total number of items in the dataset
 * @param currentPage - Current page number
 * @param itemsPerPage - Number of items per page
 * @param message - Optional success message
 * @returns Complete paginated response object
 *
 * @example
 * ```typescript
 * res.json(createPaginatedResponse(users, 97, 1, 20, "Users retrieved"));
 * ```
 */
export function createPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
  message?: string
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: createPaginationMeta(totalItems, currentPage, itemsPerPage),
    ...(message !== undefined && { message }),
  };
}
