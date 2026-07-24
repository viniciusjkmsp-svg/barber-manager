/// <reference types="vite/client" />

// MCP tools are bundled into a Deno edge function; declare `process` globally
// so the TS type checker accepts `process.env.*` references in src/lib/mcp/.
declare const process: { env: Record<string, string | undefined> };
