import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const DailyControl = () => {
  const transactions = [
    { date: "15/05/2023", description: "Corte de Cabelo - João Silva", category: "Serviços", type: "entrada", value: "35,00" },
    { date: "15/05/2023", description: "Barba - Carlos Santos", category: "Serviços", type: "entrada", value: "20,00" },
    { date: "15/05/2023", description: "Compra de Produtos", category: "Despesas Operacionais", type: "saida", value: "150,00" },
    { date: "15/05/2023", description: "Luzes - Maria Oliveira", category: "Serviços", type: "entrada", value: "120,00" },
    { date: "15/05/2023", description: "Manutenção Equipamentos", category: "Despesas Operacionais", type: "saida", value: "80,00" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Controle Diário</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Lançar Entrada</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="dataEntrada">Data</Label>
                <Input type="date" id="dataEntrada" />
              </div>
              <div>
                <Label htmlFor="descricaoEntrada">Descrição</Label>
                <Input id="descricaoEntrada" placeholder="Descrição da entrada" />
              </div>
              <div>
                <Label htmlFor="valorEntrada">Valor (R$)</Label>
                <Input type="number" step="0.01" id="valorEntrada" placeholder="0,00" />
              </div>
              <div>
                <Label htmlFor="categoriaEntrada">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="produtos">Produtos</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Registrar Entrada</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lançar Saída</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="dataSaida">Data</Label>
                <Input type="date" id="dataSaida" />
              </div>
              <div>
                <Label htmlFor="descricaoSaida">Descrição</Label>
                <Input id="descricaoSaida" placeholder="Descrição da saída" />
              </div>
              <div>
                <Label htmlFor="valorSaida">Valor (R$)</Label>
                <Input type="number" step="0.01" id="valorSaida" placeholder="0,00" />
              </div>
              <div>
                <Label htmlFor="categoriaSaida">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="despesas">Despesas Operacionais</SelectItem>
                    <SelectItem value="folha">Folha de Pagamento</SelectItem>
                    <SelectItem value="impostos">Impostos</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Registrar Saída</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Movimentações do Dia</CardTitle>
          <Input type="date" className="w-auto" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Descrição</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm">{tx.date}</td>
                    <td className="py-3 px-4 text-sm">{tx.description}</td>
                    <td className="py-3 px-4 text-sm">{tx.category}</td>
                    <td className="py-3 px-4">
                      <Badge variant={tx.type === "entrada" ? "default" : "destructive"}>
                        {tx.type === "entrada" ? "Entrada" : "Saída"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold">R$ {tx.value}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={4} className="text-right py-3 px-4">Saldo do Dia:</td>
                  <td className="text-right py-3 px-4">R$ 870,00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
