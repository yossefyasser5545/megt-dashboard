
# Megt Logistics — Admin Dashboard (Frontend Only)

A responsive admin dashboard for "Megt" logistics, built with React + Tailwind. No backend, no APIs — all data is static JSON held in React state.

## Stack & conventions

- TanStack Router (this template's router) instead of React Router DOM — same routing model, type-safe, already wired. Functionally equivalent for the user's needs.
- Tailwind CSS v4 via existing `src/styles.css` design tokens (oklch). Dark mode via `.dark` class on `<html>`.
- Recharts for charts, Lucide React for icons (both fit the stack).
- i18n: lightweight custom provider (English + Arabic) using a translation object + React context. Toggles `dir="rtl"` / `dir="ltr"` and `lang` on `<html>`. No external i18n library needed.
- Theme + language persisted to `localStorage`.

## Folder structure

```text
src/
  routes/
    __root.tsx              # adds Theme + i18n providers, <Outlet/>
    login.tsx               # /login (no layout)
    _dashboard.tsx          # layout route: sidebar + topbar + <Outlet/>
    _dashboard.index.tsx    # / overview
    _dashboard.quotes.tsx   # /quotes
    _dashboard.contact-requests.tsx   # /contact-requests
    _dashboard.contact-info.tsx       # /contact-info
  components/
    layout/    Sidebar.tsx, Topbar.tsx, UserMenu.tsx, NotificationsMenu.tsx, LanguageSwitcher.tsx, ThemeToggle.tsx, Logo.tsx
    dashboard/ StatCard.tsx, RecentTable.tsx, OverviewCharts.tsx, ActivityFeed.tsx
    common/    DataTable.tsx, SearchInput.tsx, Pagination.tsx, FilterDropdown.tsx, StatusBadge.tsx, EditDialog.tsx, ContactInfoCard.tsx
  i18n/        I18nProvider.tsx, useT.ts, en.ts, ar.ts
  theme/       ThemeProvider.tsx, useTheme.ts
  data/        quotes.ts, contactRequests.ts, users.ts, contactInfo.ts (fake JSON)
  lib/         utils.ts (existing)
```

Reuse shadcn primitives already present (button, card, table, input, dialog, dropdown-menu, badge, sheet for mobile sidebar).

## Pages

**Login (`/login`)** — split-screen: gradient brand panel (Megt logo + tagline) + form card with Email, Password, Remember me, Login button. Submitting just navigates to `/`. Language switcher + theme toggle in corner.

**Overview (`/`)** — 3 stat cards (Total Contact Requests, Total Quote Requests, Total Users) with trend deltas; Recharts area chart (requests over 12 months) + bar chart (quotes by service type) + donut (service split); two "Latest 5" tables (Contact Requests, Quote Requests); Activity feed sidebar.

**Quote Requests (`/quotes`)** — table with all required columns (Full Name, Email, Phone, Pickup Country, Import Country, Pickup City, Service Type, Details), client-side search, service-type + status filter dropdowns, pagination, status badges, row hover, "Details" opens a dialog with full info.

**Contact Requests (`/contact-requests`)** — table (Name, Email, Phone, Message truncated), search, pagination, View dialog + Delete button (removes from local state with confirm dialog).

**Contact Info (`/contact-info`)** — 5 editable cards (Phone, Email, Location, Working Hours, plus a description card). Each card has an Edit button that opens a dialog with title/value/description fields. Changes persist in component state (and `localStorage` for nicety). Seeded with the exact values from the brief.

## Layout

- Collapsible sidebar (full width on desktop, icon-only collapsed, off-canvas Sheet on mobile) with nav links + active state.
- Topbar: sidebar toggle, page title/breadcrumb, language switcher (EN/AR), theme toggle, notifications dropdown (static items), user profile dropdown (Profile / Settings / Logout → `/login`).
- RTL: setting Arabic flips `dir="rtl"`; sidebar moves to the right automatically via logical CSS (Tailwind's `ms-*`/`me-*` utilities used throughout).

## Design

- Palette: navy/blue primary on white (light) and deep navy surfaces (dark). Updates `--primary` and adds `--brand-gradient` token in `src/styles.css`. Rounded-2xl cards, soft shadows, subtle borders, smooth `transition-colors`/`transition-transform` on interactive elements, `animate-fade-in` for page mount.
- All colors via semantic tokens — no hardcoded hex in components.

## i18n details

- `I18nProvider` exposes `{ lang, setLang, t, dir }`. `t('quotes.title')` lookup against `en.ts` / `ar.ts`. On `setLang`, updates `document.documentElement.lang` and `dir`, persists to localStorage. All UI strings (nav, table headers, buttons, placeholders, page titles) are keyed; fake data stays as-is.

## Out of scope (per the brief)

No real auth, no API calls, no database, no Firebase. Login is UI-only and just routes to the dashboard.
