import Link from "next/link";
import { ArrowRight, Clock3, Sparkles, UserRound, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  TEXT_TYPE_LABELS,
  TONE_LABELS,
  type TextType,
  type Tone,
} from "@/types/domain";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: generations } = await supabase
    .from("generations")
    .select("id, text_type, tone, topics, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Atalhos do copiloto de comunicação interna. Gere textos com LLM e
            acompanhe o histórico recente.
          </p>
        </div>
        <Button asChild>
          <Link href="/assistant">
            <Sparkles />
            Abrir assistente
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/90 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>Assistente</CardTitle>
            <CardDescription>
              Gere e-mail, WhatsApp, aviso ou resumo a partir de tópicos e tom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/assistant">
                Começar
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound className="size-5" />
            </div>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Ajuste empresa e diretrizes de tom usadas no prompt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/perfil">
                Editar perfil
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-card/70 shadow-none">
          <CardHeader>
            <div className="mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Workflow className="size-5" />
            </div>
            <CardTitle>N8N / canais</CardTitle>
            <CardDescription>
              Envio por e-mail/WhatsApp e triagem de caixa entram na fase 2.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Em breve</Badge>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-card/90 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-primary" />
            <CardTitle className="font-display text-xl">
              Últimas gerações
            </CardTitle>
          </div>
          <CardDescription>
            Histórico recente salvo no Supabase para revisão rápida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!generations?.length ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma geração ainda.
              </p>
              <Button asChild className="mt-4">
                <Link href="/assistant">Criar a primeira</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {generations.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {TEXT_TYPE_LABELS[item.text_type as TextType] ??
                          item.text_type}
                      </Badge>
                      <Badge variant="outline">
                        {TONE_LABELS[item.tone as Tone] ?? item.tone}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {item.topics}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString("pt-BR")}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
