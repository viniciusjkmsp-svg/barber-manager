import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { ServiceBadge } from "./ServiceBadge";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const servicesData = [
  { name: "Corte", value: 42 },
  { name: "Barba", value: 28 },
  { name: "Luzes", value: 15 },
  { name: "Alisamento", value: 10 },
  { name: "Botox", value: 8 },
  { name: "Manicure", value: 20 },
];

const productsData = [
  { name: "Heineken", value: 45 },
  { name: "Stella", value: 32 },
  { name: "Coca-Cola", value: 28 },
  { name: "Corona", value: 18 },
  { name: "Guaraná", value: 15 },
];

const COLORS = ["hsl(195, 75%, 45%)", "hsl(150, 60%, 45%)", "hsl(30, 90%, 55%)", "hsl(330, 70%, 55%)", "hsl(165, 55%, 50%)", "hsl(225, 25%, 25%)"];

export const Dashboard = () => {
  const appointments = [
    { time: "09:00", client: "João Silva", professional: "Marcos Macedo", services: ["corte"], products: "Heineken (1)", value: "50,00" },
    { time: "10:30", client: "Carlos Santos", professional: "Junior Silva", services: ["barba"], products: "Coca Cola 350ml (1)", value: "30,00" },
    { time: "11:15", client: "Roberto Alves", professional: "Cristiano Marques", services: ["corte", "barba"], products: "Stella Artois (2)", value: "75,00" },
    { time: "14:00", client: "Maria Oliveira", professional: "Silvia Gomes", services: ["luzes"], products: "-", value: "120,00" },
    { time: "15:30", client: "Ana Costa", professional: "Nélia", services: ["manicure"], products: "Guaraná 200ml (1)", value: "35,00" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Dashboard - Resumo do Dia</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Entradas do Dia" value="R$ 1.420,00" type="entrada" />
        <StatsCard title="Saídas do Dia" value="R$ 380,00" type="saida" />
        <StatsCard title="Saldo do Dia" value="R$ 1.040,00" type="saldo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atendimentos de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Horário</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Profissional</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Serviço</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Produtos</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{apt.time}</td>
                      <td className="py-3 px-4 text-sm">{apt.client}</td>
                      <td className="py-3 px-4 text-sm">{apt.professional}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {apt.services.map((service, i) => (
                            <ServiceBadge key={i} service={service as any} />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{apt.products}</td>
                      <td className="py-3 px-4 text-sm font-semibold">R$ {apt.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {servicesData.map((entry, index) => (
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
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={productsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};