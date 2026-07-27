# Próxima fase — Fase 4: Dados mock realistas + Fase 5: Responsividade & polimento

As Fases 1–3 já estão no ar (ProfileContext, dashboards por perfil, módulos novos com dados hard-coded). O que falta para fechar o refator do MS Manager CRM é dar coerência aos dados entre módulos e finalizar o polimento visual/mobile.

## Fase 4 — Camada de dados mock compartilhada

Hoje cada módulo tem seus próprios arrays hard-coded, então o que aparece na Agenda não bate com o que aparece no Financeiro, no Dashboard do Marcos, no Ranking, etc. Vou centralizar em hooks mock com dados determinísticos (semana/mês corrente calculados a partir de `new Date()`).

Novos hooks em `src/hooks/mock/`:
- `useMockAgenda.ts` — agendamentos da semana e do mês por profissional/departamento (Barbearia, Salão, Prótese), com status (Pendente, Confirmado, Em atendimento, Finalizado, Cancelado, Faltou) e duração.
- `useMockClients.ts` — base de ~30 clientes com histórico, VIP, aniversariante, inativo, dept preferido, fotos antes/depois (placeholder) para prótese.
- `useMockWhatsapp.ts` — conversas Prótese/Salão, templates, fila de disparos.
- `useMockLeads.ts` — leads de anúncios (Prótese/Cursos) com origem, status, follow-up.
- `useMockAds.ts` — criativos ativos, criativo "quente" 🔥, CPL, ROAS.
- `useMockTeam.ts` — status ao vivo da equipe (livre/ocupado/pausa), meta do mês, ranking.

Módulos passam a ler desses hooks:
- Dashboards (Owner/Partner/Manager/Reception/Barber/Marketing) puxam os mesmos números → o "Próximo cliente" do Barbeiro é literalmente o próximo item da Agenda; o Ranking do Owner vem de `useMockTeam` + `useMockAgenda`.
- `Agenda.tsx` passa a consumir `useMockAgenda` (mantém o modal de novo agendamento, escrevendo no mesmo store em memória).
- `Clients.tsx` consome `useMockClients` (mantém as 3 abas Informações/Histórico/Prótese; aba Prótese só aparece se dept = Prótese).
- `WhatsApp.tsx`, `Marketing.tsx`, `Leads.tsx`, `FollowUp.tsx`, `MinhaComissao.tsx` idem.
- `Financeiro.tsx` e `Relatorios.tsx` derivam entradas/comissões dos atendimentos finalizados em `useMockAgenda` + despesas do `useFinance` existente.

Hooks legados que ficam:
- `useFinance` (despesas/lançamentos manuais) e `useProducts` (estoque) continuam como estão; só ganho um campo `vendavel: boolean` em produto e passo a filtrar categorias por Geladeira/Salão/Prótese/Outros no `ProductsInventory.tsx`.

## Fase 5 — Responsividade & polimento

- Grids padronizados: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` em stat cards; tabelas viram cards empilhados no mobile.
- Topbar `sticky top-0` em todas as rotas; drawer mobile já reflete os itens do perfil ativo (só revisar espaçamento e foco).
- Revisão de contraste dark/light em `StatusBadge`, `TeamRow`, `AlertRow`.
- Ajustes finos de tipografia e espaçamento nos dashboards para bater com o HTML de referência.
- Micro: skeleton loaders leves nos dashboards, empty states amigáveis, foco visível em botões dourados.

## Fora de escopo (fica para uma fase futura)

- Persistência real dos módulos novos no banco (WhatsApp, Marketing, Leads, Relatórios, Configurações).
- Integração real Meta Ads / WhatsApp Cloud API / Google Calendar.
- Matriz de permissões efetiva no backend (hoje só afeta UI da sidebar/dashboard).

## Detalhes técnicos

```
src/
  hooks/mock/
    useMockAgenda.ts
    useMockClients.ts
    useMockWhatsapp.ts
    useMockLeads.ts
    useMockAds.ts
    useMockTeam.ts
  components/
    Agenda.tsx              (consome useMockAgenda)
    Clients.tsx             (consome useMockClients, aba Prótese condicional)
    WhatsApp.tsx            (useMockWhatsapp)
    Marketing.tsx           (useMockAds + useMockLeads)
    Leads.tsx / FollowUp.tsx / MinhaComissao.tsx
    Financeiro.tsx          (deriva entradas de useMockAgenda)
    Relatorios.tsx          (deriva séries de useMockAgenda + useFinance)
    dashboards/*.tsx        (todos passam a consumir os hooks mock)
    ProductsInventory.tsx   (+ campo "vendável", categorias fixas)
```

Confirma para eu começar pela Fase 4 (hooks mock + integração cross-módulo) e emendar direto na Fase 5?
