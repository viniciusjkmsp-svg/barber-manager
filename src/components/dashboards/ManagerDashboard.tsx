import { Card, StatCard, AlertRow } from "./widgets";

export function ManagerDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Painel do Gerente</div>
        <div className="text-xs text-muted-foreground">Visão operacional do dia</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <StatCard label="Agendados hoje" value="24" tone="gold" />
        <StatCard label="Confirmados" value="18" tone="green" />
        <StatCard label="Pendentes" value="4" tone="yellow" />
        <StatCard label="Cancelados" value="2" tone="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Equipe agora">
          <div className="flex flex-col gap-2">
            {[
              { nome: "Kauan", status: "Em atendimento", cor: "#4c9af5", meta: 82 },
              { nome: "Cristiano", status: "Disponível", cor: "#4caf7d", meta: 65 },
              { nome: "Vinicius", status: "Em atendimento", cor: "#4c9af5", meta: 71 },
              { nome: "Silvia", status: "Almoço", cor: "#e0a44c", meta: 55 },
              { nome: "Irani", status: "Ausente", cor: "#e05c5c", meta: 30 },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{p.nome}</div>
                  <div className="text-[11px]" style={{ color: p.cor }}>
                    {p.status}
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground">Meta {p.meta}%</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Alertas operacionais">
          <div className="flex flex-col gap-1.5">
            <AlertRow color="yellow">3 clientes ainda não confirmaram presença</AlertRow>
            <AlertRow color="red">Atendimento das 10:30 atrasado 15 min</AlertRow>
            <AlertRow color="yellow">Pomada e loção com estoque baixo</AlertRow>
            <AlertRow color="blue">2 tarefas pendentes para hoje</AlertRow>
          </div>
        </Card>
      </div>

      <Card title="Follow up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-sm">
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-[11px] text-muted-foreground">Reagendar</div>
            <div className="text-lg font-medium">6</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-[11px] text-muted-foreground">Cancelaram recentemente</div>
            <div className="text-lg font-medium">4</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-[11px] text-muted-foreground">Retornos pendentes</div>
            <div className="text-lg font-medium">9</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
