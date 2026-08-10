import { describe, expect, it } from "vitest";
import { BIRTH_INSTANT, decimalAge, formatDecimalAge } from "@/lib/age";

describe("decimal age", () => {
  it("anchors the birth moment in IST", () => {
    expect(decimalAge(new Date(BIRTH_INSTANT))).toBe(0);
    expect(new Date(BIRTH_INSTANT).toISOString()).toBe("2004-03-22T06:00:00.000Z");
  });

  it("uses a tropical year so leap years remain smooth", () => {
    const oneYearLater = new Date("2005-03-22T11:30:00+05:30");
    expect(decimalAge(oneYearLater)).toBeCloseTo(0.999336, 5);
  });

  it("renders stable tabular precision", () => {
    expect(formatDecimalAge(new Date("2026-03-22T11:30:00+05:30"))).toMatch(/^21\.\d{12}$/);
  });

  it("rejects invalid or pre-birth instants", () => {
    expect(() => decimalAge(new Date("not-a-date"))).toThrow(RangeError);
    expect(() => decimalAge(new Date("2000-01-01"))).toThrow(RangeError);
  });
});
