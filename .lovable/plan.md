# Plano — Refator MS Manager CRM

Vou reescrever o app inteiro em cima da base atual (visual dourado + sidebar já alinhados). Uso mocks realistas em memória (via Context) e mantenho a auth Supabase existente. Nada de novas tabelas nesse passo.

## Fase 1 — Fundação (identidade, perfis, roteamento)

**Perfis & permissões**
- Novo `src/context/ProfileContext.tsx`: perfil ativo + lista de perfis (Marcos, Silvia, Gerente, Recepção, Barbeiro, Marketing), cores e mapa `profile → módulos visíveis na sidebar`.
- Layout consome o context: sidebar mostra só os itens do perfil, dashboard renderiza a variante correspondente.

**Layout**
- Ajustar `src/components/Layout.tsx`:
  - Sidebar itens dinâmicos por perfil (padrão do plano).
  - Profile switcher já existente passa a atualizar `ProfileContext`.
  - Logo: quadrado 8px, "MS" 900, cor invertida ao tema (já ok).
- Login (`src/pages/Login.tsx`): abas "Entrar" / "Criar conta" no card (aba ativa dourada, inativa `#888`), logo fora do card, toggle tema no topo direito. Mantém `signInWithPassword` e `signUp`.

**Tokens**
- `src/index.css` já reflete a paleta MS. Adicionar semânticos: `--status-confirmed #4caf7d`, `--status-error #e05c5c`, `--status-pending #e0a44c`, `--status-progress #4c9af5` e utilitários `.status-*`.

## Fase 2 — Dashboards por perfil

Novo `src/components/dashboards/` com um arquivo por perfil, cada um usando um conjunto compartilhado de widgets (`StatCard`, `BarChartCard`, `AlertList`, `TeamRanking`, `NextClientCard`, `QuickActions`, `WhatsAppQueue`).

- `OwnerDashboard.tsx` — 5 blocos (Visão do dia, Financeiro, Top Criativos com sub-abas Prótese/Cursos, Alertas, Ranking).
- `PartnerDashboard.tsx` (Silvia) — Resumo, Entradas/Saídas/Saldo, Equipe resumida, Alertas em linguagem simples, Minha Agenda (Salão) com botão iniciar/finalizar.
- `ManagerDashboard.tsx` — Visão operacional, Equipe (status + meta), Alertas operacionais, Follow-up.
- `ReceptionDashboard.tsx` — Agenda cronológica com ações rápidas, Fila de espera, Pendências, Ações rápidas, WhatsApp pendente.
- `BarberDashboard.tsx` — Minha agenda, Próximo cliente destacado, Meu desempenho, Ações do atendimento (iniciar/registrar/finalizar).
- `MarketingDashboard.tsx` — Anúncios (com criativo quente 🔥), Leads, Follow-up, Campanhas ativas.

`Index.tsx` roteia para o dashboard do perfil ativo.

## Fase 3 — Módulos principais

Cada módulo é uma tab do Layout existente, alimentado por hooks mock (`src/hooks/mock/`).

- **Agenda** (`Agenda.tsx` reformulada): 3 sub-abas Dia/Semana/Mês; filtro por departamento (Barbearia/Salão/Prótese); grade por profissional; modal "novo agendamento"; status coloridos (Pendente/Confirmado/Em atendimento/Finalizado/Cancelado/Faltou); durações informativas; horários 08–20 seg-sáb / 09–14 dom.
- **Clientes** (`Clients.tsx` reformulada): busca + filtro departamento + status (Ativo/Inativo/VIP) + ordenação; card com foto/último atendimento/visitas; perfil em 3 abas (Informações, Histórico com total gasto automático, Prótese com aplicação/manutenção/fotos antes-depois só p/ dept Prótese); ações VIP/inativar/WhatsApp/agendar.
- **WhatsApp** (novo `WhatsApp.tsx`): 2 abas Prótese/Salão, cada uma com sub-seções Conversas, Disparos (filtros VIP/aniversariante/inativo, variáveis dinâmicas, agendamento), Templates (texto/áudio). Automações listadas como toggles.
- **Financeiro** (`Financeiro.tsx` reformulado): 3 abas Caixa (resumo + faturamento por dept + movimentações + modal registrar atendimento com comissão automática), Lançamentos (despesas), Relatórios (gráfico 6 meses + totais + comissões).
- **Estoque** (`ProductsInventory.tsx` reformulado): 2 abas Produtos e Movimentações; campo "vendável" no cadastro; categorias Geladeira/Salão/Prótese/Outros; status OK/Baixo/Crítico.
- **Marketing** (novo `Marketing.tsx`): 4 abas Anúncios (sub-abas Prótese/Cursos, criativo quente no topo), Leads (com botão "enviar p/ agenda do Marcos"), Follow Up, Campanhas.
- **Relatórios** (novo `Relatorios.tsx`): 4 abas Financeiro / Equipe / Clientes / Marketing com seletor de período.
- **Configurações** (novo `Configuracoes.tsx`): 5 seções Empresa, Usuários & Permissões (matriz ver/criar/editar/excluir/exportar × escopo), Serviços, Comissões (com confirmação de senha do proprietário — mock), Integrações (WhatsApp x2, Meta Ads x2, Google Ads "em breve").

Módulos que só aparecem para certos perfis: Follow Up (Gerente/Recepção/Marketing), Tarefas (Recepção/Barbeiro), Minha Comissão (Barbeiro), Leads/Anúncios/Campanhas (Marketing).

## Fase 4 — Dados mock

- `src/hooks/mock/useMockAgenda.ts`, `useMockClients.ts`, `useMockWhatsapp.ts`, `useMockLeads.ts`, `useMockAds.ts`, `useMockTeam.ts` — geradores determinísticos com semana/mês corrente.
- Manter `useFinance` e `useProducts` existentes; adaptar formas para novos filtros (departamento, vendável).

## Fase 5 — Responsividade & polimento

- Grids `grid-cols-4 md:grid-cols-2 sm:grid-cols-1`.
- Drawer mobile já ok — passa a listar os itens do perfil ativo.
- Topbar sempre `sticky`.

## Detalhes técnicos

```
src/
  context/ProfileContext.tsx
  components/
    Layout.tsx                (dinâmico por perfil)
    dashboards/
      OwnerDashboard.tsx
      PartnerDashboard.tsx
      ManagerDashboard.tsx
      ReceptionDashboard.tsx
      BarberDashboard.tsx
      MarketingDashboard.tsx
      widgets/{StatCard,BarChartCard,AlertList,TeamRanking,NextClientCard,QuickActions,WhatsAppQueue,CreativeCard}.tsx
    Agenda.tsx                (Dia/Semana/Mês + filtro dept)
    Clients.tsx               (3 abas no perfil + filtro dept/VIP)
    WhatsApp.tsx              (novo)
    Financeiro.tsx            (Caixa/Lançamentos/Relatórios)
    ProductsInventory.tsx     (Produtos/Movimentações + vendável)
    Marketing.tsx             (novo)
    Relatorios.tsx            (novo)
    Configuracoes.tsx         (novo)
  hooks/mock/*.ts
  pages/
    Index.tsx                 (roteia dashboards por perfil)
    Login.tsx                 (abas Entrar/Criar conta)
```

- Componentes antigos que somem da nav (`Professionals`, `DailyControl`, `ProsthesisSales`, `SubscriptionPlans`, `Dashboard` genérica) ficam no repo temporariamente mas param de ser usados; removo depois se você confirmar.
- Tudo em pt-BR, R$ (BRL).
- Nenhuma migração de banco nesta fase — só mocks + auth Supabase existente.

## Fora de escopo (fica para depois)

- Persistência real dos módulos novos (WhatsApp, Marketing, Relatórios, Configurações).
- Integração real Meta Ads / WhatsApp Cloud API.
- Matriz de permissões efetiva (agora só afeta UI de sidebar/dashboard).

Confirma para eu começar pela Fase 1?
