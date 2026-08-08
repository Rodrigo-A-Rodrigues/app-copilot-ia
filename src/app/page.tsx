import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Mail,
  Megaphone,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Webhook,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "E-mails corporativos",
    description:
      "Assunto e corpo com tom do RH, prontos para envio em HTML formatado.",
    icon: Mail,
  },
  {
    title: "WhatsApp interno",
    description: "Mensagens curtas, claras e adequadas ao canal corporativo.",
    icon: MessageCircle,
  },
  {
    title: "Avisos institucionais",
    description: "Comunicados oficiais com identidade da empresa.",
    icon: Megaphone,
  },
  {
    title: "Resumos de reunião",
    description: "Pontos principais e próximos passos a partir de tópicos.",
    icon: NotebookPen,
  },
];

const flowSteps = [
  {
    step: "01",
    title: "Inputs simples",
    description: "Tipo de texto, tópicos e tom de voz no assistente.",
  },
  {
    step: "02",
    title: "Geração com Gemini",
    description:
      "Prompt engineering com persona de RH e diretrizes da empresa.",
  },
  {
    step: "03",
    title: "Revisão humana",
    description: "O colaborador edita, copia ou aprova antes de enviar.",
  },
  {
    step: "04",
    title: "Make entrega",
    description: "Webhook dispara e-mail HTML ou WhatsApp automaticamente.",
  },
];

const stack = [
  { label: "Next.js", role: "App e APIs" },
  { label: "Supabase", role: "Auth e histórico" },
  { label: "Gemini", role: "LLM / geração" },
  { label: "Make.com", role: "Orquestração" },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <header className="absolute inset-x-0 top-0 z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-display text-2xl tracking-tight text-primary animate-[fade-up_0.7s_ease-out]">
          Copilot RH
        </span>
        <div className="flex items-center gap-2 animate-[fade-up_0.7s_ease-out_0.08s_both]">
          <Button asChild variant="ghost">
            <Link href="/signin">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Começar</Link>
          </Button>
        </div>
      </header>

      {/* Hero — altura proporcional ao conteúdo */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,#b7e0d2_0%,transparent_45%),radial-gradient(ellipse_at_90%_80%,#d9efe7_0%,transparent_40%),linear-gradient(160deg,#f4f7f6_0%,#e8f3ee_48%,#dceee6_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(15,107,86,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,107,86,0.08)_1px,transparent_1px)] [background-size:48px_48px] animate-[grid-drift_28s_linear_infinite]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl animate-[pulse-soft_6s_ease-in-out_infinite] sm:h-72 sm:w-72"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
          <p className="font-display text-4xl tracking-tight text-primary sm:text-6xl animate-[fade-up_0.8s_ease-out]">
            Copilot RH
          </p>
          <h1 className="mt-4 max-w-3xl text-xl font-medium leading-snug tracking-tight text-foreground sm:text-2xl animate-[fade-up_0.8s_ease-out_0.1s_both]">
            Menos tempo redigindo. Mais comunicação assertiva no RH.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground animate-[fade-up_0.8s_ease-out_0.18s_both]">
            Transforme tópicos, tipo de texto e tom de voz em mensagens
            corporativas prontas — com identidade da empresa e envio via Make.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 animate-[fade-up_0.8s_ease-out_0.26s_both]">
            <Button asChild size="lg">
              <Link href="/signup">
                Começar agora
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      <main>
        <div className="bg-[#111111] px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                Empresa idealizadora
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
                Projeto acadêmico idealizado pelo Centro Universitário UniFECAF.
              </p>
            </div>
            <a
              href="https://www.unifecaf.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Site oficial da UniFECAF"
            >
              <Image
                src="/unifecaf-logo.png"
                alt="Logo UniFECAF"
                width={180}
                height={52}
                className="h-10 w-auto sm:h-12"
                priority={false}
              />
            </a>
          </div>
        </div>
        {/* Objetivo / problema */}
        <section className="border-t border-border/70 bg-background px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
                O objetivo
              </p>
              <h2 className="font-display mt-3 text-3xl tracking-tight text-foreground sm:text-4xl">
                Aliviar a sobrecarga de comunicação repetitiva no RH
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                E-mails, avisos, WhatsApp corporativo e resumos consomem horas
                do time. O Copilot RH usa IA generativa com prompt engineering
                para gerar textos coerentes, bem escritos e alinhados à
                identidade organizacional — a partir de inputs simples.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Menos retrabalho em textos do dia a dia",
                "Tom e identidade consistentes da empresa",
                "Revisão humana antes de qualquer envio",
                "Entrega automatizada por e-mail ou WhatsApp",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="border-t border-border/70 bg-brand-soft/40 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
              Funcionalidades
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl tracking-tight text-foreground sm:text-4xl">
              Tudo o que o assistente gera a partir de poucos inputs
            </h2>
            <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section
          id="como-funciona"
          className="scroll-mt-20 border-t border-border/70 bg-background px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
              Como funciona
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl tracking-tight text-foreground sm:text-4xl">
              Do input à entrega, em quatro etapas
            </h2>
            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {flowSteps.map((item, index) => (
                <li
                  key={item.step}
                  className="relative animate-[fade-up_0.7s_ease-out_both]"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <p className="font-display text-4xl text-primary/25">
                    {item.step}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Orquestração */}
        <section className="border-t border-border/70 bg-foreground px-4 py-20 text-background sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand-soft">
              Orquestração
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl tracking-tight sm:text-4xl">
              Gemini gera. Make entrega.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-background/75">
              A geração fica no app com prompt engineering e identidade da
              empresa. A orquestração low-code — alinhada ao desafio — usa
              Make.com para encaminhar a mensagem aprovada pelos canais
              oficiais.
            </p>

            <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-stretch">
              <div className="flex-1 rounded-xl border border-background/15 bg-background/5 p-5">
                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft/20 text-brand-soft">
                  <Bot className="size-5" />
                </div>
                <h3 className="text-lg font-medium">Assistente + Gemini</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/70">
                  System prompt de RH, tipo de texto, tom e diretrizes do perfil
                  geram o rascunho corporativo.
                </p>
              </div>
              <div className="hidden items-center justify-center text-brand-soft/80 lg:flex">
                <ArrowRight className="size-6" />
              </div>
              <div className="flex-1 rounded-xl border border-background/15 bg-background/5 p-5">
                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft/20 text-brand-soft">
                  <Webhook className="size-5" />
                </div>
                <h3 className="text-lg font-medium">Webhook Make</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/70">
                  Após aprovação, o app envia canal, destinatário, assunto e
                  HTML formatado para o scenario.
                </p>
              </div>
              <div className="hidden items-center justify-center text-brand-soft/80 lg:flex">
                <ArrowRight className="size-6" />
              </div>
              <div className="flex-1 rounded-xl border border-background/15 bg-background/5 p-5">
                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft/20 text-brand-soft">
                  <Workflow className="size-5" />
                </div>
                <h3 className="text-lg font-medium">E-mail ou WhatsApp</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/70">
                  O Router do Make escolhe o canal e dispara a mensagem sem
                  programação complexa na orquestração.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {stack.map((item) => (
                <div
                  key={item.label}
                  className="rounded-full border border-background/20 px-4 py-2 text-sm"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-background/60"> · {item.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Identidade */}
        <section className="border-t border-border/70 bg-background px-4 py-20 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </div>
              <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
                Identidade organizacional no prompt
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Nome da empresa e diretrizes de tom ficam no perfil (Supabase) e
                alimentam cada geração — para o texto soar da sua organização,
                não genérico.
              </p>
            </div>
            <Button asChild size="lg" variant="outline">
              <a
                href="https://us2.make.com/public/shared-scenario/Wf78qMSexUS/integration-webhooks"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Workflow />
                Ver scenario no Make
              </a>
            </Button>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-border/70 bg-brand-soft/50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl text-center">
            <Sparkles className="mx-auto size-8 text-primary" />
            <h2 className="font-display mt-4 text-3xl tracking-tight text-foreground sm:text-4xl">
              Pronto para acelerar a comunicação do RH?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Crie sua conta, configure a identidade da empresa e gere a
              primeira mensagem em minutos.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/signup">
                  Criar conta
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signin">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="border-t border-border/70 px-4 py-8 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span className="font-display text-base text-primary">
              Copilot RH
            </span>
            <p>Comunicação interna com IA · Gemini · Make · Supabase</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
