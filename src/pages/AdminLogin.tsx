import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Mail, UserPlus } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").max(100),
});

const signupSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").max(100),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/painel";
  }, [location.search]);

  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        // defer any backend call outside the callback
        setTimeout(async () => {
          const { data } = await (supabase as any).rpc("has_role", {
            _user_id: session.user.id,
            _role: "admin",
          });
          if (data) navigate(redirect, { replace: true });
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      if (!s?.user) return;
      setTimeout(async () => {
        const { data: isAdmin } = await (supabase as any).rpc("has_role", {
          _user_id: s.user.id,
          _role: "admin",
        });
        if (isAdmin) navigate(redirect, { replace: true });
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirect]);

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error || !data.session?.user) {
        toast({
          title: "Não foi possível entrar",
          description: error?.message || "Verifique seu e-mail e senha.",
          variant: "destructive",
        });
        return;
      }

      const { data: isAdmin, error: roleErr } = await (supabase as any).rpc("has_role", {
        _user_id: data.session.user.id,
        _role: "admin",
      });

      if (roleErr || !isAdmin) {
        await supabase.auth.signOut();
        toast({
          title: "Acesso negado",
          description: "Este usuário não tem permissão de administrador.",
          variant: "destructive",
        });
        return;
      }

      navigate(redirect, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: SignupForm) => {
    setLoading(true);
    try {
      const emailRedirectTo = `${window.location.origin}/admin`;
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo },
      });

      if (error) {
        toast({
          title: "Não foi possível cadastrar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Conta criada",
        description:
          `Agora é preciso liberar este usuário como administrador no backend (papel admin). ID do usuário: ${data.user?.id ?? "(indisponível)"}`,
      });

      // If a session exists immediately, we still block until role is granted.
      if (data.session?.user) {
        await supabase.auth.signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Acesso do Administrador
          </CardTitle>
          <CardDescription>
            Entre com seu usuário administrador para acessar o painel de controle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form
                className="space-y-4"
                onSubmit={loginForm.handleSubmit(handleLogin)}
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      className="pl-9"
                      {...loginForm.register("email")}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando…
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form
                className="space-y-4"
                onSubmit={signupForm.handleSubmit(handleSignup)}
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    {...signupForm.register("password")}
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando…
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Criar conta
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminLogin;
