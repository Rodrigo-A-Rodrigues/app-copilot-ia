import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, company_name, tone_guidelines, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const safeProfile: Profile = profile ?? {
    id: user.id,
    full_name: "",
    company_name: "Nossa Empresa",
    tone_guidelines: null,
    created_at: new Date().toISOString(),
  };

  if (!profile) {
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: "",
      company_name: "Nossa Empresa",
    });
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl tracking-tight text-foreground">
          Perfil
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Esses dados alimentam o system prompt e a identidade organizacional
          das mensagens geradas.
        </p>
      </section>
      <ProfileForm profile={safeProfile} />
    </div>
  );
}
