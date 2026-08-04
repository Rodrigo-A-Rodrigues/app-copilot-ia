import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("generations")
      .select("id, text_type, tone, topics, result, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ generations: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao listar gerações.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
