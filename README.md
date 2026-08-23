<div align="center">
  <h1>⚡ Orbit Habit Tracker</h1>
  <p><strong>A modern, light-themed personal performance & habit tracking platform built with engineering precision and sleek SaaS aesthetics.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Design-Modern_Light_Theme-indigo?style=flat-square" alt="Light Theme">
    <img src="https://img.shields.io/badge/Language-TypeScript%20%2F%20JavaScript-blue?style=flat-square" alt="TypeScript">
    <img src="https://img.shields.io/badge/Styling-Custom_CSS3_Tokens-success?style=flat-square" alt="CSS3">
    <img src="https://img.shields.io/badge/Dependencies-Zero_External_Libs-orange?style=flat-square" alt="Zero Dependencies">
    <img src="https://img.shields.io/badge/Storage-LocalStorage_Engine-purple?style=flat-square" alt="LocalStorage">
  </p>
</div>

---

## 🌟 Overview

**Orbit** is a high-performance productivity web application designed to help individuals build compound consistency and achieve long-term mastery. It replaces clunky habit spreadsheets with an intuitive, visually stunning light-mode interface inspired by top-tier modern SaaS products.

### ✨ Key Features

- 🎯 **Real-Time KPI Dashboard**:
  - **Dynamic SVG Radial Ring**: Computes and visually renders daily goal completion percentages with smooth stroke-dash animations.
  - **Streak Flame Metric**: Calculates active continuous streaks and tracks all-time personal bests.
  - **7-Day Rolling Consistency Index**: Computes compound adherence rate across all active habits.

- 🗓️ **Interactive 7-Day Rolling Quick-Check Strip**:
  - Each habit card features an integrated 7-day calendar strip allowing instant single-click completion toggles for past days and today without opening modals.

- 📊 **GitHub-Style 30-Day Activity Heatmap**:
  - Activity matrix visualizing daily check-in intensity across 4 density levels (`level-0` through `level-3`) alongside per-habit completion rate progress bars.

- 🏷️ **Smart Categorization & Accent Color System**:
  - Filter habits by domain: 🏃 **Health**, 💼 **Productivity**, 📚 **Learning**, 🧘 **Mindfulness**, 💰 **Finance**, and ✨ **Lifestyle**.
  - Custom color token picker per habit for personalized card headers and progress indicators.

- 🔍 **Instant Multi-Filter & Search**:
  - Real-time search query matching across habit titles and descriptions.
  - Quick-switch filter segments (`All`, `Pending`, `Done Today`) and multi-parameter sorting (`By Streak`, `By Name`, `By Rate`, `By Newest`).

- 💾 **Data Portability & Backup**:
  - Single-click **JSON export** to backup all tracked data.
  - **JSON import** to restore habit logs anytime.
  - One-click **Demo Data Reset** to immediately showcase full features to recruiters and team members.

- 🎊 **Delightful Micro-Interactions**:
  - Custom HTML5 Canvas Confetti particle engine that celebrates habit completion milestones.
  - Responsive toast notification manager providing immediate feedback on user actions.

---

## 📐 Architecture & Engineering Highlights

```
habit-tracker/
├── index.html       # Clean semantic HTML5 structure with accessible modal dialogs & SVG icons
├── style.css        # Modular CSS3 design system with light-mode custom properties, elevation tokens & responsive media queries
├── script.js        # Production browser-ready JavaScript engine (zero bundler needed)
├── script.ts        # Strongly typed TypeScript source definitions & interfaces
└── README.md        # Technical documentation & project showcase
```

### 🧠 Core TypeScript Data Models

```typescript
export type HabitCategory = 'Health' | 'Productivity' | 'Learning' | 'Mindfulness' | 'Finance' | 'Lifestyle';
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
    id: number;
    name: string;
    description?: string;
    category: HabitCategory;
    frequency: HabitFrequency;
    color: string;
    createdAt: string;
    completions: string[]; // ISO Date strings 'YYYY-MM-DD'
}
```

---

## 🚀 Quick Start / Local Setup

This project is built with vanilla web standards and requires **zero build tooling or npm dependencies**.

1. **Clone the repository**:
   ```bash
   git clone git@github.com:itsidrissisaad/habit-tracker.git
   cd habit-tracker
   ```

2. **Launch the application**:
   - Simply double click or open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox).
   - Or use VS Code Live Server / Python HTTP server:
     ```bash
     python3 -m http.server 8000
     ```
   - Navigate to `http://localhost:8000`.

---

## 🎨 Design System Highlights

- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for clean legibility and modern SaaS aesthetics.
- **Color Tokens**:
  - Background Canvas: `#F8FAFC` (Slate-50)
  - Card Surfaces: `#FFFFFF` with multi-layered soft elevation shadows
  - Primary Brand: `#4F46E5` / `#6366F1` (Indigo Gradient)
  - Positive / Completion: `#10B981` (Emerald Mint)
  - Streaks: `#F59E0B` (Amber)

---

## 📄 License
MIT License. Created by [Idrissi Saad](https://github.com/itsidrissisaad).
