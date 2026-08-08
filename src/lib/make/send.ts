export type MakeSendPayload = {
  channel: "email" | "whatsapp";
  recipient: string;
  subject?: string;
  message: string;
  /** Corpo HTML para módulos de e-mail do Make (Content-Type: HTML). */
  messageHtml?: string;
  textType: string;
  tone: string;
  companyName: string;
};

export function getMakeWebhookUrl(): string | undefined {
  return process.env.MAKE_WEBHOOK_SEND_URL?.trim() || undefined;
}

/**
 * Envia payload ao Custom Webhook do Make.
 * Se o webhook tiver API Key Authentication, use MAKE_WEBHOOK_SECRET
 * com o valor da API key gerada no Make — enviada no header `x-make-apikey`.
 * @see https://www.make.com/en/help/tools/webhooks
 */
export async function sendViaMake(payload: MakeSendPayload): Promise<void> {
  const webhookUrl = getMakeWebhookUrl();

  if (!webhookUrl) {
    throw new Error(
      "MAKE_WEBHOOK_SEND_URL não configurada. Crie um Webhook no Make e cole a URL no .env.",
    );
  }

  const apiKey = process.env.MAKE_WEBHOOK_SECRET?.trim();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["x-make-apikey"] = apiKey;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const hint =
      response.status === 401
        ? " Verifique se a API Key do webhook (Advanced settings) está em MAKE_WEBHOOK_SECRET, ou desative a autenticação no Make."
        : "";

    throw new Error(
      body
        ? `Make retornou HTTP ${response.status}: ${body.slice(0, 200)}.${hint}`
        : `Make retornou HTTP ${response.status}.${hint}`,
    );
  }
}
