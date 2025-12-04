import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { day: "1-5", entradas: 4200, saidas: 1200 },
  { day: "6-10", entradas: 4800, saidas: 1400 },
  { day: "11-15", entradas: 5100, saidas: 1600 },
  { day: "16-20", entradas: 5400, saidas: 1500 },
  { day: "21-25", entradas: 5800, saidas: 1700 },
  { day: "26-31", entradas: 6200, saidas: 1800 },
];

const salesDistribution = [
  { name: "Serviços", value: 75 },
  { name: "Produtos", value: 25 },
];

const COLORS = ["hsl(var(--success))", "hsl(var(--accent))"];

export const MonthlyView = () => {
  const professionals = [
    { name: "Marcos Macedo", initials: "MM", services: 42, products: 28, revenue: "2.240,00", color: "bg-blue-600" },
    { name: "Junior Silva", initials: "JS", services: 38, products: 35, revenue: "1.890,00", color: "bg-green-600" },
    { name: "Cristiano Marques", initials: "CM", services: 35, products: 42, revenue: "2.100,00", color: "bg-cyan-600" },
    { name: "Claudio Carvalho", initials: "CC", services: 30, products: 25, revenue: "1.625,00", color: "bg-amber-600" },
    { name: "Silvia Gomes", initials: "SG", services: 25, products: 12, revenue: "2.340,00", color: "bg-red-600" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Visualização Mensal</h2>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resumo Financeiro do Mês</CardTitle>
          <Select defaultValue="4">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Janeiro</SelectItem>
              <SelectItem value="1">Fevereiro</SelectItem>
              <SelectItem value="2">Março</SelectItem>
              <SelectItem value="3">Abril</SelectItem>
              <SelectItem value="4">Maio</SelectItem>
              <SelectItem value="5">Junho</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="entradas" stroke="hsl(var(--success))" strokeWidth={2} name="Entradas" />
              <Line type="monotone" dataKey="saidas" stroke="hsl(var(--destructive))" strokeWidth={2} name="Saídas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho dos Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Profissional</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Serviços</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Produtos Vendidos</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Faturamento Total</th>
                  </tr>
                </thead>
                <tbody>
                  {professionals.map((prof, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`${prof.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                            {prof.initials}
                          </div>
                          <span className="text-sm">{prof.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{prof.services}</td>
                      <td className="py-3 px-4 text-sm">{prof.products}</td>
                      <td className="py-3 px-4 text-sm font-semibold">R$ {prof.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};