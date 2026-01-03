import { describe, it, expect } from "vitest";
import {
  createResponse,
  createErrorResponse,
  type ApiSuccessResponse,
  type ApiErrorResponse,
} from "../../types/ApiResponse";

describe("createResponse", () => {
  it("should create a success response with data", () => {
    const data = { id: "123", name: "John" };
    const response = createResponse(data);

    expect(response).toEqual({
      success: true,
      data: { id: "123", name: "John" },
    });
  });

  it("should create a success response with data and message", () => {
    const data = { id: "123", name: "John" };
    const response = createResponse(data, "User created successfully");

    expect(response).toEqual({
      success: true,
      data: { id: "123", name: "John" },
      message: "User created successfully",
    });
  });

  it("should handle null data", () => {
    const response = createResponse(null);

    expect(response).toEqual({
      success: true,
      data: null,
    });
  });

  it("should handle array data", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const response = createResponse(data);

    expect(response).toEqual({
      success: true,
      data: [{ id: 1 }, { id: 2 }],
    });
  });

  it("should handle primitive data", () => {
    const response = createResponse(42, "Answer found");

    expect(response).toEqual({
      success: true,
      data: 42,
      message: "Answer found",
    });
  });

  it("should have correct type", () => {
    const response: ApiSuccessResponse<{ name: string }> = createResponse({ name: "test" });
    expect(response.success).toBe(true);
  });
});

describe("createErrorResponse", () => {
  it("should create an error response", () => {
    const response = createErrorResponse("VALIDATION_ERROR", "Invalid email format");

    expect(response).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid email format",
      },
    });
  });

  it("should create an error response with details", () => {
    const response = createErrorResponse(
      "VALIDATION_ERROR",
      "Validation failed",
      { fields: ["email", "phone"] }
    );

    expect(response).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: { fields: ["email", "phone"] },
      },
    });
  });

  it("should handle various error codes", () => {
    const notFound = createErrorResponse("NOT_FOUND", "Resource not found");
    expect(notFound.error.code).toBe("NOT_FOUND");

    const forbidden = createErrorResponse("FORBIDDEN", "Access denied");
    expect(forbidden.error.code).toBe("FORBIDDEN");

    const internal = createErrorResponse("INTERNAL_ERROR", "Server error");
    expect(internal.error.code).toBe("INTERNAL_ERROR");
  });

  it("should have correct type", () => {
    const response: ApiErrorResponse = createErrorResponse("ERROR", "message");
    expect(response.success).toBe(false);
  });
});
