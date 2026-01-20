/**
 * OpenAPI utilities for Hospital Management System
 *
 * This module provides shared OpenAPI/Swagger documentation utilities
 * using zod-to-openapi for automatic schema generation.
 *
 * @packageDocumentation
 */

import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI methods (.openapi())
extendZodWithOpenApi(z);

// Re-export extended Zod
export { z };

// Re-export zod-to-openapi utilities
export {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";

// Export schema helpers
export * from "./schemas/common";
