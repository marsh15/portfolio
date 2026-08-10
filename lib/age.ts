export const BIRTH_INSTANT = "2004-03-22T11:30:00+05:30";

const TROPICAL_YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;

export function decimalAge(now: Date | number = Date.now(), birthDate = BIRTH_INSTANT) {
  const nowMs = now instanceof Date ? now.getTime() : now;
  const birthMs = new Date(birthDate).getTime();

  if (!Number.isFinite(nowMs) || !Number.isFinite(birthMs) || nowMs < birthMs) {
    throw new RangeError("Age requires a valid instant after the birth date.");
  }

  return (nowMs - birthMs) / TROPICAL_YEAR_MS;
}

export function formatDecimalAge(now: Date | number = Date.now()) {
  return decimalAge(now).toFixed(12);
}
