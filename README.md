# Santosh Kumar — Portfolio

A compact, Batman-inspired portfolio for Santosh Kumar. The site uses an editorial content structure, a restrained graphite-and-signal-yellow visual system, selected case studies, writing, a centered GitHub contribution calendar, a playable Spotify embed, and an accessible command interface that can navigate or answer factual questions about Santosh.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. The portfolio is complete without private credentials; external signals render intentional setup states until their environment variables are connected.

## Integrations

- `NEXT_PUBLIC_SITE_URL`: production origin for canonical links, sitemap, and social metadata.
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`: current or recently played track and official Spotify player embed. Authorize with `user-read-currently-playing user-read-recently-played`.
- `GITHUB_TOKEN`: read-only server-side token for the public contribution calendar of `marsh15`.
- `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, and optional `VERCEL_TEAM_ID`: aggregate 30-day visitor count from Vercel Web Analytics. The `VERCEL_ANALYTICS_TOKEN`, `VERCEL_ANALYTICS_PROJECT_ID`, and `VERCEL_ANALYTICS_TEAM_ID` names are also accepted.

Weather comes from Open-Meteo and needs no private key. Enable Web Analytics on the production Vercel project for visitor data.

## Interaction notes

- Sound never autoplays. The header control synthesizes an original low-volume cinematic soundscape only after the visitor clicks **Sound on**.
- `Cmd/Ctrl + K` opens the keyboard-accessible “Ask or navigate” interface. Its biographical answers are curated locally and cannot invent facts.
- The small cursor follower is disabled for touch input and reduced-motion preferences.
- Press feedback works visually everywhere and uses `navigator.vibrate()` only where the browser supports it.

## Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
