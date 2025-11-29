interface ServiceBadgeProps {
  service: "corte" | "barba" | "sobrancelha" | "luzes" | "alisamento" | "botox" | "manicure";
  label?: string;
}

export const ServiceBadge = ({ service, label }: ServiceBadgeProps) => {
  const colors = {
    corte: "bg-[hsl(var(--badge-corte))]",
    barba: "bg-[hsl(var(--badge-barba))]",
    sobrancelha: "bg-[hsl(var(--badge-sobrancelha))]",
    luzes: "bg-[hsl(var(--badge-luzes))]",
    alisamento: "bg-[hsl(var(--badge-alisamento))]",
    botox: "bg-[hsl(var(--badge-botox))]",
    manicure: "bg-secondary",
  };

  const labels = {
    corte: "Corte",
    barba: "Barba",
    sobrancelha: "Sobrancelha",
    luzes: "Luzes",
    alisamento: "Alisamento",
    botox: "Botox",
    manicure: "Manicure",
  };

  return (
    <span className={`${colors[service]} text-white text-xs px-2 py-1 rounded`}>
      {label || labels[service]}
    </span>
  );
};
