import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles, Workflow } from "lucide-react";

import { MakeFlowDiagram } from "@/components/make-flow-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEFAULT_MAKE_SCENARIO_URL =
  "https://us2.make.com/public/shared-scenario/Wf78qMSexUS/integration-webhooks";

export default function MakePage() {
  const scenarioUrl =
    process.env.NEXT_PUBLIC_MAKE_SCENARIO_URL?.trim() ||
    DEFAULT_MAKE_SCENARIO_URL;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Make.com</Badge>
            <Badge variant="outline">Integração ativa</Badge>
          </div>
          <h1 className="font-display text-3xl tracking-tight text-foreground">
            Make / canais
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Visualize o fluxo de automação usado para entregar as mensagens
            geradas pelo assistente. O Make bloqueia iframe, então o scenario
            real abre em nova aba.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft />
              Voltar
            </Link>
          </Button>
          <Button asChild>
            <a href={scenarioUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Abrir no Make
            </a>
          </Button>
        </div>
      </section>

      <Card className="bg-card/90 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Workflow className="size-4 text-primary" />
            <CardTitle className="font-display text-xl">
              Diagrama do fluxo
            </CardTitle>
          </div>
          <CardDescription>
            Representação do scenario de envio no app — webhook, roteamento e
            canais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MakeFlowDiagram />
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Como funciona no app</CardTitle>
            <CardDescription>
              Passos do colaborador até o disparo do webhook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">1.</span> Gere a
                mensagem no assistente (tipo, tom e tópicos).
              </li>
              <li>
                <span className="font-medium text-foreground">2.</span> Revise o
                texto e escolha canal + destinatário.
              </li>
              <li>
                <span className="font-medium text-foreground">3.</span> Confirme
                o envio — o app chama{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  /api/send
                </code>
                .
              </li>
              <li>
                <span className="font-medium text-foreground">4.</span> O Make
                recebe o payload e dispara e-mail ou WhatsApp.
              </li>
            </ol>
            <Button asChild className="mt-5" variant="outline">
              <Link href="/assistant">
                <Sparkles />
                Ir ao assistente
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Scenario público</CardTitle>
            <CardDescription>
              Link compartilhado do Make para visualização do fluxo real.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="break-all rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              {scenarioUrl}
            </p>
            <Button asChild className="w-full sm:w-auto">
              <a href={scenarioUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Abrir scenario no Make
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
