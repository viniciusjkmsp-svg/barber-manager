import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

export const ProductsInventory = () => {
  const products = [
    { id: 1, name: "Heineken Long Neck", category: "Cerveja", price: "15,00", cost: "8,00", stock: 48, minStock: 10, status: "ok" },
    { id: 2, name: "Stella Artois", category: "Cerveja", price: "12,00", cost: "6,50", stock: 36, minStock: 10, status: "ok" },
    { id: 3, name: "Corona Extra", category: "Cerveja", price: "14,00", cost: "7,50", stock: 2, minStock: 10, status: "critical" },
    { id: 4, name: "Spaten", category: "Cerveja", price: "13,00", cost: "7,00", stock: 3, minStock: 10, status: "low" },
    { id: 5, name: "Coca Cola 350ml", category: "Refrigerante", price: "6,00", cost: "3,00", stock: 24, minStock: 15, status: "ok" },
    { id: 6, name: "Coca Cola 200ml", category: "Refrigerante", price: "4,50", cost: "2,00", stock: 1, minStock: 15, status: "critical" },
    { id: 7, name: "Guaraná 200ml", category: "Refrigerante", price: "4,00", cost: "1,80", stock: 18, minStock: 15, status: "ok" },
    { id: 8, name: "Água Mineral 500ml", category: "Água", price: "3,00", cost: "1,00", stock: 50, minStock: 20, status: "ok" },
  ];

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "critical") {
      return (
        <Badge className="bg-[hsl(var(--stock-critical))] text-white">
          {stock} un - Crítico
        </Badge>
      );
    }
    if (status === "low") {
      return (
        <Badge className="bg-[hsl(var(--stock-low))] text-white">
          {stock} un - Baixo
        </Badge>
      );
    }
    return (
      <Badge className="bg-[hsl(var(--stock-ok))] text-white">
        {stock} un - OK
      </Badge>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Produtos & Estoque</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cadastrar Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeProduto">Nome do Produto</Label>
                <Input id="nomeProduto" placeholder="Nome do produto" />
              </div>
              <div>
                <Label htmlFor="categoriaProduto">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cerveja">Cerveja</SelectItem>
                    <SelectItem value="refrigerante">Refrigerante</SelectItem>
                    <SelectItem value="agua">Água</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="precoProduto">Preço de Venda (R$)</Label>
                <Input type="number" step="0.01" id="precoProduto" placeholder="0,00" />
              </div>
              <div>
                <Label htmlFor="custoProduto">Custo (R$)</Label>
                <Input type="number" step="0.01" id="custoProduto" placeholder="0,00" />
              </div>
              <div>
                <Label htmlFor="estoqueProduto">Estoque Atual</Label>
                <Input type="number" id="estoqueProduto" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                <Input type="number" id="estoqueMinimo" placeholder="0" />
              </div>
              <div className="md:col-span-2">
                <Button className="w-full">
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
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">Total de Produtos</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-[hsl(var(--stock-ok)/0.1)] text-center">
              <p className="text-sm text-[hsl(var(--stock-ok))]">Estoque OK</p>
              <p className="text-2xl font-bold text-[hsl(var(--stock-ok))]">
                {products.filter(p => p.status === "ok").length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[hsl(var(--stock-low)/0.1)] text-center">
              <p className="text-sm text-[hsl(var(--stock-low))]">Estoque Baixo</p>
              <p className="text-2xl font-bold text-[hsl(var(--stock-low))]">
                {products.filter(p => p.status === "low").length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[hsl(var(--stock-critical)/0.1)] text-center">
              <p className="text-sm text-[hsl(var(--stock-critical))]">Estoque Crítico</p>
              <p className="text-2xl font-bold text-[hsl(var(--stock-critical))]">
                {products.filter(p => p.status === "critical").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Produto</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Preço</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Custo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Margem</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Estoque</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const price = parseFloat(product.price.replace(",", "."));
                  const cost = parseFloat(product.cost.replace(",", "."));
                  const margin = ((price - cost) / price * 100).toFixed(0);
                  
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-sm">{product.category}</td>
                      <td className="py-3 px-4 text-sm">R$ {product.price}</td>
                      <td className="py-3 px-4 text-sm">R$ {product.cost}</td>
                      <td className="py-3 px-4 text-sm text-success font-medium">{margin}%</td>
                      <td className="py-3 px-4">{getStatusBadge(product.status, product.stock)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};