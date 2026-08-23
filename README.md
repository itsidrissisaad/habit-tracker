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
- Persistent local session via `localStorage`

---

### 🎨 Fully Customizable Categories
- Create, edit, and delete your own categories
- Choose from **12+ professional vector SVG icons** (no emojis — clean and scalable at any resolution)
- Assign a custom color accent per category
- Live habit count badges per category in the sidebar

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

## 🗂️ Project Structure

```
habit-tracker/
├── index.html      # Semantic HTML5 — modals, layouts, accessible structure
├── style.css       # CSS design system — custom properties, light-mode tokens, elevation
├── script.js       # Production-ready vanilla JavaScript engine
├── script.ts       # Strongly typed TypeScript source with interfaces & models
├── favicon.svg     # SVG favicon — matches the brand logo exactly
└── README.md       # Project documentation & showcase
```

---

## 🧠 Core TypeScript Interfaces

```typescript
interface UserProfile {
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
    id: number;
    name: string;
    description?: string;
    category: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    color: string;
    createdAt: string;
    completions: string[]; // ISO dates → 'YYYY-MM-DD'
}
```

---

## ⚡ Quick Start

Zero build tooling required. Works straight from the file system.

**1. Clone the repository**
```bash
git clone git@github.com:itsidrissisaad/habit-tracker.git
cd habit-tracker
```

**2a. Open directly in browser**
```bash
# macOS
open index.html

# Linux
xdg-open index.html
```

**2b. Or serve locally**
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 — Semantic, accessible, ARIA-ready |
| Styles | CSS3 — Custom properties, Flexbox, Grid |
| Logic | Vanilla ES2022 JavaScript (no bundler) |
| Types | TypeScript 5 — Strict interfaces & types |
| Icons | Inline vector SVG — crisp at any resolution |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Storage | Browser `localStorage` — zero server required |
| Animation | Native Canvas API confetti engine |

---


