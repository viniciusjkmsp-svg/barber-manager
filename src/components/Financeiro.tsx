import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinance, brl, EXPENSE_CATEGORIES } from "@/hooks/useFinance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Financeiro = () => {
  const { expenses, incomes } = useFinance();
  const now = new Date();
  const [month, setMonth] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  const inMonth = (dateStr: string) => dateStr?.startsWith(month);

  const expensesInMonth = expenses.filter((e) => inMonth(e.date));
  const incomesInMonth = incomes.filter((i) => inMonth(i.date));

  const totalIn = incomesInMonth.reduce((s, i) => s + i.amount, 0);
  const totalOut = expensesInMonth.reduce((s, e) => s + e.amount, 0);
  const result = totalIn - totalOut;

  const chartData = useMemo(
    () =>
      EXPENSE_CATEGORIES.map((cat) => ({
        categoria: cat,
        total: expensesInMonth
          .filter((e) => e.category === cat)
          .reduce((s, e) => s + e.amount, 0),
      })),
    [expensesInMonth]
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-foreground">Financeiro</h2>
        <div>
          <Label htmlFor="mesFinanceiro">Mês</Label>
          <Input
            id="mesFinanceiro"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {totalOut === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma despesa registrada neste mês.
            </p>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="categoria" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(v) => `R$${v}`}
                  />
                  <Tooltip
                    formatter={(v: number) => brl(v)}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <p className="text-sm text-muted-foreground">Total de Entradas</p>
              <p className="text-2xl font-bold text-success">{brl(totalIn)}</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-muted-foreground">Total de Saídas</p>
              <p className="text-2xl font-bold text-destructive">{brl(totalOut)}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                result >= 0
                  ? "bg-primary/10 border-primary/30"
                  : "bg-destructive/10 border-destructive/30"
              }`}
            >
              <p className="text-sm text-muted-foreground">Resultado do Mês</p>
              <p
                className={`text-2xl font-bold ${
                  result >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {brl(result)}
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Entradas − Saídas = Resultado
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
