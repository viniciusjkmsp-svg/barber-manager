import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export const GOLD = "#C9A84C";

export function Card({
  children,
  className = "",
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`rounded-[10px] p-3.5 border border-border bg-card transition-all hover:border-[${GOLD}33] ${className}`}
      style={{ borderColor: undefined }}
    >
      {title && (
        <div className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium mb-2.5">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "gold" | "green" | "red" | "yellow" | "blue";
}) {
  const toneColor: Record<string, string> = {
    default: "hsl(var(--foreground))",
    gold: "#C9A84C",
    green: "#4caf7d",
    red: "#e05c5c",
    yellow: "#e0a44c",
    blue: "#4c9af5",
  };
  return (
    <div className="rounded-[10px] p-3.5 border border-border bg-card transition-all hover:-translate-y-0.5">
      <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-medium" style={{ color: toneColor[tone] }}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

export function AlertRow({
  color,
  children,
}: {
  color: "red" | "yellow" | "green" | "blue";
  children: ReactNode;
}) {
  const colors = { red: "#e05c5c", yellow: "#e0a44c", green: "#4caf7d", blue: "#4c9af5" };
  return (
    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: colors[color] }}
      />
      <span className="text-[12px] text-foreground/80">{children}</span>
    </div>
  );
}

export function TeamRow({
  rank,
  initial,
  name,
  value,
  percent,
}: {
  rank: number;
  initial: string;
  name: string;
  value: string;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-2.5 px-1.5 py-1 rounded-md hover:bg-muted/50 transition-colors">
      <span className="text-[11px] text-muted-foreground w-4">{rank}</span>
      <div className="w-[26px] h-[26px] rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground flex-shrink-0">
        {initial}
      </div>
      <div className="flex-1">
        <div className="text-[12px] text-foreground/90">{name}</div>
        <div className="h-1 bg-muted rounded mt-1 overflow-hidden">
          <div className="h-full rounded" style={{ width: `${percent}%`, background: GOLD }} />
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground">{value}</span>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[15px] font-medium text-foreground mb-3">{children}</h2>;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: `${GOLD}18`, color: GOLD }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="text-base font-medium">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </div>
      {actions}
    </div>
  );
}

export function TabsBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-muted/50 rounded-lg mb-4 overflow-x-auto">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="px-3 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-all"
            style={{
              background: isActive ? GOLD : "transparent",
              color: isActive ? "#0d0d0d" : "hsl(var(--muted-foreground))",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: "confirmed" | "pending" | "progress" | "done" | "cancelled" | "noshow";
}) {
  const map = {
    confirmed: { bg: "#4caf7d22", color: "#4caf7d", label: "Confirmado" },
    pending: { bg: "#e0a44c22", color: "#e0a44c", label: "Pendente" },
    progress: { bg: "#4c9af522", color: "#4c9af5", label: "Em atendimento" },
    done: { bg: "#88888822", color: "#888", label: "Finalizado" },
    cancelled: { bg: "#e05c5c22", color: "#e05c5c", label: "Cancelado" },
    noshow: { bg: "#e05c5c22", color: "#e05c5c", label: "Faltou" },
  } as const;
  const s = map[status];
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}
