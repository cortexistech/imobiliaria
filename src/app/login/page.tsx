"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { APP_NAME } from "@/lib/constants";
import { FolioFrame, Logo, TapeBar } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <main className="flow-grid grid min-h-full place-items-center px-4 py-16">
      <FolioFrame className="surface w-full max-w-md">
        <TapeBar />
        <form action={action} className="p-8">
          <Link href="/">
            <Logo caption="acesso da equipa" name={APP_NAME} />
          </Link>
          <h1 className="mt-8 font-display text-3xl font-extrabold">Entrar no painel</h1>
          <p className="mt-2 text-sm text-slate">
            Gestão e corretores acedem aqui. O cargo define o que cada um vê.
          </p>
          <div className="mt-6 grid gap-4">
            <Field label="Email">
              <Input name="email" type="email" required placeholder="maria@atlantica.pt" />
            </Field>
            <Field label="Palavra-passe">
              <Input name="password" type="password" required minLength={6} />
            </Field>
            {state?.error ? <p className="text-sm text-lead">{state.error}</p> : null}
            <Button type="submit" disabled={pending}>
              {pending ? "A autenticar…" : "Entrar"}
            </Button>
          </div>
          {process.env.NODE_ENV !== "production" ? (
          <p className="mt-6 bg-paper p-3 font-mono text-[11px] leading-5 text-slate">
            Demo local · maria@atlantica.pt / demo1234
            <br />
            Corretor · joao@atlantica.pt / demo1234
          </p>
          ) : null}
        </form>
      </FolioFrame>
    </main>
  );
}
