import { NextResponse } from "next/server";

import { generateCorporateText } from "@/lib/llm/generate";
import { createClient } from "@/lib/supabase/server";
import {
  TEXT_TYPES,
  TONES,
  type GenerateRequest,
  type TextType,
  type Tone,
} from "@/types/domain";

function isTextType(value: unknown): value is TextType {
  return typeof value === "string" && TEXT_TYPES.includes(value as TextType);
}

function isTone(value: unknown): value is Tone {
  return typeof value === "string" && TONES.includes(value as Tone);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = (await request.json()) as Partial<GenerateRequest>;
    const textType = body.textType;
    const tone = body.tone;
    const topics = typeof body.topics === "string" ? body.topics.trim() : "";

    if (!isTextType(textType) || !isTone(tone) || topics.length < 3) {
      return NextResponse.json(
        {
          error:
            "Envie textType, tone e topics válidos (tópicos com pelo menos 3 caracteres).",
        },
        { status: 400 },
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name, tone_guidelines")
      .eq("id", user.id)
      .maybeSingle();

    const result = await generateCorporateText({
      textType,
      tone,
      topics,
      companyName: profile?.company_name?.trim() || "Nossa Empresa",
      toneGuidelines: profile?.tone_guidelines ?? null,
    });

    const { data: generation, error: insertError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        text_type: textType,
        tone,
        topics,
        result,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[generate] falha ao salvar histórico:", insertError.message);
    }

    return NextResponse.json({
      result,
      generationId: generation?.id ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao gerar o texto.";
    console.error("[generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
