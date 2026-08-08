"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/lib/validations/auth";

type AuthFormProps = {
  mode: "signin" | "signup";
  nextPath?: string;
};

export function AuthForm({ mode, nextPath = "/dashboard" }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      password: "",
    },
  });

  async function onSignIn(values: SignInValues) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Login realizado com sucesso.");
    router.push(nextPath);
    router.refresh();
  }

  async function onSignUp(values: SignUpValues) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          company_name: values.companyName || "Nossa Empresa",
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.session) {
      toast.success("Conta criada com sucesso.");
      router.push(nextPath);
      router.refresh();
      return;
    }

    toast.success(
      "Conta criada. Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada.",
    );
  }

  if (mode === "signin") {
    return (
      <form
        className="space-y-5"
        onSubmit={signInForm.handleSubmit(onSignIn)}
        noValidate
      >
        <FieldGroup>
          <Controller
            name="email"
            control={signInForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signin-email">E-mail</FieldLabel>
                <Input
                  {...field}
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={signInForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signin-password">Senha</FieldLabel>
                <Input
                  {...field}
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={signUpForm.handleSubmit(onSignUp)}
      noValidate
    >
      <FieldGroup>
        <Controller
          name="fullName"
          control={signUpForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-name">Nome completo</FieldLabel>
              <Input
                {...field}
                id="signup-name"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="companyName"
          control={signUpForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-company">Empresa</FieldLabel>
              <Input
                {...field}
                id="signup-company"
                placeholder="Nossa Empresa"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={signUpForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-email">E-mail</FieldLabel>
              <Input
                {...field}
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="voce@empresa.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={signUpForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-password">Senha</FieldLabel>
              <Input
                {...field}
                id="signup-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/signin"
          className="font-medium text-primary hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
