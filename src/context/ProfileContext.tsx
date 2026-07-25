import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageCircle,
  DollarSign,
  Package,
  Megaphone,
  BarChart3,
  Settings,
  ClipboardList,
  CheckSquare,
  UserPlus,
  Percent,
  LucideIcon,
} from "lucide-react";

export type ProfileKey =
  | "proprietario"
  | "socia"
  | "gerente"
  | "recepcao"
  | "barbeiro"
  | "marketing";

export type ModuleId =
  | "dashboard"
  | "agenda"
  | "clients"
  | "professionals"
  | "whatsapp"
  | "financeiro"
  | "products"
  | "marketing"
  | "relatorios"
  | "configuracoes"
  | "followup"
  | "tarefas"
  | "leads"
  | "minhacomissao";

export interface Profile {
  key: ProfileKey;
  initial: string;
  name: string;
  role: string;
  color: string;
}

export const PROFILES: Profile[] = [
  { key: "proprietario", initial: "M", name: "Marcos", role: "Proprietário", color: "#C9A84C" },
  { key: "socia", initial: "S", name: "Silvia", role: "Sócia", color: "#a67dd4" },
  { key: "gerente", initial: "G", name: "Gerente", role: "Gerente", color: "#4caf7d" },
  { key: "recepcao", initial: "R", name: "Recepção", role: "Recepção", color: "#4c9af5" },
  { key: "barbeiro", initial: "B", name: "Barbeiro", role: "Barbeiro", color: "#e05c5c" },
  { key: "marketing", initial: "Mk", name: "Marketing", role: "Marketing", color: "#e0a44c" },
];

export interface NavItem {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
}

const ALL: Record<ModuleId, NavItem> = {
  dashboard: { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  agenda: { id: "agenda", label: "Agenda", icon: Calendar },
  clients: { id: "clients", label: "Clientes", icon: Users },
  professionals: { id: "professionals", label: "Equipe", icon: UserPlus },
  whatsapp: { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  financeiro: { id: "financeiro", label: "Financeiro", icon: DollarSign },
  products: { id: "products", label: "Estoque", icon: Package },
  marketing: { id: "marketing", label: "Marketing", icon: Megaphone },
  relatorios: { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  configuracoes: { id: "configuracoes", label: "Configurações", icon: Settings },
  followup: { id: "followup", label: "Follow Up", icon: ClipboardList },
  tarefas: { id: "tarefas", label: "Tarefas", icon: CheckSquare },
  leads: { id: "leads", label: "Leads", icon: UserPlus },
  minhacomissao: { id: "minhacomissao", label: "Minha Comissão", icon: Percent },
};

const nav = (...ids: ModuleId[]): NavItem[] => ids.map((id) => ALL[id]);

export const PROFILE_NAV: Record<ProfileKey, NavItem[]> = {
  proprietario: nav(
    "dashboard",
    "agenda",
    "clients",
    "professionals",
    "whatsapp",
    "financeiro",
    "products",
    "marketing",
    "relatorios",
    "configuracoes"
  ),
  socia: nav(
    "dashboard",
    "agenda",
    "clients",
    "professionals",
    "whatsapp",
    "financeiro",
    "products",
    "marketing",
    "relatorios",
    "configuracoes"
  ),
  gerente: nav("dashboard", "agenda", "clients", "professionals", "products", "followup"),
  recepcao: nav("agenda", "clients", "whatsapp", "followup", "tarefas"),
  barbeiro: nav("dashboard", "agenda", "clients", "minhacomissao", "tarefas"),
  marketing: nav("dashboard", "leads", "followup", "marketing", "financeiro"),
};

interface Ctx {
  profile: Profile;
  setProfile: (p: Profile) => void;
  profiles: Profile[];
  navItems: NavItem[];
}

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(() => {
    if (typeof window === "undefined") return PROFILES[0];
    const saved = localStorage.getItem("ms-profile-key") as ProfileKey | null;
    return PROFILES.find((p) => p.key === saved) ?? PROFILES[0];
  });

  useEffect(() => {
    localStorage.setItem("ms-profile-key", profile.key);
  }, [profile]);

  const setProfile = (p: Profile) => setProfileState(p);

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, profiles: PROFILES, navItems: PROFILE_NAV[profile.key] }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
