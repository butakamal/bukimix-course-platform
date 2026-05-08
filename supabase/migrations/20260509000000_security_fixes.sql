-- Fix: set search_path = '' to prevent function hijacking via malicious schema injection

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Fix: revoke direct REST API execution of SECURITY DEFINER trigger function
-- handle_new_user is a trigger function only, not meant to be called via RPC
-- Must revoke from PUBLIC (not just anon/authenticated) since PUBLIC grants override individual role grants
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- Fix: wrap auth.uid() in SELECT for ~95% RLS performance improvement (initPlan optimization)

DROP POLICY "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = (SELECT auth.uid()));

DROP POLICY "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = (SELECT auth.uid()));

DROP POLICY "progress_select_own" ON public.progress;
CREATE POLICY "progress_select_own"
  ON public.progress FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY "progress_insert_own" ON public.progress;
CREATE POLICY "progress_insert_own"
  ON public.progress FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY "progress_delete_own" ON public.progress;
CREATE POLICY "progress_delete_own"
  ON public.progress FOR DELETE
  USING (user_id = (SELECT auth.uid()));
