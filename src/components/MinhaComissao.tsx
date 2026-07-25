import { Card, StatCard, GOLD } from "./dashboards/widgets";

export function MinhaComissao() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Minha Comissão</div>
        <div className="text-xs text-muted-foreground">Ganhos do período</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <StatCard label="Comissão do mês" value="R$ 1.860" tone="gold" />
        <StatCard label="Atendimentos" value="42" />
        <StatCard label="Ticket médio" value="R$ 72" />
        <StatCard label="Meta atingida" value="72%" tone="green" />
      </div>
      <Card title="Atendimentos recentes">
        <div className="flex flex-col gap-1.5">
          {[
            { data: "23/07", cliente: "João Pereira", servico: "Corte + Barba", val: 80, com: 40 },
            { data: "23/07", cliente: "Lucas Almeida", servico: "Corte + Barba", val: 80, com: 40 },
            { data: "22/07", cliente: "Roberto Silva", servico: "Corte", val: 50, com: 25 },
            { data: "22/07", cliente: "Marcos T.", servico: "Prótese manutenção", val: 480, com: 14.4 },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
              <span className="text-[11px] text-muted-foreground w-14">{a.data}</span>
              <div className="flex-1">
                <div className="text-[13px]">{a.cliente}</div>
                <div className="text-[11px] text-muted-foreground">{a.servico}</div>
              </div>
              <span className="text-[12px] text-muted-foreground">R$ {a.val}</span>
              <span className="text-[12px] font-medium" style={{ color: GOLD }}>
                R$ {a.com.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
