import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useProducts, productStatus, brl } from "@/hooks/useProducts";
import { useFinance, EXPENSE_CATEGORIES, type ExpenseCategory } from "@/hooks/useFinance";
import { toast } from "@/hooks/use-toast";

type SoldItem = { productId: string; quantity: number };

export const DailyControl = () => {
  const { products, sellProduct } = useProducts();
  const { addExpense, addIncome } = useFinance();

  const [items, setItems] = useState<SoldItem[]>([]);
  const [serviceType, setServiceType] = useState<string>("");
  const [professional, setProfessional] = useState<string>("");
  const [totalValue, setTotalValue] = useState<string>("");
  const [tip, setTip] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("");

  const todayStr = () => new Date().toISOString().slice(0, 10);
  const [expDate, setExpDate] = useState<string>(todayStr());
  const [expDesc, setExpDesc] = useState<string>("");
  const [expValue, setExpValue] = useState<string>("");
  const [expCategory, setExpCategory] = useState<ExpenseCategory | "">("");

  const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
  const updateItem = (idx: number, patch: Partial<SoldItem>) =>
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

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

  const productsTotal = items.reduce((sum, it) => {
    const p = products.find((x) => x.id === it.productId);
    return sum + (p ? p.price * it.quantity : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !serviceType || !professional || !payMethod) {
      toast({ title: "Preencha cliente, serviço, profissional e forma de pagamento", variant: "destructive" });
      return;
    }
    // Validate stock before deducting anything
    for (const it of items) {
      if (!it.productId) continue;
      const p = products.find((x) => x.id === it.productId);
      if (!p) continue;
      if (p.stock < it.quantity) {
        toast({
          title: "Estoque insuficiente",
          description: `${p.name}: apenas ${p.stock} un.`,
          variant: "destructive",
        });
        return;
      }
    }
    // Deduct
    for (const it of items) {
      if (!it.productId) continue;
      sellProduct(it.productId, it.quantity);
    }
    const tipValue = parseFloat(tip.replace(",", ".")) || 0;
    const totalIn = numericValue + productsTotal + tipValue;
    const payLabel = payMethod === "debito" ? "Débito" : payMethod === "credito" ? "Crédito" : "PIX";
    if (totalIn > 0) {
      addIncome({
        date: todayStr(),
        description: `Atendimento ${client}${serviceType ? ` (${serviceType})` : ""} — ${payLabel}`,
        amount: totalIn,
      });
    }
    toast({
      title: "Atendimento registrado",
      description: `${client} • ${brl(numericValue + productsTotal)} • ${payLabel} • Comissão ${brl(commission)}`,
    });
    setItems([]);
    setClient("");
    setClientPhone("");
    setClientEmail("");
    setTotalValue("");
    setTip("");
    setPayMethod("");
  };

  const criticalStock = products
    .map((p) => ({ p, s: productStatus(p) }))
    .filter((x) => x.s !== "ok")
    .slice(0, 6);

  const transactions = [
    { time: "09:00", description: "João Silva (Corte - Marcos)", type: "atendimento", value: "50,00", products: "Heineken (1)" },
    { time: "10:30", description: "Carlos Santos (Barba - Junior)", type: "atendimento", value: "30,00", products: "Coca Cola 350ml (1)" },
    { time: "11:15", description: "Compra de Produtos", type: "despesa", value: "150,00", products: "-" },
    { time: "14:00", description: "Maria Oliveira (Luzes - Silvia)", type: "atendimento", value: "120,00", products: "-" },
    { time: "15:30", description: "Manutenção Equipamentos", type: "despesa", value: "80,00", products: "-" },
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <h6 className="font-semibold text-sm">Informações do Atendimento</h6>
                <div>
                  <Label htmlFor="clienteAtendimento">Cliente</Label>
                  <Input id="clienteAtendimento" placeholder="Nome do cliente" value={client} onChange={(e) => setClient(e.target.value)} />
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
                      <SelectItem value="kaua">Kauã Gonçalves</SelectItem>
                      <SelectItem value="cristiano">Cristiano Nogueira</SelectItem>
                      <SelectItem value="claudio">Claudio Carvalho</SelectItem>
                      <SelectItem value="marcos">Marcos Macedo</SelectItem>
                      <SelectItem value="silvia">Silvia Gomes (Cabeleireira)</SelectItem>
                      <SelectItem value="irani">💅 Irani (Manicure) - 65%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="servicosAtendimento" className="mb-2 block">Serviços</Label>
                  <Input
                    id="servicosAtendimento"
                    placeholder="Ex: Corte, Barba, Sobrancelha..."
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h6 className="font-semibold text-sm">Produtos Consumidos</h6>
                {items.map((it, idx) => {
                  const selected = products.find((p) => p.id === it.productId);
                  const outOfStock = selected && selected.stock < it.quantity;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex gap-2">
                        <Select value={it.productId} onValueChange={(v) => updateItem(idx, { productId: v })}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Produto..." />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id} disabled={p.stock <= 0}>
                                {p.name} — {brl(p.price)} {p.stock <= 0 ? "(sem estoque)" : `(${p.stock} un)`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-20"
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      {outOfStock && (
                        <p className="text-xs text-destructive">
                          Apenas {selected?.stock} em estoque.
                        </p>
                      )}
                    </div>
                  );
                })}
                <div className="flex justify-between items-center">
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-1" /> Adicionar Produto
                  </Button>
                  {productsTotal > 0 && (
                    <span className="text-sm font-medium">Produtos: {brl(productsTotal)}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="valorTotalAtendimento">Valor do Serviço (R$)</Label>
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

              <div>
                <Label>Forma de Pagamento</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debito">Débito</SelectItem>
                    <SelectItem value="credito">Crédito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
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

              <Button type="submit" className="w-full bg-success hover:bg-success/90">Registrar Atendimento</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lançar Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = parseFloat(expValue.replace(",", ".")) || 0;
                  if (!expDate || !expDesc || !amount || !expCategory) {
                    toast({ title: "Preencha todos os campos da despesa", variant: "destructive" });
                    return;
                  }
                  addExpense({ date: expDate, description: expDesc, amount, category: expCategory });
                  toast({ title: "Despesa registrada", description: `${expDesc} • ${brl(amount)}` });
                  setExpDesc("");
                  setExpValue("");
                  setExpCategory("");
                }}
              >
                <div>
                  <Label htmlFor="dataDespesa">Data</Label>
                  <Input type="date" id="dataDespesa" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="descricaoDespesa">Descrição</Label>
                  <Input id="descricaoDespesa" placeholder="Descrição da despesa" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="valorDespesa">Valor (R$)</Label>
                  <Input type="number" step="0.01" id="valorDespesa" placeholder="0,00" value={expValue} onChange={(e) => setExpValue(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="categoriaDespesa">Categoria</Label>
                  <Select value={expCategory} onValueChange={(v) => setExpCategory(v as ExpenseCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Registrar Despesa</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estoque Crítico</CardTitle>
            </CardHeader>
            <CardContent>
              {criticalStock.length > 0 ? (
                <>
                  <Alert className="mb-4 border-[hsl(var(--stock-low))] bg-[hsl(var(--stock-low)/0.1)]">
                    <AlertTriangle className="h-4 w-4 text-[hsl(var(--stock-low))]" />
                    <AlertDescription className="text-[hsl(var(--stock-low))]">
                      {criticalStock.length} produto(s) com estoque baixo
                    </AlertDescription>
                  </Alert>
                  <ul className="space-y-2">
                    {criticalStock.map(({ p, s }) => (
                      <li key={p.id} className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm">{p.name}</span>
                        <Badge
                          variant="outline"
                          className={s === "critical"
                            ? "bg-[hsl(var(--stock-critical)/0.1)] text-[hsl(var(--stock-critical))] border-[hsl(var(--stock-critical))]"
                            : "bg-[hsl(var(--stock-low)/0.1)] text-[hsl(var(--stock-low))] border-[hsl(var(--stock-low))]"
                          }
                        >
                          {p.stock} {p.stock === 1 ? "unidade" : "unidades"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Todos os produtos com estoque OK.</p>
              )}
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
