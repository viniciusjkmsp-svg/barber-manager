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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
const MAINT_ALERT_DAYS = 30; // avisa a partir de 30d
const MAINT_OVERDUE_DAYS = 45; // vencido a partir de 45d

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
  date: string; // yyyy-mm-dd
  client: string;
  whatsapp?: string;
  value: number;
  seller: string; // key
  installments: number; // 1 = à vista
  installmentsPaid: number;
  payMethod1: PayMethod;
  payAmount1: number;
  payMethod2?: PayMethod;
  payAmount2?: number;
  lastMaintenance?: string; // yyyy-mm-dd
  notes?: string;
};

type CourseStage = "lead" | "matriculado" | "cursando" | "certificado";
type Lead = {
  id: string;
  name: string;
  whatsapp?: string;
  stage: CourseStage;
  modulesTotal: number;
  modulesDone: number;
  price: number;
  installments: number;
  installmentsPaid: number;
  enrolledAt?: string;
  notes?: string;
};

// ---------- Storage ----------
const SALES_KEY = "barbearia_prosthesis_sales_v1";
const LEADS_KEY = "barbearia_course_leads_v1";

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

const stageMeta: Record<CourseStage, { label: string; cls: string; order: number }> = {
  lead: { label: "Lead", cls: "bg-muted text-muted-foreground border-border", order: 0 },
  matriculado: { label: "Matriculado", cls: "bg-primary/20 text-primary border-primary/40", order: 1 },
  cursando: { label: "Cursando", cls: "bg-warning/20 text-warning border-warning/40", order: 2 },
  certificado: { label: "Certificado", cls: "bg-success/20 text-success border-success/40", order: 3 },
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
    installmentsPaid: "1",
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
    const s: Sale = {
      id: crypto.randomUUID(),
      date: saleForm.date,
      client: saleForm.client,
      whatsapp: saleForm.whatsapp || undefined,
      value: numeric,
      seller: saleForm.seller,
      installments: installmentsNum,
      installmentsPaid: Math.min(parseInt(saleForm.installmentsPaid) || 1, installmentsNum),
      lastMaintenance: undefined,
      notes: saleForm.notes || undefined,
    };
    setSales((p) => [s, ...p]);
    setSaleForm({ ...saleForm, client: "", whatsapp: "", value: "", notes: "" });
    toast.success("Venda registrada");
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
    `Olá ${s.client}! ✂️\n\nPassando pra lembrar que sua prótese capilar está no prazo de manutenção (retoque a cada 30-45 dias garante longevidade e visual perfeito).\n\nQuer que eu já agende um horário essa semana? É só responder aqui. 🙌`;

  const copyMaint = async (s: Sale) => {
    await navigator.clipboard.writeText(maintReminder(s));
    toast.success("Mensagem copiada!");
  };

  const waMaint = (s: Sale) => {
    const phone = (s.whatsapp || "").replace(/\D/g, "");
    if (!phone) return null;
    return `https://wa.me/55${phone}?text=${encodeURIComponent(maintReminder(s))}`;
  };

  // KPIs vendas
  const totalReceita = sales.reduce((s, x) => s + x.value, 0);
  const overdueCount = sales.filter((s) => maintStatus(s).kind === "overdue").length;
  const soonCount = sales.filter((s) => maintStatus(s).kind === "soon").length;
  const openInstallments = sales.reduce((s, x) => s + (x.value - x.value * (x.installmentsPaid / x.installments)), 0);

  const salesSorted = useMemo(() => {
    return [...sales].sort((a, b) => maintStatus(b).days - maintStatus(a).days);
  }, [sales]);

  // ---------- Course state ----------
  const [leads, setLeads] = useState<Lead[]>(() => load<Lead[]>(LEADS_KEY, []));
  useEffect(() => localStorage.setItem(LEADS_KEY, JSON.stringify(leads)), [leads]);

  const [leadForm, setLeadForm] = useState({
    name: "",
    whatsapp: "",
    price: "",
    installments: "1",
    modulesTotal: "6",
    notes: "",
  });
  const [openLead, setOpenLead] = useState<Lead | null>(null);

  const submitLead = () => {
    if (!leadForm.name) return toast.error("Nome do lead é obrigatório");
    const modulesTotal = Math.max(parseInt(leadForm.modulesTotal) || 1, 1);
    const price = parseFloat(leadForm.price.replace(",", ".")) || 0;
    const installments = Math.max(parseInt(leadForm.installments) || 1, 1);
    const l: Lead = {
      id: crypto.randomUUID(),
      name: leadForm.name,
      whatsapp: leadForm.whatsapp || undefined,
      stage: "lead",
      modulesTotal,
      modulesDone: 0,
      price,
      installments,
      installmentsPaid: 0,
      notes: leadForm.notes || undefined,
    };
    setLeads((p) => [l, ...p]);
    setLeadForm({ name: "", whatsapp: "", price: "", installments: "1", modulesTotal: "6", notes: "" });
    toast.success("Lead adicionado ao funil");
  };

  const advanceStage = (id: string, stage: CourseStage) => {
    setLeads((p) =>
      p.map((l) => {
        if (l.id !== id) return l;
        const upd: Lead = { ...l, stage };
        if (stage === "matriculado" && !l.enrolledAt) upd.enrolledAt = today();
        if (stage === "certificado") upd.modulesDone = l.modulesTotal;
        return upd;
      })
    );
  };
  const updateLead = (id: string, patch: Partial<Lead>) =>
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const removeLead = (id: string) => setLeads((p) => p.filter((l) => l.id !== id));

  // KPIs curso
  const byStage: Record<CourseStage, Lead[]> = {
    lead: leads.filter((l) => l.stage === "lead"),
    matriculado: leads.filter((l) => l.stage === "matriculado"),
    cursando: leads.filter((l) => l.stage === "cursando"),
    certificado: leads.filter((l) => l.stage === "certificado"),
  };
  const totalLeads = leads.length;
  const enrolled = leads.filter((l) => l.stage !== "lead").length;
  const convRate = totalLeads > 0 ? Math.round((enrolled / totalLeads) * 100) : 0;
  const courseRevenue = leads.reduce((s, l) => s + l.price * (l.installmentsPaid / Math.max(l.installments, 1)), 0);
  const coursePending = leads.reduce((s, l) => s + l.price * (1 - l.installmentsPaid / Math.max(l.installments, 1)), 0);

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Prótese Capilar & Mentoria</h2>

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas"><Wrench className="w-4 h-4 mr-1" /> Vendas & Manutenção</TabsTrigger>
          <TabsTrigger value="curso"><GraduationCap className="w-4 h-4 mr-1" /> Funil do Curso</TabsTrigger>
        </TabsList>

        {/* ============ VENDAS + MANUTENÇÃO ============ */}
        <TabsContent value="vendas" className="space-y-6">
          {/* KPIs */}
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
            {/* Registrar venda */}
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
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input type="number" step="0.01" placeholder="0,00" value={saleForm.value} onChange={(e) => setSaleForm({ ...saleForm, value: e.target.value })} />
                    </div>
                    <div>
                      <Label>Parcelas</Label>
                      <Input type="number" min="1" value={saleForm.installments} onChange={(e) => setSaleForm({ ...saleForm, installments: e.target.value })} />
                    </div>
                    <div>
                      <Label>Já pagas</Label>
                      <Input type="number" min="0" value={saleForm.installmentsPaid} onChange={(e) => setSaleForm({ ...saleForm, installmentsPaid: e.target.value })} />
                    </div>
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

            {/* Alertas de manutenção */}
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
                    Prazo recomendado: <b>30-45 dias</b> entre manutenções. Registre cada retoque pra manter a receita recorrente ativa.
                  </AlertDescription>
                </Alert>
                {sales.filter((s) => maintStatus(s).kind !== "ok").length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhuma manutenção pendente. 🎯</p>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto">
                    {salesSorted.filter((s) => maintStatus(s).kind !== "ok").map((s) => {
                      const st = maintStatus(s);
                      const link = waMaint(s);
                      return (
                        <div key={s.id} className={`border rounded-md p-3 ${st.kind === "overdue" ? "bg-destructive/5 border-destructive/30" : "bg-warning/5 border-warning/30"}`}>
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

          {/* Histórico com contratos/parcelas */}
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

        {/* ============ FUNIL DO CURSO ============ */}
        <TabsContent value="curso" className="space-y-6">
          {/* KPIs curso */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-r from-muted to-muted/60 border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs opacity-70">Total leads</p>
                <p className="text-xl font-bold">{totalLeads}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-stats-saldo to-cyan-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs opacity-90">Conversão em matrícula</p>
                <p className="text-xl font-bold">{convRate}%</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-stats-entrada to-emerald-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs opacity-90">Recebido</p>
                <p className="text-xl font-bold">{brl(courseRevenue)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-warning to-amber-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <p className="text-xs opacity-90">A receber</p>
                <p className="text-xl font-bold">{brl(coursePending)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Novo lead */}
            <Card>
              <CardHeader><CardTitle>Novo Lead do Curso</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Nome</Label>
                  <Input value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input value={leadForm.whatsapp} onChange={(e) => setLeadForm({ ...leadForm, whatsapp: e.target.value })} placeholder="(11) 99999-0000" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Valor (R$)</Label>
                    <Input type="number" step="0.01" value={leadForm.price} onChange={(e) => setLeadForm({ ...leadForm, price: e.target.value })} />
                  </div>
                  <div>
                    <Label>Parcelas</Label>
                    <Input type="number" min="1" value={leadForm.installments} onChange={(e) => setLeadForm({ ...leadForm, installments: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Módulos totais</Label>
                  <Input type="number" min="1" value={leadForm.modulesTotal} onChange={(e) => setLeadForm({ ...leadForm, modulesTotal: e.target.value })} />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea rows={2} value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} />
                </div>
                <Button className="w-full" onClick={submitLead}>
                  <Plus className="w-4 h-4 mr-1" /> Adicionar ao funil
                </Button>
              </CardContent>
            </Card>

            {/* Kanban do funil */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["lead", "matriculado", "cursando", "certificado"] as CourseStage[]).map((stage) => (
                <Card key={stage}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className={stageMeta[stage].cls}>{stageMeta[stage].label}</Badge>
                      </span>
                      <span className="text-xs text-muted-foreground">{byStage[stage].length}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
                    {byStage[stage].length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-3">Vazio</p>
                    ) : (
                      byStage[stage].map((l) => {
                        const modPct = l.modulesTotal > 0 ? (l.modulesDone / l.modulesTotal) * 100 : 0;
                        return (
                          <button
                            key={l.id}
                            onClick={() => setOpenLead(l)}
                            className="w-full text-left border rounded-md p-2 hover:bg-muted/50 transition-colors"
                          >
                            <div className="font-semibold text-sm">{l.name}</div>
                            {l.whatsapp && <div className="text-[10px] text-muted-foreground">{l.whatsapp}</div>}
                            {stage !== "lead" && (
                              <>
                                <div className="text-[10px] text-muted-foreground mt-1">Módulos {l.modulesDone}/{l.modulesTotal}</div>
                                <Progress value={modPct} className="h-1 mt-0.5" />
                                <div className="text-[10px] mt-1 flex justify-between">
                                  <span>{l.installmentsPaid}/{l.installments}×</span>
                                  <span className="font-mono">{brl(l.price * (l.installmentsPaid / Math.max(l.installments, 1)))}</span>
                                </div>
                              </>
                            )}
                          </button>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog lead */}
      <Dialog open={!!openLead} onOpenChange={(o) => !o && setOpenLead(null)}>
        <DialogContent className="max-w-2xl">
          {openLead && (() => {
            const l = leads.find((x) => x.id === openLead.id);
            if (!l) return null;
            const modPct = l.modulesTotal > 0 ? (l.modulesDone / l.modulesTotal) * 100 : 0;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" /> {l.name}
                    <Badge variant="outline" className={stageMeta[l.stage].cls}>{stageMeta[l.stage].label}</Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(["lead", "matriculado", "cursando", "certificado"] as CourseStage[]).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={l.stage === s ? "default" : "outline"}
                        onClick={() => advanceStage(l.id, s)}
                      >
                        {stageMeta[s].label}
                      </Button>
                    ))}
                  </div>

                  <div>
                    <Label>Progresso: Módulos {l.modulesDone}/{l.modulesTotal}</Label>
                    <Progress value={modPct} className="h-2 mt-1" />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => updateLead(l.id, { modulesDone: Math.max(0, l.modulesDone - 1) })}>-1 módulo</Button>
                      <Button size="sm" onClick={() => updateLead(l.id, { modulesDone: Math.min(l.modulesTotal, l.modulesDone + 1), stage: l.stage === "matriculado" ? "cursando" : l.stage })}>+1 módulo</Button>
                      {l.modulesDone >= l.modulesTotal && l.stage !== "certificado" && (
                        <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => advanceStage(l.id, "certificado")}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Emitir certificado
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Parcelas pagas: {l.installmentsPaid}/{l.installments}</Label>
                    <Progress value={(l.installmentsPaid / Math.max(l.installments, 1)) * 100} className="h-2 mt-1" />
                    <div className="flex gap-2 mt-2 items-center">
                      <Button size="sm" variant="outline" onClick={() => updateLead(l.id, { installmentsPaid: Math.max(0, l.installmentsPaid - 1) })}>-1 parcela</Button>
                      <Button size="sm" onClick={() => updateLead(l.id, { installmentsPaid: Math.min(l.installments, l.installmentsPaid + 1) })}>
                        <DollarSign className="w-3 h-3 mr-1" /> Registrar pagamento
                      </Button>
                      <span className="text-xs text-muted-foreground ml-auto">
                        Recebido: {brl(l.price * (l.installmentsPaid / Math.max(l.installments, 1)))}
                      </span>
                    </div>
                  </div>

                  {l.notes && (
                    <div className="text-xs bg-muted/50 rounded-md p-2">
                      <b>Notas:</b> {l.notes}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="destructive" size="sm" onClick={() => { removeLead(l.id); setOpenLead(null); }}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remover
                  </Button>
                  <Button variant="outline" onClick={() => setOpenLead(null)}>Fechar</Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
