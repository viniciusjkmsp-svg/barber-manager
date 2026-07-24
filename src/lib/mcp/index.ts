import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProfessionals from "./tools/list-professionals";
import listServices from "./tools/list-services";
import listAppointments from "./tools/list-appointments";
import createAppointment from "./tools/create-appointment";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "barbearia-estilo-mcp",
  title: "Barbearia Estilo MCP",
  version: "0.1.0",
  instructions:
    "Ferramentas para a Barbearia Estilo. Permite listar profissionais, serviços, agendamentos e criar novos agendamentos.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProfessionals, listServices, listAppointments, createAppointment],
});
