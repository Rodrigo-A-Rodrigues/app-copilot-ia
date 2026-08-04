import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "E-mails corporativos",
    description: "Assunto e corpo alinhados ao tom do RH.",
    icon: Mail,
  },
  {
    title: "WhatsApp interno",
    description: "Mensagens curtas, claras e prontas para enviar.",
    icon: MessageCircle,
  },
  {
    title: "Avisos e resumos",
    description: "Comunicados institucionais e atas em poucos inputs.",
    icon: Megaphone,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-display text-2xl tracking-tight text-primary">
          Copilot RH
        </span>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/signin">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Começar</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-14 px-4 py-16 sm:px-6">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">
            Comunicação interna com IA
          </p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Copilot RH
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Gere e-mails, mensagens de WhatsApp, avisos institucionais e resumos
            de reunião a partir de tópicos, tipo de texto e tom de voz — com a
            identidade da sua empresa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/signup">
                Criar conta
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/assistant">Ir ao assistente</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-card/80 shadow-sm">
                <CardHeader>
                  <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
