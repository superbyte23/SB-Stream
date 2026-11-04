# SB Stream

A production-ready, Vercel-deployable streaming front end built with Next.js 16. The homepage preserves the supplied **SB Stream** dark cinematic layout and turns it into a real catalogue: TMDB metadata, search, title pages, season/episode browsing, watchlists, continue-watching progress, and a multi-server player that embeds Viduki, VidFast, and Vidy.

> SB Stream does not host any video. Playback is embedded from independent third-party providers. All media rights belong to their respective owners.

---

## Features

- **Template-faithful homepage** — sticky header, full-bleed hero, horizontal poster rails, hover states, and the same `#141414` / `#e50914` visual language.
- **Real catalogue** — trending, popular movies, popular TV, top-rated movies, and top-rated TV from TMDB.
- **Search** — header autocomplete (`⌘K` / `Ctrl+K`), full search page, and a cached `/api/search` endpoint.
- **Title pages** — backdrop, poster, ratings, genres, cast, trailer, recommendations, and SEO metadata with JSON-LD.
- **TV browsing** — season selector and episode lists with stills, air dates, runtimes, and direct watch links.
- **Watch pages** — 16:9 embedded player, server switcher, previous/next episode navigation, and per-episode resume hints.
- **Six playback servers** — Viduki APIs 1–4, VidFast, and Vidy. Viduki's `all-servers-failed` event auto-advances to the next provider.
- **Continue watching** — playback progress is captured from provider `postMessage` events and stored locally.
- **My List** — local watchlist with instant cross-component sync.
- **Graceful demo mode** — without a TMDB key, the app still runs with a curated catalogue of real TMDB IDs, so every button and player works.
- **Production concerns** — ISR caching, security headers, image optimisation, sitemap, robots, manifest, OG image, 404/error boundaries, reduced-motion support, and accessible keyboard navigation.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + hand-written CSS (no UI framework) |
| Icons | Lucide |
| Metadata | TMDB API v3/v4 |
| Playback | Viduki / VidFast / Vidy iframe embeds |
| Hosting | Vercel |

---

## Quick start

```bash
npm install
cp .env.example .env.local
# add your TMDB credentials to .env.local
npm run dev
```

Open <http://localhost:3000>.

### TMDB credentials

Create a free API key at <https://www.themoviedb.org/settings/api>. Either value works:

```dotenv
# Preferred — API Read Access Token (v4)
TMDB_READ_TOKEN=eyJhbGciOi...

# Or the v3 API key
TMDB_API_KEY=0123456789abcdef...
```

`TMDB_READ_TOKEN` is used first. Requests are made server-side only and cached with `revalidate = 3600`.

> The app is fully usable **without** a key, but it will only show the built-in curated catalogue instead of live TMDB data.

---

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `TMDB_READ_TOKEN` | Recommended | TMDB v4 read access token |
| `TMDB_API_KEY` | Optional | TMDB v3 key fallback |
| `TMDB_REVALIDATE` | Optional | TMDB cache seconds (default `3600`) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL, sitemap, OG metadata |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Contact shown on the legal page |

On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used automatically if `NEXT_PUBLIC_SITE_URL` is not set.

---

## Deploy to Vercel

### Dashboard

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo at <https://vercel.com/new>.
3. Framework preset: **Next.js** (auto-detected). Build command `npm run build`, output handled automatically.
4. Add the environment variables above for Production (and Preview if desired).
5. Deploy, then set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.

### CLI

```bash
npm i -g vercel
vercel
vercel env add TMDB_READ_TOKEN production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

No `vercel.json` is required. Next.js is detected automatically.

---

## Playback providers

Provider URLs are generated in `lib/providers.ts`.

| Provider | Movie | TV |
| --- | --- | --- |
| Viduki 1–4 | `https://www.viduki.net/{api}/movie/{tmdbId}?color=e50914` | `https://www.viduki.net/{api}/tv/{tmdbId}/{season}/{episode}?color=e50914` |
| VidFast | `https://vidfast.vc/movie/{tmdbId}?theme=e50914&autoPlay=true` | `https://vidfast.vc/tv/{tmdbId}/{season}/{episode}?theme=e50914&autoPlay=true&nextButton=true&autoNext=true` |
| Vidy | `https://vidy.st/movie/{tmdbId}?color=e50914&autoplay=true` | `https://vidy.st/tv/{tmdbId}/{season}/{episode}?color=e50914&autoplay=true&nextEpisode=true&episodeSelector=true&autoplayNextEpisode=true` |

Vidy additionally accepts `progress={seconds}`; the player passes the saved position when switching to it.

### Server fallback

The player listens for provider messages and validates `event.origin`. When Viduki emits:

```json
{ "type": "viduki:all-servers-failed", "media": { "...": "..." } }
```

it advances to the next configured provider. After the last provider, it displays a retry panel. Users can switch servers at any time; the choice is remembered in `localStorage`.

### Progress and resume

- Viduki exposes `MEDIA_DATA` with per-title/per-episode progress.
- Vidy exposes `MEDIA_DATA` and `PLAYER_EVENT` (`timeupdate`).
- Both are parsed defensively in `components/player.tsx` and written to `localStorage` at most every four seconds.
- Continue-watching cards and resume hints read the same store.
- Progress never leaves the browser.

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Homepage (hero + rails) |
| `/movies` | Popular / top-rated movies with pagination |
| `/tv` | Popular / top-rated series with pagination |
| `/search?q=` | Full search results |
| `/title/movie/[id]` | Movie details |
| `/title/tv/[id]?season=` | Series details, cast, seasons, episodes |
| `/watch/movie/[id]` | Movie player |
| `/watch/tv/[id]/[season]/[episode]` | Episode player |
| `/my-list` | Local watchlist |
| `/legal` | Disclaimer, DMCA, privacy, terms |
| `/api/search?q=` | Cached search suggestions |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Generated metadata routes |

---

## Project structure

```
app/
  layout.tsx                 # Metadata, header, footer
  page.tsx                   # Homepage
  globals.css                # Full design system
  movies/ tv/ search/        # Browse + search
  title/[type]/[id]/         # Details
  watch/...                  # Player pages
  my-list/ legal/            # Local features + legal
  api/search/                # Autocomplete endpoint
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx
components/
  site-header.tsx search-box.tsx
  hero.tsx media-row.tsx media-card.tsx
  continue-watching-row.tsx watchlist-button.tsx
  player.tsx episode-list.tsx season-select.tsx
  cast-row.tsx pagination.tsx media-grid.tsx
lib/
  tmdb.ts                    # Server-side TMDB client + normalisers
  providers.ts               # Embed URL builders
  storage.ts                 # Watchlist + progress
  demo.ts                    # Keyless fallback catalogue
  types.ts images.ts utils.ts site.ts
```

The original design reference is kept at `SB Stream-style streaming homepage.html`.

---

## Scripts

```bash
npm run dev        # Local development (Turbopack)
npm run build      # Production build
npm run start      # Serve the production build
npm run typecheck  # TypeScript, no emit
```

---

## Production notes

- **Cache:** ISR revalidates catalogue pages every hour. Detail and watch pages are rendered on demand and cached by the Next.js data cache.
- **Images:** `image.tmdb.org` is allow-listed in `next.config.ts`; posters and backdrops use `next/image` with responsive `sizes`.
- **Security:** `nosniff`, strict referrer policy, and a restrictive permissions policy are set globally. No secrets are exposed to the client.
- **Legal:** Before launching publicly, review the terms of the embed providers and the law in your jurisdiction. The operator of a deployment is responsible for how it is used. Keep the disclaimer and TMDB attribution visible.
- **TMDB:** This product uses the TMDB API but is not endorsed or certified by TMDB.
