/**
 * Hospital Core SDK
 *
 * Generic utilities for the Hospital Management System.
 * This package contains ONLY generic utilities - no business logic,
 * no database schemas, and no sensitive middleware.
 *
 * @packageDocumentation
 */

// ============================================================================
// Errors
// ============================================================================
export {
  BaseError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalError,
  isBaseError,
} from "./errors/BaseError";

// ============================================================================
// Types
// ============================================================================
export {
  type ApiSuccessResponse,
  type ApiErrorDetail,
  type ApiErrorResponse,
  type ApiResponse,
  createResponse,
  createErrorResponse,
} from "./types/ApiResponse";

export {
  type PaginationMeta,
  type PaginatedResponse,
  type PaginationQuery,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  parsePaginationQuery,
  createPaginationMeta,
  createPaginatedResponse,
} from "./types/pagination";

// ============================================================================
// Utils
// ============================================================================
export {
  formatDateTime,
  formatDate,
  formatTime,
  parseISODate,
  isValidISODate,
  nowISO,
  addDays,
  addHours,
  isPast,
  isFuture,
} from "./utils/date";

export {
  withAuditFields,
  type AuditFields,
  createAuditFieldsForInsert,
  createAuditFieldsForUpdate,
} from "./utils/auditFields";

// ============================================================================
// OpenAPI
// ============================================================================
export {
  // Extended Zod with .openapi() method
  z,
  // zod-to-openapi classes
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  OpenApiGeneratorV31,
  // Common schemas
  ErrorResponseSchema,
  SuccessResponseSchema,
  PaginatedResponseSchema,
  PaginationMetaSchema,
  PaginationQuerySchema,
  UUIDParamSchema,
  StatusAktifSchema,
  SearchQuerySchema,
  AuditFieldsSchema,
  // Types
  type ErrorResponse,
  type PaginationMeta as OpenAPIPaginationMeta,
  type PaginationQuery as OpenAPIPaginationQuery,
  type UUIDParam,
  type StatusAktif,
  type AuditFields as OpenAPIAuditFields,
} from "./openapi";
