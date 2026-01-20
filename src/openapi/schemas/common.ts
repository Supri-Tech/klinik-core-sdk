/**
 * Common OpenAPI schemas for Hospital Management System
 *
 * These schemas are shared across all services for consistent
 * API response documentation.
 */

import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Ensure Zod is extended
extendZodWithOpenApi(z);

// ============================================================================
// Error Response Schema
// ============================================================================

/**
 * Standard error response schema
 */
export const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.string().openapi({
        example: "VALIDATION_ERROR",
        description: "Kode error untuk identifikasi",
      }),
      message: z.string().openapi({
        example: "Data tidak valid",
        description: "Pesan error yang dapat ditampilkan ke user",
      }),
      details: z.record(z.string(), z.unknown()).optional().openapi({
        description: "Detail tambahan error (opsional)",
      }),
    }),
  }).openapi("ErrorResponse");

// ============================================================================
// Pagination Schema
// ============================================================================

/**
 * Pagination metadata schema
 */
export const PaginationMetaSchema = z
  .object({
    page: z.number().int().positive().openapi({
      example: 1,
      description: "Halaman saat ini",
    }),
    limit: z.number().int().positive().openapi({
      example: 20,
      description: "Jumlah item per halaman",
    }),
    total: z.number().int().min(0).openapi({
      example: 100,
      description: "Total seluruh item",
    }),
    totalPages: z.number().int().min(0).openapi({
      example: 5,
      description: "Total halaman",
    }),
  })
  .openapi("PaginationMeta");

/**
 * Common pagination query parameters
 */
export const PaginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1)
    .openapi({
      example: 1,
      description: "Nomor halaman (dimulai dari 1)",
    }),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(20)
    .openapi({
      example: 20,
      description: "Jumlah item per halaman (max 100)",
    }),
});

// ============================================================================
// Success Response Helpers
// ============================================================================

/**
 * Creates a success response schema with typed data
 *
 * @example
 * ```typescript
 * const response = SuccessResponseSchema(UserSchema);
 * // { success: true, data: User, message?: string }
 * ```
 */
export function SuccessResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional().openapi({
      example: "Operasi berhasil",
      description: "Pesan sukses (opsional)",
    }),
  }).openapi("SuccessResponse");
}

/**
 * Creates a paginated response schema with typed items
 *
 * @example
 * ```typescript
 * const response = PaginatedResponseSchema(UserSchema);
 * // { success: true, data: User[], pagination: PaginationMeta }
 * ```
 */
export function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: PaginationMetaSchema,
  }).openapi("PaginatedResponse");
}

// ============================================================================
// Common Parameter Schemas
// ============================================================================

/**
 * UUID path parameter schema
 */
export const UUIDParamSchema = z.object({
  id: z.string().uuid().openapi({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "UUID identifier",
  }),
});

/**
 * Status enum schema (aktif/nonaktif)
 */
export const StatusAktifSchema = z
  .enum(["aktif", "nonaktif"])
  .openapi({
    example: "aktif",
    description: "Status: aktif atau nonaktif",
  });

/**
 * Search query parameter
 */
export const SearchQuerySchema = z.object({
  search: z.string().optional().openapi({
    example: "keyword",
    description: "Kata kunci pencarian",
  }),
});

// ============================================================================
// Audit Fields Schema
// ============================================================================

/**
 * Audit fields schema for response objects
 */
export const AuditFieldsSchema = z.object({
  created_at: z.string().datetime().openapi({
    example: "2026-01-12T10:00:00.000Z",
    description: "Waktu pembuatan record",
  }),
  updated_at: z.string().datetime().openapi({
    example: "2026-01-12T10:00:00.000Z",
    description: "Waktu update terakhir",
  }),
  created_by: z.string().uuid().nullable().optional().openapi({
    description: "ID user yang membuat",
  }),
  updated_by: z.string().uuid().nullable().optional().openapi({
    description: "ID user yang mengupdate",
  }),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type UUIDParam = z.infer<typeof UUIDParamSchema>;
export type StatusAktif = z.infer<typeof StatusAktifSchema>;
export type AuditFields = z.infer<typeof AuditFieldsSchema>;
