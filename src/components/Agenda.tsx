import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";

const PROFESSIONALS = [
  "Kauan Carvalho",
  "Cristiano Nogueira",
  "Claudio Carvalho",
  "Marcos Macedo",
  "Irani (Manicure)",
  "Silvia Gomes",
];

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

type Appt = { time: string; client: string; professional: string; service: string };

// Mock: agendamentos indexados por "yyyy-mm-dd"
const buildMockAppointments = (year: number, month: number): Record<string, Appt[]> => {
  const data: Record<string, Appt[]> = {};
  const seed = (day: number) => (day * 13 + month * 7 + year) % 100;

  const samples: Appt[][] = [
    [
      { time: "09:00", client: "João Silva", professional: "Kauan Carvalho", service: "Barbearia" },
      { time: "10:00", client: "Carlos Santos", professional: "Cristiano Nogueira", service: "Barbearia" },
    ],
    [
      { time: "11:00", client: "Roberto Alves", professional: "Claudio Carvalho", service: "Manutenção" },
      { time: "14:00", client: "Maria Oliveira", professional: "Silvia Gomes", service: "Manutenção" },
      { time: "15:00", client: "Ana Costa", professional: "Irani (Manicure)", service: "Manicure" },
    ],
    SLOTS.map((t, i) => ({
      time: t,
      client: `Cliente ${i + 1}`,
      professional: PROFESSIONALS[i % PROFESSIONALS.length],
      service: i % 2 ? "Manutenção" : "Barbearia",
    })),
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const s = seed(d);
    if (s < 30) continue;
    const bucket = s < 60 ? 0 : s < 90 ? 1 : 2;
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    data[key] = samples[bucket];
  }
  return data;
};

export const Agenda = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date>(today);
  const [professional, setProfessional] = useState<string>("all");

  const appointments = useMemo(() => buildMockAppointments(year, month), [year, month]);

  const filterByProf = (list: Appt[]) =>
    professional === "all" ? list : list.filter((a) => a.professional === professional);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  };
  const goNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelected(today);
  };

  const keyFor = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const dayStatus = (d: number): "empty" | "some" | "full" | "available" => {
    const list = filterByProf(appointments[keyFor(d)] ?? []);
    if (list.length === 0) return "available";
    if (list.length >= SLOTS.length) return "full";
    return "some";
  };

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (d: number) =>
    d === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear();

  const selectedKey = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`;
  const selectedAppts = filterByProf(appointments[selectedKey] ?? []);
  const bookedTimes = new Set(selectedAppts.map((a) => a.time));

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
        <CalendarDays className="w-8 h-8" /> Agenda de Atendimentos
      </h2>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Profissional</label>
              <Select value={professional} onValueChange={setProfessional}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Profissionais</SelectItem>
                  {PROFESSIONALS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mês / Ano</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goPrevMonth}><ChevronLeft className="w-4 h-4" /></Button>
                <div className="flex-1 text-center font-semibold py-2 border rounded-md">
                  {MONTHS[month]} {year}
                </div>
                <Button variant="outline" size="icon" onClick={goNextMonth}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={goToday}>
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
                const base = "aspect-square rounded-md border text-sm font-medium flex flex-col items-center justify-center transition-all hover:scale-[1.03] cursor-pointer";
                const colors =
                  status === "full"
                    ? "bg-destructive/20 border-destructive/40 text-destructive-foreground"
                    : status === "some"
                    ? "bg-primary/20 border-primary/40"
                    : "bg-success/10 border-success/30";
                const today = isToday(d) ? "ring-2 ring-accent" : "";
                const sel = isSelected(d) ? "ring-2 ring-primary" : "";
                return (
                  <button
                    key={idx}
                    onClick={() => setSelected(new Date(year, month, d))}
                    className={`${base} ${colors} ${today} ${sel}`}
                  >
                    <span>{d}</span>
                    {status !== "available" && (
                      <span className="text-[10px] mt-0.5 opacity-70">
                        {filterByProf(appointments[keyFor(d)] ?? []).length} ag.
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded ring-2 ring-accent" /> Hoje</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary/20 border border-primary/40" /> Com Agendamentos</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/40" /> Lotado</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-success/10 border border-success/30" /> Disponível</div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhe do dia */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" />
                {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
              </CardTitle>
              <div className="flex gap-1">
                <Badge variant="outline" className="border-success/40 text-xs">Disponível</Badge>
                <Badge variant="outline" className="border-primary/40 text-xs">Ocupado</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {SLOTS.map((slot) => {
                const appt = selectedAppts.find((a) => a.time === slot);
                const booked = !!appt;
                return (
                  <div
                    key={slot}
                    className={`flex items-center justify-between rounded-md border p-3 ${
                      booked ? "bg-primary/10 border-primary/30" : "bg-success/5 border-success/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold">{slot}</span>
                      {booked ? (
                        <div className="text-xs">
                          <div className="font-semibold">{appt!.client}</div>
                          <div className="text-muted-foreground">{appt!.professional} · {appt!.service}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Horário livre</span>
                      )}
                    </div>
                    <Badge variant={booked ? "default" : "outline"} className="text-[10px]">
                      {booked ? "Ocupado" : "Disponível"}
                    </Badge>
                  </div>
                );
              })}
              {SLOTS.every((s) => !bookedTimes.has(s)) && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Nenhum atendimento registrado para este dia.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
