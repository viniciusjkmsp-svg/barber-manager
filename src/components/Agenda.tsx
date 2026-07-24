import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PROFESSIONALS = [
  { name: "Kauan Carvalho", services: ["Barbearia", "Manutenção"] },
  { name: "Cristiano Nogueira", services: ["Barbearia", "Manutenção"] },
  { name: "Claudio Carvalho", services: ["Barbearia", "Manutenção"] },
  { name: "Marcos Macedo", services: ["Barbearia", "Manutenção"] },
  { name: "Irani (Manicure)", services: ["Manicure"] },
  { name: "Silvia Gomes", services: ["Barbearia", "Manutenção"] },
];

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

type Appt = {
  id: string;
  date: string; // yyyy-mm-dd
  time: string;
  client: string;
  professional: string;
  service: string;
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const seedAppts = (): Appt[] => [
  { id: "s1", date: todayKey(), time: "09:00", client: "João Silva", professional: "Kauan Carvalho", service: "Barbearia" },
  { id: "s2", date: todayKey(), time: "10:30", client: "Carlos Santos", professional: "Cristiano Nogueira", service: "Barbearia" },
  { id: "s3", date: todayKey(), time: "14:00", client: "Maria Oliveira", professional: "Silvia Gomes", service: "Manutenção" },
  { id: "s4", date: todayKey(), time: "15:30", client: "Ana Costa", professional: "Irani (Manicure)", service: "Manicure" },
];

export const Agenda = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date>(today);
  const [professional, setProfessional] = useState<string>("all");
  const [appts, setAppts] = useState<Appt[]>(seedAppts());

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ time: "", client: "", professional: "", service: "" });

  const keyOf = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const keyForDay = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const filterByProf = (list: Appt[]) =>
    professional === "all" ? list : list.filter((a) => a.professional === professional);

  const apptsByDate = useMemo(() => {
    const map: Record<string, Appt[]> = {};
    for (const a of appts) (map[a.date] ||= []).push(a);
    return map;
  }, [appts]);

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

  const dayStatus = (d: number): "some" | "full" | "available" => {
    const list = filterByProf(apptsByDate[keyForDay(d)] ?? []);
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

  const openBookDialog = (time?: string) => {
    setForm({ time: time ?? "", client: "", professional: "", service: "" });
    setDialogOpen(true);
  };

  const bookedTimesFor = (profName: string) =>
    new Set((apptsByDate[selectedKey] ?? []).filter((a) => a.professional === profName).map((a) => a.time));

  const submitBooking = () => {
    if (!form.time || !form.client || !form.professional || !form.service) {
      toast.error("Preencha todos os campos");
      return;
    }
    const conflict = (apptsByDate[selectedKey] ?? []).some(
      (a) => a.time === form.time && a.professional === form.professional
    );
    if (conflict) {
      toast.error("Este profissional já tem agendamento neste horário");
      return;
    }
    const newAppt: Appt = {
      id: crypto.randomUUID(),
      date: selectedKey,
      time: form.time,
      client: form.client,
      professional: form.professional,
      service: form.service,
    };
    setAppts((p) => [...p, newAppt]);
    setDialogOpen(false);
    toast.success(`Agendado ${form.client} às ${form.time}`);
  };

  const removeAppt = (id: string) => {
    setAppts((p) => p.filter((a) => a.id !== id));
    toast.success("Agendamento cancelado");
  };

  const availableServicesForProf = PROFESSIONALS.find((p) => p.name === form.professional)?.services ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-8 h-8" /> Agenda de Atendimentos
        </h2>
        <Button onClick={() => openBookDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
        </Button>
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
                const count = filterByProf(apptsByDate[keyForDay(d)] ?? []).length;
                const base = "aspect-square rounded-md border text-sm font-medium flex flex-col items-center justify-center transition-all hover:scale-[1.03] cursor-pointer";
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
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded ring-2 ring-accent" /> Hoje</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary/20 border border-primary/40" /> Com Agendamentos</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/40" /> Lotado</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-success/10 border border-success/30" /> Disponível</div>
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
          </CardHeader>
          <CardContent>
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
                        {list.map((a) => (
                          <div key={a.id} className="flex items-center justify-between text-xs bg-background/60 rounded px-2 py-1">
                            <div>
                              <div className="font-semibold">{a.client}</div>
                              <div className="text-muted-foreground">{a.professional} · {a.service}</div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeAppt(a.id)}>
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
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
            <div>
              <Label>Horário</Label>
              <Select value={form.time} onValueChange={(v) => setForm({ ...form, time: v })}>
                <SelectTrigger><SelectValue placeholder="Escolha um horário" /></SelectTrigger>
                <SelectContent>
                  {SLOTS.map((s) => {
                    const taken = form.professional ? bookedTimesFor(form.professional).has(s) : false;
                    return (
                      <SelectItem key={s} value={s} disabled={taken}>
                        {s} {taken && "— ocupado"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cliente</Label>
              <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Nome do cliente" />
            </div>
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
                <SelectTrigger><SelectValue placeholder={form.professional ? "Selecione..." : "Escolha o profissional primeiro"} /></SelectTrigger>
                <SelectContent>
                  {availableServicesForProf.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
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
    </div>
  );
};
