# Build Civil Monorepo

Nx + pnpm workspace for the Build Civil product family.

| App | Path | Stack | Intended host |
| --- | --- | --- | --- |
| **build-civil-code** (entry) | `apps/build-civil-code` | Next.js 15 | `buildcivil.in` (apex) |
| **admin** | `apps/admin` | Next.js 15 | `admin.buildcivil.in` |
| **ai-cost-estimator** | `apps/ai-cost-estimator` | Next.js 15 | `ai.buildcivil.in` |
| **renovaite** | `apps/renovaite` | Next.js 14 + Prismic | `renovaite.buildcivil.in` |
| **roomify** | `apps/roomify` | React Router 7 + Vite | `roomify.buildcivil.in` |

`admin` is its own standalone app and Vercel deployment — not a route inside `build-civil-code`. It shares the CMS data-access layer (Supabase reads/writes, page/settings/catalog types) with the public site through the `@buildcivil/cms` workspace package under `packages/cms`, so both apps read and write the same content without duplicating that code. "Publish" actions in the admin UI refresh the public site's cache over HTTP (see [Cross-app links](#cross-app-links)) since the two are separate deployments.

## Prerequisites

- Node.js 20+
- pnpm 10+

## Setup

```bash
pnpm install
```

Copy env files per app:

```bash
cp apps/build-civil-code/.env.example apps/build-civil-code/.env.local
cp apps/admin/.env.example apps/admin/.env.local
cp apps/ai-cost-estimator/.env.example apps/ai-cost-estimator/.env.local
cp apps/roomify/.env.example apps/roomify/.env
```

`build-civil-code` and `admin` share one Supabase project (there's no separate dev database) — both `.env.local` files need the same `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`. Be careful with test edits through a locally-run admin panel; they write to the live database.

## Develop

```bash
pnpm dev:bcc         # build-civil-code   → http://localhost:3000
pnpm dev:admin       # admin              → http://localhost:3003
pnpm dev:ai          # ai-cost-estimator  → http://localhost:3002
pnpm dev:renovaite   # renovaite          → http://localhost:3000 (use -p 3001 if needed)
pnpm dev:roomify     # roomify            → http://localhost:5173
```

## Build

```bash
pnpm build              # all apps
pnpm build:bcc
pnpm build:admin
pnpm build:ai
pnpm build:renovaite
pnpm build:roomify
```

## Project graph

```bash
pnpm graph
```

## Notes

- Package manager is **pnpm** (workspaces). Do not use npm/yarn at the root.
- Main site redirects `/ai-cost-estimator` and `/buildcivil-ai` to `NEXT_PUBLIC_AI_COST_ESTIMATOR_URL` (default `https://ai.buildcivil.in`).
- The header's "AI APP" and "RENOVAITE" links point straight at those subdomains ([lib/ai-cost-estimator-url.ts](apps/build-civil-code/lib/ai-cost-estimator-url.ts), [lib/renovaite-url.ts](apps/build-civil-code/lib/renovaite-url.ts)) — override with `NEXT_PUBLIC_AI_COST_ESTIMATOR_URL` / `NEXT_PUBLIC_RENOVAITE_URL` per environment.
- **renovaite** is still on React 18 / Next 14 while the other apps use React 19. Its Next config temporarily sets `typescript.ignoreBuildErrors` to avoid dual `@types/react` conflicts. Plan a follow-up upgrade of renovaite to React 19 / Next 15, then remove that flag.

## Deploying each app to its own subdomain (Vercel)

Each app is deployed as its **own Vercel project** pointed at this same GitHub repo, with a different "Root Directory". Vercel auto-detects the framework per app and runs `pnpm install` at the repo root before building the selected app, so the pnpm workspace resolves normally.

For each of `build-civil-code`, `admin`, `ai-cost-estimator`, `renovaite`, `roomify` — **five separate Vercel projects**, all pointed at this one repo:

1. Vercel dashboard → **Add New… → Project** → import `buildcivil/buildcivil`.
2. **Root Directory**: `apps/<app-name>` (e.g. `apps/admin`). Click "Edit" next to Root Directory to set it before the first deploy.
3. Framework preset: Next.js is auto-detected for build-civil-code/admin/ai-cost-estimator/renovaite; roomify (React Router + `@vercel/react-router`) is auto-detected as React Router.
4. Copy that app's env vars from its `.env.example` into the Vercel project's Environment Variables.
5. Deploy. Vercel gives you a `*.vercel.app` preview URL first — confirm it builds before wiring the custom domain.
6. Project **Settings → Domains** → add the subdomain (`admin.buildcivil.in`, `ai.buildcivil.in`, `renovaite.buildcivil.in`, `roomify.buildcivil.in`) or, for `build-civil-code`, the apex `buildcivil.in`.

Then at your DNS provider for `buildcivil.in`, add a CNAME record per subdomain pointing at `cname.vercel-dns.com` (Vercel shows the exact record to add once you attach the domain in step 6 — it also verifies automatically). The apex `buildcivil.in` typically needs an A record to Vercel's IP instead of a CNAME; Vercel's domain screen tells you which.

### Cross-app links

- Main site → AI estimator / Renovaite: controlled by `NEXT_PUBLIC_AI_COST_ESTIMATOR_URL` / `NEXT_PUBLIC_RENOVAITE_URL` on the `build-civil-code` project.
- AI estimator → main site: `NEXT_PUBLIC_MAIN_SITE_URL` on the `ai-cost-estimator` project (defaults to `https://buildcivil.in`).
- Renovaite's nav/footer links are managed in its Prismic content, not code — add a "Back to BuildCivil" link there once its subdomain is live.
- Roomify has no back-link to the main site yet; add one in its header if wanted.
- **Admin → main site publish**: clicking "Publish" in the admin dashboard calls `admin`'s own `/api/admin/revalidate`, which relays to `build-civil-code`'s `/api/revalidate` over HTTPS ([apps/admin/lib/publish-relay.ts](apps/admin/lib/publish-relay.ts)) to refresh the public site's cached pages — since they're separate deployments, one can't revalidate the other's cache directly. Both projects need the **same** `REVALIDATE_SECRET` value, and `admin`'s `PUBLIC_SITE_URL` must point at the deployed `build-civil-code` URL (default `https://buildcivil.in`).
