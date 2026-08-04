import { AuthForm } from "@/components/auth-form";

type SignInPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl tracking-tight">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesse o assistente de comunicação interna.
        </p>
      </div>
      {params.error === "auth" && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Não foi possível confirmar o login. Tente entrar novamente.
        </p>
      )}
      <AuthForm mode="signin" nextPath={params.next || "/dashboard"} />
    </div>
  );
}
