import { useState } from "react";
import { Card, StatCard, AlertRow, TeamRow, TabsBar, GOLD } from "./widgets";
import { Flame } from "lucide-react";

export function OwnerDashboard() {
  const [adTab, setAdTab] = useState("protese");
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const creativosProtese = [
    { name: "Prótese - Depoimento Kauan", invest: 480, leads: 42, cpl: 11.4, conv: 18, hot: true },
    { name: "Prótese - Antes/Depois v3", invest: 320, leads: 28, cpl: 11.4, conv: 12, hot: true },
    { name: "Prótese - Story Reels", invest: 260, leads: 14, cpl: 18.5, conv: 6, hot: false },
  ];
  const creativosCursos = [
    { name: "Curso - Aula Aberta", invest: 220, leads: 31, cpl: 7.1, conv: 9, hot: true },
    { name: "Curso - Formados 2025", invest: 180, leads: 18, cpl: 10, conv: 4, hot: false },
  ];
  const creativos = adTab === "protese" ? creativosProtese : creativosCursos;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">{greeting}, Marcos</div>
        <div className="text-xs text-muted-foreground capitalize">{dateStr}</div>
      </div>

      {/* Visão do Dia */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        <StatCard label="Faturamento hoje" value="R$ 1.840" sub="+12% vs ontem" tone="gold" />
        <StatCard label="Meta da semana" value="68%" sub="R$ 6.800 / R$ 10.000" tone="green" />
        <StatCard label="Agendados hoje" value="24" sub="18 confirmados" />
        <StatCard label="Atendidos" value="12" sub="1 em atendimento · 2 faltaram" />
        <StatCard label="Equipe" value="5 / 6" sub="1 ausente" tone="red" />
      </div>

      {/* Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Faturamento — mês atual vs anterior">
          <div className="flex items-end gap-1.5 h-24">
            {[
              [55, 70],
              [62, 75],
              [48, 58],
              [72, 80],
            ].map(([a, b], i) => (
              <div key={i} className="flex gap-1 items-end flex-1">
                <div className="flex-1 rounded-t bg-muted" style={{ height: a }} />
                <div className="flex-1 rounded-t" style={{ height: b, background: GOLD }} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground">
            <span className="flex-1 text-center">Sem 1</span>
            <span className="flex-1 text-center">Sem 2</span>
            <span className="flex-1 text-center">Sem 3</span>
            <span className="flex-1 text-center">Sem 4</span>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-muted-foreground/30" /> Mês anterior
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded" style={{ background: GOLD }} /> Mês atual
            </span>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-2.5">
          <StatCard label="Ticket médio" value="R$ 76,50" sub="+R$ 8 vs mês anterior" tone="gold" />
          <StatCard label="Comissões do mês" value="R$ 3.240" sub="5 profissionais" />
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
          onChange={setAdTab}
        />
        <div className="flex flex-col gap-2">
          {creativos.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
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
                  Invest R$ {c.invest} · {c.leads} leads · CPL R$ {c.cpl.toFixed(2)} · {c.conv}{" "}
                  conversões
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
            <AlertRow color="red">2 clientes VIP sem retorno há +30 dias</AlertRow>
            <AlertRow color="yellow">Estoque de pomada abaixo do mínimo</AlertRow>
            <AlertRow color="yellow">Meta mensal em risco — 32% restante</AlertRow>
            <AlertRow color="green">3 novos leads via Meta Ads hoje</AlertRow>
          </div>
        </Card>
        <Card title="Ranking da equipe — semana">
          <div className="flex flex-col gap-1.5">
            <TeamRow rank={1} initial="K" name="Kauan" value="R$ 2.1k" percent={90} />
            <TeamRow rank={2} initial="C" name="Cristiano" value="R$ 1.7k" percent={72} />
            <TeamRow rank={3} initial="S" name="Silvia" value="R$ 1.3k" percent={58} />
            <TeamRow rank={4} initial="V" name="Vinicius" value="R$ 940" percent={40} />
          </div>
        </Card>
      </div>
    </div>
  );
}
