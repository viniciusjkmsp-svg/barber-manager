import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CreditCard, Users, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  services: string[];
  duration: string;
}

interface Subscriber {
  id: string;
  name: string;
  phone: string;
  planId: string;
  professional: string;
  startDate: string;
  nextPayment: string;
  status: "ativo" | "vencido" | "pendente";
}

const PROFESSIONALS = [
  "Kauan Carvalho",
  "Kauã Gonçalves",
  "Cristiano Nogueira",
  "Claudio Carvalho",
  "Marcos Macedo",
  "Silvia Gomes",
];

const initialPlans: Plan[] = [
  {
    id: "1",
    name: "Plano Corte",
    price: 130.00,
    services: ["4 Cortes por mês"],
    duration: "Mensal"
  },
  {
    id: "2",
    name: "Plano Corte + Barba",
    price: 180.00,
    services: ["4 Cortes por mês", "4 Barbas por mês"],
    duration: "Mensal"
  },
  {
    id: "3",
    name: "Plano 2x na Semana",
    price: 240.00,
    services: ["8 Cortes por mês", "8 Barbas por mês", "2x por semana"],
    duration: "Mensal"
  }
];

const initialSubscribers: Subscriber[] = [
  {
    id: "1",
    name: "Pedro Henrique",
    phone: "(11) 99999-1111",
    planId: "2",
    startDate: "2024-01-15",
    nextPayment: "2024-02-15",
    professional: "Kauan Carvalho",
    status: "ativo"
  },
  {
    id: "2",
    name: "Lucas Ferreira",
    phone: "(11) 99999-2222",
    planId: "3",
    startDate: "2024-01-10",
    nextPayment: "2024-02-10",
    professional: "Kauan Carvalho",
    status: "ativo"
  },
  {
    id: "3",
    name: "Gabriel Santos",
    phone: "(11) 99999-3333",
    planId: "1",
    startDate: "2023-12-20",
    nextPayment: "2024-01-20",
    professional: "Marcos Macedo",
    status: "vencido"
  },
  {
    id: "4",
    name: "Rodrigo Lima",
    phone: "(11) 99999-4444",
    planId: "2",
    startDate: "2024-01-28",
    nextPayment: "2024-02-28",
    professional: "Silvia Gomes",
    status: "pendente"
  }
];

export const SubscriptionPlans = () => {
  const [plans] = useState<Plan[]>(initialPlans);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const { toast } = useToast();

  const [newSubscriber, setNewSubscriber] = useState({
    name: "",
    phone: "",
    planId: "",
    professional: "",
    startDate: ""
  });

  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    services: "",
    duration: "Mensal"
  });

  const getPlanById = (planId: string) => plans.find(p => p.id === planId);

  const getStatusBadge = (status: Subscriber["status"]) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-stats-entrada text-white"><CheckCircle className="w-3 h-3 mr-1" /> Ativo</Badge>;
      case "vencido":
        return <Badge className="bg-stats-saida text-white"><AlertCircle className="w-3 h-3 mr-1" /> Vencido</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>;
    }
  };

  const handleAddSubscriber = () => {
    if (!newSubscriber.name || !newSubscriber.planId || !newSubscriber.professional || !newSubscriber.startDate) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date(newSubscriber.startDate);
    const nextPayment = new Date(startDate);
    nextPayment.setMonth(nextPayment.getMonth() + 1);

    const subscriber: Subscriber = {
      id: Date.now().toString(),
      name: newSubscriber.name,
      phone: newSubscriber.phone,
      planId: newSubscriber.planId,
      professional: newSubscriber.professional,
      startDate: newSubscriber.startDate,
      nextPayment: nextPayment.toISOString().split('T')[0],
      status: "ativo"
    };

    setSubscribers([...subscribers, subscriber]);
    setNewSubscriber({ name: "", phone: "", planId: "", professional: "", startDate: "" });
    setIsAddingSubscriber(false);
    toast({
      title: "Sucesso",
      description: "Assinante cadastrado com sucesso!"
    });
  };


  const activeSubscribers = subscribers.filter(s => s.status === "ativo").length;
  const expiredSubscribers = subscribers.filter(s => s.status === "vencido").length;
  const monthlyRevenue = subscribers
    .filter(s => s.status === "ativo")
    .reduce((acc, s) => acc + (getPlanById(s.planId)?.price || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Planos e Mensalidades</h2>
        <div className="flex gap-2">
          <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Plano</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Plano</Label>
                  <Input 
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="Ex: Plano Gold"
                  />
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input 
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label>Serviços Inclusos (separados por vírgula)</Label>
                  <Input 
                    value={newPlan.services}
                    onChange={(e) => setNewPlan({...newPlan, services: e.target.value})}
                    placeholder="4 Cortes, 4 Barbas..."
                  />
                </div>
                <Button className="w-full" onClick={() => setIsAddingPlan(false)}>
                  Criar Plano
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddingSubscriber} onOpenChange={setIsAddingSubscriber}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Novo Assinante
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Assinante</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Cliente *</Label>
                  <Input 
                    value={newSubscriber.name}
                    onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input 
                    value={newSubscriber.phone}
                    onChange={(e) => setNewSubscriber({...newSubscriber, phone: e.target.value})}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <Label>Plano *</Label>
                  <Select value={newSubscriber.planId} onValueChange={(v) => setNewSubscriber({...newSubscriber, planId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - R$ {plan.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Profissional Responsável *</Label>
                  <Select value={newSubscriber.professional} onValueChange={(v) => setNewSubscriber({...newSubscriber, professional: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFESSIONALS.map(prof => (
                        <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data de Início *</Label>
                  <Input 
                    type="date"
                    value={newSubscriber.startDate}
                    onChange={(e) => setNewSubscriber({...newSubscriber, startDate: e.target.value})}
                  />
                </div>

                {/* Cálculo automático */}
                {(() => {
                  const plan = getPlanById(newSubscriber.planId);
                  if (!plan) return null;
                  const start = newSubscriber.startDate ? new Date(newSubscriber.startDate) : null;
                  const next = start ? new Date(start) : null;
                  if (next) next.setMonth(next.getMonth() + 1);
                  const commissionRate = 0.5;
                  const commission = plan.price * commissionRate;
                  const houseShare = plan.price - commission;
                  return (
                    <div className="rounded-lg border bg-muted/40 p-3 space-y-1 text-sm">
                      <div className="font-semibold mb-1">Resumo do Plano</div>
                      <div className="flex justify-between"><span>Plano:</span><span>{plan.name}</span></div>
                      <div className="flex justify-between"><span>Valor mensal:</span><span className="font-bold">R$ {plan.price.toFixed(2)}</span></div>
                      {next && (
                        <div className="flex justify-between"><span>Próximo pagamento:</span><span>{next.toLocaleDateString('pt-BR')}</span></div>
                      )}
                      {newSubscriber.professional && (
                        <>
                          <div className="flex justify-between"><span>Comissão {newSubscriber.professional} (50%):</span><span>R$ {commission.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span>Barbearia (50%):</span><span>R$ {houseShare.toFixed(2)}</span></div>
                        </>
                      )}
                    </div>
                  );
                })()}

                <Button className="w-full" onClick={handleAddSubscriber}>
                  Cadastrar Assinante
                </Button>

              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-stats-entrada to-emerald-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Assinantes Ativos</p>
            <p className="text-2xl font-bold">{activeSubscribers}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-stats-saida to-pink-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Vencidos</p>
            <p className="text-2xl font-bold">{expiredSubscribers}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-stats-saldo to-cyan-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <CreditCard className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Receita Mensal</p>
            <p className="text-2xl font-bold">R$ {monthlyRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-600 to-purple-400 text-white border-0">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Total de Planos</p>
            <p className="text-2xl font-bold">{plans.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Planos Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <Card key={plan.id} className="border-2 hover:border-accent transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-2xl font-bold text-accent">
                  R$ {plan.price.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">/mês</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.services.map((service, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-stats-entrada" />
                      {service}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assinantes Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Próximo Pagamento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map(subscriber => {
                const plan = getPlanById(subscriber.planId);
                return (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.name}</TableCell>
                    <TableCell>{subscriber.phone}</TableCell>
                    <TableCell>{plan?.name}</TableCell>
                    <TableCell>{subscriber.professional}</TableCell>
                    <TableCell className="font-semibold">R$ {plan?.price.toFixed(2)}</TableCell>
                    <TableCell>{new Date(subscriber.startDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(subscriber.nextPayment).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                  </TableRow>
                );
              })}

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
