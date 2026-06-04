# Product Tracker — Product Requirements Document (PRD)

> **Status:** Draft v0.2 · **Owner:** @xianjinseow92 · **Last updated:** 2026-06-04
>
> This is a living document. We're shaping it together — comments, edits, and
> "no, I actually want X" are all expected. Nothing here is final until we agree
> on the MVP scope (Section 12).
>
> **v0.2 changelog:** New dedicated repo confirmed · DB = **Supabase** · dashboard
> **in MVP** · per-watch **configurable cadence** · added initial target sites
> (Section 4a) and Shopify variant-aware adapter (Section 7).

---

## 1. Summary

A self-hosted **product watcher** that monitors products on arbitrary e-commerce
sites and sends a **Telegram** message when something changes — specifically
**price** and **stock/availability**. It must be **easily configurable** (add a
new product or site without rewriting code) and **easy to scale** (go from 5
watches to 500 without re-architecting).

This is the spiritual successor to the existing **`kukoedc-listener`** repo,
generalized from one hardcoded site to "any site," with a dashboard for managing
what's watched.

---

## 2. Goals & Non-Goals

### Goals
- Watch a list of product URLs and detect changes to **price** and **stock**.
- Notify the user via **Telegram** (reusing the existing bot/credentials).
- Add new products and new sites via **configuration**, not code changes.
- Run cheaply on a **schedule** (GitHub Actions cron) — no always-on server to babysit.
- Provide a **web dashboard** to manage watches and view price/stock history.
- Scale to hundreds of watched products without a redesign.

### Non-Goals (for now)
- Not a price-comparison engine across retailers (single-URL watching only at first).
- Not auto-purchasing / checkout automation.
- Not defeating aggressive anti-bot protection (Cloudflare challenges, CAPTCHAs).
  We support sites we *can* fetch; hard targets are out of MVP scope.
- Not real-time / sub-minute monitoring in the MVP (cron granularity is minutes).
- No multi-user accounts at first — single user (you).

---

## 3. Users & Use Cases

**Primary user:** you (single operator).

**Representative use cases:**
- "Tell me the moment this sold-out item is back in stock."
- "Tell me if this product drops below $X."
- "Tell me whenever the price of any item on my watchlist changes."

---

## 4. Key Decisions (agreed)

| Decision | Choice |
|---|---|
| **Hosting / scheduler** | **GitHub Actions cron** (free, no server) |
| **What triggers an alert** | **Price changes** + **Stock / availability** |
| **How sites are read** | **Per-site config** (selectors/rules per site) + generic fallback |
| **How the watchlist is managed** | **Web UI / dashboard** |
| **Notifications** | **Telegram** (reuse `kukoedc-listener` bot token + chat ID) |

**Resolved follow-ups:**
- **Repo:** brand-new dedicated repo (e.g. `product-tracker`); port only the
  Telegram credentials/snippet from `kukoedc-listener`.
- **Database:** **Supabase** (managed Postgres + auto REST API + auth) — chosen
  because it backs the dashboard with minimal backend code.
- **Dashboard:** **in MVP** (not deferred).
- **Cadence:** **configurable per watch** (see Section 11 for the cron pattern).

### The one tension to resolve
GitHub Actions is *only the scheduled checker*. A **dashboard** needs (a) a place
to be hosted and (b) a shared datastore that both the dashboard and the cron job
can read/write. So the architecture introduces a small **hosted database** in the
middle. This keeps "cron does the checking" and "UI manages the list" without
forcing an always-on backend server. See Section 6.

## 4a. Initial target sites

All three day-one targets are **restock** watches; two are **variant-specific**.

| Site | URL pattern | Platform (likely) | Watch | Extraction strategy |
|---|---|---|---|---|
| **qwertykeys.com** | `/products/<handle>` | **Shopify** | a specific **color** back in stock | `/<handle>.js` → match variant by option → `available` flips true |
| **qwertyqop.com** | `/products/instock-...` | **Shopify** | a specific **kit** back in stock | same `.js` variant approach |
| **s-craft.studio** | `/shop/in-stock/<product>` | **Squarespace / custom** | **Dreamy Umbreon** back in stock | verify `?format=json` or per-site adapter on sold-out/notify button |

**Note:** these sites 403'd from this Claude session because the dev environment
runs on a strict network **allowlist** — this does **not** affect the production
tracker, which runs on GitHub Actions with open internet. Variant structures will
be confirmed live on the first Actions run.

---

## 5. How hard is this, really?

- **The easy 80%:** `fetch page → extract field → compare to last value → notify`.
  This is well-trodden, and the Telegram half already exists in `kukoedc-listener`.
- **The hard 20% — "any site":** there is no universal scraper. Sites differ in:
  - **Static HTML vs JavaScript-rendered** (price injected by JS after load).
  - **Anti-bot** (Cloudflare, rate limits, bot detection).
  - **Layout drift** — a site redesign silently breaks selectors.
  - **Structured data quality** — some sites expose clean data, some don't.

  The mitigation is the **per-site adapter + generic fallback** model (Section 7):
  most modern e-commerce sites embed a [Schema.org `Product`](https://schema.org/Product)
  block (JSON-LD) containing `price` and `availability`. We try that generically
  first; when it's missing or wrong, we add a tiny per-site config.

**Verdict:** Moderate. MVP is very achievable. "Truly any site, zero config,
100% reliable" is not a real target for anyone — we get close with structured
data + per-site overrides.

---

## 6. Architecture

```
                         ┌─────────────────────────────┐
                         │   Web Dashboard (Next.js)    │
                         │  hosted free on Vercel/CF    │
                         │  - add/remove watches        │
                         │  - view price/stock history  │
                         │  - "check now" button        │
                         └──────────────┬──────────────┘
                                        │ read/write
                                        ▼
                         ┌─────────────────────────────┐
                         │     Hosted Database          │
                         │  (Supabase / Postgres)       │
                         │  watches, snapshots, sites   │
                         └──────────────┬──────────────┘
                                        │ read watchlist / write snapshots
                                        ▼
   ┌──────────────────┐    cron     ┌─────────────────────────────┐
   │  GitHub Actions  │ ──────────▶ │   Checker (TypeScript)      │
   │  schedule: */15  │             │  for each active watch:     │
   └──────────────────┘             │   1. pick site adapter      │
                                     │   2. fetch + extract        │
                                     │   3. compare to last snap   │
                                     │   4. on change → notify     │
                                     └──────────────┬──────────────┘
                                                    │ on price/stock change
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │   Telegram Bot (reused)     │
                                     │   sends message to chat     │
                                     └─────────────────────────────┘
```

### Components
1. **Checker engine** — TypeScript. The core loop. Runs in GitHub Actions on a
   cron (e.g. every 15 min). Stateless; all state lives in the DB.
2. **Site adapters** — config-driven extractors (Section 7). Live in the repo
   (version-controlled) and/or DB.
3. **Database** — watchlist + historical snapshots + per-site config. Recommended:
   **Supabase** (managed Postgres, generous free tier, great JS client, and it can
   directly back the dashboard with auth + auto-generated APIs).
4. **Dashboard** — small **Next.js** app on **Vercel** (or Cloudflare Pages), free
   tier. CRUD on watches, history charts, manual trigger.
5. **Notifier** — Telegram module, ported from `kukoedc-listener`.

### Why this shape
- **No server to run.** Checking is cron; UI + DB are managed free tiers.
- **Single source of truth** (DB) shared by checker and dashboard.
- **Scales** by raising cron concurrency / sharding watches across jobs.

---

## 7. Site adapters & extraction (the heart of "any site")

A **watch** points at a product URL. Extraction is resolved in this order:

0. **Shopify variant endpoint** (best path when the site is Shopify):
   Fetch `/products/<handle>.js` (or `.json`) — a JSON document listing every
   variant with an **`available: true/false`** boolean (and often
   `inventory_quantity`). For variant-specific watches ("the *blue* one is back"),
   match the variant by its option(s) and alert when `available` flips to true.
   This is far more reliable than scraping HTML and covers 2 of the 3 day-one
   targets (qwertykeys, qwertyqop).
1. **Generic JSON-LD / microdata** (default, zero config):
   Parse `<script type="application/ld+json">` for a `Product` with `offers.price`
   and `offers.availability` (`InStock` / `OutOfStock`). Covers a large share of
   WooCommerce and mainstream retail sites out of the box.
2. **Per-site config** (override when generic fails): a small entry keyed by
   domain that specifies how to fetch and where to read the fields. (s-craft.studio
   will likely use this, or its Squarespace `?format=json` view.)
3. **Headless render** (opt-in per site): for JS-only pages, render with Playwright
   before extracting. Slower; used sparingly because it costs Actions minutes.

**Example per-site config:**
```yaml
# adapters/example-shop.yaml
domain: example-shop.com
fetch: static            # static | headless
price:
  selector: ".product-price .amount"
  attr: text             # text | content | data-price
  parse: currency        # strip symbols, → number
stock:
  selector: ".add-to-cart"
  in_stock_when: present # present | absent | text-matches
  out_of_stock_text: ["Sold out", "Notify me"]
```

Adding a new site = add one of these (or just let the generic path handle it).
This is what makes it "easily configurable + scalable."

**Robustness:**
- If extraction returns nothing where we previously had a value, flag a
  **"watch broken"** state (don't silently report "out of stock") and alert once.
- Per-site polite request pacing + `User-Agent`, jitter to avoid hammering.

---

## 8. Notifications (Telegram)

- Reuse the bot **token** and **chat ID** from `kukoedc-listener`.
- Stored as **GitHub Actions secrets** (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
  and as env vars for the dashboard if it ever sends messages.
- **Message contents:**
  - Price change: `📉 <name> price dropped: $120 → $99 (link)`
  - Back in stock: `✅ <name> is back IN STOCK (link)`
  - Out of stock: `⛔ <name> is now OUT OF STOCK (link)`
  - Watch broken: `⚠️ Couldn't read <name> — selector may have changed (link)`
- **Optional per-watch rules:** "only alert if price ≤ target", "only alert on
  restock", to keep noise down.

> ⚠️ **Access note:** this session is scoped to `drinking-game` only, so I could
> not read `kukoedc-listener` to copy its exact Telegram code/credentials. To
> port them, run a Claude Code session scoped to `kukoedc-listener` (or add it as
> an allowed repo). The credentials should **not** be committed — they go into
> GitHub Secrets / dashboard env vars.

---

## 9. Data model (initial)

```
sites           (id, domain, platform, fetch_mode, config_json, created_at)
watches         (id, url, name, site_id,
                 variant_match,            -- e.g. {"color":"Navy"} for variant watches
                 target_price, alert_mode, -- price_change | restock | drop_below
                 check_interval_minutes,   -- per-watch cadence
                 last_checked_at,          -- drives "is this watch due?"
                 active, created_at)
snapshots       (id, watch_id, price, currency, in_stock, raw_excerpt,
                 status, checked_at)         -- one row per check
notifications   (id, watch_id, type, payload, sent_at)
```
- **Latest state** = most recent `snapshot` per `watch`.
- **History** = all snapshots (powers the dashboard charts).
- `status` distinguishes `ok` / `broken` / `blocked`.
- `check_interval_minutes` + `last_checked_at` give **per-watch cadence**
  (Section 11); `variant_match` powers variant-specific restock watches.

---

## 10. Hosting & cost

| Piece | Where | Cost |
|---|---|---|
| Scheduler + checker | GitHub Actions cron | Free (public repo) / included minutes |
| Database | Supabase free tier (Postgres) | Free |
| Dashboard | Vercel / Cloudflare Pages free tier | Free |
| Telegram | Existing bot | Free |

**Caveats to watch:**
- GitHub's smallest cron interval is **5 min**, and scheduled runs can be delayed
  under load — fine for our use case, not for split-second drops.
- Free DB tiers may pause on inactivity — a frequent cron keeps it warm.
- Headless browsing burns Actions minutes fast; keep it opt-in.

---

## 11. Configuration & scaling

- **Add a product:** via dashboard (URL + optional target price + alert mode).
- **Add a site rule:** commit an adapter config (or edit via dashboard later).
- **Scaling levers:**
  - Concurrency inside one Actions job (batch fetch with a worker pool).
  - **Shard** watches across parallel jobs if the list gets large.
  - Tiered cadence: hot items every 5–15 min, cold items hourly/daily.
  - Move heavy/headless sites to their own slower workflow.

**Per-watch cadence on a single cron (the pattern):** GitHub Actions allows only
one schedule per workflow. So we run the workflow at the **finest** interval we
ever want (e.g. `*/5`), and the checker processes only watches that are **due** —
i.e. `now - last_checked_at >= check_interval_minutes`. This yields true
per-watch cadence (umbreon every 5 min, a low-priority item hourly) from one cron.

---

## 12. MVP scope & phased roadmap

**Phase 0 — Reuse foundation**
- Port Telegram notifier from `kukoedc-listener`; confirm a test message lands.

**Phase 1 — MVP (the core value)**
- Checker engine + **generic JSON-LD extraction**.
- Watchlist in DB (seeded from a simple list to start — UI can come right after).
- Price + stock change detection → Telegram.
- GitHub Actions cron wired up with secrets.

**Phase 2 — Configurability**
- Per-site YAML adapters + "watch broken" detection.
- Per-watch alert rules (target price, restock-only).

**Phase 3 — Dashboard**
- Next.js app: CRUD watches, history charts, "check now".

**Phase 4 — Scale & polish**
- Concurrency/sharding, tiered cadence, opt-in headless rendering.

---

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Sites block scraping (Cloudflare/CAPTCHA) | Mark `blocked`, alert once; opt-in headless; accept some sites are out of scope |
| Selectors break on redesign | "Watch broken" status + alert; generic JSON-LD fallback |
| Notification spam | Per-watch rules; only alert on actual transitions; debounce |
| Cron delays / missed runs | Accept minute-level latency; keep history so nothing is "lost" |
| Credentials leak | Secrets in GitHub/env only, never committed; `.env` gitignored |
| Legal/ToS | Personal-use, low-frequency, polite pacing; respect robots where required |

---

## 14. Decisions log (resolved)

1. ✅ **Repo:** new dedicated repo (`product-tracker`); port Telegram creds/snippet
   from `kukoedc-listener`.
2. ✅ **Database:** **Supabase**.
3. ✅ **Check frequency:** **configurable per watch** (Section 11 pattern).
4. ✅ **Dashboard:** **in MVP**.
5. ✅ **Initial sites:** qwertykeys.com, qwertyqop.com, s-craft.studio (Section 4a) —
   all restock watches, two variant-specific.
6. **Language/stack:** proposed **TypeScript** (matches your repos; checker +
   Next.js dashboard share types/code). _Confirm if happy._

### Still open
- Telegram: paste token + chat ID into the new repo's **GitHub Secrets**
  (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) — never committed.
- Finest cron interval to run at (drives minimum possible cadence): **5 min**?
```
