function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return value;
}

export function getSupabaseUrl(): string {
  return required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

/** Preferência: publishable key (docs atuais); fallback: anon key. */
export function getSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY",
    key,
  );
}

export function isLlmMockEnabled(): boolean {
  return process.env.LLM_MOCK === "true";
}

/** Preferência: GEMINI_API_KEY; fallback: LLM_API_KEY. */
export function getGeminiApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY ?? process.env.LLM_API_KEY;
  return key?.trim() || undefined;
}
