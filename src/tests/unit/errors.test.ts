import { describe, it, expect } from "vitest";
import {
  BaseError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalError,
  isBaseError,
} from "../../errors/BaseError";

describe("BaseError", () => {
  it("should create an error with all properties", () => {
    const error = new BaseError("Test error", "TEST_ERROR", 500, { key: "value" });

    expect(error.message).toBe("Test error");
    expect(error.code).toBe("TEST_ERROR");
    expect(error.statusCode).toBe(500);
    expect(error.details).toEqual({ key: "value" });
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe("BaseError");
  });

  it("should default isOperational to true", () => {
    const error = new BaseError("Test", "TEST", 400);
    expect(error.isOperational).toBe(true);
  });

  it("should allow setting isOperational to false", () => {
    const error = new BaseError("Test", "TEST", 500, undefined, false);
    expect(error.isOperational).toBe(false);
  });

  it("should serialize to JSON correctly", () => {
    const error = new BaseError("Test error", "TEST_ERROR", 400, { field: "email" });
    const json = error.toJSON();

    expect(json).toEqual({
      code: "TEST_ERROR",
      message: "Test error",
      details: { field: "email" },
    });
  });

  it("should serialize to JSON without details when undefined", () => {
    const error = new BaseError("Test error", "TEST_ERROR", 400);
    const json = error.toJSON();

    expect(json).toEqual({
      code: "TEST_ERROR",
      message: "Test error",
    });
  });

  it("should have proper stack trace", () => {
    const error = new BaseError("Test", "TEST", 500);
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("BaseError");
  });
});

describe("ValidationError", () => {
  it("should create a validation error with correct defaults", () => {
    const error = new ValidationError("Invalid input");

    expect(error.message).toBe("Invalid input");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("ValidationError");
  });

  it("should accept details", () => {
    const error = new ValidationError("Invalid input", { field: "email", reason: "format" });

    expect(error.details).toEqual({ field: "email", reason: "format" });
  });
});

describe("AuthError", () => {
  it("should create an auth error with defaults", () => {
    const error = new AuthError();

    expect(error.message).toBe("Authentication required");
    expect(error.code).toBe("AUTH_INVALID");
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe("AuthError");
  });

  it("should accept custom message and code", () => {
    const error = new AuthError("Token expired", "TOKEN_EXPIRED");

    expect(error.message).toBe("Token expired");
    expect(error.code).toBe("TOKEN_EXPIRED");
  });
});

describe("ForbiddenError", () => {
  it("should create a forbidden error with defaults", () => {
    const error = new ForbiddenError();

    expect(error.message).toBe("Access denied");
    expect(error.code).toBe("FORBIDDEN");
    expect(error.statusCode).toBe(403);
    expect(error.name).toBe("ForbiddenError");
  });

  it("should accept custom message", () => {
    const error = new ForbiddenError("Insufficient permissions");

    expect(error.message).toBe("Insufficient permissions");
  });
});

describe("NotFoundError", () => {
  it("should create a not found error with default resource", () => {
    const error = new NotFoundError();

    expect(error.message).toBe("Resource not found");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("NotFoundError");
  });

  it("should create a not found error with resource name", () => {
    const error = new NotFoundError("User");

    expect(error.message).toBe("User not found");
  });

  it("should create a not found error with resource and identifier", () => {
    const error = new NotFoundError("User", "123");

    expect(error.message).toBe("User with identifier '123' not found");
  });
});

describe("ConflictError", () => {
  it("should create a conflict error", () => {
    const error = new ConflictError("Email already exists");

    expect(error.message).toBe("Email already exists");
    expect(error.code).toBe("CONFLICT");
    expect(error.statusCode).toBe(409);
    expect(error.name).toBe("ConflictError");
  });

  it("should accept details", () => {
    const error = new ConflictError("Duplicate entry", { field: "email" });

    expect(error.details).toEqual({ field: "email" });
  });
});

describe("InternalError", () => {
  it("should create an internal error with defaults", () => {
    const error = new InternalError();

    expect(error.message).toBe("An unexpected error occurred");
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
    expect(error.name).toBe("InternalError");
  });

  it("should accept custom message and details", () => {
    const error = new InternalError("Database connection failed", { db: "postgres" });

    expect(error.message).toBe("Database connection failed");
    expect(error.details).toEqual({ db: "postgres" });
  });
});

describe("isBaseError", () => {
  it("should return true for BaseError instances", () => {
    expect(isBaseError(new BaseError("Test", "TEST", 400))).toBe(true);
    expect(isBaseError(new ValidationError("Test"))).toBe(true);
    expect(isBaseError(new AuthError())).toBe(true);
    expect(isBaseError(new ForbiddenError())).toBe(true);
    expect(isBaseError(new NotFoundError())).toBe(true);
    expect(isBaseError(new ConflictError("Test"))).toBe(true);
    expect(isBaseError(new InternalError())).toBe(true);
  });

  it("should return false for non-BaseError values", () => {
    expect(isBaseError(new Error("Test"))).toBe(false);
    expect(isBaseError("error")).toBe(false);
    expect(isBaseError(null)).toBe(false);
    expect(isBaseError(undefined)).toBe(false);
    expect(isBaseError({ code: "TEST", message: "Test" })).toBe(false);
  });
});
