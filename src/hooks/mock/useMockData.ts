// ============================================================
// MS Manager — mock data compartilhado entre módulos e dashboards
// ------------------------------------------------------------
// Camada única de dados fake que garante coerência entre Agenda,
// Financeiro, Dashboards, Ranking, Marketing, WhatsApp etc.
// Determinístico a partir de new Date() (dia/semana correntes).
// ============================================================

import { useMemo } from "react";

export type Dept = "barbearia" | "salao" | "protese";
export type AgendaStatus =
  | "pending"
  | "confirmed"
  | "progress"
  | "done"
  | "cancelled"
  | "noshow";

export interface Professional {
  id: string;
  name: string;
  role: string;
  dept: Dept;
  color: string;
  monthTarget: number;
  liveStatus: "livre" | "ocupado" | "pausa" | "ausente";
}

export interface Appointment {
  id: string;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
  clientId: string;
  clientName: string;
  professionalId: string;
  service: string;
  dept: Dept;
  price: number;
  durationMin: number;
  status: AgendaStatus;
  vip?: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dept: Dept;
  vip?: boolean;
  visits: number;
  totalSpent: number;
  lastVisitDaysAgo: number;
  birthday?: string; // MM-DD
  source: "Indicação" | "Instagram" | "Google" | "Anúncio";
}

export interface WhatsappConversation {
  id: string;
  clientName: string;
  dept: Dept;
  lastMessage: string;
  unread: number;
  minutesAgo: number;
}

export interface Lead {
  id: string;
  name: string;
  channel: string;
  segment: "protese" | "cursos";
  status: "novo" | "contato" | "qualificado" | "matriculado" | "perdido";
  createdDaysAgo: number;
}

export interface AdCreative {
  id: string;
  name: string;
  segment: "protese" | "cursos";
  invest: number;
  leads: number;
  cpl: number;
  conv: number;
  cac: number;
  hot: boolean;
}

// -----------------------------
// Base fixa
// -----------------------------
const PROFESSIONALS: Professional[] = [
  { id: "kauan", name: "Kauan Carvalho", role: "Barbeiro", dept: "barbearia", color: "#4c9af5", monthTarget: 8000, liveStatus: "ocupado" },
  { id: "cristiano", name: "Cristiano Nogueira", role: "Barbeiro", dept: "barbearia", color: "#4caf7d", monthTarget: 7500, liveStatus: "livre" },
  { id: "kaua", name: "Kauã Gonçalves", role: "Barbeiro", dept: "barbearia", color: "#e0a44c", monthTarget: 6000, liveStatus: "ocupado" },
  { id: "vinicius", name: "Vinicius", role: "Gestor Prótese", dept: "protese", color: "#C9A84C", monthTarget: 12000, liveStatus: "ocupado" },
  { id: "silvia", name: "Silvia", role: "Cabeleireira", dept: "salao", color: "#e05c5c", monthTarget: 9000, liveStatus: "pausa" },
  { id: "irani", name: "Irani", role: "Manicure", dept: "salao", color: "#a44ce0", monthTarget: 4500, liveStatus: "ausente" },
];

const CLIENTS: Client[] = [
  { id: "c1", name: "João Pereira", phone: "(11) 98800-1001", dept: "barbearia", vip: true, visits: 22, totalSpent: 1980, lastVisitDaysAgo: 8, source: "Indicação" },
  { id: "c2", name: "Lucas Almeida", phone: "(11) 98800-1002", dept: "barbearia", vip: true, visits: 18, totalSpent: 1520, lastVisitDaysAgo: 22, source: "Instagram" },
  { id: "c3", name: "Roberto Silva", phone: "(11) 98800-1003", dept: "barbearia", visits: 6, totalSpent: 420, lastVisitDaysAgo: 12, source: "Google" },
  { id: "c4", name: "Marcos Teixeira", phone: "(11) 98800-1004", dept: "protese", vip: true, visits: 4, totalSpent: 6800, lastVisitDaysAgo: 15, source: "Anúncio" },
  { id: "c5", name: "Ana Paula", phone: "(11) 98800-1005", dept: "salao", visits: 14, totalSpent: 2240, lastVisitDaysAgo: 5, source: "Instagram" },
  { id: "c6", name: "Marina Costa", phone: "(11) 98800-1006", dept: "salao", visits: 9, totalSpent: 1380, lastVisitDaysAgo: 18, source: "Indicação" },
  { id: "c7", name: "Débora Lima", phone: "(11) 98800-1007", dept: "salao", visits: 11, totalSpent: 1720, lastVisitDaysAgo: 3, source: "Anúncio" },
  { id: "c8", name: "Fernanda R.", phone: "(11) 98800-1008", dept: "barbearia", visits: 3, totalSpent: 180, lastVisitDaysAgo: 55, source: "Google" },
  { id: "c9", name: "Rodrigo M.", phone: "(11) 98800-1009", dept: "protese", visits: 1, totalSpent: 2800, lastVisitDaysAgo: 28, source: "Anúncio" },
  { id: "c10", name: "Camila S.", phone: "(11) 98800-1010", dept: "salao", visits: 2, totalSpent: 320, lastVisitDaysAgo: 60, source: "Instagram" },
];

const pad = (n: number) => n.toString().padStart(2, "0");
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function buildAppointments(today: Date): Appointment[] {
  const t = isoDate(today);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const t2 = isoDate(tomorrow);

  return [
    { id: "a1", date: t, time: "09:00", clientId: "c1", clientName: "João Pereira", professionalId: "kauan", service: "Corte + Barba", dept: "barbearia", price: 90, durationMin: 60, status: "done", vip: true },
    { id: "a2", date: t, time: "09:30", clientId: "c5", clientName: "Ana Paula", professionalId: "silvia", service: "Escova progressiva", dept: "salao", price: 220, durationMin: 90, status: "progress" },
    { id: "a3", date: t, time: "10:00", clientId: "c3", clientName: "Roberto Silva", professionalId: "cristiano", service: "Corte", dept: "barbearia", price: 55, durationMin: 40, status: "pending" },
    { id: "a4", date: t, time: "10:30", clientId: "c2", clientName: "Lucas Almeida", professionalId: "kauan", service: "Corte + Barba", dept: "barbearia", price: 90, durationMin: 60, status: "confirmed", vip: true },
    { id: "a5", date: t, time: "11:00", clientId: "c6", clientName: "Marina Costa", professionalId: "irani", service: "Manicure + Pedicure", dept: "salao", price: 90, durationMin: 60, status: "confirmed" },
    { id: "a6", date: t, time: "11:30", clientId: "c7", clientName: "Débora Lima", professionalId: "silvia", service: "Coloração", dept: "salao", price: 180, durationMin: 90, status: "pending" },
    { id: "a7", date: t, time: "14:00", clientId: "c4", clientName: "Marcos Teixeira", professionalId: "vinicius", service: "Prótese - manutenção", dept: "protese", price: 450, durationMin: 90, status: "confirmed", vip: true },
    { id: "a8", date: t, time: "15:00", clientId: "c9", clientName: "Rodrigo M.", professionalId: "vinicius", service: "Prótese - aplicação", dept: "protese", price: 2800, durationMin: 180, status: "confirmed" },
    { id: "a9", date: t, time: "16:30", clientId: "c3", clientName: "Roberto Silva", professionalId: "kaua", service: "Corte", dept: "barbearia", price: 55, durationMin: 40, status: "cancelled" },
    { id: "a10", date: t, time: "17:00", clientId: "c8", clientName: "Fernanda R.", professionalId: "cristiano", service: "Corte + Barba", dept: "barbearia", price: 90, durationMin: 60, status: "noshow" },
    { id: "a11", date: t2, time: "09:00", clientId: "c2", clientName: "Lucas Almeida", professionalId: "kauan", service: "Corte", dept: "barbearia", price: 55, durationMin: 40, status: "confirmed", vip: true },
    { id: "a12", date: t2, time: "10:00", clientId: "c4", clientName: "Marcos Teixeira", professionalId: "vinicius", service: "Prótese - manutenção", dept: "protese", price: 450, durationMin: 90, status: "confirmed", vip: true },
  ];
}

const CONVERSATIONS: WhatsappConversation[] = [
  { id: "w1", clientName: "João Pereira", dept: "barbearia", lastMessage: "Confirma amanhã 09h?", unread: 1, minutesAgo: 12 },
  { id: "w2", clientName: "Marcos Teixeira", dept: "protese", lastMessage: "Cheguei em 10 min", unread: 0, minutesAgo: 45 },
  { id: "w3", clientName: "Débora Lima", dept: "salao", lastMessage: "Posso trocar pra sexta?", unread: 2, minutesAgo: 90 },
  { id: "w4", clientName: "Rodrigo M.", dept: "protese", lastMessage: "Fechado, vou aplicar!", unread: 0, minutesAgo: 180 },
];

const LEADS: Lead[] = [
  { id: "l1", name: "Rodrigo M.", channel: "Meta - Prótese", segment: "protese", status: "qualificado", createdDaysAgo: 1 },
  { id: "l2", name: "Camila S.", channel: "Meta - Curso", segment: "cursos", status: "contato", createdDaysAgo: 2 },
  { id: "l3", name: "Diego P.", channel: "Instagram", segment: "protese", status: "novo", createdDaysAgo: 0 },
  { id: "l4", name: "Bruno T.", channel: "Meta - Curso", segment: "cursos", status: "matriculado", createdDaysAgo: 5 },
  { id: "l5", name: "Eduardo V.", channel: "Meta - Prótese", segment: "protese", status: "perdido", createdDaysAgo: 8 },
];

const ADS: AdCreative[] = [
  { id: "ad1", name: "Prótese - Depoimento Kauan", segment: "protese", invest: 480, leads: 42, cpl: 11.4, conv: 18, cac: 62, hot: true },
  { id: "ad2", name: "Prótese - Antes/Depois v3", segment: "protese", invest: 320, leads: 28, cpl: 11.4, conv: 12, cac: 58, hot: true },
  { id: "ad3", name: "Prótese - Story Reels", segment: "protese", invest: 260, leads: 14, cpl: 18.5, conv: 6, cac: 84, hot: false },
  { id: "ad4", name: "Curso - Aula Aberta", segment: "cursos", invest: 220, leads: 31, cpl: 7.1, conv: 9, cac: 42, hot: true },
  { id: "ad5", name: "Curso - Formados 2025", segment: "cursos", invest: 180, leads: 18, cpl: 10, conv: 4, cac: 65, hot: false },
];

// -----------------------------
// Hook único (memoizado por dia)
// -----------------------------
export function useMockData() {
  return useMemo(() => {
    const today = new Date();
    const appointments = buildAppointments(today);

    const todayStr = isoDate(today);
    const todayAppts = appointments.filter((a) => a.date === todayStr);

    const revenueToday = todayAppts
      .filter((a) => a.status === "done" || a.status === "progress")
      .reduce((s, a) => s + a.price, 0);

    const ranking = PROFESSIONALS.map((p) => {
      const total = appointments
        .filter((a) => a.professionalId === p.id && a.status !== "cancelled" && a.status !== "noshow")
        .reduce((s, a) => s + a.price, 0);
      return { ...p, weekTotal: total };
    }).sort((a, b) => b.weekTotal - a.weekTotal);

    const nextAppt = todayAppts
      .filter((a) => a.status === "confirmed" || a.status === "pending")
      .sort((a, b) => a.time.localeCompare(b.time))[0];

    // Séries 6 meses (determinístico)
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((m, i) => ({
      month: m,
      revenue: 28000 + i * 2400 + (i % 2 === 0 ? 1800 : 0),
      expenses: 12000 + i * 800,
    }));

    return {
      professionals: PROFESSIONALS,
      clients: CLIENTS,
      appointments,
      todayAppointments: todayAppts,
      conversations: CONVERSATIONS,
      leads: LEADS,
      ads: ADS,
      revenueToday,
      ranking,
      nextAppointment: nextAppt,
      monthlySeries: months,
      counts: {
        agendados: todayAppts.length,
        confirmados: todayAppts.filter((a) => a.status === "confirmed").length,
        pendentes: todayAppts.filter((a) => a.status === "pending").length,
        cancelados: todayAppts.filter((a) => a.status === "cancelled").length,
        faltaram: todayAppts.filter((a) => a.status === "noshow").length,
        atendidos: todayAppts.filter((a) => a.status === "done").length,
        emAtendimento: todayAppts.filter((a) => a.status === "progress").length,
        vipInativos: CLIENTS.filter((c) => c.vip && c.lastVisitDaysAgo > 30).length,
        inativos: CLIENTS.filter((c) => c.lastVisitDaysAgo > 45).length,
        leadsHoje: LEADS.filter((l) => l.createdDaysAgo === 0).length,
        equipeLivre: PROFESSIONALS.filter((p) => p.liveStatus === "livre").length,
        equipeTotal: PROFESSIONALS.length,
        equipeAusente: PROFESSIONALS.filter((p) => p.liveStatus === "ausente").length,
      },
    };
  }, []);
}

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
