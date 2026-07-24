import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
};

type ProductsContextType = {
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  sellProduct: (id: string, qty: number) => boolean;
  restock: (id: string, qty: number) => void;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

const STORAGE_KEY = "barbearia_products_v1";

const DEFAULT_PRODUCTS: Product[] = [
  { id: "p1", name: "Heineken Long Neck", category: "Cerveja", price: 15, cost: 8, stock: 48, minStock: 10 },
  { id: "p2", name: "Stella Artois", category: "Cerveja", price: 12, cost: 6.5, stock: 36, minStock: 10 },
  { id: "p3", name: "Corona Extra", category: "Cerveja", price: 14, cost: 7.5, stock: 2, minStock: 10 },
  { id: "p4", name: "Spaten", category: "Cerveja", price: 13, cost: 7, stock: 3, minStock: 10 },
  { id: "p5", name: "Coca Cola 350ml", category: "Refrigerante", price: 6, cost: 3, stock: 24, minStock: 15 },
  { id: "p6", name: "Coca Cola 200ml", category: "Refrigerante", price: 4.5, cost: 2, stock: 1, minStock: 15 },
  { id: "p7", name: "Guaraná 200ml", category: "Refrigerante", price: 4, cost: 1.8, stock: 18, minStock: 15 },
  { id: "p8", name: "Água Mineral 500ml", category: "Água", price: 3, cost: 1, stock: 50, minStock: 20 },
];

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Product[];
    } catch {}
    return DEFAULT_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct: ProductsContextType["addProduct"] = (p) => {
    setProducts((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);
  };
  const updateProduct: ProductsContextType["updateProduct"] = (id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const removeProduct: ProductsContextType["removeProduct"] = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const sellProduct: ProductsContextType["sellProduct"] = (id, qty) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return false;
    if (prod.stock < qty) {
      toast({
        title: "Estoque insuficiente",
        description: `${prod.name}: apenas ${prod.stock} em estoque.`,
        variant: "destructive",
      });
      return false;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock - qty } : p))
    );
    const remaining = prod.stock - qty;
    if (remaining <= prod.minStock) {
      toast({
        title: "Estoque baixo",
        description: `${prod.name}: ${remaining} un restantes.`,
      });
    }
    return true;
  };
  const restock: ProductsContextType["restock"] = (id, qty) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + qty } : p))
    );
  };

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, removeProduct, sellProduct, restock }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
};

export const productStatus = (p: Product): "critical" | "low" | "ok" => {
  if (p.stock <= Math.max(2, Math.floor(p.minStock * 0.2))) return "critical";
  if (p.stock <= p.minStock) return "low";
  return "ok";
};

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
