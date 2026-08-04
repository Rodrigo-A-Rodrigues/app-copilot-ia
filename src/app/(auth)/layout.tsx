import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="font-display text-3xl tracking-tight text-primary transition-opacity hover:opacity-80"
        >
          Copilot RH
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          Assistente de comunicação interna para o RH
        </p>
      </div>
      <Card className="w-full max-w-md bg-card/95 shadow-sm">
        <CardHeader className="sr-only">
          <CardTitle>Autenticação</CardTitle>
          <CardDescription>Acesso ao Copilot RH</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
    </div>
  );
}
