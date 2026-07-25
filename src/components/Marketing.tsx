import { useState } from "react";
import { Card, StatCard, TabsBar, GOLD } from "./dashboards/widgets";
import { Flame, MessageCircle, ArrowRight } from "lucide-react";

export function Marketing() {
  const [tab, setTab] = useState("anuncios");
  const [adSub, setAdSub] = useState("protese");

  const criativos = {
    protese: [
      { name: "Depoimento Kauan", invest: 480, leads: 42, cpl: 11.4, conv: 18, hot: true },
      { name: "Antes/Depois v3", invest: 320, leads: 28, cpl: 11.4, conv: 12, hot: true },
      { name: "Story Reels", invest: 260, leads: 14, cpl: 18.5, conv: 6, hot: false },
    ],
    cursos: [
      { name: "Aula Aberta", invest: 220, leads: 31, cpl: 7.1, conv: 9, hot: true },
      { name: "Formados 2025", invest: 180, leads: 18, cpl: 10, conv: 4, hot: false },
    ],
  }[adSub as "protese" | "cursos"];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Marketing</div>
      </div>

      <TabsBar
        tabs={[
          { id: "anuncios", label: "Anúncios" },
          { id: "leads", label: "Leads" },
          { id: "followup", label: "Follow Up" },
          { id: "campanhas", label: "Campanhas" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "anuncios" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <StatCard label="Investimento total" value="R$ 4.820" tone="gold" />
            <StatCard label="CPL médio" value="R$ 12,40" />
            <StatCard label="CAC médio" value="R$ 68" tone="yellow" />
            <StatCard label="Retorno" value="3.4x" tone="green" />
          </div>
          <Card>
            <TabsBar
              tabs={[
                { id: "protese", label: "Prótese Capilar" },
                { id: "cursos", label: "Cursos" },
              ]}
              active={adSub}
              onChange={setAdSub}
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
                      Invest R$ {c.invest} · {c.leads} leads · CPL R$ {c.cpl.toFixed(2)} · {c.conv} conversões
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === "leads" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <StatCard label="Novos hoje" value="18" tone="gold" />
            <StatCard label="Em contato" value="24" tone="blue" />
            <StatCard label="Qualificados" value="9" tone="green" />
            <StatCard label="Taxa conversão" value="24%" tone="green" />
          </div>
          <Card title="Todos os leads">
            <div className="flex flex-col gap-1.5">
              {[
                { nome: "Rodrigo M.", canal: "Meta - Prótese", perfil: "Prótese", data: "hoje 10:12", status: "Novo" },
                { nome: "Camila S.", canal: "Meta - Curso", perfil: "Curso", data: "hoje 09:45", status: "Em contato" },
                { nome: "Diego P.", canal: "Instagram", perfil: "Prótese", data: "ontem", status: "Qualificado" },
                { nome: "Larissa F.", canal: "WhatsApp", perfil: "Prótese", data: "ontem", status: "Perdido" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                  <div className="flex-1">
                    <div className="text-[13px]">{l.nome}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {l.canal} · {l.perfil} · {l.data}
                    </div>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        l.status === "Qualificado"
                          ? "#4caf7d22"
                          : l.status === "Perdido"
                          ? "#e05c5c22"
                          : `${GOLD}22`,
                      color:
                        l.status === "Qualificado"
                          ? "#4caf7d"
                          : l.status === "Perdido"
                          ? "#e05c5c"
                          : GOLD,
                    }}
                  >
                    {l.status}
                  </span>
                  {l.status === "Qualificado" && (
                    <button
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded"
                      style={{ background: GOLD, color: "#0d0d0d" }}
                    >
                      Agenda Marcos <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === "followup" && (
        <Card title="Follow up">
          <div className="flex flex-col gap-2">
            {[
              { nome: "12 clientes para reengajar", info: "Sem retorno há +45 dias" },
              { nome: "8 respostas pendentes WhatsApp", info: "Aguardando resposta" },
              { nome: "5 aniversariantes da semana", info: "Campanha automática" },
              { nome: "Reativação Julho", info: "Campanha ativa" },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
                <div>
                  <div className="text-[13px]">{t.nome}</div>
                  <div className="text-[11px] text-muted-foreground">{t.info}</div>
                </div>
                <button
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded"
                  style={{ background: "#4caf7d22", color: "#4caf7d" }}
                >
                  <MessageCircle className="w-3 h-3" /> Enviar WhatsApp
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "campanhas" && (
        <Card title="Campanhas">
          <div className="flex flex-col gap-2">
            {[
              { nome: "Black Prótese 2026", perfil: "Prótese", status: "Ativa", budget: "R$ 2.000 / R$ 5.000", periodo: "01-31 Jul", perf: "ROI 3.2x" },
              { nome: "Curso Turma Julho", perfil: "Cursos", status: "Ativa", budget: "R$ 800 / R$ 2.000", periodo: "10-31 Jul", perf: "ROI 4.5x" },
              { nome: "Retenção VIP", perfil: "Salão", status: "Pausada", budget: "R$ 300 / R$ 1.000", periodo: "05-25 Jul", perf: "ROI 1.8x" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{c.nome}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.perfil} · {c.periodo} · {c.budget}
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: c.status === "Ativa" ? "#4caf7d22" : "#88888822",
                    color: c.status === "Ativa" ? "#4caf7d" : "#888",
                  }}
                >
                  {c.status}
                </span>
                <span className="text-[11px]" style={{ color: "#4caf7d" }}>
                  {c.perf}
                </span>
              </div>
            ))}
          </div>
          <button
            className="mt-3 w-full py-2 rounded-lg font-medium text-sm"
            style={{ background: GOLD, color: "#0d0d0d" }}
          >
            + Nova campanha
          </button>
        </Card>
      )}
    </div>
  );
}
