import { Card } from "./dashboards/widgets";
import { MessageCircle } from "lucide-react";

export function FollowUp() {
  const items = [
    { nome: "Débora Santos", motivo: "Cancelou há 3 dias", acao: "Reagendar" },
    { nome: "Carlos Freitas", motivo: "Sem retorno há 45 dias", acao: "Reativar" },
    { nome: "Marina Alves", motivo: "Não confirmou hoje", acao: "Confirmar" },
    { nome: "Rafael Torres", motivo: "Retorno programado hoje", acao: "Contatar" },
    { nome: "Lucas Almeida", motivo: "Aniversário essa semana", acao: "Parabenizar" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Follow Up</div>
        <div className="text-xs text-muted-foreground">Clientes para retomar contato</div>
      </div>
      <Card>
        <div className="flex flex-col gap-2">
          {items.map((i, k) => (
            <div key={k} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
              <div className="flex-1">
                <div className="text-[13px] font-medium">{i.nome}</div>
                <div className="text-[11px] text-muted-foreground">{i.motivo}</div>
              </div>
              <span className="text-[11px] text-muted-foreground">{i.acao}</span>
              <button
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded"
                style={{ background: "#4caf7d22", color: "#4caf7d" }}
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
