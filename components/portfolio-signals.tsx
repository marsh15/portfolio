"use client";

import { useCallback, useEffect, useState } from "react";
import { LocalTime } from "@/components/local-time";
import type { LiveLedgerResponse } from "@/lib/live";

function spotifyEmbedUrl(url: string) {
  try {
    const id = new URL(url).pathname.split("/").filter(Boolean).at(-1);
    return id ? `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0` : null;
  } catch {
    return null;
  }
}

export function PortfolioSignals() {
  const [data, setData] = useState<LiveLedgerResponse>();
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/live", { cache: "no-store" });
      if (!response.ok) throw new Error(`Signals returned ${response.status}`);
      setData(await response.json() as LiveLedgerResponse);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    const polling = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 30_000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void load();
    };
    const onFocus = () => void load();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(polling);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const github = data?.github;
  const spotify = data?.spotify;
  const weather = data?.weather;
  const visitors = data?.visitors;
  const spotifyEmbed = spotify?.status === "ok" ? spotifyEmbedUrl(spotify.data.url) : null;

  return (
    <section className="signals-section page-shell" id="activity" aria-labelledby="activity-title">
      <div className="section-heading" data-reveal>
        <p className="section-index">03 / Activity</p>
        <h2 id="activity-title">A little evidence from lately.</h2>
      </div>

      <div className="activity-grid">
        <article className="github-panel" data-reveal>
          <header>
            <div><p>GitHub contributions</p><span>@marsh15 · last 12 months</span></div>
            {github?.status === "ok" && <strong>{github.data.total.toLocaleString("en-IN")}</strong>}
          </header>
          {github?.status === "ok" ? (
            <>
              <div className="contribution-map" aria-label={`${github.data.total} GitHub contributions in the last year`}>
                {github.data.contributions.map((day) => (
                  <span key={day.date} data-level={day.level} title={`${day.date}: ${day.count} contributions`} />
                ))}
              </div>
              <div className="contribution-legend" aria-hidden="true"><span>Less</span><i data-level="0" /><i data-level="1" /><i data-level="2" /><i data-level="3" /><i data-level="4" /><span>More</span></div>
            </>
          ) : (
            <p className="signal-fallback">The contribution calendar appears here when the production GitHub token is connected.</p>
          )}
          <a className="text-link" href="https://github.com/marsh15" target="_blank" rel="noreferrer">View GitHub <span aria-hidden="true">↗</span></a>
        </article>

        <article className="listening-panel" data-reveal>
          <header>
            <div><p>Listening</p><span>{spotify?.status === "ok" ? (spotify.data.mode === "playing" ? "Playing now" : "Recently played") : "Spotify"}</span></div>
            {spotify?.status === "ok" && <span className="equalizer" aria-label="Audio activity"><i /><i /><i /><i /></span>}
          </header>
          {spotify?.status === "ok" ? (
            <>
              <div className="track-copy"><strong>{spotify.data.track}</strong><span>{spotify.data.artists.join(", ")}</span></div>
              {spotifyEmbed ? (
                <iframe
                  className="spotify-embed"
                  title={`Play ${spotify.data.track} by ${spotify.data.artists.join(", ")}`}
                  src={spotifyEmbed}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              ) : <a className="text-link" href={spotify.data.url} target="_blank" rel="noreferrer">Play on Spotify <span aria-hidden="true">↗</span></a>}
            </>
          ) : (
            <p className="signal-fallback">The playable last track appears here after the Spotify credentials are added.</p>
          )}
        </article>
      </div>

      <div className="tiny-signals" aria-label="Small live site signals" data-reveal>
        <p><span>Coimbatore time</span><LocalTime /></p>
        <p><span>Weather</span><strong>{weather?.status === "ok" ? `${Math.round(weather.data.temperature)}°C · ${weather.data.label}` : "Connects on deploy"}</strong></p>
        <p><span>Visitors · 30d</span><strong>{visitors?.status === "ok" ? visitors.data.total.toLocaleString("en-IN") : "Connects on deploy"}</strong></p>
        <p><span>Site status</span><strong>{failed ? "Static portfolio online" : "All systems normal"}</strong></p>
      </div>
    </section>
  );
}
