/**
 * OpenAPI Schemas Index
 *
 * Re-exports all common schemas for easy importing.
 */

export {
  // Response schemas
  ErrorResponseSchema,
  SuccessResponseSchema,
  PaginatedResponseSchema,

  // Pagination
  PaginationMetaSchema,
  PaginationQuerySchema,

  // Common parameters
  UUIDParamSchema,
  StatusAktifSchema,
  SearchQuerySchema,

  // Audit fields
  AuditFieldsSchema,

  // Types
  type ErrorResponse,
  type PaginationMeta,
  type PaginationQuery,
  type UUIDParam,
  type StatusAktif,
  type AuditFields,
} from "./common";
