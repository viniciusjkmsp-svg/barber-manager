import { Card, StatCard, GOLD } from "./dashboards/widgets";
import { ArrowRight } from "lucide-react";

export function Leads() {
  const leads = [
    { nome: "Rodrigo M.", canal: "Meta - Prótese", perfil: "Prótese", data: "hoje 10:12", status: "Novo" },
    { nome: "Camila S.", canal: "Meta - Curso", perfil: "Curso", data: "hoje 09:45", status: "Em contato" },
    { nome: "Diego P.", canal: "Instagram", perfil: "Prótese", data: "ontem", status: "Qualificado" },
    { nome: "Larissa F.", canal: "WhatsApp", perfil: "Prótese", data: "ontem", status: "Agendado" },
    { nome: "Bruno R.", canal: "Meta - Prótese", perfil: "Prótese", data: "2 dias", status: "Perdido" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Leads</div>
        <div className="text-xs text-muted-foreground">Captura e qualificação</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        <StatCard label="Novos" value="18" tone="gold" />
        <StatCard label="Em contato" value="24" tone="blue" />
        <StatCard label="Qualificados" value="9" tone="green" />
        <StatCard label="Agendados" value="6" />
        <StatCard label="Perdidos" value="11" tone="red" />
      </div>
      <Card title="Todos os leads">
        <div className="flex flex-col gap-1.5">
          {leads.map((l, i) => (
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
                    l.status === "Qualificado" || l.status === "Agendado"
                      ? "#4caf7d22"
                      : l.status === "Perdido"
                      ? "#e05c5c22"
                      : `${GOLD}22`,
                  color:
                    l.status === "Qualificado" || l.status === "Agendado"
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
    </div>
  );
}
