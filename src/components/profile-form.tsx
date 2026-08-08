"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";
import type { Profile } from "@/types/domain";

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingValues, setPendingValues] = useState<ProfileValues | null>(
    null,
  );

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.full_name ?? "",
      companyName: profile.company_name ?? "",
      toneGuidelines: profile.tone_guidelines ?? "",
    },
  });

  function handleRequestSave(values: ProfileValues) {
    setPendingValues(values);
    setConfirmOpen(true);
  }

  async function handleConfirmSave() {
    if (!pendingValues) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: pendingValues.fullName.trim(),
        company_name: pendingValues.companyName.trim() || "Nossa Empresa",
        tone_guidelines: pendingValues.toneGuidelines?.trim() || null,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setConfirmOpen(false);
    setPendingValues(null);
    toast.success(
      "Perfil atualizado. As próximas gerações usarão essa identidade.",
    );
  }

  return (
    <>
      <Card className="max-w-xl bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Identidade organizacional
          </CardTitle>
          <CardDescription>
            Esses dados alimentam o system prompt das mensagens geradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(handleRequestSave)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-name">Nome</FieldLabel>
                    <Input
                      {...field}
                      id="profile-name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-company">Empresa</FieldLabel>
                    <Input
                      {...field}
                      id="profile-company"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="toneGuidelines"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-tone">
                      Diretrizes de tom
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="profile-tone"
                      rows={5}
                      placeholder="Ex.: tom humano e direto; evitar gírias; sempre fechar oferecendo canal de dúvidas do RH."
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Influencia o estilo das próximas gerações do assistente.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type="submit">Salvar alterações</Button>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Salvar alterações do perfil?"
        description="As próximas mensagens geradas usarão a empresa e as diretrizes de tom informadas."
        confirmLabel="Salvar"
        loading={saving}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}
