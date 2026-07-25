import { Card, StatCard, StatusBadge, GOLD } from "./widgets";
import { Play, CheckCircle, ShoppingBag, MessageSquare, Star } from "lucide-react";

export function BarberDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Meu painel</div>
        <div className="text-xs text-muted-foreground">Atendimentos e desempenho</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <StatCard label="Meta da semana" value="72%" sub="R$ 1.440 / R$ 2.000" tone="gold" />
        <StatCard label="Atendimentos hoje" value="6" sub="de 9 agendados" />
        <StatCard label="Comissão do mês" value="R$ 1.860" tone="green" />
      </div>

      {/* Próximo cliente */}
      <Card>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
          Próximo cliente
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold"
            style={{ background: `${GOLD}22`, color: GOLD }}
          >
            L
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">Lucas Almeida</span>
              <span
                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: `${GOLD}22`, color: GOLD }}
              >
                <Star className="w-3 h-3" /> VIP
              </span>
            </div>
            <div className="text-[12px] text-muted-foreground">
              Corte + Barba · 10:30 · 8 atendimentos anteriores · última visita há 22 dias
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium"
            style={{ background: GOLD, color: "#0d0d0d" }}
          >
            <Play className="w-4 h-4" /> Iniciar
          </button>
        </div>
      </Card>

      <Card title="Minha agenda hoje">
        <div className="flex flex-col gap-2">
          {[
            { hora: "09:00", cliente: "João Pereira", servico: "Corte + Barba", status: "done" as const },
            { hora: "10:30", cliente: "Lucas Almeida", servico: "Corte + Barba", status: "pending" as const },
            { hora: "11:30", cliente: "Roberto Silva", servico: "Corte", status: "confirmed" as const },
            { hora: "14:00", cliente: "Marcos T.", servico: "Prótese - manutenção", status: "confirmed" as const },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
              <div className="text-sm font-medium w-14" style={{ color: GOLD }}>
                {a.hora}
              </div>
              <div className="flex-1">
                <div className="text-[13px]">{a.cliente}</div>
                <div className="text-[11px] text-muted-foreground">{a.servico}</div>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Ações do atendimento">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { icon: Play, label: "Iniciar" },
            { icon: ShoppingBag, label: "Registrar venda" },
            { icon: MessageSquare, label: "Observação" },
            { icon: CheckCircle, label: "Finalizar" },
          ].map((a, i) => (
            <button
              key={i}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card hover:border-[#C9A84C] transition-colors text-[12px]"
            >
              <a.icon className="w-4 h-4" style={{ color: GOLD }} />
              {a.label}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
