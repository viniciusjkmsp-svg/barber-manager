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

const servicesDistribution = [
  { name: "Corte", value: 145 },
  { name: "Barba", value: 95 },
  { name: "Luzes", value: 62 },
  { name: "Alisamento", value: 38 },
  { name: "Botox", value: 28 },
  { name: "Manicure", value: 75 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

export const MonthlyView = () => {
  const professionals = [
    { name: "Marcos Macedo", initials: "MM", services: 42, revenue: "1.890,00", commission: "567,00", color: "bg-blue-600" },
    { name: "Junior Silva", initials: "JS", services: 38, revenue: "1.520,00", commission: "456,00", color: "bg-green-600" },
    { name: "Cristiano Marques", initials: "CM", services: 35, revenue: "1.575,00", commission: "472,50", color: "bg-cyan-600" },
    { name: "Claudio Carvalho", initials: "CC", services: 30, revenue: "1.350,00", commission: "405,00", color: "bg-amber-600" },
    { name: "Silvia Gomes", initials: "SG", services: 25, revenue: "2.250,00", commission: "675,00", color: "bg-red-600" },
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
                    <th className="text-left py-3 px-4 font-semibold text-sm">Faturamento</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Comissão</th>
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
                      <td className="py-3 px-4 text-sm font-semibold">R$ {prof.revenue}</td>
                      <td className="py-3 px-4 text-sm font-semibold">R$ {prof.commission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicesDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {servicesDistribution.map((entry, index) => (
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
