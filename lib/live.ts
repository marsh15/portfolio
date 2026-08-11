export type LiveResult<T> =
  | { status: "ok"; data: T; updatedAt: string }
  | { status: "unavailable"; message: string };

export type NowListening = {
  mode: "playing" | "recent";
  track: string;
  artists: string[];
  album: string;
  artwork?: string;
  url: string;
  playedAt?: string;
};

export type WeatherSnapshot = {
  temperature: number;
  weatherCode: number;
  label: string;
  isDay: boolean;
  observedAt: string;
};

export type ContributionDay = { date: string; count: number; level: number };
export type GitHubSnapshot = {
  contributions: ContributionDay[];
  total: number;
  profileUrl: string;
};

export type VisitorSnapshot = {
  windowDays: 30;
  total: number;
  countries: { code: string; count: number }[];
};

export type LiveLedgerResponse = {
  spotify: LiveResult<NowListening>;
  weather: LiveResult<WeatherSnapshot>;
  github: LiveResult<GitHubSnapshot>;
  visitors: LiveResult<VisitorSnapshot>;
  generatedAt: string;
};

const unavailable = <T>(message: string): LiveResult<T> => ({ status: "unavailable", message });
const ok = <T>(data: T): LiveResult<T> => ({ status: "ok", data, updatedAt: new Date().toISOString() });

async function safeJson(response: Response): Promise<unknown> {
  if (!response.ok) throw new Error(`Provider returned ${response.status}`);
  return response.json();
}

function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Misty";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Wintry";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorms";
}

export async function getWeather(): Promise<LiveResult<WeatherSnapshot>> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
      latitude: "11.0168",
      longitude: "76.9558",
      current: "temperature_2m,weather_code,is_day",
      timezone: "Asia/Kolkata",
    }).toString();
    const body = (await safeJson(await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(6000) }))) as {
      current?: { temperature_2m?: number; weather_code?: number; is_day?: number; time?: string };
    };
    const current = body.current;
    if (!current || typeof current.temperature_2m !== "number" || typeof current.weather_code !== "number") {
      throw new Error("Weather payload was incomplete");
    }
    return ok({
      temperature: current.temperature_2m,
      weatherCode: current.weather_code,
      label: weatherLabel(current.weather_code),
      isDay: current.is_day === 1,
      observedAt: current.time ?? new Date().toISOString(),
    });
  } catch {
    return unavailable("Coimbatore weather is temporarily out of reach.");
  }
}

type SpotifyTrack = {
  type?: string;
  name?: string;
  artists?: { name?: string }[];
  album?: { name?: string; images?: { url?: string }[] };
  external_urls?: { spotify?: string };
};

function normalizeTrack(track: SpotifyTrack, mode: NowListening["mode"], playedAt?: string): NowListening | null {
  const url = track.external_urls?.spotify;
  if (track.type !== "track" || !track.name || !url) return null;
  return {
    mode,
    track: track.name,
    artists: track.artists?.flatMap((artist) => (artist.name ? [artist.name] : [])) ?? [],
    album: track.album?.name ?? "Unknown album",
    artwork: track.album?.images?.[1]?.url ?? track.album?.images?.[0]?.url,
    url,
    playedAt,
  };
}

async function spotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  const body = (await safeJson(response)) as { access_token?: string };
  return body.access_token ?? null;
}

export async function getSpotify(): Promise<LiveResult<NowListening>> {
  if (!process.env.SPOTIFY_REFRESH_TOKEN) return unavailable("Listening status is private for the moment.");
  try {
    const token = await spotifyAccessToken();
    if (!token) throw new Error("Spotify access token unavailable");
    const headers = { Authorization: `Bearer ${token}` };
    const current = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (current.status === 200) {
      const body = (await current.json()) as { is_playing?: boolean; item?: SpotifyTrack };
      if (body.is_playing && body.item) {
        const track = normalizeTrack(body.item, "playing");
        if (track) return ok(track);
      }
    } else if (![204].includes(current.status)) {
      throw new Error(`Spotify returned ${current.status}`);
    }

    const recent = (await safeJson(await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    }))) as { items?: { track?: SpotifyTrack; played_at?: string }[] };
    const item = recent.items?.[0];
    const track = item?.track ? normalizeTrack(item.track, "recent", item.played_at) : null;
    return track ? ok(track) : unavailable("Nothing recent is available from Spotify.");
  } catch {
    return unavailable("Spotify did not answer this time.");
  }
}

export async function getGitHub(): Promise<LiveResult<GitHubSnapshot>> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return unavailable("The contribution feed is waiting for a GitHub token.");
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query { user(login: \"marsh15\") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`,
      }),
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(7000),
    });
    const body = (await safeJson(response)) as {
      data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions?: number; weeks?: { contributionDays?: { date: string; contributionCount: number; contributionLevel: string }[] }[] } } } };
    };
    const calendar = body.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar?.weeks || typeof calendar.totalContributions !== "number") throw new Error("GitHub payload was incomplete");
    const levels: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
    return ok({
      total: calendar.totalContributions,
      profileUrl: "https://github.com/marsh15",
      contributions: calendar.weeks.flatMap((week) => week.contributionDays ?? []).map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levels[day.contributionLevel] ?? 0,
      })),
    });
  } catch {
    return unavailable("GitHub activity is temporarily unavailable.");
  }
}

function readCount(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  for (const key of ["visitors", "visitorCount", "count", "total", "value"]) {
    if (typeof row[key] === "number") return row[key];
  }
  return readCount(row.data);
}

export async function getVisitors(): Promise<LiveResult<VisitorSnapshot>> {
  const token = process.env.VERCEL_API_TOKEN || process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID || process.env.VERCEL_ANALYTICS_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID || process.env.VERCEL_ANALYTICS_TEAM_ID;
  if (!token || !projectId) return unavailable("Visitor totals begin after analytics is connected.");
  try {
    const to = new Date();
    const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    const common = new URLSearchParams({
      projectId,
      ...(teamId ? { teamId } : {}),
      since: from.toISOString(),
      until: to.toISOString(),
      filter: "environment eq 'production'",
    });
    const aggregate = new URLSearchParams(common);
    aggregate.set("by", "country");
    aggregate.set("limit", "6");
    const headers = { Authorization: `Bearer ${token}` };
    const [countBody, countryBody] = await Promise.all([
      fetch(`https://api.vercel.com/v1/query/web-analytics/visits/count?${common}`, { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) }).then(safeJson),
      fetch(`https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${aggregate}`, { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) }).then(safeJson),
    ]);
    const total = readCount(countBody);
    if (total === null) throw new Error("Visitor count payload was incomplete");
    const candidateRows = Array.isArray(countryBody)
      ? countryBody
      : ((countryBody as { data?: unknown[]; rows?: unknown[] })?.data ?? (countryBody as { rows?: unknown[] })?.rows ?? []);
    const countries = candidateRows.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const row = item as Record<string, unknown>;
      const code = row.country ?? row.key ?? row.name;
      const count = readCount(row);
      return typeof code === "string" && count !== null ? [{ code: code.toUpperCase(), count }] : [];
    }).sort((a, b) => b.count - a.count).slice(0, 6);
    return ok({ windowDays: 30, total, countries });
  } catch {
    return unavailable("The 30-day visitor ledger is temporarily unavailable.");
  }
}

export async function getLiveLedger(): Promise<LiveLedgerResponse> {
  const [spotify, weather, github, visitors] = await Promise.all([
    getSpotify(), getWeather(), getGitHub(), getVisitors(),
  ]);
  return { spotify, weather, github, visitors, generatedAt: new Date().toISOString() };
}
