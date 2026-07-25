import { useEffect, useRef, useState } from "react";
import {
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronsRight,
  ChevronsLeft,
  ChevronDown,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/context/ProfileContext";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GOLD = "#C9A84C";

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const navigate = useNavigate();
  const { profile: currentProfile, setProfile: setCurrentProfile, profiles, navItems } = useProfile();
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("ms-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("ms-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate("/login", { replace: true });
  };

  const isLight = theme === "light";
  const pick = (dark: string, light: string) => (isLight ? light : dark);

  const handleNav = (id: string) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{ background: pick("#0d0d0d", "#f5f5f7"), color: pick("#f5f5f7", "#1a1a1a") }}
    >
      {/* TOPBAR */}
      <header
        className="flex items-center justify-between px-3 sm:px-4 flex-shrink-0"
        style={{
          height: 56,
          background: pick("#111", "#fff"),
          borderBottom: `0.5px solid ${pick("#1e1e1e", "#e0e0e0")}`,
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-1 transition-transform hover:scale-110"
            style={{ color: pick("#888", "#666") }}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div
            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-transform hover:-rotate-6 hover:scale-105"
            style={{ background: pick("#fff", "#1a1a1a") }}
          >
            <span
              className="font-black text-sm tracking-tight"
              style={{ color: pick("#0d0d0d", "#f5f5f7") }}
            >
              MS
            </span>
          </div>
          <span className="text-[15px] font-medium hidden xs:inline">MS Manager</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all hover:scale-[1.02]"
            style={{
              background: pick("rgba(255,255,255,0.06)", "rgba(0,0,0,0.06)"),
              border: `0.5px solid ${pick("rgba(255,255,255,0.06)", "rgba(0,0,0,0.06)")}`,
            }}
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            <Sun className="w-4 h-4" style={{ color: isLight ? "#b8942e" : "#f5b342" }} />
            <div
              className="relative rounded-full"
              style={{
                width: 30,
                height: 16,
                background: pick("#333", "#ccc"),
              }}
            >
              <div
                className="absolute rounded-full transition-transform"
                style={{
                  width: 13,
                  height: 13,
                  top: 1.5,
                  left: 1.5,
                  background: isLight ? "#b8942e" : GOLD,
                  transform: isLight ? "translateX(14px)" : "translateX(0)",
                }}
              />
            </div>
            <Moon className="w-4 h-4" style={{ color: isLight ? "#888" : "#8a8a8a" }} />
          </button>

          {/* Profile switcher */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg transition-all"
              style={{
                background: pick("rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)"),
                border: `0.5px solid ${pick("#2a2a2a", "#ddd")}`,
              }}
              aria-label="Trocar perfil"
            >
              <div
                className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-semibold"
                style={{
                  background: `${currentProfile.color}22`,
                  border: `1px solid ${currentProfile.color}44`,
                  color: currentProfile.color,
                }}
              >
                {currentProfile.initial}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-[12px] font-medium" style={{ color: pick("#ddd", "#222") }}>
                  {currentProfile.name}
                </span>
                <span className="text-[10px]" style={{ color: currentProfile.color }}>
                  {currentProfile.role}
                </span>
              </div>
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform"
                style={{
                  color: pick("#555", "#888"),
                  transform: profileOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+6px)] w-[220px] rounded-[10px] overflow-hidden z-50"
                style={{
                  background: pick("#161616", "#fff"),
                  border: `0.5px solid ${pick("#2a2a2a", "#e0e0e0")}`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  className="px-3 pt-2.5 pb-2"
                  style={{ borderBottom: `0.5px solid ${pick("#1e1e1e", "#eee")}` }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.08em]"
                    style={{ color: pick("#444", "#888") }}
                  >
                    Visualizar como
                  </span>
                </div>
                {profiles.map((p) => {
                  const active = p.name === currentProfile.name;
                  return (
                    <button
                      key={p.name}
                      onClick={() => {
                        setCurrentProfile(p);
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors"
                      style={{
                        background: active
                          ? `${p.color}12`
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLButtonElement).style.background = pick("#1e1e1e", "#f2f2f2");
                      }}
                      onMouseLeave={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      <div
                        className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                        style={{ background: `${p.color}22`, color: p.color }}
                      >
                        {p.initial}
                      </div>
                      <div className="flex-1 text-left leading-tight">
                        <div className="text-[12px]" style={{ color: pick("#ccc", "#222") }}>
                          {p.name}
                        </div>
                        <div className="text-[10px]" style={{ color: pick("#555", "#888") }}>
                          {p.role}
                        </div>
                      </div>
                      {active && <Check className="w-3.5 h-3.5" style={{ color: p.color }} />}
                    </button>
                  );
                })}
                <div style={{ height: "0.5px", background: pick("#1e1e1e", "#eee") }} />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] transition-colors"
                  style={{ color: "#e05c5c" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = pick("#1e1e1e", "#faeaea");
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* remove old topbar closing was here */}

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR (desktop) */}
        <aside
          className="hidden md:flex flex-col flex-shrink-0 overflow-hidden transition-[width] duration-200"
          style={{
            width: expanded ? 200 : 52,
            background: pick("#111", "#fff"),
            borderRight: `0.5px solid ${pick("#1e1e1e", "#e0e0e0")}`,
          }}
        >
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center h-11 cursor-pointer transition-colors hover:text-[color:var(--gold)]"
            style={{
              justifyContent: expanded ? "flex-end" : "center",
              paddingRight: expanded ? 14 : 0,
              borderBottom: `0.5px solid ${pick("#1e1e1e", "#e0e0e0")}`,
              color: pick("#555", "#888"),
              ["--gold" as any]: GOLD,
            }}
            aria-label={expanded ? "Recolher" : "Expandir"}
            title={expanded ? "Recolher" : "Expandir"}
          >
            {expanded ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
          </button>

          <nav className="flex-1 flex flex-col gap-[2px] px-1.5 py-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  title={item.label}
                  className="relative flex items-center gap-2.5 p-2 rounded-lg whitespace-nowrap transition-all hover:translate-x-[2px]"
                  style={{
                    background: active ? `${GOLD}18` : "transparent",
                    color: active ? GOLD : pick("#666", "#666"),
                  }}
                >
                  {active && (
                    <span
                      className="absolute left-0 rounded-r"
                      style={{
                        top: "20%",
                        height: "60%",
                        width: 3,
                        background: GOLD,
                      }}
                    />
                  )}
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {expanded && (
                    <span className="text-[13px] truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div
            className="px-1.5 py-2"
            style={{ borderTop: `0.5px solid ${pick("#1e1e1e", "#e0e0e0")}` }}
          >
            <button
              onClick={handleLogout}
              title="Sair"
              className="w-full flex items-center gap-2.5 p-2 rounded-lg transition-all hover:translate-x-[2px]"
              style={{ color: pick("#666", "#666") }}
            >
              <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
              {expanded && <span className="text-[13px]">Sair</span>}
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {drawerOpen && (
          <div
            className="md:hidden absolute inset-0 z-10 transition-opacity"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
        <aside
          className={`md:hidden absolute top-0 left-0 bottom-0 z-20 w-[220px] flex flex-col transition-transform duration-200 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ background: pick("#111", "#fff") }}
        >
          <div
            className="flex items-center justify-between p-3.5"
            style={{ borderBottom: `0.5px solid ${pick("#1e1e1e", "#e0e0e0")}` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-[28px] h-[28px] rounded-lg flex items-center justify-center"
                style={{ background: pick("#fff", "#1a1a1a") }}
              >
                <span
                  className="text-xs font-black"
                  style={{ color: pick("#0d0d0d", "#f5f5f7") }}
                >
                  MS
                </span>
              </div>
              <span className="text-[13px] font-medium">MS Manager</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 transition-transform hover:rotate-90"
              style={{ color: pick("#888", "#666") }}
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-[2px] px-1.5 py-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg transition-all hover:translate-x-[3px]"
                  style={{
                    background: active ? `${GOLD}18` : "transparent",
                    color: active ? GOLD : pick("#aaa", "#666"),
                  }}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="text-[13px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* CONTENT */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6"
          style={{ background: pick("#0d0d0d", "#f5f5f7") }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
