import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl tracking-tight">Criar conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure sua identidade organizacional e comece a gerar textos.
        </p>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
