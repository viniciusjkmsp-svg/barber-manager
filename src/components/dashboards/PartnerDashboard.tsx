import { Card, StatCard, AlertRow, GOLD } from "./widgets";
import { ArrowUp, Play, CheckCircle } from "lucide-react";

export function PartnerDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Olá, Silvia</div>
        <div className="text-xs text-muted-foreground">Resumo do seu negócio</div>
      </div>

      {/* Resumo do negócio */}
      <Card title="Resumo do mês">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl font-semibold" style={{ color: GOLD }}>
            R$ 42.360
          </span>
          <span className="flex items-center gap-1 text-sm" style={{ color: "#4caf7d" }}>
            <ArrowUp className="w-4 h-4" /> 14% vs mês anterior
          </span>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          Lucro estimado do mês: <span className="text-foreground font-medium">R$ 18.240</span>
        </div>
      </Card>

      {/* Financeiro semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <StatCard label="Entrou essa semana" value="R$ 8.420" tone="green" />
        <StatCard label="Saiu essa semana" value="R$ 1.980" tone="red" />
        <StatCard label="Saldo atual" value="R$ 24.860" tone="gold" />
      </div>

      {/* Equipe resumida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Equipe">
          <div className="text-sm">
            <div className="mb-1">
              <span className="text-foreground font-medium">5 profissionais</span>{" "}
              <span className="text-muted-foreground">ativos essa semana</span>
            </div>
            <div>
              <span className="text-foreground font-medium">2 pessoas</span>{" "}
              <span className="text-muted-foreground">bateram a meta esse mês</span>
            </div>
          </div>
        </Card>
        <Card title="Alertas importantes">
          <div className="flex flex-col gap-1.5">
            <AlertRow color="yellow">Faltando pomada e loção pós-barba</AlertRow>
            <AlertRow color="red">Algumas clientes VIP não voltam há mais de um mês</AlertRow>
            <AlertRow color="green">Semana acima da meta</AlertRow>
          </div>
        </Card>
      </div>

      {/* Minha agenda */}
      <Card title="Minha agenda hoje (Salão)">
        <div className="flex flex-col gap-2">
          {[
            { hora: "09:30", cliente: "Ana Paula", servico: "Escova progressiva", status: "confirmed" },
            { hora: "11:00", cliente: "Marina", servico: "Manicure + Pedicure", status: "confirmed" },
            { hora: "14:00", cliente: "Débora", servico: "Coloração", status: "pending" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
              <div className="text-sm font-medium w-14" style={{ color: GOLD }}>
                {a.hora}
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-foreground">{a.cliente}</div>
                <div className="text-[11px] text-muted-foreground">{a.servico}</div>
              </div>
              {i === 0 ? (
                <button
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded font-medium"
                  style={{ background: "#4c9af522", color: "#4c9af5" }}
                >
                  <Play className="w-3 h-3" /> Iniciar
                </button>
              ) : (
                <button
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded font-medium"
                  style={{ background: "#4caf7d22", color: "#4caf7d" }}
                >
                  <CheckCircle className="w-3 h-3" /> Finalizar
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="text-[11px] text-muted-foreground mt-3">Próxima cliente: Ana Paula — 09:30</div>
      </Card>
    </div>
  );
}
