# BuildCivil Admin Panel Guide

**For:** New and returning website admins  
**Product:** BuildCivil Constructions public website CMS  
**Admin URL:** `/admin` on your live or local site (example: `https://yoursite.com/admin`)

This document explains how to log in, navigate the dashboard, and perform every common operation: editing pages, uploading media, publishing projects/services/blogs, managing leads, updating branding, and refreshing the live website.

---

## Table of contents

1. [Quick start](#1-quick-start)
2. [Dashboard layout](#2-dashboard-layout)
3. [Roles and permissions](#3-roles-and-permissions)
4. [Core concepts every admin should know](#4-core-concepts-every-admin-should-know)
5. [Workspace](#5-workspace)
6. [Pages (site page editors)](#6-pages-site-page-editors)
7. [Content libraries](#7-content-libraries)
8. [Leads and inboxes](#8-leads-and-inboxes)
9. [Appearance (header, footer, brand, theme)](#9-appearance-header-footer-brand-theme)
10. [SEO and tools](#10-seo-and-tools)
11. [Advanced sections](#11-advanced-sections)
12. [Common end-to-end workflows](#12-common-end-to-end-workflows)
13. [Safe editing rules](#13-safe-editing-rules)
14. [Troubleshooting](#14-troubleshooting)
15. [Where content appears on the public site](#15-where-content-appears-on-the-public-site)

---

## 1. Quick start

### 1.1 Sign in

1. Open `/admin` in your browser.
2. Enter your **admin email** and **password**.
3. Click **Sign in**.
4. You land on the **Overview** dashboard.

If login fails:

- Double-check email/password (case sensitive for password).
- Ask a **Super admin** to confirm your account is **Active**.
- If you see a configuration error, the server environment is missing database/auth settings — contact the technical owner.

### 1.2 Sign out

1. Click your **avatar / name** in the top-right of the admin shell.
2. Choose **Log out**.

### 1.3 First day checklist

| Step | Action |
|------|--------|
| 1 | Log in and open **Help & Guide** (sidebar → Workspace) |
| 2 | Confirm you can open **Media Library** and see existing files |
| 3 | Open **Overview** and note unread leads / content counts |
| 4 | Open the public website in another tab to compare before/after |
| 5 | Practice a small draft change (for example a draft blog), then delete it if it was only a test |

---

## 2. Dashboard layout

### 2.1 Sidebar navigation

The left sidebar is grouped:

| Group | Purpose |
|-------|---------|
| **Workspace** | Overview, Media, Help |
| **Pages** | Edit Home, About, Services listing, Projects listing, Contact, Renovaite |
| **Content** | Project Library, Service Library, Packages, Policy Pages, Blogs & News |
| **Leads** | Enquiries, Plan Quotes, Contact Messages, Newsletter |
| **Appearance** | Header & Footer, Theme, Logos, Fonts, Navigation |
| **SEO & Tools** | SEO Center, Google Setup, Forms, Admin Users |
| **Advanced** | Legacy pages / low-level section tools (use carefully) |

You only see sections allowed by your **role**.

### 2.2 Top bar actions

| Control | What it does |
|---------|----------------|
| **Search / ⌘K (Ctrl+K)** | Jump to any section by name |
| **Refresh** | Reload dashboard data (counts, lists) from the database |
| **Publish** | Revalidate/refresh the public website cache after content changes |
| **View site** | Open the public website |
| **Avatar menu** | Account / logout |

### 2.3 Mobile admin

On small screens, open the menu button to access the same sidebar sections.

---

## 3. Roles and permissions

Your role controls which sidebar items you can open.

| Role | Typical access |
|------|----------------|
| **Super admin** | Everything, including **Admin Users** |
| **Admin** | Almost everything except user management |
| **Content manager** | Pages, libraries, media, appearance, SEO, forms, blogs, policies |
| **Editor** | Pages, projects, services, media, SEO, policies, blogs |
| **Project manager** | Projects, services, media, SEO |
| **Media manager** | Media only (plus Overview / Help) |
| **Leads manager** | Lead inboxes and newsletter |

If a section is missing from your sidebar, your role does not include it. Ask a Super admin to change your role if needed.

---

## 4. Core concepts every admin should know

### 4.1 Slug

A **slug** is the URL piece for a page or item.

Examples:

- Project slug `courtyard-residence` → `/projects/courtyard-residence`
- Blog slug `first-blog` → `/blog/first-blog`
- Policy slug `privacy-policy` → `/privacy-policy`

**Rules:**

- Prefer lowercase letters, numbers, and hyphens.
- Keep it short and readable.
- Do not change a live slug lightly — old links will break unless you update them elsewhere.

### 4.2 Published vs draft

Most content libraries have a **Published** checkbox.

| State | Result |
|-------|--------|
| **Published = on** | Visible on the public website (after save + refresh) |
| **Published = off** | Saved in admin, hidden from public visitors |

Use draft mode while writing, then publish when ready.

### 4.3 Sort order

Lower numbers usually appear **first**. Use sort order to control card order on listing pages and package order on the homepage.

### 4.4 Media upload vs paste URL

Preferred workflow:

1. Upload in **Media Library** (or use the upload control inside an editor).
2. Add clear **alt text**.
3. Select the image with the media picker, or paste the returned URL into the field.

Uploads keep original file quality. Very large images can slow the public site — prefer reasonably sized files when possible.

### 4.5 Publish refresh (important)

Saving in admin writes to the database. The public website may still show cached content until you:

1. Click **Publish** in the top bar, **or**
2. Use the panel’s own save flow that already triggers a refresh (many panels do this automatically).

If the live site still looks old: hard-refresh the browser, confirm you are on the correct domain, then click **Publish** again.

### 4.6 Page editors vs libraries

| You want to change… | Use… |
|----------------------|------|
| Homepage hero, FAQ, team blocks, etc. | **Pages → Home** |
| About / Contact / Renovaite page copy | **Pages → that page** |
| Individual project detail + portfolio card | **Content → Project Library** |
| Individual service detail + service card | **Content → Service Library** |
| Blog articles | **Content → Blogs & News** |

---

## 5. Workspace

### 5.1 Overview

**Path:** Workspace → Overview

Use Overview to:

- See greeting + headline stats (projects, services, media, leads).
- Spot unread / new leads.
- Jump to common actions (upload media, open libraries).
- Import default starter projects/services when the library is empty (if available and connected).

**Steps:**

1. Open Overview after login.
2. Review counts and recent leads.
3. Click a shortcut card to jump into the related section.
4. Use **Refresh** if numbers look outdated.

### 5.2 Media Library

**Path:** Workspace → Media Library  
**Affects:** Images/videos available across the whole CMS

#### Upload media

1. Open **Media Library**.
2. Choose a **folder** name (examples: `home`, `projects`, `services`, `blog`, `logos`, `team`).
3. Select an image or video file.
4. Enter **alt text** (required for good SEO and accessibility).
5. Click **Upload media**.
6. Confirm the file appears in the grid.

#### Find / organize media

1. Use the **search** box to filter by name or alt text.
2. Filter by **folder** if your library is large.
3. Click an asset to copy its URL or open edit options.

#### Edit alt text

1. Select the asset.
2. Update alt text.
3. Save.

#### Delete media

1. Select the asset.
2. Choose delete and confirm.
3. Only delete unused files. Deleting a file that is still referenced by a page will leave a broken image on the site.

### 5.3 Help & Guide

**Path:** Workspace → Help & Guide

Short in-app version of this documentation. Use it as a quick refresher while working.

---

## 6. Pages (site page editors)

These editors change **page-level sections** (heroes, intros, CTAs, FAQs, etc.). They do **not** replace Project/Service/Blog libraries for individual detail pages.

### 6.1 Home

**Path:** Pages → Home  
**Public URL:** `/`

Typical steps:

1. Open **Home**.
2. Edit the section you need (hero, services intro, packages area, team, FAQ, CTA, etc.).
3. Upload/select images where image fields appear.
4. Use section visibility carefully — turning a section off hides it on the public homepage.
5. Click **Save Draft** / save.
6. Open `/` in another tab and verify.
7. Click **Publish** if the live page is still cached.

### 6.2 About / Services listing / Projects listing / Contact / Renovaite

**Paths:** Pages → About | Services | Projects | Contact | Renovaite  
**Public URLs:** `/about`, `/services`, `/projects`, `/contact`, `/renovaite`

Steps (same pattern for each):

1. Open the page editor.
2. Update hero title, copy, image, and any section blocks shown.
3. Save.
4. Preview the public URL.
5. Publish refresh if needed.

**Note:** Editing **Pages → Projects** changes the projects *listing page* content. Individual project case studies are managed in **Project Library**.

---

## 7. Content libraries

### 7.1 Project Library

**Path:** Content → Project Library  
**Public URLs:** `/projects` and `/projects/[slug]`

#### Add a new project

1. Open **Project Library**.
2. Click **New**.
3. Fill required fields:
   - **Slug** (URL)
   - **Title**
   - **Category** (Residential / Commercial / Interiors / Renovation)
   - **Card label**, **Location**, **Year**
   - **Description**
   - **Project image** (upload or pick from Media)
4. Fill detail fields as needed:
   - Overview, hero title/copy
   - Highlights (one per line)
   - Stats (`value | label` per line)
   - Process steps (`step | title | description` per line)
   - Gallery (multi-select from Media, or paste URLs)
   - SEO title / description / image
5. Set **Published** on/off.
6. Set **Sort order**.
7. Click **Save project**.
8. Open `/projects/[your-slug]` to verify.

#### Edit a project

1. Select the project from the dropdown or library list.
2. Edit fields.
3. Save.
4. Preview public page.

#### Delete a project

1. Select the project.
2. Click **Delete**, then confirm when prompted.
3. Publish refresh if the listing still shows the old card.

#### Import defaults (optional)

If the library is empty and the option is shown:

1. Click **Import default content**.
2. Review imported rows.
3. Edit and publish as needed.

### 7.2 Service Library

**Path:** Content → Service Library  
**Public URLs:** `/services` and `/services/[slug]`

#### Add / edit a service

1. Open **Service Library**.
2. Click **New** or select an existing service.
3. Fill slug, title, description, kicker, icon, image, intro.
4. Add bullets, details, stats, process, gallery, SEO fields.
5. Toggle **Published**.
6. Save.
7. Verify `/services/[slug]`.

#### Delete a service

1. Select service → **Delete** → confirm.
2. Publish refresh if needed.

### 7.3 Package Library

**Path:** Content → Package Library  
**Affects:** Construction package cards (typically on the homepage)

#### Add / edit a package

1. Open **Package Library**.
2. Create or select a package.
3. Edit name, price, features, materials, badge, sort order, published status.
4. Save.
5. Check the homepage packages section.

#### Delete a package

1. Select package → confirm delete.
2. Publish refresh if homepage still shows it.

### 7.4 Policy Pages

**Path:** Content → Policy Pages  
**Public URLs:** `/[slug]` (example: `/privacy-policy`)

#### Add a policy

1. Open **Policy Pages**.
2. Click **New**.
3. Enter:
   - **Slug** (becomes the root URL)
   - **Title**
   - **Summary**
   - **Policy content** (blank lines create new paragraphs/headings)
   - SEO title / description
4. Set visibility:
   - **Published**
   - **Show in header** (optional)
   - **Show in footer** (optional)
5. Set sort order.
6. Click **Save policy**.
7. Open `/{slug}` on the public site.

Footer **Information** links (Terms, Privacy, etc.) can also be managed under **Header & Footer** settings. Keep policy slugs consistent with those links.

### 7.5 Blogs & News

**Path:** Content → Blogs & News  
**Public URLs:** `/blog` and `/blog/[slug]`

#### Write a new blog post

1. Open **Blogs & News**.
2. Click **New**.
3. Fill:
   - **Slug** (example: `signs-its-time-to-renovate`)
   - **Title**
   - **Category** (example: Company News, Renovation, Process)
   - **Author name**
   - **Tags** (comma separated)
   - **Read time** (minutes)
   - **Cover image** (upload/select) + **alt text**
   - **Excerpt** (short card summary)
   - **Article content** (use blank lines between paragraphs; short single lines become headings)
   - SEO title / description
4. Options:
   - **Published** — show on `/blog`
   - **Featured** — highlight at the top of `/blog`
5. Click **Save post**.
6. Open `/blog` and `/blog/[slug]` to confirm.

#### Edit a blog post

1. Click the post in the right-hand list.
2. Edit fields.
3. Save.

#### Delete a blog post

1. Select the post.
2. Click **Delete**, then **Confirm delete**.
3. The public blog listing refreshes automatically via publish refresh in this panel.

---

## 8. Leads and inboxes

All lead sections follow a similar pattern: open inbox → review submission → update status → optionally delete spam.

### 8.1 Service Enquiries

**Path:** Leads → Service Enquiries  
**Source:** Homepage / service enquiry forms

Steps:

1. Open the list.
2. Click a lead to read details (name, email, phone, service, notes).
3. Update **status** (for example new → read → replied → closed).
4. Delete only spam/test entries.

### 8.2 Plan Quotes

**Path:** Leads → Plan Quotes  
**Source:** Construction package quote forms

Same workflow as enquiries: review → update status → delete spam only.

### 8.3 Contact Messages

**Path:** Leads → Contact Messages  
**Source:** Contact page form

Review messages, mark progress with status, reply outside the panel (email/phone), then update status.

### 8.4 Newsletter

**Path:** Leads → Newsletter  
**Source:** Footer newsletter signup

Use this list to export/follow up with subscribers. Do not delete real subscribers unless requested/unsubscribed/spam.

---

## 9. Appearance (header, footer, brand, theme)

### 9.1 Header & Footer

**Path:** Appearance → Header & Footer  
**Affects:** Global header brand area and footer columns/links/newsletter text

Typical tasks:

1. Open **Header & Footer**.
2. Edit header brand text / CTA if shown.
3. Edit footer company copy, contact rows, social links.
4. Edit footer link columns:
   - Company links
   - Information links (Terms, Privacy, Cancellation, Referral, FAQs, etc.)
   - Resources links (Blogs & News → `/blog`, Careers → `/careers`)
5. Reorder links by drag handles where available.
6. Toggle link visibility.
7. **Save settings**.
8. Check header/footer on the public site.
9. Publish refresh if needed.

### 9.2 Navigation

**Path:** Appearance → Navigation  
**Affects:** Header menu links and some footer link locations stored in navigation records

Steps:

1. Open **Navigation**.
2. Add a link: label, href, location (header / footer), visibility, sort order.
3. Edit or hide existing links.
4. Delete unused links carefully.
5. Save / publish.
6. Verify desktop header and mobile menu.

### 9.3 Logos & Brand

**Path:** Appearance → Logos & Brand

1. Upload/select **header logo**, optional **footer logo**, **favicon**, social share image.
2. Adjust logo width settings if provided.
3. Save brand.
4. Hard-refresh the public site to confirm logos.

### 9.4 Theme Studio / Fonts

**Paths:** Appearance → Theme Studio | Fonts

Use these for site-wide colors, button styles, and typography tokens.

1. Change only what you understand.
2. Save.
3. Preview multiple public pages (home, services, contact).
4. Revert carefully if the look breaks.

Prefer small, intentional brand updates over large experimental changes on a live site.

---

## 10. SEO and tools

### 10.1 SEO Center

**Path:** SEO & Tools → SEO Center

1. Choose a target (page / project / service).
2. Enter keywords / location / tone as prompted.
3. Generate or edit draft title and description.
4. Apply/save draft metadata.
5. Publish refresh.
6. Verify page title/description in browser tab / page source.

### 10.2 Google Setup

**Path:** SEO & Tools → Google Setup

Configure:

- Analytics Measurement ID
- Tag Manager ID
- Search Console verification
- Domain / site URL details used for sitemap/robots

Save, then verify in Google tools. Publish refresh updates sitemap/robots related caches when configured.

### 10.3 Forms & Fields

**Path:** SEO & Tools → Forms & Fields

Edit public form labels, placeholders, options, submit button text, success/error messages.

1. Select the form definition.
2. Edit fields carefully (do not remove required technical field keys unless you know the impact).
3. Save.
4. Test the live form submission once.

### 10.4 Admin Users (Super admin only)

**Path:** SEO & Tools → Admin Users

#### Invite / create a user

1. Click new user / clear the form.
2. Enter email, display name.
3. Choose **role**.
4. Set status to **Active**.
5. Set a password (**minimum 8 characters**).
6. Click **Create user**.
7. Share credentials securely (not over public chat if possible).

#### Change role or disable access

1. Select the user.
2. Change role or set status to **Disabled**.
3. Save.

#### Reset password

1. Select the user.
2. Enter a new password (leave blank to keep the current one).
3. Save.

#### Delete a user

1. Select user → Delete → confirm.
2. Prefer **Disabled** over delete when you may need the account again.

---

## 11. Advanced sections

**Path:** Advanced → Legacy Pages | Sections Builder

These are lower-level CMS tools. Prefer the normal **Pages** editors and content libraries whenever possible.

Use Advanced only if:

- A technical teammate asked you to, or
- You understand that section rows override page content.

Incorrect edits here can break public layouts. When unsure, stop and ask.

---

## 12. Common end-to-end workflows

### Workflow A — Publish a new project with gallery

1. Upload project photos in **Media Library** (folder `projects`).
2. Open **Project Library** → **New**.
3. Fill slug/title/category/description.
4. Set main project image.
5. Use **Select multiple images** for the gallery.
6. Keep **Published** off while drafting.
7. Save.
8. Preview `/projects/[slug]` (may 404 while unpublished depending on filters — publish to verify live).
9. Turn **Published** on → Save.
10. Click **Publish** in top bar if listing is stale.
11. Confirm card on `/projects` and detail page.

### Workflow B — Publish a blog article

1. Upload cover image to Media (folder `blog`) with alt text.
2. Open **Blogs & News** → **New**.
3. Write title, slug, excerpt, content.
4. Attach cover image.
5. Optionally mark **Featured**.
6. Save with **Published** on.
7. Open `/blog` and the article URL.
8. Confirm footer **Resources → Blogs & News** still points to `/blog`.

### Workflow C — Update homepage hero image

1. Upload image in Media (folder `home`).
2. Open **Pages → Home**.
3. Find hero image field → pick/upload image.
4. Save.
5. Open `/` and hard-refresh.
6. Publish refresh if needed.

### Workflow D — Add a footer Information link

1. Open **Appearance → Header & Footer**.
2. Find **Information** links.
3. Add label + href (example: Cancellation Policy → `/cancellation-policy`).
4. If the policy page does not exist yet, create it in **Policy Pages** with the same slug.
5. Save settings.
6. Check footer on any public page.

### Workflow E — Handle a new lead

1. Open Overview or the relevant Leads inbox.
2. Read contact details.
3. Call/email the customer outside the admin panel.
4. Update lead status to reflect progress.
5. Do not delete real leads.

### Workflow F — Change header menu (Blog / Careers)

1. Open **Appearance → Navigation** (or Header & Footer if links are managed there).
2. Add/edit link label and href (`/blog`, `/careers`).
3. Set visible + sort order.
4. Save and publish refresh.
5. Check desktop nav and mobile menu.

---

## 13. Safe editing rules

1. **Draft first** — keep Published off until content and images are ready.
2. **Never delete real customer leads** unless spam/test.
3. **Do not rename live slugs** without a plan for old URLs.
4. **Always add alt text** for images.
5. **Prefer Media Library** over random external image links when possible.
6. **Preview before announcing** — open the public URL after every important save.
7. **Use Publish refresh** when the live page looks outdated.
8. **Avoid Advanced tools** unless you know what they do.
9. **Test forms** after editing Forms & Fields.
10. **Ask Super admin** before creating/deleting admin users or changing theme tokens broadly.

---

## 14. Troubleshooting

| Problem | What to try |
|---------|-------------|
| Cannot log in | Check email/password; confirm account is Active; ask Super admin |
| Sidebar section missing | Your role does not include it |
| Save button disabled / “not connected” | Database connection issue — contact technical owner |
| Saved but public page unchanged | Click **Publish**, hard-refresh browser, confirm correct domain |
| Image missing on site | Check Media URL still exists; re-select image; confirm Published content saved |
| Upload fails | Re-login (session may have expired); check file type; try smaller/valid image |
| Blog/project not on listing | Confirm **Published** is on; check sort order/filters; refresh public cache |
| Wrong footer/header links | Edit Header & Footer and/or Navigation; save; publish refresh |
| Form not submitting | Check Forms & Fields; test required fields; ask technical owner if API errors appear |

---

## 15. Where content appears on the public site

| Admin section | Public destination |
|---------------|--------------------|
| Pages → Home | `/` |
| Pages → About | `/about` |
| Pages → Services | `/services` |
| Pages → Projects | `/projects` |
| Pages → Contact | `/contact` |
| Pages → Renovaite | `/renovaite` |
| Project Library | `/projects`, `/projects/[slug]` |
| Service Library | `/services`, `/services/[slug]` |
| Package Library | Homepage packages area |
| Policy Pages | `/[slug]` |
| Blogs & News | `/blog`, `/blog/[slug]` |
| Header & Footer / Navigation | Sitewide header + footer |
| Logos & Brand | Header/footer logos, favicon |
| Theme / Fonts | Sitewide look |
| SEO Center / Google Setup | Metadata, analytics, verification |
| Forms & Fields | Public form labels/messages |
| Leads inboxes | Not public (admin-only) |
| Careers page | `/careers` (static public page; linked from footer/nav) |

---

## Appendix A — Recommended daily admin routine

1. Log in → check **Overview** for new leads.
2. Process **Enquiries / Messages / Quotes**.
3. Upload any new media needed for the day.
4. Make content edits in the correct library/page editor.
5. Preview public URLs.
6. Click **Publish** if anything looks cached.
7. Log out when finished on a shared computer.

## Appendix B — Writing tips for blogs and policies

- Start with a clear title and short excerpt.
- Use short paragraphs.
- Put a blank line between sections.
- A short single line after a blank line often becomes a section heading.
- Include a cover image with meaningful alt text.
- Fill SEO title/description for better search results.

## Appendix C — Related in-app help

Inside the dashboard, open:

**Workspace → Help & Guide**

for a condensed version of these steps while you work.

---

*Document version: 1.0*  
*Applies to the BuildCivil Next.js admin CMS (pages, libraries, media, leads, blogs, appearance, SEO).*
