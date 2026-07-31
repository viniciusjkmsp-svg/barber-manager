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
    <ul className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <li key={item.id}>
            <button
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label ?? "";

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile menu trigger */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    aria-label="Abrir menu"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-sidebar-border">
                  <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
                    <div className="flex items-center gap-2 font-bold">
                      <Scissors className="w-5 h-5" />
                      <span>Barbearia Estilo</span>
                    </div>
                  </div>
                  <nav className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
                    <NavList />
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2 text-base sm:text-xl font-bold min-w-0">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span className="truncate">Barbearia Estilo</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-sm">A</span>
                </div>
                <span className="text-sm hidden sm:inline">Administrador</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-primary-foreground/20 flex items-center gap-1 px-2.5 py-1.5 h-8 text-xs font-medium"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
          {/* Mobile active section label */}
          <div className="lg:hidden mt-2 text-xs opacity-80 truncate">
            {activeLabel}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-64px)] bg-sidebar text-sidebar-foreground shadow-xl">
          <nav className="p-4">
            <NavList />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
