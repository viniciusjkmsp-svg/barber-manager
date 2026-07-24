// Tools run in a Deno edge function; declare process for the TS type checker.
declare const process: { env: Record<string, string | undefined> };
