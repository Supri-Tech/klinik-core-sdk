import { describe, it, expect } from "vitest";
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  parsePaginationQuery,
  createPaginationMeta,
  createPaginatedResponse,
} from "../../types/pagination";

describe("Pagination Constants", () => {
  it("should have correct default values", () => {
    expect(DEFAULT_PAGE).toBe(1);
    expect(DEFAULT_LIMIT).toBe(20);
    expect(MAX_LIMIT).toBe(100);
  });
});

describe("parsePaginationQuery", () => {
  it("should return defaults for empty query", () => {
    const result = parsePaginationQuery({});

    expect(result).toEqual({
      page: 1,
      limit: 20,
      offset: 0,
      sortBy: undefined,
      order: "asc",
    });
  });

  it("should parse page and limit", () => {
    const result = parsePaginationQuery({ page: 3, limit: 10 });

    expect(result.page).toBe(3);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(20);
  });

  it("should enforce minimum page of 1", () => {
    const result = parsePaginationQuery({ page: 0 });
    expect(result.page).toBe(1);

    const result2 = parsePaginationQuery({ page: -5 });
    expect(result2.page).toBe(1);
  });

  it("should enforce maximum limit", () => {
    const result = parsePaginationQuery({ limit: 200 });
    expect(result.limit).toBe(MAX_LIMIT);
  });

  it("should use default limit for zero or negative values", () => {
    // 0 is falsy, so it falls back to DEFAULT_LIMIT
    const result = parsePaginationQuery({ limit: 0 });
    expect(result.limit).toBe(DEFAULT_LIMIT);

    // Negative values are less than 1, so Math.max(1, ...) returns 1
    // But first the falsy check returns DEFAULT_LIMIT
    const result2 = parsePaginationQuery({ limit: -10 });
    expect(result2.limit).toBe(1);
  });

  it("should parse sortBy", () => {
    const result = parsePaginationQuery({ sortBy: "created_at" });
    expect(result.sortBy).toBe("created_at");
  });

  it("should parse order", () => {
    const ascResult = parsePaginationQuery({ order: "asc" });
    expect(ascResult.order).toBe("asc");

    const descResult = parsePaginationQuery({ order: "desc" });
    expect(descResult.order).toBe("desc");
  });

  it("should default order to asc for invalid values", () => {
    const result = parsePaginationQuery({ order: "invalid" as any });
    expect(result.order).toBe("asc");
  });

  it("should calculate correct offset", () => {
    expect(parsePaginationQuery({ page: 1, limit: 10 }).offset).toBe(0);
    expect(parsePaginationQuery({ page: 2, limit: 10 }).offset).toBe(10);
    expect(parsePaginationQuery({ page: 5, limit: 20 }).offset).toBe(80);
  });
});

describe("createPaginationMeta", () => {
  it("should create pagination metadata", () => {
    const meta = createPaginationMeta(97, 1, 20);

    expect(meta).toEqual({
      currentPage: 1,
      totalPages: 5,
      totalItems: 97,
      itemsPerPage: 20,
    });
  });

  it("should handle exact division", () => {
    const meta = createPaginationMeta(100, 1, 20);
    expect(meta.totalPages).toBe(5);
  });

  it("should handle zero items", () => {
    const meta = createPaginationMeta(0, 1, 20);
    expect(meta.totalPages).toBe(0);
    expect(meta.totalItems).toBe(0);
  });

  it("should handle single item", () => {
    const meta = createPaginationMeta(1, 1, 20);
    expect(meta.totalPages).toBe(1);
  });
});

describe("createPaginatedResponse", () => {
  it("should create a paginated response", () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const response = createPaginatedResponse(data, 50, 1, 20);

    expect(response).toEqual({
      success: true,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }],
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 50,
        itemsPerPage: 20,
      },
    });
  });

  it("should include message when provided", () => {
    const data = [{ id: 1 }];
    const response = createPaginatedResponse(data, 1, 1, 20, "Items retrieved");

    expect(response.message).toBe("Items retrieved");
  });

  it("should handle empty data array", () => {
    const response = createPaginatedResponse([], 0, 1, 20);

    expect(response.data).toEqual([]);
    expect(response.pagination.totalItems).toBe(0);
    expect(response.pagination.totalPages).toBe(0);
  });

  it("should handle last page", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const response = createPaginatedResponse(data, 42, 3, 20);

    expect(response.pagination.currentPage).toBe(3);
    expect(response.pagination.totalPages).toBe(3);
  });
});
