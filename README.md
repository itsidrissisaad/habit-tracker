<div align="center">
  <h1>⚡ Habit Tracker</h1>
  <p><strong>A modern, light-themed personal performance & habit tracking platform built with engineering precision and sleek SaaS aesthetics.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/App-Habit_Tracker-4F46E5?style=flat-square" alt="Habit Tracker">
    <img src="https://img.shields.io/badge/Design-Modern_Light_Theme-indigo?style=flat-square" alt="Light Theme">
    <img src="https://img.shields.io/badge/Language-TypeScript%20%2F%20JavaScript-blue?style=flat-square" alt="TypeScript">
    <img src="https://img.shields.io/badge/Icons-Professional_Vector_SVG-success?style=flat-square" alt="SVG Icons">
    <img src="https://img.shields.io/badge/Auth-Login_%26_Sign_Up-purple?style=flat-square" alt="Auth">
    <img src="https://img.shields.io/badge/Dependencies-Zero_External_Libs-orange?style=flat-square" alt="Zero Dependencies">
  </p>
</div>

---

## 🌟 Overview

**Habit Tracker** is a high-performance productivity web application designed to help individuals build compound consistency and achieve daily mastery. It features an intuitive, visually stunning light-mode interface inspired by top-tier modern SaaS products.

### ✨ Key Features

- 🔐 **User Authentication & Profile**:
  - Sign in, Create an Account, or Continue as Guest with persistent local session.
  - User avatar badge with initials, custom avatar colors, and personalized dynamic greetings (*"Good afternoon, Alex! 👋"*).

- 🎨 **Customizable Categories & Vector SVG Icons**:
  - Full CRUD on categories: create custom categories with custom names, custom color accents, and a library of 12+ crisp vector SVG icons (Target, Activity, Book, Briefcase, Dumbbell, Feather, Wallet, Coffee, Code, Sparkles, Sun, Droplet).
  - Filter habits by category with dynamic live habit count badges.

- 🎯 **Real-Time KPI Dashboard**:
  - **Dynamic SVG Radial Ring**: Computes and visually renders daily goal completion percentages with smooth animated stroke fills.
  - **Streak Flame Metric**: Calculates active continuous streaks and identifies your leading habit.
  - **7-Day Rolling Consistency Index**: Computes compound adherence rate across all active habits.

- 🗓️ **Interactive 7-Day Rolling Quick-Check Strip**:
  - Each habit card features an integrated 7-day calendar strip allowing single-click completion toggles for past days and today directly from the card.

- 💡 **Clarified Starter Inspirations**:
  - 1-click starter ideas (*Hydration 2L*, *Read 20 Mins*, *Morning Workout*, *Mindful Breathing*) with clear "+ Add" actions to kickstart routines.

- 📊 **GitHub-Style 30-Day Activity Heatmap**:
  - Activity matrix visualizing daily check-in intensity across 4 density levels (`level-0` through `level-3`) alongside per-habit completion rate progress bars.

- 💾 **Data Portability & Backup**:
  - Single-click **JSON export** to backup all tracked data.
  - **JSON import** to restore habit logs anytime.
  - **Demo Data Loader** to populate sample habits on demand.

- 🎊 **Delightful Micro-Interactions**:
  - Custom HTML5 Canvas Confetti particle engine celebrating habit check-ins.
  - Toast notification manager for real-time feedback.

---

## 📐 Architecture & Engineering Highlights

```
habit-tracker/
├── index.html       # Clean semantic HTML5 structure with accessible modal dialogs & vector SVG icons
├── style.css        # Modular CSS3 design system with light-mode custom properties & elevation tokens
├── script.js        # Production browser-ready JavaScript engine (zero bundler needed)
├── script.ts        # Strongly typed TypeScript source definitions & interfaces
└── README.md        # Technical documentation & project showcase
```

### 🧠 Core TypeScript Data Models

```typescript
export interface UserProfile {
    name: string;
    email: string;
    avatarColor: string;
    isGuest: boolean;
}

export interface CustomCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface Habit {
    id: number;
    name: string;
    description?: string;
    category: string;
    frequency: 'daily' | 'weekly' | 'monthly';
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
   - Simply double click or open `index.html` in any modern web browser.
   - Or use a lightweight local server:
     ```bash
     python3 -m http.server 8000
     ```
   - Navigate to `http://localhost:8000`.

---

## 📄 License
MIT License. Created by [Idrissi Saad](https://github.com/itsidrissisaad).
