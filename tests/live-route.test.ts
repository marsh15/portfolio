import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/live", () => ({
  getLiveLedger: vi.fn(async () => ({
    spotify: { status: "unavailable", message: "fixture" },
    weather: { status: "unavailable", message: "fixture" },
    github: { status: "unavailable", message: "fixture" },
    visitors: { status: "unavailable", message: "fixture" },
    generatedAt: "2026-08-11T00:00:00.000Z",
  })),
}));

import { GET } from "@/app/api/live/route";

describe("live route", () => {
  it("prevents browser and CDN caching", async () => {
    const response = await GET();

    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(response.headers.get("CDN-Cache-Control")).toBe("no-store");
    expect(response.headers.get("Vercel-CDN-Cache-Control")).toBe("no-store");
  });
});
