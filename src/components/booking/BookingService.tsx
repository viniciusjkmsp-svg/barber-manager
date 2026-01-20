import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingServiceProps {
  professionalId: string | null;
  onSelect: (id: string, name: string, price: number) => void;
  onBack: () => void;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  description: string | null;
}

export const BookingService = ({ professionalId, onSelect, onBack }: BookingServiceProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!professionalId) return;

      const { data, error } = await supabase
        .from("professional_services")
        .select(`
          service_id,
          services (
            id,
            name,
            price,
            duration_minutes,
            description
          )
        `)
        .eq("professional_id", professionalId);

      if (!error && data) {
        const servicesList = data
          .map((item: any) => item.services)
          .filter(Boolean) as Service[];
        setServices(servicesList);
      }
      setLoading(false);
    };

    fetchServices();
  }, [professionalId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
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
            <CardTitle className="text-2xl">Escolha o Serviço</CardTitle>
            <CardDescription>
              Selecione o serviço que deseja realizar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum serviço disponível para este profissional
          </div>
        ) : (
          <div className="grid gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelect(service.id, service.name, Number(service.price))}
                className={cn(
                  "w-full p-4 rounded-xl border-2 border-border transition-all duration-300",
                  "flex items-center justify-between",
                  "hover:border-primary hover:bg-primary/5"
                )}
              >
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration_minutes} min</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(Number(service.price))}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};