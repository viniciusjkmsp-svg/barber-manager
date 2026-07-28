import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./StatsCard";
import { ServiceBadge } from "./ServiceBadge";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Lock, Unlock, Scissors, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const barbersWeekData = [
  { name: "Marcos", valor: 1450 },
  { name: "Junior", valor: 1200 },
  { name: "Cristiano", valor: 1080 },
  { name: "Claudio", valor: 950 },
  { name: "Kauan", valor: 820 },
  { name: "Kauã", valor: 640 },
];

const sellersData = [
  { name: "Vinicius", value: 12 },
  { name: "Giovanna", value: 7 },
  { name: "Davi", value: 5 },
];

const productsData = [
  { name: "Heineken", value: 45 },
  { name: "Stella", value: 32 },
  { name: "Coca-Cola", value: 28 },
  { name: "Corona", value: 18 },
  { name: "Guaraná", value: 15 },
];

const SELLER_COLORS = ["hsl(var(--primary))", "hsl(150, 60%, 45%)", "hsl(30, 90%, 55%)"];
const BARBER_COLORS = [
  "hsl(var(--primary))",
  "hsl(150, 60%, 45%)",
  "hsl(30, 90%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 70%, 55%)",
  "hsl(200, 70%, 50%)",
];

// Agenda do dia - prótese e mentoria
const agendaHoje = [
  { time: "10:00", client: "Rafael Mendes", type: "protese", professional: "Vinicius" },
  { time: "14:30", client: "Lucas Ferreira", type: "mentoria", professional: "Vinicius" },
  { time: "16:00", client: "André Souza", type: "protese", professional: "Giovanna" },
];

export const Dashboard = () => {
  const [marcosLocked, setMarcosLocked] = useState(false);

  const appointments = [
    { time: "09:00", client: "João Silva", professional: "Kauan Carvalho", services: ["corte"], products: "Heineken (1)", value: "50,00", tip: "5,00" },
    { time: "10:30", client: "Carlos Santos", professional: "Cristiano Nogueira", services: ["barba"], products: "Coca Cola 350ml (1)", value: "30,00", tip: "0,00" },
    { time: "11:15", client: "Roberto Alves", professional: "Claudio Carvalho", services: ["corte", "barba"], products: "Stella Artois (2)", value: "75,00", tip: "10,00" },
    { time: "14:00", client: "Maria Oliveira", professional: "Silvia Gomes", services: ["luzes"], products: "-", value: "120,00", tip: "15,00" },
    { time: "15:30", client: "Ana Costa", professional: "Irani", services: ["manicure"], products: "Guaraná 200ml (1)", value: "35,00", tip: "3,00" },
  ];

  const toggleMarcos = () => {
    setMarcosLocked((v) => {
      const nv = !v;
      toast.success(nv ? "Agenda do Marcos Macedo fechada" : "Agenda do Marcos Macedo reaberta");
      return nv;
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Dashboard - Resumo do Dia</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Entradas do Dia" value="R$ 1.420,00" type="entrada" />
        <StatsCard title="Saídas do Dia" value="R$ 380,00" type="saida" />
        <StatsCard title="Saldo do Dia" value="R$ 1.040,00" type="saldo" />
      </div>

      {/* Agenda do Dia - Prótese & Mentoria + Controle Marcos Macedo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agenda do Dia - Prótese & Mentoria</CardTitle>
          </CardHeader>
          <CardContent>
            {agendaHoje.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma prótese ou mentoria agendada para hoje.</p>
            ) : (
              <div className="space-y-3">
                {agendaHoje.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${a.type === "protese" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                        {a.type === "protese" ? <Scissors className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{a.time} — {a.client}</p>
                        <p className="text-xs text-muted-foreground">Vendedor: {a.professional}</p>
                      </div>
                    </div>
                    <Badge variant={a.type === "protese" ? "default" : "secondary"}>
                      {a.type === "protese" ? "Prótese Capilar" : "Mentoria"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda - Marcos Macedo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={marcosLocked ? "destructive" : "default"}>
                {marcosLocked ? "Fechada" : "Aberta"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Controle exclusivo da agenda do Marcos Macedo. Ao fechar, novos agendamentos ficam bloqueados apenas para ele.
            </p>
            <Button onClick={toggleMarcos} className="w-full" variant={marcosLocked ? "outline" : "default"}>
              {marcosLocked ? <><Unlock className="w-4 h-4 mr-2" /> Reabrir agenda</> : <><Lock className="w-4 h-4 mr-2" /> Fechar agenda do dia</>}
            </Button>
          </CardContent>
        </Card>
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
                    <th className="text-left py-3 px-4 font-semibold text-sm">Gorjeta</th>
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
                      <td className="py-3 px-4 text-sm text-muted-foreground">R$ {apt.tip}</td>
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
              <CardTitle>Faturamento por Barbeiro (Semana)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={barbersWeekData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, valor }) => `${name}: R$${valor}`}
                    outerRadius={85}
                    dataKey="valor"
                  >
                    {barbersWeekData.map((_, index) => (
                      <Cell key={`barber-${index}`} fill={BARBER_COLORS[index % BARBER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas - Vinicius, Giovanna & Davi</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={sellersData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={75}
                    dataKey="value"
                  >
                    {sellersData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={SELLER_COLORS[index % SELLER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
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
