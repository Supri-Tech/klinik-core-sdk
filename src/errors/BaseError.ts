/**
 * Base error class for all application errors.
 * Provides structured error handling with error codes and HTTP status.
 */
export class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: unknown,
    isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts the error to a JSON-serializable object for API responses.
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(this.details !== undefined && { details: this.details }),
    };
  }
}

/**
 * Validation error for invalid input data (400 Bad Request).
 */
export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

/**
 * Authentication error for missing or invalid credentials (401 Unauthorized).
 */
export class AuthError extends BaseError {
  constructor(message = "Authentication required", code = "AUTH_INVALID") {
    super(message, code, 401);
  }
}

/**
 * Authorization error for insufficient permissions (403 Forbidden).
 */
export class ForbiddenError extends BaseError {
  constructor(message = "Access denied") {
    super(message, "FORBIDDEN", 403);
  }
}

/**
 * Not found error for missing resources (404 Not Found).
 */
export class NotFoundError extends BaseError {
  constructor(resource = "Resource", identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, "NOT_FOUND", 404);
  }
}

/**
 * Conflict error for duplicate entries or state conflicts (409 Conflict).
 */
export class ConflictError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, "CONFLICT", 409, details);
  }
}

/**
 * Internal server error for unexpected failures (500 Internal Server Error).
 */
export class InternalError extends BaseError {
  constructor(message = "An unexpected error occurred", details?: unknown) {
    super(message, "INTERNAL_ERROR", 500, details, false);
  }
}

/**
 * Type guard to check if an error is a BaseError instance.
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}
