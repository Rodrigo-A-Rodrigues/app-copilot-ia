import { AssistantForm } from "@/components/assistant-form";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl tracking-tight text-foreground">
          Assistente
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Núcleo do desafio: a partir de inputs simples, gere mensagens
          corporativas coerentes com a identidade da empresa.
        </p>
      </section>
      <AssistantForm />
    </div>
  );
}
