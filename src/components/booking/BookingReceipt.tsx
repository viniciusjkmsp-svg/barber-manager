import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, User, Scissors, MapPin, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BookingData } from "@/pages/Booking";

interface BookingReceiptProps {
  bookingData: BookingData;
  onNewBooking: () => void;
}

export const BookingReceipt = ({ bookingData, onNewBooking }: BookingReceiptProps) => {
  const formatPrice = (price: number | null) => {
    if (!price) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
        <CardTitle className="text-2xl text-success">Agendamento Confirmado!</CardTitle>
        <CardDescription>
          Seu horário foi reservado com sucesso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
          <div className="text-center pb-4 border-b">
            <h3 className="font-bold text-xl">Barbearia Estilo</h3>
            <p className="text-sm text-muted-foreground mt-1">Comprovante de Agendamento</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Código:</span>
              <span className="font-mono font-semibold">
                {bookingData.appointmentId?.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Categoria:</span>
              <span className="font-medium">{bookingData.categoryName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Profissional:</span>
              <span className="font-medium">{bookingData.professionalName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Serviço:</span>
              <span className="font-medium">{bookingData.serviceName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span className="font-medium">
                {bookingData.appointmentDate
                  ? format(bookingData.appointmentDate, "dd/MM/yyyy", { locale: ptBR })
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Horário:</span>
              <span className="font-medium">{bookingData.appointmentTime}</span>
            </div>

            <div className="flex justify-between pt-3 border-t text-lg">
              <span className="font-semibold">Valor:</span>
              <span className="font-bold text-success">
                {formatPrice(bookingData.servicePrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço
          </h4>
          <p className="text-sm text-muted-foreground">
            Rua Exemplo, 123 - Centro<br />
            São Paulo - SP
          </p>
          <p className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            (11) 99999-9999
          </p>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Lembre-se de chegar com 10 minutos de antecedência.</p>
          <p className="mt-1">Em caso de cancelamento, entre em contato com antecedência.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onNewBooking}>
            Novo Agendamento
          </Button>
          <Button className="flex-1" onClick={() => window.location.href = "/"}>
            Voltar ao Início
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};