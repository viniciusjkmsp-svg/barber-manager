import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Info, AlertTriangle, CalendarClock, Wrench, GraduationCap, FileText, MessageCircle, Copy, Trash2, Plus, CheckCircle2, DollarSign } from "lucide-react";
import { toast } from "sonner";

// ---------- Config ----------
const SELLER_RATES: Record<string, number> = {
  vinicius: 0.07,
  davi: 0.03,
  giovanna: 0.03,
  outros: 0,
};
const MANAGER_RATE = 0.04;
const MAINT_ALERT_DAYS = 10;
const MAINT_OVERDUE_DAYS = 20;

const SELLER_LABELS: Record<string, string> = {
  vinicius: "Vinicius",
  davi: "Davi",
  giovanna: "Giovanna",
  outros: "Outro",
};

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ---------- Types ----------
type PayMethod = "debito" | "credito" | "pix";
const PAY_LABELS: Record<PayMethod, string> = { debito: "Débito", credito: "Crédito", pix: "PIX" };

type Sale = {
  id: string;
  date: string;
  client: string;
  whatsapp?: string;
  value: number;
  seller: string;
  installments: number;
  installmentsPaid: number;
  payMethod1: PayMethod;
  payAmount1: number;
  payMethod2?: PayMethod;
  payAmount2?: number;
  lastMaintenance?: string;
  notes?: string;
};

type MentoriaSale = {
  id: string;
  date: string;
  client: string;
  whatsapp?: string;
  value: number;
  seller: string;
  installments: number;
  installmentsPaid: number;
  payMethod1: PayMethod;
  payAmount1: number;
  payMethod2?: PayMethod;
  payAmount2?: number;
  notes?: string;
};

// ---------- Storage ----------
const SALES_KEY = "barbearia_prosthesis_sales_v1";
const MENTORIA_KEY = "barbearia_mentoria_sales_v1";

const load = <T,>(k: string, def: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : def;
  } catch {
    return def;
  }
};

// ---------- Helpers ----------
const daysBetween = (a: string, b: string) => {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};
const today = () => new Date().toISOString().slice(0, 10);

const maintStatus = (sale: Sale): { label: string; cls: string; days: number; kind: "ok" | "soon" | "overdue" } => {
  const ref = sale.lastMaintenance ?? sale.date;
  const days = daysBetween(ref, today());
  if (days >= MAINT_OVERDUE_DAYS) return { label: `${days}d — VENCIDA`, cls: "bg-destructive/20 text-destructive border-destructive/40", days, kind: "overdue" };
  if (days >= MAINT_ALERT_DAYS) return { label: `${days}d — atenção`, cls: "bg-warning/20 text-warning border-warning/40", days, kind: "soon" };
  return { label: `${days}d — ok`, cls: "bg-success/20 text-success border-success/40", days, kind: "ok" };
};

export const ProsthesisSales = () => {
  // ---------- Sales state ----------
  const [sales, setSales] = useState<Sale[]>(() => load<Sale[]>(SALES_KEY, []));
  useEffect(() => localStorage.setItem(SALES_KEY, JSON.stringify(sales)), [sales]);

  const [saleForm, setSaleForm] = useState({
    date: today(),
    client: "",
    whatsapp: "",
    value: "",
    seller: "",
    installments: "1",
    payMethod1: "pix" as PayMethod,
    payAmount1: "",
    useSecond: false,
    payMethod2: "credito" as PayMethod,
    payAmount2: "",
    notes: "",
  });

  const numeric = parseFloat(saleForm.value.replace(",", ".")) || 0;
  const sellerRate = SELLER_RATES[saleForm.seller] ?? 0;
  const sellerCommission = numeric * sellerRate;
  const managerCommission = saleForm.seller && saleForm.seller !== "vinicius" ? numeric * MANAGER_RATE : 0;
  const totalCommissions = sellerCommission + managerCommission;
  const installmentsNum = Math.max(parseInt(saleForm.installments) || 1, 1);
  const perInstallment = installmentsNum > 0 ? numeric / installmentsNum : 0;

  const submitSale = () => {
    if (!saleForm.client || !numeric || !saleForm.seller) {
      toast.error("Preencha cliente, valor e vendedor");
      return;
    }
    const amt1Raw = parseFloat(saleForm.payAmount1.replace(",", ".")) || 0;
    const amt2Raw = parseFloat(saleForm.payAmount2.replace(",", ".")) || 0;
    const payAmount1 = saleForm.useSecond ? (amt1Raw || numeric / 2) : numeric;
    const payAmount2 = saleForm.useSecond ? (amt2Raw || numeric - payAmount1) : undefined;

    if (saleForm.useSecond && Math.abs((payAmount1 + (payAmount2 || 0)) - numeric) > 0.01) {
      toast.error("A soma dos dois pagamentos precisa ser igual ao valor da venda");
      return;
    }

    const s: Sale = {
      id: crypto.randomUUID(),
      date: saleForm.date,
      client: saleForm.client,
      whatsapp: saleForm.whatsapp || undefined,
      value: numeric,
      seller: saleForm.seller,
      installments: installmentsNum,
      installmentsPaid: 0,
      payMethod1: saleForm.payMethod1,
      payAmount1,
      payMethod2: saleForm.useSecond ? saleForm.payMethod2 : undefined,
      payAmount2,
      lastMaintenance: undefined,
      notes: saleForm.notes || undefined,
    };
    setSales((p) => [s, ...p]);
    setSaleForm({ ...saleForm, client: "", whatsapp: "", value: "", payAmount1: "", payAmount2: "", notes: "" });
    toast.success("Venda registrada — cliente adicionado ao controle de manutenção");
  };

  const removeSale = (id: string) => setSales((p) => p.filter((s) => s.id !== id));

  const markMaintenance = (id: string) => {
    setSales((p) => p.map((s) => (s.id === id ? { ...s, lastMaintenance: today() } : s)));
    toast.success("Manutenção registrada");
  };

  const registerPayment = (id: string) => {
    setSales((p) =>
      p.map((s) => {
        if (s.id !== id) return s;
        if (s.installmentsPaid >= s.installments) {
          toast.info("Parcelas já quitadas");
          return s;
        }
        return { ...s, installmentsPaid: s.installmentsPaid + 1 };
      })
    );
  };

  const maintReminder = (s: Sale) =>
    `Olá ${s.client}! ✂️\n\nPassando pra lembrar que sua prótese capilar está no prazo de manutenção (retoque a cada 10-20 dias garante longevidade e visual perfeito).\n\nQuer que eu já agende um horário essa semana? É só responder aqui. 🙌`;

  const copyMaint = async (s: Sale) => {
    await navigator.clipboard.writeText(maintReminder(s));
    toast.success("Mensagem copiada!");
  };

  const waMaint = (s: Sale) => {
    const phone = (s.whatsapp || "").replace(/\D/g, "");
    if (!phone) return null;
    return `https://wa.me/55${phone}?text=${encodeURIComponent(maintReminder(s))}`;
  };

  const totalReceita = sales.reduce((s, x) => s + x.value, 0);
  const overdueCount = sales.filter((s) => maintStatus(s).kind === "overdue").length;
  const soonCount = sales.filter((s) => maintStatus(s).kind === "soon").length;
  const openInstallments = sales.reduce((s, x) => s + (x.value - x.value * (x.installmentsPaid / x.installments)), 0);

  const salesSorted = useMemo(() => {
    return [...sales].sort((a, b) => maintStatus(b).days - maintStatus(a).days);
  }, [sales]);

  // ---------- Mentoria state ----------
  const [mentorias, setMentorias] = useState<MentoriaSale[]>(() => load<MentoriaSale[]>(MENTORIA_KEY, []));
  useEffect(() => localStorage.setItem(MENTORIA_KEY, JSON.stringify(mentorias)), [mentorias]);

  const [mentoriaForm, setMentoriaForm] = useState({
    date: today(),
    client: "",
    whatsapp: "",
    value: "",
    seller: "",
    installments: "1",
    payMethod1: "pix" as PayMethod,
    payAmount1: "",
    useSecond: false,
    payMethod2: "credito" as PayMethod,
    payAmount2: "",
    notes: "",
  });

  const mNumeric = parseFloat(mentoriaForm.value.replace(",", ".")) || 0;
  const mSellerRate = SELLER_RATES[mentoriaForm.seller] ?? 0;
  const mSellerCommission = mNumeric * mSellerRate;
  const mManagerCommission = mentoriaForm.seller && mentoriaForm.seller !== "vinicius" ? mNumeric * MANAGER_RATE : 0;
  const mTotalCommissions = mSellerCommission + mManagerCommission;
  const mInstallmentsNum = Math.max(parseInt(mentoriaForm.installments) || 1, 1);
  const mPerInstallment = mInstallmentsNum > 0 ? mNumeric / mInstallmentsNum : 0;

  const submitMentoria = () => {
    if (!mentoriaForm.client || !mNumeric || !mentoriaForm.seller) {
      toast.error("Preencha cliente, valor e vendedor");
      return;
    }
    const amt1Raw = parseFloat(mentoriaForm.payAmount1.replace(",", ".")) || 0;
    const amt2Raw = parseFloat(mentoriaForm.payAmount2.replace(",", ".")) || 0;
    const payAmount1 = mentoriaForm.useSecond ? (amt1Raw || mNumeric / 2) : mNumeric;
    const payAmount2 = mentoriaForm.useSecond ? (amt2Raw || mNumeric - payAmount1) : undefined;

    if (mentoriaForm.useSecond && Math.abs((payAmount1 + (payAmount2 || 0)) - mNumeric) > 0.01) {
      toast.error("A soma dos dois pagamentos precisa ser igual ao valor da venda");
      return;
    }

    const m: MentoriaSale = {
      id: crypto.randomUUID(),
      date: mentoriaForm.date,
      client: mentoriaForm.client,
      whatsapp: mentoriaForm.whatsapp || undefined,
      value: mNumeric,
      seller: mentoriaForm.seller,
      installments: mInstallmentsNum,
      installmentsPaid: 0,
      payMethod1: mentoriaForm.payMethod1,
      payAmount1,
      payMethod2: mentoriaForm.useSecond ? mentoriaForm.payMethod2 : undefined,
      payAmount2,
      notes: mentoriaForm.notes || undefined,
    };
    setMentorias((p) => [m, ...p]);
    setMentoriaForm({ ...mentoriaForm, client: "", whatsapp: "", value: "", payAmount1: "", payAmount2: "", notes: "" });
    toast.success("Venda de mentoria registrada");
  };

  const removeMentoria = (id: string) => setMentorias((p) => p.filter((m) => m.id !== id));
  const registerMentoriaPayment = (id: string) => {
    setMentorias((p) =>
      p.map((m) => {
        if (m.id !== id) return m;
        if (m.installmentsPaid >= m.installments) {
          toast.info("Parcelas já quitadas");
          return m;
        }
        return { ...m, installmentsPaid: m.installmentsPaid + 1 };
      })
    );
  };

  const mentoriaReceita = mentorias.reduce((s, x) => s + x.value, 0);
  const mentoriaAberto = mentorias.reduce((s, x) => s + (x.value - x.value * (x.installmentsPaid / x.installments)), 0);

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Vendas & Mentoria</h2>

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas"><Wrench className="w-4 h-4 mr-1" /> Vendas & Manutenção</TabsTrigger>
          <TabsTrigger value="mentoria"><GraduationCap className="w-4 h-4 mr-1" /> Mentoria</TabsTrigger>
        </TabsList>

        {/* ============ VENDAS + MANUTENÇÃO ============ */}
        <TabsContent value="vendas" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-r from-stats-entrada to-emerald-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-90">Receita total</p>
                <p className="text-xl font-bold">{brl(totalReceita)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-stats-saldo to-cyan-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-90">A receber (parcelas)</p>
                <p className="text-xl font-bold">{brl(openInstallments)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-warning to-amber-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <CalendarClock className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-90">Manutenção próxima</p>
                <p className="text-xl font-bold">{soonCount}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-destructive to-red-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-90">Manutenção vencida</p>
                <p className="text-xl font-bold">{overdueCount}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Registrar Venda</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Data</Label>
                      <Input type="date" value={saleForm.date} onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })} />
                    </div>
                    <div>
                      <Label>Vendedor</Label>
                      <Select value={saleForm.seller} onValueChange={(v) => setSaleForm({ ...saleForm, seller: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vinicius">Vinicius</SelectItem>
                          <SelectItem value="davi">Davi</SelectItem>
                          <SelectItem value="giovanna">Giovanna</SelectItem>
                          <SelectItem value="outros">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Cliente</Label>
                      <Input value={saleForm.client} onChange={(e) => setSaleForm({ ...saleForm, client: e.target.value })} placeholder="Nome" />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input value={saleForm.whatsapp} onChange={(e) => setSaleForm({ ...saleForm, whatsapp: e.target.value })} placeholder="(11) 99999-0000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input type="number" step="0.01" placeholder="0,00" value={saleForm.value} onChange={(e) => setSaleForm({ ...saleForm, value: e.target.value })} />
                    </div>
                    <div>
                      <Label>Parcelas</Label>
                      <Input type="number" min="1" value={saleForm.installments} onChange={(e) => setSaleForm({ ...saleForm, installments: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Forma de pagamento</Label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saleForm.useSecond}
                          onChange={(e) => setSaleForm({ ...saleForm, useSecond: e.target.checked })}
                        />
                        Dividir em 2 formas
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Método {saleForm.useSecond ? "1" : ""}</Label>
                        <Select value={saleForm.payMethod1} onValueChange={(v: PayMethod) => setSaleForm({ ...saleForm, payMethod1: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debito">Débito</SelectItem>
                            <SelectItem value="credito">Crédito</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {saleForm.useSecond && (
                        <div>
                          <Label className="text-xs">Valor pago (R$)</Label>
                          <Input type="number" step="0.01" placeholder={numeric ? (numeric / 2).toFixed(2) : "0,00"} value={saleForm.payAmount1} onChange={(e) => setSaleForm({ ...saleForm, payAmount1: e.target.value })} />
                        </div>
                      )}
                    </div>
                    {saleForm.useSecond && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Método 2</Label>
                          <Select value={saleForm.payMethod2} onValueChange={(v: PayMethod) => setSaleForm({ ...saleForm, payMethod2: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="debito">Débito</SelectItem>
                              <SelectItem value="credito">Crédito</SelectItem>
                              <SelectItem value="pix">PIX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Valor pago (R$)</Label>
                          <Input type="number" step="0.01" placeholder={numeric ? (numeric / 2).toFixed(2) : "0,00"} value={saleForm.payAmount2} onChange={(e) => setSaleForm({ ...saleForm, payAmount2: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Contrato / observações</Label>
                    <Textarea rows={2} value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} placeholder="Cláusulas, garantia, cor/tamanho..." />
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md text-sm space-y-1">
                    {installmentsNum > 1 && numeric > 0 && (
                      <div className="flex justify-between">
                        <span>{installmentsNum}× de</span>
                        <span className="font-semibold">{brl(perInstallment)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Comissões</span>
                      <span className="font-bold">{brl(totalCommissions)}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-success hover:bg-success/90" onClick={submitSale}>
                    <Plus className="w-4 h-4 mr-1" /> Registrar Venda
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5" /> Alertas de Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-3">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Toda venda de prótese entra automaticamente aqui. Prazo recomendado: <b>10-20 dias</b> entre manutenções.
                  </AlertDescription>
                </Alert>
                {sales.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhum cliente de prótese cadastrado ainda.</p>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto">
                    {salesSorted.map((s) => {
                      const st = maintStatus(s);
                      const link = waMaint(s);
                      const bgCls = st.kind === "overdue" ? "bg-destructive/5 border-destructive/30" : st.kind === "soon" ? "bg-warning/5 border-warning/30" : "bg-success/5 border-success/30";
                      return (
                        <div key={s.id} className={`border rounded-md p-3 ${bgCls}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-sm">{s.client}</div>
                              <div className="text-xs text-muted-foreground">
                                Última: {new Date(s.lastMaintenance ?? s.date).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                            <Badge variant="outline" className={st.cls}>{st.label}</Badge>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="outline" onClick={() => copyMaint(s)}>
                              <Copy className="w-3 h-3 mr-1" /> Copiar
                            </Button>
                            {link && (
                              <Button size="sm" asChild>
                                <a href={link} target="_blank" rel="noreferrer">
                                  <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                                </a>
                              </Button>
                            )}
                            <Button size="sm" variant="secondary" onClick={() => markMaintenance(s.id)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Marcar feita
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Histórico de Vendas</CardTitle></CardHeader>
            <CardContent>
              {sales.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">Nenhuma venda registrada ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Vendedor</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Parcelas</TableHead>
                        <TableHead>Manutenção</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesSorted.map((s) => {
                        const st = maintStatus(s);
                        const paidPct = (s.installmentsPaid / s.installments) * 100;
                        return (
                          <TableRow key={s.id}>
                            <TableCell className="text-sm">{new Date(s.date).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell>
                              <div className="font-medium">{s.client}</div>
                              {s.notes && <div className="text-[10px] text-muted-foreground truncate max-w-[200px]" title={s.notes}>{s.notes}</div>}
                            </TableCell>
                            <TableCell className="text-sm">{SELLER_LABELS[s.seller]}</TableCell>
                            <TableCell className="text-right font-mono">{brl(s.value)}</TableCell>
                            <TableCell className="text-xs">
                              {s.payMethod1 ? (
                                <div className="space-y-0.5">
                                  <div>{PAY_LABELS[s.payMethod1]} · <span className="font-mono">{brl(s.payAmount1 ?? s.value)}</span></div>
                                  {s.payMethod2 && (
                                    <div>{PAY_LABELS[s.payMethod2]} · <span className="font-mono">{brl(s.payAmount2 ?? 0)}</span></div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="min-w-[140px]">
                              <div className="text-xs mb-1">{s.installmentsPaid}/{s.installments} · {brl(s.value / s.installments)}</div>
                              <Progress value={paidPct} className="h-1.5" />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={st.cls}>{st.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                {s.installmentsPaid < s.installments && (
                                  <Button size="sm" variant="ghost" onClick={() => registerPayment(s.id)} title="Registrar parcela paga">
                                    <DollarSign className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost" onClick={() => markMaintenance(s.id)} title="Marcar manutenção">
                                  <Wrench className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => removeSale(s.id)}>
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ MENTORIA ============ */}
        <TabsContent value="mentoria" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-r from-stats-entrada to-emerald-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-90">Receita mentoria</p>
                <p className="text-xl font-bold">{brl(mentoriaReceita)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-stats-saldo to-cyan-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-90">A receber (parcelas)</p>
                <p className="text-xl font-bold">{brl(mentoriaAberto)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-muted to-muted/60 border-0">
              <CardContent className="p-4 text-center">
                <GraduationCap className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-70">Mentorias vendidas</p>
                <p className="text-xl font-bold">{mentorias.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-warning to-amber-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs opacity-90">Ticket médio</p>
                <p className="text-xl font-bold">{brl(mentorias.length ? mentoriaReceita / mentorias.length : 0)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Registrar Venda de Mentoria</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Data</Label>
                      <Input type="date" value={mentoriaForm.date} onChange={(e) => setMentoriaForm({ ...mentoriaForm, date: e.target.value })} />
                    </div>
                    <div>
                      <Label>Vendedor</Label>
                      <Select value={mentoriaForm.seller} onValueChange={(v) => setMentoriaForm({ ...mentoriaForm, seller: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vinicius">Vinicius</SelectItem>
                          <SelectItem value="davi">Davi</SelectItem>
                          <SelectItem value="giovanna">Giovanna</SelectItem>
                          <SelectItem value="outros">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Cliente</Label>
                      <Input value={mentoriaForm.client} onChange={(e) => setMentoriaForm({ ...mentoriaForm, client: e.target.value })} placeholder="Nome" />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input value={mentoriaForm.whatsapp} onChange={(e) => setMentoriaForm({ ...mentoriaForm, whatsapp: e.target.value })} placeholder="(11) 99999-0000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input type="number" step="0.01" placeholder="0,00" value={mentoriaForm.value} onChange={(e) => setMentoriaForm({ ...mentoriaForm, value: e.target.value })} />
                    </div>
                    <div>
                      <Label>Parcelas</Label>
                      <Input type="number" min="1" value={mentoriaForm.installments} onChange={(e) => setMentoriaForm({ ...mentoriaForm, installments: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Forma de pagamento</Label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mentoriaForm.useSecond}
                          onChange={(e) => setMentoriaForm({ ...mentoriaForm, useSecond: e.target.checked })}
                        />
                        Dividir em 2 formas
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Método {mentoriaForm.useSecond ? "1" : ""}</Label>
                        <Select value={mentoriaForm.payMethod1} onValueChange={(v: PayMethod) => setMentoriaForm({ ...mentoriaForm, payMethod1: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debito">Débito</SelectItem>
                            <SelectItem value="credito">Crédito</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {mentoriaForm.useSecond && (
                        <div>
                          <Label className="text-xs">Valor pago (R$)</Label>
                          <Input type="number" step="0.01" placeholder={mNumeric ? (mNumeric / 2).toFixed(2) : "0,00"} value={mentoriaForm.payAmount1} onChange={(e) => setMentoriaForm({ ...mentoriaForm, payAmount1: e.target.value })} />
                        </div>
                      )}
                    </div>
                    {mentoriaForm.useSecond && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Método 2</Label>
                          <Select value={mentoriaForm.payMethod2} onValueChange={(v: PayMethod) => setMentoriaForm({ ...mentoriaForm, payMethod2: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="debito">Débito</SelectItem>
                              <SelectItem value="credito">Crédito</SelectItem>
                              <SelectItem value="pix">PIX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Valor pago (R$)</Label>
                          <Input type="number" step="0.01" placeholder={mNumeric ? (mNumeric / 2).toFixed(2) : "0,00"} value={mentoriaForm.payAmount2} onChange={(e) => setMentoriaForm({ ...mentoriaForm, payAmount2: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Observações</Label>
                    <Textarea rows={2} value={mentoriaForm.notes} onChange={(e) => setMentoriaForm({ ...mentoriaForm, notes: e.target.value })} placeholder="Contrato, turma, condições..." />
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md text-sm space-y-1">
                    {mInstallmentsNum > 1 && mNumeric > 0 && (
                      <div className="flex justify-between">
                        <span>{mInstallmentsNum}× de</span>
                        <span className="font-semibold">{brl(mPerInstallment)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Comissões</span>
                      <span className="font-bold">{brl(mTotalCommissions)}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-success hover:bg-success/90" onClick={submitMentoria}>
                    <Plus className="w-4 h-4 mr-1" /> Registrar Venda
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Histórico de Mentorias</CardTitle></CardHeader>
              <CardContent>
                {mentorias.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhuma venda de mentoria registrada ainda.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Vendedor</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead>Parcelas</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mentorias.map((m) => {
                          const paidPct = (m.installmentsPaid / m.installments) * 100;
                          return (
                            <TableRow key={m.id}>
                              <TableCell className="text-sm">{new Date(m.date).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>
                                <div className="font-medium">{m.client}</div>
                                {m.notes && <div className="text-[10px] text-muted-foreground truncate max-w-[200px]" title={m.notes}>{m.notes}</div>}
                              </TableCell>
                              <TableCell className="text-sm">{SELLER_LABELS[m.seller]}</TableCell>
                              <TableCell className="text-right font-mono">{brl(m.value)}</TableCell>
                              <TableCell className="text-xs">
                                <div className="space-y-0.5">
                                  <div>{PAY_LABELS[m.payMethod1]} · <span className="font-mono">{brl(m.payAmount1 ?? m.value)}</span></div>
                                  {m.payMethod2 && (
                                    <div>{PAY_LABELS[m.payMethod2]} · <span className="font-mono">{brl(m.payAmount2 ?? 0)}</span></div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="min-w-[140px]">
                                <div className="text-xs mb-1">{m.installmentsPaid}/{m.installments} · {brl(m.value / m.installments)}</div>
                                <Progress value={paidPct} className="h-1.5" />
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                  {m.installmentsPaid < m.installments && (
                                    <Button size="sm" variant="ghost" onClick={() => registerMentoriaPayment(m.id)} title="Registrar parcela paga">
                                      <DollarSign className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" onClick={() => removeMentoria(m.id)}>
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
