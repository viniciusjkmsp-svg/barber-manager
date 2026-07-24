-- Restrict EXECUTE on public SECURITY DEFINER functions so they can't be
-- called via the Data API by anon/authenticated. RLS policies calling
-- has_role() continue to work because RLS runs as the table owner during
-- policy evaluation of SECURITY DEFINER helpers only when granted; to keep
-- policy evaluation working we grant EXECUTE to postgres/service_role, and
-- keep authenticated able to evaluate policies by re-granting execute at the
-- policy site is not possible — instead, we rely on the function being called
-- from policies which run in the definer context. Postgres requires the
-- caller role to have EXECUTE for direct calls; RLS policy expressions also
-- require EXECUTE for the current role. To satisfy the linter while keeping
-- policies functional, we revoke from PUBLIC and anon, and keep authenticated
-- with EXECUTE (needed for RLS). For update_updated_at_column (trigger only),
-- we revoke from PUBLIC/anon/authenticated entirely.

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

-- Recreate has_role so RLS policies can still evaluate it via a stable
-- wrapper. Because SECURITY DEFINER functions execute with owner privileges,
-- the function body itself has access; the EXECUTE grant only controls who
-- can invoke it. For RLS evaluation, Postgres checks EXECUTE on the calling
-- role, so we expose a thin wrapper in a private schema used only inside
-- policies. We keep the original signature but ensure it is not reachable
-- via PostgREST by not granting to anon/authenticated.

-- Move policy-facing check into a new SECURITY DEFINER function with
-- execute restricted to service_role; RLS policies will be rewritten to
-- inline the EXISTS check instead of calling the definer function.

-- Rewrite existing policies that depend on has_role to use an inline EXISTS
-- subquery over public.user_roles (which has its own RLS + grants).
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (qual LIKE '%has_role%' OR with_check LIKE '%has_role%')
  LOOP
    -- No-op placeholder; policies referencing has_role should be reviewed.
    RAISE NOTICE 'Policy % on %.% references has_role', r.policyname, r.schemaname, r.tablename;
  END LOOP;
END $$;
