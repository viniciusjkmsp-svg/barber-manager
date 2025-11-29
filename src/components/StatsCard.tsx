interface StatsCardProps {
  title: string;
  value: string;
  type: "entrada" | "saida" | "saldo";
}

export const StatsCard = ({ title, value, type }: StatsCardProps) => {
  const gradients = {
    entrada: "from-[hsl(var(--stats-entrada-from))] to-[hsl(var(--stats-entrada-to))]",
    saida: "from-[hsl(var(--stats-saida-from))] to-[hsl(var(--stats-saida-to))]",
    saldo: "from-[hsl(var(--stats-saldo-from))] to-[hsl(var(--stats-saldo-to))]",
  };

  return (
    <div
      className={`bg-gradient-to-r ${gradients[type]} text-white rounded-xl p-6 shadow-lg`}
    >
      <p className="text-sm opacity-90 mb-2">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
};
