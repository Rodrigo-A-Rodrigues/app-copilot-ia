import { isLlmMockEnabled } from "@/lib/env";
import {
  buildMockResult,
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/prompts/system";
import type { TextType, Tone } from "@/types/domain";

type GenerateTextInput = {
  textType: TextType;
  tone: Tone;
  topics: string;
  companyName: string;
  toneGuidelines: string | null;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function generateCorporateText(
  input: GenerateTextInput,
): Promise<string> {
  if (isLlmMockEnabled() || !process.env.LLM_API_KEY) {
    if (!process.env.LLM_API_KEY && !isLlmMockEnabled()) {
      // Sem chave e sem mock explícito: ainda assim devolve mock em dev
      // para não bloquear o protótipo; loga aviso no servidor.
      console.warn(
        "[llm] LLM_API_KEY ausente — usando geração mock. Defina LLM_MOCK=true ou configure a chave.",
      );
    }
    return buildMockResult(input);
  }

  const baseUrl = (process.env.LLM_BASE_URL ?? "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.LLM_MODEL ?? "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt({
            companyName: input.companyName,
            toneGuidelines: input.toneGuidelines,
          }),
        },
        {
          role: "user",
          content: buildUserPrompt(input),
        },
      ],
    }),
  });

  const data = (await response.json()) as ChatCompletionResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `Falha na API do LLM (HTTP ${response.status})`,
    );
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("A API do LLM retornou uma resposta vazia.");
  }

  return content;
}
