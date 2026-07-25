import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Client {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  createdAt: string;
}

interface ClientsContextValue {
  clients: Client[];
  addClient: (c: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, c: Partial<Omit<Client, "id" | "createdAt">>) => void;
  removeClient: (id: string) => void;
}

const STORAGE_KEY = "barbearia_clients_v1";
const ClientsContext = createContext<ClientsContextValue | null>(null);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
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
      { ...c, id: Date.now().toString(), createdAt: new Date().toISOString() },
    ]);
  };

  const updateClient: ClientsContextValue["updateClient"] = (id, c) => {
    setClients((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x)));
  };

  const removeClient: ClientsContextValue["removeClient"] = (id) => {
    setClients((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, removeClient }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error("useClients must be used within ClientsProvider");
  return ctx;
};
