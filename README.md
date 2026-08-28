# Habit Tracker

A modern web app for tracking daily habits, building streaks, and staying consistent. It features a clean dashboard with real-time stats, customizable categories, a 7-day check-in strip, analytics heatmap, and full auth support — all powered by TypeScript, Vite, and Supabase.

---

> **⚠️ Note:** The project will only work correctly after adding your own Supabase credentials.

## Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in the following credentials (found in your [Supabase Dashboard](https://supabase.com) under **Project Settings → API**):

   | Variable | Description |
   |----------|-------------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxxx.supabase.co`) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon / publishable API key |

3. Run the SQL schema in your Supabase SQL Editor:
   - Execute the contents of `supabase_schema.sql` to create the required tables and functions.

4. Install and start:
   ```bash
   npm install
   npm run dev
   ```
