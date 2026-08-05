export type MakeSendPayload = {
  channel: "email" | "whatsapp";
  recipient: string;
  subject?: string;
  message: string;
  textType: string;
  tone: string;
  companyName: string;
};

export function getMakeWebhookUrl(): string | undefined {
  return process.env.MAKE_WEBHOOK_SEND_URL?.trim() || undefined;
}

export async function sendViaMake(payload: MakeSendPayload): Promise<void> {
  const webhookUrl = getMakeWebhookUrl();

  if (!webhookUrl) {
    throw new Error(
      "MAKE_WEBHOOK_SEND_URL não configurada. Crie um Webhook no Make e cole a URL no .env.",
    );
  }

  const secret = process.env.MAKE_WEBHOOK_SECRET?.trim();

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      ...(secret ? { secret } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      body
        ? `Make retornou HTTP ${response.status}: ${body.slice(0, 200)}`
        : `Make retornou HTTP ${response.status}.`,
    );
  }
}
