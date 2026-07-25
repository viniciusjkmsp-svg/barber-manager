import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Produtos",
  "Marketing",
  "Folha de pagamento",
  "Manutenção",
  "Outros",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  category: ExpenseCategory;
};

export type Income = {
  id: string;
  date: string;
  description: string;
  amount: number;
};

type FinanceContextType = {
  expenses: Expense[];
  incomes: Income[];
  addExpense: (e: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  addIncome: (i: Omit<Income, "id">) => void;
};

const FinanceContext = createContext<FinanceContextType | null>(null);
const STORAGE_KEY = "barbearia_finance_v1";

const uid = () => Math.random().toString(36).slice(2, 10);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setExpenses(parsed.expenses ?? []);
        setIncomes(parsed.incomes ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses, incomes }));
  }, [expenses, incomes]);

  const addExpense = (e: Omit<Expense, "id">) =>
    setExpenses((prev) => [...prev, { ...e, id: uid() }]);
  const removeExpense = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  const addIncome = (i: Omit<Income, "id">) =>
    setIncomes((prev) => [...prev, { ...i, id: uid() }]);

  return (
    <FinanceContext.Provider value={{ expenses, incomes, addExpense, removeExpense, addIncome }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
};

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
