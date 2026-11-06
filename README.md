# SILENT.BIO

> **Your identity. Your space. Your rules.**
> A free, open, highly customisable profile / bio-link platform in the category of guns.lol, fakecrime.bio, and alias.rip — built without paywalls, bloat, or compromises.

---

## 1. Core Principles

- **100% Free Forever:** Zero tiers, zero subscriptions, zero locked CSS or features.
- **Calm, High-Craft Aesthetics:** Rooted in Emil Kowalski motion constraints and a strict 4px design token system (`#08090B` bg, `#101114` surface, `#A5A5FF` accent).
- **Extreme Performance:** 95+ Lighthouse target, frame-budgeted particle canvas, and instantaneous optimistic live editing.
- **Privacy First:** Zero tracking cookies, rotating daily salted visitor hashes, zero raw IP retention.

---

## 2. Tech Stack

- **Framework:** Next.js (App Router), React 19, TypeScript strict mode.
- **Styling & Tokens:** Tailwind CSS, Radix UI primitives, Lucide icons.
- **State & Motion:** Zustand with full undo/redo & history stack, Motion (Framer Motion).
- **Database & RLS:** PostgreSQL via Supabase with row-level security policies on every table.
- **Analytics & Cache:** Daily rollups with Upstash Redis and in-memory sliding window fallback.

---

## 3. Getting Started

### Prerequisites
- Node.js 18+ or 20+
- pnpm 9+ or 12+

### Installation & Run

```bash
# 1. Clone & Enter
git clone https://github.com/your-org/silent-bio.git
cd silent-bio

# 2. Install dependencies
pnpm install

# 3. Environment configuration
cp .env.example .env.local

# 4. Run tests
pnpm test

# 5. Start dev server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/editor](http://localhost:3000/editor) to launch the fullscreen live profile editor.

---

## 4. Verification Suite

```bash
# Type check
pnpm type-check

# Unit & Security test suite
pnpm test

# Production build test
pnpm build
```

---
*SILENT.BIO — Stay private. Stand out.*
