import { useState } from "react";
import { Card, GOLD } from "./dashboards/widgets";
import { Check } from "lucide-react";

export function Tarefas() {
  const [tasks, setTasks] = useState([
    { id: 1, t: "Repor pomada modeladora", done: false },
    { id: 2, t: "Confirmar clientes da tarde via WhatsApp", done: false },
    { id: 3, t: "Fechar caixa do dia anterior", done: true },
    { id: 4, t: "Verificar estoque de shampoo", done: false },
  ]);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-base font-medium">Tarefas</div>
        <div className="text-xs text-muted-foreground">Pendências do dia</div>
      </div>
      <Card>
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <button
              key={t.id}
              onClick={() => setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted transition-colors text-left"
            >
              <div
                className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: t.done ? GOLD : "hsl(var(--border))",
                  background: t.done ? GOLD : "transparent",
                }}
              >
                {t.done && <Check className="w-3 h-3" style={{ color: "#0d0d0d" }} />}
              </div>
              <span
                className={`text-[13px] ${t.done ? "line-through text-muted-foreground" : ""}`}
              >
                {t.t}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
