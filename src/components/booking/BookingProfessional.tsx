import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingProfessionalProps {
  categoryId: string | null;
  onSelect: (id: string, name: string) => void;
  onBack: () => void;
}

interface Professional {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export const BookingProfessional = ({ categoryId, onSelect, onBack }: BookingProfessionalProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!categoryId) return;

      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .order("name");

      if (!error && data) {
        setProfessionals(data);
      }
      setLoading(false);
    };

    fetchProfessionals();
  }, [categoryId]);

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
            <CardTitle className="text-2xl">Escolha o Profissional</CardTitle>
            <CardDescription>
              Selecione quem você deseja que realize o atendimento
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {professionals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum profissional disponível nesta categoria
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {professionals.map((professional) => (
              <button
                key={professional.id}
                onClick={() => onSelect(professional.id, professional.name)}
                className={cn(
                  "p-6 rounded-xl border-2 border-border transition-all duration-300",
                  "flex flex-col items-center gap-3 text-center",
                  "hover:border-primary hover:bg-primary/5 hover:shadow-md"
                )}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold",
                    professional.color
                  )}
                >
                  {professional.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{professional.name}</h3>
                  <p className="text-sm text-muted-foreground">{professional.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};