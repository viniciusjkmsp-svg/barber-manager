import { Card, CardContent } from "@/components/ui/card";
import { ServiceBadge } from "./ServiceBadge";

interface Professional {
  name: string;
  role: string;
  initials: string;
  services: Array<"corte" | "barba" | "sobrancelha" | "luzes" | "alisamento" | "botox" | "manicure">;
  color: string;
}

export const Professionals = () => {
  const professionals: Professional[] = [
    { name: "Marcos Macedo", role: "Barbeiro", initials: "MM", services: ["corte", "barba", "sobrancelha"], color: "bg-blue-600" },
    { name: "Junior Silva", role: "Barbeiro", initials: "JS", services: ["corte", "barba", "alisamento"], color: "bg-green-600" },
    { name: "Cristiano Marques", role: "Barbeiro", initials: "CM", services: ["corte", "barba", "botox"], color: "bg-cyan-600" },
    { name: "Claudio Carvalho", role: "Barbeiro", initials: "CC", services: ["corte", "barba", "luzes"], color: "bg-amber-600" },
    { name: "Silvia Gomes", role: "Cabeleireira", initials: "SG", services: ["luzes", "alisamento", "botox"], color: "bg-red-600" },
    { name: "Nélia", role: "Manicure", initials: "N", services: ["manicure"], color: "bg-gray-600" },
    { name: "Irani", role: "Manicure", initials: "I", services: ["manicure"], color: "bg-slate-700" },
    { name: "Vinicius", role: "Marketing", initials: "V", services: [], color: "bg-emerald-600" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Equipe de Profissionais</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {professionals.map((professional, idx) => (
          <Card key={idx} className="text-center">
            <CardContent className="pt-6">
              <div
                className={`${professional.color} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}
              >
                {professional.initials}
              </div>
              <h5 className="text-lg font-semibold mb-1">{professional.name}</h5>
              <p className="text-muted-foreground text-sm mb-3">{professional.role}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {professional.services.length > 0 ? (
                  professional.services.map((service, i) => (
                    <ServiceBadge key={i} service={service} />
                  ))
                ) : (
                  <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
                    Vendas Prótese
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
