import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, LayoutDashboard, Calendar, CalendarDays, CalendarRange, Users, ShoppingCart, Package, CreditCard, CalendarCheck, UserPlus, DollarSign, Menu, X, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "daily", label: "Controle Diário", icon: Calendar },
    { id: "agenda", label: "Agenda", icon: CalendarCheck },
    { id: "weekly", label: "Visualização Semanal", icon: CalendarDays },
    { id: "monthly", label: "Visualização Mensal", icon: CalendarRange },
    { id: "professionals", label: "Cabeleireiros", icon: Users },
    { id: "clients", label: "Clientes", icon: UserPlus },
    { id: "prosthesis", label: "Vendas & Mentoria", icon: ShoppingCart },
    { id: "products", label: "Produtos & Estoque", icon: Package },
    { id: "plans", label: "Planos & Mensalidades", icon: CreditCard },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setOpen(false);
  };

  const NavList = ({ compact = false }: { compact?: boolean }) => (
    <ul className="space-y-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <li key={item.id}>
            <button
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left ${
                active
                  ? "bg-[#181818] text-[#C9A84C] border-l-2 border-[#C9A84C] font-semibold shadow-sm"
                  : "text-zinc-400 hover:bg-[#141414] hover:text-zinc-200"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? "text-[#C9A84C]" : "text-zinc-400"}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="bg-[#0D0D0D] border-b border-[#1F1F1F] text-foreground shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile menu trigger */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-foreground hover:bg-[#1A1A1A] hover:text-[#C9A84C]"
                    aria-label="Abrir menu"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[#0D0D0D] text-foreground border-[#1F1F1F]">
                  <div className="flex items-center justify-between px-4 py-4 border-b border-[#1F1F1F]">
                    <div className="flex items-center gap-2.5 font-bold">
                      <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center">
                        <Scissors className="w-4 h-4 text-[#C9A84C]" />
                      </div>
                      <span className="text-base text-foreground font-bold tracking-tight">Barber Manager</span>
                    </div>
                  </div>
                  <nav className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
                    <NavList />
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2.5 text-base sm:text-xl font-bold min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center shrink-0">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A84C]" />
                </div>
                <span className="truncate text-foreground font-bold tracking-tight">Barber Manager</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] font-semibold">
                  <span className="text-xs">BM</span>
                </div>
                <span className="text-sm hidden sm:inline text-zinc-300 font-medium">Administrador</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 px-2.5 py-1.5 h-8 text-xs font-medium border border-transparent hover:border-red-500/20 transition-all"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
          {/* Mobile active section label */}
          <div className="lg:hidden mt-2 text-xs text-[#C9A84C] font-medium truncate">
            {activeLabel}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-64px)] bg-[#0D0D0D] text-sidebar-foreground border-r border-[#1F1F1F] shadow-xl">
          <nav className="p-4">
            <NavList />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
};
