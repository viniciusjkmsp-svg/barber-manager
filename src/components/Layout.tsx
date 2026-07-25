import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  CalendarRange,
  Users,
  ShoppingCart,
  Package,
  CreditCard,
  CalendarCheck,
  UserPlus,
  DollarSign,
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

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GOLD = "#C9A84C";

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profiles = [
    { initial: "M", name: "Marcos", role: "Proprietário", color: "#C9A84C" },
    { initial: "S", name: "Silvia", role: "Sócia", color: "#a67dd4" },
    { initial: "G", name: "Gerente", role: "Gerente", color: "#4caf7d" },
    { initial: "R", name: "Recepção", role: "Recepção", color: "#4c9af5" },
    { initial: "B", name: "Barbeiro", role: "Barbeiro", color: "#e05c5c" },
    { initial: "Mk", name: "Marketing", role: "Marketing", color: "#e0a44c" },
  ];
  const [currentProfile, setCurrentProfile] = useState(() => {
    if (typeof window === "undefined") return profiles[0];
    const saved = localStorage.getItem("ms-profile");
    if (saved) {
      const found = profiles.find((p) => p.name === saved);
      if (found) return found;
    }
    return profiles[0];
  });
  useEffect(() => {
    localStorage.setItem("ms-profile", currentProfile.name);
  }, [currentProfile]);
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

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "daily", label: "Controle Diário", icon: Calendar },
    { id: "agenda", label: "Agenda", icon: CalendarCheck },
    { id: "weekly", label: "Semanal", icon: CalendarDays },
    { id: "monthly", label: "Mensal", icon: CalendarRange },
    { id: "professionals", label: "Cabeleireiros", icon: Users },
    { id: "clients", label: "Clientes", icon: UserPlus },
    { id: "prosthesis", label: "Vendas & Mentoria", icon: ShoppingCart },
    { id: "products", label: "Estoque", icon: Package },
    { id: "plans", label: "Planos", icon: CreditCard },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
  ];

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

          <div className="flex items-center gap-2">
            <div
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-medium"
              style={{
                background: pick("#C9A84C22", "#e8e8e8"),
                border: `1px solid ${pick("#C9A84C44", "#ccc")}`,
                color: pick(GOLD, "#666"),
              }}
            >
              A
            </div>
            <span
              className="text-xs hidden sm:inline"
              style={{ color: pick("#888", "#666") }}
            >
              Administrador
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: pick("rgba(255,255,255,0.06)", "rgba(0,0,0,0.05)"),
              color: pick("#ccc", "#333"),
            }}
            aria-label="Sair"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

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
