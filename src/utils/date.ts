/**
 * Date utility functions for consistent date formatting.
 * All dates use ISO 8601 format.
 */

/**
 * Formats a Date object to ISO 8601 datetime string.
 *
 * @param date - Date to format (defaults to now)
 * @returns ISO 8601 formatted datetime string
 *
 * @example
 * ```typescript
 * formatDateTime(new Date("2024-12-17T10:30:00Z"));
 * // "2024-12-17T10:30:00.000Z"
 * ```
 */
export function formatDateTime(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Formats a Date object to date-only string (YYYY-MM-DD).
 *
 * @param date - Date to format (defaults to now)
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * ```typescript
 * formatDate(new Date("2024-12-17T10:30:00Z"));
 * // "2024-12-17"
 * ```
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Formats a Date object to time-only string (HH:mm:ss).
 *
 * @param date - Date to format (defaults to now)
 * @returns Time string in HH:mm:ss format
 *
 * @example
 * ```typescript
 * formatTime(new Date("2024-12-17T10:30:45Z"));
 * // "10:30:45"
 * ```
 */
export function formatTime(date: Date = new Date()): string {
  return date.toISOString().slice(11, 19);
}

/**
 * Parses an ISO 8601 string to a Date object.
 *
 * @param dateString - ISO 8601 formatted date string
 * @returns Parsed Date object or null if invalid
 *
 * @example
 * ```typescript
 * parseISODate("2024-12-17T10:30:00.000Z");
 * // Date object
 * ```
 */
export function parseISODate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Checks if a date string is a valid ISO 8601 format.
 *
 * @param dateString - String to validate
 * @returns True if valid ISO 8601 format
 */
export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
}

/**
 * Gets the current timestamp in ISO 8601 format.
 *
 * @returns Current datetime as ISO 8601 string
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Adds days to a date.
 *
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New Date object
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Adds hours to a date.
 *
 * @param date - Starting date
 * @param hours - Number of hours to add (can be negative)
 * @returns New Date object
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setTime(result.getTime() + hours * 60 * 60 * 1000);
  return result;
}

/**
 * Checks if a date is in the past.
 *
 * @param date - Date to check
 * @returns True if the date is before now
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Checks if a date is in the future.
 *
 * @param date - Date to check
 * @returns True if the date is after now
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}
