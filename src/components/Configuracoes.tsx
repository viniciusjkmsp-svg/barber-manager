import { useState } from "react";
import { Card, GOLD } from "./dashboards/widgets";
import { Building2, Users, Scissors, Percent, Plug, Check } from "lucide-react";

export function Configuracoes() {
  const [section, setSection] = useState("empresa");

  const sections = [
    { id: "empresa", label: "Empresa", icon: Building2 },
    { id: "usuarios", label: "Usuários e Permissões", icon: Users },
    { id: "servicos", label: "Serviços", icon: Scissors },
    { id: "comissoes", label: "Comissões", icon: Percent },
    { id: "integracoes", label: "Integrações", icon: Plug },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Configurações</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {sections.map((s) => (
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

      {section === "empresa" && (
        <Card title="Dados da empresa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Field label="Nome" defaultValue="MS Hair Studio" />
            <Field label="Telefone" defaultValue="(11) 99999-0000" />
            <div className="md:col-span-2">
              <Field label="Endereço" defaultValue="Rua Exemplo, 123 - São Paulo/SP" />
            </div>
          </div>
          <div className="mt-4 text-[12px] uppercase tracking-wider text-muted-foreground">
            Horário de funcionamento
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d} className="p-2 rounded-lg bg-muted/40">
                <div className="text-[11px] text-muted-foreground">{d}</div>
                <div>08:00 – 20:00</div>
              </div>
            ))}
            <div className="p-2 rounded-lg bg-muted/40">
              <div className="text-[11px] text-muted-foreground">Dom</div>
              <div>09:00 – 14:00</div>
            </div>
          </div>
          <div className="mt-4 text-[12px] uppercase tracking-wider text-muted-foreground">
            Departamentos ativos
          </div>
          <div className="flex gap-2 mt-2">
            {["Barbearia", "Salão", "Prótese"].map((d) => (
              <span
                key={d}
                className="text-[11px] px-2 py-1 rounded-full"
                style={{ background: `${GOLD}18`, color: GOLD }}
              >
                {d}
              </span>
            ))}
          </div>
        </Card>
      )}

      {section === "usuarios" && (
        <>
          <Card title="Usuários">
            <div className="flex flex-col gap-2">
              {[
                { nome: "Marcos", perfil: "Proprietário", status: "Ativo" },
                { nome: "Silvia", perfil: "Sócia", status: "Ativo" },
                { nome: "Kauan", perfil: "Barbeiro", status: "Ativo" },
                { nome: "Recepção 01", perfil: "Recepção", status: "Ativo" },
                { nome: "Marketing", perfil: "Marketing", status: "Ativo" },
              ].map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{u.nome}</div>
                    <div className="text-[11px] text-muted-foreground">{u.perfil}</div>
                  </div>
                  <span className="text-[11px]" style={{ color: "#4caf7d" }}>
                    {u.status}
                  </span>
                  <button className="text-[11px] text-muted-foreground hover:text-foreground">
                    Editar
                  </button>
                </div>
              ))}
            </div>
            <button
              className="mt-3 w-full py-2 rounded-lg font-medium text-sm"
              style={{ background: GOLD, color: "#0d0d0d" }}
            >
              + Novo usuário
            </button>
          </Card>

          <Card title="Matriz de permissões (por perfil)">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-muted-foreground text-left">
                    <th className="p-2">Módulo</th>
                    <th className="p-2">Ver</th>
                    <th className="p-2">Criar</th>
                    <th className="p-2">Editar</th>
                    <th className="p-2">Excluir</th>
                    <th className="p-2">Exportar</th>
                    <th className="p-2">Escopo</th>
                  </tr>
                </thead>
                <tbody>
                  {["Agenda", "Clientes", "Financeiro", "Estoque", "Marketing"].map((m) => (
                    <tr key={m} className="border-t border-border">
                      <td className="p-2">{m}</td>
                      {[1, 2, 3, 4, 5].map((c) => (
                        <td key={c} className="p-2">
                          <Check className="w-3.5 h-3.5" style={{ color: "#4caf7d" }} />
                        </td>
                      ))}
                      <td className="p-2">Empresa</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {section === "servicos" && (
        <Card title="Serviços">
          <div className="flex flex-col gap-2">
            {[
              { n: "Corte", dept: "Barbearia", dur: "30min", preco: 50 },
              { n: "Corte + Barba", dept: "Barbearia", dur: "1h", preco: 80 },
              { n: "Escova", dept: "Salão", dur: "45min", preco: 60 },
              { n: "Prótese - aplicação", dept: "Prótese", dur: "1h30", preco: 2800 },
              { n: "Prótese - manutenção", dept: "Prótese", dur: "1h", preco: 480 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{s.n}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.dept} · {s.dur}
                  </div>
                </div>
                <div className="text-[13px]" style={{ color: GOLD }}>
                  R$ {s.preco}
                </div>
                <button className="text-[11px] text-muted-foreground hover:text-foreground">
                  Editar
                </button>
              </div>
            ))}
          </div>
          <button
            className="mt-3 w-full py-2 rounded-lg font-medium text-sm"
            style={{ background: GOLD, color: "#0d0d0d" }}
          >
            + Novo serviço
          </button>
        </Card>
      )}

      {section === "comissoes" && (
        <Card title="Comissões — requer autenticação do proprietário">
          <div className="p-3 rounded-lg bg-muted/40 mb-3 text-[12px] text-muted-foreground">
            Para editar percentuais, confirme sua senha no botão de edição.
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="p-2">Profissional</th>
                <th className="p-2">Corte</th>
                <th className="p-2">Química</th>
                <th className="p-2">Prótese</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Kauan", "50%", "—", "3%"],
                ["Cristiano", "50%", "—", "—"],
                ["Silvia", "—", "40%", "—"],
                ["Vinicius", "50%", "—", "7% + 4% gestor"],
              ].map((r, i) => (
                <tr key={i} className="border-t border-border">
                  {r.map((c, j) => (
                    <td key={j} className="p-2">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {section === "integracoes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            { n: "WhatsApp — Prótese Capilar", status: "Conectado", cor: "#4caf7d" },
            { n: "WhatsApp — Salão", status: "Conectado", cor: "#4caf7d" },
            { n: "Meta Ads — Prótese", status: "Conectado", cor: "#4caf7d" },
            { n: "Meta Ads — Cursos", status: "Desconectado", cor: "#e05c5c" },
            { n: "Google Ads", status: "Em breve", cor: "#888" },
          ].map((i) => (
            <Card key={i.n}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium">{i.n}</div>
                  <div className="text-[11px]" style={{ color: i.cor }}>
                    {i.status}
                  </div>
                </div>
                <button
                  className="text-[11px] px-2.5 py-1 rounded"
                  style={{ background: `${GOLD}18`, color: GOLD }}
                >
                  Configurar
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-[12px] text-muted-foreground">{label}</label>
      <input
        defaultValue={defaultValue}
        className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none focus:border-[#C9A84C]"
      />
    </div>
  );
}
