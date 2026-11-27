# AGENTS.md — AI Coding Agent Guide

This repository is a reusable, bilingual (**Vietnamese / English**) wedding & anniversary invitation template built with **React 19, TypeScript (strict), Vite 6, Zod v4, and unprivileged Nginx**.

Follow this guide whenever a user asks you to customize this template for a wedding, add content, adjust themes/features, or deploy.

---

## 1. Golden Rule

**95% of customizations only require editing two places:**

1. `wedding.config.json` — all couple info, dates, families, story, milestones, schedule, dress code, gallery captions, venues, gift QR/bank accounts, RSVP endpoint, wishes, theme, language, and feature flags.
2. `public/media/` — all photos, monogram logo, QR images, and background audio.

Do **not** hardcode couple names, dates, addresses, or links inside `src/components/`. Everything flows from `wedding.config.json` (validated at dev/build time by `src/config/schema.ts` and `wedding.schema.json`).

---

## 2. Repository Map

| Path                           | Responsibility                                                                                                                                                                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wedding.config.json`          | Single Source of Truth for all wedding data, SEO, theme, and feature flags.                                                                                                                                                                   |
| `wedding.schema.json`          | JSON Schema for IDE autocomplete and validation.                                                                                                                                                                                              |
| `public/media/`                | User-supplied images (`hero`, `bride`, `groom`, `story`, `banner-*`, `gallery/*`, `locations/*`, `qr/*`) and audio (`music.m4a` / `music.mp3`).                                                                                               |
| `vite.config.ts`               | Validates `wedding.config.json`, supports `VITE_BASE_PATH`, injects `<title>`, `<meta>`, Open Graph tags into `index.html`, and generates `manifest.json`.                                                                                    |
| `src/config/schema.ts`         | Zod v4 validation schema & TypeScript types (`WeddingConfig`).                                                                                                                                                                                |
| `src/config/themes.ts`         | 4 theme presets (`classic-gold`, `romantic-rose`, `sage-green`, `traditional-red`) + custom hex color overrides.                                                                                                                              |
| `src/i18n/translations.ts`     | Static UI labels in Vietnamese (`vi`) and English (`en`).                                                                                                                                                                                     |
| `src/components/`              | Modular UI sections (`EnvelopeIntro`, `Navbar`, `Header`, `InvitationCard`, `Couple`, `Anniversary`, `Story`, `Organization`, `Schedule`, `Gallery`, `Where`, `Gift`, `RSVP`, `SeeYou`, `Footer`, `MobileDock`, `MusicPlayer`, `InviteTool`). |
| `src/styles/tokens.css`        | Theme design tokens (WCAG AA contrast compliant).                                                                                                                                                                                             |
| `src/styles/global.css`        | Full-width luxury layout, 12-col Gallery mosaic, responsive rules, and scroll reveal animations.                                                                                                                                              |
| `docker/security-headers.conf` | Nginx security headers & strict CSP (`script-src 'self'`, no `'unsafe-inline'`).                                                                                                                                                              |
| `Dockerfile` & `compose.yaml`  | Multi-stage build (`node:26.13.1-alpine` -> `nginx/nginx-unprivileged:1.31.10-alpine-slim`).                                                                                                                                                  |
| `.github/workflows/`           | `ci.yml` (quality gate + Docker check) and `deploy-pages.yml` (GitHub Pages deploy).                                                                                                                                                          |

---

## 3. Agent Playbook: Customizing for a New Wedding

When a user asks to set up a wedding with this template:

### Step 1 — Gather Required Inputs (ask only what is missing)

- **Couple:** Short names (`brideShort`, `groomShort`), full names (`brideFull`, `groomFull`), short bios.
- **Event:** Wedding date & time in ISO 8601 with timezone (e.g. `2027-05-16T11:00:00+07:00`), lunar date (if Vietnamese wedding), city.
- **Families (optional):** Parents' names & addresses for `families.brideSide` and `families.groomSide` (or set `features.showInvitationCard: false`).
- **Locations:** Venue titles, times, addresses, and `https://` Google Maps URLs.
- **Gift / QR (optional):** Bank name, VietQR bank code (e.g. `VCB`, `TCB`, `MB`, `BIDV`, `ACB`), account number, holder name, and whether to use `useVietQr: true` or local QR images.
- **RSVP (optional):** Webhook URL (Formspree, Web3Forms, Google Apps Script) or leave `""` for preview mode, or disable via `features.showRsvp: false`.
- **Theme & Language:** Preset (`classic-gold` | `romantic-rose` | `sage-green` | `traditional-red`) and default language (`vi` | `en`).

### Step 2 — Edit `wedding.config.json` Carefully

- **LocalizedText fields** accept either `{ "vi": "...", "en": "..." }` (recommended for bilingual sites) OR a single plain string `"..."` (if single-language).
- **Dates** (`event.weddingDateIso`, `event.weddingEndIso`, `locations[].startIso`, `locations[].endIso`) MUST be valid ISO 8601 timestamps with timezone offset (e.g. `+07:00`).
  - Future date -> Timer automatically runs in **Countdown mode**.
  - Past date -> Timer automatically switches to **Anniversary mode** (counting years & days together).
- **URLs** (`locations[].mapUrl`, `rsvp.endpoint`) MUST use `https://` or `http://`. Non-HTTP protocols are rejected by Zod.
- **Custom Colors** (`theme.customColors`) MUST be 6-digit hex codes (`#RRGGBB`).
- **Media Paths** (`media.*`, `gallery[].src`, `locations[].image`, `gift.accounts[].qrImage`, `music.src`) MUST be relative paths inside `public/` without a leading slash (e.g. `media/hero.webp`), so Vite resolves them properly under both root (`/`) and subpath (`/repo-name/`) deployments.
- **Gallery Mosaic:** Exactly 6 photos in `gallery` render in the 12-column editorial mosaic on desktop (`All` tab). Any other count or filtered category automatically renders in a clean symmetric 3-column grid.

### Step 3 — Optimize User Media (When Real Photos Are Provided)

If the user supplies raw JPG/PNG photos, convert them to **WebP** and strip EXIF metadata before placing them in `public/media/`:

- `media/hero.webp`: `1440×960` (3:2 landscape, `< 300 KB`)
- `media/bride.webp` & `media/groom.webp`: `480×480` (1:1 square, `< 60 KB`)
- `media/story.webp`: `900×1200` (3:4 portrait, `< 150 KB`)
- `media/gallery/1..6.webp`: `1200×800` (3:2 landscape, `< 180 KB` each)
- `media/locations/1..3.webp`: `800×533` (3:2 landscape, `< 120 KB` each)
- `media/banner-timer.webp` & `media/banner-thankyou.webp`: `1200×800` (darker tones work best behind white text)
- Update `width` / `height` metadata in `wedding.config.json` if aspect ratios change significantly.

### Step 4 — Update Nginx CSP If Using External RSVP Webhook

If `rsvp.endpoint` is set to an external domain (e.g. `https://formspree.io/f/xxxx`) and the user deploys via Docker/Nginx, add that origin to `connect-src` in `docker/security-headers.conf`:

```nginx
connect-src 'self' https://formspree.io;
```

### Step 5 — Run Mandatory Verification Before Finishing

Always run and ensure 0 errors after making changes:

```bash
npm run format && npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
```

---

## 4. Guardrails (Do Not Break)

- **Security:**
  - Never add `'unsafe-inline'` or `'unsafe-eval'` to `script-src` in `docker/security-headers.conf`.
  - Keep `rel="noopener noreferrer"` on every `<a target="_blank">`.
  - Never inject `?guest=` via `dangerouslySetInnerHTML`; always render as React text nodes via `parseGuestNameFromSearch`.
  - Do not commit `.env` files, API keys, or private credentials.
- **Accessibility:**
  - Maintain WCAG AA contrast (`--color-accent-text` on light surfaces must stay >= 4.5:1).
  - Keep `alt` attributes meaningful and keyboard navigation intact (`Esc`, `ArrowLeft`, `ArrowRight` in Lightbox).
- **Tests:**
  - If you change default `wedding.config.json` content (e.g. couple names or feature flags), update assertions in `src/config/schema.test.ts` and `src/App.test.tsx` accordingly so `npm test` stays green.
