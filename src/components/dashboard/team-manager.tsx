"use client";

import { useActionState } from "react";
import { addTeamMember, removeTeamMember } from "@/lib/actions/team";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "AGENT";
  _count: { properties: number; leads: number };
};

export function TeamManager({
  members,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  const [state, action, pending] = useActionState(addTeamMember, undefined);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden  border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper font-mono text-[11px] uppercase tracking-wider text-slate">
            <tr>
              <th className="px-4 py-3">Corretor</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Carteira</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-ink/10">
                <td className="px-4 py-3">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-xs text-slate">{member.email}</p>
                </td>
                <td className="px-4 py-3">{member.role === "ADMIN" ? "Gestão" : "Corretor"}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {member._count.properties} imóveis · {member._count.leads} leads
                </td>
                <td className="px-4 py-3 text-right">
                  {member.id !== currentUserId ? (
                    <form action={removeTeamMember}>
                      <input type="hidden" name="userId" value={member.id} />
                      <button className="text-xs font-semibold text-lead">Remover</button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form action={action} className=" border border-ink/10 bg-white p-5">
        <h2 className="font-display text-xl font-semibold">Convidar para o terreno</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Nome">
            <Input name="name" required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Telefone">
            <Input name="phone" required />
          </Field>
          <Field label="Palavra-passe inicial">
            <Input name="password" type="password" required minLength={8} />
          </Field>
          <Field label="Cargo">
            <Select name="role" defaultValue="AGENT">
              <option value="AGENT">Corretor</option>
              <option value="ADMIN">Gestão</option>
            </Select>
          </Field>
          {state?.error ? <p className="text-sm text-lead">{state.error}</p> : null}
          {state && "ok" in state ? (
            <p className="text-sm text-field">Corretor adicionado à equipa.</p>
          ) : null}
          <Button type="submit" disabled={pending}>
            Adicionar
          </Button>
        </div>
      </form>
    </div>
  );
}
