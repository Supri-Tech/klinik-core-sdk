import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDateTime,
  formatDate,
  formatTime,
  parseISODate,
  isValidISODate,
  nowISO,
  addDays,
  addHours,
  isPast,
  isFuture,
} from "../../utils/date";

describe("formatDateTime", () => {
  it("should format date to ISO 8601 string", () => {
    const date = new Date("2024-12-17T10:30:00.000Z");
    expect(formatDateTime(date)).toBe("2024-12-17T10:30:00.000Z");
  });

  it("should use current date when no argument provided", () => {
    const before = new Date();
    const result = formatDateTime();
    const after = new Date();

    const resultDate = new Date(result);
    expect(resultDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(resultDate.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

describe("formatDate", () => {
  it("should format date to YYYY-MM-DD", () => {
    const date = new Date("2024-12-17T10:30:00.000Z");
    expect(formatDate(date)).toBe("2024-12-17");
  });

  it("should use current date when no argument provided", () => {
    const result = formatDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("formatTime", () => {
  it("should format date to HH:mm:ss", () => {
    const date = new Date("2024-12-17T10:30:45.000Z");
    expect(formatTime(date)).toBe("10:30:45");
  });

  it("should use current date when no argument provided", () => {
    const result = formatTime();
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

describe("parseISODate", () => {
  it("should parse valid ISO date string", () => {
    const result = parseISODate("2024-12-17T10:30:00.000Z");

    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe("2024-12-17T10:30:00.000Z");
  });

  it("should return null for invalid date string", () => {
    expect(parseISODate("not-a-date")).toBeNull();
    expect(parseISODate("")).toBeNull();
  });

  it("should handle various valid formats", () => {
    expect(parseISODate("2024-12-17")).toBeInstanceOf(Date);
    expect(parseISODate("2024-12-17T10:30:00Z")).toBeInstanceOf(Date);
  });
});

describe("isValidISODate", () => {
  it("should return true for valid ISO date strings", () => {
    expect(isValidISODate("2024-12-17T10:30:00.000Z")).toBe(true);
  });

  it("should return false for invalid date strings", () => {
    expect(isValidISODate("not-a-date")).toBe(false);
    expect(isValidISODate("")).toBe(false);
  });

  it("should return false for non-ISO formatted dates", () => {
    // parseISODate accepts "2024-12-17" but isValidISODate requires exact ISO format
    expect(isValidISODate("2024-12-17")).toBe(false);
    expect(isValidISODate("12/17/2024")).toBe(false);
  });
});

describe("nowISO", () => {
  it("should return current time in ISO format", () => {
    const before = new Date().toISOString();
    const result = nowISO();
    const after = new Date().toISOString();

    expect(result >= before).toBe(true);
    expect(result <= after).toBe(true);
  });

  it("should return valid ISO string", () => {
    const result = nowISO();
    expect(isValidISODate(result)).toBe(true);
  });
});

describe("addDays", () => {
  it("should add positive days", () => {
    const date = new Date("2024-12-17T10:00:00.000Z");
    const result = addDays(date, 5);

    expect(result.toISOString()).toBe("2024-12-22T10:00:00.000Z");
  });

  it("should subtract days with negative value", () => {
    const date = new Date("2024-12-17T10:00:00.000Z");
    const result = addDays(date, -5);

    expect(result.toISOString()).toBe("2024-12-12T10:00:00.000Z");
  });

  it("should not mutate original date", () => {
    const date = new Date("2024-12-17T10:00:00.000Z");
    const originalTime = date.getTime();
    addDays(date, 5);

    expect(date.getTime()).toBe(originalTime);
  });

  it("should handle month boundaries", () => {
    const date = new Date("2024-12-30T10:00:00.000Z");
    const result = addDays(date, 5);

    expect(result.toISOString()).toBe("2025-01-04T10:00:00.000Z");
  });
});

describe("addHours", () => {
  it("should add positive hours", () => {
    const date = new Date("2024-12-17T10:00:00.000Z");
    const result = addHours(date, 5);

    expect(result.toISOString()).toBe("2024-12-17T15:00:00.000Z");
  });

  it("should subtract hours with negative value", () => {
    const date = new Date("2024-12-17T10:00:00.000Z");
    const result = addHours(date, -3);

    expect(result.toISOString()).toBe("2024-12-17T07:00:00.000Z");
  });

  it("should not mutate original date", () => {
    const date = new Date("2024-12-17T10:00:00.000Z");
    const originalTime = date.getTime();
    addHours(date, 5);

    expect(date.getTime()).toBe(originalTime);
  });

  it("should handle day boundaries", () => {
    const date = new Date("2024-12-17T22:00:00.000Z");
    const result = addHours(date, 5);

    expect(result.toISOString()).toBe("2024-12-18T03:00:00.000Z");
  });
});

describe("isPast", () => {
  it("should return true for past dates", () => {
    const pastDate = new Date("2020-01-01T00:00:00.000Z");
    expect(isPast(pastDate)).toBe(true);
  });

  it("should return false for future dates", () => {
    const futureDate = new Date("2030-01-01T00:00:00.000Z");
    expect(isPast(futureDate)).toBe(false);
  });
});

describe("isFuture", () => {
  it("should return true for future dates", () => {
    const futureDate = new Date("2030-01-01T00:00:00.000Z");
    expect(isFuture(futureDate)).toBe(true);
  });

  it("should return false for past dates", () => {
    const pastDate = new Date("2020-01-01T00:00:00.000Z");
    expect(isFuture(pastDate)).toBe(false);
  });
});
