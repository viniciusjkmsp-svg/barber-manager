import { useState } from "react";
import { Card, StatCard, TabsBar, GOLD } from "./widgets";
import { Flame, MessageCircle } from "lucide-react";
import { useMockData } from "@/hooks/mock/useMockData";

const LEAD_STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  contato: "Em contato",
  qualificado: "Qualificado",
  matriculado: "Matriculado",
  perdido: "Perdido",
};

export function MarketingDashboard() {
  const [adTab, setAdTab] = useState<"protese" | "cursos">("protese");
  const data = useMockData();
  const criativos = data.ads.filter((a) => a.segment === adTab);
  const invMes = data.ads.reduce((s, a) => s + a.invest, 0);
  const cacMed = Math.round(data.ads.reduce((s, a) => s + a.cac, 0) / data.ads.length);
  const leadsRecentes = data.leads.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Marketing</div>
        <div className="text-xs text-muted-foreground">Anúncios, leads e campanhas</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <StatCard label="Leads hoje" value={data.counts.leadsHoje} sub={`${data.leads.filter((l) => l.status === "novo").length} pendentes`} tone="gold" />
        <StatCard label="Taxa de conversão" value="24%" sub="+3pp mês" tone="green" />
        <StatCard label="Investimento mês" value={`R$ ${invMes.toLocaleString("pt-BR")}`} />
        <StatCard label="CAC médio" value={`R$ ${cacMed}`} tone="yellow" />
      </div>

      <Card title="Anúncios em destaque">
        <TabsBar
          tabs={[
            { id: "protese", label: "Prótese Capilar" },
            { id: "cursos", label: "Cursos" },
          ]}
          active={adTab}
          onChange={(id) => setAdTab(id as "protese" | "cursos")}
        />
        <div className="flex flex-col gap-2">
          {criativos.map((c) => (
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
                  Invest R$ {c.invest} · CPL R$ {c.cpl.toFixed(2)} · CAC R$ {c.cac}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Leads recentes">
          <div className="flex flex-col gap-2 text-sm">
            {leadsRecentes.map((l) => (
              <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] truncate">{l.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{l.channel}</div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: `${GOLD}22`, color: GOLD }}
                >
                  {LEAD_STATUS_LABEL[l.status]}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Follow up">
          <div className="flex flex-col gap-2 text-sm">
            {[
              `${data.counts.inativos} clientes para reengajar`,
              "8 respostas pendentes WhatsApp",
              "5 aniversariantes semana",
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span className="text-[12px]">{t}</span>
                <button
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded"
                  style={{ background: "#4caf7d22", color: "#4caf7d" }}
                >
                  <MessageCircle className="w-3 h-3" /> Enviar
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Campanhas ativas">
        <div className="flex flex-col gap-2 text-sm">
          {[
            { nome: "Black Prótese 2026", perfil: "Prótese", budget: "R$ 2.000 / R$ 5.000", perf: "ROI 3.2x" },
            { nome: "Curso Turma Julho", perfil: "Cursos", budget: "R$ 800 / R$ 2.000", perf: "ROI 4.5x" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{c.nome}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {c.perfil} · {c.budget}
                </div>
              </div>
              <span className="text-[11px]" style={{ color: "#4caf7d" }}>
                {c.perf}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
