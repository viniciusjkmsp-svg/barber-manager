import { useState } from "react";
import { Card, TabsBar, GOLD } from "./dashboards/widgets";
import { MessageCircle, Send, FileText, Zap } from "lucide-react";

export function WhatsApp() {
  const [dept, setDept] = useState("protese");
  const [section, setSection] = useState("conversas");

  const conversas = [
    { nome: "Rodrigo M.", ultima: "Ok, confirmado!", status: "respondido", hora: "10:32" },
    { nome: "Camila S.", ultima: "Posso remarcar?", status: "aguardando", hora: "10:15" },
    { nome: "Diego P.", ultima: "Vou passar amanhã", status: "respondido", hora: "09:48" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">WhatsApp</div>
        <div className="text-xs text-muted-foreground">Conversas, disparos e templates</div>
      </div>

      <TabsBar
        tabs={[
          { id: "protese", label: "Prótese Capilar" },
          { id: "salao", label: "Salão" },
        ]}
        active={dept}
        onChange={setDept}
      />

      <div className="flex gap-2 flex-wrap">
        {[
          { id: "conversas", label: "Conversas", icon: MessageCircle },
          { id: "disparos", label: "Disparos", icon: Send },
          { id: "templates", label: "Templates", icon: FileText },
          { id: "automacoes", label: "Automações", icon: Zap },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border transition-colors"
            style={{
              background: section === s.id ? `${GOLD}18` : "transparent",
              color: section === s.id ? GOLD : "hsl(var(--muted-foreground))",
              borderColor: section === s.id ? GOLD : "hsl(var(--border))",
            }}
          >
            <s.icon className="w-3.5 h-3.5" /> {s.label}
          </button>
        ))}
      </div>

      {section === "conversas" && (
        <Card title={`Conversas — ${dept === "protese" ? "Prótese" : "Salão"}`}>
          <input
            placeholder="Buscar por nome ou número..."
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mb-3 outline-none focus:border-[#C9A84C]"
          />
          <div className="flex flex-col gap-1.5">
            {conversas.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted transition-colors cursor-pointer">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold"
                  style={{ background: `${GOLD}22`, color: GOLD }}
                >
                  {c.nome[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{c.nome}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{c.ultima}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground">{c.hora}</div>
                  <span
                    className="text-[10px]"
                    style={{ color: c.status === "aguardando" ? "#e0a44c" : "#4caf7d" }}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {section === "disparos" && (
        <Card title="Novo disparo">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] text-muted-foreground">Filtro de destinatários</label>
              <select className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm">
                <option>Todos os clientes</option>
                <option>Somente VIP</option>
                <option>Aniversariantes do mês</option>
                <option>Inativos há +30 dias</option>
                <option>Por departamento</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] text-muted-foreground">
                Mensagem — variáveis: {"{nome}, {data}, {horario}"}
              </label>
              <textarea
                rows={4}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm resize-none"
                defaultValue="Olá {nome}, confirmando seu horário {data} às {horario}. Qualquer alteração é só avisar!"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="datetime-local" className="px-3 py-2 rounded-lg bg-muted border border-border text-sm" />
              <button
                className="px-4 py-2 rounded-lg font-medium text-sm"
                style={{ background: GOLD, color: "#0d0d0d" }}
              >
                Agendar disparo
              </button>
            </div>
          </div>
          <div className="mt-4 text-[12px] text-muted-foreground">Histórico de disparos</div>
          <div className="mt-2 space-y-1.5">
            {[
              { data: "22/07 09:00", nome: "Reativação inativos", enviados: 42, status: "Concluído" },
              { data: "20/07 12:00", nome: "Confirmação diária", enviados: 24, status: "Concluído" },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 text-[12px]">
                <div className="flex-1">{d.nome}</div>
                <div className="text-muted-foreground">{d.data}</div>
                <div className="text-muted-foreground">{d.enviados} enviados</div>
                <span style={{ color: "#4caf7d" }}>{d.status}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {section === "templates" && (
        <Card title="Templates">
          <div className="flex flex-col gap-2">
            {[
              { nome: "Confirmação de agendamento", tipo: "Texto" },
              { nome: "Lembrete 24h antes", tipo: "Texto" },
              { nome: "Reativação (60 dias)", tipo: "Texto" },
              { nome: "Feliz aniversário", tipo: "Áudio" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{t.nome}</div>
                  <div className="text-[11px] text-muted-foreground">{t.tipo}</div>
                </div>
                <button className="text-[11px] text-muted-foreground hover:text-foreground">Editar</button>
              </div>
            ))}
          </div>
          <button
            className="mt-3 px-3 py-2 rounded-lg font-medium text-sm border border-dashed border-border w-full"
            style={{ color: GOLD }}
          >
            + Novo template
          </button>
        </Card>
      )}

      {section === "automacoes" && (
        <Card title="Automações">
          {[
            { nome: "Confirmação automática ao criar agendamento", ativo: true },
            { nome: "Resposta automática para novos leads", ativo: true },
            { nome: "Lead qualificado vai para agenda do Marcos", ativo: true },
            { nome: "Lembrete 24h antes do atendimento", ativo: false },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 mb-2">
              <span className="text-[13px]">{a.nome}</span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{
                  background: a.ativo ? "#4caf7d22" : "#88888822",
                  color: a.ativo ? "#4caf7d" : "#888",
                }}
              >
                {a.ativo ? "Ativa" : "Inativa"}
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
