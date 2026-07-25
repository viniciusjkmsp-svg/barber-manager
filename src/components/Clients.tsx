import { useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, Mail, Phone, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/useClients";

const clientSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  whatsapp: z.string().trim().min(8, "WhatsApp inválido").max(20),
});

export const Clients = () => {
  const { clients, addClient, removeClient } = useClients();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });

  const handleSubmit = () => {
    const parsed = clientSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Erro",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    addClient(parsed.data);
    setForm({ name: "", email: "", whatsapp: "" });
    setOpen(false);
    toast({ title: "Sucesso", description: "Cliente cadastrado!" });
  };

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.whatsapp.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome completo"
                  maxLength={100}
                />
              </div>
              <div>
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="cliente@email.com"
                  maxLength={255}
                />
              </div>
              <div>
                <Label>WhatsApp *</Label>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000"
                  maxLength={20}
                />
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                Cadastrar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-stats-entrada to-emerald-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Total de Clientes</p>
            <p className="text-2xl font-bold">{clients.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-stats-saldo to-cyan-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Mail className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Com E-mail</p>
            <p className="text-2xl font-bold">{clients.filter((c) => c.email).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-600 to-purple-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Phone className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Com WhatsApp</p>
            <p className="text-2xl font-bold">{clients.filter((c) => c.whatsapp).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Clientes Cadastrados</CardTitle>
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar por nome, e-mail ou WhatsApp"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {clients.length === 0
                ? "Nenhum cliente cadastrado ainda."
                : "Nenhum cliente encontrado para essa busca."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.whatsapp}</TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeClient(c.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
