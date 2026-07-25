import { Card, StatusBadge, GOLD } from "./widgets";
import { CheckCircle, Calendar, X, UserPlus, MessageCircle, DollarSign, Search } from "lucide-react";

export function ReceptionDashboard() {
  const agenda = [
    { hora: "09:00", cliente: "João Pereira", prof: "Kauan", servico: "Corte + Barba", status: "confirmed" as const },
    { hora: "09:30", cliente: "Ana Paula", prof: "Silvia", servico: "Escova", status: "progress" as const },
    { hora: "10:00", cliente: "Roberto", prof: "Cristiano", servico: "Corte", status: "pending" as const },
    { hora: "10:30", cliente: "Marina", prof: "Silvia", servico: "Manicure", status: "confirmed" as const },
    { hora: "11:00", cliente: "Débora", prof: "Kauan", servico: "Corte", status: "pending" as const },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Recepção</div>
        <div className="text-xs text-muted-foreground">Agenda e atendimento</div>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {[
          { icon: Calendar, label: "Novo agendamento" },
          { icon: UserPlus, label: "Cadastrar cliente" },
          { icon: CheckCircle, label: "Registrar chegada" },
          { icon: DollarSign, label: "Registrar pagamento" },
          { icon: Search, label: "Buscar cliente" },
        ].map((a, i) => (
          <button
            key={i}
            className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card hover:border-[#C9A84C] transition-colors text-[12px]"
          >
            <a.icon className="w-4 h-4" style={{ color: GOLD }} />
            {a.label}
          </button>
        ))}
      </div>

      <Card title="Agenda do dia">
        <div className="flex flex-col gap-2">
          {agenda.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
              <div className="text-sm font-medium w-14" style={{ color: GOLD }}>
                {a.hora}
              </div>
              <div className="flex-1">
                <div className="text-[13px]">{a.cliente}</div>
                <div className="text-[11px] text-muted-foreground">
                  {a.servico} · {a.prof}
                </div>
              </div>
              <StatusBadge status={a.status} />
              <div className="hidden md:flex gap-1">
                <button
                  className="p-1.5 rounded hover:bg-muted"
                  title="Confirmar"
                  style={{ color: "#4caf7d" }}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted" title="Reagendar">
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 rounded hover:bg-muted"
                  title="Cancelar"
                  style={{ color: "#e05c5c" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Card title="Fila de espera">
          <div className="flex flex-col gap-2 text-sm">
            {[
              { nome: "Lucas", espera: "12 min", prof: "Kauan" },
              { nome: "Fernanda", espera: "5 min", prof: "Silvia" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <div className="flex-1">
                  <div className="text-[13px]">{f.nome}</div>
                  <div className="text-[11px] text-muted-foreground">{f.prof}</div>
                </div>
                <div className="text-[11px]" style={{ color: "#e0a44c" }}>
                  {f.espera}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Pendências">
          <div className="text-sm space-y-1.5">
            <div>3 clientes sem confirmação</div>
            <div>2 reagendamentos necessários</div>
            <div>4 retornos do dia</div>
          </div>
        </Card>
      </div>

      <Card title="WhatsApp — Confirmações pendentes">
        <div className="flex flex-col gap-2">
          {["João Pereira - 09:00", "Roberto - 10:00", "Débora - 11:00"].map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
              <span className="text-[12px]">{c}</span>
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
  );
}
