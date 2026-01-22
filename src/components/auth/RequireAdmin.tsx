import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useLocation, useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

type RequireAdminProps = {
  children: React.ReactNode;
};

export const RequireAdmin = ({ children }: RequireAdminProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const redirectTo = useMemo(() => {
    const current = `${location.pathname}${location.search}${location.hash}`;
    return encodeURIComponent(current);
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setIsAdmin(null);

      if (!session?.user) {
        if (!cancelled) {
          setLoading(false);
          navigate(`/admin?redirect=${redirectTo}`, { replace: true });
        }
        return;
      }

      const { data, error } = await (supabase as any).rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });

      if (cancelled) return;

      if (error) {
        setIsAdmin(false);
        setLoading(false);
        navigate(`/admin?redirect=${redirectTo}`, { replace: true });
        return;
      }

      const ok = Boolean(data);
      setIsAdmin(ok);
      setLoading(false);

      if (!ok) {
        await supabase.auth.signOut();
        navigate(`/admin?redirect=${redirectTo}`, { replace: true });
      }
    };

    // Avoid running before session is resolved at least once
    if (session === null) {
      // If session is null, it might be either unresolved or truly signed-out.
      // We'll still run to redirect; any flicker is minimal.
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate, redirectTo, session]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Verificando acesso…</div>
      </div>
    );
  }

  return <>{children}</>;
};
