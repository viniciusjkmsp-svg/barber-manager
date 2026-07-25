import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ClientSource = "Indicação" | "Instagram" | "Google" | "Anúncio" | "Passou na rua" | "Outro";

export interface ClientVisit {
  id: string;
  date: string; // ISO date yyyy-mm-dd
  type: "servico" | "produto";
  description: string; // ex.: "Corte + Barba" ou "Cerveja Heineken"
  professional?: string;
  amount: number; // R$
}

export interface Client {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  birthday?: string; // yyyy-mm-dd
  source?: ClientSource;
  createdAt: string;
  visits: ClientVisit[];
}

interface ClientsContextValue {
  clients: Client[];
  addClient: (c: Omit<Client, "id" | "createdAt" | "visits">) => void;
  updateClient: (id: string, c: Partial<Omit<Client, "id" | "createdAt" | "visits">>) => void;
  removeClient: (id: string) => void;
  addVisit: (clientId: string, visit: Omit<ClientVisit, "id">) => void;
  removeVisit: (clientId: string, visitId: string) => void;
}

const STORAGE_KEY = "barbearia_clients_v1";
const ClientsContext = createContext<ClientsContextValue | null>(null);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // migração: garantir visits array
      return parsed.map((c: any) => ({ ...c, visits: c.visits ?? [] }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient: ClientsContextValue["addClient"] = (c) => {
    setClients((prev) => [
      ...prev,
      { ...c, id: Date.now().toString(), createdAt: new Date().toISOString(), visits: [] },
    ]);
  };

  const updateClient: ClientsContextValue["updateClient"] = (id, c) => {
    setClients((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x)));
  };

  const removeClient: ClientsContextValue["removeClient"] = (id) => {
    setClients((prev) => prev.filter((x) => x.id !== id));
  };

  const addVisit: ClientsContextValue["addVisit"] = (clientId, visit) => {
    setClients((prev) =>
      prev.map((x) =>
        x.id === clientId
          ? { ...x, visits: [...x.visits, { ...visit, id: crypto.randomUUID() }] }
          : x
      )
    );
  };

  const removeVisit: ClientsContextValue["removeVisit"] = (clientId, visitId) => {
    setClients((prev) =>
      prev.map((x) =>
        x.id === clientId ? { ...x, visits: x.visits.filter((v) => v.id !== visitId) } : x
      )
    );
  };

  return (
    <ClientsContext.Provider
      value={{ clients, addClient, updateClient, removeClient, addVisit, removeVisit }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error("useClients must be used within ClientsProvider");
  return ctx;
};
