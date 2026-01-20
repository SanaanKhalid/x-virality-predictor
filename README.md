# X Virality Predictor

Write an X (Twitter) post, then get an **estimated** read on whether it has “viral potential” — plus a breakdown of *why* (replies vs likes, negative-signal risk, media boost, etc.).

This project is inspired by the open-sourced X For You feed architecture from [`xai-org/x-algorithm`](https://github.com/xai-org/x-algorithm).

## What this is (and isn’t)

### ✅ What it is
- A **UX-first virality sandbox** for iterating on drafts
- A **signal-level simulator** of the scoring flow (multi-action probabilities → weighted combination)
- A set of **actionable heuristics** (hooks, questions, media, link presence, etc.) that map to known engagement signals

### ⚠️ What it isn’t
- A production-grade replica of X’s ranking system
- A guaranteed predictor of **actual** views/likes/reposts

The open-sourced algorithm repo does not ship the production **weights/params**, **embedding tables**, or **end-to-end retrieval/ranking infra**, so the outputs are **illustrative** and meant to demonstrate *how* the system works, not to perfectly forecast performance.

## Features
- **Tweet composer** with toggles for video/image/thread mode
- **Virality score** (0–100) + engagement estimates (views/likes/reposts/replies)
- **Phoenix-style probabilities** (p(like), p(reply), p(repost), etc.)
- **Negative signal risk** (not interested / block / mute / report)
- **Accuracy info dialog** explaining what’s missing from the open repo + direct links to the upstream code

## Tech stack
- **TanStack Start** + **TanStack Router**
- **React**
- **Tailwind CSS**
- **Cloudflare Workers** deployment via **Wrangler**

## Local development

Install dependencies:

```bash
bun install
```

Start dev server:

```bash
bun run dev
```

Open:
- `http://localhost:3000/`

## Build

```bash
bun run build
```

## Deploy (Cloudflare Workers)

This repo includes `wrangler.jsonc`. Deploy with:

```bash
bun run deploy
```

## Project structure

```txt
src/
  routes/
    __root.tsx          # Document head + global links/meta
    index.tsx           # Main app page
  components/
    TweetComposer.tsx
    PredictionDisplay.tsx
    InsightsPanel.tsx
    AccuracyInfoDialog.tsx
    UserProfileForm.tsx
  lib/
    virality-engine.ts  # Heuristic scoring engine
public/
  manifest.json
  tanstack-circle-logo.png
  tanstack-word-logo-white.svg
```

## Upstream reference

- X For You Feed algorithm (open source): [`xai-org/x-algorithm`](https://github.com/xai-org/x-algorithm)

## Disclaimer

This project is **not affiliated with X Corp** and is provided for educational purposes.
