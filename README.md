# Build Civil Monorepo

Nx + pnpm workspace for the Build Civil product family.

| App | Path | Stack | Intended host |
| --- | --- | --- | --- |
| **build-civil-code** (entry) | `apps/build-civil-code` | Next.js 15 | apex / main domain |
| **renovaite** | `apps/renovaite` | Next.js 14 + Prismic | subdomain |
| **roomify** | `apps/roomify` | React Router 7 + Vite | subdomain |

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
cp apps/roomify/.env.example apps/roomify/.env
```

## Develop

```bash
pnpm dev:bcc         # build-civil-code  → http://localhost:3000
pnpm dev:renovaite   # renovaite         → http://localhost:3000
pnpm dev:roomify     # roomify           → http://localhost:5173
```

Run only one Next app at a time on port 3000, or pass a port:

```bash
pnpm --filter @buildcivil/renovaite exec next dev -p 3001
```

## Build

```bash
pnpm build              # all apps
pnpm build:bcc
pnpm build:renovaite
pnpm build:roomify
```

## Project graph

```bash
pnpm graph
```

## Notes

- Package manager is **pnpm** (workspaces). Do not use npm/yarn at the root.
- **renovaite** is still on React 18 / Next 14 while the other apps use React 19. Its Next config temporarily sets `typescript.ignoreBuildErrors` to avoid dual `@types/react` conflicts. Plan a follow-up upgrade of renovaite to React 19 / Next 15, then remove that flag.
- Subdomain routing / Vercel project wiring for `renovaite` and `roomify` is a separate deployment step on top of this monorepo layout.
