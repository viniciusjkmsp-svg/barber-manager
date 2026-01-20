import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Clock } from "lucide-react";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface BookingDateTimeProps {
  professionalId: string | null;
  serviceId: string | null;
  onSelect: (date: Date, time: string) => void;
  onBack: () => void;
}

interface Schedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface ExistingAppointment {
  appointment_date: string;
  appointment_time: string;
}

export const BookingDateTime = ({ professionalId, serviceId, onSelect, onBack }: BookingDateTimeProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<ExistingAppointment[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!professionalId) return;

      const { data, error } = await supabase
        .from("professional_schedules")
        .select("day_of_week, start_time, end_time")
        .eq("professional_id", professionalId)
        .eq("is_active", true);

      if (!error && data) {
        setSchedules(data);
      }
      setLoading(false);
    };

    fetchSchedules();
  }, [professionalId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!professionalId || !selectedDate) return;

      const dateStr = format(selectedDate, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time")
        .eq("professional_id", professionalId)
        .eq("appointment_date", dateStr)
        .neq("status", "cancelled");

      if (!error && data) {
        setExistingAppointments(data);
      }
    };

    fetchAppointments();
  }, [professionalId, selectedDate]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    const schedule = schedules.find((s) => s.day_of_week === dayOfWeek);

    if (!schedule) {
      setAvailableTimes([]);
      return;
    }

    const times: string[] = [];
    const [startHour, startMin] = schedule.start_time.split(":").map(Number);
    const [endHour, endMin] = schedule.end_time.split(":").map(Number);

    for (let h = startHour; h < endHour || (h === endHour && 0 < endMin); h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === startHour && m < startMin) continue;
        if (h === endHour && m >= endMin) break;

        const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const isBooked = existingAppointments.some(
          (apt) => apt.appointment_time.slice(0, 5) === timeStr
        );

        if (!isBooked) {
          times.push(timeStr);
        }
      }
    }

    setAvailableTimes(times);
  }, [selectedDate, schedules, existingAppointments]);

  const disabledDays = (date: Date) => {
    if (isBefore(date, startOfToday())) return true;
    const dayOfWeek = date.getDay();
    return !schedules.some((s) => s.day_of_week === dayOfWeek);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle className="text-2xl">Escolha Data e Horário</CardTitle>
            <CardDescription>
              Selecione quando você deseja ser atendido
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="font-medium mb-3">Selecione a data</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              locale={ptBR}
              fromDate={startOfToday()}
              toDate={addDays(startOfToday(), 60)}
              className="rounded-md border pointer-events-auto"
            />
          </div>

          <div>
            <h4 className="font-medium mb-3">
              {selectedDate
                ? `Horários disponíveis - ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}`
                : "Selecione uma data primeiro"}
            </h4>
            {selectedDate && availableTimes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum horário disponível nesta data
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => onSelect(selectedDate!, time)}
                    className={cn(
                      "p-3 rounded-lg border-2 border-border transition-all duration-200",
                      "flex items-center justify-center gap-2",
                      "hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};