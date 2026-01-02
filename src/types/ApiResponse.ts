/**
 * Standard API response types for consistent response formatting.
 */

/**
 * Success response structure.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Error detail structure.
 */
export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Error response structure.
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

/**
 * Union type for all API responses.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Creates a standardized success response.
 *
 * @param data - The response payload
 * @param message - Optional success message
 * @returns Formatted success response object
 *
 * @example
 * ```typescript
 * res.json(createResponse({ id: "123", name: "John" }, "User created"));
 * // { success: true, data: { id: "123", name: "John" }, message: "User created" }
 * ```
 */
export function createResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message !== undefined && { message }),
  };
}

/**
 * Creates a standardized error response.
 *
 * @param code - Error code (e.g., "VALIDATION_ERROR", "NOT_FOUND")
 * @param message - Human-readable error message
 * @param details - Optional additional error details
 * @returns Formatted error response object
 *
 * @example
 * ```typescript
 * res.status(400).json(createErrorResponse("VALIDATION_ERROR", "Invalid email format"));
 * // { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid email format" } }
 * ```
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
  };
}
