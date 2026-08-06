# Integrar Visualizações Semanal e Mensal na aba Financeiro

## Objetivo
Remover as abas separadas "Visualização Semanal" e "Visualização Mensal" e concentrar todos os gráficos e resumos financeiros na aba **Financeiro**.

## Alterações previstas

### 1. Navegação (Layout e roteamento)
- Remover os itens **"Visualização Semanal"** e **"Visualização Mensal"** da lista de navegação em `src/components/Layout.tsx`.
- Remover os cases `weekly` e `monthly` do switch em `src/pages/Index.tsx`.
- Manter o fallback padrão apontando para `Dashboard`.

### 2. Aba Financeiro (`src/components/Financeiro.tsx`)
Transformar a tela em um dashboard financeiro completo com três modos de visualização internos:

#### A) Visão Mensal (conteúdo atual da Visualização Mensal)
- Gráfico de linha com **Entradas × Saídas** por período do mês.
- Tabela de desempenho dos profissionais (serviços, produtos vendidos, faturamento).
- Gráfico de pizza com distribuição de vendas (Serviços × Produtos).

#### B) Visão Semanal (conteúdo atual da Visualização Semanal)
- Gráfico de barras com **Entradas × Saídas** por dia da semana.
- Gráfico de pizza de **Serviços por Profissional**.
- Gráfico de barras de **Vendas de Produtos** por dia.

#### C) Despesas por Categoria (conteúdo atual do Financeiro)
- Manter o seletor de mês.
- Gráfico de barras com despesas por categoria.
- Cards de resumo: Total de Entradas, Total de Saídas e Resultado do Mês.

#### Interação
- Adicionar um seletor de abas internas no topo do Financeiro para alternar entre **"Resumo Mensal"**, **"Resumo Semanal"** e **"Despesas por Categoria"** (ou similar), sem recarregar a página.
- Manter o seletor de mês visível nas visualizações que dependem dele.

### 3. Limpeza
- Remover os arquivos `src/components/WeeklyView.tsx` e `src/components/MonthlyView.tsx` após a migração do conteúdo.

## Resultado esperado
- Sidebar/mobile drawer com duas abas a menos.
- Aba Financeiro unificada e auto-suficiente para análise financeira (mensal, semanal e por categoria).
- Código simplificado, sem componentes órfãos.
