import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const weeklyData = [
  { day: "Seg", entradas: 850, saidas: 250 },
  { day: "Ter", entradas: 920, saidas: 180 },
  { day: "Qua", entradas: 1100, saidas: 320 },
  { day: "Qui", entradas: 1250, saidas: 380 },
  { day: "Sex", entradas: 1450, saidas: 420 },
  { day: "Sáb", entradas: 1650, saidas: 290 },
  { day: "Dom", entradas: 750, saidas: 150 },
];

const professionalData = [
  { name: "Marcos", value: 12 },
  { name: "Junior", value: 10 },
  { name: "Cristiano", value: 9 },
  { name: "Claudio", value: 8 },
  { name: "Silvia", value: 7 },
];

const productsWeeklyData = [
  { day: "Seg", vendas: 45 },
  { day: "Ter", vendas: 52 },
  { day: "Qua", vendas: 68 },
  { day: "Qui", vendas: 75 },
  { day: "Sex", vendas: 92 },
  { day: "Sáb", vendas: 110 },
  { day: "Dom", vendas: 38 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const WeeklyView = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Visualização Semanal</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo Financeiro da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entradas" fill="hsl(var(--success))" name="Entradas" />
              <Bar dataKey="saidas" fill="hsl(var(--destructive))" name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Serviços por Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={professionalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {professionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productsWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="hsl(var(--accent))" name="Produtos Vendidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};