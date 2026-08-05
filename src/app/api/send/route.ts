import { NextResponse } from "next/server";

import { sendViaMake } from "@/lib/make/send";
import { createClient } from "@/lib/supabase/server";
import { sendSchema } from "@/lib/validations/send";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const parsed = sendSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Dados de envio inválidos.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name")
      .eq("id", user.id)
      .maybeSingle();

    const recipient =
      parsed.data.channel === "whatsapp"
        ? parsed.data.recipient.replace(/[\s()-]/g, "")
        : parsed.data.recipient;

    await sendViaMake({
      channel: parsed.data.channel,
      recipient,
      subject:
        parsed.data.subject?.trim() ||
        `Comunicado — ${profile?.company_name?.trim() || "Nossa Empresa"}`,
      message: parsed.data.message,
      textType: parsed.data.textType,
      tone: parsed.data.tone,
      companyName: profile?.company_name?.trim() || "Nossa Empresa",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao enviar via Make.";
    console.error("[send]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
