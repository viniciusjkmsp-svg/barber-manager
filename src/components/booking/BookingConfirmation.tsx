import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Clock, User, Scissors, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import type { BookingData } from "@/pages/Booking";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface BookingConfirmationProps {
  bookingData: BookingData;
  user: SupabaseUser | null;
  onConfirm: (appointmentId: string) => void;
  onBack: () => void;
}

export const BookingConfirmation = ({ bookingData, user, onConfirm, onBack }: BookingConfirmationProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number | null) => {
    if (!price) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleConfirm = async () => {
    if (!user || !bookingData.professionalId || !bookingData.serviceId || !bookingData.appointmentDate || !bookingData.appointmentTime) {
      toast({
        title: "Erro",
        description: "Dados do agendamento incompletos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get profile id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        toast({
          title: "Erro",
          description: "Perfil não encontrado. Por favor, faça login novamente.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          client_id: profile.id,
          professional_id: bookingData.professionalId,
          service_id: bookingData.serviceId,
          appointment_date: format(bookingData.appointmentDate, "yyyy-MM-dd"),
          appointment_time: bookingData.appointmentTime + ":00",
          total_price: bookingData.servicePrice || 0,
          notes: notes || null,
          status: "confirmed",
        })
        .select("id")
        .single();

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Horário indisponível",
            description: "Este horário já foi reservado. Por favor, escolha outro.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Agendamento confirmado!",
        description: "Seu horário foi reservado com sucesso.",
      });

      onConfirm(data.id);
    } catch (error: any) {
      toast({
        title: "Erro ao agendar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle className="text-2xl">Confirmar Agendamento</CardTitle>
            <CardDescription>
              Revise os detalhes antes de confirmar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p className="font-semibold">{bookingData.categoryName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profissional</p>
              <p className="font-semibold">{bookingData.professionalName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serviço</p>
              <p className="font-semibold">{bookingData.serviceName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-semibold">
                {bookingData.appointmentDate
                  ? format(bookingData.appointmentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-semibold">{bookingData.appointmentTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <div className="p-2 bg-success/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-success">
                {formatPrice(bookingData.servicePrice)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Alguma informação adicional para o profissional?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full h-12 text-lg bg-success hover:bg-success/90"
        >
          {loading ? "Confirmando..." : "Confirmar Agendamento"}
        </Button>
      </CardContent>
    </Card>
  );
};