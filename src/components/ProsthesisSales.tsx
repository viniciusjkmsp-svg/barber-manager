import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const salesByVendor = [
  { name: "Vinicius", vendas: 10, comissao: 480 },
  { name: "Outros", vendas: 2, comissao: 120 },
];

export const ProsthesisSales = () => {
  const sales = [
    { date: "10/05/2023", client: "Roberto Lima", value: "450,00", vendor: "Vinicius", commission: "45,00" },
    { date: "08/05/2023", client: "Carlos Eduardo", value: "380,00", vendor: "Vinicius", commission: "38,00" },
    { date: "05/05/2023", client: "Miguel Santos", value: "520,00", vendor: "Outro", commission: "0,00" },
    { date: "02/05/2023", client: "André Silva", value: "400,00", vendor: "Vinicius", commission: "40,00" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Vendas de Prótese Capilar</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Venda de Prótese</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="dataVenda">Data da Venda</Label>
                <Input type="date" id="dataVenda" />
              </div>
              <div>
                <Label htmlFor="clienteVenda">Cliente</Label>
                <Input id="clienteVenda" placeholder="Nome do cliente" />
              </div>
              <div>
                <Label htmlFor="valorVenda">Valor da Venda (R$)</Label>
                <Input type="number" step="0.01" id="valorVenda" placeholder="0,00" />
              </div>
              <div>
                <Label htmlFor="vendedorVenda">Vendedor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vinicius">Vinicius (Marketing)</SelectItem>
                    <SelectItem value="outros">Outro Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Comissão (10% para Vinicius)</Label>
                <div className="bg-muted p-3 rounded-md text-sm font-semibold">R$ 0,00</div>
              </div>
              <Button className="w-full bg-success hover:bg-success/90">Registrar Venda</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <h4 className="text-2xl font-bold">12</h4>
                  <p className="text-sm text-muted-foreground">Vendas no Mês</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h4 className="text-2xl font-bold">R$ 4.800</h4>
                  <p className="text-sm text-muted-foreground">Faturamento</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h4 className="text-2xl font-bold">R$ 480</h4>
                  <p className="text-sm text-muted-foreground">Comissão Vinicius</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h4 className="text-2xl font-bold">R$ 120</h4>
                  <p className="text-sm text-muted-foreground">Comissão Outros</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas por Vendedor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesByVendor}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vendas" fill="hsl(var(--accent))" name="Vendas" />
                  <Bar dataKey="comissao" fill="hsl(var(--success))" name="Comissão (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Vendedor</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Comissão</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm">{sale.date}</td>
                    <td className="py-3 px-4 text-sm">{sale.client}</td>
                    <td className="py-3 px-4 text-sm font-semibold">R$ {sale.value}</td>
                    <td className="py-3 px-4 text-sm">{sale.vendor}</td>
                    <td className="py-3 px-4 text-sm font-semibold">R$ {sale.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
