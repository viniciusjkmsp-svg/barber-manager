import { useState } from "react";
import { Card, StatCard, TabsBar, GOLD } from "./widgets";
import { Flame, MessageCircle } from "lucide-react";

export function MarketingDashboard() {
  const [adTab, setAdTab] = useState("protese");
  const creativosProtese = [
    { name: "Prótese - Depoimento Kauan", invest: 480, cpl: 11.4, cac: 62, hot: true },
    { name: "Prótese - Antes/Depois v3", invest: 320, cpl: 11.4, cac: 58, hot: true },
    { name: "Prótese - Story Reels", invest: 260, cpl: 18.5, cac: 84, hot: false },
  ];
  const creativosCursos = [
    { name: "Curso - Aula Aberta", invest: 220, cpl: 7.1, cac: 42, hot: true },
    { name: "Curso - Formados 2025", invest: 180, cpl: 10, cac: 65, hot: false },
  ];
  const criativos = adTab === "protese" ? creativosProtese : creativosCursos;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Marketing</div>
        <div className="text-xs text-muted-foreground">Anúncios, leads e campanhas</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <StatCard label="Leads hoje" value="18" sub="4 pendentes" tone="gold" />
        <StatCard label="Taxa de conversão" value="24%" sub="+3pp mês" tone="green" />
        <StatCard label="Investimento mês" value="R$ 4.820" />
        <StatCard label="CAC médio" value="R$ 68" tone="yellow" />
      </div>

      <Card title="Anúncios em destaque">
        <TabsBar
          tabs={[
            { id: "protese", label: "Prótese Capilar" },
            { id: "cursos", label: "Cursos" },
          ]}
          active={adTab}
          onChange={setAdTab}
        />
        <div className="flex flex-col gap-2">
          {criativos.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30">
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
            {[
              { nome: "Rodrigo M.", canal: "Meta - Prótese", status: "Novo" },
              { nome: "Camila S.", canal: "Meta - Curso", status: "Em contato" },
              { nome: "Diego P.", canal: "Instagram", status: "Qualificado" },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                <div className="flex-1">
                  <div className="text-[13px]">{l.nome}</div>
                  <div className="text-[11px] text-muted-foreground">{l.canal}</div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: `${GOLD}22`, color: GOLD }}
                >
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Follow up">
          <div className="flex flex-col gap-2 text-sm">
            {["12 clientes para reengajar", "8 respostas pendentes WhatsApp", "5 aniversariantes semana"].map(
              (t, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                  <span className="text-[12px]">{t}</span>
                  <button
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded"
                    style={{ background: "#4caf7d22", color: "#4caf7d" }}
                  >
                    <MessageCircle className="w-3 h-3" /> Enviar
                  </button>
                </div>
              )
            )}
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
              <div className="flex-1">
                <div className="text-[13px] font-medium">{c.nome}</div>
                <div className="text-[11px] text-muted-foreground">
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
