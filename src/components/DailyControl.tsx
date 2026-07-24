import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const DailyControl = () => {
  const [products, setProducts] = useState<{ product: string; quantity: number }[]>([]);
  const [serviceType, setServiceType] = useState<string>("");
  const [professional, setProfessional] = useState<string>("");
  const [totalValue, setTotalValue] = useState<string>("");
  const [tip, setTip] = useState<string>("");

  const addProduct = () => {
    setProducts([...products, { product: "", quantity: 1 }]);
  };

  const COMMISSION_TABLE: Record<string, { barbearia: number; manutencao: number; manicure: number }> = {
    kauan: { barbearia: 0.5, manutencao: 0.4, manicure: 0 },
    cristiano: { barbearia: 0.5, manutencao: 0.4, manicure: 0 },
    claudio: { barbearia: 0.5, manutencao: 0.4, manicure: 0 },
    marcos: { barbearia: 0.5, manutencao: 0.4, manicure: 0 },
    silvia: { barbearia: 0.5, manutencao: 0.4, manicure: 0 },
    irani: { barbearia: 0, manutencao: 0, manicure: 0.65 },
  };

  const numericValue = parseFloat(totalValue.replace(",", ".")) || 0;
  const rate =
    professional && serviceType && COMMISSION_TABLE[professional]
      ? COMMISSION_TABLE[professional][serviceType as "barbearia" | "manutencao" | "manicure"] ?? 0
      : 0;
  const commission = numericValue * rate;
  const brl = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });


  const transactions = [
    { time: "09:00", description: "João Silva (Corte - Marcos)", type: "atendimento", value: "50,00", products: "Heineken (1)" },
    { time: "10:30", description: "Carlos Santos (Barba - Junior)", type: "atendimento", value: "30,00", products: "Coca Cola 350ml (1)" },
    { time: "11:15", description: "Compra de Produtos", type: "despesa", value: "150,00", products: "-" },
    { time: "14:00", description: "Maria Oliveira (Luzes - Silvia)", type: "atendimento", value: "120,00", products: "-" },
    { time: "15:30", description: "Manutenção Equipamentos", type: "despesa", value: "80,00", products: "-" },
  ];

  const criticalStock = [
    { name: "Corona", quantity: 2, status: "low" },
    { name: "Spaten", quantity: 3, status: "low" },
    { name: "Coca Cola 200ml", quantity: 1, status: "critical" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Controle Diário</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <h6 className="font-semibold text-sm">Informações do Atendimento</h6>
                <div>
                  <Label htmlFor="clienteAtendimento">Cliente</Label>
                  <Input id="clienteAtendimento" placeholder="Nome do cliente" />
                </div>
                <div>
                  <Label>Tipo de Serviço</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="barbearia">Barbearia - 50%</SelectItem>
                      <SelectItem value="manutencao">Manutenção - 40%</SelectItem>
                      <SelectItem value="manicure">💅 Manicure - 65% (Irani)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="profissionalAtendimento">Profissional</Label>
                  <Select value={professional} onValueChange={setProfessional}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kauan">Kauan Carvalho</SelectItem>
                      <SelectItem value="cristiano">Cristiano Nogueira</SelectItem>
                      <SelectItem value="claudio">Claudio Carvalho</SelectItem>
                      <SelectItem value="marcos">Marcos Macedo</SelectItem>
                      <SelectItem value="silvia">Silvia Gomes (Cabeleireira)</SelectItem>
                      <SelectItem value="irani">💅 Irani (Manicure) - 65%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Serviços</Label>
                  <div className="space-y-2">
                    {[
                      { id: "corte", label: "Corte (R$ 35,00)" },
                      { id: "barba", label: "Barba (R$ 20,00)" },
                      { id: "sobrancelha", label: "Sobrancelha (R$ 15,00)" },
                      { id: "luzes", label: "Luzes (R$ 120,00)" },
                      { id: "alisamento", label: "Alisamento (R$ 150,00)" },
                      { id: "botox", label: "Botox (R$ 80,00)" },
                    ].map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox id={service.id} />
                        <label htmlFor={service.id} className="text-sm">{service.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <h6 className="font-semibold text-sm">Produtos Consumidos</h6>
                {products.map((_, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Produto..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heineken">Heineken (R$ 15,00)</SelectItem>
                        <SelectItem value="stella">Stella Artois (R$ 12,00)</SelectItem>
                        <SelectItem value="corona">Corona (R$ 14,00)</SelectItem>
                        <SelectItem value="coca350">Coca Cola 350ml (R$ 6,00)</SelectItem>
                        <SelectItem value="guarana">Guaraná 200ml (R$ 4,00)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" min="1" defaultValue="1" className="w-20" />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                  <Plus className="w-4 h-4 mr-1" /> Adicionar Produto
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="valorTotalAtendimento">Valor Total (R$)</Label>
                  <Input
                    id="valorTotalAtendimento"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={totalValue}
                    onChange={(e) => setTotalValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gorjetaAtendimento">Gorjeta (R$)</Label>
                  <Input
                    id="gorjetaAtendimento"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-md flex justify-between items-center">
                <div className="text-sm">
                  <div className="font-semibold">Comissão</div>
                  <div className="text-xs text-muted-foreground">
                    {serviceType && professional
                      ? `${(rate * 100).toFixed(0)}% de ${brl(numericValue)}`
                      : "Selecione tipo e profissional"}
                  </div>
                </div>
                <div className="text-lg font-bold">{brl(commission)}</div>
              </div>

              <Button className="w-full bg-success hover:bg-success/90">Registrar Atendimento</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lançar Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="dataDespesa">Data</Label>
                  <Input type="date" id="dataDespesa" />
                </div>
                <div>
                  <Label htmlFor="descricaoDespesa">Descrição</Label>
                  <Input id="descricaoDespesa" placeholder="Descrição da despesa" />
                </div>
                <div>
                  <Label htmlFor="valorDespesa">Valor (R$)</Label>
                  <Input type="number" step="0.01" id="valorDespesa" placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="categoriaDespesa">Categoria</Label>
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
                <Button className="w-full">Registrar Despesa</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estoque Crítico</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-[hsl(var(--stock-low))] bg-[hsl(var(--stock-low)/0.1)]">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--stock-low))]" />
                <AlertDescription className="text-[hsl(var(--stock-low))]">
                  3 produtos com estoque baixo
                </AlertDescription>
              </Alert>
              <ul className="space-y-2">
                {criticalStock.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <span className="text-sm">{item.name}</span>
                    <Badge 
                      variant="outline" 
                      className={item.status === "critical" 
                        ? "bg-[hsl(var(--stock-critical)/0.1)] text-[hsl(var(--stock-critical))] border-[hsl(var(--stock-critical))]" 
                        : "bg-[hsl(var(--stock-low)/0.1)] text-[hsl(var(--stock-low))] border-[hsl(var(--stock-low))]"
                      }
                    >
                      {item.quantity} {item.quantity === 1 ? "unidade" : "unidades"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Movimentações do Dia</CardTitle>
          <Input type="date" className="w-auto" defaultValue="2023-05-15" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Hora</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Cliente/Descrição</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Produtos</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm">{tx.time}</td>
                    <td className="py-3 px-4 text-sm">{tx.description}</td>
                    <td className="py-3 px-4">
                      <Badge variant={tx.type === "atendimento" ? "default" : "destructive"} className={tx.type === "atendimento" ? "bg-success" : ""}>
                        {tx.type === "atendimento" ? "Atendimento" : "Despesa"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold">R$ {tx.value}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{tx.products}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={3} className="text-right py-3 px-4">Saldo do Dia:</td>
                  <td className="py-3 px-4">R$ 1.040,00</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};