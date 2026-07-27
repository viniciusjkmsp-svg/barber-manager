import { useState } from "react";
import { Card, StatCard, AlertRow, TeamRow, TabsBar, GOLD } from "./widgets";
import { Flame } from "lucide-react";
import { useMockData, brl } from "@/hooks/mock/useMockData";

export function OwnerDashboard() {
  const [adTab, setAdTab] = useState<"protese" | "cursos">("protese");
  const data = useMockData();

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const creativos = data.ads.filter((a) => a.segment === adTab);
  const top4 = data.ranking.slice(0, 4);
  const maxWeek = Math.max(...top4.map((p) => p.weekTotal), 1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">{greeting}, Marcos</div>
        <div className="text-xs text-muted-foreground capitalize">{dateStr}</div>
      </div>

      {/* Visão do Dia */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <StatCard label="Faturamento hoje" value={brl(data.revenueToday)} sub="+12% vs ontem" tone="gold" />
        <StatCard label="Meta da semana" value="68%" sub="R$ 6.800 / R$ 10.000" tone="green" />
        <StatCard label="Agendados hoje" value={data.counts.agendados} sub={`${data.counts.confirmados} confirmados`} />
        <StatCard label="Atendidos" value={data.counts.atendidos} sub={`${data.counts.emAtendimento} em atendimento · ${data.counts.faltaram} faltaram`} />
        <StatCard label="Equipe" value={`${data.counts.equipeTotal - data.counts.equipeAusente} / ${data.counts.equipeTotal}`} sub={`${data.counts.equipeAusente} ausente`} tone={data.counts.equipeAusente ? "red" : "green"} />
      </div>

      {/* Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Faturamento — últimos 6 meses">
          <div className="flex items-end gap-1.5 h-24">
            {data.monthlySeries.map((m, i) => {
              const max = Math.max(...data.monthlySeries.map((x) => x.revenue));
              return (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${(m.revenue / max) * 100}%`, background: GOLD }} />
              );
            })}
          </div>
          <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground">
            {data.monthlySeries.map((m) => (
              <span key={m.month} className="flex-1 text-center">{m.month}</span>
            ))}
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-2.5">
          <StatCard label="Ticket médio" value="R$ 76" sub="+R$ 8 vs mês anterior" tone="gold" />
          <StatCard label="Comissões do mês" value="R$ 3.240" sub={`${data.professionals.length} profissionais`} />
          <StatCard label="Serviço mais vendido" value="Corte + Barba" sub="42 atendimentos" />
        </div>
      </div>

      {/* Top Criativos Meta Ads */}
      <Card title="Top criativos — Meta Ads">
        <TabsBar
          tabs={[
            { id: "protese", label: "Prótese Capilar" },
            { id: "cursos", label: "Cursos" },
          ]}
          active={adTab}
          onChange={(id) => setAdTab(id as "protese" | "cursos")}
        />
        <div className="flex flex-col gap-2">
          {creativos.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-medium">{c.name}</span>
                  {c.hot && (
                    <span
                      className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: "#e05c5c22", color: "#e05c5c" }}
                    >
                      <Flame className="w-3 h-3" /> Criativo Quente
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Invest R$ {c.invest} · {c.leads} leads · CPL R$ {c.cpl.toFixed(2)} · {c.conv} conversões
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alertas + Ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Alertas e urgências">
          <div className="flex flex-col gap-1.5">
            <AlertRow color="red">{data.counts.vipInativos} clientes VIP sem retorno há +30 dias</AlertRow>
            <AlertRow color="yellow">Estoque de pomada abaixo do mínimo</AlertRow>
            <AlertRow color="yellow">Meta mensal em risco — 32% restante</AlertRow>
            <AlertRow color="green">{data.counts.leadsHoje} novos leads via Meta Ads hoje</AlertRow>
          </div>
        </Card>
        <Card title="Ranking da equipe — semana">
          <div className="flex flex-col gap-1.5">
            {top4.map((p, i) => (
              <TeamRow
                key={p.id}
                rank={i + 1}
                initial={p.name[0]}
                name={p.name.split(" ")[0]}
                value={brl(p.weekTotal)}
                percent={Math.round((p.weekTotal / maxWeek) * 100)}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
