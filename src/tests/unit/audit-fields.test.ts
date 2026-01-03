import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  withAuditFields,
  createAuditFieldsForInsert,
  createAuditFieldsForUpdate,
} from "../../utils/auditFields";

describe("withAuditFields", () => {
  it("should return audit field column definitions", () => {
    const fields = withAuditFields();

    expect(fields).toHaveProperty("created_at");
    expect(fields).toHaveProperty("updated_at");
    expect(fields).toHaveProperty("created_by");
    expect(fields).toHaveProperty("updated_by");
  });
});

describe("createAuditFieldsForInsert", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-12-17T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create audit fields with user ID", () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    const fields = createAuditFieldsForInsert(userId);

    expect(fields).toEqual({
      created_at: new Date("2024-12-17T10:00:00.000Z"),
      updated_at: new Date("2024-12-17T10:00:00.000Z"),
      created_by: userId,
      updated_by: userId,
    });
  });

  it("should create audit fields with null user ID when not provided", () => {
    const fields = createAuditFieldsForInsert();

    expect(fields.created_by).toBeNull();
    expect(fields.updated_by).toBeNull();
  });

  it("should create audit fields with null user ID when null is passed", () => {
    const fields = createAuditFieldsForInsert(null);

    expect(fields.created_by).toBeNull();
    expect(fields.updated_by).toBeNull();
  });

  it("should set same timestamp for created_at and updated_at", () => {
    const fields = createAuditFieldsForInsert("user-id");

    expect(fields.created_at.getTime()).toBe(fields.updated_at.getTime());
  });
});

describe("createAuditFieldsForUpdate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-12-17T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create update audit fields with user ID", () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    const fields = createAuditFieldsForUpdate(userId);

    expect(fields).toEqual({
      updated_at: new Date("2024-12-17T12:00:00.000Z"),
      updated_by: userId,
    });
  });

  it("should not include created_at or created_by", () => {
    const fields = createAuditFieldsForUpdate("user-id");

    expect(fields).not.toHaveProperty("created_at");
    expect(fields).not.toHaveProperty("created_by");
  });

  it("should create update audit fields with null user ID when not provided", () => {
    const fields = createAuditFieldsForUpdate();

    expect(fields.updated_by).toBeNull();
  });

  it("should create update audit fields with null user ID when null is passed", () => {
    const fields = createAuditFieldsForUpdate(null);

    expect(fields.updated_by).toBeNull();
  });
});
