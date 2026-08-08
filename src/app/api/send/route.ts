import { NextResponse } from "next/server";

import {
  buildCorporateEmailHtml,
  resolveEmailSubject,
} from "@/lib/email/templates";
import { parseGeneratedMessage } from "@/lib/email/parse-message";
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

    const companyName = profile?.company_name?.trim() || "Nossa Empresa";
    const recipient =
      parsed.data.channel === "whatsapp"
        ? parsed.data.recipient.replace(/[\s()-]/g, "")
        : parsed.data.recipient;

    const subject = resolveEmailSubject(
      parsed.data.subject,
      parsed.data.message,
      companyName,
    );

    const { body: plainBody } = parseGeneratedMessage(parsed.data.message);

    const messageHtml =
      parsed.data.channel === "email"
        ? buildCorporateEmailHtml({
            message: parsed.data.message,
            subject,
            companyName,
            textType: parsed.data.textType,
          })
        : undefined;

    await sendViaMake({
      channel: parsed.data.channel,
      recipient,
      subject,
      message:
        parsed.data.channel === "email" ? plainBody : parsed.data.message,
      messageHtml,
      textType: parsed.data.textType,
      tone: parsed.data.tone,
      companyName,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao enviar via Make.";
    console.error("[send]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
