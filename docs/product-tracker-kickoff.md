# Product Tracker — Kickoff & Full Context (for a new chat)

> **What this file is:** a self-contained handoff. Point a fresh Claude Code
> session (scoped to the new `product-tracker` repo) at this file and it has
> everything it needs — the ask, what was already decided, the constraints
> discovered, the full PRD, and a paste-ready opening prompt. No need to read the
> prior conversation.
>
> **Owner:** @xianjinseow92 · **Created:** 2026-06-04 · **Source session:** scoped to `drinking-game`

---

## 0. Paste-ready opening prompt for the new chat

> Build the **product tracker** described in this document. We've already agreed
> the design (see "Decisions" and the PRD below). Start with **Phase 0 + Phase 1**:
> the Telegram notifier (send a test ping), the checker engine, and the **Shopify
> `/products/<handle>.js` variant adapter** — which covers two of my three target
> sites. Use **TypeScript**, **Supabase** for storage, and a **GitHub Actions cron**
> as the scheduler. Then we'll add the s-craft adapter and the Next.js dashboard.
>
> Note: you won't be able to live-test fetches from inside the session (network
> allowlist) — that's expected; the real run happens on GitHub Actions.

Add **`kukoedc-listener`** as a second allowed repo for that session **only if** you
want the agent to port the existing Telegram code; otherwise it'll rewrite the ~15
lines fresh.

---

## 1. The original ask

A **product watcher** that tracks products from **any site**, is **easily
configurable**, **easy to scale**, and sends notifications to a **Telegram** chat.
Decide where it's hosted. Reuse the Telegram credentials from an existing repo.

---

## 2. What was discovered this session

- **Existing predecessor repo:** `xianjinseow92/kukoedc-listener` — private,
  TypeScript, *"Tracks product updates from site"*. This is the v1 single-site
  listener and **holds the Telegram bot token + chat ID**. The general product
  tracker is its successor.
- **Telegram reuse:** we only strictly need the **token + chat ID** (they go into
  GitHub **Secrets**, never into code). The send code is ~15 lines and can be
  rewritten; porting from `kukoedc-listener` is optional convenience.
- **Two environment constraints (do not mistake these for app problems):**
  1. The source session was **scoped to `drinking-game` only**, so it could not read
     `kukoedc-listener` or create the new repo (`403 Resource not accessible`).
  2. The dev environment runs on a strict **network allowlist** — all outbound web
     fetches return `403 Host not in allowlist` (even `example.com`). **This does
     NOT affect production**: the tracker runs on GitHub Actions with open internet.
     It only means the agent can't live-test scraping from inside the chat.

---

## 3. Decisions (locked)

| Topic | Decision |
|---|---|
| Repo | **New dedicated repo** `product-tracker` (private; public = unlimited Actions min if needed) |
| Scheduler / hosting | **GitHub Actions cron** (the checker); no always-on server |
| Storage | **Supabase** (managed Postgres + auto REST API + auth; backs the dashboard) |
| What triggers alerts | **Price changes** + **stock/availability** |
| Reading sites | **Per-site adapters** + generic fallback; **Shopify variant endpoint** first-class |
| Manage watchlist | **Web dashboard** (Next.js), in MVP |
| Cadence | **Configurable per watch** |
| Language | **TypeScript** (shared types between checker + dashboard) |
| Notifications | **Telegram**, reusing existing bot token + chat ID via GitHub Secrets |

### Target sites (day one — all restock watches)
| Site | URL pattern | Platform (likely) | Watch | Strategy |
|---|---|---|---|---|
| qwertykeys.com | `/products/<handle>` | **Shopify** | a specific **color** restock | `/<handle>.js` → match variant by option → `available` true |
| qwertyqop.com | `/products/instock-...` | **Shopify** | a specific **kit** restock | same `.js` variant approach |
| s-craft.studio | `/shop/in-stock/<product>` | **Squarespace/custom** | **Dreamy Umbreon** restock | verify `?format=json` or per-site adapter |

---

## 4. Pre-work checklist for the human (@xianjinseow92)

- [ ] Create repo **`product-tracker`** (private, init with README) — see §4.1.
- [ ] Start a new Claude Code session scoped to it (optionally + `kukoedc-listener`).
- [ ] Create a **Supabase** free project; note its URL + service key.
- [ ] Add GitHub **Secrets** (Settings → Secrets → Actions):
      `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
- [ ] (Later) Connect the dashboard to **Vercel** (free) for hosting.

### 4.1 How to create the repo (pick one)

**Option A — GitHub web UI (easiest):**
1. Go to <https://github.com/new>.
2. **Repository name:** `product-tracker`.
3. **Description:** `Configurable product watcher — price/stock alerts to Telegram`.
4. Select **Private**.
5. Tick **Add a README file** (so the repo is initialized / clonable immediately).
6. Click **Create repository**.

**Option B — `gh` CLI (if installed & authenticated):**
```bash
gh repo create product-tracker \
  --private \
  --description "Configurable product watcher — price/stock alerts to Telegram" \
  --add-readme
# clone it locally:
gh repo clone xianjinseow92/product-tracker
```

**Option C — plain git (create empty repo on GitHub first via A, then):**
```bash
git clone https://github.com/xianjinseow92/product-tracker.git
cd product-tracker
# the new Claude Code session takes it from here
```

> Private vs public: **private** matches `kukoedc-listener` and keeps your
> watchlist unlisted (free tier = 2,000 Actions min/month, plenty for a `*/5`
> cron with a few watches). Switch to **public** later only if you ever need
> unlimited Actions minutes.

### 4.2 How to add the GitHub Secrets (after the repo exists)

**Web UI:** repo → **Settings → Secrets and variables → Actions → New repository
secret**, add each of: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SUPABASE_URL`,
`SUPABASE_SERVICE_KEY`.

**`gh` CLI:**
```bash
gh secret set TELEGRAM_BOT_TOKEN   --repo xianjinseow92/product-tracker
gh secret set TELEGRAM_CHAT_ID     --repo xianjinseow92/product-tracker
gh secret set SUPABASE_URL         --repo xianjinseow92/product-tracker
gh secret set SUPABASE_SERVICE_KEY --repo xianjinseow92/product-tracker
# (each prompts for the value — nothing is stored in your shell history)
```

> The Telegram token + chat ID are the ones already in `kukoedc-listener`. If you
> don't have them handy, get a fresh token from **@BotFather** and your chat ID
> from **@userinfobot** on Telegram.

---

# 5. The PRD

## 5.1 Summary
A self-hosted **product watcher** that monitors products on arbitrary e-commerce
sites and sends a **Telegram** message when **price** or **stock/availability**
changes. Must be **easily configurable** (add a product/site without code changes)
and **easy to scale** (5 → 500 watches without re-architecting). Successor to
`kukoedc-listener`, generalized from one site to many, with a management dashboard.

## 5.2 Goals & Non-Goals
**Goals**
- Watch product URLs; detect **price** and **stock** changes.
- Notify via **Telegram** (reuse existing bot).
- Add products/sites via **configuration**, not code.
- Run cheaply on a **schedule** (GitHub Actions cron).
- **Dashboard** to manage watches + view history.
- Scale to hundreds of watches.

**Non-Goals (for now)**
- Not a cross-retailer price comparison engine (single-URL watching).
- No auto-purchase/checkout.
- Not defeating aggressive anti-bot (Cloudflare challenges, CAPTCHAs) — supported
  sites only; hard targets out of MVP.
- Not real-time/sub-minute (cron granularity is minutes).
- Single user (you); no multi-user accounts yet.

## 5.3 How hard is it?
- **Easy ~80%:** `fetch → extract field → compare to last → notify`. Telegram half
  already exists.
- **Hard ~20% — "any site":** no universal scraper. Sites differ (static vs
  JS-rendered, anti-bot, layout drift, structured-data quality). Mitigation = the
  adapter model below. Verdict: **moderate; MVP very achievable.**

## 5.4 Architecture
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
                         │   Supabase (Postgres)        │
                         │  watches, snapshots, sites   │
                         └──────────────┬──────────────┘
                                        │ read watchlist / write snapshots
                                        ▼
   ┌──────────────────┐    cron     ┌─────────────────────────────┐
   │  GitHub Actions  │ ──────────▶ │   Checker (TypeScript)      │
   │  schedule: */5   │             │  for each DUE watch:        │
   └──────────────────┘             │   1. pick site adapter      │
                                     │   2. fetch + extract        │
                                     │   3. compare to last snap   │
                                     │   4. on change → notify     │
                                     └──────────────┬──────────────┘
                                                    │ on price/stock change
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │   Telegram Bot (reused)     │
                                     └─────────────────────────────┘
```
**Components:** (1) **Checker engine** — TS, stateless, runs on cron. (2) **Site
adapters** — config-driven extractors. (3) **Supabase** — single source of truth.
(4) **Dashboard** — Next.js on Vercel. (5) **Notifier** — Telegram module.

**Why:** no server to babysit (cron + managed free tiers); one shared datastore;
scales via concurrency/sharding.

## 5.5 Site adapters & extraction (the heart of "any site")
Resolution order per watch:
0. **Shopify variant endpoint (best when applicable):** fetch
   `/products/<handle>.js` (or `.json`) → JSON of every variant with an
   **`available: true/false`** boolean (+ often `inventory_quantity`). For
   variant-specific watches, match the variant by option(s) and alert when
   `available` flips true. Covers qwertykeys + qwertyqop day one.
1. **Generic JSON-LD/microdata (zero config):** parse
   `<script type="application/ld+json">` for `Product` with `offers.price` and
   `offers.availability` (`InStock`/`OutOfStock`). Covers many WooCommerce/retail.
2. **Per-site config (override):** small per-domain entry for fetch + field rules
   (s-craft.studio likely lands here, or its Squarespace `?format=json`).
3. **Headless render (opt-in):** Playwright for JS-only pages; sparingly (costs minutes).

**Example per-site config:**
```yaml
# adapters/example-shop.yaml
domain: example-shop.com
fetch: static            # static | headless
price:
  selector: ".product-price .amount"
  attr: text             # text | content | data-price
  parse: currency
stock:
  selector: ".add-to-cart"
  in_stock_when: present # present | absent | text-matches
  out_of_stock_text: ["Sold out", "Notify me"]
```
**Robustness:** if extraction loses a previously-present value, mark the watch
**`broken`** (don't report a false "out of stock") and alert once. Polite pacing,
realistic `User-Agent`, jitter.

## 5.6 Notifications (Telegram)
- Reuse bot **token** + **chat ID** from `kukoedc-listener`, stored as GitHub
  **Secrets** (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`). Never committed.
- Messages:
  - `📉 <name> price dropped: $120 → $99 (link)`
  - `✅ <name> is back IN STOCK (link)`
  - `⛔ <name> is now OUT OF STOCK (link)`
  - `⚠️ Couldn't read <name> — selector may have changed (link)`
- Per-watch rules to reduce noise: "only if price ≤ target", "restock-only".

## 5.7 Data model (initial)
```
sites           (id, domain, platform, fetch_mode, config_json, created_at)
watches         (id, url, name, site_id,
                 variant_match,            -- e.g. {"color":"Navy"} for variant watches
                 target_price, alert_mode, -- price_change | restock | drop_below
                 check_interval_minutes,   -- per-watch cadence
                 last_checked_at,          -- drives "is this watch due?"
                 active, created_at)
snapshots       (id, watch_id, price, currency, in_stock, raw_excerpt,
                 status, checked_at)         -- one row per check; status: ok|broken|blocked
notifications   (id, watch_id, type, payload, sent_at)
```
- Latest state = most recent `snapshot` per watch. History = all snapshots.

## 5.8 Hosting & cost
| Piece | Where | Cost |
|---|---|---|
| Scheduler + checker | GitHub Actions cron | Free (public) / included minutes (private) |
| Database | Supabase free tier | Free |
| Dashboard | Vercel / Cloudflare Pages | Free |
| Telegram | Existing bot | Free |

**Caveats:** GitHub's smallest cron is **5 min** and scheduled runs can be delayed
under load (fine here). Free Supabase pauses after ~1wk idle — frequent cron keeps
it warm. Headless browsing burns Actions minutes — keep opt-in.

## 5.9 Configuration & scaling
- Add product via dashboard (URL + optional target price + alert mode + cadence).
- Add a site rule via adapter config (or dashboard later).
- Scaling: in-job concurrency (worker pool); **shard** watches across parallel jobs;
  tiered cadence; isolate heavy/headless sites in a slower workflow.

**Per-watch cadence on one cron (the pattern):** run the workflow at the finest
interval you'll ever want (e.g. `*/5`); the checker processes only watches where
`now - last_checked_at >= check_interval_minutes`. True per-watch cadence from a
single cron.

## 5.10 MVP scope & phased roadmap
- **Phase 0 — Foundation:** Telegram notifier (port/rewrite); send a test message.
- **Phase 1 — MVP core:** checker engine + **Shopify variant adapter** + generic
  JSON-LD; Supabase schema; price + stock detection → Telegram; Actions cron + secrets.
- **Phase 2 — Configurability:** per-site YAML adapters (incl. s-craft);
  "watch broken" detection; per-watch alert rules + cadence.
- **Phase 3 — Dashboard:** Next.js CRUD, history charts, "check now".
- **Phase 4 — Scale & polish:** concurrency/sharding, tiered cadence, opt-in headless.

## 5.11 Risks & mitigations
| Risk | Mitigation |
|---|---|
| Sites block scraping (Cloudflare/CAPTCHA) | Mark `blocked`, alert once; opt-in headless; accept some out of scope |
| Selectors break on redesign | "Watch broken" status + alert; generic JSON-LD fallback |
| Notification spam | Per-watch rules; only alert on real transitions; debounce |
| Cron delays / missed runs | Accept minute latency; history preserves nothing-lost |
| Credentials leak | Secrets/env only, never committed; `.env` gitignored |
| Legal/ToS | Personal-use, low-frequency, polite pacing; respect robots where required |

---

## 6. First things the new session should produce
1. Repo scaffold: TS project, `package.json`, `tsconfig`, `.gitignore` (ignore `.env`).
2. `src/notify/telegram.ts` + a `npm run test:telegram` that sends a ping.
3. `src/adapters/shopify.ts` (variant-aware) + generic JSON-LD adapter + adapter registry.
4. Supabase schema/migration matching §5.7.
5. `src/checker.ts` (the due-watch loop) + `.github/workflows/check.yml` (`*/5` cron).
6. Seed the three target watches; dry-run locally (will 403 in-session — that's fine),
   then verify on the first Actions run.
