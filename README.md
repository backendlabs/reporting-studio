# Agency Reporting Dashboard

A client reporting dashboard — **Next.js, Tailwind CSS, deploys on Vercel**.
Password-gated client view with three report sections plus a notes tab:
Google Analytics (sessions, top pages, traffic acquisition), Search Console
(clicks, impressions, CTR, avg. position), an Indexing report (sitemap
coverage, pages getting clicks, a live per-URL index check), and Monthly
Notes (Completed / Planned / TL;DR). CSV and PDF export throughout.

**Runs on sample data out of the box** — no setup required to see it work.
Connect a real Google service account (below) and it switches to live data
automatically. A small "Live data" / "Sample data" indicator in the header
always shows which one you're looking at.

## Try it locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000. Password is in \`lib/auth.ts\` (\`SAMPLE_CLIENT\`).

## Deploy

1. Push to a GitHub repo, then import it at vercel.com/new — Vercel
   auto-detects Next.js, no config needed.
2. Add the environment variables below in Vercel's project settings if
   you're connecting real data (Settings → Environment Variables).

## Connecting real GA4 + Search Console data

**1. Create a Google Cloud service account**
- In Google Cloud Console, create (or reuse) a project.
- Enable the **Google Analytics Data API** and **Google Search Console API**.
- IAM & Admin → Service Accounts → Create service account. No roles needed
  at the project level.
- Open the service account → Keys → Add key → JSON. Download it — this
  file has the email and private key you'll need.

**2. Grant it access to the client's data**
- **GA4**: Admin → Property Access Management → add the service account's
  email as a **Viewer**.
- **Search Console**: Settings → Users and permissions → add the service
  account's email as a **Full user**.

**3. Set environment variables** (locally in \`.env.local\`, or in Vercel's
project settings):

\`\`\`
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GA4_PROPERTY_ID=438083518
GSC_SITE_URL=https://pinnaclepursuitseo.com/
\`\`\`

That's it — the dashboard detects these automatically and switches from
sample to live data. No code changes needed.

## What's real vs. a known limitation

Everything is wired to live Google APIs except one thing worth knowing
about: Google's public API does **not** expose the full "Page Indexing"
report you see in the Search Console UI (indexed / not indexed / reason,
in bulk). What the API *does* expose, and what this dashboard uses:

- **Sitemap-level submitted vs. indexed counts** (bulk, real-time) — the
  top-line numbers on the Indexing tab.
- **A live per-URL check** ("Check a Specific URL") using the URL
  Inspection API — accurate and real, but one URL at a time, and Google
  rate-limits it (a few hundred checks/day depending on the property). Not
  meant for bulk auditing.
- **Pages getting clicks / top queries** — full bulk data, no limitation.

If a client ever needs true bulk indexed/not-indexed status for every URL,
that requires a different data source (e.g. a crawler cross-referenced
against Search Console), which is a separate scope from this dashboard.

## Adding a new client (current, manual process)

This template is currently wired for one client (env vars above). To add
another:

1. Duplicate the deployment (new Vercel project from the same repo, or a
   \`/view/[slug]\` route reading per-client config from Supabase — see
   "Where this goes next").
2. Set that client's own \`GA4_PROPERTY_ID\` and \`GSC_SITE_URL\`, and get
   the service account added to their GA4/Search Console.
3. Update \`SAMPLE_CLIENT\` in \`lib/auth.ts\` with their name and password.

## Where this goes next (multi-client, no manual redeploys)

- **Supabase**: \`clients\` table (name, slug, password hash, GA4 property
  ID, GSC site URL), so one deployment serves every client at
  \`/view/[slug]\` instead of duplicating the whole app per client.
- **Auth**: move the password check server-side (Supabase Route Handler +
  httpOnly cookie) instead of the current client-side check.
- **Scheduled sync**: Vercel Cron pulling GA4/GSC into Supabase daily,
  so the dashboard reads from Supabase instead of calling Google's APIs
  on every page load — faster, and avoids rate limits entirely.

None of this changes the UI you're looking at now — same components, fed
by Supabase instead of live API calls once it's in place.

## Operating it (SOP)

- **Add a new client**: see "Adding a new client" above.
- **Update monthly notes**: Monthly Notes tab, type and save.
- **Export a report**: Export button, top right → CSV or PDF.
- **Check if a page is indexed**: Indexing tab → paste the URL → Check.

A fuller, VA-friendly SOP with screenshots is produced once the
multi-client (Supabase-backed) version is in place.
