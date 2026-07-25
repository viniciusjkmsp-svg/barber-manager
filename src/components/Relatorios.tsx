import { useState } from "react";
import { Card, StatCard, TabsBar, GOLD } from "./dashboards/widgets";

export function Relatorios() {
  const [tab, setTab] = useState("financeiro");
  const [periodo, setPeriodo] = useState("mes");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-base font-medium">Relatórios / BI</div>
          <div className="text-xs text-muted-foreground">Indicadores do negócio</div>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm"
        >
          <option value="dia">Hoje</option>
          <option value="semana">Semana</option>
          <option value="mes">Mês</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>

      <TabsBar
        tabs={[
          { id: "financeiro", label: "Financeiro" },
          { id: "equipe", label: "Equipe" },
          { id: "clientes", label: "Clientes" },
          { id: "marketing", label: "Marketing" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "financeiro" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <StatCard label="Faturamento total" value="R$ 42.360" tone="gold" />
            <StatCard label="Entradas" value="R$ 46.180" tone="green" />
            <StatCard label="Saídas" value="R$ 12.940" tone="red" />
            <StatCard label="Resultado" value="R$ 29.420" tone="green" />
          </div>
          <Card title="Faturamento — últimos 6 meses">
            <div className="flex items-end gap-2 h-32">
              {[28, 32, 35, 38, 40, 42].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ height: `${v * 2}px`, background: GOLD }}
                />
              ))}
            </div>
            <div className="flex mt-2 text-[10px] text-muted-foreground">
              {["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"].map((m) => (
                <span key={m} className="flex-1 text-center">
                  {m}
                </span>
              ))}
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <Card title="Por departamento">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Barbearia</span> <span>R$ 22.400</span>
                </div>
                <div className="flex justify-between">
                  <span>Salão</span> <span>R$ 11.240</span>
                </div>
                <div className="flex justify-between">
                  <span>Prótese</span> <span>R$ 8.720</span>
                </div>
              </div>
            </Card>
            <Card title="Serviços mais vendidos">
              <div className="text-sm space-y-1">
                <div>1. Corte + Barba (142)</div>
                <div>2. Escova (86)</div>
                <div>3. Prótese - manutenção (54)</div>
              </div>
            </Card>
            <Card title="Formas de pagamento">
              <div className="text-sm space-y-1">
                <div>PIX — 48%</div>
                <div>Débito — 32%</div>
                <div>Crédito — 20%</div>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "equipe" && (
        <Card title="Ranking do período">
          <div className="text-sm space-y-2">
            {[
              { n: "Kauan", fat: 8420, meta: 90 },
              { n: "Cristiano", fat: 6820, meta: 72 },
              { n: "Silvia", fat: 5420, meta: 58 },
              { n: "Vinicius", fat: 4180, meta: 40 },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <span className="w-4 text-muted-foreground">{i + 1}</span>
                <div className="flex-1">
                  <div className="text-[13px]">{p.n}</div>
                  <div className="h-1 rounded mt-1 bg-muted overflow-hidden">
                    <div style={{ width: `${p.meta}%`, background: GOLD }} className="h-full" />
                  </div>
                </div>
                <span className="text-[12px]">R$ {p.fat.toLocaleString("pt-BR")}</span>
                <span className="text-[11px] text-muted-foreground">Meta {p.meta}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "clientes" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <StatCard label="Ativos" value="248" tone="green" />
            <StatCard label="Novos no mês" value="34" tone="gold" />
            <StatCard label="VIP" value="18" />
            <StatCard label="Em risco de churn" value="22" tone="red" />
          </div>
          <Card title="Serviços mais consumidos">
            <div className="text-sm space-y-1">
              <div>Corte + Barba — 142</div>
              <div>Escova — 86</div>
              <div>Prótese - manutenção — 54</div>
            </div>
          </Card>
        </>
      )}

      {tab === "marketing" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <StatCard label="Investimento" value="R$ 4.820" tone="gold" />
            <StatCard label="Leads gerados" value="128" />
            <StatCard label="CPL médio" value="R$ 37,60" tone="yellow" />
            <StatCard label="Conversão" value="24%" tone="green" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <Card title="Prótese Capilar">
              <div className="text-sm space-y-1">
                <div>Invest: R$ 3.100 · CAC R$ 68</div>
                <div>Leads: 82 · Conv 22%</div>
              </div>
            </Card>
            <Card title="Cursos">
              <div className="text-sm space-y-1">
                <div>Invest: R$ 1.720 · CAC R$ 48</div>
                <div>Leads: 46 · Conv 28%</div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
