# SILENT.BIO — Production Free-Tier Limits & Hard Constraints

Every service in SILENT.BIO's production architecture runs within free allowances. No paid credit cards or subscription paywalls are required.

## 1. Supabase (Database, Auth, Storage, Realtime)
- **Database Storage:** 500 MB (PostgreSQL with indexes and RLS policies).
  - *Strategy:* Partitioned/rollup analytics table. Clean-up tasks purge unaggregated raw events older than 30 days.
- **Monthly Active Users (MAU):** 50,000 MAU.
  - *Strategy:* Generous limit. Session tokens refresh automatically.
- **Storage:** 1 GB total.
  - *Strategy:* Max avatar size: 2 MB. Max banner size: 4 MB. Max audio file size: 8 MB. Client-side image WebP compression reduces storage usage by 70%.
- **Concurrent Realtime Connections:** 200 concurrent.
  - *Strategy:* Used for live visitor presence on dashboard and active profile counter. Auto-disconnect when tab is backgrounded.

## 2. Upstash Redis (Distributed Rate Limiting)
- **Commands / Day:** 10,000 commands/day.
- **Storage:** 256 MB.
- *Fallback Strategy:* If `UPSTASH_REDIS_REST_URL` is omitted or quota is reached, the application falls back transparently to an in-memory sliding-window token bucket limiter (`lib/security/rate-limit.ts`).

## 3. Vercel Hosting & Cloudflare Edge
- **Vercel Bandwidth:** 100 GB / month.
- **Cloudflare Edge Cache:** Free tier with unlimited edge bandwidth.
  - *Strategy:* Public profile paths (`/{username}`) are served with HTTP cache headers (`s-maxage=60, stale-while-revalidate=300`). Profile updates trigger instant on-demand cache revalidation via Server Actions.

## 4. External Free APIs
- **Lanyard API (`api.lanyard.rest`):** Completely free and open-source Discord presence relay.
- **GitHub REST API:** 60 requests/hr unauthenticated; response cached server-side for 15 minutes.
- **Open-Meteo (`api.open-meteo.com`):** Open-source weather API; 10,000 requests/day, requires no API key.
- **Spotify Web Player:** oEmbed public endpoints requiring zero authentication tokens for widget rendering.

---
*No feature in SILENT.BIO will ever be degraded or locked behind payment.*
