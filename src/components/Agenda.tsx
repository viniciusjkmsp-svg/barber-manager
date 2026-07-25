import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Plus, Trash2, Ban, MessageCircle, Copy, CheckCircle2, XCircle, HelpCircle, UserX } from "lucide-react";
import { toast } from "sonner";

const PROFESSIONALS = [
  { name: "Kauan Carvalho", services: ["Barbearia", "Manutenção", "Prótese"] },
  { name: "Kauã Gonçalves", services: ["Barbearia", "Manutenção"] },
  { name: "Cristiano Nogueira", services: ["Barbearia", "Manutenção"] },
  { name: "Claudio Carvalho", services: ["Barbearia", "Manutenção"] },
  { name: "Marcos Macedo", services: ["Barbearia", "Manutenção"] },
  { name: "Irani (Manicure)", services: ["Manicure"] },
  { name: "Silvia Gomes", services: ["Barbearia", "Manutenção"] },
];

// Duração em minutos por serviço
const SERVICE_DURATION: Record<string, number> = {
  "Barbearia": 30,
  "Manutenção": 30,
  "Manicure": 60,
  "Prótese": 120,
};

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
];

type ApptStatus = "confirmed" | "pending" | "no_show" | "cancelled";

type Appt = {
  id: string;
  date: string;
  time: string;
  client: string;
  clientPhone?: string;
  professional: string;
  service: string;
  duration: number; // minutos
  status: ApptStatus;
};

type Block = {
  id: string;
  date: string;
  professional: string;
  slots: string[]; // horários bloqueados; vazio = dia inteiro
  reason: string; // Folga, Almoço, Atestado, Outro
  notes?: string;
};

const STATUS_META: Record<ApptStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  confirmed: { label: "Confirmado", cls: "bg-success/20 text-success border-success/40", icon: CheckCircle2 },
  pending: { label: "Aguardando", cls: "bg-warning/20 text-warning border-warning/40", icon: HelpCircle },
  no_show: { label: "Faltou", cls: "bg-destructive/20 text-destructive border-destructive/40", icon: UserX },
  cancelled: { label: "Cancelado", cls: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const seedAppts = (): Appt[] => [
  { id: "s1", date: todayKey(), time: "09:00", client: "João Silva", clientPhone: "11999990001", professional: "Kauan Carvalho", service: "Barbearia", duration: 30, status: "confirmed" },
  { id: "s2", date: todayKey(), time: "10:30", client: "Carlos Santos", clientPhone: "11999990002", professional: "Cristiano Nogueira", service: "Barbearia", duration: 30, status: "pending" },
  { id: "s3", date: todayKey(), time: "14:00", client: "Maria Oliveira", clientPhone: "11999990003", professional: "Silvia Gomes", service: "Manutenção", duration: 30, status: "confirmed" },
  { id: "s4", date: todayKey(), time: "15:30", client: "Ana Costa", clientPhone: "11999990004", professional: "Irani (Manicure)", service: "Manicure", duration: 60, status: "pending" },
];

// converte "HH:MM" -> minutos
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// slots ocupados por um appt considerando duração
const occupiedSlots = (time: string, duration: number): string[] => {
  const start = toMin(time);
  const end = start + duration;
  return SLOTS.filter((s) => {
    const m = toMin(s);
    return m >= start && m < end;
  });
};

// data D-1
const dayBefore = (dateKey: string) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return dt.toLocaleDateString("pt-BR");
};

export const Agenda = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date>(today);
  const [professional, setProfessional] = useState<string>("all");
  const [appts, setAppts] = useState<Appt[]>(seedAppts());
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ time: "", client: "", clientPhone: "", professional: "", service: "", status: "pending" as ApptStatus });

  const [blockOpen, setBlockOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({ professional: "", reason: "Folga", allDay: true, slots: [] as string[], notes: "" });

  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderAppt, setReminderAppt] = useState<Appt | null>(null);

  const keyOf = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const keyForDay = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const filterByProf = <T extends { professional: string }>(list: T[]) =>
    professional === "all" ? list : list.filter((a) => a.professional === professional);

  const apptsByDate = useMemo(() => {
    const map: Record<string, Appt[]> = {};
    for (const a of appts) (map[a.date] ||= []).push(a);
    return map;
  }, [appts]);

  const blocksByDate = useMemo(() => {
    const map: Record<string, Block[]> = {};
    for (const b of blocks) (map[b.date] ||= []).push(b);
    return map;
  }, [blocks]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goPrevMonth = () => (month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1));
  const goNextMonth = () => (month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1));
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelected(today);
  };

  const activeAppts = (list: Appt[]) => list.filter((a) => a.status !== "cancelled");

  const dayStatus = (d: number): "some" | "full" | "available" => {
    const list = activeAppts(filterByProf(apptsByDate[keyForDay(d)] ?? []));
    if (list.length === 0) return "available";
    if (list.length >= SLOTS.length) return "full";
    return "some";
  };

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (d: number) =>
    d === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear();

  const selectedKey = keyOf(selected);
  const selectedAppts = filterByProf(apptsByDate[selectedKey] ?? []).sort((a, b) => a.time.localeCompare(b.time));
  const selectedBlocks = filterByProf(blocksByDate[selectedKey] ?? []);

  // slots bloqueados para um profissional específico no dia
  const blockedSlotsFor = (profName: string): Set<string> => {
    const set = new Set<string>();
    const dayBlocks = (blocksByDate[selectedKey] ?? []).filter((b) => b.professional === profName);
    for (const b of dayBlocks) {
      const slots = b.slots.length === 0 ? SLOTS : b.slots;
      slots.forEach((s) => set.add(s));
    }
    return set;
  };

  // slots ocupados por outros agendamentos ativos do profissional (considerando duração)
  const bookedSlotsFor = (profName: string): Set<string> => {
    const set = new Set<string>();
    const list = (apptsByDate[selectedKey] ?? []).filter((a) => a.professional === profName && a.status !== "cancelled");
    for (const a of list) occupiedSlots(a.time, a.duration).forEach((s) => set.add(s));
    return set;
  };

  const openBookDialog = (time?: string) => {
    setForm({ time: time ?? "", client: "", clientPhone: "", professional: "", service: "", status: "pending" });
    setDialogOpen(true);
  };

  const submitBooking = () => {
    if (!form.time || !form.client || !form.professional || !form.service) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const duration = SERVICE_DURATION[form.service] ?? 30;
    const wantedSlots = occupiedSlots(form.time, duration);

    // conflito com outros agendamentos
    const booked = bookedSlotsFor(form.professional);
    if (wantedSlots.some((s) => booked.has(s))) {
      toast.error("Conflito: horário sobrepõe outro agendamento deste profissional");
      return;
    }
    // conflito com bloqueios
    const blocked = blockedSlotsFor(form.professional);
    if (wantedSlots.some((s) => blocked.has(s))) {
      toast.error("Profissional está com horário bloqueado neste período");
      return;
    }

    const newAppt: Appt = {
      id: crypto.randomUUID(),
      date: selectedKey,
      time: form.time,
      client: form.client,
      clientPhone: form.clientPhone || undefined,
      professional: form.professional,
      service: form.service,
      duration,
      status: form.status,
    };
    setAppts((p) => [...p, newAppt]);
    setDialogOpen(false);
    toast.success(`Agendado ${form.client} às ${form.time} (${duration}min)`);
  };

  const removeAppt = (id: string) => {
    setAppts((p) => p.filter((a) => a.id !== id));
    toast.success("Agendamento removido");
  };

  const updateStatus = (id: string, status: ApptStatus) => {
    setAppts((p) => p.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Status: ${STATUS_META[status].label}`);
  };

  const availableServicesForProf = PROFESSIONALS.find((p) => p.name === form.professional)?.services ?? [];

  // Bloqueios
  const openBlockDialog = () => {
    setBlockForm({ professional: "", reason: "Folga", allDay: true, slots: [], notes: "" });
    setBlockOpen(true);
  };

  const toggleBlockSlot = (s: string) => {
    setBlockForm((f) => ({
      ...f,
      slots: f.slots.includes(s) ? f.slots.filter((x) => x !== s) : [...f.slots, s],
    }));
  };

  const submitBlock = () => {
    if (!blockForm.professional) return toast.error("Selecione o profissional");
    if (!blockForm.allDay && blockForm.slots.length === 0) return toast.error("Selecione ao menos um horário");
    const newBlock: Block = {
      id: crypto.randomUUID(),
      date: selectedKey,
      professional: blockForm.professional,
      slots: blockForm.allDay ? [] : blockForm.slots,
      reason: blockForm.reason,
      notes: blockForm.notes || undefined,
    };
    setBlocks((p) => [...p, newBlock]);
    setBlockOpen(false);
    toast.success("Bloqueio criado");
  };

  const removeBlock = (id: string) => {
    setBlocks((p) => p.filter((b) => b.id !== id));
    toast.success("Bloqueio removido");
  };

  // WhatsApp reminder
  const buildReminderMessage = (a: Appt) => {
    const [y, m, d] = a.date.split("-");
    return `Olá ${a.client}! 👋 Passando para confirmar seu horário na Barbearia Estilo:\n\n📅 Data: ${d}/${m}/${y}\n⏰ Horário: ${a.time}\n✂️ Serviço: ${a.service}\n👤 Profissional: ${a.professional}\n\nPor favor, responda com *SIM* para confirmar ou *REMARCAR* caso precise alterar. Obrigado! 🙌`;
  };

  const openReminder = (a: Appt) => {
    setReminderAppt(a);
    setReminderOpen(true);
  };

  const copyReminder = async () => {
    if (!reminderAppt) return;
    await navigator.clipboard.writeText(buildReminderMessage(reminderAppt));
    toast.success("Mensagem copiada!");
  };

  const openWhatsApp = () => {
    if (!reminderAppt) return;
    const phone = (reminderAppt.clientPhone || "").replace(/\D/g, "");
    if (!phone) return toast.error("Cliente sem WhatsApp cadastrado");
    const msg = encodeURIComponent(buildReminderMessage(reminderAppt));
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  // KPI no-show do dia selecionado
  const total = selectedAppts.length;
  const noShow = selectedAppts.filter((a) => a.status === "no_show").length;
  const noShowRate = total > 0 ? Math.round((noShow / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-8 h-8" /> Agenda de Atendimentos
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openBlockDialog}>
            <Ban className="w-4 h-4 mr-2" /> Bloquear horário
          </Button>
          <Button onClick={() => openBookDialog()}>
            <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1 block">Profissional</Label>
              <Select value={professional} onValueChange={setProfessional}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Profissionais</SelectItem>
                  {PROFESSIONALS.map((p) => (
                    <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Mês / Ano</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goPrevMonth}><ChevronLeft className="w-4 h-4" /></Button>
                <div className="flex-1 text-center font-semibold py-2 border rounded-md">
                  {MONTHS[month]} {year}
                </div>
                <Button variant="outline" size="icon" onClick={goNextMonth}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="secondary" className="w-full" onClick={goToday}>
                <CalendarDays className="w-4 h-4 mr-2" /> Hoje
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{MONTHS[month]} {year}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center text-xs font-semibold text-muted-foreground py-2">{w}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, idx) => {
                if (d === null) return <div key={idx} />;
                const status = dayStatus(d);
                const count = activeAppts(filterByProf(apptsByDate[keyForDay(d)] ?? [])).length;
                const hasBlock = filterByProf(blocksByDate[keyForDay(d)] ?? []).length > 0;
                const base = "aspect-square rounded-md border text-sm font-medium flex flex-col items-center justify-center transition-all hover:scale-[1.03] cursor-pointer relative";
                const colors =
                  status === "full"
                    ? "bg-destructive/20 border-destructive/40"
                    : status === "some"
                    ? "bg-primary/20 border-primary/40"
                    : "bg-success/10 border-success/30";
                const isTodayCls = isToday(d) ? "ring-2 ring-accent" : "";
                const selCls = isSelected(d) ? "ring-2 ring-primary" : "";
                return (
                  <button
                    key={idx}
                    onClick={() => setSelected(new Date(year, month, d))}
                    className={`${base} ${colors} ${isTodayCls} ${selCls}`}
                  >
                    <span>{d}</span>
                    {count > 0 && <span className="text-[10px] mt-0.5 opacity-70">{count} ag.</span>}
                    {hasBlock && <Ban className="w-3 h-3 absolute top-1 right-1 text-destructive" />}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded ring-2 ring-accent" /> Hoje</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary/20 border border-primary/40" /> Com Agendamentos</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/40" /> Lotado</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-success/10 border border-success/30" /> Disponível</div>
              <div className="flex items-center gap-2"><Ban className="w-3 h-3 text-destructive" /> Bloqueio</div>
            </div>
          </CardContent>
        </Card>

        {/* Horários do dia selecionado */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" />
                {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
              </CardTitle>
            </div>
            {total > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                {total} agendamento(s) · Taxa de faltas: <span className={noShowRate > 20 ? "text-destructive font-semibold" : "font-semibold"}>{noShowRate}%</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {/* Bloqueios do dia */}
            {selectedBlocks.length > 0 && (
              <div className="mb-3 space-y-2">
                {selectedBlocks.map((b) => (
                  <div key={b.id} className="flex items-start justify-between rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs">
                    <div>
                      <div className="font-semibold flex items-center gap-1"><Ban className="w-3 h-3" /> {b.professional} — {b.reason}</div>
                      <div className="text-muted-foreground">
                        {b.slots.length === 0 ? "Dia inteiro" : b.slots.join(", ")}
                        {b.notes && <> · {b.notes}</>}
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeBlock(b.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {SLOTS.map((slot) => {
                const list = selectedAppts.filter((a) => a.time === slot);
                const booked = list.length > 0;
                return (
                  <div
                    key={slot}
                    className={`rounded-md border p-2 ${booked ? "bg-primary/10 border-primary/30" : "bg-success/5 border-success/20"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-semibold">{slot}</span>
                      {!booked ? (
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openBookDialog(slot)}>
                          <Plus className="w-3 h-3 mr-1" /> Agendar
                        </Button>
                      ) : (
                        <Badge className="text-[10px]">{list.length} ag.</Badge>
                      )}
                    </div>
                    {booked && (
                      <div className="space-y-1">
                        {list.map((a) => {
                          const meta = STATUS_META[a.status];
                          const StatusIcon = meta.icon;
                          return (
                            <div key={a.id} className="text-xs bg-background/60 rounded px-2 py-1.5 space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="font-semibold truncate">{a.client}</div>
                                  <div className="text-muted-foreground truncate">
                                    {a.professional} · {a.service} · {a.duration}min
                                  </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={() => removeAppt(a.id)}>
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1 flex-wrap">
                                <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v as ApptStatus)}>
                                  <SelectTrigger className={`h-6 text-[10px] px-2 border ${meta.cls} w-auto gap-1`}>
                                    <StatusIcon className="w-3 h-3" />
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Aguardando</SelectItem>
                                    <SelectItem value="confirmed">Confirmado</SelectItem>
                                    <SelectItem value="no_show">Faltou</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] gap-1" onClick={() => openReminder(a)}>
                                  <MessageCircle className="w-3 h-3" /> Lembrete
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Novo Agendamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Novo agendamento — {selected.toLocaleDateString("pt-BR")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Profissional</Label>
                <Select value={form.professional} onValueChange={(v) => setForm({ ...form, professional: v, service: "" })}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {PROFESSIONALS.map((p) => (
                      <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Serviço</Label>
                <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })} disabled={!form.professional}>
                  <SelectTrigger><SelectValue placeholder={form.professional ? "Selecione..." : "Escolha o profissional"} /></SelectTrigger>
                  <SelectContent>
                    {availableServicesForProf.map((s) => (
                      <SelectItem key={s} value={s}>{s} ({SERVICE_DURATION[s] ?? 30}min)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Horário</Label>
              <Select value={form.time} onValueChange={(v) => setForm({ ...form, time: v })} disabled={!form.professional}>
                <SelectTrigger><SelectValue placeholder="Escolha um horário" /></SelectTrigger>
                <SelectContent>
                  {SLOTS.map((s) => {
                    if (!form.professional) return <SelectItem key={s} value={s}>{s}</SelectItem>;
                    const booked = bookedSlotsFor(form.professional).has(s);
                    const blocked = blockedSlotsFor(form.professional).has(s);
                    const disabled = booked || blocked;
                    return (
                      <SelectItem key={s} value={s} disabled={disabled}>
                        {s} {blocked ? "— bloqueado" : booked ? "— ocupado" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {form.service && (
                <div className="text-xs text-muted-foreground mt-1">
                  Duração: {SERVICE_DURATION[form.service] ?? 30} minutos
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cliente</Label>
                <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Nome" />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} placeholder="(11) 99999-0000" />
              </div>
            </div>
            <div>
              <Label>Status inicial</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ApptStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Aguardando confirmação</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={submitBooking}>Confirmar Agendamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Bloqueio */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear horário — {selected.toLocaleDateString("pt-BR")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Profissional</Label>
              <Select value={blockForm.professional} onValueChange={(v) => setBlockForm({ ...blockForm, professional: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {PROFESSIONALS.map((p) => (
                    <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Motivo</Label>
              <Select value={blockForm.reason} onValueChange={(v) => setBlockForm({ ...blockForm, reason: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Folga">Folga</SelectItem>
                  <SelectItem value="Almoço">Almoço</SelectItem>
                  <SelectItem value="Atestado">Atestado</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Período</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={blockForm.allDay ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBlockForm({ ...blockForm, allDay: true, slots: [] })}
                >Dia inteiro</Button>
                <Button
                  variant={!blockForm.allDay ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBlockForm({ ...blockForm, allDay: false })}
                >Horários específicos</Button>
              </div>
            </div>
            {!blockForm.allDay && (
              <div>
                <Label className="mb-2 block">Selecione os horários</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SLOTS.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      size="sm"
                      variant={blockForm.slots.includes(s) ? "default" : "outline"}
                      className="h-8 text-xs"
                      onClick={() => toggleBlockSlot(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label>Observações (opcional)</Label>
              <Textarea
                value={blockForm.notes}
                onChange={(e) => setBlockForm({ ...blockForm, notes: e.target.value })}
                placeholder="Ex.: atestado médico até 12h"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockOpen(false)}>Cancelar</Button>
            <Button onClick={submitBlock}>Criar bloqueio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Lembrete WhatsApp */}
      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-success" />
              Lembrete via WhatsApp
            </DialogTitle>
          </DialogHeader>
          {reminderAppt && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Envie 1 dia antes ({dayBefore(reminderAppt.date)}) para <span className="font-semibold text-foreground">{reminderAppt.client}</span>
                {reminderAppt.clientPhone && <> — {reminderAppt.clientPhone}</>}
              </div>
              <Textarea
                readOnly
                rows={9}
                value={buildReminderMessage(reminderAppt)}
                className="font-mono text-xs"
              />
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={copyReminder}>
              <Copy className="w-4 h-4 mr-2" /> Copiar mensagem
            </Button>
            <Button onClick={openWhatsApp} disabled={!reminderAppt?.clientPhone}>
              <MessageCircle className="w-4 h-4 mr-2" /> Abrir WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
