"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendSchema, type SendValues } from "@/lib/validations/send";
import type { TextType, Tone } from "@/types/domain";

type SendViaMakeFormProps = {
  message: string;
  textType: TextType;
  tone: Tone;
};

export function SendViaMakeForm({
  message,
  textType,
  tone,
}: SendViaMakeFormProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState<SendValues | null>(null);

  const form = useForm<SendValues>({
    resolver: zodResolver(sendSchema),
    defaultValues: {
      channel: textType === "whatsapp" ? "whatsapp" : "email",
      recipient: "",
      subject: "",
      message,
      textType,
      tone,
    },
  });

  useEffect(() => {
    form.setValue("message", message);
    form.setValue("textType", textType);
    form.setValue("tone", tone);
    if (textType === "whatsapp") {
      form.setValue("channel", "whatsapp");
    }
  }, [form, message, textType, tone]);

  function handleRequestSend(values: SendValues) {
    setPending(values);
    setConfirmOpen(true);
  }

  async function handleConfirmSend() {
    if (!pending) return;
    setSending(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error ?? "Falha ao enviar via Make.");
        return;
      }

      setConfirmOpen(false);
      setPending(null);
      toast.success(
        pending.channel === "email"
          ? "Envio acionado no Make (e-mail)."
          : "Envio acionado no Make (WhatsApp).",
      );
    } catch {
      toast.error("Falha de rede ao chamar o Make.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <form
        className="space-y-4 rounded-lg border border-border bg-muted/30 p-4"
        onSubmit={form.handleSubmit(handleRequestSend)}
        noValidate
      >
        <div>
          <p className="text-sm font-medium">Enviar via Make</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Dispara o scenario do Make.com com a mensagem aprovada.
          </p>
        </div>

        <FieldGroup>
          <Controller
            name="channel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Canal</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="recipient"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="send-recipient">Destinatário</FieldLabel>
                <Input
                  {...field}
                  id="send-recipient"
                  placeholder="e-mail ou 5511999999999"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  E-mail válido ou WhatsApp com DDI (conforme o canal).
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="subject"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="send-subject">
                  Assunto (e-mail)
                </FieldLabel>
                <Input
                  {...field}
                  id="send-subject"
                  placeholder="Comunicado interno"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="w-full sm:w-auto">
          <Send />
          Enviar pelo Make
        </Button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirmar envio pelo Make?"
        description={
          pending
            ? `A mensagem será enviada por ${pending.channel === "email" ? "e-mail" : "WhatsApp"} para ${pending.recipient}.`
            : "Confirme o envio da mensagem gerada."
        }
        confirmLabel="Enviar"
        loading={sending}
        onConfirm={handleConfirmSend}
      />
    </>
  );
}
