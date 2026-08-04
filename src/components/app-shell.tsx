"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Sparkles,
  UserRound,
} from "lucide-react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "Assistente", icon: Sparkles },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

type AppShellProps = {
  children: React.ReactNode;
  fullName?: string | null;
};

export function AppShell({ children, fullName }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLogoutOpen(false);
    setSigningOut(false);
    router.push("/signin");
    router.refresh();
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="font-display text-xl tracking-tight text-primary transition-opacity hover:opacity-80"
            >
              Copilot RH
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {links.map((link) => {
                const active = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">
                {fullName || "Colaborador"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">RH / Comunicação</p>
            </div>
            <ConfirmDialog
              open={logoutOpen}
              onOpenChange={setLogoutOpen}
              title="Sair da conta?"
              description="Você precisará entrar novamente para usar o assistente e o histórico."
              confirmLabel="Sair"
              variant="destructive"
              loading={signingOut}
              onConfirm={handleSignOut}
              trigger={
                <Button variant="outline" size="icon" aria-label="Sair">
                  <LogOut />
                </Button>
              }
            />
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-border/80 px-4 py-2 sm:hidden">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
