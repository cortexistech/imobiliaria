"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

export function LeadForm({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        clientName: form.get("clientName"),
        clientPhone: form.get("clientPhone"),
        message: form.get("message"),
        website: String(form.get("website") ?? ""),
      }),
    });
    if (!response.ok) {
      const json = (await response.json()) as { error?: string };
      setError(json.error || "Não foi possível enviar o pedido.");
      setStatus("error");
      return;
    }
    setStatus("ok");
    event.currentTarget.reset();
  }

  if (status === "ok") {
    return (
      <div className=" border border-field/30 bg-field/5 p-5">
        <p className="font-display text-lg font-semibold">Pedido enviado</p>
        <p className="mt-1 text-sm text-slate">
          O corretor responsável por {propertyTitle} recebe o alerta no WhatsApp
          e entra em contacto consigo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-3 border border-ink/10 bg-white p-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate">
          Interesse
        </p>
        <h2 className="font-display text-xl font-semibold">Falar com o corretor</h2>
      </div>
      <Field label="Nome">
        <Input name="clientName" required placeholder="O seu nome" />
      </Field>
      <Field label="Telefone / WhatsApp">
        <Input name="clientPhone" required placeholder="3519..." />
      </Field>
      <Field label="Mensagem">
        <Textarea
          name="message"
          required
          defaultValue={`Olá, tenho interesse em ${propertyTitle}.`}
        />
      </Field>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error ? <p className="text-sm text-lead">{error}</p> : null}
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "A enviar…" : "Enviar para o WhatsApp do corretor"}
      </Button>
    </form>
  );
}
