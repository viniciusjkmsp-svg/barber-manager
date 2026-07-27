import { Card, StatCard, AlertRow } from "./widgets";
import { useMockData } from "@/hooks/mock/useMockData";

const STATUS_COLOR: Record<string, string> = {
  livre: "#4caf7d",
  ocupado: "#4c9af5",
  pausa: "#e0a44c",
  ausente: "#e05c5c",
};
const STATUS_LABEL: Record<string, string> = {
  livre: "Disponível",
  ocupado: "Em atendimento",
  pausa: "Almoço",
  ausente: "Ausente",
};

export function ManagerDashboard() {
  const data = useMockData();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Painel do Gerente</div>
        <div className="text-xs text-muted-foreground">Visão operacional do dia</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <StatCard label="Agendados hoje" value={data.counts.agendados} tone="gold" />
        <StatCard label="Confirmados" value={data.counts.confirmados} tone="green" />
        <StatCard label="Pendentes" value={data.counts.pendentes} tone="yellow" />
        <StatCard label="Cancelados" value={data.counts.cancelados} tone="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Equipe agora">
          <div className="flex flex-col gap-2">
            {data.professionals.map((p) => {
              const meta = Math.min(
                100,
                Math.round(
                  (data.ranking.find((r) => r.id === p.id)?.weekTotal ?? 0) /
                    (p.monthTarget / 4) *
                    100
                )
              );
              return (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{p.name.split(" ")[0]}</div>
                    <div className="text-[11px]" style={{ color: STATUS_COLOR[p.liveStatus] }}>
                      {STATUS_LABEL[p.liveStatus]}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Meta {meta}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Alertas operacionais">
          <div className="flex flex-col gap-1.5">
            <AlertRow color="yellow">{data.counts.pendentes} clientes ainda não confirmaram presença</AlertRow>
            <AlertRow color="red">Atendimento das 10:30 atrasado 15 min</AlertRow>
            <AlertRow color="yellow">Pomada e loção com estoque baixo</AlertRow>
            <AlertRow color="blue">2 tarefas pendentes para hoje</AlertRow>
          </div>
        </Card>
      </div>

      <Card title="Follow up">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-sm">
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-[11px] text-muted-foreground">Reagendar</div>
            <div className="text-lg font-medium">{data.counts.cancelados + 4}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-[11px] text-muted-foreground">Cancelaram recentemente</div>
            <div className="text-lg font-medium">{data.counts.cancelados}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-[11px] text-muted-foreground">Retornos pendentes</div>
            <div className="text-lg font-medium">{data.counts.inativos}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
