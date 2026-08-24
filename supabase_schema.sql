-- ============================================================
--  HABIT TRACKER — Supabase PostgreSQL Migration Script
--  Ready to paste directly into the Supabase SQL Editor
--  Author  : Idrissi Saad
--  Version : 1.0.0
-- ============================================================

-- ============================================================
-- 0. CLEANUP (Ensures script can be re-run safely)
-- ============================================================
DROP TABLE IF EXISTS public.weekly_stats CASCADE;
DROP TABLE IF EXISTS public.habit_streaks CASCADE;
DROP TABLE IF EXISTS public.habit_completions CASCADE;
DROP TABLE IF EXISTS public.habits CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- query analytics


-- ============================================================
-- 1. USER PROFILES
--    Extends Supabase auth.users with app-level profile data.
--    A row is created automatically via trigger on sign-up.
-- ============================================================
CREATE TABLE public.profiles (
    id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name            TEXT        NOT NULL DEFAULT 'User',
    email           TEXT        NOT NULL,
    avatar_color    TEXT        NOT NULL DEFAULT '#4F46E5',
    is_guest        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.profiles IS 'App-level user profile that mirrors auth.users.';
COMMENT ON COLUMN public.profiles.avatar_color IS 'Hex color code used for the user avatar badge.';
COMMENT ON COLUMN public.profiles.is_guest     IS 'TRUE when the user authenticated anonymously.';


-- ============================================================
-- 2. CATEGORIES
--    User-defined habit categories with icon & color accents.
-- ============================================================
CREATE TABLE public.categories (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    icon_key    TEXT        NOT NULL DEFAULT 'target',
    color       TEXT        NOT NULL DEFAULT '#4F46E5',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT categories_name_length  CHECK (char_length(name) BETWEEN 1 AND 80),
    CONSTRAINT categories_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    UNIQUE (user_id, name)   -- a user cannot have two identically named categories
);

COMMENT ON TABLE  public.categories IS 'Custom habit categories owned by a user.';
COMMENT ON COLUMN public.categories.icon_key IS 'Key into the SVG_ICONS dictionary in the front-end.';


-- ============================================================
-- 3. HABITS
--    Core habit records with frequency, color, and metadata.
-- ============================================================
DROP TYPE IF EXISTS habit_frequency CASCADE;
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE public.habits (
    id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID            NOT NULL REFERENCES public.profiles(id)    ON DELETE CASCADE,
    category_id     UUID            REFERENCES public.categories(id)           ON DELETE SET NULL,
    name            TEXT            NOT NULL,
    description     TEXT,
    frequency       habit_frequency NOT NULL DEFAULT 'daily',
    color           TEXT            NOT NULL DEFAULT '#4F46E5',
    is_archived     BOOLEAN         NOT NULL DEFAULT FALSE,
    sort_order      INTEGER         NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT habits_name_length   CHECK (char_length(name) BETWEEN 1 AND 120),
    CONSTRAINT habits_color_format  CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE  public.habits IS 'Individual habit definitions belonging to a user.';
COMMENT ON COLUMN public.habits.is_archived   IS 'Soft-delete: archived habits are hidden but data is preserved.';
COMMENT ON COLUMN public.habits.sort_order    IS 'Manual display ordering within the dashboard grid.';


-- ============================================================
-- 4. HABIT COMPLETIONS
--    One row per (habit, date) — a user checks in a habit
--    on a specific calendar date (UTC).
-- ============================================================
CREATE TABLE public.habit_completions (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id    UUID        NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completed_on DATE        NOT NULL DEFAULT CURRENT_DATE,
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- A habit can only be completed once per calendar day
    UNIQUE (habit_id, completed_on),
    CONSTRAINT completions_note_length CHECK (char_length(note) <= 500)
);

COMMENT ON TABLE  public.habit_completions IS 'Daily check-in records — one row per (habit, date).';
COMMENT ON COLUMN public.habit_completions.completed_on IS 'Calendar date (UTC) the habit was completed.';
COMMENT ON COLUMN public.habit_completions.note         IS 'Optional free-text journal note for the check-in.';


-- ============================================================
-- 5. STREAK SNAPSHOTS
--    Materialised streak data updated by a DB function/trigger.
--    Avoids recalculating streaks in real-time on every read.
-- ============================================================
CREATE TABLE public.habit_streaks (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id        UUID        NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE UNIQUE,
    user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak  INTEGER     NOT NULL DEFAULT 0,
    longest_streak  INTEGER     NOT NULL DEFAULT 0,
    last_completed  DATE,
    total_completions INTEGER   NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT streaks_current_non_negative CHECK (current_streak >= 0),
    CONSTRAINT streaks_longest_non_negative CHECK (longest_streak >= 0),
    CONSTRAINT streaks_longest_gte_current  CHECK (longest_streak >= current_streak)
);

COMMENT ON TABLE  public.habit_streaks IS 'Pre-computed streak snapshot per habit — refreshed by trigger.';
COMMENT ON COLUMN public.habit_streaks.current_streak IS 'Consecutive days streak as of today or yesterday.';
COMMENT ON COLUMN public.habit_streaks.longest_streak IS 'All-time personal best streak for this habit.';


-- ============================================================
-- 6. WEEKLY COMPLETION STATISTICS
--    Aggregated stats per (user, habit, ISO week) for the
--    analytics dashboard and consistency score calculation.
-- ============================================================
CREATE TABLE public.weekly_stats (
    id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id        UUID    NOT NULL REFERENCES public.habits(id)   ON DELETE CASCADE,
    week_start      DATE    NOT NULL,   -- Monday of the ISO week
    completions     INTEGER NOT NULL DEFAULT 0,
    target          INTEGER NOT NULL DEFAULT 7,  -- expected completions for that week
    adherence_pct   NUMERIC(5,2) GENERATED ALWAYS AS (
                        CASE WHEN target = 0 THEN 0
                             ELSE ROUND((completions::NUMERIC / target) * 100, 2)
                        END
                    ) STORED,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, habit_id, week_start),
    CONSTRAINT weekly_completions_non_negative CHECK (completions >= 0),
    CONSTRAINT weekly_target_positive          CHECK (target > 0)
);

COMMENT ON TABLE  public.weekly_stats IS 'Aggregated weekly check-in stats per habit — used for the 7-day consistency score.';
COMMENT ON COLUMN public.weekly_stats.week_start    IS 'ISO Monday date of the aggregated week.';
COMMENT ON COLUMN public.weekly_stats.adherence_pct IS 'Computed: (completions / target) * 100.';


-- ============================================================
-- 7. ANALYTICS VIEWS
-- ============================================================

-- 7a. Per-habit analytics summary (used on the analytics modal)
CREATE OR REPLACE VIEW public.v_habit_analytics
WITH (security_invoker = true) AS
SELECT
    h.id                                            AS habit_id,
    h.user_id,
    h.name                                          AS habit_name,
    h.frequency,
    h.color,
    c.name                                          AS category_name,
    c.icon_key                                      AS category_icon,
    hs.current_streak,
    hs.longest_streak,
    hs.total_completions,
    hs.last_completed,
    -- 7-day rolling completions count
    COUNT(hc.id) FILTER (
        WHERE hc.completed_on >= CURRENT_DATE - INTERVAL '6 days'
    )                                               AS completions_last_7_days,
    -- 30-day rolling completions count
    COUNT(hc.id) FILTER (
        WHERE hc.completed_on >= CURRENT_DATE - INTERVAL '29 days'
    )                                               AS completions_last_30_days,
    -- 7-day adherence percentage (daily habits only)
    CASE WHEN h.frequency = 'daily'
         THEN ROUND(
                COUNT(hc.id) FILTER (
                    WHERE hc.completed_on >= CURRENT_DATE - INTERVAL '6 days'
                )::NUMERIC / 7 * 100, 1)
         ELSE NULL
    END                                             AS adherence_7d_pct
FROM  public.habits           h
LEFT  JOIN public.categories   c  ON c.id = h.category_id
LEFT  JOIN public.habit_streaks hs ON hs.habit_id = h.id
LEFT  JOIN public.habit_completions hc ON hc.habit_id = h.id
WHERE h.is_archived = FALSE
GROUP BY h.id, h.user_id, h.name, h.frequency, h.color,
         c.name, c.icon_key,
         hs.current_streak, hs.longest_streak, hs.total_completions, hs.last_completed;

COMMENT ON VIEW public.v_habit_analytics IS 'Per-habit analytics summary: streaks, rolling counts, adherence %.';


-- 7b. User-level daily dashboard summary (metrics cards)
CREATE OR REPLACE VIEW public.v_user_daily_summary
WITH (security_invoker = true) AS
SELECT
    h.user_id,
    CURRENT_DATE                                            AS report_date,
    COUNT(DISTINCT h.id)                                    AS total_habits,
    COUNT(DISTINCT hc.habit_id)
        FILTER (WHERE hc.completed_on = CURRENT_DATE)       AS completed_today,
    ROUND(
        COUNT(DISTINCT hc.habit_id)
            FILTER (WHERE hc.completed_on = CURRENT_DATE)::NUMERIC
        / NULLIF(COUNT(DISTINCT h.id), 0) * 100, 1
    )                                                       AS completion_pct_today,
    COALESCE(MAX(hs.current_streak), 0)                     AS best_active_streak,
    COALESCE(SUM(hs.total_completions), 0)                  AS all_time_check_ins,
    -- 7-day rolling consistency across all habits
    ROUND(
        COUNT(hc.id)
            FILTER (WHERE hc.completed_on >= CURRENT_DATE - INTERVAL '6 days')::NUMERIC
        / NULLIF(COUNT(DISTINCT h.id) * 7, 0) * 100, 1
    )                                                       AS consistency_score_7d
FROM  public.habits             h
LEFT  JOIN public.habit_completions hc  ON hc.habit_id = h.id
LEFT  JOIN public.habit_streaks     hs  ON hs.habit_id = h.id
WHERE h.is_archived = FALSE
GROUP BY h.user_id;

COMMENT ON VIEW public.v_user_daily_summary IS 'Aggregated KPI metrics per user for the dashboard metrics cards.';


-- 7c. 30-day heatmap data (GitHub-style activity grid)
CREATE OR REPLACE VIEW public.v_activity_heatmap
WITH (security_invoker = true) AS
SELECT
    hc.user_id,
    hc.completed_on,
    COUNT(hc.id)                                   AS total_completions,
    CASE
        WHEN COUNT(hc.id) = 0 THEN 0
        WHEN COUNT(hc.id) = 1 THEN 1
        WHEN COUNT(hc.id) = 2 THEN 2
        ELSE 3
    END                                            AS density_level   -- 0..3 maps to CSS level-0..level-3
FROM  public.habit_completions hc
WHERE hc.completed_on >= CURRENT_DATE - INTERVAL '29 days'
GROUP BY hc.user_id, hc.completed_on
ORDER BY hc.completed_on;

COMMENT ON VIEW public.v_activity_heatmap IS '30-day daily check-in heatmap data; density_level maps to CSS classes.';


-- ============================================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================================

-- 8a. Auto-update updated_at timestamp on any row change
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Attach to tables that have updated_at
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_weekly_stats_updated_at
    BEFORE UPDATE ON public.weekly_stats
    FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


-- 8b. Recalculate streak snapshot whenever a completion is added or deleted
CREATE OR REPLACE FUNCTION public.fn_refresh_streak()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_habit_id      UUID;
    v_user_id       UUID;
    v_total         INTEGER;
    v_current       INTEGER := 0;
    v_longest       INTEGER := 0;
    v_run           INTEGER := 0;
    v_last          DATE    := NULL;
    v_prev_date     DATE;
    v_check_date    DATE;
    v_dates         DATE[];
    i               INTEGER;
BEGIN
    -- Determine which habit was affected
    IF TG_OP = 'DELETE' THEN
        v_habit_id := OLD.habit_id;
        v_user_id  := OLD.user_id;
    ELSE
        v_habit_id := NEW.habit_id;
        v_user_id  := NEW.user_id;
    END IF;

    -- Fetch all completion dates for this habit, sorted ascending
    SELECT ARRAY_AGG(completed_on ORDER BY completed_on ASC),
           COUNT(*)::INTEGER,
           MAX(completed_on)
    INTO   v_dates, v_total, v_last
    FROM   public.habit_completions
    WHERE  habit_id = v_habit_id;

    -- Calculate longest streak (consecutive days)
    IF v_dates IS NOT NULL AND array_length(v_dates, 1) > 0 THEN
        v_run     := 1;
        v_longest := 1;
        FOR i IN 2..array_length(v_dates, 1) LOOP
            IF v_dates[i] - v_dates[i-1] = 1 THEN
                v_run := v_run + 1;
                IF v_run > v_longest THEN v_longest := v_run; END IF;
            ELSE
                v_run := 1;
            END IF;
        END LOOP;
    END IF;

    -- Calculate current streak (must include today or yesterday)
    IF v_last IS NOT NULL AND v_last >= CURRENT_DATE - 1 THEN
        v_check_date := CURRENT_DATE;
        -- If today not yet completed, start from yesterday
        IF v_last < CURRENT_DATE THEN
            v_check_date := CURRENT_DATE - 1;
        END IF;
        -- Walk backwards
        LOOP
            EXIT WHEN NOT (v_check_date = ANY(v_dates));
            v_current    := v_current + 1;
            v_check_date := v_check_date - 1;
        END LOOP;
    END IF;

    -- Upsert streak row
    INSERT INTO public.habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completed, total_completions, updated_at)
    VALUES (v_habit_id, v_user_id, v_current, v_longest, v_last, COALESCE(v_total, 0), NOW())
    ON CONFLICT (habit_id) DO UPDATE
        SET current_streak    = EXCLUDED.current_streak,
            longest_streak    = GREATEST(habit_streaks.longest_streak, EXCLUDED.longest_streak),
            last_completed    = EXCLUDED.last_completed,
            total_completions = EXCLUDED.total_completions,
            updated_at        = NOW();

    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_refresh_streak_on_insert
    AFTER INSERT OR DELETE ON public.habit_completions
    FOR EACH ROW EXECUTE FUNCTION public.fn_refresh_streak();


-- 8c. Upsert weekly stats whenever a completion is inserted or deleted
CREATE OR REPLACE FUNCTION public.fn_refresh_weekly_stats()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_habit_id  UUID;
    v_user_id   UUID;
    v_date      DATE;
    v_week_start DATE;
    v_count     INTEGER;
    v_target    INTEGER;
    v_freq      habit_frequency;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_habit_id := OLD.habit_id;
        v_user_id  := OLD.user_id;
        v_date     := OLD.completed_on;
    ELSE
        v_habit_id := NEW.habit_id;
        v_user_id  := NEW.user_id;
        v_date     := NEW.completed_on;
    END IF;

    -- ISO week Monday
    v_week_start := date_trunc('week', v_date)::DATE;

    -- Count completions for (habit, week)
    SELECT COUNT(*) INTO v_count
    FROM   public.habit_completions
    WHERE  habit_id     = v_habit_id
    AND    completed_on >= v_week_start
    AND    completed_on <  v_week_start + 7;

    -- Determine weekly target based on frequency
    SELECT frequency INTO v_freq FROM public.habits WHERE id = v_habit_id;
    v_target := CASE v_freq
        WHEN 'daily'   THEN 7
        WHEN 'weekly'  THEN 1
        WHEN 'monthly' THEN 1
        ELSE 7
    END;

    INSERT INTO public.weekly_stats (user_id, habit_id, week_start, completions, target, updated_at)
    VALUES (v_user_id, v_habit_id, v_week_start, v_count, v_target, NOW())
    ON CONFLICT (user_id, habit_id, week_start) DO UPDATE
        SET completions = EXCLUDED.completions,
            target      = EXCLUDED.target,
            updated_at  = NOW();

    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_refresh_weekly_stats
    AFTER INSERT OR DELETE ON public.habit_completions
    FOR EACH ROW EXECUTE FUNCTION public.fn_refresh_weekly_stats();


-- 8d. Auto-create profile row when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.fn_create_profile_on_signup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, avatar_color, is_guest)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'User'),
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_color', '#4F46E5'),
        COALESCE((NEW.raw_user_meta_data->>'is_guest')::BOOLEAN, FALSE)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_profile_on_signup ON auth.users;
CREATE TRIGGER trg_create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.fn_create_profile_on_signup();


-- ============================================================
-- 9. INDEXES  (performance-critical query paths)
-- ============================================================

-- Habits filtered by user and active status
CREATE INDEX idx_habits_user_id        ON public.habits(user_id);
CREATE INDEX idx_habits_category_id    ON public.habits(category_id);
CREATE INDEX idx_habits_is_archived    ON public.habits(user_id, is_archived);

-- Completions — most queries filter by habit + date range
CREATE INDEX idx_completions_habit_id       ON public.habit_completions(habit_id);
CREATE INDEX idx_completions_user_id        ON public.habit_completions(user_id);
CREATE INDEX idx_completions_completed_on   ON public.habit_completions(completed_on DESC);
CREATE INDEX idx_completions_habit_date     ON public.habit_completions(habit_id, completed_on DESC);
CREATE INDEX idx_completions_user_date      ON public.habit_completions(user_id,  completed_on DESC);

-- Streaks — point-lookup by habit
CREATE INDEX idx_streaks_user_id    ON public.habit_streaks(user_id);
CREATE INDEX idx_streaks_habit_id   ON public.habit_streaks(habit_id);

-- Categories — filtered by user
CREATE INDEX idx_categories_user_id ON public.categories(user_id);

-- Weekly stats — range queries per user + week
CREATE INDEX idx_weekly_stats_user_week  ON public.weekly_stats(user_id, week_start DESC);
CREATE INDEX idx_weekly_stats_habit_week ON public.weekly_stats(habit_id, week_start DESC);


-- ============================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_stats      ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ---- categories ----
CREATE POLICY "Users can view their own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

-- ---- habits ----
CREATE POLICY "Users can view their own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

-- ---- habit_completions ----
CREATE POLICY "Users can view their own completions"
    ON public.habit_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions"
    ON public.habit_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions"
    ON public.habit_completions FOR DELETE
    USING (auth.uid() = user_id);

-- ---- habit_streaks ----
CREATE POLICY "Users can view their own streaks"
    ON public.habit_streaks FOR SELECT
    USING (auth.uid() = user_id);

-- Streaks are only mutated by SECURITY DEFINER functions — no direct user writes
CREATE POLICY "System manages streak inserts"
    ON public.habit_streaks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System manages streak updates"
    ON public.habit_streaks FOR UPDATE
    USING (auth.uid() = user_id);

-- ---- weekly_stats ----
CREATE POLICY "Users can view their own weekly stats"
    ON public.weekly_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System manages weekly stats inserts"
    ON public.weekly_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System manages weekly stats updates"
    ON public.weekly_stats FOR UPDATE
    USING (auth.uid() = user_id);


-- ============================================================
-- 11. HELPER STORED PROCEDURES (callable from the client)
-- ============================================================

-- Soft-archive a habit (preserves all history)
CREATE OR REPLACE FUNCTION public.archive_habit(p_habit_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    UPDATE public.habits
    SET    is_archived = TRUE,
           updated_at  = NOW()
    WHERE  id      = p_habit_id
    AND    user_id = auth.uid();
END;
$$;

-- Get the authenticated user's 7-day consistency score (0-100)
CREATE OR REPLACE FUNCTION public.get_consistency_score_7d()
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT ROUND(
        COUNT(hc.id)::NUMERIC
        / NULLIF(COUNT(DISTINCT h.id) * 7, 0) * 100, 1
    )
    FROM  public.habits h
    LEFT JOIN public.habit_completions hc
           ON hc.habit_id    = h.id
          AND hc.completed_on >= CURRENT_DATE - 6
    WHERE h.user_id     = auth.uid()
    AND   h.is_archived = FALSE;
$$;

-- Bulk-delete all habits for the authenticated user (Clear All from the dashboard)
CREATE OR REPLACE FUNCTION public.clear_all_habits()
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    DELETE FROM public.habits WHERE user_id = auth.uid();
END;
$$;

-- Revoke execute permissions from public/anon and grant to authenticated
REVOKE ALL ON FUNCTION public.archive_habit(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_consistency_score_7d() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.clear_all_habits() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.archive_habit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_consistency_score_7d() TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_all_habits() TO authenticated;



-- ============================================================
-- END OF MIGRATION
-- ============================================================
