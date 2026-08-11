import { afterEach, describe, expect, it, vi } from "vitest";
import { getGitHub, getSpotify, getVisitors, getWeather } from "@/lib/live";

const jsonResponse = (value: unknown, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { "Content-Type": "application/json" },
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("live ledger providers", () => {
  it("keeps credentialed feeds unavailable without making a network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "");
    vi.stubEnv("GITHUB_TOKEN", "");
    vi.stubEnv("VERCEL_API_TOKEN", "");
    vi.stubEnv("VERCEL_PROJECT_ID", "");

    expect((await getSpotify()).status).toBe("unavailable");
    expect((await getGitHub()).status).toBe("unavailable");
    expect((await getVisitors()).status).toBe("unavailable");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes the public Coimbatore weather response", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({
      current: { temperature_2m: 28.4, weather_code: 2, is_day: 1, time: "2026-08-09T12:00" },
    })));

    const result = await getWeather();
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.data).toMatchObject({ temperature: 28.4, label: "Partly cloudy", isDay: true });
    }
  });

  it("falls back from an idle player to the most recently played Spotify track", async () => {
    vi.stubEnv("SPOTIFY_CLIENT_ID", "client");
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "refresh");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: "access" }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(jsonResponse({ items: [{
        played_at: "2026-08-09T06:00:00Z",
        track: {
          type: "track",
          name: "A Quiet Test",
          artists: [{ name: "Example Artist" }],
          album: { name: "Fixtures", images: [] },
          external_urls: { spotify: "https://open.spotify.com/track/example" },
        },
      }] }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await getSpotify();
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.data).toMatchObject({ mode: "recent", track: "A Quiet Test", artists: ["Example Artist"] });
    }
  });

  it("reads the documented Vercel visitor response for the last 30 days", async () => {
    vi.stubEnv("VERCEL_API_TOKEN", "token");
    vi.stubEnv("VERCEL_PROJECT_ID", "project");
    vi.stubEnv("VERCEL_TEAM_ID", "team");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        version: 1,
        query: { since: "2026-07-12", until: "2026-08-11" },
        data: { pageviews: 72, visitors: 37 },
      }))
      .mockResolvedValueOnce(jsonResponse({
        version: 1,
        query: { since: "2026-07-12", until: "2026-08-11", groupBy: ["country"] },
        data: [
          { country: "in", pageviews: 40, visitors: 24 },
          { country: "us", pageviews: 18, visitors: 9 },
        ],
      }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await getVisitors();

    expect(result).toMatchObject({
      status: "ok",
      data: {
        windowDays: 30,
        total: 37,
        countries: [
          { code: "IN", count: 24 },
          { code: "US", count: 9 },
        ],
      },
    });
    for (const [input] of fetchMock.mock.calls) {
      const url = new URL(String(input));
      expect(url.searchParams.has("since")).toBe(true);
      expect(url.searchParams.has("until")).toBe(true);
      expect(url.searchParams.has("from")).toBe(false);
      expect(url.searchParams.has("to")).toBe(false);
    }
  });
});
