import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "create_appointment",
  title: "Criar agendamento",
  description: "Cria um novo agendamento para um profissional e serviço.",
  inputSchema: {
    professional_id: z.string().uuid(),
    service_id: z.string().uuid(),
    appointment_date: z.string().describe("Data YYYY-MM-DD."),
    appointment_time: z.string().describe("Horário HH:MM."),
    client_id: z.string().uuid().nullable().describe("ID do cliente (opcional)."),
    notes: z.string().nullable().describe("Observações (opcional)."),
    total_price: z.number().nullable().describe("Valor total (opcional)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado" }], isError: true };
    }
    const { data, error } = await sb(ctx)
      .from("appointments")
      .insert({
        professional_id: input.professional_id,
        service_id: input.service_id,
        appointment_date: input.appointment_date,
        appointment_time: input.appointment_time,
        client_id: input.client_id ?? null,
        notes: input.notes ?? null,
        total_price: input.total_price ?? null,
        status: "scheduled",
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { appointment: data },
    };
  },
});
