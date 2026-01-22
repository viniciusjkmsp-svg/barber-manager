import { Link } from "react-router-dom";
import { CalendarPlus, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <main className="min-h-screen bg-background relative">
      <header className="absolute top-4 right-4">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
          aria-label="Acessar área do administrador"
        >
          <Lock className="h-4 w-4" />
          Administrador
        </Link>
      </header>

      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Agende seu horário
          </h1>
          <p className="text-muted-foreground">
            Escolha o serviço, o profissional e o melhor horário em poucos passos.
          </p>

          <Button asChild size="lg" className="w-full">
            <Link to="/agendamento" className="inline-flex items-center justify-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              Agendar Agora
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
