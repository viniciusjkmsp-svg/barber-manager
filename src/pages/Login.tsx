import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
const GOLD = "#C9A84C";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const [theme, setTheme] = useState<Theme>("dark");
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("ms_manager_theme") as Theme | null) || "dark";
    setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("ms_manager_theme", theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(safeNext, { replace: true });
    });
  }, [navigate, safeNext]);

  const isDark = theme === "dark";
  const bg = isDark ? "#0a0a0a" : "#f5f5f5";
  const cardBg = isDark ? "#111111" : "#ffffff";
  const cardBorder = isDark ? "#1f1f1f" : "#e5e5e5";
  const textPrimary = isDark ? "#f5f5f5" : "#111111";
  const textMuted = isDark ? "#888888" : "#444444";
  const inputBg = isDark ? "#0a0a0a" : "#f9f9f9";
  const inputBorder = isDark ? "#262626" : "#d4d4d4";
  const tabInactiveBg = isDark ? "#0a0a0a" : "#f0f0f0";
  const logoBg = isDark ? "#ffffff" : "#000000";
  const logoText = isDark ? "#000000" : "#ffffff";

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate(safeNext, { replace: true });
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("As senhas não coincidem");
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + safeNext,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada. Verifique seu e-mail se necessário.");
    navigate(safeNext, { replace: true });
  }

  async function handleForgotPassword() {
    if (!email) return toast.error("Digite seu e-mail primeiro");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });
    if (error) return toast.error(error.message);
    toast.success("E-mail de redefinição enviado");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: 8,
    color: textPrimary,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    color: textMuted,
    fontWeight: 500,
  };

  const primaryBtnStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: GOLD,
    color: "#000",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
    marginTop: 4,
  };

  return (
    <>
      <style>{`
        .ms-input:focus { border-color: ${GOLD} !important; }
        .ms-forgot:hover { color: ${GOLD} !important; }
        @media (max-width: 480px) {
          .ms-card { max-width: 100% !important; border-radius: 0 !important; padding: 24px 20px !important; border-left: none !important; border-right: none !important; }
          .ms-logo { width: 64px !important; height: 64px !important; font-size: 26px !important; }
          .ms-toggle-label { display: none !important; }
          .ms-wrap { padding: 24px 0 !important; }
          .ms-title { font-size: 22px !important; }
        }
      `}</style>
      <div
        className="ms-wrap"
        style={{
          minHeight: "100vh",
          background: bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: 999,
            color: textPrimary,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
          }}
          aria-label="Alternar tema"
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
          <span className="ms-toggle-label">{isDark ? "Escuro" : "Claro"}</span>
        </button>

        {/* Logo */}
        <div
          className="ms-logo"
          style={{
            width: 80,
            height: 80,
            background: logoBg,
            color: logoText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          MS
        </div>
        <h1
          className="ms-title"
          style={{
            color: textPrimary,
            fontSize: 26,
            fontWeight: 700,
            margin: "0 0 24px 0",
            letterSpacing: "-0.01em",
          }}
        >
          MS Manager
        </h1>

        {/* Card */}
        <div
          className="ms-card"
          style={{
            width: "100%",
            maxWidth: 400,
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: 12,
            padding: 32,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              padding: 4,
              background: tabInactiveBg,
              borderRadius: 10,
              marginBottom: 24,
            }}
          >
            {(["signin", "signup"] as const).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "10px",
                    background: active ? GOLD : "transparent",
                    color: active ? "#000" : textMuted,
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {t === "signin" ? "Entrar" : "Criar conta"}
                </button>
              );
            })}
          </div>

          {tab === "signin" ? (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input
                  className="ms-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Senha</label>
                <input
                  className="ms-input"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <button type="submit" disabled={busy} style={primaryBtnStyle}>
                {busy ? "Aguarde…" : "Entrar"}
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="ms-forgot"
                style={{
                  background: "none",
                  border: "none",
                  color: textMuted,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "center",
                  padding: 4,
                  transition: "color 0.15s",
                }}
              >
                Esqueci minha senha
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Nome completo</label>
                <input
                  className="ms-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input
                  className="ms-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Senha</label>
                <input
                  className="ms-input"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirmar senha</label>
                <input
                  className="ms-input"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <button type="submit" disabled={busy} style={primaryBtnStyle}>
                {busy ? "Aguarde…" : "Criar conta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
