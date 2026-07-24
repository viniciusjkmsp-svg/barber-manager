import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";

const SELLER_RATES: Record<string, number> = {
  davi: 0.03,
  giovanna: 0.03,
  outros: 0,
};

const MANAGER_RATE = 0.04; // Vinicius sobre TODAS as vendas

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ProsthesisSales = () => {
  const [value, setValue] = useState<string>("");
  const [seller, setSeller] = useState<string>("");

  const numeric = parseFloat(value.replace(",", ".")) || 0;
  const sellerRate = SELLER_RATES[seller] ?? 0;
  const sellerCommission = numeric * sellerRate;
  const managerCommission = numeric * MANAGER_RATE;
  const totalCommissions = sellerCommission + managerCommission;

  const sales = [
    { date: "10/05/2023", client: "Roberto Lima", value: "450,00", vendor: "Davi", commission: "13,50" },
    { date: "08/05/2023", client: "Carlos Eduardo", value: "380,00", vendor: "Giovanna", commission: "11,40" },
    { date: "05/05/2023", client: "Miguel Santos", value: "520,00", vendor: "Outro", commission: "0,00" },
    { date: "02/05/2023", client: "André Silva", value: "400,00", vendor: "Davi", commission: "12,00" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Vendas de Prótese Capilar</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label htmlFor="dataVenda">Data</Label>
                <Input type="date" id="dataVenda" />
              </div>
              <div>
                <Label htmlFor="clienteVenda">Cliente</Label>
                <Input id="clienteVenda" placeholder="Nome do cliente" />
              </div>
              <div>
                <Label htmlFor="valorVenda">Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  id="valorVenda"
                  placeholder="0,00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div>
                <Label>Vendedor</Label>
                <Select value={seller} onValueChange={setSeller}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="davi">Davi - 3%</SelectItem>
                    <SelectItem value="giovanna">Giovanna - 3%</SelectItem>
                    <SelectItem value="outros">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Comissão Vendedor ({(sellerRate * 100).toFixed(0)}%)</span>
                  <span className="font-semibold">{brl(sellerCommission)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vinicius (Gestor {(MANAGER_RATE * 100).toFixed(0)}%)</span>
                  <span className="font-semibold">{brl(managerCommission)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-1">
                  <span className="font-semibold">Total Comissões</span>
                  <span className="font-bold">{brl(totalCommissions)}</span>
                </div>
              </div>

              <Button className="w-full bg-success hover:bg-success/90">Registrar Venda</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-semibold">Vendedor</th>
                    <th className="text-right py-2 text-sm font-semibold">%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-2 text-sm">Davi</td><td className="py-2 text-sm text-right">3%</td></tr>
                  <tr className="border-b"><td className="py-2 text-sm">Giovanna</td><td className="py-2 text-sm text-right">3%</td></tr>
                  <tr><td className="py-2 text-sm">Vinicius (Gestor)</td><td className="py-2 text-sm text-right">4%</td></tr>
                </tbody>
              </table>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Vinicius recebe <strong>4% sobre TODAS as vendas</strong> de prótese.
                </AlertDescription>
              </Alert>
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
