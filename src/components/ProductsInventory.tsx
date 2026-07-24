import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, Check, X } from "lucide-react";
import { useState } from "react";
import { useProducts, productStatus, brl, Product } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";

export const ProductsInventory = () => {
  const { products, addProduct, updateProduct, removeProduct, restock } = useProducts();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Product>>({});
  const [restockQty, setRestockQty] = useState<Record<string, string>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      toast({ title: "Preencha nome e categoria", variant: "destructive" });
      return;
    }
    addProduct({
      name: form.name,
      category: form.category,
      price: parseFloat(form.price) || 0,
      cost: parseFloat(form.cost) || 0,
      stock: parseInt(form.stock) || 0,
      minStock: parseInt(form.minStock) || 0,
    });
    toast({ title: "Produto cadastrado", description: form.name });
    setForm({ name: "", category: "", price: "", cost: "", stock: "", minStock: "" });
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditDraft({ ...p });
  };
  const saveEdit = () => {
    if (editingId) {
      updateProduct(editingId, editDraft);
      toast({ title: "Produto atualizado" });
    }
    setEditingId(null);
    setEditDraft({});
  };

  const doRestock = (id: string) => {
    const qty = parseInt(restockQty[id] || "0");
    if (qty > 0) {
      restock(id, qty);
      toast({ title: "Estoque reabastecido", description: `+${qty} un` });
      setRestockQty({ ...restockQty, [id]: "" });
    }
  };

  const getStatusBadge = (p: Product) => {
    const s = productStatus(p);
    const map = {
      critical: { cls: "bg-[hsl(var(--stock-critical))]", label: "Crítico" },
      low: { cls: "bg-[hsl(var(--stock-low))]", label: "Baixo" },
      ok: { cls: "bg-[hsl(var(--stock-ok))]", label: "OK" },
    } as const;
    return <Badge className={`${map[s].cls} text-white`}>{p.stock} un - {map[s].label}</Badge>;
  };

  const counts = {
    ok: products.filter((p) => productStatus(p) === "ok").length,
    low: products.filter((p) => productStatus(p) === "low").length,
    critical: products.filter((p) => productStatus(p) === "critical").length,
  };
  const stockValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0);

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Produtos & Estoque</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cadastrar Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome do Produto</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do produto" />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Geladeira">Geladeira</SelectItem>
                    <SelectItem value="Produtos do Salão">Produtos do Salão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preço de Venda (R$)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0,00" />
              </div>
              <div>
                <Label>Custo (R$)</Label>
                <Input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="0,00" />
              </div>
              <div>
                <Label>Estoque Atual</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label>Estoque Mínimo</Label>
                <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} placeholder="0" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Cadastrar Produto
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground">Total de Produtos</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground">Valor em Estoque (custo)</p>
              <p className="text-xl font-bold">{brl(stockValue)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-[hsl(var(--stock-ok)/0.1)] text-center">
                <p className="text-[10px] text-[hsl(var(--stock-ok))]">OK</p>
                <p className="text-lg font-bold text-[hsl(var(--stock-ok))]">{counts.ok}</p>
              </div>
              <div className="p-2 rounded-lg bg-[hsl(var(--stock-low)/0.1)] text-center">
                <p className="text-[10px] text-[hsl(var(--stock-low))]">Baixo</p>
                <p className="text-lg font-bold text-[hsl(var(--stock-low))]">{counts.low}</p>
              </div>
              <div className="p-2 rounded-lg bg-[hsl(var(--stock-critical)/0.1)] text-center">
                <p className="text-[10px] text-[hsl(var(--stock-critical))]">Crítico</p>
                <p className="text-lg font-bold text-[hsl(var(--stock-critical))]">{counts.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Produtos</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold text-sm">Produto</th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">Categoria</th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">Preço</th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">Custo</th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">Margem</th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">Estoque</th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">Repor</th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isEdit = editingId === product.id;
                  const margin = product.price > 0 ? (((product.price - product.cost) / product.price) * 100).toFixed(0) : "0";
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-2 px-2 text-sm font-medium">
                        {isEdit ? (
                          <Input value={editDraft.name || ""} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} className="h-8" />
                        ) : product.name}
                      </td>
                      <td className="py-2 px-2 text-sm">{product.category}</td>
                      <td className="py-2 px-2 text-sm">
                        {isEdit ? (
                          <Input type="number" step="0.01" value={editDraft.price ?? 0} onChange={(e) => setEditDraft({ ...editDraft, price: parseFloat(e.target.value) || 0 })} className="h-8 w-20" />
                        ) : brl(product.price)}
                      </td>
                      <td className="py-2 px-2 text-sm">
                        {isEdit ? (
                          <Input type="number" step="0.01" value={editDraft.cost ?? 0} onChange={(e) => setEditDraft({ ...editDraft, cost: parseFloat(e.target.value) || 0 })} className="h-8 w-20" />
                        ) : brl(product.cost)}
                      </td>
                      <td className="py-2 px-2 text-sm text-success font-medium">{margin}%</td>
                      <td className="py-2 px-2">{getStatusBadge(product)}</td>
                      <td className="py-2 px-2">
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            min="1"
                            placeholder="qtd"
                            className="h-8 w-16"
                            value={restockQty[product.id] || ""}
                            onChange={(e) => setRestockQty({ ...restockQty, [product.id]: e.target.value })}
                          />
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => doRestock(product.id)}>
                            <Package className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex gap-1">
                          {isEdit ? (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={saveEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(null); setEditDraft({}); }}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(product)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { removeProduct(product.id); toast({ title: "Produto removido" }); }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground text-sm">Nenhum produto cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
