/**
 * Extrai assunto embutido no texto gerado (ex.: "Assunto: ...")
 * e devolve corpo limpo para o template HTML.
 */
export function parseGeneratedMessage(raw: string): {
  subjectFromBody: string | null;
  body: string;
} {
  const text = raw.replace(/\r\n/g, "\n").trim();
  const subjectMatch = text.match(/^Assunto:\s*(.+)\s*\n+/i);

  if (!subjectMatch) {
    return { subjectFromBody: null, body: text };
  }

  const subjectFromBody = subjectMatch[1]?.trim() || null;
  const body = text.slice(subjectMatch[0].length).trim();

  return { subjectFromBody, body };
}
