import {
  ArrowDown,
  ArrowRight,
  Mail,
  MessageCircle,
  Split,
  Webhook,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FlowNodeProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

function FlowNode({ title, description, icon, className }: FlowNodeProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function ConnectorVertical() {
  return (
    <div className="flex justify-center py-1 text-primary/70" aria-hidden>
      <ArrowDown className="size-5" />
    </div>
  );
}

function ConnectorHorizontal() {
  return (
    <div
      className="hidden items-center px-1 text-primary/70 lg:flex"
      aria-hidden
    >
      <ArrowRight className="size-5" />
    </div>
  );
}

export function MakeFlowDiagram() {
  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Scenario Make</Badge>
        <span className="text-xs text-muted-foreground">
          Fluxo de entrega após aprovação no assistente
        </span>
      </div>

      <div className="flex flex-col">
        <FlowNode
          title="1. Custom Webhook"
          description="Recebe o JSON do Copilot RH (canal, destinatário, assunto e mensagem)."
          icon={<Webhook className="size-5" />}
        />

        <ConnectorVertical />

        <FlowNode
          title="2. Router"
          description="Encaminha conforme o campo channel: email ou whatsapp."
          icon={<Split className="size-5" />}
        />

        <ConnectorVertical />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          <FlowNode
            title="3a. E-mail"
            description="Quando channel = email, envia para o recipient com subject e message."
            icon={<Mail className="size-5" />}
          />
          <ConnectorHorizontal />
          <div
            className="flex justify-center text-primary/70 lg:hidden"
            aria-hidden
          >
            <ArrowDown className="size-5" />
          </div>
          <FlowNode
            title="3b. WhatsApp"
            description="Quando channel = whatsapp, envia a message para o número informado."
            icon={<MessageCircle className="size-5" />}
          />
        </div>
      </div>
    </div>
  );
}
