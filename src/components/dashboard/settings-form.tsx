"use client";

import { useActionState } from "react";
import { updateTenantSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function SettingsForm({
  tenant,
}: {
  tenant: {
    name: string;
    phone: string | null;
    brandColor: string;
    logoUrl: string | null;
  };
}) {
  const [state, action, pending] = useActionState(updateTenantSettings, undefined);

  return (
    <form action={action} className="grid max-w-xl gap-4">
      <Field label="Nome da imobiliária">
        <Input name="name" defaultValue={tenant.name} required />
      </Field>
      <Field label="Telefone">
        <Input name="phone" defaultValue={tenant.phone ?? ""} />
      </Field>
      <Field label="Cor da marca">
        <Input name="brandColor" type="color" defaultValue={tenant.brandColor} />
      </Field>
      <Field label="URL do logótipo">
        <Input name="logoUrl" defaultValue={tenant.logoUrl ?? ""} />
      </Field>
      {state?.error ? <p className="text-sm text-lead">{state.error}</p> : null}
      {state && "ok" in state ? (
        <p className="text-sm text-field">Dados actualizados.</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        Guardar
      </Button>
    </form>
  );
}
