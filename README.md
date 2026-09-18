# AEGIS AI — Governance-Native Game Development Agent

AEGIS turns a one-line game idea into a verified, engine-ready game package
(Unity / Unreal / Web) using a multi-agent generation pipeline with a
governance layer that checks and repairs every generated asset before it
ships.

This repo is a full-stack monorepo, built to be **user-simple, technically
API-first**: every piece of "governance", "agent orchestration", etc. lives
behind a clean REST API on the backend, so the frontend only ever has to
render simple state (`idle → running → done`).

```
ageis2/
├── frontend/     React 18 + Vite + TypeScript + Tailwind (mobile-first, PC responsive)
├── backend/      Hono, deployed as a Cloudflare Worker (KV + D1 + R2 ready)
└── .github/workflows/deploy.yml   CI/CD → Cloudflare via GitHub Actions
```

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, i18next |
| Backend | Hono (Cloudflare Workers runtime) |
| Auth | Google Identity Services (Sign in with Google) |
| Storage (optional, for real deployments) | Cloudflare KV (job status), D1 (users/projects), R2 (generated packages) |
| AI providers (pluggable) | Anthropic / OpenAI / OpenRouter — swappable behind `backend/src/lib/pipeline.ts` |
| i18n | English (default), 한국어, 中文, 日本語 |

## Why this structure

- **User-first, API-behind-the-scenes**: the UI never shows the user "agents",
  "SCNL", or governance jargon by default — it just shows *Input → Process →
  Output* with a progress list and PASS/FAIL badges, matching the mockups.
  All of the actual orchestration, validation, and provider-switching logic
  is isolated in `backend/src/lib/`, reachable only through
  `POST /api/generate`, `GET /api/generate/:id`, `GET /api/generate/:id/package`.
- **Mobile-first**: every screen in `frontend/src/components` is built at a
  375px viewport first, then expands via Tailwind's `sm:` / `lg:` breakpoints
  into the 3-column desktop layout shown in the reference mockups.
- **i18n**: `frontend/src/i18n/locales/{en,ko,zh,ja}.json`. English is the
  fallback/default locale; the language switcher in the header persists the
  choice to `localStorage`.

## Local development

Requires Node 18+.

```bash
# from repo root
npm install --workspaces

# terminal 1 — backend (Hono on Cloudflare's local runtime)
cd backend
npm run dev      # http://localhost:8787

# terminal 2 — frontend
cd frontend
npm run dev      # http://localhost:5173 (proxies /api to :8787)
```

Copy `backend/.dev.vars.example` to `backend/.dev.vars` and fill in any keys
you have (all are optional — without them the pipeline runs in **mock mode**
and still produces a full, believable demo run, which is what you want for a
hackathon judge to click through in 30 seconds).

```
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
ANTHROPIC_API_KEY=            # optional — enables real story/NPC generation
OPENAI_API_KEY=               # optional — alternate provider
```

For the frontend, copy `frontend/.env.example` to `frontend/.env`:

```
VITE_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
VITE_API_BASE=http://localhost:8787
```

## Deploying to Cloudflare

This project deploys as **one Worker** that serves the API (`/api/*`) and the
built frontend as static assets (via Wrangler's `[assets]` binding), so you
only manage a single Cloudflare service.

### Option A — deploy from your machine

```bash
cd frontend && npm run build        # outputs to frontend/dist
cd ../backend
npx wrangler login
npx wrangler deploy
```

### Option B — GitHub Actions (recommended, matches this repo)

1. Push this code to `https://github.com/softkid/ageis2` (this scaffold
   doesn't push on its own — see "Connecting this repo" below).
2. In the GitHub repo settings → Secrets and variables → Actions, add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `GOOGLE_CLIENT_ID` (optional, for build-time injection)
3. Push to `main` — `.github/workflows/deploy.yml` builds the frontend,
   copies it into `backend/public`, and runs `wrangler deploy`.

### Cloudflare resources (optional, for persistence beyond mock mode)

```bash
npx wrangler kv namespace create AEGIS_JOBS
npx wrangler d1 create aegis-db
npx wrangler r2 bucket create aegis-packages
```

Then fill the resulting IDs into `backend/wrangler.toml`.

## Connecting this repo to github.com/softkid/ageis2

```bash
git init
git remote add origin https://github.com/softkid/ageis2.git
git add .
git commit -m "AEGIS AI: initial scaffold (React/Hono, i18n, governance pipeline)"
git branch -M main
git push -u origin main
```

## What's mocked vs. real in this scaffold

- ✅ Real: full request/response flow, job polling, governance rule engine
  (deterministic checks against the generated content — not a stub that
  always says PASS), i18n, Google Sign-In UI, responsive layout, downloadable
  package manifest + zip stub.
- 🧪 Mock by default, pluggable: the actual story/NPC/asset/code text is
  produced by a template-based generator (`backend/src/lib/pipeline.ts`) so
  the whole thing works with zero API keys. Add `ANTHROPIC_API_KEY` to switch
  `pipeline.ts`'s `generateWithAI()` to call a real model — one function to
  edit, nothing else in the app needs to change.
- 🚧 Not included: real Unity/Unreal project compilation. The "engine
  packages" are structured, downloadable code/config bundles (scripts, JSON
  data, asset manifests) meant to be dropped into a project — not compiled
  binaries.
