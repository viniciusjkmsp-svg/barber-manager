import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Professional {
  name: string;
  role: string;
  initials: string;
  color: string;
  commissions: { label: string; value: string }[];
}

export const Professionals = () => {
  const professionals: Professional[] = [
    { name: "Kauan Carvalho", role: "Barbeiro", initials: "KC", color: "bg-blue-600", commissions: [{ label: "Barbearia", value: "50%" }, { label: "Manutenção", value: "40%" }] },
    { name: "Cristiano Nogueira", role: "Barbeiro", initials: "CN", color: "bg-cyan-600", commissions: [{ label: "Barbearia", value: "50%" }, { label: "Manutenção", value: "40%" }] },
    { name: "Claudio Carvalho", role: "Barbeiro", initials: "CC", color: "bg-amber-600", commissions: [{ label: "Barbearia", value: "50%" }, { label: "Manutenção", value: "40%" }] },
    { name: "Marcos Macedo", role: "Barbeiro", initials: "MM", color: "bg-green-600", commissions: [{ label: "Barbearia", value: "50%" }, { label: "Manutenção", value: "40%" }] },
    { name: "Silvia Gomes", role: "Cabeleireira", initials: "SG", color: "bg-red-600", commissions: [{ label: "Barbearia", value: "50%" }, { label: "Manutenção", value: "40%" }] },
    { name: "Irani", role: "Manicure", initials: "IR", color: "bg-slate-700", commissions: [{ label: "Manutenção", value: "65%" }] },
    { name: "Vinicius", role: "Gestor", initials: "VM", color: "bg-emerald-600", commissions: [{ label: "Prótese (todas as vendas)", value: "4%" }] },
    { name: "Davi", role: "Vendedor de Prótese", initials: "DV", color: "bg-indigo-600", commissions: [{ label: "Prótese", value: "3%" }] },
    { name: "Giovanna", role: "Vendedora de Prótese", initials: "GV", color: "bg-pink-600", commissions: [{ label: "Prótese", value: "3%" }] },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Equipe de Profissionais</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {professionals.map((p, idx) => (
          <Card key={idx} className="text-center">
            <CardContent className="pt-6">
              <div className={`${p.color} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}>
                {p.initials}
              </div>
              <h5 className="text-lg font-semibold mb-1">{p.name}</h5>
              <p className="text-muted-foreground text-sm mb-3">{p.role}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {p.commissions.map((c, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {c.label}: {c.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
