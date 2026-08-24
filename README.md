<div align="center">

<!-- Brand Logo (matches dashboard favicon & header) -->
<svg width="72" height="72" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="9" fill="url(#readme-grad)"/>
  <path d="M9 16.5L14 21.5L23 11" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 6C21.5228 6 26 10.4772 26 16" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.5" stroke-dasharray="2.5 3.5"/>
  <defs>
    <linearGradient id="readme-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4F46E5"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
</svg>

<h1>Habit Tracker</h1>

<p><strong>A modern, high-performance habit tracking platform — built with precision, zero dependencies, and a SaaS-grade UI.</strong></p>

<p>
  <img src="https://img.shields.io/badge/TypeScript-Typed_Source-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla_ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/CSS3-Design_System-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
</p>

<p>
  <img src="https://img.shields.io/badge/Dependencies-Zero_External-22C55E?style=flat-square" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/Theme-Light_Mode_SaaS-4F46E5?style=flat-square" alt="Light Theme">
  <img src="https://img.shields.io/badge/Auth-Login_%26_Sign_Up-7C3AED?style=flat-square" alt="Auth">
  <img src="https://img.shields.io/badge/Icons-12%2B_Vector_SVG-06B6D4?style=flat-square" alt="SVG Icons">
  <img src="https://img.shields.io/badge/Responsive-Mobile_Tablet_Desktop-06B6D4?style=flat-square" alt="Responsive">
  <img src="https://img.shields.io/badge/License-MIT-gray?style=flat-square" alt="MIT License">
</p>

</div>

---

## 🧭 Overview

**Habit Tracker** is a professional-grade productivity web application crafted to help you build compound consistency and achieve daily mastery. Designed with a clean, modern light-mode interface inspired by top-tier SaaS products — every interaction is intentional, every pixel is purposeful.

> 💡 No npm. No framework. No build step. Just open `index.html` and you're live.

---

## ✨ Feature Highlights

### 🔐 Authentication & User Profiles
- Sign up with a custom name, email, and avatar color
- Sign in to restore your personalized session
- Continue as **Guest** without any commitment
- Dynamic greeting adapts by time of day — *"Good morning, Alex! 👋"*
- Rotating motivational quote in the header
- Account menu: manage categories, clear all habits, sign in / switch account
- Persistent local session via `localStorage` (client-side only — no backend)

---

### 🎨 Fully Customizable Categories
- Create, edit, and delete your own categories
- Choose from **12+ professional vector SVG icons** (no emojis — clean and scalable at any resolution)
- Assign a custom color accent per category
- Live habit count badges per category in the sidebar
- Default starter categories: Health & Fitness, Productivity, Learning, Mindfulness, Finance

| Icon | Name | Icon | Name |
|------|------|------|------|
| 🎯 Target | Goal-oriented | 📈 Activity | Health tracking |
| 📚 Book | Learning | 💼 Briefcase | Productivity |
| 🏋️ Dumbbell | Fitness | 🪶 Feather | Mindfulness |
| 💳 Wallet | Finance | ☕ Coffee | Lifestyle |
| 💻 Code | Development | ✨ Sparkles | Inspiration |
| ☀️ Sun | Wellness | 💧 Droplet | Hydration |

---

### 📊 Real-Time KPI Metrics Dashboard
- **Radial SVG Progress Ring** — animated stroke-fill showing today's completion percentage
- **🔥 Streak Flame Metric** — active continuous day streak, with your leading habit highlighted
- **📅 7-Day Consistency Score** — rolling adherence rate across all habits
- **🧮 All-Time Check-In Counter** — cumulative completions logged across your full history

---

### 🗓️ Interactive 7-Day Rolling Check Strip
Each habit card features a built-in 7-day calendar strip. Tap any day to retroactively log or unlog completions — past days, or today.

Habit cards also support:
- Create, edit, and delete
- Per-habit accent color
- Live streak count and total check-ins
- One-tap check-in for today

---

### 🎛️ Habit Board Controls
Filter and sort the board without leaving the dashboard:

- **Status** — All, Pending, or Done Today
- **Frequency** — All, Daily, Weekly, or Monthly (sidebar)
- **Sort** — Streak, Name (A–Z), Category, Total Logs, or Recently Added
- **Category** — click any sidebar category to focus that group

---

### 🧭 The 2-Day Rule
A sidebar reminder: never skip a habit two days in a row. Protect the streak, even if the session is short.

---

### 🔍 Intelligent Live Search
- Instant filtering across habit **name**, **description**, **category**, and **frequency**
- Matched terms are **highlighted** inside results
- Empty state with *"Create '[Query]'"* quick-action shortcut
- Keyboard shortcuts:
  - `⁄` or `Ctrl+K` / `⌘K` to focus search
  - `Esc` to clear and dismiss

---

### 💡 Starter Inspirations Panel
Pre-built habit templates to kickstart your journey with a single click:

| Habit | Category | Frequency |
|-------|----------|-----------|
| 💧 Hydration 2L | Health & Fitness | Daily |
| 📖 Read 20 Mins | Learning | Daily |
| 🏃 Morning Workout | Health & Fitness | Daily |
| 🧘 Mindful Breathing | Mindfulness | Daily |

---

### 📈 Analytics Modal
- **30-Day GitHub-style Activity Heatmap** — 4 density levels visualizing check-in intensity day by day
- **Per-Habit Breakdown** — progress bars, streak count, best streak, and total check-ins per habit

---

### 🎊 Delightful Micro-Interactions
- **Canvas Confetti Engine** — particle celebration animation on every habit completion
- **Toast Notifications** — lightweight, auto-dismissing feedback messages
- **Custom Modal Dialogs** — branded confirm & alert dialogs that match the design system (no native browser popups)

---

### 📱 Responsive Across Devices
The layout is built for phone, tablet, and desktop — not a shrunk desktop page.

| Breakpoint | Layout |
|------------|--------|
| **Desktop** (>1100px) | Sticky header, 280px sidebar, 4-column KPI row, multi-column habit cards |
| **Laptop / tablet** (≤1100px) | 2-column KPI metrics |
| **Tablet / small laptop** (≤860px) | Sidebar stacks above the board; search spans a full row; category chips scroll horizontally; category edit/delete stay tappable (no hover required) |
| **Phone** (≤600px) | Single-column KPIs; stacked toolbar; icon-only header actions; stacked habit form fields; 16px inputs (no iOS zoom); full-width check-in; bottom-sheet style modals; safe-area padding |
| **Narrow phone** (≤400px) | Tighter padding, 3-column icon picker |

Also handled:
- Habit cards use `minmax(min(330px, 100%), 1fr)` so they never overflow a 320px viewport
- Modals and confetti canvas use `100%` instead of `100vw` (no scrollbar-induced horizontal scroll)
- Toasts pin to the screen edges on small devices
- Heatmap wraps to a 7-column week grid on phones

---

## 🗂️ Project Structure

```
habit-tracker/
├── index.html          # Semantic HTML5 — modals, layouts, accessible structure
├── style.css           # CSS design system — custom properties, light-mode tokens
├── script.ts           # Strongly typed TypeScript core engine & Supabase cloud sync
├── supabaseClient.ts   # Supabase client with PKCE auth & resilience
├── supabase_schema.sql # Complete PostgreSQL migration script for Supabase
├── favicon.svg         # SVG favicon — matches the brand logo exactly
├── .env.example        # Template for Supabase environment variables
└── README.md           # Project documentation & showcase
```

---

## 🧠 Core TypeScript Interfaces

```typescript
interface UserProfile {
    id?: string;
    name: string;
    email: string;
    avatarColor: string;
    isGuest: boolean;
}

interface CustomCategory {
    id: string;
    name: string;
    icon: string;   // Key from SVG_ICONS library
    color: string;  // Hex color accent
}

interface Habit {
    id: string;
    name: string;
    description?: string;
    category: string;
    categoryId?: string | null;
    frequency: 'daily' | 'weekly' | 'monthly';
    color: string;
    createdAt: string;
    completions: string[]; // ISO dates → 'YYYY-MM-DD'
}
```

---

## ⚡ Quick Start

You can run the Habit Tracker in three different modes depending on your requirements:

### Option A: Local Guest Mode (Zero Configuration)

If no environment variables are configured, the app automatically falls back to guest mode using the browser's `localStorage`.

1. **Clone the repository**
   ```bash
   git clone git@github.com:itsidrissisaad/habit-tracker.git
   cd habit-tracker
   ```
2. **Install and run**
   ```bash
   npm install
   npm run dev
   # → Open http://localhost:3000 in your browser
   ```

---

### Option B: Cloud Sync Mode (Supabase Cloud)

To enable cloud backup, sync, and user authentication with a hosted Supabase project:

1. **Prepare Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
2. **Configure Credentials**
   Open `.env.local` and fill in your Supabase project credentials (retrieved from your Supabase Dashboard under Project Settings -> API):
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
   ```
3. **Database Setup**
   Run the schema script found in [supabase_schema.sql](./supabase_schema.sql) in your Supabase project's SQL Editor to set up the tables, views, and functions.
4. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

---

### Option C: Local Dev Mode (Supabase CLI)

For running both the application and the Supabase backend entirely on your local machine using Docker:

1. **Ensure Docker is running** on your system.
2. **Start the local Supabase environment**
   ```bash
   npx supabase start
   ```
   This will boot the database, Auth server, Studio, and API gateway locally.
3. **Apply Database Migrations**
   ```bash
   npx supabase db reset
   ```
   This applies the migration files found in the [supabase/migrations/](./supabase/migrations/) directory to your local database.
4. **Configure Environment Variables**
   Create a `.env.local` file pointing to your local Supabase endpoints (displayed in the terminal after running `supabase start`):
   ```env
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_PUBLISHABLE_KEY=your-local-anon-key
   ```
5. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

---

## 🔒 Security & Secrets Management

To maintain application security and protect user data, please adhere to the following environment and security policies:

### ⚠️ Secret Key Discipline
- **Public Keys**: Variables prefixed with `VITE_` (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) are bundled into the production client-side JavaScript. They are visible to anyone inspecting the website's source code. Only public-facing keys (like the Supabase `anon` key) should use the `VITE_` prefix.
- **Private Keys**: Database master keys, service role keys (`service_role`), or integration API tokens (e.g., `SUPABASE_SECRET_KEY`) **must never** have the `VITE_` prefix and **must never** be imported or referenced in client-side code. They are stored in `.env.local` solely for local CLI commands and migrations.

### 🚫 Git Exclusion Policies
To prevent accidental secrets disclosure, the project enforces Git exclusions in the [.gitignore](./.gitignore) file:
- `.env.local` and `.env.*.local` are explicitly ignored.
- Only `.env.example` (containing dummy values) is tracked to serve as a setup template.
- Always run `git status` before committing to verify no configuration or key files are staged.

### 🧹 Cleaning Historical Leaks
If a credential (such as the client anon key or project URL) was committed to Git history:
1. **Rotate Keys**: Immediately go to your Supabase Dashboard -> Project Settings -> API and roll/rotate the compromised key.
2. **Purge History**: Use `git-filter-repo` (recommended) or `git filter-branch` to wipe the secret from the repository's history before pushing to public remotes:
   ```bash
   git filter-repo --invert-paths --path .env.local
   ```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 — Semantic, accessible, ARIA-ready |
| Styles | CSS3 — Custom properties, Flexbox, Grid, responsive breakpoints |
| Logic | TypeScript 5 + Modern ES2022 JavaScript |
| Backend | Supabase (PostgreSQL, Row Level Security, Auth PKCE) |
| Fallback | Browser `localStorage` for offline/guest mode |
| Tooling | Vite 7 & esbuild |
| Icons | Inline vector SVG — crisp at any resolution |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Animation | Native Canvas API confetti engine |




