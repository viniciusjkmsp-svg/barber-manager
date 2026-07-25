import { useMemo, useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Trash2, Search, Cake, TrendingDown, Megaphone, FileText, MessageCircle, Copy, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClients, type Client, type ClientSource, type ClientVisit } from "@/hooks/useClients";
import { toast as sonner } from "sonner";

const SOURCES: ClientSource[] = ["Indicação", "Instagram", "Google", "Anúncio", "Passou na rua", "Outro"];
const SOURCE_COLORS: Record<ClientSource, string> = {
  "Indicação": "bg-green-500/20 text-green-500 border-green-500/40",
  "Instagram": "bg-pink-500/20 text-pink-500 border-pink-500/40",
  "Google": "bg-blue-500/20 text-blue-500 border-blue-500/40",
  "Anúncio": "bg-orange-500/20 text-orange-500 border-orange-500/40",
  "Passou na rua": "bg-purple-500/20 text-purple-500 border-purple-500/40",
  "Outro": "bg-muted text-muted-foreground border-border",
};

const clientSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(100),
  email: z.string().trim().email("E-mail inválido").max(255).or(z.literal("")),
  whatsapp: z.string().trim().min(8, "WhatsApp inválido").max(20),
  birthday: z.string().optional(),
  source: z.string().optional(),
});

const INACTIVE_DAYS = 45;

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const daysSince = (dateISO?: string) => {
  if (!dateISO) return Infinity;
  const diff = Date.now() - new Date(dateISO).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const lastVisitDate = (c: Client): string | undefined => {
  if (c.visits.length === 0) return undefined;
  const dates = c.visits.map((v) => v.date).sort();
  return dates[dates.length - 1];
};

const ticketMedio = (c: Client) => {
  if (c.visits.length === 0) return 0;
  return c.visits.reduce((s, v) => s + v.amount, 0) / c.visits.length;
};

const totalGasto = (c: Client) => c.visits.reduce((s, v) => s + v.amount, 0);

// Aniversariantes do mês atual
const isBirthdayThisMonth = (b?: string) => {
  if (!b) return false;
  const [, m] = b.split("-").map(Number);
  return m === new Date().getMonth() + 1;
};

const formatBirthday = (b?: string) => {
  if (!b) return "";
  const [, m, d] = b.split("-");
  return `${d}/${m}`;
};

export const Clients = () => {
  const { clients, addClient, updateClient, removeClient, addVisit, removeVisit } = useClients();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", birthday: "", source: "" as ClientSource | "" });

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [visitForm, setVisitForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "servico" as "servico" | "produto",
    description: "",
    professional: "",
    amount: "",
  });

  const handleSubmit = () => {
    const parsed = clientSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    addClient({
      name: parsed.data.name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      birthday: form.birthday || undefined,
      source: (form.source as ClientSource) || undefined,
    });
    setForm({ name: "", email: "", whatsapp: "", birthday: "", source: "" });
    setOpen(false);
    toast({ title: "Sucesso", description: "Cliente cadastrado!" });
  };

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.whatsapp.toLowerCase().includes(q)
    );
  });

  // ----- Aniversariantes -----
  const aniversariantes = useMemo(
    () => clients.filter((c) => isBirthdayThisMonth(c.birthday)).sort((a, b) => (a.birthday ?? "").localeCompare(b.birthday ?? "")),
    [clients]
  );

  // ----- Inativos -----
  const inativos = useMemo(
    () =>
      clients
        .map((c) => ({ c, dias: daysSince(lastVisitDate(c)) }))
        .filter((x) => x.dias >= INACTIVE_DAYS && x.c.visits.length > 0)
        .sort((a, b) => b.dias - a.dias),
    [clients]
  );

  // ----- CAC por canal -----
  const porCanal = useMemo(() => {
    const map = new Map<string, { count: number; receita: number }>();
    for (const c of clients) {
      const key = c.source ?? "Sem origem";
      const cur = map.get(key) ?? { count: 0, receita: 0 };
      cur.count += 1;
      cur.receita += totalGasto(c);
      map.set(key, cur);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [clients]);

  // ----- Ficha do cliente -----
  const openFicha = (c: Client) => setSelectedClient(c);
  const closeFicha = () => setSelectedClient(null);
  const currentClient = selectedClient ? clients.find((c) => c.id === selectedClient.id) ?? null : null;

  const submitVisit = () => {
    if (!currentClient) return;
    const amount = parseFloat(visitForm.amount.replace(",", "."));
    if (!visitForm.description || Number.isNaN(amount) || amount <= 0) {
      sonner.error("Preencha descrição e valor válidos");
      return;
    }
    addVisit(currentClient.id, {
      date: visitForm.date,
      type: visitForm.type,
      description: visitForm.description,
      professional: visitForm.professional || undefined,
      amount,
    });
    setVisitForm({ ...visitForm, description: "", professional: "", amount: "" });
    sonner.success("Registro adicionado");
  };

  // ----- Mensagens de campanha -----
  const birthdayMsg = (c: Client) =>
    `🎉 Feliz aniversário, ${c.name}! 🎂\n\nA Barbearia Estilo deseja um dia incrível pra você. Como presente, preparamos um mimo especial no seu próximo atendimento este mês. É só responder aqui pra agendar. Um abraço! 💈`;

  const reactivationMsg = (c: Client, dias: number) =>
    `Olá ${c.name}! 💈\n\nSentimos sua falta na Barbearia Estilo — faz ${dias} dias desde sua última visita. Que tal marcar um horário essa semana? Temos condições especiais pra te receber de volta. Responda aqui e agendamos! 🙌`;

  const copyMsg = async (text: string) => {
    await navigator.clipboard.writeText(text);
    sonner.success("Mensagem copiada!");
  };

  const waLink = (whatsapp: string, msg: string) => {
    const phone = (whatsapp || "").replace(/\D/g, "");
    if (!phone) return null;
    return `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" maxLength={100} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>WhatsApp *</Label>
                  <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="(00) 00000-0000" maxLength={20} />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="cliente@email.com" maxLength={255} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Aniversário</Label>
                  <Input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
                </div>
                <div>
                  <Label>Origem</Label>
                  <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v as ClientSource })}>
                    <SelectTrigger><SelectValue placeholder="Como conheceu?" /></SelectTrigger>
                    <SelectContent>
                      {SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit}>Cadastrar Cliente</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-stats-entrada to-emerald-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs opacity-90">Total</p>
            <p className="text-xl font-bold">{clients.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-pink-600 to-pink-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Cake className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs opacity-90">Aniversariantes / mês</p>
            <p className="text-xl font-bold">{aniversariantes.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-destructive to-red-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs opacity-90">Inativos ({INACTIVE_DAYS}+ dias)</p>
            <p className="text-xl font-bold">{inativos.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-stats-saldo to-cyan-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Megaphone className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs opacity-90">Canais ativos</p>
            <p className="text-xl font-bold">{porCanal.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList>
          <TabsTrigger value="lista">Todos</TabsTrigger>
          <TabsTrigger value="aniversariantes">🎂 Aniversariantes</TabsTrigger>
          <TabsTrigger value="inativos">Reativação</TabsTrigger>
          <TabsTrigger value="canais">Origem / CAC</TabsTrigger>
        </TabsList>

        {/* Todos */}
        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle>Clientes Cadastrados</CardTitle>
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Buscar por nome, e-mail ou WhatsApp" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {clients.length === 0 ? "Nenhum cliente cadastrado ainda." : "Nenhum cliente encontrado."}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Última visita</TableHead>
                      <TableHead className="text-right">Ticket médio</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => {
                      const last = lastVisitDate(c);
                      const dias = daysSince(last);
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            {c.name}
                            {isBirthdayThisMonth(c.birthday) && <span className="ml-2">🎂</span>}
                          </TableCell>
                          <TableCell>{c.whatsapp}</TableCell>
                          <TableCell>
                            {c.source ? (
                              <Badge variant="outline" className={SOURCE_COLORS[c.source]}>{c.source}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {last ? (
                              <span className={dias >= INACTIVE_DAYS ? "text-destructive font-semibold" : ""}>
                                {new Date(last).toLocaleDateString("pt-BR")} · {dias}d
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">Nunca veio</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {c.visits.length > 0 ? brl(ticketMedio(c)) : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openFicha(c)} title="Ver ficha">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => removeClient(c.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aniversariantes */}
        <TabsContent value="aniversariantes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cake className="w-5 h-5 text-pink-500" /> Aniversariantes do mês</CardTitle>
            </CardHeader>
            <CardContent>
              {aniversariantes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum aniversariante este mês.</p>
              ) : (
                <div className="space-y-2">
                  {aniversariantes.map((c) => {
                    const msg = birthdayMsg(c);
                    const link = waLink(c.whatsapp, msg);
                    return (
                      <div key={c.id} className="flex items-center justify-between border rounded-md p-3 bg-pink-500/5 border-pink-500/20">
                        <div>
                          <div className="font-semibold">{c.name} <span className="text-pink-500 ml-2">🎂 {formatBirthday(c.birthday)}</span></div>
                          <div className="text-xs text-muted-foreground">{c.whatsapp}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => copyMsg(msg)}>
                            <Copy className="w-3 h-3 mr-1" /> Copiar
                          </Button>
                          {link && (
                            <Button size="sm" asChild>
                              <a href={link} target="_blank" rel="noreferrer">
                                <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inativos */}
        <TabsContent value="inativos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-destructive" />
                Clientes inativos (sem visita há {INACTIVE_DAYS}+ dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inativos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum cliente inativo — parabéns pela retenção! 🎯</p>
              ) : (
                <div className="space-y-2">
                  {inativos.map(({ c, dias }) => {
                    const msg = reactivationMsg(c, dias);
                    const link = waLink(c.whatsapp, msg);
                    return (
                      <div key={c.id} className="flex items-center justify-between border rounded-md p-3 bg-destructive/5 border-destructive/20">
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {c.whatsapp} · Última: {new Date(lastVisitDate(c)!).toLocaleDateString("pt-BR")} · <span className="text-destructive font-semibold">{dias} dias</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => copyMsg(msg)}>
                            <Copy className="w-3 h-3 mr-1" /> Copiar
                          </Button>
                          {link && (
                            <Button size="sm" asChild>
                              <a href={link} target="_blank" rel="noreferrer">
                                <MessageCircle className="w-3 h-3 mr-1" /> Reativar
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Canais */}
        <TabsContent value="canais">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Megaphone className="w-5 h-5" /> Origem dos clientes</CardTitle>
            </CardHeader>
            <CardContent>
              {porCanal.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Cadastre clientes com origem para medir CAC.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Canal</TableHead>
                      <TableHead className="text-right">Clientes</TableHead>
                      <TableHead className="text-right">Receita gerada</TableHead>
                      <TableHead className="text-right">Ticket médio / cliente</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {porCanal.map(([canal, v]) => (
                      <TableRow key={canal}>
                        <TableCell>
                          {canal === "Sem origem" ? (
                            <span className="text-muted-foreground">Sem origem</span>
                          ) : (
                            <Badge variant="outline" className={SOURCE_COLORS[canal as ClientSource]}>{canal}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">{v.count}</TableCell>
                        <TableCell className="text-right font-mono">{brl(v.receita)}</TableCell>
                        <TableCell className="text-right font-mono">{brl(v.count > 0 ? v.receita / v.count : 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                💡 Divida seu investimento no canal (ex.: R$ gastos em anúncio Instagram) pelo número de clientes para obter o CAC real.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ficha do cliente */}
      <Dialog open={!!currentClient} onOpenChange={(o) => !o && closeFicha()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {currentClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Ficha — {currentClient.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="border rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Última visita</div>
                  <div className="font-semibold">
                    {lastVisitDate(currentClient)
                      ? `${new Date(lastVisitDate(currentClient)!).toLocaleDateString("pt-BR")} (${daysSince(lastVisitDate(currentClient))}d)`
                      : "—"}
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Visitas totais</div>
                  <div className="font-semibold">{currentClient.visits.length}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Ticket médio</div>
                  <div className="font-semibold font-mono">{brl(ticketMedio(currentClient))}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Total gasto</div>
                  <div className="font-semibold font-mono">{brl(totalGasto(currentClient))}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <Label className="text-xs">WhatsApp</Label>
                  <Input value={currentClient.whatsapp} onChange={(e) => updateClient(currentClient.id, { whatsapp: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Aniversário</Label>
                  <Input type="date" value={currentClient.birthday ?? ""} onChange={(e) => updateClient(currentClient.id, { birthday: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Origem</Label>
                  <Select value={currentClient.source ?? ""} onValueChange={(v) => updateClient(currentClient.id, { source: v as ClientSource })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Registrar nova visita/produto */}
              <Card className="mt-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Registrar atendimento ou compra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <div className="col-span-2 md:col-span-1">
                      <Label className="text-xs">Data</Label>
                      <Input type="date" value={visitForm.date} onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Tipo</Label>
                      <Select value={visitForm.type} onValueChange={(v) => setVisitForm({ ...visitForm, type: v as "servico" | "produto" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="servico">Serviço</SelectItem>
                          <SelectItem value="produto">Produto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Descrição</Label>
                      <Input placeholder="Ex.: Corte + Barba" value={visitForm.description} onChange={(e) => setVisitForm({ ...visitForm, description: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Profissional</Label>
                      <Input placeholder="Opcional" value={visitForm.professional} onChange={(e) => setVisitForm({ ...visitForm, professional: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Valor R$</Label>
                      <Input type="number" step="0.01" placeholder="0,00" value={visitForm.amount} onChange={(e) => setVisitForm({ ...visitForm, amount: e.target.value })} />
                    </div>
                  </div>
                  <Button size="sm" className="mt-3" onClick={submitVisit}>
                    <Plus className="w-3 h-3 mr-1" /> Adicionar
                  </Button>
                </CardContent>
              </Card>

              {/* Histórico */}
              <div>
                <h4 className="font-semibold mb-2 mt-2">Histórico</h4>
                {currentClient.visits.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">Nenhum registro ainda.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...currentClient.visits].sort((a, b) => b.date.localeCompare(a.date)).map((v) => (
                        <TableRow key={v.id}>
                          <TableCell>{new Date(v.date).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={v.type === "servico" ? "bg-primary/10" : "bg-accent/10"}>
                              {v.type === "servico" ? "Serviço" : "Produto"}
                            </Badge>
                          </TableCell>
                          <TableCell>{v.description}</TableCell>
                          <TableCell>{v.professional ?? "—"}</TableCell>
                          <TableCell className="text-right font-mono">{brl(v.amount)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeVisit(currentClient.id, v.id)}>
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeFicha}>Fechar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
