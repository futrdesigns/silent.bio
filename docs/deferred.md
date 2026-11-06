# SILENT.BIO — Deferred Items & Architectural Decisions

This document tracks items intentionally scoped, deferred, or scheduled for subsequent build stages with explicit rationale.

| Item | Reason | Scheduled Target |
| :--- | :--- | :--- |
| Cloudflare Turnstile Live Secret Keys | Optional anti-bot captcha; gracefully operates in development bypass mode when keys are unset. | Stage 10 (Production hardening) |
| Live Spotify OAuth Token Handshake | oEmbed fallback works without any developer keys; OAuth connection adds optional user-synced playback. | Stage 7 (Music & Integrations) |
| Local In-Memory Fallback vs Redis | App operates seamlessly without Upstash keys for instant zero-dependency local dev. | Configured in Stage 1 & hardened in Stage 10 |
