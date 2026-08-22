type WhatsAppPayload = {
  leadId: string;
  agentPhone: string;
  propertyTitle: string;
  clientName: string;
  clientPhone: string;
  message: string;
};

export async function notifyAgentWhatsApp(payload: WhatsAppPayload) {
  const textMessage =
    `*Novo lead recebido*\n\n` +
    `*Imóvel:* ${payload.propertyTitle}\n` +
    `*Cliente:* ${payload.clientName}\n` +
    `*Telefone:* ${payload.clientPhone}\n` +
    `*Mensagem:* ${payload.message}\n\n` +
    `Responda a partir do painel ou por este número.`;

  const url = process.env.WHATSAPP_API_URL;
  const key = process.env.WHATSAPP_API_KEY;

  if (!url || !key) {
    console.info("[whatsapp:dry-run]", { leadId: payload.leadId });
    return { sent: false, reason: "not_configured" as const };
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      number: payload.agentPhone,
      text: textMessage,
    }),
  });

  if (!response.ok) {
    console.error("[whatsapp:error]", payload.leadId, response.status);
    return { sent: false, reason: "provider_error" as const };
  }

  return { sent: true as const };
}
