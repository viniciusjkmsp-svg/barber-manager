import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Sparkles, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingCategoryProps {
  onSelect: (id: string, name: string) => void;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors className="h-12 w-12" />,
  sparkles: <Sparkles className="h-12 w-12" />,
  hand: <Hand className="h-12 w-12" />,
};

const colorMap: Record<string, string> = {
  Barbearia: "hover:border-blue-500 hover:bg-blue-500/5",
  Salão: "hover:border-pink-500 hover:bg-pink-500/5",
  Manicure: "hover:border-purple-500 hover:bg-purple-500/5",
};

const iconColorMap: Record<string, string> = {
  Barbearia: "text-blue-600",
  Salão: "text-pink-600",
  Manicure: "text-purple-600",
};

export const BookingCategory = ({ onSelect }: BookingCategoryProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .order("name");

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Escolha a Categoria</CardTitle>
        <CardDescription>
          Selecione o tipo de serviço que você deseja
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id, category.name)}
              className={cn(
                "w-full p-6 rounded-xl border-2 border-border transition-all duration-300",
                "flex items-center gap-6 text-left",
                colorMap[category.name] || "hover:border-primary hover:bg-primary/5"
              )}
            >
              <div className={cn(
                "p-4 rounded-full bg-muted",
                iconColorMap[category.name] || "text-primary"
              )}>
                {iconMap[category.icon || "scissors"] || <Scissors className="h-12 w-12" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="text-muted-foreground mt-1">{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};