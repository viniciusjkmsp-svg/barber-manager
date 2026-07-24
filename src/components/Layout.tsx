import { Scissors, LayoutDashboard, Calendar, CalendarDays, CalendarRange, Users, ShoppingCart, Package, CreditCard, CalendarCheck } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "daily", label: "Controle Diário", icon: Calendar },
    { id: "agenda", label: "Agenda", icon: CalendarCheck },
    { id: "weekly", label: "Visualização Semanal", icon: CalendarDays },
    { id: "monthly", label: "Visualização Mensal", icon: CalendarRange },
    { id: "professionals", label: "Cabeleireiros", icon: Users },
    { id: "prosthesis", label: "Vendas de Prótese", icon: ShoppingCart },
    { id: "products", label: "Produtos & Estoque", icon: Package },
    { id: "plans", label: "Planos & Mensalidades", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Scissors className="w-6 h-6" />
              <span>Barbearia Estilo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm">A</span>
              </div>
              <span className="text-sm">Administrador</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-sidebar text-sidebar-foreground shadow-xl">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};