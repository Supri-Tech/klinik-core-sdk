/**
 * Drizzle ORM helper for adding standardized audit fields to tables.
 * All tables should include these fields for tracking creation and modification.
 */

import { timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Audit field column definitions for Drizzle ORM schemas.
 *
 * Includes:
 * - `created_at`: Timestamp when the record was created
 * - `updated_at`: Timestamp when the record was last updated
 * - `created_by`: UUID of the user who created the record (nullable for system-generated)
 * - `updated_by`: UUID of the user who last updated the record (nullable)
 *
 * @returns Object containing audit field column definitions
 *
 * @example
 * ```typescript
 * import { pgTable, text, uuid } from "drizzle-orm/pg-core";
 * import { withAuditFields } from "klinik-core-sdk";
 *
 * export const pengguna = pgTable("pengguna", {
 *   id: uuid("id").primaryKey().defaultRandom(),
 *   username: text("username").notNull(),
 *   ...withAuditFields(),
 * });
 * ```
 */
export function withAuditFields() {
  return {
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    created_by: uuid("created_by"),
    updated_by: uuid("updated_by"),
  };
}

/**
 * Type definition for audit fields.
 * Use this when defining types for records that include audit fields.
 */
export interface AuditFields {
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * Creates an audit fields object for insert operations.
 *
 * @param userId - The ID of the user performing the action (optional for system operations)
 * @returns Object with audit field values for insertion
 *
 * @example
 * ```typescript
 * const newRecord = {
 *   id: crypto.randomUUID(),
 *   username: "john_doe",
 *   ...createAuditFieldsForInsert(req.user?.id),
 * };
 * await db.insert(pengguna).values(newRecord);
 * ```
 */
export function createAuditFieldsForInsert(userId?: string | null): {
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  updated_by: string | null;
} {
  const now = new Date();
  return {
    created_at: now,
    updated_at: now,
    created_by: userId ?? null,
    updated_by: userId ?? null,
  };
}

/**
 * Creates an audit fields object for update operations.
 *
 * @param userId - The ID of the user performing the update (optional for system operations)
 * @returns Object with audit field values for updating
 *
 * @example
 * ```typescript
 * await db
 *   .update(pengguna)
 *   .set({
 *     username: "new_username",
 *     ...createAuditFieldsForUpdate(req.user?.id),
 *   })
 *   .where(eq(pengguna.id, userId));
 * ```
 */
export function createAuditFieldsForUpdate(userId?: string | null): {
  updated_at: Date;
  updated_by: string | null;
} {
  return {
    updated_at: new Date(),
    updated_by: userId ?? null,
  };
}
