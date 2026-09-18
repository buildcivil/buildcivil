# BuildCivil AI Cost Estimator

Standalone Next.js app extracted from the main Build Civil site.

## Develop

```bash
# from monorepo root
pnpm dev:ai
# → http://localhost:3002
```

## Env

```bash
cp apps/ai-cost-estimator/.env.example apps/ai-cost-estimator/.env.local
```

Set at least one LLM key (`LLM_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY`). Without a key the app still runs using deterministic fallback estimates.

Optional: `NEXT_PUBLIC_MAIN_SITE_URL` (defaults to `https://buildcivil.in`) for the header link back to the main site.
