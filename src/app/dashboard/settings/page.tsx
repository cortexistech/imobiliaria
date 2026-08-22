import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata = { title: "A imobiliária" };

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: admin.tenantId },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
        Identidade
      </p>
      <h1 className="mb-8 font-display text-4xl font-semibold">A imobiliária</h1>
      <SettingsForm tenant={tenant} />
    </div>
  );
}
