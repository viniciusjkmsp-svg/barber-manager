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
  name: "list_appointments",
  title: "Listar agendamentos",
  description: "Lista agendamentos por intervalo de datas (formato YYYY-MM-DD).",
  inputSchema: {
    from: z.string().describe("Data inicial YYYY-MM-DD (inclusiva)."),
    to: z.string().describe("Data final YYYY-MM-DD (inclusiva)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ from, to }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado" }], isError: true };
    }
    const { data, error } = await sb(ctx)
      .from("appointments")
      .select("id,appointment_date,appointment_time,status,total_price,notes,professional_id,service_id,client_id")
      .gte("appointment_date", from)
      .lte("appointment_date", to)
      .order("appointment_date")
      .order("appointment_time");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { appointments: data ?? [] },
    };
  },
});
