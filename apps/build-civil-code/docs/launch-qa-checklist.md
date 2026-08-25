# BuildCivil Launch QA Checklist

Use this checklist after every Vercel deployment before sharing the site for review.

## Public Website

- Home page loads and hero enquiry popup submits.
- About page loads with all sections visible.
- Services page loads and each service detail page opens.
- Projects page filters work and each project detail page opens.
- Contact page form submits and shows a success state.
- Footer newsletter form submits and shows a success state.
- Header/footer links work on desktop and mobile.
- No horizontal overflow at 320px, 390px, 768px, 1366px, and 1920px.

## Admin Dashboard

- `/admin` shows login when signed out.
- DB-backed admin login works with an active `admin_users` row.
- Overview shows counts, data status, lead cards, and content shortcuts.
- Project Library can add, edit, delete, and preview projects.
- Service Library can add, edit, delete, and preview services.
- Package Library can edit packages and materials.
- Contact Messages shows submitted contact forms and status changes work.
- Service Enquiries shows hero/service enquiries and status changes work.
- Plan Quotes shows package quote requests and status changes work.
- Newsletter shows subscribers and status changes work.
- Media Library uploads, stores metadata, and media picker can select assets.
- Publish refresh updates public pages after saves.

## Vercel And Supabase

- Vercel env vars are present: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`.
- `BLOB_READ_WRITE_TOKEN` is present if Vercel Blob uploads are enabled.
- Supabase service-role key is not exposed to browser/client bundles.
- Public direct reads/writes are blocked by RLS except intended form APIs.
- Vercel Web Analytics is enabled in the Vercel dashboard.

## Known Manual Checks

- Supabase Auth leaked password protection warning is manual because admin login is custom DB-backed for launch v1.
- Replace final stock/generic project photos with real BuildCivil photos when available.
