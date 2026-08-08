import { parseGeneratedMessage } from "@/lib/email/parse-message";
import type { TextType } from "@/types/domain";

type BuildEmailHtmlInput = {
  message: string;
  subject: string;
  companyName: string;
  textType: TextType;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function textToHtmlBlocks(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  return normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const withBreaks = escapeHtml(block).replaceAll("\n", "<br />");
      const isHeading =
        block === block.toUpperCase() &&
        block.length < 80 &&
        !block.includes(".");

      if (isHeading) {
        return `<h2 style="margin:0 0 16px;font-size:18px;line-height:1.35;color:#0b5342;font-weight:700;">${withBreaks}</h2>`;
      }

      return `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#1f2937;">${withBreaks}</p>`;
    })
    .join("");
}

function eyebrowForType(textType: TextType): string {
  switch (textType) {
    case "email":
      return "Comunicado interno";
    case "notice":
      return "Aviso institucional";
    case "meeting_summary":
      return "Resumo de reunião";
    case "whatsapp":
      return "Mensagem corporativa";
    default:
      return "Comunicado";
  }
}

/**
 * Template HTML responsivo para envio via Make (corpo HTML do e-mail).
 */
export function buildCorporateEmailHtml(input: BuildEmailHtmlInput): string {
  const { subjectFromBody, body } = parseGeneratedMessage(input.message);
  const subject = input.subject || subjectFromBody || "Comunicado interno";
  const company = input.companyName.trim() || "Nossa Empresa";
  const contentHtml = textToHtmlBlocks(body);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#eef4f1;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4f1;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d5e0db;">
          <tr>
            <td style="background:linear-gradient(135deg,#0f6b56,#0b5342);padding:22px 28px;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#d9efe7;">
                ${escapeHtml(eyebrowForType(input.textType))}
              </p>
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">
                ${escapeHtml(company)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 18px;font-size:13px;color:#5c6b64;">
                <strong style="color:#0b5342;">Assunto:</strong> ${escapeHtml(subject)}
              </p>
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f4f7f6;border-top:1px solid #d5e0db;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#5c6b64;">
                Mensagem gerada pelo Copilot RH · ${escapeHtml(company)} · ${year}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function resolveEmailSubject(
  explicitSubject: string | undefined,
  message: string,
  companyName: string,
): string {
  const trimmed = explicitSubject?.trim();
  if (trimmed) return trimmed;

  const { subjectFromBody } = parseGeneratedMessage(message);
  if (subjectFromBody) return subjectFromBody;

  return `Comunicado — ${companyName.trim() || "Nossa Empresa"}`;
}
