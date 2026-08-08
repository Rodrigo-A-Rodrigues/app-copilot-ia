"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Sparkles } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SendViaMakeForm } from "@/components/send-via-make-form";
import {
  generateSchema,
  type GenerateValues,
} from "@/lib/validations/assistant";
import {
  TEXT_TYPE_LABELS,
  TEXT_TYPES,
  TONE_LABELS,
  TONES,
  type TextType,
  type Tone,
} from "@/types/domain";

export function AssistantForm() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastMeta, setLastMeta] = useState<{
    textType: TextType;
    tone: Tone;
  }>({ textType: "email", tone: "formal" });

  const form = useForm<GenerateValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      textType: "email",
      tone: "formal",
      topics: "",
    },
  });

  async function onSubmit(values: GenerateValues) {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        result?: string;
        error?: string;
      };

      if (!response.ok || !data.result) {
        toast.error(data.error ?? "Não foi possível gerar o texto.");
        return;
      }

      setResult(data.result);
      setLastMeta({ textType: values.textType, tone: values.tone });
      toast.success("Mensagem gerada. Revise antes de usar.");
    } catch {
      toast.error("Falha de rede ao gerar o texto.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success("Texto copiado.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Novo texto corporativo
          </CardTitle>
          <CardDescription>
            Informe tipo, tom e tópicos. A IA redige a mensagem com a identidade
            da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="textType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tipo de texto</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEXT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {TEXT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="tone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tom de voz</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {TONE_LABELS[tone]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="topics"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="assistant-topics">
                      Tópicos / contexto
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="assistant-topics"
                      rows={8}
                      placeholder="Ex.: lembrar colaboradores sobre o prazo de avaliação de desempenho até sexta; reforçar o canal de dúvidas do RH."
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Quanto mais claros os pontos, melhor o resultado.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Sparkles />
              {loading ? "Gerando..." : "Gerar mensagem"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card/90 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-display text-2xl">Resultado</CardTitle>
              <CardDescription className="mt-1.5">
                Revise o texto antes de enviar pelos canais oficiais.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              disabled={!result}
            >
              <Copy />
              Copiar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <>
              <pre className="min-h-56 whitespace-pre-wrap rounded-lg bg-primary/5 p-4 text-sm leading-relaxed text-foreground ring-1 ring-primary/10">
                {result}
              </pre>
              <SendViaMakeForm
                message={result}
                textType={lastMeta.textType}
                tone={lastMeta.tone}
              />
            </>
          ) : (
            <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 text-center">
              <p className="max-w-sm text-sm text-muted-foreground">
                O texto gerado aparecerá aqui para revisão. Use tipo, tom e
                tópicos à esquerda para começar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
