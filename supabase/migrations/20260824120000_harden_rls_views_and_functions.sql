-- Applied remotely via MCP. Hardens views, RLS policies, and SECURITY DEFINER functions.

ALTER VIEW public.v_habit_analytics SET (security_invoker = true);
ALTER VIEW public.v_user_daily_summary SET (security_invoker = true);
ALTER VIEW public.v_activity_heatmap SET (security_invoker = true);

REVOKE ALL ON TABLE public.v_habit_analytics FROM anon, public;
REVOKE ALL ON TABLE public.v_user_daily_summary FROM anon, public;
REVOKE ALL ON TABLE public.v_activity_heatmap FROM anon, public;
GRANT SELECT ON TABLE public.v_habit_analytics TO authenticated;
GRANT SELECT ON TABLE public.v_user_daily_summary TO authenticated;
GRANT SELECT ON TABLE public.v_activity_heatmap TO authenticated;

REVOKE ALL ON TABLE public.profiles, public.categories, public.habits, public.habit_completions, public.habit_streaks, public.weekly_stats FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles, public.categories, public.habits, public.habit_completions TO authenticated;
GRANT SELECT ON TABLE public.habit_streaks, public.weekly_stats TO authenticated;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;
CREATE POLICY "Users can view their own categories" ON public.categories FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;
CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON public.habits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can insert their own completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can delete their own completions" ON public.habit_completions;
CREATE POLICY "Users can view their own completions" ON public.habit_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own completions" ON public.habit_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own completions" ON public.habit_completions FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own streaks" ON public.habit_streaks;
DROP POLICY IF EXISTS "System manages streak inserts" ON public.habit_streaks;
DROP POLICY IF EXISTS "System manages streak updates" ON public.habit_streaks;
CREATE POLICY "Users can view their own streaks" ON public.habit_streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own weekly stats" ON public.weekly_stats;
DROP POLICY IF EXISTS "System manages weekly stats inserts" ON public.weekly_stats;
DROP POLICY IF EXISTS "System manages weekly stats updates" ON public.weekly_stats;
CREATE POLICY "Users can view their own weekly stats" ON public.weekly_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER FUNCTION public.fn_set_updated_at() SET search_path = public;
ALTER FUNCTION public.fn_refresh_streak() SET search_path = public;
ALTER FUNCTION public.fn_refresh_weekly_stats() SET search_path = public;
ALTER FUNCTION public.fn_create_profile_on_signup() SET search_path = public;

REVOKE ALL ON FUNCTION public.fn_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_refresh_streak() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_refresh_weekly_stats() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_create_profile_on_signup() FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.get_consistency_score_7d(uuid);
CREATE OR REPLACE FUNCTION public.get_consistency_score_7d()
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT ROUND(
        COUNT(hc.id)::NUMERIC / NULLIF(COUNT(DISTINCT h.id) * 7, 0) * 100, 1
    )
    FROM public.habits h
    LEFT JOIN public.habit_completions hc
      ON hc.habit_id = h.id
     AND hc.completed_on >= CURRENT_DATE - 6
    WHERE h.user_id = auth.uid()
      AND h.is_archived = FALSE;
$$;

CREATE OR REPLACE FUNCTION public.archive_habit(p_habit_id uuid)
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
    SET is_archived = TRUE, updated_at = NOW()
    WHERE id = p_habit_id AND user_id = auth.uid();
END;
$$;

DROP FUNCTION IF EXISTS public.clear_all_habits(uuid);
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

REVOKE ALL ON FUNCTION public.get_consistency_score_7d() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.archive_habit(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.clear_all_habits() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_consistency_score_7d() TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_habit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_all_habits() TO authenticated;
