import { getGeminiApiKey, isLlmMockEnabled } from "@/lib/env";
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

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    message?: string;
    status?: string;
  };
};

export async function generateCorporateText(
  input: GenerateTextInput,
): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (isLlmMockEnabled() || !apiKey) {
    if (!apiKey && !isLlmMockEnabled()) {
      console.warn(
        "[llm] GEMINI_API_KEY/LLM_API_KEY ausente — usando geração mock. Defina LLM_MOCK=true ou configure a chave do Gemini.",
      );
    }
    return buildMockResult(input);
  }

  // Free tier atual para novos usuários: preferir 3.1 Flash-Lite / 3.x Flash.
  // Modelos "Live" / Native Audio NÃO servem para generateContent de texto.
  const model = process.env.LLM_MODEL ?? "gemini-3.1-flash-lite";
  const baseUrl = (
    process.env.LLM_BASE_URL ??
    "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "");

  const systemPrompt = buildSystemPrompt({
    companyName: input.companyName,
    toneGuidelines: input.toneGuidelines,
  });
  const userPrompt = buildUserPrompt(input);

  const response = await fetch(
    `${baseUrl}/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
        },
      }),
    },
  );

  const data = (await response.json()) as GeminiGenerateResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `Falha na API do Gemini (HTTP ${response.status})`,
    );
  }

  const content = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!content) {
    throw new Error("A API do Gemini retornou uma resposta vazia.");
  }

  return content;
}
