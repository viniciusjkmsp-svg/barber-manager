import { Card, StatCard, StatusBadge, GOLD } from "./widgets";
import { Play, CheckCircle, ShoppingBag, MessageSquare, Star } from "lucide-react";
import { useMockData, brl } from "@/hooks/mock/useMockData";

export function BarberDashboard() {
  const data = useMockData();
  // Assumimos "eu" = Kauan
  const meId = "kauan";
  const minhaAgenda = data.todayAppointments
    .filter((a) => a.professionalId === meId)
    .sort((a, b) => a.time.localeCompare(b.time));
  const proximo = minhaAgenda.find((a) => a.status !== "done" && a.status !== "cancelled" && a.status !== "noshow");
  const cliente = proximo ? data.clients.find((c) => c.id === proximo.clientId) : undefined;
  const feitos = minhaAgenda.filter((a) => a.status === "done").length;
  const total = minhaAgenda.length;
  const comissaoMes = Math.round(
    data.ranking.find((r) => r.id === meId)?.weekTotal ?? 0
  ) * 4 * 0.5;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Meu painel</div>
        <div className="text-xs text-muted-foreground">Atendimentos e desempenho</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <StatCard label="Meta da semana" value="72%" sub="R$ 1.440 / R$ 2.000" tone="gold" />
        <StatCard label="Atendimentos hoje" value={feitos} sub={`de ${total} agendados`} />
        <StatCard label="Comissão do mês" value={brl(comissaoMes)} tone="green" />
      </div>

      {proximo && (
        <Card>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            Próximo cliente
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold"
              style={{ background: `${GOLD}22`, color: GOLD }}
            >
              {proximo.clientName[0]}
            </div>
            <div className="flex-1 min-w-[180px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-medium">{proximo.clientName}</span>
                {cliente?.vip && (
                  <span
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${GOLD}22`, color: GOLD }}
                  >
                    <Star className="w-3 h-3" /> VIP
                  </span>
                )}
              </div>
              <div className="text-[12px] text-muted-foreground">
                {proximo.service} · {proximo.time}
                {cliente && ` · ${cliente.visits} atendimentos anteriores · última visita há ${cliente.lastVisitDaysAgo} dias`}
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
      )}

      <Card title="Minha agenda hoje">
        <div className="flex flex-col gap-2">
          {minhaAgenda.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
              <div className="text-sm font-medium w-14" style={{ color: GOLD }}>
                {a.time}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] truncate">{a.clientName}</div>
                <div className="text-[11px] text-muted-foreground truncate">{a.service}</div>
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
